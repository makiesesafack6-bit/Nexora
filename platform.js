const profile = JSON.parse(localStorage.getItem('nexoraProfile') || '{}');
const account = JSON.parse(localStorage.getItem('nexoraAccount') || '{}');
const role = profile.role || 'Professionnel';
const zone = profile.zone || 'International';
const sector = profile.sector || 'Tech';
const clients = profile.clients || 'PME';
const goal = profile.goal || 'Trouver des clients';
const name = account.name || 'Votre profil';

document.getElementById('userName').textContent = name;
document.getElementById('userAvatar').textContent = name.charAt(0).toUpperCase();
document.getElementById('profileInitial').textContent = role.charAt(0).toUpperCase();
document.getElementById('profileRole').textContent = role;
document.getElementById('welcomeText').textContent = `${role} · ${zone}. Nexora adapte maintenant vos opportunités à votre profil.`;
document.getElementById('dateLabel').textContent = new Intl.DateTimeFormat('fr-FR',{weekday:'long',day:'numeric',month:'long'}).format(new Date());

document.getElementById('profileChips').innerHTML = [profile.skills, sector, clients, zone].filter(Boolean).map(x=>`<span>${x}</span>`).join('');

const pools = {
  'Développeur': [
    ['Web','Création d’un site vitrine pour une PME','Une entreprise recherche un développeur pour moderniser sa présence en ligne.','96%',`📍 ${zone}`,'$500–$1,000'],
    ['Produit','Prototype d’une application métier','Concevoir une première version web avec une équipe produit.','92%','🌍 International','$800–$1,500'],
    ['E-commerce','Optimisation d’une boutique en ligne','Améliorer les performances et l’expérience d’un site marchand.','88%','🌍 Afrique','$400–$900']
  ],
  'Designer / Créatif': [
    ['Branding','Refonte de l’identité d’une marque','Moderniser une identité visuelle avant un lancement.','96%','🌍 International','$700–$1,200'],
    ['UI/UX','Design d’une plateforme SaaS','Créer les écrans principaux d’un produit numérique.','94%','🌍 International','$600–$1,100'],
    ['Création','Pack de contenus pour une startup','Créer des visuels cohérents pour une nouvelle campagne.','89%',`📍 ${zone}`,'$300–$600']
  ],
  'Marketing / Communication': [
    ['Marketing','Lancement d’un nouveau produit','Structurer la stratégie de contenu et la communication de lancement.','95%','🌍 Afrique','$400–$800'],
    ['Social','Gestion des réseaux sociaux','Accompagner une PME dans sa présence digitale.','91%',`📍 ${zone}`,'$250–$550'],
    ['Growth','Acquisition pour une startup','Mettre en place un premier système d’acquisition mesurable.','87%','🌍 International','$500–$1,000']
  ]
};
const fallback = [
  ['Projet','Mission adaptée à votre profil','Nexora utilise vos réponses pour présenter des opportunités pertinentes.','93%',`🌍 ${zone}`,'Budget à définir'],
  ['Business','Accompagnement d’une PME','Une équipe recherche un profil correspondant à votre expertise.','89%',`📍 ${zone}`,'Budget à définir'],
  ['Mission','Projet freelance','Une opportunité de mission correspondant à votre objectif.','86%','🌍 Afrique','Budget à définir']
];
const cards = pools[role] || fallback;

document.getElementById('matchGrid').innerHTML = cards.map(([type,title,desc,score,location,budget]) => `
  <article class="match-card"><div class="match-head"><span class="match-type">${type}</span><span class="score">${score} match</span></div><h3>${title}</h3><p>${desc}</p><div class="match-meta"><span>${location}</span><span>•</span><span>${clients}</span><span>•</span><span>${budget}</span></div><button class="match-button" onclick="alert('Cette opportunité sera connectée au moteur de contact dans la prochaine étape.')">Voir l’opportunité →</button></article>
`).join('');
