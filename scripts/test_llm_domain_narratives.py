import urllib.request, json, sys

sys.stdout.reconfigure(encoding='utf-8')

def test_qwen_narrative(name, domain, bio, lang_name):
    prompt = f'''You are a respectful oral history documentary narrator. Read the factual biography of Indian figure "{name}" (Domain: {domain}):
"{bio}"

Write a pure, factual, inspiring 4-5 sentence oral narrative in 100% pure {lang_name} script.
CRITICAL RULES:
- Focus STRICTLY on their actual domain ({domain}).
- If they are a musician/artist, speak ONLY about their music, art, and melodies.
- If they are a scientist/mathematician, speak ONLY about their research, discoveries, and science.
- If they are a doctor/surgeon, speak ONLY about medicine and healing.
- Do NOT mention freedom struggle or armed rebellion unless they were actually freedom fighters.
- Output pure {lang_name} text only, no English words, no bullet points, no markdown:'''

    req = urllib.request.Request('http://127.0.0.1:11434/api/generate', data=json.dumps({
        'model': 'qwen2.5:7b',
        'prompt': prompt,
        'stream': False,
        'keep_alive': '24h',
        'options': {'num_predict': 200, 'temperature': 0.2}
    }).encode('utf-8'), headers={'Content-Type': 'application/json'})

    try:
        res = urllib.request.urlopen(req, timeout=30)
        data = json.loads(res.read().decode('utf-8'))
        return data.get('response', '').strip()
    except Exception as e:
        return f'ERROR: {e}'

print('=== 1. MUSICIAN (BISMILLAH KHAN) IN HINDI ===')
print(test_qwen_narrative('Ustad Bismillah Khan', 'Shehnai & Classical Indian Music', 'Ustad Bismillah Khan was a legendary Indian musician credited with popularizing the shehnai as a concert instrument and won the Bharat Ratna.', 'Hindi (हिंदी)'))

print('\n=== 2. SCIENTIST (C.V. RAMAN) IN BENGALI ===')
print(test_qwen_narrative('C. V. Raman', 'Physics & Nobel Laureate', 'Sir Chandrasekhara Venkata Raman was an Indian physicist known for his work in the field of light scattering, which won the Nobel Prize in Physics in 1930.', 'Bengali (বাংলা)'))

print('\n=== 3. MATHEMATICIAN (RAMANUJAN) IN TAMIL ===')
print(test_qwen_narrative('Srinivasa Ramanujan', 'Mathematics & Number Theory', 'Srinivasa Ramanujan was an Indian mathematician whose contributions to mathematical analysis, number theory, infinite series, and continued fractions revolutionized modern mathematics.', 'Tamil (தமிழ்)'))
