import urllib.request
import json
import time

test_slugs = [
    'alluri-sitarama-raju',
    'pazhassi-raja',
    'bhikaiji-cama',
    'rani-gaidinliu',
    'khudiram-bose',
    'u-tirot-sing',
    'prafulla-chandra-ray',
    'srinivasa-ramanujan',
    'c-v-raman',
    'sarojini-naidu',
    'ishwar-chandra-vidyasagar',
    'raja-ram-mohan-roy',
    'baba-amte',
    'verghese-kurien',
    'vikram-sarabhai'
]

print("=== BATTERY TEST: VIEWING DETAILS FOR 15 RANDOM NATIONAL CONTRIBUTORS ===")
all_ok = True
for slug in test_slugs:
    url = f"http://localhost:3000/heroes/{slug}"
    t0 = time.time()
    try:
        res = urllib.request.urlopen(url)
        dt = time.time() - t0
        print(f"[200 OK] /heroes/{slug} ({dt:.2f}s)")
    except Exception as e:
        all_ok = False
        print(f"[FAIL] /heroes/{slug} -> {e}")

print(f"\nALL 15 RANDOM NATIONAL CONTRIBUTORS RESOLVED 100%: {all_ok}")
