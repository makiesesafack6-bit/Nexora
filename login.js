const loginCard=document.getElementById('loginCard');
const loaderCard=document.getElementById('loaderCard');
const phoneLogin=document.getElementById('phoneLogin');
const otpLogin=document.getElementById('otpLogin');
const savedSession=document.getElementById('savedSession');
const account=JSON.parse(localStorage.getItem('nexoraAccount')||'null');
const sessionActive=localStorage.getItem('nexoraSession')==='active';

function normalizePhone(value=''){const digits=String(value).replace(/\D/g,'');return digits.slice(-9);}
function setError(message){const input=document.getElementById('loginPhone');if(!input)return;input.setCustomValidity(message);input.reportValidity();}
function clearError(){const input=document.getElementById('loginPhone');if(input)input.setCustomValidity('');}
function showMessage(message){const el=document.getElementById('loginMessage');if(el){el.textContent=message;el.classList.add('show');}}

if(account&&sessionActive){document.getElementById('savedName').textContent=`Bienvenue, ${account.firstName||account.name||account.username||'sur Nexora'} 👋`;document.getElementById('savedMeta').textContent=`${account.username||account.phone||''} · session enregistrée sur cet appareil`;savedSession.classList.remove('hidden');}
document.getElementById('continueSession')?.addEventListener('click',()=>{if(account){account.signedIn=true;localStorage.setItem('nexoraAccount',JSON.stringify(account));startLoading();}});
document.getElementById('changeAccount')?.addEventListener('click',()=>{savedSession.classList.add('hidden');localStorage.removeItem('nexoraSession');phoneLogin.classList.remove('hidden');});

let selectedChannel='sms';
document.querySelectorAll('.channel').forEach(btn=>btn.addEventListener('click',()=>{selectedChannel=btn.dataset.channel;document.getElementById('loginChannel').value=selectedChannel;document.querySelectorAll('.channel').forEach(b=>b.classList.toggle('active',b===btn));}));

async function findStoredAccount(phone){
  const wanted=normalizePhone(phone);
  const local=JSON.parse(localStorage.getItem('nexoraAccount')||'null');
  if(local&&normalizePhone(local.phone)===wanted)return local;
  try{
    const response=await fetch('/api/account-lookup',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({phone})});
    const data=await response.json().catch(()=>({}));
    if(response.ok&&data.exists&&data.account){localStorage.setItem('nexoraAccount',JSON.stringify(data.account));return data.account;}
    if(response.status===503)showMessage('La récupération serveur du compte doit être configurée dans Vercel.');
  }catch(error){console.warn('[Nexora] account lookup unavailable:',error);}
  try{
    if(window.NexoraSupabase?.getClient){
      const client=await window.NexoraSupabase.getClient();
      const current=await client.auth.getSession();
      const uid=current.data?.session?.user?.id;
      if(uid){
        const {data,error}=await client.from('profiles').select('id,phone,email,first_name,last_name,username,role,company,birth_date,otp_channel,profile_complete,verified_phone').eq('id',uid).maybeSingle();
        if(!error&&data&&normalizePhone(data.phone)===wanted){
          const restored={firstName:data.first_name||'',lastName:data.last_name||'',name:`${data.first_name||''} ${data.last_name||''}`.trim(),username:data.username||'',role:data.role||'',company:data.company||'',phone:data.phone||'',email:data.email||'',birthDate:data.birth_date||'',otpChannel:data.otp_channel||selectedChannel,profileComplete:Boolean(data.profile_complete),signedIn:false,verifiedPhone:Boolean(data.verified_phone),provider:'phone'};
          localStorage.setItem('nexoraAccount',JSON.stringify(restored));return restored;
        }
      }
    }
  }catch(error){console.warn('[Nexora] Supabase account recovery unavailable:',error);}
  return null;
}

