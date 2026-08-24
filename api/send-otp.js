export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { phone, channel = 'sms' } = req.body || {};
  if (!phone) return res.status(400).json({ error: 'Phone number is required' });
  if (!['sms', 'whatsapp'].includes(channel)) return res.status(400).json({ error: 'Unsupported channel' });

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;
  if (!accountSid || !authToken || !serviceSid) {
    return res.status(503).json({ error: 'OTP provider is not configured yet', configured: false });
  }

  try {
    const body = new URLSearchParams({ To: phone, Channel: channel });
    const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
    const response = await fetch(`https://verify.twilio.com/v2/Services/${serviceSid}/Verifications`, {
      method: 'POST',
      headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body
    });
    if (!response.ok) {
      console.error('Twilio send OTP failed:', response.status, await response.text().catch(() => ''));
      return res.status(502).json({ error: 'Unable to send verification code' });
    }
    const data = await response.json();
    return res.status(200).json({ ok: true, configured: true, status: data.status || 'pending', channel });
  } catch (error) {
    console.error('OTP send error:', error);
    return res.status(500).json({ error: 'OTP service error' });
  }
}
