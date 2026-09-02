(function(){
  function message(text){const el=document.getElementById('loginMessage');if(el){el.textContent=text;el.classList.add('show');}}
  async function signIn(provider){
    try{
      if(!window.NexoraSupabase?.getClient) throw new Error('Supabase client unavailable');
      const client=await window.NexoraSupabase.getClient();
      const {error}=await client.auth.signInWithOAuth({provider,options:{redirectTo:`${window.location.origin}/oauth-callback.html`}});
      if(error) throw error;
    }catch(error){
      console.error('[Nexora] OAuth sign-in failed:',error);
      message(`Connexion ${provider==='google'?'Google':'Apple'} indisponible. Activez d'abord ce fournisseur dans Supabase Authentication → Providers.`);
    }
  }
  window.NexoraOAuth={signIn};
  document.getElementById('googleLogin')?.addEventListener('click',()=>signIn('google'));
  document.getElementById('appleLogin')?.addEventListener('click',()=>signIn('apple'));
})();
