import urllib.request, json, sys

sys.stdout.reconfigure(encoding='utf-8')

states = ['andhra pradesh', 'karnataka', 'gujarat', 'bihar', 'uttar pradesh']

print('=== TESTING STATE HEROES DISCOVERY FOR ALL STATES ===\n')

for st in states:
    url = f'http://localhost:3000/api/qwen/state-heroes?state={urllib.parse.quote(st)}'
    try:
        res = urllib.request.urlopen(url)
        data = json.loads(res.read().decode('utf-8'))
        heroes = data.get('heroes', [])
        print(f'[{st.upper()}]: {len(heroes)} HEROES DISCOVERED')
        for h in heroes[:4]:
            print(f"  * {h.get('name')} -> {h.get('primary_domain')}")
        print('-'*50)
    except Exception as e:
        print(f'[{st.upper()}] ERROR: {e}')
