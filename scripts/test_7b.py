import urllib.request
import json
import time

body = {
    'model': 'qwen2.5:7b',
    'prompt': 'Synthesize profile for "Sarojini Naidu". Output JSON only: {"name":"Sarojini Naidu","name_local":"सरोजिनी नायडू","birth_year":1879,"death_year":1949,"state":"Telangana","primary_domain":"Freedom Struggle","tagline":"Nightingale of India","short_bio":"Eminent freedom fighter and poet.","contributions":[{"display_order":1,"title":"INC President","description":"First Indian woman INC President."}]}',
    'stream': False,
    'format': 'json',
    'keep_alive': '24h',
    'options': {
        'num_ctx': 1024,
        'num_predict': 180,
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
print(f"7B Speed: {dt:.2f} seconds | Tokens: {eval_count}")
