const roleFlows={
 'Développeur':{skills:['Développement web','Frontend & JavaScript','Backend & API','Applications mobiles'],sector:['Tech','SaaS','E-commerce','Finance & Fintech'],service:['Créer un site web','Développer une application','Améliorer un produit existant','Créer une API ou automatisation'],goal:['Trouver des contrats web','Trouver des projets techniques','Trouver des clients réguliers','Développer mon activité de développement']},
 'Designer / Créatif':{skills:['UI/UX & Design','Branding & Création','Graphisme','Design produit'],sector:['Tech','Commerce','Médias & Création','Mode & Lifestyle'],service:['Créer une identité visuelle','Designer une application ou un site','Créer des supports marketing','Refondre une marque'],goal:['Trouver des projets design','Trouver des contrats créatifs','Trouver des clients réguliers','Développer mon activité créative']},
 'Marketing / Communication':{skills:['Marketing digital','Réseaux sociaux','Publicité en ligne','Content marketing'],sector:['Commerce','Médias & Création','Éducation','Tech'],service:['Gérer les réseaux sociaux','Lancer une campagne marketing','Créer une stratégie digitale','Développer une audience'],goal:['Trouver des missions marketing','Trouver des contrats réguliers','Développer mon portefeuille clients','Développer mon activité marketing']},
 'Consultant / Expert':{skills:['Conseil & Stratégie','Finance & Analyse','Business development','Management'],sector:['Finance','Immobilier','Commerce','Tech'],service:['Conseil stratégique','Analyser une activité','Structurer une entreprise','Accompagner une transformation'],goal:['Trouver des missions de conseil','Trouver des contrats importants','Trouver des clients réguliers','Développer mon activité de conseil']},
 'Commercial':{skills:['Vente & Business','Prospection commerciale','Négociation','Business development'],sector:['Commerce','Immobilier','Tech','Services'],service:['Développer les ventes','Faire de la prospection','Trouver des clients','Mettre en place un processus commercial'],goal:['Trouver des missions commerciales','Trouver des contrats réguliers','Développer mon portefeuille clients','Augmenter mes opportunités commerciales']},
 'Photographe / Vidéaste':{skills:['Photographie','Vidéo & Montage','Portrait & Événementiel','Création de contenu'],sector:['Médias & Création','Événementiel','Mode & Lifestyle','Commerce'],service:['Photographier un événement','Créer du contenu vidéo','Faire une campagne photo','Produire du contenu pour une marque'],goal:['Trouver des contrats photo/vidéo','Trouver des événements','Trouver des clients réguliers','Développer mon activité créative']},
 'Autre':{skills:['Service professionnel','Création','Conseil','Vente & Business'],sector:['Commerce','Tech','Services','Médias & Création'],service:['Trouver des missions liées à mon expertise','Trouver des clients','Développer mon activité','Trouver des contrats'],goal:['Trouver mon premier client','Trouver régulièrement des clients','Développer mon activité','Trouver des contrats importants']}
};
const common={level:['Débutant','Intermédiaire','Avancé','Professionnel'],zone:['Ma ville','Mon pays','Afrique','International'],clients:['Particuliers','Startups','PME','Grandes entreprises'],availability:['Quelques heures par semaine','Mi-temps','Temps plein','Flexible selon le projet']};
function buildQuestions(role='Autre'){const f=roleFlows[role]||roleFlows.Autre;return[
 {key:'role',title:'Que faites-vous principalement ?',note:'Votre choix définit les questions spécialisées de votre profil.',options:Object.keys(roleFlows)},
 {key:'level',title:`Quel est votre niveau en ${role.toLowerCase()} ?`,note:'Nexora adapte ensuite les opportunités à votre niveau.',options:common.level},
 {key:'skills',title:`Quelles sont vos compétences principales en ${role.toLowerCase()} ?`,note:'Ces choix restent strictement liés à votre activité.',options:f.skills},
 {key:'sector',title:`Dans quels secteurs voulez-vous travailler en tant que ${role.toLowerCase()} ?`,note:'Les secteurs proposés sont adaptés à votre activité.',options:f.sector},
 {key:'service',title:`Quel service voulez-vous principalement proposer comme ${role.toLowerCase()} ?`,note:'Cette réponse devient un critère central du moteur de matching.',options:f.service},
 {key:'zone',title:'Où souhaitez-vous trouver des opportunités ?',note:'Votre marché cible sera utilisé par le moteur de matching.',options:common.zone},
 {key:'clients',title:'Quel type de clients recherchez-vous ?',note:'Nexora utilisera ce choix pour affiner les prospects.',options:common.clients},
 {key:'goal',title:`Quel est votre objectif principal en ${role.toLowerCase()} ?`,note:'Votre objectif doit rester cohérent avec votre activité.',options:f.goal},
 {key:'availability',title:'Quelle est votre disponibilité ?',note:'Cette information aide à filtrer certaines missions.',options:common.availability}
]}
let questions=buildQuestions('Autre');
const state={step:0,answers:{}};
const introStep=document.getElementById('introStep'),accountCard=document.getElementById('accountCard'),loadingCard=document.getElementById('loadingCard'),quizCard=document.getElementById('quizCard'),analysisCard=document.getElementById('analysisCard');
const startButton=document.getElementById('startButton'),accountForm=document.getElementById('accountForm'),nextButton=document.getElementById('nextButton'),backButton=document.getElementById('backButton');
const stepLabel=document.getElementById('stepLabel'),percentLabel=document.getElementById('percentLabel'),progressBar=document.getElementById('progressBar'),questionTitle=document.getElementById('questionTitle'),questionNote=document.getElementById('questionNote'),optionsWrap=document.getElementById('options');
const transition=(hideEl,showEl)=>{hideEl?.classList.add('hidden');showEl?.classList.remove('hidden')};
const readAccountForm=()=>({
 firstName:document.getElementById('firstNameInput')?.value.trim()||'',
 lastName:document.getElementById('lastNameInput')?.value.trim()||'',
 username:document.getElementById('usernameInput')?.value.trim()||'',
 role:document.getElementById('roleInput')?.value.trim()||'',
 company:document.getElementById('companyInput')?.value.trim()||'',
 phone:document.getElementById('phoneInput')?.value.trim()||'',
 email:document.getElementById('emailInput')?.value.trim()||'',
 birthDate:document.getElementById('birthDateInput')?.value||'',
 otpChannel:document.querySelector('input[name="otpChannel"]:checked')?.value||'sms'
});
const saveAccount=a=>{localStorage.setItem('nexoraAccount',JSON.stringify(a));localStorage.setItem('nexoraSession','active')};
startButton?.addEventListener('click',()=>transition(introStep,accountCard));
accountForm?.addEventListener('submit',async e=>{
 e.preventDefault();
 const account=readAccountForm();
 try{
  if(window.NexoraSupabasePersistence?.saveProfileFromForm){await window.NexoraSupabasePersistence.saveProfileFromForm();}
  saveAccount({...account,provider:'phone',profileComplete:false,createdAt:new Date().toISOString()});
  beginLoading();
 }catch(error){
  console.error('[Nexora] Account save failed:',error);
  const note=document.querySelector('.account-note');
  if(note) note.textContent='Impossible d’enregistrer votre compte pour le moment. Vérifiez la connexion à Supabase puis réessayez.';
 }
});
function beginLoading(){transition(accountCard,loadingCard);const title=document.getElementById('loadingTitle'),text=document.getElementById('loadingText'),s1=document.getElementById('loadStep1'),s2=document.getElementById('loadStep2'),s3=document.getElementById('loadStep3');title.textContent='Préparation de votre espace…';text.textContent='Compte enregistré. Nous préparons le quiz Nexora.';s1.classList.add('active');setTimeout(()=>{s1.classList.remove('active');s1.classList.add('done');s2.classList.add('active');title.textContent='Chargement du quiz…';text.textContent='Nous préparons un parcours adapté à votre activité.'},5000);setTimeout(()=>{s2.classList.remove('active');s2.classList.add('done');s3.classList.add('active');title.textContent='Votre espace est prêt à être personnalisé';text.textContent='Encore une étape : répondre au quiz.'},10000);setTimeout(()=>{transition(loadingCard,quizCard);renderQuestion()},15000)}
function renderQuestion(){const q=questions[state.step],selected=state.answers[q.key],pct=Math.round(((state.step+1)/questions.length)*100);stepLabel.textContent=`Étape ${state.step+1} sur ${questions.length}`;percentLabel.textContent=`${pct}%`;progressBar.style.width=`${pct}%`;questionTitle.textContent=q.title;questionNote.textContent=q.note;optionsWrap.innerHTML='';q.options.forEach(label=>{const button=document.createElement('button');button.className='option'+(selected===label?' selected':'');button.type='button';button.innerHTML=`<span>${label}</span><span>${selected===label?'✓':'›'}</span>`;button.addEventListener('click',()=>{state.answers[q.key]=label;if(q.key==='role'){questions=buildQuestions(label);Object.keys(state.answers).filter(k=>k!=='role').forEach(k=>delete state.answers[k]);state.step=0}renderQuestion()});optionsWrap.appendChild(button)});backButton.style.visibility=state.step===0?'hidden':'visible';nextButton.textContent=state.step===questions.length-1?'Terminer mon profil →':'Continuer →'}
backButton?.addEventListener('click',()=>{if(state.step>0){state.step-=1;renderQuestion()}});
nextButton?.addEventListener('click',async()=>{const q=questions[state.step];if(!state.answers[q.key]){nextButton.textContent='Choisissez une réponse';setTimeout(renderQuestion,1300);return}if(state.step<questions.length-1){state.step+=1;renderQuestion();return}await finishProfile()});
async function finishProfile(){
 localStorage.setItem('nexoraProfile',JSON.stringify(state.answers));
 const account=JSON.parse(localStorage.getItem('nexoraAccount')||'{}');
 try{
  if(window.NexoraSupabasePersistence?.saveQuizProfile){await window.NexoraSupabasePersistence.saveQuizProfile();}
  localStorage.setItem('nexoraAccount',JSON.stringify({...account,profileComplete:true,signedIn:true}));
 }catch(error){
  console.error('[Nexora] Quiz save failed:',error);
  nextButton.textContent='Erreur d’enregistrement — réessayez';
  return;
 }
 transition(quizCard,analysisCard);runAnalysis();
}
function runAnalysis(){const title=document.getElementById('analysisTitle'),text=document.getElementById('analysisText'),s2=document.getElementById('analysis2'),s3=document.getElementById('analysis3');title.textContent='Analyse de votre profil…';text.textContent='Toutes vos réponses sont enregistrées et Nexora prépare vos critères de matching.';setTimeout(()=>{s2.textContent='✓ Activité, compétences, secteur et service analysés';title.textContent='Votre profil est compris.';text.textContent='Nexora construit votre modèle de recherche à partir de toutes vos réponses.'},4000);setTimeout(()=>{s3.textContent='✓ Critères de recherche personnalisés préparés';title.textContent='Activation du moteur Auto-Match.';text.textContent='Nexora commence à comparer les opportunités compatibles avec votre profil.'},8000);setTimeout(async()=>{title.textContent='Recherche des meilleures opportunités…';text.textContent='Nexora compare les possibilités compatibles avec votre activité et vos objectifs.';try{localStorage.removeItem('nexoraPreparedMatches');localStorage.removeItem('nexoraAIMatchedAt');if(window.NexoraPrepareQuizMatches)await window.NexoraPrepareQuizMatches();}catch(e){console.warn('Quiz AI preparation unavailable',e)}},11000);setTimeout(()=>{title.textContent='Votre espace Nexora est prêt.';text.textContent='Ouverture de votre plateforme…'},13500);setTimeout(()=>{window.location.href='platform.html'},15000)}