import urllib.request
import json
import time
import sys

def benchmark_model(model_name: str):
    print(f"\n--- Testing Model: {model_name} ---")
    body = {
        'model': model_name,
        'prompt': 'Synthesize historical profile for Indian personality "Sarojini Naidu". Output JSON only adhering to schema: {"name":"Full Name","name_local":"Indic script","birth_year":1879,"death_year":1949,"state":"State","primary_domain":"Domain","tagline":"Memorable sentence","short_bio":"2-3 sentence biography","contributions":[{"display_order":1,"title":"Milestone 1","description":"Fact"}],"is_unsung_reason":"Significance"}',
        'stream': False,
        'format': 'json',
        'keep_alive': '24h',
        'options': {
            'num_ctx': 1024,
            'num_predict': 220,
            'temperature': 0.1,
            'top_k': 20,
            'top_p': 0.8,
            'num_thread': 8,
        }
    }

    t0 = time.time()
    try:
        req = urllib.request.Request(
            'http://127.0.0.1:11434/api/generate',
            data=json.dumps(body).encode('utf-8'),
            headers={'Content-Type': 'application/json'}
        )
        res = urllib.request.urlopen(req, timeout=15)
        data = json.loads(res.read().decode('utf-8'))
        dt = time.time() - t0
        eval_count = data.get('eval_count', 0)
        eval_duration = data.get('eval_duration', 1) / 1e9

        print(f"Total Latency: {dt:.2f}s")
        print(f"Tokens Generated: {eval_count}")
        if eval_duration > 0:
            print(f"Generation Speed: {eval_count/eval_duration:.1f} tokens/second")
        print(f"Synthesized JSON: {data.get('response')[:120]}...")
    except Exception as e:
        print(f"Model {model_name} test note: {e}")

if __name__ == '__main__':
    for m in ['qwen2.5:1.5b', 'qwen2.5:7b']:
        benchmark_model(m)

