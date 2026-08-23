export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { profile, search, prospects } = req.body || {};
    // Vercel currently stores the secret as OPEN_AI_KEY. Keep compatibility
    // with the conventional OPENAI_API_KEY name as well.
    const apiKey = process.env.OPEN_AI_KEY || process.env.OPENAI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'OpenAI API key is not configured' });

    const prompt = `You are Nexora's prospect matching engine. Match the user's profile and optional search against ONLY the supplied prospects. Never invent prospects. Prefer exact semantic alignment of role, skills, service requested, industry, location and intent. A prospect is a strong match only when the prospect's actual need is relevant to what the user offers. Do not substitute unrelated services. Return JSON only: {"matches":[{"id":"...","score":0,"reason":"..."}]}. Score 0-100 must reflect actual compatibility. User profile: ${JSON.stringify(profile || {})}. Search: ${JSON.stringify(search || '')}. Prospects: ${JSON.stringify(prospects || [])}`;

    const r = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-5-mini',
        input: prompt
      })
    });

    if (!r.ok) {
      const details = await r.text().catch(() => '');
      console.error('OpenAI request failed:', r.status, details);
      return res.status(r.status).json({ error: 'OpenAI request failed' });
    }

    const data = await r.json();
    const text = data.output?.map(x => x.content?.map(c => c.text || '').join('') || '').join('') || '';
    const parsed = JSON.parse(text.replace(/```json|```/g, '').trim());
    return res.status(200).json(parsed);
  } catch (e) {
    console.error('Nexora matching failed:', e);
    return res.status(500).json({ error: 'Matching failed' });
  }
}
