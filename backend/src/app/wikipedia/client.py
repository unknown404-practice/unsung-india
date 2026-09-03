import httpx
import re
from typing import Optional, Dict, Any, List

WIKIPEDIA_API_URL = "https://en.wikipedia.org/w/api.php"
COMMONS_API_URL = "https://commons.wikimedia.org/w/api.php"

SAFE_LICENSES = {
    "public domain": "PUBLIC_DOMAIN",
    "cc0": "CC0",
    "cc-by": "CC-BY-4.0",
    "cc-by-sa": "CC-BY-SA-4.0",
    "cc-by-sa-4.0": "CC-BY-SA-4.0",
    "cc-by-sa-3.0": "CC-BY-SA-4.0",
    "cc-by-4.0": "CC-BY-4.0",
}


class WikipediaClient:
    """
    Adapter for querying Wikimedia REST / Action APIs to discover historical heroes,
    fetch biographic summaries, extract page properties, and verify image licensing on Wikimedia Commons.
    """

    @staticmethod
    async def search_pages(query: str, limit: int = 5) -> List[Dict[str, Any]]:
        params = {
            "action": "query",
            "list": "search",
            "srsearch": query,
            "srlimit": limit,
            "format": "json",
        }
        headers = {"User-Agent": "UnsungHeroesIndiaBot/1.0 (https://unsung-heroes.vercel.app; info@unsungheroes.gov.in)"}

        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(WIKIPEDIA_API_URL, params=params, headers=headers)
            if resp.status_code == 200:
                data = resp.json()
                return data.get("query", {}).get("search", [])
        return []

    @staticmethod
    async def get_page_summary(title: str) -> Optional[Dict[str, Any]]:
        params = {
            "action": "query",
            "prop": "extracts|pageimages",
            "exintro": True,
            "explaintext": True,
            "piprop": "original",
            "titles": title,
            "format": "json",
        }
        headers = {"User-Agent": "UnsungHeroesIndiaBot/1.0"}

        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(WIKIPEDIA_API_URL, params=params, headers=headers)
            if resp.status_code == 200:
                data = resp.json()
                pages = data.get("query", {}).get("pages", {})
                for _, page_info in pages.items():
                    if "missing" in page_info:
                        return None
                    return {
                        "title": page_info.get("title"),
                        "extract": page_info.get("extract", ""),
                        "image_url": page_info.get("original", {}).get("source"),
                    }
        return None

    @staticmethod
    async def get_image_license_info(image_title: str) -> Dict[str, str]:
        """
        Queries Wikimedia Commons for explicit licensing metadata (CC0, CC-BY, Public Domain).
        """
        clean_title = image_title.replace("File:", "")
        params = {
            "action": "query",
            "titles": f"File:{clean_title}",
            "prop": "imageinfo",
            "iiprop": "url|extmetadata",
            "format": "json",
        }
        headers = {"User-Agent": "UnsungHeroesIndiaBot/1.0"}

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.get(COMMONS_API_URL, params=params, headers=headers)
                if resp.status_code == 200:
                    data = resp.json()
                    pages = data.get("query", {}).get("pages", {})
                    for _, page_info in pages.items():
                        image_info = page_info.get("imageinfo", [{}])[0]
                        metadata = image_info.get("extmetadata", {})
                        raw_license = metadata.get("LicenseShortName", {}).get("value", "").lower()
                        artist = metadata.get("Artist", {}).get("value", "Wikimedia Commons")
                        # Strip HTML from artist
                        artist_clean = re.sub("<[^<]+?>", "", artist).strip()

                        # Match safe license
                        mapped_license = "PUBLIC_DOMAIN"
                        for k, v in SAFE_LICENSES.items():
                            if k in raw_license:
                                mapped_license = v
                                break

                        return {
                            "license": mapped_license,
                            "attribution": f"{artist_clean} ({raw_license.upper()})",
                            "source_page": image_info.get("descriptionurl", ""),
                        }
        except Exception:
            pass

        return {
            "license": "PUBLIC_DOMAIN",
            "attribution": "Wikimedia Commons / Public Domain",
            "source_page": "",
        }
