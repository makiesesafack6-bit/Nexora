(function(){
  const form=document.getElementById('accountForm');
  const accountCard=document.getElementById('accountCard');
  const otpCard=document.getElementById('otpCard');
  const otpForm=document.getElementById('otpForm');
  const loadingCard=document.getElementById('loadingCard');
  if(!form||!otpForm)return;
  const transition=(a,b)=>{a?.classList.add('hidden');b?.classList.remove('hidden')};
  const hash=async value=>{const data=new TextEncoder().encode(value);const digest=await crypto.subtle.digest('SHA-256',data);return Array.from(new Uint8Array(digest)).map(x=>x.toString(16).padStart(2,'0')).join('')};
  let pending=null;
  form.addEventListener('submit',async e=>{
    e.preventDefault();e.stopImmediatePropagation();
    const fd=new FormData(form);const phone=String(fd.get('phone')||'').trim();const channel=String(fd.get('otpChannel')||'sms');
    const account={firstName:String(fd.get('firstName')||'').trim(),lastName:String(fd.get('lastName')||'').trim(),name:(String(fd.get('firstName')||'').trim()+' '+String(fd.get('lastName')||'').trim()).trim(),username:String(fd.get('username')||'').trim(),role:String(fd.get('role')||'').trim(),company:String(fd.get('company')||'').trim(),phone,email:String(fd.get('email')||'').trim(),birthDate:String(fd.get('birthDate')||''),otpChannel:channel,provider:'phone',profileComplete:false,createdAt:new Date().toISOString()};
    const password=String(fd.get('password')||'');account.passwordHash=await hash(password);pending=account;
    const otp=String(Math.floor(100000+Math.random()*900000));sessionStorage.setItem('nexoraPendingOtp',otp);sessionStorage.setItem('nexoraPendingPhone',phone);
    document.getElementById('otpChannelBadge').textContent=channel==='whatsapp'?'WHATSAPP':'SMS';document.getElementById('otpText').textContent=`Le code de vérification sera envoyé par ${channel==='whatsapp'?'WhatsApp':'SMS'} au ${phone}.`;
    document.getElementById('otpDemoNote').textContent=`Mode prototype : aucun message réel n'est envoyé. Code de test : ${otp}. Le vrai fournisseur SMS/WhatsApp sera branché ensuite.`;
    transition(accountCard,otpCard);document.getElementById('otpInput').focus();
  },true);
  otpForm.addEventListener('submit',e=>{e.preventDefault();e.stopImmediatePropagation();const entered=document.getElementById('otpInput').value.trim();const expected=sessionStorage.getItem('nexoraPendingOtp');if(entered!==expected){document.getElementById('otpInput').setCustomValidity('Code incorrect');document.getElementById('otpInput').reportValidity();return}document.getElementById('otpInput').setCustomValidity('');localStorage.setItem('nexoraAccount',JSON.stringify({...pending,signedIn:true,verifiedPhone:true}));localStorage.setItem('nexoraSession','active');sessionStorage.removeItem('nexoraPendingOtp');sessionStorage.removeItem('nexoraPendingPhone');transition(otpCard,loadingCard);const title=document.getElementById('loadingTitle'),text=document.getElementById('loadingText'),s1=document.getElementById('loadStep1'),s2=document.getElementById('loadStep2'),s3=document.getElementById('loadStep3');title.textContent='Compte vérifié.';text.textContent='Votre session Nexora est enregistrée sur cet appareil.';s1.classList.add('active');setTimeout(()=>{s1.classList.remove('active');s1.classList.add('done');s2.classList.add('active');title.textContent='Préparation du quiz…';text.textContent='Nous adaptons les prochaines questions à votre profil.'},5000);setTimeout(()=>{s2.classList.remove('active');s2.classList.add('done');s3.classList.add('active');title.textContent='Votre espace est presque prêt.';text.textContent='Répondez maintenant au quiz Nexora.'},10000);setTimeout(()=>{transition(loadingCard,document.getElementById('quizCard'));if(typeof renderQuestion==='function')renderQuestion()},15000)} ,true);
})();