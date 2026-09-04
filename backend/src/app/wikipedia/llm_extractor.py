import json
import logging
import re
from typing import Optional, Dict, Any, List
import httpx
from pydantic import BaseModel, Field

import os

logger = logging.getLogger("qwen_extractor")
logger.setLevel(logging.INFO)

OLLAMA_API_URL = os.getenv("OLLAMA_API_URL", "http://127.0.0.1:11434/api/generate")
DEFAULT_MODEL = os.getenv("DEFAULT_MODEL", "qwen2.5:14b")


class ExtractedPersonSchema(BaseModel):
    name: str = Field(description="Full recognized English name")
    name_local: List[str] = Field(default_factory=list, description="Names in native Indic scripts (Devanagari, Bengali, Tamil, etc.)")
    birth_year: Optional[int] = Field(None, description="4-digit birth year or null")
    death_year: Optional[int] = Field(None, description="4-digit death year or null")
    state: Optional[str] = Field(None, description="Indian state or historical region of primary activity")
    district: Optional[str] = Field(None, description="District or town if mentioned")
    domains: List[str] = Field(default_factory=list, description="Domains such as Freedom Struggle, Science & Tech, Medicine, Social Reform, Philosophy")
    tagline: str = Field(description="1 concise memorable sentence summarizing their national impact (under 120 characters)")
    short_bio: str = Field(description="Original, dignified 2-3 sentence biographical summary")
    contributions: List[str] = Field(default_factory=list, description="3 to 7 specific, fact-checked achievement bullets")
    timeline_events: List[Dict[str, Any]] = Field(default_factory=list, description="List of {year: int, event: str} objects")
    is_unsung_reason: Optional[str] = Field(None, description="Why this contribution was overlooked or deserves national remembrance")


QWEN_SYSTEM_PROMPT = """<|im_start|>system
You are an expert biographical data extraction engine for the "Unsung Heroes of India" Digital Public Infrastructure.
Your duty is to extract verified historical facts from the provided Wikipedia lead section and infobox text.

CRITICAL ANTI-HALLUCINATION RULES:
1. Strict Factual Accuracy: Extract ONLY facts explicitly stated in the input text. Do NOT invent dates, achievements, books, or relationships.
2. Missing Information: If any field is not explicitly present in the input text, set its value to `null` or an empty array `[]`. Do NOT guess or fabricate.
3. Clean JSON Output: Output MUST be valid, parseable JSON conforming strictly to the requested schema. Do NOT include markdown commentary, thinking tokens, or conversational filler outside the JSON.
<|im_end|>"""


def build_qwen_prompt(raw_wiki_text: str) -> str:
    return f"""{QWEN_SYSTEM_PROMPT}
<|im_start|>user
Extract structured biographical data from the following Wikipedia text into the required JSON schema:

[RAW WIKIPEDIA TEXT]
\"\"\"
{raw_wiki_text}
\"\"\"

[REQUIRED JSON SCHEMA]
{{
  "name": "Full Name",
  "name_local": ["Native Indic script name(s)"],
  "birth_year": null,
  "death_year": null,
  "state": "Indian State",
  "district": "District name or null",
  "domains": ["Primary Domain 1", "Domain 2"],
  "tagline": "1 concise sentence summarizing national impact (max 120 chars)",
  "short_bio": "Original 2-3 sentence factual narrative",
  "contributions": [
    "Specific achievement 1 with concrete historical details",
    "Specific achievement 2 with concrete historical details",
    "Specific achievement 3 with concrete historical details"
  ],
  "timeline_events": [
    {{"year": 1895, "event": "Significant life milestone"}}
  ],
  "is_unsung_reason": "Contextual reason why this contribution deserves greater national visibility"
}}
<|im_end|>
<|im_start|>assistant
"""


async def extract_person_details(
    raw_wiki_text: str,
    model: str = DEFAULT_MODEL,
    ollama_url: str = OLLAMA_API_URL,
    timeout_seconds: float = 180.0,
) -> Optional[Dict[str, Any]]:
    """
    Executes local inference with Qwen2.5-14B via Ollama.
    Designed for asynchronous background ingestion jobs.
    """
    prompt = build_qwen_prompt(raw_wiki_text)

    payload = {
        "model": model,
        "prompt": prompt,
        "stream": False,
        "format": "json",
        "options": {
            "temperature": 0.1,   # Ultra-low temperature for factual fidelity
            "top_p": 0.85,
            "num_ctx": 4096,      # Context window sized for full infobox + lead section
            "repeat_penalty": 1.1,
        },
    }

    try:
        custom_timeout = httpx.Timeout(None, connect=60.0)
        async with httpx.AsyncClient(timeout=custom_timeout) as client:
            response = await client.post(ollama_url, json=payload)
            response.raise_for_status()

            result = response.json()
            raw_response_text = result.get("response", "{}").strip()

            # Clean potential backtick code fences
            if raw_response_text.startswith("```json"):
                raw_response_text = raw_response_text[7:]
            if raw_response_text.startswith("```"):
                raw_response_text = raw_response_text[3:]
            if raw_response_text.endswith("```"):
                raw_response_text = raw_response_text[:-3]

            parsed_data = json.loads(raw_response_text.strip())

            # Validate against Pydantic schema
            validated = ExtractedPersonSchema(**parsed_data)
            return validated.model_dump()

    except httpx.ConnectError:
        logger.error(f"Cannot connect to Ollama at {ollama_url}. Ensure 'ollama serve' is running.")
        return None
    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse JSON output from Qwen: {e}")
        return None
    except Exception as e:
        import traceback
        traceback.print_exc()
        logger.error(f"Unexpected error in Qwen extraction: {e}")
        return None
