(function(){
  function getDraft(){try{return JSON.parse(localStorage.getItem('nexoraQuizDraft')||'{}')||{}}catch{return {}}}
  function setDraft(v){try{localStorage.setItem('nexoraQuizDraft',JSON.stringify(v))}catch{}}
  function finalStep(){
    const label=document.getElementById('stepLabel')?.textContent||'';
    const m=label.match(/Étape\s+(\d+)\s+sur\s+(\d+)/i);
    return !!m && m[1]===m[2];
  }
  document.addEventListener('click',function(e){
    const option=e.target.closest?.('.quiz-card .option');
    if(option){
      const label=document.getElementById('stepLabel')?.textContent||'';
      const m=label.match(/Étape\s+(\d+)\s+sur\s+(\d+)/i);
      if(m){const draft=getDraft();draft['step'+m[1]]=option.textContent.replace('✓','').replace('›','').trim();setDraft(draft)}
      return;
    }
    const btn=e.target.closest?.('#nextButton');
    if(!btn||!finalStep())return;
    e.preventDefault();
    e.stopImmediatePropagation();
    const profile=getDraft();
    const selected=document.querySelector('.quiz-card .option.selected');
    const label=document.getElementById('stepLabel')?.textContent||'';
    const m=label.match(/Étape\s+(\d+)\s+sur\s+(\d+)/i);
    if(m&&selected){profile['step'+m[1]]=selected.textContent.replace('✓','').replace('›','').trim()}
    try{localStorage.setItem('nexoraProfile',JSON.stringify(profile));}catch{}
    const quiz=document.getElementById('quizCard'),account=document.getElementById('accountCard');
    if(!quiz||!account)return;
    quiz.classList.add('hidden');account.classList.remove('hidden');
    const heading=account.querySelector('.account-header .eyebrow');
    const badge=account.querySelector('.account-badge');
    const title=account.querySelector('h2');
    const note=account.querySelector('.account-note');
    if(heading)heading.textContent='DERNIÈRE ÉTAPE';
    if(badge)badge.textContent='IDENTITÉ';
    if(title)title.textContent='Comment voulez-vous créer votre compte ?';
    if(note)note.textContent='Votre quiz est terminé. Choisissez Google si vous n’avez pas de numéro, ou utilisez votre téléphone pour créer et sécuriser votre compte.';
    setTimeout(()=>document.getElementById('googleSignup')?.focus(),80);
  },true);
})();
