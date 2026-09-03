import asyncio
import os
import sys
import json

# Ensure backend/src is on the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend", "src")))

from app.wikipedia.llm_extractor import extract_person_details
from app.wikipedia.client import WikipediaClient

SAMPLE_WIKI_TARGETS = [
    "Mahendra Lal Sircar",
    "Kushiram Bose",
    "Akkamma Cherian",
    "Alluri Sitarama Raju",
]

SAMPLE_RAW_TEXT_MAHENDRA = """
Dr. Mahendra Lal Sircar CIE (2 November 1833 – 23 February 1904) was an Indian medical doctor, the founder of the Indian Association for the Cultivation of Science (IACS) in Calcutta, Bengal Presidency.
Born in Paikpara village in Hooghly district, Bengal, he graduated from Calcutta Medical College in 1863 with highest honours. Sircar was an active promoter of scientific education and national self-reliance in science. In 1876, he founded the IACS, the first indigenous scientific research institute in Asia, which later provided the laboratory where C. V. Raman conducted his Nobel Prize-winning research on the Raman Effect (1928). Sircar was also a member of the Bengal Legislative Council and a fellow of Calcutta University.
"""


async def run_qwen_enrichment():
    print("=================================================================")
    print("  Unsung India Search — Background LLM Enrichment (Qwen2.5-14B)  ")
    print("=================================================================\n")

    print("[1/2] Testing Local Qwen2.5-14B with Sample Text (Dr. Mahendra Lal Sircar)...")
    result = await extract_person_details(SAMPLE_RAW_TEXT_MAHENDRA)

    if result:
        print("\nSUCCESS! Extracted Structured JSON from Local Qwen 2.5 14B:\n")
        print(json.dumps(result, indent=2, ensure_ascii=False))
    else:
        print("\nCould not connect to Ollama on http://localhost:11434.")
        print("Tip: Make sure Ollama is running in the background ('ollama serve').")

    print("\n[2/2] Ingestion workflow ready for automated background execution.")


if __name__ == "__main__":
    asyncio.run(run_qwen_enrichment())
