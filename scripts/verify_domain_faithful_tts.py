import urllib.request, json, sys

sys.stdout.reconfigure(encoding='utf-8')

test_cases = [
    {
        'label': 'MUSICIAN (M. S. Subbulakshmi in Tamil)',
        'hero': {'name': 'M. S. Subbulakshmi', 'name_local': 'எம். எஸ். சுப்புலட்சுமி', 'state': 'Tamil Nadu', 'primary_domain': 'Carnatic Classical Vocalist & Musician', 'short_bio': 'She was an Indian Carnatic singer from Madurai, Tamil Nadu. She was the first musician to be awarded the Bharat Ratna.', 'tagline': 'Music is the divine prayer of the soul.'},
        'lang': 'ta'
    },
    {
        'label': 'MUSICIAN (Ustad Bismillah Khan in Hindi)',
        'hero': {'name': 'Ustad Bismillah Khan', 'name_local': 'उस्ताद बिस्मिल्लाह ख़ान', 'state': 'Uttar Pradesh', 'primary_domain': 'Shehnai Maestro & Classical Music', 'short_bio': 'He was an Indian musician credited with popularizing the shehnai as a concert instrument.', 'tagline': 'Music knows no religion.'},
        'lang': 'hi'
    },
    {
        'label': 'SCIENTIST (C. V. Raman in Bengali)',
        'hero': {'name': 'C. V. Raman', 'name_local': 'সি. ভি. রমন', 'state': 'Tamil Nadu', 'primary_domain': 'Physics & Nobel Laureate', 'short_bio': 'Indian physicist who discovered the Raman Effect.', 'tagline': 'Science is a boundless voyage of discovery.'},
        'lang': 'bn'
    },
    {
        'label': 'MATHEMATICIAN (Srinivasa Ramanujan in Kannada)',
        'hero': {'name': 'Srinivasa Ramanujan', 'state': 'Tamil Nadu', 'primary_domain': 'Mathematics & Infinite Series', 'short_bio': 'Indian mathematician who made extraordinary contributions to mathematical analysis and number theory.', 'tagline': 'An equation means nothing to me unless it expresses a thought of God.'},
        'lang': 'kn'
    },
    {
        'label': 'FREEDOM FIGHTER (Subhas Chandra Bose in Bengali)',
        'hero': {'name': 'Netaji Subhas Chandra Bose', 'name_local': 'নেতাজি সুভাষচন্দ্র বসু', 'state': 'West Bengal', 'primary_domain': 'Freedom Struggle & Azad Hind Fauj', 'short_bio': 'Revolutionary leader of the Indian independence movement.', 'tagline': 'Give me blood, and I shall give you freedom!'},
        'lang': 'bn'
    }
]

print('=== DOMAIN-FAITHFUL ORAL NARRATION VERIFICATION ===\n')
for tc in test_cases:
    req = urllib.request.Request('http://localhost:3000/api/tts', data=json.dumps({'hero': tc['hero'], 'lang': tc['lang']}).encode('utf-8'), headers={'Content-Type': 'application/json'})
    res = urllib.request.urlopen(req)
    data = json.loads(res.read().decode('utf-8'))
    print('[' + tc['label'] + ']:')
    print(data.get('spokenText'))
    print('-'*70 + '\n')
