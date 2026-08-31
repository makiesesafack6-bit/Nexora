(function () {
  async function getClientAndSession() {
    if (!window.NexoraSupabase) throw new Error('Supabase client not loaded.');
    const session = await window.NexoraSupabase.ensureSession();
    const client = await window.NexoraSupabase.getClient();
    return { client, session };
  }

  async function saveProfileFromForm() {
    const { client, session } = await getClientAndSession();
    const value = id => document.getElementById(id)?.value?.trim() || null;
    const profile = {
      id: session.user.id,
      phone: value('phoneInput'),
      email: value('emailInput'),
      first_name: value('firstNameInput'),
      last_name: value('lastNameInput'),
      username: value('usernameInput'),
      role: value('roleInput'),
      company: value('companyInput'),
      birth_date: value('birthDateInput'),
      otp_channel: document.querySelector('input[name="otpChannel"]:checked')?.value || 'sms',
      profile_complete: false
    };

    const { error } = await client.from('profiles').upsert(profile, { onConflict: 'id' });
    if (error) throw error;
    localStorage.setItem('nexoraSupabaseUserId', session.user.id);
  }

  async function saveQuizProfile() {
    const raw = localStorage.getItem('nexoraProfile');
    if (!raw) throw new Error('Quiz answers are missing.');

    const { client, session } = await getClientAndSession();
    const answers = JSON.parse(raw);
    const profileId = session.user.id;

    // Look up at most one existing row. This also works if the existing
    // database table does not have a UNIQUE constraint on profile_id.
    const { data: rows, error: lookupError } = await client
      .from('quiz_profiles')
      .select('profile_id')
      .eq('profile_id', profileId)
      .limit(1);
    if (lookupError) throw lookupError;

    if (rows && rows.length > 0) {
      const { error } = await client
        .from('quiz_profiles')
        .update({ answers })
        .eq('profile_id', profileId);
      if (error) throw error;
    } else {
      const { error } = await client
        .from('quiz_profiles')
        .insert({ profile_id: profileId, answers });
      if (error) throw error;
    }

    const { error: profileError } = await client
      .from('profiles')
      .update({ profile_complete: true })
      .eq('id', profileId);
    if (profileError) throw profileError;
  }

  window.NexoraSupabasePersistence = { saveProfileFromForm, saveQuizProfile };
})();
