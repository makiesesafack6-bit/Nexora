(function(){
  const $=s=>document.querySelector(s);
  const transition=(a,b)=>{a?.classList.add('hidden');b?.classList.remove('hidden');b?.scrollIntoView?.({behavior:'smooth',block:'center'});};
  const intro=$('#introStep'),quiz=$('#quizCard'),account=$('#accountCard'),loading=$('#loadingCard'),analysis=$('#analysisCard');
  const start=$('#startButton'),next=$('#nextButton');
  if(!start||!quiz||!account||!next)return;

  function showQuiz(){
    localStorage.setItem('nexoraQuizFirstFlow','1');
    transition(intro,quiz);
    if(typeof window.renderQuestion==='function')window.renderQuestion();
  }

  function showAccountAfterQuiz(){
    localStorage.setItem('nexoraQuizFirstFlow','1');
    try{localStorage.setItem('nexoraProfile',JSON.stringify(window.NexoraQuizAnswers||JSON.parse(localStorage.getItem('nexoraProfile')||'{}')))}catch(e){}
    const heading=account.querySelector('.account-header .eyebrow');
    const badge=account.querySelector('.account-badge');
    const title=account.querySelector('h2');
    const note=account.querySelector('.account-note');
    if(heading)heading.textContent='DERNIÈRE ÉTAPE';
    if(badge)badge.textContent='IDENTITÉ';
    if(title)title.textContent='Choisissez comment créer votre compte.';
    if(note)note.textContent='Votre quiz est terminé. Choisissez Google si vous n’avez pas de numéro mobile, ou utilisez votre numéro pour créer votre compte.';
    transition(quiz,account);
  }

  async function startGooglePostQuiz(){
    const btn=document.querySelector('#googleSignup') || [...account.querySelectorAll('button')].find(b=>/google/i.test(b.textContent));
    if(btn){btn.disabled=true;btn.textContent='Connexion à Google…';}
    try{
      localStorage.setItem('nexoraOAuthFlow','postquiz-signup');
      const client=await window.NexoraSupabase.getClient();
      const {error}=await client.auth.signInWithOAuth({
        provider:'google',
        options:{redirectTo:`${window.location.origin}/oauth-callback.html?flow=postquiz-signup`,queryParams:{prompt:'select_account'}}
      });
      if(error)throw error;
    }catch(error){
      console.error('[Nexora] quiz-first Google signup failed:',error);
      localStorage.removeItem('nexoraOAuthFlow');
      if(btn){btn.disabled=false;btn.textContent='Continuer avec Google →';}
    }
  }

  async function finishAuthenticatedIdentity(){
    try{
      if(window.NexoraSupabasePersistence?.saveQuizProfile)await window.NexoraSupabasePersistence.saveQuizProfile();
      const accountData=JSON.parse(localStorage.getItem('nexoraAccount')||'{}');
      localStorage.setItem('nexoraAccount',JSON.stringify({...accountData,profileComplete:true,signedIn:true}));
      localStorage.setItem('nexoraSession','active');
      showAnalysis(accountData.firstName||accountData.name||'Utilisateur');
    }catch(error){
      console.error('[Nexora] post-quiz profile save failed:',error);
      const note=$('#otpDemoNote');
      if(note)note.textContent='Impossible d’enregistrer votre profil. Réessayez.';
    }
  }

  function showAnalysis(firstName){
    transition(account,analysis);
    const title=$('#analysisTitle'),text=$('#analysisText'),s2=$('#analysis2'),s3=$('#analysis3');
    if(title)title.textContent='Profil activé…';
    if(text)text.textContent='Nexora synchronise votre quiz avec votre compte.';
    setTimeout(()=>{if(s2)s2.textContent='✓ Quiz et préférences enregistrés';if(title)title.textContent=`Bonjour ${firstName} 👋`;},900);
    setTimeout(()=>{if(s3)s3.textContent='✓ Matching Nexora activé';if(text)text.textContent='Votre espace personnalisé est prêt.';},1800);
    setTimeout(()=>{localStorage.removeItem('nexoraQuizFirstFlow');localStorage.removeItem('nexoraOAuthFlow');location.href='platform.html';},2800);
  }

  // One and only handler for the quiz-first flow.
  document.addEventListener('click',function(e){
    const target=e.target?.closest?.('button');
    if(!target)return;
    if(target===start){e.preventDefault();e.stopImmediatePropagation();showQuiz();return;}
    if(target===next && /Terminer/.test(target.textContent||'')){
      e.preventDefault();e.stopImmediatePropagation();
      showAccountAfterQuiz();
      return;
    }
    if(/google/i.test(target.id||'') || /google/i.test(target.textContent||'')){
      if(account.contains(target)){
        e.preventDefault();e.stopImmediatePropagation();
        startGooglePostQuiz();
      }
    }
  },true);

  // Phone OTP completion also lands here instead of resurrecting the old quiz flow.
  window.NexoraBeginLoading=async function(){
    if(localStorage.getItem('nexoraQuizFirstFlow')!=='1'){
      if(typeof window.__NexoraOriginalBeginLoading==='function')return window.__NexoraOriginalBeginLoading();
      return;
    }
    await finishAuthenticatedIdentity();
  };

  // OAuth callback returns to onboarding after Google identity is established.
  try{
    const params=new URLSearchParams(location.search);
    if(params.get('oauth')==='postquiz-complete'){
      localStorage.setItem('nexoraQuizFirstFlow','1');
      transition(intro,loading);
      const title=$('#loadingTitle'),text=$('#loadingText');
      if(title)title.textContent='Compte Google connecté.';
      if(text)text.textContent='Enregistrement de votre quiz…';
      setTimeout(finishAuthenticatedIdentity,500);
    }
  }catch(error){console.warn('[Nexora] post-quiz OAuth resume failed:',error)}
})();
