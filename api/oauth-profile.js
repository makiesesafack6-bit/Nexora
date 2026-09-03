function json(res, status, body) {
  res.status(status).json(body);
}

function safeUsername(email = '') {
  const base = String(email).split('@')[0].toLowerCase().replace(/[^a-z0-9._-]/g, '').slice(0, 24) || 'user';
  return base.replace(/^[-_.]+|[-_.]+$/g, '') || 'user';
}

async function supabaseRequest(url, serviceKey, options = {}) {
  return fetch(url, {
    ...options,
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });

  const { access_token: accessToken } = req.body || {};
  if (!accessToken) return json(res, 400, { error: 'Missing access token' });

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return json(res, 503, { error: 'Server-side Supabase configuration is missing' });
  }

  try {
    const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (!userResponse.ok) {
      return json(res, 401, { error: 'Invalid OAuth session' });
    }

    const user = await userResponse.json();
    const metadata = user.user_metadata || {};
    const email = user.email || '';
    const fullName = String(metadata.full_name || metadata.name || '').trim();
    const parts = fullName.split(/\s+/).filter(Boolean);
    const firstName = String(metadata.first_name || parts.shift() || email.split('@')[0] || 'Utilisateur').trim();
    const lastName = String(metadata.last_name || parts.join(' ')).trim();

    // Existing Nexora profile: reuse it so Google login truly returns to
    // the same account instead of creating a second profile.
    const lookup = await supabaseRequest(
      `${supabaseUrl}/rest/v1/profiles?select=id,phone,email,first_name,last_name,username,role,company,birth_date,otp_channel,profile_complete,verified_phone&email=eq.${encodeURIComponent(email)}&limit=1`,
      serviceKey
    );

    if (!lookup.ok) {
      return json(res, 502, { error: 'Unable to load the Nexora profile' });
    }

    const rows = await lookup.json();
    let profile = Array.isArray(rows) ? rows[0] : null;

    if (!profile) {
      let username = safeUsername(email);
      const usernameCheck = await supabaseRequest(
        `${supabaseUrl}/rest/v1/profiles?select=id&username=eq.${encodeURIComponent(username)}&limit=1`,
        serviceKey
      );
      const usernameRows = usernameCheck.ok ? await usernameCheck.json() : [];
      if (Array.isArray(usernameRows) && usernameRows.length) {
        username = `${username}-${String(user.id || '').replace(/-/g, '').slice(0, 6) || '1'}`;
      }

      const insertResponse = await supabaseRequest(`${supabaseUrl}/rest/v1/profiles`, serviceKey, {
        method: 'POST',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify({
          id: user.id,
          phone: null,
          email,
          first_name: firstName,
          last_name: lastName,
          username,
          role: '',
          company: '',
          birth_date: null,
          otp_channel: 'sms',
          verified_phone: false,
          profile_complete: false
        })
      });

      if (!insertResponse.ok) {
        const detail = await insertResponse.text().catch(() => '');
        console.error('[Nexora] OAuth profile insert failed:', detail);
        return json(res, 502, { error: 'Unable to create the Nexora profile' });
      }

      const inserted = await insertResponse.json();
      profile = Array.isArray(inserted) ? inserted[0] : inserted;
    }

    return json(res, 200, {
      ok: true,
      profile: {
        id: profile.id,
        firstName: profile.first_name || firstName,
        lastName: profile.last_name || lastName,
        name: `${profile.first_name || firstName} ${profile.last_name || lastName}`.trim(),
        username: profile.username || safeUsername(email),
        role: profile.role || '',
        company: profile.company || '',
        phone: profile.phone || '',
        email: profile.email || email,
        birthDate: profile.birth_date || '',
        otpChannel: profile.otp_channel || 'sms',
        profileComplete: Boolean(profile.profile_complete),
        verifiedPhone: Boolean(profile.verified_phone),
        signedIn: true,
        provider: 'google'
      }
    });
  } catch (error) {
    console.error('[Nexora] OAuth profile error:', error);
    return json(res, 500, { error: 'OAuth profile processing failed' });
  }
}
