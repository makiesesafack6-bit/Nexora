(function () {
  let clientPromise = null;
  let accountProfileLoaded = false;

  function loadAccountProfile() {
    if (accountProfileLoaded || !document.querySelector('.top-user, .side-user')) return;
    accountProfileLoaded = true;
    const script = document.createElement('script');
    script.src = '/account-profile.js?v=20260830-2';
    script.async = true;
    script.onerror = () => console.warn('[Nexora] account profile UI unavailable.');
    document.head.appendChild(script);
  }

  async function getClient() {
    if (window.supabase && window.NexoraSupabaseClient) {
      loadAccountProfile();
      return window.NexoraSupabaseClient;
    }

    if (!clientPromise) {
      clientPromise = (async () => {
        if (!window.supabase) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
            script.onload = resolve;
            script.onerror = () => reject(new Error('Impossible de charger Supabase JS.'));
            document.head.appendChild(script);
          });
        }

        const response = await fetch('/api/supabase-config', { cache: 'no-store' });
        if (!response.ok) throw new Error('Configuration Supabase indisponible.');
        const config = await response.json();
        const client = window.supabase.createClient(config.url, config.publishableKey, {
          auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true
          }
        });
        window.NexoraSupabaseClient = client;
        loadAccountProfile();
        return client;
      })();
    }

    return clientPromise;
  }

  async function ensureSession() {
    const client = await getClient();
    const current = await client.auth.getSession();
    if (current.data?.session) return current.data.session;

    const result = await client.auth.signInAnonymously();
    if (result.error) throw result.error;
    return result.data.session;
  }

  window.NexoraSupabase = { getClient, ensureSession };
  setTimeout(loadAccountProfile, 0);
})();
