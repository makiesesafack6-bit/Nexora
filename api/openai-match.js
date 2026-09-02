export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { profile, search, prospects, intentProfile } = req.body || {};
    const apiKey = process.env.OPEN_AI_KEY || process.env.OPENAI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'OpenAI API key is not configured' });

    const prompt = `You are Nexora's AI matching engine.

Your job is to rank ONLY the supplied prospects against the user's explicit professional profile, complete quiz answers, current search request, and relevant behavior signals.

NEVER invent a prospect, never change a prospect id/name, never fabricate contact details, and never treat navigation clicks as preference signals.

MATCHING PRIORITY:
1. Explicit quiz answers are the strongest declared intent signals.
2. Current Find search is the strongest immediate task signal.
3. Prospect's actual need, service, project type, sector, client type, level and location determine compatibility.
4. Relevant behavior such as opening, saving, or copying messages can lightly reinforce a topic, but must never override explicit answers.
5. Generic navigation clicks have no preference meaning.

IMPORTANT SEMANTIC RULES:
- Match meaning, not only exact words.
- Example: “Développeur web + SaaS + intermédiaire + contrats” should strongly favor a prospect needing a web developer for a SaaS project and a contract.
- If only the role matches but service/sector/goal differ, lower the score.
- If several explicit criteria match, raise the score.
- If an important criterion has no matching evidence, do not pretend it matches; the score should decrease accordingly.
- Strong mismatch on a core requirement should materially reduce the score.
- Scores must reflect relative relevance and may range from 0 to 100.
- Do not give similar scores to clearly different relevance levels.
- Every returned score must be explainable from supplied data.

Return JSON only in exactly this shape:
{"matches":[{"id":"...","score":0,"reason":"short explanation","matchedSignals":["..."],"missingSignals":["..."]}]}

Return one object for each supplied prospect. Keep the same prospect id. Use concise French explanations.

USER PROFILE:\n${JSON.stringify(profile || {})}

CURRENT SEARCH:\n${JSON.stringify(search || '')}

NEXORA INTENT PROFILE:\n${JSON.stringify(intentProfile || {})}

SUPPLIED PROSPECTS:\n${JSON.stringify(prospects || [])}`;

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
