import urllib.request
import urllib.parse
import json
import re

# Comprehensive dictionary of verified Wikipedia titles & image search queries for catalog heroes
HERO_WIKI_MAP = {
    'subhas-chandra-bose': 'Subhas Chandra Bose',
    'mahatma-gandhi': 'Mahatma Gandhi',
    'bhagat-singh': 'Bhagat Singh',
    'apj-abdul-kalam': 'A. P. J. Abdul Kalam',
    'sushruta': 'Sushruta',
    'aryabhata': 'Aryabhata',
    'gargi-vachaknavi': 'Gargi Vachaknavi',
    'rani-abbakka': 'Abbakka Chowta',
    'lachit-borphukan': 'Lachit Borphukan',
    'rani-velu-nachiyar': 'Velu Nachiyar',
    'matangini-hazra': 'Matangini Hazra',
    'birsa-munda': 'Birsa Munda',
    'kanaklata-barua': 'Kanaklata Barua',
    'komaram-bheem': 'Komaram Bheem',
    'batukeshwar-dutt': 'Batukeshwar Dutt',
    'janaki-ammal': 'E. K. Janaki Ammal',
    'savitribai-phule': 'Savitribai Phule',
    'sambhu-nath-de': 'Sambhu Nath De'
}

def get_verified_image(title_or_query):
    # 1. Direct Wikipedia Query with Redirects
    try:
        url = f"https://en.wikipedia.org/w/api.php?action=query&titles={urllib.parse.quote(title_or_query)}&redirects=1&prop=pageimages|images|info&piprop=original|thumbnail&pithumbsize=1000&inprop=url&format=json"
        req = urllib.request.Request(url, headers={'User-Agent': 'UnsungIndiaDPI/1.0 (contact@unsung-heroes.gov.in)'})
        res = urllib.request.urlopen(req)
        data = json.loads(res.read().decode('utf-8'))
        pages = data.get('query', {}).get('pages', {})
        for pid, p in pages.items():
            if pid != '-1':
                img = p.get('original', {}).get('source') or p.get('thumbnail', {}).get('source')
                if img:
                    # Strip ?utm_source...
                    return img.split('?')[0]
    except Exception as e:
        print(f"Error checking {title_or_query}: {e}")

    # 2. Generator search
    try:
        url = f"https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(title_or_query)}&gsrlimit=3&prop=pageimages&piprop=original|thumbnail&pithumbsize=1000&format=json"
        req = urllib.request.Request(url, headers={'User-Agent': 'UnsungIndiaDPI/1.0'})
        res = urllib.request.urlopen(req)
        data = json.loads(res.read().decode('utf-8'))
        pages = data.get('query', {}).get('pages', {})
        for pid, p in pages.items():
            img = p.get('original', {}).get('source') or p.get('thumbnail', {}).get('source')
            if img:
                return img.split('?')[0]
    except Exception as e:
        pass

    return None

print("=== VERIFYING & FETCHING ALL 18 CATALOG HERO IMAGES ===")
verified_images = {}
for hero_id, query in HERO_WIKI_MAP.items():
    img_url = get_verified_image(query)
    verified_images[hero_id] = img_url
    print(f"[{'OK' if img_url else 'FAIL'}] {hero_id} ({query}) -> {img_url}")

with open('scripts/verified_images.json', 'w', encoding='utf-8') as f:
    json.dump(verified_images, f, indent=2)
