module.exports = (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.setHeader('Allow', 'GET');
    return res.end(JSON.stringify({ error: 'Method not allowed' }));
  }

  const url = process.env.SUPABASE_URL;
  const publishableKey = process.env.SUPABASE_ANON_KEY;

  if (!url || !publishableKey) {
    res.statusCode = 500;
    return res.end(JSON.stringify({ error: 'Supabase environment variables are not configured.' }));
  }

  return res.end(JSON.stringify({ url, publishableKey }));
};
