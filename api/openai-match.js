export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { profile, search, prospects } = req.body || {};
    // Vercel currently stores the secret as OPEN_AI_KEY. Keep compatibility
    // with the conventional OPENAI_API_KEY name as well.
    const apiKey = process.env.OPEN_AI_KEY || process.env.OPENAI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'OpenAI API key is not configured' });

    const prompt = `You are Nexora's prospect matching engine for a DEMO. Match the user's profile and optional Find search against ONLY the supplied prospects. Never invent a prospect, never change a prospect id or name, and never introduce an unrelated category.

IMPORTANT MATCHING RULES:
- The user's Find search is a strong signal and must be compared semantically, not by simple keyword equality.
- The user's onboarding profile is also a strong signal.
- A prospect whose actual need closely matches the requested service should receive a high score.
- A partially related need should receive a medium score.
- An unrelated need should receive a low score.
- Scores must be different when the underlying relevance is different; do not reuse one fixed score such as 78 for every prospect.
- Consider role/service, skills, project type, industry, intent and location when available.
- Rank the supplied prospects from best to worst.
- For the DEMO, you may lightly paraphrase each supplied need into displayNeed so similar prospects do not all show exactly the same wording, but the paraphrase must preserve the original meaning and must never invent a new service.

Return JSON only in exactly this shape:
{"matches":[{"id":"...","score":0,"reason":"short explanation","displayNeed":"short natural description of the same need"}]}

Return one match object for each supplied prospect that is relevant enough to display. Keep the score between 0 and 100 and make it reflect actual compatibility.

User profile: ${JSON.stringify(profile || {})}
Find search: ${JSON.stringify(search || '')}
Supplied prospects: ${JSON.stringify(prospects || [])}`;

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
