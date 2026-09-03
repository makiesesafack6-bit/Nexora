(function(){
  const form=document.getElementById('accountForm');
  const accountCard=document.getElementById('accountCard');
  const otpCard=document.getElementById('otpCard');
  const otpForm=document.getElementById('otpForm');
  const loadingCard=document.getElementById('loadingCard');
  if(!form||!otpForm)return;

  const transition=(a,b)=>{a?.classList.add('hidden');b?.classList.remove('hidden')};
  const hash=async value=>{const data=new TextEncoder().encode(value);const digest=await crypto.subtle.digest('SHA-256',data);return Array.from(new Uint8Array(digest)).map(x=>x.toString(16).padStart(2,'0')).join('')};
  let pending=null; let realOtp=false;

  // Google signup is injected here so the same onboarding UI works even when
  // the user has no mobile number. The OAuth callback creates the profile and
  // returns to Nexora.
  const googleWrap=document.createElement('div');
  googleWrap.style.cssText='display:grid;gap:10px;margin:20px 0 8px';
  const googleButton=document.createElement('button');
  googleButton.type='button';
  googleButton.textContent='Continuer avec Google →';
  googleButton.style.cssText='min-height:48px;border:1px solid rgba(255,255,255,.12);border-radius:13px;background:rgba(255,255,255,.045);color:#f4f7ff;font:700 12px DM Sans,cursive;cursor:pointer';
  googleButton.addEventListener('click',async()=>{
    googleButton.disabled=true;
    googleButton.textContent='Redirection vers Google…';
    try{
      const client=await window.NexoraSupabase.getClient();
      const {error}=await client.auth.signInWithOAuth({provider:'google',options:{redirectTo:`${window.location.origin}/oauth-callback.html`,queryParams:{prompt:'select_account'}}});
      if(error)throw error;
    }catch(error){
      console.error('[Nexora] Google signup error:',error);
      googleButton.disabled=false;
      googleButton.textContent='Continuer avec Google →';
      const note=document.getElementById('otpDemoNote');
      if(note)note.textContent='Connexion Google indisponible. Vérifiez Google dans Supabase → Authentication → Providers.';
    }
  });
  googleWrap.appendChild(googleButton);
  const divider=document.createElement('div');
  divider.textContent='OU AVEC VOTRE NUMÉRO';
  divider.style.cssText='text-align:center;margin:8px 0 18px;color:#748096;font-size:9px;font-weight:800;letter-spacing:.12em';
  form.parentNode.insertBefore(googleWrap,form);
  form.parentNode.insertBefore(divider,form);

  form.addEventListener('submit',async e=>{
    e.preventDefault();
    const fd=new FormData(form);
    const phone=String(fd.get('phone')||'').trim();
    const channel=String(fd.get('otpChannel')||'sms');
    if(!phone)return;
    const account={firstName:String(fd.get('firstName')||'').trim(),lastName:String(fd.get('lastName')||'').trim(),name:(String(fd.get('firstName')||'').trim()+' '+String(fd.get('lastName')||'').trim()).trim(),username:String(fd.get('username')||'').trim(),role:String(fd.get('role')||'').trim(),company:String(fd.get('company')||'').trim(),phone,email:String(fd.get('email')||'').trim(),birthDate:String(fd.get('birthDate')||''),otpChannel:channel,provider:'phone',profileComplete:false,createdAt:new Date().toISOString()};
    const password=String(fd.get('password')||'');account.passwordHash=await hash(password);pending=account;realOtp=false;
    try{
      const response=await fetch('/api/send-otp',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({phone,channel})});
      const data=await response.json().catch(()=>({}));
      if(response.ok&&data.configured){realOtp=true;document.getElementById('otpDemoNote').textContent='Un code de vérification réel vient d’être envoyé. Ne le partagez avec personne.';}
      else {const otp=String(Math.floor(100000+Math.random()*900000));sessionStorage.setItem('nexoraPendingOtp',otp);document.getElementById('otpDemoNote').textContent=`Mode test local : code ${otp}. Configurez le fournisseur OTP pour passer en envoi réel.`}
    }catch(error){const otp=String(Math.floor(100000+Math.random()*900000));sessionStorage.setItem('nexoraPendingOtp',otp);document.getElementById('otpDemoNote').textContent=`Mode test local : service OTP indisponible. Code ${otp}.`}
    sessionStorage.setItem('nexoraPendingPhone',phone);document.getElementById('otpChannelBadge').textContent=channel==='whatsapp'?'WHATSAPP':'SMS';document.getElementById('otpText').textContent=`Le code de vérification ${realOtp?'a été envoyé':'est préparé en mode test'} par ${channel==='whatsapp'?'WhatsApp':'SMS'} au ${phone}.`;transition(accountCard,otpCard);document.getElementById('otpInput').focus();
  });

  otpForm.addEventListener('submit',async e=>{
    e.preventDefault();
    const entered=document.getElementById('otpInput').value.trim();let valid=false;
    if(realOtp){try{const response=await fetch('/api/check-otp',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({phone:pending.phone,code:entered})});const data=await response.json().catch(()=>({}));valid=response.ok&&data.ok===true;}catch(error){valid=false;}}
    else{valid=entered===sessionStorage.getItem('nexoraPendingOtp');}
    if(!valid){document.getElementById('otpInput').setCustomValidity('Code incorrect ou expiré');document.getElementById('otpInput').reportValidity();return;}
    document.getElementById('otpInput').setCustomValidity('');
    try{
      if(window.NexoraSupabasePersistence?.saveProfileFromForm){await window.NexoraSupabasePersistence.saveProfileFromForm();}
      if(window.NexoraSaveAccount){window.NexoraSaveAccount({...pending,signedIn:true,verifiedPhone:true});}else{localStorage.setItem('nexoraAccount',JSON.stringify({...pending,signedIn:true,verifiedPhone:true}));localStorage.setItem('nexoraSession','active');}
    }catch(error){
      console.error('[Nexora] Supabase profile save failed after OTP:',error);
      const note=document.getElementById('otpDemoNote');const message=String(error?.message||'erreur inconnue');
      if(error?.code==='23505'||/profiles_phone_key|duplicate key value/i.test(message)){if(note)note.textContent='Ce numéro est déjà associé à un compte Nexora. Utilisez Connexion ou un autre numéro.';}else if(note){note.textContent=`Impossible d’enregistrer le compte : ${message.slice(0,160)}`;}
      return;
    }
    sessionStorage.removeItem('nexoraPendingOtp');sessionStorage.removeItem('nexoraPendingPhone');transition(otpCard,loadingCard);
    if(window.NexoraBeginLoading){window.NexoraBeginLoading();return;}
    const title=document.getElementById('loadingTitle'),text=document.getElementById('loadingText'),s1=document.getElementById('loadStep1'),s2=document.getElementById('loadStep2'),s3=document.getElementById('loadStep3');title.textContent='Compte vérifié.';text.textContent='Votre session Nexora est enregistrée sur cet appareil.';s1.classList.add('active');setTimeout(()=>{s1.classList.remove('active');s1.classList.add('done');s2.classList.add('active');title.textContent='Préparation du quiz…';text.textContent='Nous adaptons les prochaines questions à votre profil.'},1400);setTimeout(()=>{s2.classList.remove('active');s2.classList.add('done');s3.classList.add('active');title.textContent='Votre espace est presque prêt.';text.textContent='Répondez maintenant au quiz Nexora.'},2800);setTimeout(()=>{transition(loadingCard,document.getElementById('quizCard'));if(typeof renderQuestion==='function')renderQuestion()},4200);
  });
})();
