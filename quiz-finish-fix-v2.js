(function(){
  function parseStep(){
    const text=document.getElementById('stepLabel')?.textContent||'';
    const m=text.match(/Étape\s+(\d+)\s+sur\s+(\d+)/i);
    return m?{current:Number(m[1]),total:Number(m[2])}:null;
  }
  function textOf(el){return (el?.textContent||'').replace(/[✓›]/g,'').trim()}
  function showIdentityStep(){
    const quiz=document.getElementById('quizCard');
    const account=document.getElementById('accountCard');
    if(!quiz||!account)return false;
    try{
      const draft=JSON.parse(localStorage.getItem('nexoraQuizDraft')||'{}');
      localStorage.setItem('nexoraProfile',JSON.stringify(draft));
      localStorage.setItem('nexoraAccount',JSON.stringify({...JSON.parse(localStorage.getItem('nexoraAccount')||'{}'),profileDraft:true,profileComplete:false}));
    }catch{}
    quiz.classList.add('hidden');
    account.classList.remove('hidden');
    account.style.display='';
    const eyebrow=account.querySelector('.account-header .eyebrow');
    const badge=account.querySelector('.account-badge');
    const title=account.querySelector('h2');
    const note=account.querySelector('.account-note');
    if(eyebrow)eyebrow.textContent='DERNIÈRE ÉTAPE';
    if(badge)badge.textContent='IDENTITÉ';
    if(title)title.textContent='Comment voulez-vous créer votre compte ?';
    if(note)note.textContent='Votre quiz est terminé. Choisissez Google si vous n’avez pas de numéro, ou utilisez votre téléphone pour créer et sécuriser votre compte.';
    setTimeout(()=>document.getElementById('googleSignup')?.focus(),80);
    return true;
  }
  document.addEventListener('click',function(e){
    const option=e.target.closest?.('#quizCard .option');
    if(option){
      const s=parseStep();
      if(s){let draft={};try{draft=JSON.parse(localStorage.getItem('nexoraQuizDraft')||'{}')}catch{}draft['step'+s.current]=textOf(option);try{localStorage.setItem('nexoraQuizDraft',JSON.stringify(draft))}catch{}}
      return;
    }
    const btn=e.target.closest?.('#nextButton');
    const s=parseStep();
    if(!btn||!s||s.current!==s.total)return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    showIdentityStep();
  },true);
})();
