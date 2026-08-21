const loginCard=document.getElementById('loginCard');
const loaderCard=document.getElementById('loaderCard');
function proceed(provider='email'){
  const existing=JSON.parse(localStorage.getItem('nexoraAccount')||'{}');
  if(provider==='email'){
    const email=document.getElementById('loginEmail').value.trim();
    localStorage.setItem('nexoraAccount',JSON.stringify({...existing,email:email||existing.email||'demo@nexora.local',provider:'email',signedIn:true}));
  }else{
    localStorage.setItem('nexoraAccount',JSON.stringify({...existing,name:existing.name||`${provider} User`,email:existing.email||`demo-${provider.toLowerCase()}@nexora.local`,provider:provider.toLowerCase(),signedIn:true,demo:true}));
  }
  loginCard.classList.add('hidden');
  loaderCard.classList.remove('hidden');
  const loaderText=document.getElementById('loginLoaderText');
  const status=document.getElementById('loginStatus');
  const steps=[
    ['Vérification de votre espace Nexora.','Vérification du compte…'],
    ['Récupération de votre profil et de vos préférences.','Profil et préférences…'],
    ['Analyse de votre espace personnalisé.','Analyse Nexora AI…'],
    ['Recherche de la configuration adaptée à votre profil.','Configuration du workspace…'],
    ['Préparation de votre workspace personnalisé.','Workspace presque prêt…'],
    ['Synchronisation finale de votre espace Nexora.','Synchronisation finale…']
  ];
  const minimumDuration=15000;
  const startedAt=Date.now();
  let i=0;
  const tick=()=>{
    if(i<steps.length){
      loaderText.textContent=steps[i][0];
      status.textContent=steps[i][1];
      i++;
      setTimeout(tick,2500);
      return;
    }
    const remaining=Math.max(0,minimumDuration-(Date.now()-startedAt));
    setTimeout(()=>{status.textContent='✓ Espace prêt';loaderText.textContent='Votre espace Nexora est prêt.';setTimeout(()=>{window.location.href='platform.html';},350);},remaining);
  };
  tick();
}
document.getElementById('loginForm')?.addEventListener('submit',e=>{e.preventDefault();proceed('email');});
document.getElementById('googleLogin')?.addEventListener('click',()=>proceed('Google'));
document.getElementById('appleLogin')?.addEventListener('click',()=>proceed('Apple'));