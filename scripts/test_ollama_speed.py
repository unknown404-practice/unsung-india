import urllib.request
import json
import time

body = {
    'model': 'qwen2.5:14b',
    'prompt': 'Synthesize historical profile for Indian personality "Sarojini Naidu". Output JSON only adhering to schema: {"name":"Full Name","name_local":"Indic script","birth_year":1879,"death_year":1949,"state":"State","primary_domain":"Domain","tagline":"Memorable sentence","short_bio":"2-3 sentence biography","contributions":[{"display_order":1,"title":"Milestone 1","description":"Fact"}],"is_unsung_reason":"Significance"}',
    'stream': False,
    'format': 'json',
    'keep_alive': '24h',
    'options': {
        'num_ctx': 2048,
        'num_predict': 220,
        'temperature': 0.1,
        'top_k': 20,
        'top_p': 0.8
    }
}

t0 = time.time()
req = urllib.request.Request('http://127.0.0.1:11434/api/generate', data=json.dumps(body).encode('utf-8'), headers={'Content-Type': 'application/json'})
res = urllib.request.urlopen(req)
data = json.loads(res.read().decode('utf-8'))
dt = time.time() - t0
eval_count = data.get('eval_count', 0)
eval_duration = data.get('eval_duration', 1) / 1e9

print(f"Total Response Latency: {dt:.2f}s")
print(f"Tokens Generated: {eval_count}")
print(f"Token Generation Speed: {eval_count/eval_duration:.1f} tokens/second")
print("Synthesized JSON:", data.get('response'))
