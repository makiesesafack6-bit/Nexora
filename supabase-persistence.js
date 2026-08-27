(function () {
  async function getClientAndSession() {
    if (!window.NexoraSupabase) throw new Error('Supabase client not loaded.');
    const session = await window.NexoraSupabase.ensureSession();
    const client = await window.NexoraSupabase.getClient();
    return { client, session };
  }

  async function saveProfileFromForm() {
    const form = document.getElementById('accountForm');
    if (!form) return;

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
    if (!raw) return;

    const { client, session } = await getClientAndSession();
    const answers = JSON.parse(raw);

    const { error: quizError } = await client.from('quiz_profiles').upsert({
      profile_id: session.user.id,
      answers
    }, { onConflict: 'profile_id' });
    if (quizError) throw quizError;

    const { error: profileError } = await client
      .from('profiles')
      .update({ profile_complete: true })
      .eq('id', session.user.id);
    if (profileError) throw profileError;
  }

  window.NexoraSupabasePersistence = { saveProfileFromForm, saveQuizProfile };

  document.getElementById('accountForm')?.addEventListener('submit', async () => {
    try {
      await saveProfileFromForm();
    } catch (error) {
      console.error('[Nexora] Supabase profile sync failed:', error);
    }
  });

  document.getElementById('nextButton')?.addEventListener('click', async () => {
    const button = document.getElementById('nextButton');
    if (button?.textContent?.includes('Terminer mon profil')) {
      setTimeout(async () => {
        try {
          await saveQuizProfile();
        } catch (error) {
          console.error('[Nexora] Supabase quiz sync failed:', error);
        }
      }, 100);
    }
  });
})();
