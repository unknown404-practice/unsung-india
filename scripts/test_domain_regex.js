function extractDomainFromExtract(extract: string): string {
  const text = extract.toLowerCase();

  if (/\b(music|musician|singing|singer|vocalist|shehnai|sitar|sarod|tabla|flute|carnatic|hindustani|ragas?)\b/i.test(text)) {
    return 'Classical Indian Music & Performing Arts';
  }
  if (/\b(physicist|physics|chemist|chemistry|scientist|science|nobel prize in physics|nobel prize in chemistry|laboratory|botanist)\b/i.test(text)) {
    return 'Scientific Discovery & Modern Research';
  }
  if (/\b(mathematician|mathematics|number theory|infinite series|algebra|astronomer|astronomy)\b/i.test(text)) {
    return 'Mathematics & Infinite Series';
  }
  if (/\b(surgeon|surgery|doctor|physician|ayurveda|sushruta|charaka|medicine|medical)\b/i.test(text)) {
    return 'Medicine & Surgical Science';
  }
  if (/\b(freedom fighter|rebellion|revolt|armed struggle|british raj|colonial rule|indian national army|martyr|azad hind)\b/i.test(text)) {
    return 'Freedom Struggle & Armed Revolution';
  }
  if (/\b(social reformer|social reform|women's education|sati|untouchability|brahmo samaj|arya samaj)\b/i.test(text)) {
    return 'Social Reform & Human Dignity';
  }
  if (/\b(poet|poetry|novel|writer|author|literature|gitanjali|philosopher)\b/i.test(text)) {
    return 'Literature, Poetry & Philosophy';
  }

  return 'National Heritage & Cultural Icon';
}
