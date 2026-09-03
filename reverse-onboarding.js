(function(){
  const intro=document.getElementById('introStep');
  const accountCard=document.getElementById('accountCard');
  const loadingCard=document.getElementById('loadingCard');
  const quizCard=document.getElementById('quizCard');
  const analysisCard=document.getElementById('analysisCard');
  const startButton=document.getElementById('startButton');
  const nextButton=document.getElementById('nextButton');
  const transition=(a,b)=>{a?.classList.add('hidden');b?.classList.remove('hidden')};

  if(!intro||!accountCard||!quizCard||!startButton||!nextButton)return;

  // Reverse the signup journey: the visitor answers the quiz before choosing
  // Google or phone. We intercept only the relevant clicks and leave the
  // existing quiz renderer/back button untouched.
  document.addEventListener('click',function(e){
    if(e.target===startButton){
      e.preventDefault();e.stopImmediatePropagation();
      transition(intro,quizCard);
      if(typeof window.renderQuestion==='function')window.renderQuestion();
      return;
    }
    if(e.target===nextButton && String(nextButton.textContent||'').includes('Terminer')){
      e.preventDefault();e.stopImmediatePropagation();
      finishQuizBeforeAccount();
    }
    if(e.target?.id==='googleSignup' || e.target?.closest?.('#googleSignup')){
      e.preventDefault();e.stopImmediatePropagation();
      startPostQuizGoogle();
    }
  },true);

  async function finishQuizBeforeAccount(){
    const profile=localStorage.getItem('nexoraProfile');
    if(!profile){return;}
    const heading=document.querySelector('#accountCard .account-header .eyebrow');
    const badge=document.querySelector('#accountCard .account-badge');
    const title=document.querySelector('#accountCard h2');
    const note=document.querySelector('#accountCard .account-note');
    if(heading)heading.textContent='DERNIÈRE ÉTAPE';
    if(badge)badge.textContent='IDENTITÉ';
    if(title)title.textContent='Choisissez comment créer votre compte.';
    if(note)note.textContent='Votre profil est défini. Choisissez Google si vous n’avez pas de numéro mobile, ou utilisez votre numéro pour sécuriser votre compte.';
    transition(quizCard,accountCard);
    accountCard.scrollIntoView({behavior:'smooth',block:'center'});
  }

  async function startPostQuizGoogle(){
    const button=document.getElementById('googleSignup');
    if(button){button.disabled=true;button.textContent='Connexion à Google…';}
    try{
      localStorage.setItem('nexoraOAuthFlow','postquiz-signup');
      const client=await window.NexoraSupabase.getClient();
      const {error}=await client.auth.signInWithOAuth({
        provider:'google',
        options:{
          redirectTo:`${window.location.origin}/oauth-callback.html?flow=postquiz-signup`,
          queryParams:{prompt:'select_account'}
        }
      });
      if(error)throw error;
    }catch(error){
      console.error('[Nexora] Post-quiz Google signup error:',error);
      localStorage.removeItem('nexoraOAuthFlow');
      if(button){button.disabled=false;button.textContent='Continuer avec Google →';}
    }
  }

  async function finishAuthenticatedAccount(){
    try{
      if(window.NexoraSupabasePersistence?.saveQuizProfile){await window.NexoraSupabasePersistence.saveQuizProfile();}
      const account=JSON.parse(localStorage.getItem('nexoraAccount')||'{}');
      localStorage.setItem('nexoraAccount',JSON.stringify({...account,profileComplete:true,signedIn:true}));
      localStorage.setItem('nexoraSession','active');
      showAnalysis(account.firstName||account.name||'Utilisateur');
    }catch(error){
      console.error('[Nexora] Post-quiz Google profile save failed:',error);
      alert('Impossible d’enregistrer votre profil Nexora. Veuillez réessayer.');
    }
  }

  function showAnalysis(firstName){
    transition(accountCard,analysisCard);
    const title=document.getElementById('analysisTitle');
    const text=document.getElementById('analysisText');
    const s2=document.getElementById('analysis2');
    const s3=document.getElementById('analysis3');
    if(title)title.textContent='Profil activé…';
    if(text)text.textContent='Nexora synchronise votre quiz avec votre nouveau compte.';
    setTimeout(()=>{if(s2)s2.textContent='✓ Quiz et préférences enregistrés';if(title)title.textContent=`Bonjour ${firstName} 👋`},900);
    setTimeout(()=>{if(s3)s3.textContent='✓ Matching Nexora activé';if(text)text.textContent='Votre espace personnalisé est prêt.'},1800);
    setTimeout(()=>{window.location.href='platform.html'},2800);
  }

  // For phone signup, auth-phone.js calls NexoraBeginLoading() after OTP.
  // Replace only that final transition so the quiz is not shown a second time.
  window.NexoraBeginLoading=async function(){
    try{
      const account=JSON.parse(localStorage.getItem('nexoraAccount')||'{}');
      if(window.NexoraSupabasePersistence?.saveQuizProfile){await window.NexoraSupabasePersistence.saveQuizProfile();}
      localStorage.setItem('nexoraAccount',JSON.stringify({...account,profileComplete:true,signedIn:true}));
      localStorage.setItem('nexoraSession','active');
      transition(accountCard,analysisCard);
      showAnalysis(account.firstName||account.name||'Utilisateur');
    }catch(error){
      console.error('[Nexora] Phone post-quiz completion failed:',error);
      const note=document.getElementById('otpDemoNote');
      if(note)note.textContent='Le compte est créé, mais la synchronisation du quiz a échoué. Réessayez.';
      transition(otpCard||accountCard,accountCard);
    }
  };

  // OAuth callback can return to onboarding with the existing authenticated
  // session. Save the already-completed quiz, then finish normally.
  try{
    const params=new URLSearchParams(window.location.search);
    if(params.get('oauth')==='postquiz-complete'){
      transition(intro,loadingCard);
      const title=document.getElementById('loadingTitle');
      const text=document.getElementById('loadingText');
      if(title)title.textContent='Compte Google connecté.';
      if(text)text.textContent='Enregistrement de votre quiz…';
      setTimeout(finishAuthenticatedAccount,500);
    }
  }catch(error){console.warn('[Nexora] post-quiz OAuth route unavailable:',error)}
})();
