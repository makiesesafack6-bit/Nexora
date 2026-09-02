const loginCard=document.getElementById('loginCard');
const loaderCard=document.getElementById('loaderCard');
const phoneLogin=document.getElementById('phoneLogin');
const otpLogin=document.getElementById('otpLogin');
const savedSession=document.getElementById('savedSession');
const account=JSON.parse(localStorage.getItem('nexoraAccount')||'null');
const sessionActive=localStorage.getItem('nexoraSession')==='active';

function normalizePhone(value=''){
  const digits=String(value).replace(/\D/g,'');
  return digits.startsWith('243') ? digits.slice(-9) : digits.slice(-9);
}

function setError(message){
  const input=document.getElementById('loginPhone');
  if(!input)return;
  input.setCustomValidity(message);
  input.reportValidity();
}

function clearError(){
  const input=document.getElementById('loginPhone');
  if(input) input.setCustomValidity('');
}

if(account&&sessionActive){
  document.getElementById('savedName').textContent=`Bienvenue, ${account.firstName||account.name||account.username||'sur Nexora'} 👋`;
  document.getElementById('savedMeta').textContent=`${account.username||account.phone||''} · session enregistrée sur cet appareil`;
  savedSession.classList.remove('hidden');
}

document.getElementById('continueSession')?.addEventListener('click',()=>{
  if(account){
    account.signedIn=true;
    localStorage.setItem('nexoraAccount',JSON.stringify(account));
    startLoading();
  }
});

document.getElementById('changeAccount')?.addEventListener('click',()=>{
  savedSession.classList.add('hidden');
  localStorage.removeItem('nexoraSession');
  phoneLogin.classList.remove('hidden');
});

let selectedChannel='sms';
document.querySelectorAll('.channel').forEach(btn=>btn.addEventListener('click',()=>{
  selectedChannel=btn.dataset.channel;
  document.getElementById('loginChannel').value=selectedChannel;
  document.querySelectorAll('.channel').forEach(b=>b.classList.toggle('active',b===btn));
}));

async function findStoredAccount(phone){
  const wanted=normalizePhone(phone);
  const local=JSON.parse(localStorage.getItem('nexoraAccount')||'null');
  if(local&&normalizePhone(local.phone)===wanted) return local;

  // Recover an account on the same device when a Supabase session is already
  // linked to a profile. This is intentionally limited to the current auth ID.
  try{
    if(window.NexoraSupabase?.getClient){
      const client=await window.NexoraSupabase.getClient();
      const current=await client.auth.getSession();
      const uid=current.data?.session?.user?.id;
      if(uid){
        const {data,error}=await client
          .from('profiles')
          .select('id,phone,email,first_name,last_name,username,role,company,birth_date,otp_channel,profile_complete,verified_phone')
          .eq('id',uid)
          .maybeSingle();
        if(!error&&data&&normalizePhone(data.phone)===wanted){
          const restored={
            firstName:data.first_name||'',
            lastName:data.last_name||'',
            name:`${data.first_name||''} ${data.last_name||''}`.trim(),
            username:data.username||'',
            role:data.role||'',
            company:data.company||'',
            phone:data.phone||'',
            email:data.email||'',
            birthDate:data.birth_date||'',
            otpChannel:data.otp_channel||selectedChannel,
            profileComplete:Boolean(data.profile_complete),
            signedIn:false,
            verifiedPhone:Boolean(data.verified_phone),
            provider:'phone'
          };
          localStorage.setItem('nexoraAccount',JSON.stringify(restored));
          return restored;
        }
      }
    }
  }catch(error){
    console.warn('[Nexora] Supabase account recovery unavailable:',error);
  }
  return null;
}

document.getElementById('loginForm')?.addEventListener('submit',async e=>{
  e.preventDefault();
  clearError();
  const phone=document.getElementById('loginPhone').value.trim();
  const stored=await findStoredAccount(phone);
  if(!stored){
    setError('Aucun compte Nexora correspondant à ce numéro sur cet appareil. Vérifiez le numéro ou créez un compte.');
    return;
  }

  // Current local-test fallback. Replace with real SMS/WhatsApp verification
  // when the production OTP provider is configured.
  const otp=String(Math.floor(100000+Math.random()*900000));
  sessionStorage.setItem('nexoraLoginOtp',otp);
  sessionStorage.setItem('nexoraLoginPhone',normalizePhone(phone));
  sessionStorage.setItem('nexoraLoginChannel',selectedChannel);
  phoneLogin.classList.add('hidden');
  otpLogin.classList.remove('hidden');
  document.getElementById('loginOtpNote').textContent=`Mode test local : aucun ${selectedChannel==='whatsapp'?'WhatsApp':'SMS'} réel n'est envoyé. Code de test : ${otp}.`;
  document.getElementById('loginOtp').focus();
});

document.getElementById('loginOtpForm')?.addEventListener('submit',e=>{
  e.preventDefault();
  const code=document.getElementById('loginOtp').value.trim();
  const expected=sessionStorage.getItem('nexoraLoginOtp');
  if(code!==expected){
    document.getElementById('loginOtp').setCustomValidity('Code incorrect');
    document.getElementById('loginOtp').reportValidity();
    return;
  }
  document.getElementById('loginOtp').setCustomValidity('');
  const current=JSON.parse(localStorage.getItem('nexoraAccount')||'{}');
  localStorage.setItem('nexoraAccount',JSON.stringify({...current,signedIn:true,verifiedPhone:true}));
  localStorage.setItem('nexoraSession','active');
  sessionStorage.removeItem('nexoraLoginOtp');
  sessionStorage.removeItem('nexoraLoginPhone');
  sessionStorage.removeItem('nexoraLoginChannel');
  startLoading();
});

function startLoading(){
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
    setTimeout(()=>{
      status.textContent='✓ Espace prêt';
      loaderText.textContent='Votre espace Nexora est prêt.';
      setTimeout(()=>{window.location.href='platform.html';},350);
    },remaining);
  };
  tick();
}
