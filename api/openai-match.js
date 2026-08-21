export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { profile, search, prospects } = req.body || {};
    if (!process.env.OPENAI_API_KEY) return res.status(500).json({ error: 'OPENAI_API_KEY is not configured' });
    const prompt = `You are Nexora's prospect matching engine. Match the user's profile and optional search against ONLY the supplied prospects. Never invent prospects. Prefer exact semantic alignment of role, skills, service requested, industry, location and intent. Return JSON only: {"matches":[{"id":"...","score":0,"reason":"..."}]}. Score 0-100 must reflect actual compatibility. User profile: ${JSON.stringify(profile || {})}. Search: ${JSON.stringify(search || '')}. Prospects: ${JSON.stringify(prospects || [])}`;
    const r = await fetch('https://api.openai.com/v1/responses', { method:'POST', headers:{'Content-Type':'application/json','Authorization':`Bearer ${process.env.OPENAI_API_KEY}`}, body:JSON.stringify({model:'gpt-5-mini',input:prompt}) });
    if (!r.ok) return res.status(r.status).json({ error: 'OpenAI request failed' });
    const data = await r.json();
    const text = data.output?.map(x=>x.content?.map(c=>c.text||'').join('')||'').join('') || '';
    const parsed = JSON.parse(text.replace(/```json|```/g,'').trim());
    return res.status(200).json(parsed);
  } catch (e) { return res.status(500).json({ error:'Matching failed' }); }
}