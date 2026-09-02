function normalizePhone(value = '') {
  const digits = String(value).replace(/\D/g, '');
  return digits.startsWith('243') ? digits.slice(-9) : digits.slice(-9);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { phone } = req.body || {};
  const wanted = normalizePhone(phone);
  if (!wanted || wanted.length !== 9) return res.status(400).json({ exists: false, error: 'Invalid phone number' });

  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    return res.status(503).json({ exists: false, configured: false, error: 'Server-side Supabase lookup is not configured.' });
  }

  try {
    const candidates = [wanted, `0${wanted}`, `+243${wanted}`];
    const response = await fetch(
      `${url}/rest/v1/profiles?select=phone,email,first_name,last_name,username,role,company,birth_date,otp_channel,profile_complete,verified_phone&phone=in.(${candidates.map(encodeURIComponent).join(',')})&limit=1`,
      { headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` } }
    );

    if (!response.ok) {
      console.error('Supabase account lookup failed:', response.status, await response.text().catch(() => ''));
      return res.status(502).json({ exists: false, error: 'Unable to check account' });
    }

    const rows = await response.json();
    if (!Array.isArray(rows) || !rows[0]) return res.status(200).json({ exists: false, configured: true });

    const row = rows[0];
    return res.status(200).json({
      exists: true,
      configured: true,
      account: {
        firstName: row.first_name || '',
        lastName: row.last_name || '',
        name: `${row.first_name || ''} ${row.last_name || ''}`.trim(),
        username: row.username || '',
        role: row.role || '',
        company: row.company || '',
        phone: row.phone || '',
        email: row.email || '',
        birthDate: row.birth_date || '',
        otpChannel: row.otp_channel || 'sms',
        profileComplete: Boolean(row.profile_complete),
        verifiedPhone: Boolean(row.verified_phone),
        provider: 'phone'
      }
    });
  } catch (error) {
    console.error('Account lookup error:', error);
    return res.status(500).json({ exists: false, error: 'Account lookup failed' });
  }
}
