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
  loginCard.classList.add('hidden'); loaderCard.classList.remove('hidden');
  const steps=[
    ['Vérification de votre espace Nexora.','Compte trouvé ✓'],
    ['Récupération de votre profil et de vos préférences.','Profil chargé ✓'],
    ['Préparation de votre workspace personnalisé.','Workspace prêt ✓']
  ];
  let i=0;
  const tick=()=>{if(i<steps.length){document.getElementById('loginLoaderText').textContent=steps[i][0];document.getElementById('loginStatus').textContent=steps[i][1];i++;setTimeout(tick,750);}else{window.location.href='platform.html';}};
  tick();
}
document.getElementById('loginForm')?.addEventListener('submit',e=>{e.preventDefault();proceed('email');});
document.getElementById('googleLogin')?.addEventListener('click',()=>proceed('Google'));
document.getElementById('appleLogin')?.addEventListener('click',()=>proceed('Apple'));