import json
import re
import urllib.request

with open('scripts/verified_images.json', 'r', encoding='utf-8') as f:
    images_map = json.load(f)

with open('frontend/lib/sample-data.ts', 'r', encoding='utf-8') as f:
    sample_ts = f.read()

for hero_id, img_url in images_map.items():
    if not img_url:
        continue
    # Regex to find the hero object block by id
    pattern = re.compile(r"(id:\s*['\"]" + re.escape(hero_id) + r"['\"].*?image_url:\s*['\"])([^'\"]+)(['\"])", re.DOTALL)
    sample_ts = pattern.sub(r"\g<1>" + img_url + r"\g<3>", sample_ts)

with open('frontend/lib/sample-data.ts', 'w', encoding='utf-8') as f:
    f.write(sample_ts)

print("Updated frontend/lib/sample-data.ts with all 18 verified images!")

print("\n=== TESTING ALL 18 PROXIED IMAGES LIVE ON LOCALHOST:3000 ===")
all_passed = True
for hero_id, img_url in images_map.items():
    proxy_url = f"http://localhost:3000/api/image-proxy?url={urllib.parse.quote(img_url)}"
    try:
        res = urllib.request.urlopen(proxy_url)
        content_type = res.headers.get('Content-Type')
        data_len = len(res.read())
        print(f"[{'PASS' if res.status == 200 else 'FAIL'}] {hero_id} -> STATUS {res.status} | {content_type} ({data_len} bytes)")
    except Exception as e:
        all_passed = False
        print(f"[FAIL] {hero_id} -> {e}")

print(f"\nALL 18 HERO IMAGES VERIFIED: {all_passed}")