document.getElementById('loginForm')?.addEventListener('submit',async e=>{
  e.preventDefault();clearError();
  const phone=document.getElementById('loginPhone').value.trim();
  const stored=await findStoredAccount(phone);
  if(!stored){setError('Aucun compte Nexora correspondant à ce numéro. Vérifiez le numéro ou créez un compte.');return;}
  try{
    const response=await fetch('/api/send-otp',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({phone,channel:selectedChannel})});
    const data=await response.json().catch(()=>({}));
    if(response.ok&&data.configured){
      sessionStorage.setItem('nexoraLoginRealOtp','1');sessionStorage.setItem('nexoraLoginPhone',phone);
      phoneLogin.classList.add('hidden');otpLogin.classList.remove('hidden');document.getElementById('loginOtpNote').textContent=`Un code ${selectedChannel==='whatsapp'?'WhatsApp':'SMS'} réel a été envoyé au ${phone}.`;document.getElementById('loginOtp').focus();return;
    }
  }catch(error){console.warn('[Nexora] real login OTP unavailable:',error);}
  const otp=String(Math.floor(100000+Math.random()*900000));
  sessionStorage.setItem('nexoraLoginOtp',otp);sessionStorage.removeItem('nexoraLoginRealOtp');sessionStorage.setItem('nexoraLoginPhone',phone);sessionStorage.setItem('nexoraLoginChannel',selectedChannel);
  phoneLogin.classList.add('hidden');otpLogin.classList.remove('hidden');document.getElementById('loginOtpNote').textContent=`Mode test local : aucun ${selectedChannel==='whatsapp'?'WhatsApp':'SMS'} réel n'est envoyé. Code de test : ${otp}.`;document.getElementById('loginOtp').focus();
});

document.getElementById('loginOtpForm')?.addEventListener('submit',async e=>{
  e.preventDefault();const code=document.getElementById('loginOtp').value.trim();const phone=sessionStorage.getItem('nexoraLoginPhone')||'';let valid=false;
  if(sessionStorage.getItem('nexoraLoginRealOtp')==='1'){
    try{const response=await fetch('/api/check-otp',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({phone,code})});const data=await response.json().catch(()=>({}));valid=response.ok&&data.ok===true;}catch(error){valid=false;}
  }else valid=code===sessionStorage.getItem('nexoraLoginOtp');
  if(!valid){document.getElementById('loginOtp').setCustomValidity('Code incorrect ou expiré');document.getElementById('loginOtp').reportValidity();return;}
  document.getElementById('loginOtp').setCustomValidity('');const current=JSON.parse(localStorage.getItem('nexoraAccount')||'{}');localStorage.setItem('nexoraAccount',JSON.stringify({...current,signedIn:true,verifiedPhone:true}));localStorage.setItem('nexoraSession','active');sessionStorage.removeItem('nexoraLoginOtp');sessionStorage.removeItem('nexoraLoginRealOtp');sessionStorage.removeItem('nexoraLoginPhone');sessionStorage.removeItem('nexoraLoginChannel');startLoading();
});

async function startOAuth(provider){try{localStorage.setItem('nexoraOAuthFlow','login');const client=await window.NexoraSupabase.getClient();const {error}=await client.auth.signInWithOAuth({provider,options:{redirectTo:`${window.location.origin}/oauth-callback.html#login`}});if(error)throw error;}catch(error){localStorage.removeItem('nexoraOAuthFlow');console.error('[Nexora] OAuth error:',error);showMessage(`Connexion ${provider==='google'?'Google':'Apple'} indisponible. Activez le fournisseur dans Supabase Authentication → Providers.`);}}
document.getElementById('googleLogin')?.addEventListener('click',()=>startOAuth('google'));
document.getElementById('appleLogin')?.addEventListener('click',()=>startOAuth('apple'));

function startLoading(){loginCard.classList.add('hidden');loaderCard.classList.remove('hidden');const loaderText=document.getElementById('loginLoaderText');const status=document.getElementById('loginStatus');const steps=[['Vérification de votre espace Nexora.','Vérification du compte…'],['Récupération de votre profil et de vos préférences.','Profil et préférences…'],['Analyse de votre espace personnalisé.','Analyse Nexora AI…'],['Préparation de votre workspace personnalisé.','Workspace presque prêt…']];const startedAt=Date.now();let i=0;const tick=()=>{if(i<steps.length){loaderText.textContent=steps[i][0];status.textContent=steps[i][1];i++;setTimeout(tick,2500);return;}const remaining=Math.max(0,12000-(Date.now()-startedAt));setTimeout(()=>{status.textContent='✓ Espace prêt';loaderText.textContent='Votre espace Nexora est prêt.';setTimeout(()=>{window.location.href='platform.html';},350);},remaining)};tick();}
