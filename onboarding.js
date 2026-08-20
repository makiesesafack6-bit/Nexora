const questions = [
  {key:'role',title:'Que faites-vous principalement ?',note:'Choisissez l’activité qui représente le mieux votre profil.',options:['Développeur','Designer / Créatif','Marketing / Communication','Consultant / Expert','Commercial','Photographe / Vidéaste','Autre']},
  {key:'level',title:'Quel est votre niveau ?',note:'Cela aide Nexora à mieux calibrer les opportunités proposées.',options:['Débutant','Intermédiaire','Avancé','Professionnel']},
  {key:'skills',title:'Quelles sont vos principales compétences ?',note:'Sélectionnez jusqu’à 3 domaines.',options:['Développement web','UI/UX & Design','Branding & Création','Marketing & Réseaux sociaux','Vente & Business','Conseil & Stratégie','Vidéo & Photo']},
  {key:'sector',title:'Dans quels secteurs voulez-vous travailler ?',note:'Sélectionnez le secteur qui vous attire le plus.',options:['Tech','Finance','Immobilier','Commerce','Médias & Création','Éducation','Santé','Autre']},
  {key:'zone',title:'Où souhaitez-vous trouver des opportunités ?',note:'Votre préférence de marché sera utilisée par le moteur de matching.',options:['Ma ville','Mon pays','Afrique','International']},
  {key:'clients',title:'Quel type de clients recherchez-vous ?',note:'Vous pourrez changer cette préférence plus tard.',options:['Particuliers','Startups','PME','Grandes entreprises']},
  {key:'goal',title:'Quel est votre objectif principal ?',note:'Nexora adaptera les recommandations à cet objectif.',options:['Trouver mon premier client','Trouver régulièrement des clients','Développer mon activité','Trouver des contrats importants']},
  {key:'availability',title:'Quelle est votre disponibilité ?',note:'Cette information aide à filtrer certaines missions.',options:['Quelques heures par semaine','Mi-temps','Temps plein','Flexible selon le projet']}
];

const state = {step:0,answers:{}};
const introStep=document.getElementById('introStep');
const quizCard=document.getElementById('quizCard');
const resultCard=document.getElementById('resultCard');
const startButton=document.getElementById('startButton');
const nextButton=document.getElementById('nextButton');
const backButton=document.getElementById('backButton');
const stepLabel=document.getElementById('stepLabel');
const percentLabel=document.getElementById('percentLabel');
const progressBar=document.getElementById('progressBar');
const questionTitle=document.getElementById('questionTitle');
const questionNote=document.getElementById('questionNote');
const optionsWrap=document.getElementById('options');

const renderQuestion=()=>{
  const q=questions[state.step];
  const selected=state.answers[q.key];
  const pct=Math.round(((state.step+1)/questions.length)*100);
  stepLabel.textContent=`Étape ${state.step+1} sur ${questions.length}`;
  percentLabel.textContent=`${pct}%`;
  progressBar.style.width=`${pct}%`;
  questionTitle.textContent=q.title;
  questionNote.textContent=q.note;
  optionsWrap.innerHTML='';
  q.options.forEach((label,index)=>{
    const button=document.createElement('button');
    button.className='option';
    button.type='button';
    button.dataset.value=label;
    button.innerHTML=`<span>${label}</span><span>${selected===label?'✓':'›'}</span>`;
    if(selected===label) button.classList.add('selected');
    button.addEventListener('click',()=>{
      state.answers[q.key]=label;
      renderQuestion();
    });
    optionsWrap.appendChild(button);
  });
  backButton.style.visibility=state.step===0?'hidden':'visible';
  nextButton.textContent=state.step===questions.length-1?'Créer mon profil →':'Continuer →';
};

startButton.addEventListener('click',()=>{
  introStep.classList.add('hidden');
  quizCard.classList.remove('hidden');
  renderQuestion();
});

backButton.addEventListener('click',()=>{
  if(state.step>0){state.step-=1;renderQuestion();}
});

nextButton.addEventListener('click',()=>{
  const q=questions[state.step];
  if(!state.answers[q.key]){
    nextButton.textContent='Choisissez une réponse';
    window.setTimeout(()=>{nextButton.textContent=state.step===questions.length-1?'Créer mon profil →':'Continuer →';},1400);
    return;
  }
  if(state.step<questions.length-1){state.step+=1;renderQuestion();return;}
  finishProfile();
});

function finishProfile(){
  localStorage.setItem('nexoraProfile',JSON.stringify(state.answers));
  quizCard.classList.add('hidden');
  resultCard.classList.remove('hidden');
  const role=state.answers.role||'Professionnel';
  const zone=state.answers.zone||'International';
  document.getElementById('resultRole').textContent=role;
  document.getElementById('resultZone').textContent=zone;
  document.getElementById('resultAvatar').textContent=role.charAt(0).toUpperCase();
  document.getElementById('resultTitle').textContent=`Votre profil ${role.toLowerCase()} est prêt.`;
  document.getElementById('resultDetails').innerHTML=`
    <div class="detail-card"><small>Niveau</small><strong>${state.answers.level||'À définir'}</strong></div>
    <div class="detail-card"><small>Secteur</small><strong>${state.answers.sector||'À définir'}</strong></div>
    <div class="detail-card"><small>Clients recherchés</small><strong>${state.answers.clients||'À définir'}</strong></div>
    <div class="detail-card"><small>Objectif</small><strong>${state.answers.goal||'À définir'}</strong></div>
    <div class="detail-card" style="grid-column:1/-1"><small>Compétences</small><div class="chip-row"><span class="chip">${state.answers.skills||'À définir'}</span><span class="chip">${zone}</span><span class="chip">${state.answers.availability||'Flexible'}</span></div></div>`;
}

document.getElementById('openDashboard').addEventListener('click',()=>{
  window.location.href='index.html#dashboard';
});
