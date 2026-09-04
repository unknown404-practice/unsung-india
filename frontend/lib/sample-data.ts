import { Hero } from './types';

export const SAMPLE_HEROES: Hero[] = [
  // ==========================================
  // 0. SUPREME ICONS OF FREEDOM & NATION BUILDING
  // ==========================================
  {
    id: 'subhas-chandra-bose',
    slug: 'subhas-chandra-bose',
    name: 'Netaji Subhas Chandra Bose',
    name_local: 'নেতাজি সুভাষচন্দ্র বসু',
    name_local_lang: 'bn',
    birth_year: 1897,
    death_year: 1945,
    era: 'Azad Hind Fauj & INA War (1942-1945)',
    state: 'Odisha / West Bengal',
    district: 'Cuttack / Kolkata',
    primary_domain: 'Freedom Struggle & Military',
    tagline: 'The Supreme Commander of the Indian National Army (Azad Hind Fauj) who coined "Jai Hind" and "Give me blood, and I shall give you freedom".',
    short_bio: 'Netaji Subhas Chandra Bose was an Indian nationalist and revolutionary leader whose defiant patriotism made him an immortal national hero. He revived and led the Indian National Army (Azad Hind Fauj) in 1943, establishing the Provisional Government of Free India (Arzi Hukumat-e-Azad Hind) and leading the military campaign against British colonial forces to liberate India by force of arms.',
    is_unsung_reason: 'His military campaign with the INA and the subsequent Red Fort trials catalyzed the 1946 Royal Indian Navy Revolt, making British continued occupation impossible.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Subhas_Chandra_Bose_NRB.jpg',
    image_license: 'PUBLIC_DOMAIN',
    image_attribution: 'Public Domain (Official Government Portrait)',
    image_source_page_url: 'https://commons.wikimedia.org/wiki/File:Subhas_Chandra_Bose_NRB.jpg',
    view_count: 5600,
    banner_download_count: 1420,
    contributions: [
      { display_order: 1, title: 'Supreme Commander of Azad Hind Fauj (INA)', description: 'Mobilized over 60,000 soldiers including the pioneering all-female Rani of Jhansi Regiment to liberate India.' },
      { display_order: 2, title: 'Provisional Government of Free India (1943)', description: 'Formed the Arzi Hukumat-e-Azad Hind, recognized by nine sovereign nations, with its own national bank and currency.' },
      { display_order: 3, title: 'National Slogans "Jai Hind" & "Delhi Chalo"', description: 'Coined India’s universal national salutation "Jai Hind" and galvanized the nation with revolutionary fervor.' }
    ],
    timeline_events: [
      { event_year: 1897, event_date: '23 January 1897', title: 'Birth in Cuttack', description: 'Born in Cuttack, Odisha.', display_order: 1 },
      { event_year: 1943, event_date: '21 October 1943', title: 'Proclamation of Free India in Singapore', description: 'Established the Provisional Government of Azad Hind.', display_order: 2 }
    ],
    sources: [
      { title: 'National Archives of India: Azad Hind Fauj (INA) Papers', source_type: 'GOVERNMENT_ARCHIVE', url: 'https://www.abhilekhpatal.in', is_primary_reference: true },
      { title: 'PIB: Netaji Subhas Chandra Bose and Parakram Diwas', source_type: 'GOVERNMENT_PORTAL', url: 'https://pib.gov.in', is_primary_reference: true }
    ]
  },
  {
    id: 'mahatma-gandhi',
    slug: 'mahatma-gandhi',
    name: 'Mahatma Gandhi (Mohandas Karamchand Gandhi)',
    name_local: 'મોહનદાસ કરમચંદ ગાંધી',
    name_local_lang: 'gu',
    birth_year: 1869,
    death_year: 1948,
    era: 'Nationalist Movement (1915-1947)',
    state: 'Gujarat',
    district: 'Porbandar',
    primary_domain: 'Freedom Struggle & Social Reform',
    tagline: 'The Father of the Nation who pioneered Non-Violent Resistance (Satyagraha) and led India to independence.',
    short_bio: 'Mohandas Karamchand Gandhi was an Indian lawyer, anti-colonial nationalist, and political ethicist who employed nonviolent resistance to lead the successful campaign for India’s independence from British rule, inspiring movements for civil rights and freedom across the world.',
    is_unsung_reason: 'His grassroots mass mobilizations (Non-Cooperation, Dandi Salt March, Quit India) transformed the freedom movement into a nationwide peoples revolution.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Mahatma-Gandhi%2C_studio%2C_1931.jpg',
    image_license: 'PUBLIC_DOMAIN',
    image_attribution: 'Public Domain (1931 Studio Portrait)',
    image_source_page_url: 'https://commons.wikimedia.org/wiki/File:Mahatma-Gandhi,_studio,_1931.jpg',
    view_count: 6200,
    banner_download_count: 1580,
    contributions: [
      { display_order: 1, title: 'Philosophy of Satyagraha & Ahimsa', description: 'Pioneered principled non-violent mass civil disobedience as the primary weapon against colonial imperialism.' },
      { display_order: 2, title: 'The Historic Salt March (1930)', description: 'Led the 240-mile march to Dandi breaking the British salt tax monopoly and electrifying the nation.' },
      { display_order: 3, title: 'Quit India Movement (1942)', description: 'Launched the decisive Quit India campaign demanding immediate British withdrawal with the mantra "Do or Die".' }
    ],
    timeline_events: [
      { event_year: 1869, event_date: '2 October 1869', title: 'Birth in Porbandar', description: 'Born in Porbandar, Gujarat.', display_order: 1 },
      { event_year: 1930, event_date: '12 March 1930', title: 'Dandi March', description: 'Initiated the Civil Disobedience Movement.', display_order: 2 }
    ],
    sources: [
      { title: 'National Archives of India: Mahatma Gandhi Papers', source_type: 'GOVERNMENT_ARCHIVE', url: 'https://www.abhilekhpatal.in', is_primary_reference: true }
    ]
  },
  {
    id: 'bhagat-singh',
    slug: 'bhagat-singh',
    name: 'Shaheed Bhagat Singh',
    name_local: 'ਭਗਤ ਸਿੰਘ',
    name_local_lang: 'pa',
    birth_year: 1907,
    death_year: 1931,
    era: 'Revolutionary Movement (1920s-1930s)',
    state: 'Punjab',
    district: 'Banga, Lyallpur',
    primary_domain: 'Freedom Struggle',
    tagline: 'The charismatic revolutionary whose fearless martyrdom at age 23 immortalized the slogan "Inquilab Zindabad".',
    short_bio: 'Bhagat Singh was a charismatic Indian revolutionary socialist whose fearless actions against colonial authorities and execution at age 23 made him an immortal folk hero of the Indian independence movement.',
    is_unsung_reason: 'His intellectual writings on secularism, youth empowerment, and social justice are among the most profound philosophical texts of the freedom era.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Lahore_conspiracy_case_poster_9th_Oct_193o_jindal_sunam_12x9_copy_%28cropped%29.jpg',
    image_license: 'PUBLIC_DOMAIN',
    image_attribution: 'Public Domain (1929 photograph)',
    image_source_page_url: 'https://commons.wikimedia.org/wiki/File:Bhagat_Singh_1929.jpg',
    view_count: 5900,
    banner_download_count: 1490,
    contributions: [
      { display_order: 1, title: 'Hindustan Socialist Republican Association (HSRA)', description: 'Transformed the revolutionary movement towards a socialist, secular vision for independent India.' },
      { display_order: 2, title: 'Central Assembly Bomb Protest (1929)', description: 'Courted arrest intentionally to voice revolutionary anti-colonial philosophy during court trials.' }
    ],
    timeline_events: [
      { event_year: 1907, event_date: '28 September 1907', title: 'Birth in Banga', description: 'Born in Banga village, Punjab.', display_order: 1 },
      { event_year: 1931, event_date: '23 March 1931', title: 'Martyrdom at Lahore Jail', description: 'Martyred alongside Rajguru and Sukhdev.', display_order: 2 }
    ],
    sources: [
      { title: 'National Archives of India: Lahore Conspiracy Case Trial Records', source_type: 'GOVERNMENT_ARCHIVE', url: 'https://www.abhilekhpatal.in', is_primary_reference: true }
    ]
  },
  {
    id: 'apj-abdul-kalam',
    slug: 'apj-abdul-kalam',
    name: 'Dr. A. P. J. Abdul Kalam',
    name_local: 'அ. ப. ஜெ. அப்துல் கலாம்',
    name_local_lang: 'ta',
    birth_year: 1931,
    death_year: 2015,
    era: 'Modern Science & Nation Building',
    state: 'Tamil Nadu',
    district: 'Rameswaram',
    primary_domain: 'Science & Tech',
    tagline: 'The "Missile Man of India" and 11th President who spearheaded India’s civilian space program and missile defense systems.',
    short_bio: 'Avul Pakir Jainulabdeen Abdul Kalam was an Indian aerospace scientist and statesman who served as the 11th President of India from 2002 to 2007. He spent four decades at DRDO and ISRO developing India’s civilian space program (SLV-III) and strategic missile development efforts (Agni and Prithvi).',
    is_unsung_reason: 'A towering symbol of indigenous scientific self-reliance and lifelong inspiration for millions of Indian youth.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/A._P._J._Abdul_Kalam.jpg',
    image_license: 'CC-BY-SA-2.0',
    image_attribution: 'Wikimedia Commons (CC-BY-SA 2.0, Government of India)',
    image_source_page_url: 'https://commons.wikimedia.org/wiki/File:A._P._J._Abdul_Kalam.jpg',
    view_count: 5100,
    banner_download_count: 1200,
    contributions: [
      { display_order: 1, title: 'Architect of India’s Missile Systems (IGMDP)', description: 'Spearheaded the development of operational strategic missiles including Agni and Prithvi.' },
      { display_order: 2, title: 'SLV-III Satellite Launch Vehicle', description: 'Project Director for India’s first indigenous Satellite Launch Vehicle placing Rohini satellite in orbit (1980).' }
    ],
    timeline_events: [
      { event_year: 1931, event_date: '15 October 1931', title: 'Birth in Rameswaram', description: 'Born in Rameswaram, Tamil Nadu.', display_order: 1 },
      { event_year: 2002, event_date: '2002', title: 'Elected 11th President of India', description: 'Served as the People’s President of India.', display_order: 2 }
    ],
    sources: [
      { title: 'PIB: Dr. APJ Abdul Kalam Science Legacy', source_type: 'GOVERNMENT_PORTAL', url: 'https://pib.gov.in', is_primary_reference: true }
    ]
  },
  // ==========================================
  // 1. ANCIENT PIONEERS OF SCIENCE & PHILOSOPHY
  // ==========================================
  {
    id: 'sushruta',
    slug: 'sushruta',
    name: 'Maharshi Sushruta',
    name_local: 'महर्षि सुश्रुत',
    name_local_lang: 'sa',
    era: 'Ancient India (circa 6th Century BCE)',
    state: 'Varanasi, Uttar Pradesh',
    primary_domain: 'Medicine & Surgery',
    tagline: 'The founding father of surgery and plastic surgery who authored the foundational medical treatise Sushruta Samhita.',
    short_bio: 'Sushruta was an ancient Indian physician and surgeon regarded globally as the "Father of Surgery" and "Father of Plastic Surgery". Practicing in ancient Varanasi, his seminal treatise, the Sushruta Samhita, systematically documented rhinoplasty (nasal reconstruction), cataract surgery, caesarean sections, over 120 surgical instruments, and 300 operative procedures millennia before modern Western surgery.',
    is_unsung_reason: 'Despite pioneering surgical techniques still conceptually used worldwide today, his monumental foundational role in global medicine is under-recognized in global scientific education.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/3/35/Susruta._Pen_drawing._Wellcome_V0006619.jpg',
    image_license: 'CC-BY-SA-4.0',
    image_attribution: 'Wikimedia Commons / Wellcome Collection',
    image_source_page_url: 'https://commons.wikimedia.org/wiki/File:Susruta._Pen_drawing._Wellcome_V0006619.jpg',
    view_count: 3420,
    banner_download_count: 850,
    contributions: [
      { display_order: 1, title: 'Invention of Rhinoplasty (Plastic Surgery)', description: 'First surgeon in recorded history to invent the forehead flap method for nasal reconstruction.' },
      { display_order: 2, title: 'Sushruta Samhita Treatise', description: 'Authored the ancient medical compendium categorizing 1,120 illnesses, 700 medicinal plants, and 121 surgical instruments.' },
      { display_order: 3, title: 'Pioneered Cataract Surgery', description: 'Documented the couch technique for cataract removal performed using specialized curved surgical needles.' }
    ],
    timeline_events: [
      { event_year: -600, event_date: 'circa 600 BCE', title: 'Medical School at Kashi', description: 'Taught surgical and anatomical dissection to pupils on the banks of the Ganges in Varanasi.', display_order: 1 },
      { event_year: -500, event_date: 'circa 500 BCE', title: 'Compilation of Sushruta Samhita', description: 'Formalized surgical methods into 184 chapters.', display_order: 2 }
    ],
    sources: [
      { title: 'Indian Culture Portal: Ancient Indian Medicine and Surgery', source_type: 'GOVERNMENT_PORTAL', url: 'https://www.indianculture.gov.in', is_primary_reference: true },
      { title: 'CSIR Science Reporter: Pioneers of Ancient Indian Science', source_type: 'ACADEMIC_PUBLICATION', url: 'https://sciencereporter.niscpr.res.in', is_primary_reference: false }
    ]
  },
  {
    id: 'aryabhata',
    slug: 'aryabhata',
    name: 'Aryabhata',
    name_local: 'आर्यभट',
    name_local_lang: 'sa',
    birth_year: 476,
    death_year: 550,
    era: 'Gupta Classical Era (5th Century CE)',
    state: 'Pataliputra (Bihar)',
    primary_domain: 'Science & Mathematics',
    tagline: 'The genius astronomer and mathematician who calculated Pi to four decimal places, formulated trigonometry, and proved Earth’s axial rotation.',
    short_bio: 'Aryabhata was the first of the major mathematician-astronomers from the classical age of Indian mathematics and astronomy. Working at Nalanda/Pataliputra, he authored the landmark Aryabhatiya at age 23, defining place value notation, zero concepts, accurate approximation of Pi (3.1416), sine tables, and the revolutionary discovery that Earth rotates on its own axis causing day and night.',
    is_unsung_reason: 'While honored in Indian scientific circles (inspiring India’s first satellite), his foundational contributions to universal mathematics and planetary motion are frequently neglected in world history narratives.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Aryabhatta_of_Bihar.jpg',
    image_license: 'CC-BY-SA-4.0',
    image_attribution: 'Wikimedia Commons / Public Knowledge Graph',
    image_source_page_url: 'https://commons.wikimedia.org/wiki/File:Aryabhatta_of_Bihar.jpg',
    view_count: 4100,
    banner_download_count: 920,
    contributions: [
      { display_order: 1, title: 'Axial Rotation of Earth & Solar System', description: 'Stated that the diurnal motion of celestial bodies is due to Earth’s axial rotation from west to east.' },
      { display_order: 2, title: 'Approximation of Pi (π)', description: 'Calculated π to be 3.1416 and explicitly stated that the value is incommensurable (irrational).' },
      { display_order: 3, title: 'Invention of Sine & Cosine Trigonometry', description: 'Formulated the first sine (jya) and versine (utkrama-jya) tables in mathematical history.' }
    ],
    timeline_events: [
      { event_year: 476, event_date: '476 CE', title: 'Birth in Ashmaka/Pataliputra', description: 'Born during the Golden Age of the Gupta Empire.', display_order: 1 },
      { event_year: 499, event_date: '499 CE', title: 'Composition of Aryabhatiya', description: 'Composed his masterwork in mathematical astronomy at age 23.', display_order: 2 }
    ],
    sources: [
      { title: 'Indian Culture Portal: Mathematics and Astronomy Heritage', source_type: 'GOVERNMENT_PORTAL', url: 'https://www.indianculture.gov.in', is_primary_reference: true }
    ]
  },
  {
    id: 'gargi-vachaknavi',
    slug: 'gargi-vachaknavi',
    name: 'Gargi Vachaknavi',
    name_local: 'गार्गी वाचक्नवी',
    name_local_lang: 'sa',
    era: 'Vedic Era (circa 7th Century BCE)',
    state: 'Mithila, Bihar',
    primary_domain: 'Philosophy & Education',
    tagline: 'The ancient Vedic natural philosopher and scholar who challenged sage Yajnavalkya in the royal debate of King Janaka.',
    short_bio: 'Gargi Vachaknavi was an ancient Indian philosopher and brahmavadini. In Vedic literature, she is celebrated as a leading natural philosopher who boldly challenged sage Yajnavalkya with complex metaphysical questions regarding the nature of the cosmos and the fabric of reality in the royal philosophical assembly of King Janaka of Videha.',
    is_unsung_reason: 'Her pivotal intellectual stature as a pioneering woman philosopher in ancient global thought is rarely featured in contemporary discussions of philosophy.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Gargi_Vachaknavi.jpg',
    image_license: 'PUBLIC_DOMAIN',
    image_attribution: 'Public Domain (Historical depiction, 19th Century archival illustration)',
    image_source_page_url: 'https://commons.wikimedia.org/wiki/File:Gargi_and_Yajnavalkya.jpg',
    view_count: 2100,
    banner_download_count: 450,
    contributions: [
      { display_order: 1, title: 'The Great Debate of Mithila', description: 'Interrogated sage Yajnavalkya on the fundamental constituent layers of the universe in the Brihadaranyaka Upanishad.' },
      { display_order: 2, title: 'Brahmavadini Intellectual Leadership', description: 'Authored hymns in the Rigveda and stood as a beacon of high educational equality in ancient India.' }
    ],
    timeline_events: [
      { event_year: -700, event_date: 'circa 700 BCE', title: 'Philosophical Congress of Janaka', description: 'Participated in the grand philosophical conclave in Mithila.', display_order: 1 }
    ],
    sources: [
      { title: 'Indian Culture Portal: Women Philosophers in Vedic India', source_type: 'GOVERNMENT_PORTAL', url: 'https://www.indianculture.gov.in', is_primary_reference: true }
    ]
  },

  // ==========================================
  // 2. MEDIEVAL & EARLY ANTI-COLONIAL HEROES
  // ==========================================
  {
    id: 'rani-abbakka',
    slug: 'rani-abbakka',
    name: 'Rani Abbakka Chowta (Abbakka Mahadevi)',
    name_local: 'ರಾಣಿ ಅಬ್ಬಕ್ಕ ಚೌಟ',
    name_local_lang: 'kn',
    birth_year: 1525,
    death_year: 1570,
    era: '16th Century Anti-Colonial Resistance',
    state: 'Ullal, Karnataka',
    primary_domain: 'Freedom Struggle',
    tagline: 'The fearless queen of Ullal who defeated the Portuguese naval armada six times over four decades.',
    short_bio: 'Rani Abbakka Chowta was the Queen of Ullal who fought the Portuguese for over four decades in the 16th century. Belonging to the Chowta dynasty, she commanded an army comprising all castes and religions (including Beary Muslim naval archers), repulsing multiple Portuguese naval invasions and earned the title "Abhaya Rani" (The Fearless Queen).',
    is_unsung_reason: 'Her legendary naval victories over European colonial forces took place nearly 300 years before 1857, yet are rarely documented in national school history books.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Abbakka_Chowta_2023_stamp_of_India.jpg',
    image_license: 'PUBLIC_DOMAIN',
    image_attribution: 'Public Domain (India Post Commemorative Stamp, 2003)',
    image_source_page_url: 'https://commons.wikimedia.org/wiki/File:Rani_Abbakka_2003_stamp_of_India.jpg',
    view_count: 2890,
    banner_download_count: 670,
    contributions: [
      { display_order: 1, title: 'Defeat of Portuguese Armada (1555-1568)', description: 'Repulsed successive Portuguese naval attacks commanded by Admiral Don Alvaro da Silveira and General Joao Peixoto.' },
      { display_order: 2, title: 'Cross-Community Naval Defense', description: 'Formed an elite coastal fighting force uniting Hindu and Muslim seafarers to protect sovereignty of Ullal port.' }
    ],
    timeline_events: [
      { event_year: 1525, event_date: '1525', title: 'Coronation as Queen of Ullal', description: 'Trained in military strategy, archery, and naval defense.', display_order: 1 },
      { event_year: 1568, event_date: '1568', title: 'Night Attack on Portuguese Fleet', description: 'Led 200 elite soldiers in a stealth night raid, killing the Portuguese commander.', display_order: 2 }
    ],
    sources: [
      { title: 'PIB: Remembering Rani Abbakka — The Fearless Queen of Ullal', source_type: 'GOVERNMENT_PORTAL', url: 'https://pib.gov.in', is_primary_reference: true }
    ]
  },
  {
    id: 'lachit-borphukan',
    slug: 'lachit-borphukan',
    name: 'Lachit Borphukan',
    name_local: 'লাচিত বৰফুকন',
    name_local_lang: 'as',
    birth_year: 1622,
    death_year: 1672,
    era: 'Battle of Saraighat (1671)',
    state: 'Assam',
    primary_domain: 'Freedom Struggle',
    tagline: 'The legendary Ahom general who defeated the massive Mughal imperial army in the naval Battle of Saraighat on the Brahmaputra.',
    short_bio: 'Lachit Borphukan was a legendary general of the Ahom Kingdom in Assam. In the historic 1671 Battle of Saraighat, despite being severely ill, he rallied his naval forces on the Brahmaputra river, used brilliant riverine warfare and amphibious tactics, and decisively routed the numerically superior Mughal forces led by Raja Ram Singh.',
    is_unsung_reason: 'A defining military victory that protected the entire North-Eastern frontier of India from imperial conquest, yet remained confined to regional Assamese memory for centuries.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Status_of_lachit_borphhukon_and_ahom_sibsagar_%28cropped%29.jpg',
    image_license: 'CC-BY-SA-4.0',
    image_attribution: 'Wikimedia Commons (CC-BY-SA 4.0, Statue at Machkhowa Guwahati)',
    image_source_page_url: 'https://commons.wikimedia.org/wiki/File:Lachit_Borphukan_Statue_Guwahati.jpg',
    view_count: 3800,
    banner_download_count: 890,
    contributions: [
      { display_order: 1, title: 'Naval Victory at Saraighat (1671)', description: 'Masterminded the naval victory on the Brahmaputra river halting Mughal expansion into Assam.' },
      { display_order: 2, title: 'Unyielding National Duty', description: 'Famously placed the defense of his motherland above family ties during the fortification of Guwahati.' }
    ],
    timeline_events: [
      { event_year: 1622, event_date: '24 November 1622', title: 'Birth in Charaideo', description: 'Born to Momai Tamuli Borbarua, prime minister of the Ahom Kingdom.', display_order: 1 },
      { event_year: 1671, event_date: '1671', title: 'Victory at Saraighat', description: 'Defeated Mughal general Ram Singh despite being afflicted with severe fever.', display_order: 2 }
    ],
    sources: [
      { title: 'National Archives: Lachit Borphukan Historical Records', source_type: 'GOVERNMENT_ARCHIVE', url: 'https://www.abhilekhpatal.in', is_primary_reference: true },
      { title: 'PIB: 400th Birth Anniversary Celebrations of Lachit Borphukan', source_type: 'GOVERNMENT_PORTAL', url: 'https://pib.gov.in', is_primary_reference: true }
    ]
  },
  {
    id: 'rani-velu-nachiyar',
    slug: 'velu-nachiyar',
    name: 'Rani Velu Nachiyar (Veeramangai)',
    name_local: 'வேலு நாச்சியார்',
    name_local_lang: 'ta',
    birth_year: 1730,
    death_year: 1796,
    era: '18th Century Anti-Colonial Resistance',
    state: 'Tamil Nadu',
    district: 'Sivaganga',
    primary_domain: 'Freedom Struggle',
    tagline: 'The first Indian queen to wage war against the British East India Company and successfully defeat them (1780).',
    short_bio: 'Rani Velu Nachiyar was the queen of the Sivaganga estate from 1780 to 1790. She was the first Indian queen to wage war with the East India Company in India. Following the murder of her husband by British soldiers, she allied with Hyder Ali and built an elite women’s army (Udaiyaal brigade) that recaptured Sivaganga.',
    is_unsung_reason: 'Her successful military victory over the British occurred nearly 75 years before the 1857 Revolt and the Rani of Jhansi, yet remains overlooked in national school textbooks.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Velu_Nachchiyar_2008_stamp_of_India.jpg',
    image_license: 'PUBLIC_DOMAIN',
    image_attribution: 'Public Domain (India Post Commemorative Stamp, 2008)',
    image_source_page_url: 'https://commons.wikimedia.org/wiki/File:Rani_Velu_Nachiyar_2008_stamp_of_India.jpg',
    view_count: 2780,
    banner_download_count: 620,
    contributions: [
      { display_order: 1, title: 'First Queen to Defeat British', description: 'Successfully recaptured her kingdom from the East India Company in 1780 after 8 years of tactical preparation.' },
      { display_order: 2, title: 'First Recorded Human Bomb Battalion', description: 'Her commander Kuyili executed the first recorded suicide attack in Indian military history, detonating the British ammunition depot.' }
    ],
    timeline_events: [
      { event_year: 1730, event_date: '3 January 1730', title: 'Birth in Ramanathapuram', description: 'Trained in martial arts, archery, and sword fighting.', display_order: 1 },
      { event_year: 1780, event_date: '1780', title: 'Recapture of Sivaganga', description: 'Defeated British forces and restored indigenous administration.', display_order: 2 }
    ],
    sources: [
      { title: 'Indian Culture Portal: Rani Velu Nachiyar', source_type: 'GOVERNMENT_PORTAL', url: 'https://www.indianculture.gov.in', is_primary_reference: true }
    ]
  },

  // ==========================================
  // 3. FREEDOM STRUGGLE & TRIBAL REVOLUTION
  // ==========================================
  {
    id: 'matangini-hazra',
    slug: 'matangini-hazra',
    name: 'Matangini Hazra (Gandhi Buri)',
    name_local: 'মাতঙ্গিনী হাজরা',
    name_local_lang: 'bn',
    birth_year: 1870,
    death_year: 1942,
    era: 'Quit India Movement (1942)',
    state: 'West Bengal',
    district: 'Tamluk, Purba Medinipur',
    primary_domain: 'Freedom Struggle',
    tagline: 'The 72-year-old martyr who kept the Indian flag aloft while facing British bullets in Tamluk.',
    short_bio: 'Matangini Hazra was an Indian revolutionary who participated in the Indian independence movement until she was shot dead by the British Indian police in front of the Tamluk Police Station on 29 September 1942. Affectionately known as "Gandhi Buri" (Old Lady Gandhi), she led a procession of six thousand volunteers, mostly women, to take over the Tamluk police station during the Quit India movement.',
    is_unsung_reason: 'Despite her supreme sacrifice holding the tricolor aloft until her last breath, her story is rarely taught in mainstream national school curricula outside West Bengal.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/%22Gandhi_Buri%22_Matangini_Hazra.jpg',
    image_license: 'PUBLIC_DOMAIN',
    image_attribution: 'Public Domain (Photograph circa 1942 in British India, copyright expired)',
    image_source_page_url: 'https://commons.wikimedia.org/wiki/File:Matangini_Hazra.jpg',
    view_count: 2420,
    banner_download_count: 510,
    contributions: [
      { display_order: 1, title: 'Quit India Movement Martyrdom', description: 'Led a peaceful procession of 6,000 freedom fighters in Tamluk at age 72, continuing to chant Vande Mataram even after being shot multiple times.' },
      { display_order: 2, title: 'Salt Satyagraha Participant', description: 'Active participant in the 1930 Civil Disobedience and Salt Satyagraha movements, enduring multiple arrests and physical imprisonment.' },
      { display_order: 3, title: 'First Woman Statue in Independent Kolkata', description: 'Recognized posthumously as the first woman freedom fighter to have a statue erected in Kolkata Maidan in independent India (1977).' }
    ],
    timeline_events: [
      { event_year: 1870, event_date: '19 October 1870', title: 'Birth in Hogla Village', description: 'Born into a poor peasant family in Tamluk, Midnapore.', display_order: 1 },
      { event_year: 1942, event_date: '29 September 1942', title: 'Martyrdom at Tamluk', description: 'Shot three times while leading the rally; kept the tricolor erect until her last breath.', display_order: 2 }
    ],
    sources: [
      { title: 'Press Information Bureau: Women in India’s Freedom Struggle', source_type: 'GOVERNMENT_PORTAL', url: 'https://pib.gov.in', is_primary_reference: true }
    ]
  },
  {
    id: 'birsa-munda',
    slug: 'birsa-munda',
    name: 'Birsa Munda (Dharti Aaba)',
    name_local: 'बिरसा मुंडा',
    name_local_lang: 'hi',
    birth_year: 1875,
    death_year: 1900,
    era: 'Ulgulan Tribal Movement (1899-1900)',
    state: 'Jharkhand',
    district: 'Khunti / Ranchi',
    primary_domain: 'Tribal Resistance',
    tagline: 'The tribal freedom fighter and folk hero who spearheaded the legendary Ulgulan (Great Tumult) against colonial land exploitation.',
    short_bio: 'Birsa Munda was an Indian tribal freedom fighter, religious leader, and folk hero who belonged to the Munda tribe. He spearheaded a tribal religious millenarian movement that arose in the Bengal Presidency (now Jharkhand) in the late 19th century against British land dispossession and the feudal Zamindari system.',
    is_unsung_reason: 'While revered in tribal belts, his radical ecological and anti-colonial vision is often reduced to a brief footnote in urban educational curricula.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/7/71/Birsa_Munda%2C_photograph_in_Roy_%281912-72%29.JPG',
    image_license: 'PUBLIC_DOMAIN',
    image_attribution: 'Public Domain (Photograph taken circa 1900, copyright expired)',
    image_source_page_url: 'https://commons.wikimedia.org/wiki/File:Birsa_Munda.jpg',
    view_count: 3200,
    banner_download_count: 750,
    contributions: [
      { display_order: 1, title: 'The Great Ulgulan (The Tumult)', description: 'Mobilized thousands of Munda, Oraon, and tribal warriors against the British Raj demanding Khuntkatti (tribal land rights).' },
      { display_order: 2, title: 'Chota Nagpur Tenancy Act (1908)', description: 'His movement compelled the British government to enact the CNTA 1908, legally prohibiting the transfer of tribal land to non-tribals.' }
    ],
    timeline_events: [
      { event_year: 1875, event_date: '15 November 1875', title: 'Birth in Ulihatu', description: 'Born in Ulihatu village, Khunti, Jharkhand.', display_order: 1 },
      { event_year: 1900, event_date: '9 June 1900', title: 'Martyrdom in Ranchi Jail', description: 'Passed away in British custody at the age of 25.', display_order: 2 }
    ],
    sources: [
      { title: 'National Archives of India: Birsa Munda Records', source_type: 'GOVERNMENT_ARCHIVE', url: 'https://www.abhilekhpatal.in', is_primary_reference: true }
    ]
  },
  {
    id: 'kanaklata-barua',
    slug: 'kanaklata-barua',
    name: 'Kanaklata Barua (Birbala)',
    name_local: 'কনকলতা বৰুৱা',
    name_local_lang: 'as',
    birth_year: 1924,
    death_year: 1942,
    era: 'Quit India Movement (1942)',
    state: 'Assam',
    district: 'Gohpur, Biswanath',
    primary_domain: 'Freedom Struggle',
    tagline: 'The 17-year-old Assamese martyr who gave her life hoisting the National Tricolor at Gohpur Police Station.',
    short_bio: 'Kanaklata Barua, also known as Birbala, was an Indian independence activist and AIKS leader from Assam who was shot dead by the British police while leading a peaceful procession bearing the National Flag during the Quit India Movement of 1942 at the age of just 17.',
    is_unsung_reason: 'One of the youngest female martyrs of the freedom movement whose extraordinary sacrifice is often confined to regional North-East remembrance.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/8/87/%E0%A6%95%E0%A6%A8%E0%A6%95%E0%A6%B2%E0%A6%A4%E0%A6%BE%E0%A7%B0_%E0%A6%AA%E0%A7%8D%E0%A7%B0%E0%A6%A4%E0%A6%BF%E0%A6%AE%E0%A7%81%E0%A7%B0%E0%A7%8D%E0%A6%A4%E0%A6%BF.JPG',
    image_license: 'PUBLIC_DOMAIN',
    image_attribution: 'Public Domain (India Post Commemorative Stamp, 1990)',
    image_source_page_url: 'https://commons.wikimedia.org/wiki/File:Kanaklata_Barua_Stamp_1990.jpg',
    view_count: 1980,
    banner_download_count: 445,
    contributions: [
      { display_order: 1, title: 'Mrityu Bahini Leadership', description: 'Joined the death squad (Mrityu Bahini) of the Gohpur sub-division at age 17 to fight colonial rule.' },
      { display_order: 2, title: 'Gohpur Flag Hoisting', description: 'Led an unarmed line of villagers towards Gohpur Police Station holding the national flag, refusing police orders to halt.' }
    ],
    timeline_events: [
      { event_year: 1924, event_date: '22 December 1924', title: 'Birth in Borangabari', description: 'Born in Borangabari village in Assam.', display_order: 1 },
      { event_year: 1942, event_date: '20 September 1942', title: 'Supreme Martyrdom', description: 'Martyred while attempting to hoist the national flag at Gohpur Police Station.', display_order: 2 }
    ],
    sources: [
      { title: 'PIB: Remembering Kanaklata Barua', source_type: 'GOVERNMENT_PORTAL', url: 'https://pib.gov.in', is_primary_reference: true }
    ]
  },
  {
    id: 'komaram-bheem',
    slug: 'komaram-bheem',
    name: 'Komaram Bheem',
    name_local: 'కొమరం భీమ్',
    name_local_lang: 'te',
    birth_year: 1901,
    death_year: 1940,
    era: 'Tribal Resistance (1930s)',
    state: 'Telangana',
    district: 'Asifabad, Adilabad',
    primary_domain: 'Tribal Resistance',
    tagline: 'The revolutionary Gond leader who fought the Nizam of Hyderabad and coined the immortal slogan "Jal, Jangal, Zameen".',
    short_bio: 'Komaram Bheem was an Indian revolutionary leader from the Gond tribe who fought against the feudal Asaf Jahi Dynasty (Nizam) and British colonial forestry laws in Telangana. Operating from the forests of Jodeghat, he mobilized Adivasi guerrilla forces and coined the foundational tribal liberation slogan "Jal, Jangal, Zameen" (Water, Forest, Land).',
    is_unsung_reason: 'His revolutionary struggle against feudal oppression in the Deccan took decades to receive widespread national historiographical recognition.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Komaram_Bheem.jpg',
    image_license: 'CC-BY-SA-4.0',
    image_attribution: 'Wikimedia Commons (CC-BY-SA 4.0, Statue at Tank Bund Hyderabad)',
    image_source_page_url: 'https://commons.wikimedia.org/wiki/File:Komaram_Bheem_statue.jpg',
    view_count: 2750,
    banner_download_count: 610,
    contributions: [
      { display_order: 1, title: 'Coined "Jal, Jangal, Zameen"', description: 'Articulated the foundational philosophy that indigenous forest dwellers have inalienable rights to their water, forests, and lands.' },
      { display_order: 2, title: 'Jodeghat Resistance Movement', description: 'Organized guerrilla resistance against the oppressive Nizam tax collectors (patwaris) and forest guards.' }
    ],
    timeline_events: [
      { event_year: 1901, event_date: '22 October 1901', title: 'Birth in Sankepally', description: 'Born into a Gond tribal family in Adilabad.', display_order: 1 },
      { event_year: 1940, event_date: '27 October 1940', title: 'Martyrdom at Jodeghat', description: 'Martyred in armed battle against Nizam state police at Babejhari.', display_order: 2 }
    ],
    sources: [
      { title: 'Indian Culture Portal: Komaram Bheem and Tribal Awakening', source_type: 'GOVERNMENT_PORTAL', url: 'https://www.indianculture.gov.in', is_primary_reference: true }
    ]
  },
  {
    id: 'batukeshwar-dutt',
    slug: 'batukeshwar-dutt',
    name: 'Batukeshwar Dutt',
    name_local: 'বটুকেশ্বর দত্ত',
    name_local_lang: 'bn',
    birth_year: 1910,
    death_year: 1965,
    era: 'Revolutionary Movement (1929)',
    state: 'West Bengal / Bihar',
    district: 'Purba Bardhaman',
    primary_domain: 'Freedom Struggle',
    tagline: 'The revolutionary who accompanied Bhagat Singh in bombing the Central Legislative Assembly to "make the deaf hear".',
    short_bio: 'Batukeshwar Dutt was an Indian revolutionary and freedom fighter in the Hindustan Socialist Republican Association (HSRA). On 8 April 1929, along with Bhagat Singh, he threw low-intensity smoke bombs in the Central Legislative Assembly in Delhi to protest against the repressive Public Safety Bill, intentionally courting arrest to voice revolutionary ideas in court.',
    is_unsung_reason: 'While Bhagat Singh was martyred by hanging, Dutt was deported to the Cellular Jail (Kala Pani) for life and suffered immense obscurity and poverty in post-independence India.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Comrade_Batukeshswar_Dutt.jpg',
    image_license: 'PUBLIC_DOMAIN',
    image_attribution: 'Public Domain (Police photograph taken in 1929, copyright expired)',
    image_source_page_url: 'https://commons.wikimedia.org/wiki/File:Batukeshwar_Dutt.jpg',
    view_count: 2980,
    banner_download_count: 670,
    contributions: [
      { display_order: 1, title: 'Central Legislative Assembly Bomb Action (1929)', description: 'Threw harmless smoke bombs and HSRA leaflets into the assembly chanting Inquilab Zindabad.' },
      { display_order: 2, title: 'Historic Hunger Strike at Cellular Jail', description: 'Joined Bhagat Singh and fellow revolutionaries in an unprecedented 116-day hunger strike demanding basic human rights for political prisoners.' }
    ],
    timeline_events: [
      { event_year: 1910, event_date: '18 November 1910', title: 'Birth in Oari', description: 'Born in Oari village, Burdwan, Bengal.', display_order: 1 },
      { event_year: 1929, event_date: '8 April 1929', title: 'Assembly Action in Delhi', description: 'Executed the assembly bomb action with Bhagat Singh.', display_order: 2 }
    ],
    sources: [
      { title: 'National Archives of India: Delhi Conspiracy Case Trial Records', source_type: 'GOVERNMENT_ARCHIVE', url: 'https://www.abhilekhpatal.in', is_primary_reference: true }
    ]
  },

  // ==========================================
  // 4. PIONEERING SCIENTISTS & REFORMERS
  // ==========================================
  {
    id: 'janaki-ammal',
    slug: 'janaki-ammal',
    name: 'E. K. Janaki Ammal',
    name_local: 'ஜானகி அம்மாள்',
    name_local_lang: 'ta',
    birth_year: 1897,
    death_year: 1984,
    era: 'Early 20th Century Science',
    state: 'Kerala',
    district: 'Thalassery, Kannur',
    primary_domain: 'Science & Tech',
    tagline: 'India’s pioneering cytogeneticist and botanist who developed sweet indigenous sugarcane hybrids and co-authored the Chromosome Atlas.',
    short_bio: 'Edavalath Kakkat Janaki Ammal was a pioneering Indian botanist and cytogeneticist who conducted scientific research in cytogenetics and phytogeography. She obtained a PhD from the University of Michigan in 1931, becoming one of the first women in the world to do so, and engineered high-yield sweet sugarcane varieties indigenous to India.',
    is_unsung_reason: 'Despite foundational contributions to Indian agriculture and the Botanical Survey of India, her scientific legacy is overshadowed by contemporary Western scientists.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/0/03/E_K_Janaki_Ammal.jpg',
    image_license: 'PUBLIC_DOMAIN',
    image_attribution: 'Public Domain (Botanical Survey of India archival portrait)',
    image_source_page_url: 'https://commons.wikimedia.org/wiki/File:Janaki_Ammal_(1897%E2%80%931984).jpg',
    view_count: 2120,
    banner_download_count: 480,
    contributions: [
      { display_order: 1, title: 'Indigenous Sugarcane Hybrids', description: 'Developed the high-sucrose sugarcane variety cross enabling India to cultivate domestic sweet sugarcane without foreign imports.' },
      { display_order: 2, title: 'Chromosome Atlas of Cultivated Plants', description: 'Co-authored the landmark international Chromosome Atlas with C.D. Darlington in 1945.' },
      { display_order: 3, title: 'Botanical Survey of India Reorganization', description: 'Restructured and revitalized the Botanical Survey of India (BSI) under Jawaharlal Nehru.' }
    ],
    timeline_events: [
      { event_year: 1897, event_date: '4 November 1897', title: 'Birth in Thalassery', description: 'Born in Thalassery, Kerala.', display_order: 1 },
      { event_year: 1931, event_date: '1931', title: 'PhD from Univ of Michigan', description: 'Earned DSc in Botany, one of the earliest Indian women to do so.', display_order: 2 }
    ],
    sources: [
      { title: 'CSIR Science Reporter: Pioneering Indian Women in Science', source_type: 'ACADEMIC_PUBLICATION', url: 'https://sciencereporter.niscpr.res.in', is_primary_reference: true }
    ]
  },
  {
    id: 'savitribai-phule',
    slug: 'savitribai-phule',
    name: 'Savitribai Phule',
    name_local: 'सावित्रीबाई फुले',
    name_local_lang: 'mr',
    birth_year: 1831,
    death_year: 1897,
    era: '19th Century Social Reform',
    state: 'Maharashtra',
    district: 'Pune / Satara',
    primary_domain: 'Education & Social Reform',
    tagline: 'The mother of modern Indian female education who founded India’s first school for girls in Bhide Wada, Pune.',
    short_bio: 'Savitribai Phule was an Indian social reformer, educational pioneer, and poet from Maharashtra. Along with her husband Jyotirao Phule, she played an indispensable role in improving women’s rights and eliminating caste oppression in India. She founded India’s first indigenous girls’ school at Bhide Wada in Pune in 1848.',
    is_unsung_reason: 'Faced extreme societal ostracization and physical attacks while educating marginalized girls, yet her groundbreaking role in universal education took over a century to receive full national celebration.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Savitribai_Phule_statue%2C_Maharashtra_sadan%2C_New_Delhi.jpg',
    image_license: 'PUBLIC_DOMAIN',
    image_attribution: 'Public Domain (India Post Commemorative Stamp, 1998)',
    image_source_page_url: 'https://commons.wikimedia.org/wiki/File:Savitribai_Phule_1998_stamp_of_India.jpg',
    view_count: 3600,
    banner_download_count: 820,
    contributions: [
      { display_order: 1, title: 'First Girls’ School in Pune (1848)', description: 'Established the first school for girls run by Indians at Bhide Wada, serving as India’s first female headmistress.' },
      { display_order: 2, title: 'Balhatya Pratibandhak Griha', description: 'Established a care home for pregnant rape survivors and widows to prevent female infanticide in 1853.' },
      { display_order: 3, title: 'Plague Relief Martyrdom (1897)', description: 'Sacrificed her life nursing plague patients during the third bubonic plague pandemic in Pune.' }
    ],
    timeline_events: [
      { event_year: 1831, event_date: '3 January 1831', title: 'Birth in Naigaon', description: 'Born in Satara district, Maharashtra.', display_order: 1 },
      { event_year: 1848, event_date: '1 January 1848', title: 'Opened Bhide Wada School', description: 'Inaugurated the first school for girls in Pune.', display_order: 2 }
    ],
    sources: [
      { title: 'Indian Culture Portal: Savitribai Phule and Women’s Education', source_type: 'GOVERNMENT_PORTAL', url: 'https://www.indianculture.gov.in', is_primary_reference: true }
    ]
  },
  {
    id: 'shambhu-nath-de',
    slug: 'shambhu-nath-de',
    name: 'Dr. Sambhu Nath De',
    name_local: 'শম্ভুনাথ দে',
    name_local_lang: 'bn',
    birth_year: 1915,
    death_year: 1985,
    era: '20th Century Medical Science',
    state: 'West Bengal',
    district: 'Hooghly / Kolkata',
    primary_domain: 'Medicine & Science',
    tagline: 'The medical scientist who discovered the Cholera Enterotoxin (1959), creating the foundation for oral rehydration therapy and modern cholera vaccines.',
    short_bio: 'Sambhu Nath De was an Indian medical scientist and researcher who made the epochal discovery of the cholera enterotoxin in 1959 at Kolkata. His discovery shifted medical science’s understanding of cholera from a blood-invasive disease to a toxin-induced dehydration disease, paving the way for Oral Rehydration Solution (ORS) and modern vaccines that have saved millions of lives globally.',
    is_unsung_reason: 'Nobel laureate Joshua Lederberg famously remarked that De should have won the Nobel Prize, yet he remained virtually uncelebrated in his own lifetime.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/d/d6/Medical_Scientist_Prof._Sambhu_Nath_De.png',
    image_license: 'PUBLIC_DOMAIN',
    image_attribution: 'Public Domain (Archival photograph, Calcutta Medical College)',
    image_source_page_url: 'https://commons.wikimedia.org/wiki/File:Medical_Scientist_Prof._Sambhu_Nath_De.png',
    view_count: 2300,
    banner_download_count: 530,
    contributions: [
      { display_order: 1, title: 'Discovery of Cholera Enterotoxin (1959)', description: 'Demonstrated that Vibrio cholerae secretes an enterotoxin that causes fatal fluid loss in the human intestine.' },
      { display_order: 2, title: 'Foundation of ORS Therapy', description: 'His discovery directly led to the development of Oral Rehydration Therapy (ORS), saving tens of millions of children.' }
    ],
    timeline_events: [
      { event_year: 1915, event_date: '1 February 1915', title: 'Birth in Garbati', description: 'Born in Hooghly district, West Bengal.', display_order: 1 },
      { event_year: 1959, event_date: '1959', title: 'Landmark Nature Publication', description: 'Published his discovery of cholera enterotoxin in Nature journal.', display_order: 2 }
    ],
    sources: [
      { title: 'CSIR Science Reporter: Sambhu Nath De — The Unsung Savior', source_type: 'ACADEMIC_PUBLICATION', url: 'https://sciencereporter.niscpr.res.in', is_primary_reference: true }
    ]
  }
];
