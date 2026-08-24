export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { phone, code } = req.body || {};
  if (!phone || !code) return res.status(400).json({ error: 'Phone and code are required' });

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;
  if (!accountSid || !authToken || !serviceSid) {
    return res.status(503).json({ error: 'OTP provider is not configured yet', configured: false });
  }

  try {
    const body = new URLSearchParams({ To: phone, Code: String(code).trim() });
    const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
    const response = await fetch(`https://verify.twilio.com/v2/Services/${serviceSid}/VerificationCheck`, {
      method: 'POST',
      headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body
    });
    if (!response.ok) {
      console.error('Twilio check OTP failed:', response.status, await response.text().catch(() => ''));
      return res.status(502).json({ error: 'Unable to verify code' });
    }
    const data = await response.json();
    return res.status(200).json({ ok: data.status === 'approved', configured: true, status: data.status || 'pending' });
  } catch (error) {
    console.error('OTP check error:', error);
    return res.status(500).json({ error: 'OTP service error' });
  }
}
