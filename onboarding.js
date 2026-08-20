const questions=[
 {key:'role',title:'Que faites-vous principalement ?',note:'Choisissez l’activité qui représente le mieux votre profil.',options:['Développeur','Designer / Créatif','Marketing / Communication','Consultant / Expert','Commercial','Photographe / Vidéaste','Autre']},
 {key:'level',title:'Quel est votre niveau ?',note:'Cela aide Nexora à mieux calibrer les opportunités proposées.',options:['Débutant','Intermédiaire','Avancé','Professionnel']},
 {key:'skills',title:'Quelles sont vos principales compétences ?',note:'Sélectionnez le domaine qui représente le mieux votre expertise.',options:['Développement web','UI/UX & Design','Branding & Création','Marketing & Réseaux sociaux','Vente & Business','Conseil & Stratégie','Vidéo & Photo']},
 {key:'sector',title:'Dans quels secteurs voulez-vous travailler ?',note:'Votre secteur aide Nexora à filtrer les opportunités.',options:['Tech','Finance','Immobilier','Commerce','Médias & Création','Éducation','Santé','Autre']},
 {key:'zone',title:'Où souhaitez-vous trouver des opportunités ?',note:'Votre préférence de marché sera utilisée par le moteur de matching.',options:['Ma ville','Mon pays','Afrique','International']},
 {key:'clients',title:'Quel type de clients recherchez-vous ?',note:'Vous pourrez changer cette préférence plus tard.',options:['Particuliers','Startups','PME','Grandes entreprises']},
 {key:'goal',title:'Quel est votre objectif principal ?',note:'Nexora adaptera les recommandations à cet objectif.',options:['Trouver mon premier client','Trouver régulièrement des clients','Développer mon activité','Trouver des contrats importants']},
 {key:'availability',title:'Quelle est votre disponibilité ?',note:'Cette information aide à filtrer certaines missions.',options:['Quelques heures par semaine','Mi-temps','Temps plein','Flexible selon le projet']}
];

const state={step:0,answers:{}};
const introStep=document.getElementById('introStep'); const accountCard=document.getElementById('accountCard'); const loadingCard=document.getElementById('loadingCard'); const quizCard=document.getElementById('quizCard'); const analysisCard=document.getElementById('analysisCard');
const startButton=document.getElementById('startButton'); const accountForm=document.getElementById('accountForm'); const nextButton=document.getElementById('nextButton'); const backButton=document.getElementById('backButton');
const stepLabel=document.getElementById('stepLabel'); const percentLabel=document.getElementById('percentLabel'); const progressBar=document.getElementById('progressBar'); const questionTitle=document.getElementById('questionTitle'); const questionNote=document.getElementById('questionNote'); const optionsWrap=document.getElementById('options');

const saveAccount=a=>{localStorage.setItem('nexoraAccount',JSON.stringify(a));localStorage.setItem('nexoraSession','active');};

startButton.addEventListener('click',()=>{introStep.classList.add('hidden');accountCard.classList.remove('hidden');});

accountForm?.addEventListener('submit',e=>{e.preventDefault();saveAccount({name:document.getElementById('nameInput').value.trim(),email:document.getElementById('emailInput').value.trim(),provider:'email',profileComplete:false,createdAt:new Date().toISOString()});beginLoading();});

document.getElementById('googleButton')?.addEventListener('click',()=>{saveAccount({name:'Google User',email:'google-user@nexora.demo',provider:'google',profileComplete:false,createdAt:new Date().toISOString(),demo:true});beginLoading();});
document.getElementById('appleButton')?.addEventListener('click',()=>{saveAccount({name:'Apple User',email:'apple-user@nexora.demo',provider:'apple',profileComplete:false,createdAt:new Date().toISOString(),demo:true});beginLoading();});

function beginLoading(){accountCard.classList.add('hidden');loadingCard.classList.remove('hidden');document.getElementById('loadStep1').classList.add('active');document.getElementById('loadingTitle').textContent='Préparation de votre espace…';document.getElementById('loadingText').textContent='Votre compte est prêt. Nous ouvrons maintenant le quiz Nexora.';setTimeout(openQuiz,1200);}
function openQuiz(){loadingCard.classList.add('hidden');quizCard.classList.remove('hidden');renderQuestion();}

function renderQuestion(){const q=questions[state.step];const selected=state.answers[q.key];const pct=Math.round(((state.step+1)/questions.length)*100);stepLabel.textContent=`Étape ${state.step+1} sur ${questions.length}`;percentLabel.textContent=`${pct}%`;progressBar.style.width=`${pct}%`;questionTitle.textContent=q.title;questionNote.textContent=q.note;optionsWrap.innerHTML='';q.options.forEach(label=>{const button=document.createElement('button');button.className='option'+(selected===label?' selected':'');button.type='button';button.innerHTML=`<span>${label}</span><span>${selected===label?'✓':'›'}</span>`;button.addEventListener('click',()=>{state.answers[q.key]=label;renderQuestion();});optionsWrap.appendChild(button);});backButton.style.visibility=state.step===0?'hidden':'visible';nextButton.textContent=state.step===questions.length-1?'Terminer mon profil →':'Continuer →';}

backButton.addEventListener('click',()=>{if(state.step>0){state.step-=1;renderQuestion();}});
nextButton.addEventListener('click',()=>{const q=questions[state.step];if(!state.answers[q.key]){nextButton.textContent='Choisissez une réponse';setTimeout(()=>{nextButton.textContent=state.step===questions.length-1?'Terminer mon profil →':'Continuer →';},1300);return;}if(state.step<questions.length-1){state.step+=1;renderQuestion();return;}finishProfile();});

function finishProfile(){localStorage.setItem('nexoraProfile',JSON.stringify(state.answers));const account=JSON.parse(localStorage.getItem('nexoraAccount')||'{}');localStorage.setItem('nexoraAccount',JSON.stringify({...account,profileComplete:true}));quizCard.classList.add('hidden');analysisCard.classList.remove('hidden');runAnalysis();}

function runAnalysis(){const title=document.getElementById('analysisTitle');const text=document.getElementById('analysisText');const s2=document.getElementById('analysis2');const s3=document.getElementById('analysis3');setTimeout(()=>{s2.textContent='✓ Compétences et objectifs identifiés';},700);setTimeout(()=>{s3.textContent='✓ Opportunités adaptées préparées';},1300);setTimeout(()=>{title.textContent='Votre espace Nexora est prêt.';text.textContent='Votre profil a été enregistré. Nous vous ouvrons maintenant votre véritable plateforme.';setTimeout(()=>{window.location.href='platform.html';},900);},1900);}
