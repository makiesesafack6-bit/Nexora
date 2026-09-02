(function(){
const profile=()=>JSON.parse(localStorage.getItem('nexoraProfile')||'{}');
const intent=()=>window.NexoraIntent?.get?.()||{explicit:profile(),behavior:{topics:[]},weights:{}};
const n=s=>(s||'').toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const catalog=[
{id:'kivu-digital',category:'developer',keywords:['developpeur','developer','web','site','application','logiciel','frontend','backend'],role:'Développeur',skills:['Développement web'],sector:['Tech'],need:'Recherche un développeur web pour créer un site internet',name:'Kivu Digital',handle:'@kivu_digital',location:'Kinshasa, RDC',source:'LinkedIn',demo:true},
{id:'lumina-tech',category:'developer',keywords:['developpeur','web','javascript','application','saas'],role:'Développeur',skills:['Développement web'],sector:['Tech','SaaS'],need:'Recherche un développeur web pour une application SaaS',name:'Lumina Tech',handle:'@lumina_tech',location:'Kinshasa, RDC',source:'LinkedIn',demo:true},
{id:'boma-labs',category:'developer',keywords:['developer','frontend','backend','site','ecommerce'],role:'Développeur',skills:['Développement web'],sector:['Commerce','Tech','E-commerce'],need:'Recherche un développeur pour améliorer une plateforme e-commerce',name:'Boma Labs',handle:'@boma_labs',location:'Kinshasa, RDC',source:'Instagram',demo:true},
{id:'pixel-kasa',category:'developer',keywords:['developpeur','react','web','logiciel','frontend'],role:'Développeur',skills:['Développement web'],sector:['Tech'],need:'Recherche un développeur frontend pour un produit numérique',name:'Pixel Kasa',handle:'@pixel_kasa',location:'Kinshasa, RDC',source:'Facebook',demo:true},
{id:'nova-events',category:'photographer',keywords:['photographe','photo','videaste','mariage','evenement'],role:'Photographe / Vidéaste',skills:['Vidéo & Photo'],sector:['Médias & Création','Événementiel'],need:'Recherche un photographe professionnel pour un événement',name:'Nova Events',handle:'@nova_events',location:'Kinshasa, RDC',source:'Instagram',demo:true},
{id:'kin-art',category:'photographer',keywords:['photographe','photo','portrait','campagne'],role:'Photographe / Vidéaste',skills:['Vidéo & Photo'],sector:['Médias & Création','Mode & Lifestyle'],need:'Recherche un photographe pour une campagne de marque',name:'Kin Art Studio',handle:'@kin_art_studio',location:'Kinshasa, RDC',source:'Instagram',demo:true},
{id:'frame-kongo',category:'photographer',keywords:['video','videaste','photo','evenement','contenu'],role:'Photographe / Vidéaste',skills:['Vidéo & Photo'],sector:['Médias & Création','Événementiel'],need:'Recherche un vidéaste pour produire du contenu événementiel',name:'Frame Kongo',handle:'@frame_kongo',location:'Kinshasa, RDC',source:'TikTok',demo:true},
{id:'studio-lemba',category:'designer',keywords:['designer','design','ui','ux','branding','graphiste'],role:'Designer / Créatif',skills:['UI/UX & Design','Branding & Création'],sector:['Médias & Création'],need:'Recherche un designer pour une identité visuelle',name:'Studio Lemba',handle:'@studio_lemba',location:'Kinshasa, RDC',source:'Instagram',demo:true},
{id:'atelier-gombe',category:'designer',keywords:['designer','ui','ux','branding','logo'],role:'Designer / Créatif',skills:['UI/UX & Design'],sector:['Commerce','Médias & Création'],need:'Recherche un designer UI/UX pour une nouvelle application',name:'Atelier Gombe',handle:'@atelier_gombe',location:'Kinshasa, RDC',source:'LinkedIn',demo:true},
{id:'creative-kasa',category:'designer',keywords:['branding','design','graphiste','identite'],role:'Designer / Créatif',skills:['Branding & Création'],sector:['Commerce'],need:'Recherche un créatif pour construire une identité de marque',name:'Creative Kasa',handle:'@creative_kasa',location:'Kinshasa, RDC',source:'Instagram',demo:true},
{id:'maison-m',category:'marketing',keywords:['marketing','communication','reseaux','social','community'],role:'Marketing / Communication',skills:['Marketing & Réseaux sociaux'],sector:['Commerce'],need:'Recherche un spécialiste pour gérer les réseaux sociaux',name:'Maison M',handle:'@maison_m',location:'Kinshasa, RDC',source:'Facebook',demo:true},
{id:'biso-media',category:'marketing',keywords:['marketing','social','instagram','communication','content'],role:'Marketing / Communication',skills:['Marketing & Réseaux sociaux'],sector:['Médias & Création'],need:'Recherche un expert marketing pour développer sa présence digitale',name:'Biso Media',handle:'@biso_media',location:'Kinshasa, RDC',source:'Instagram',demo:true},
{id:'impact-drc',category:'marketing',keywords:['marketing','communication','social','campagne'],role:'Marketing / Communication',skills:['Marketing & Réseaux sociaux'],sector:['Éducation','Commerce'],need:'Recherche un spécialiste des réseaux sociaux pour une campagne',name:'Impact DRC',handle:'@impact_drc',location:'Kinshasa, RDC',source:'LinkedIn',demo:true},
{id:'afrimarket',category:'commercial',keywords:['commercial','vente','sales','prospection','business'],role:'Commercial',skills:['Vente & Business'],sector:['Commerce'],need:'Recherche un commercial pour développer les ventes',name:'AfriMarket',handle:'@afr_imarket',location:'Kinshasa, RDC',source:'Facebook',demo:true},
{id:'bizflow',category:'commercial',keywords:['commercial','vente','sales','business','client'],role:'Commercial',skills:['Vente & Business'],sector:['Commerce'],need:'Recherche un profil commercial pour trouver de nouveaux clients',name:'BizFlow',handle:'@bizflow_drc',location:'Kinshasa, RDC',source:'LinkedIn',demo:true},
{id:'market-plus',category:'commercial',keywords:['vente','commercial','prospection','sales'],role:'Commercial',skills:['Vente & Business'],sector:['Immobilier','Commerce'],need:'Recherche un commercial pour accélérer sa prospection',name:'Market Plus',handle:'@market_plus',location:'Kinshasa, RDC',source:'Instagram',demo:true},
{id:'business-ctg',category:'consultant',keywords:['consultant','conseil','strategie','expert'],role:'Consultant / Expert',skills:['Conseil & Stratégie'],sector:['Finance','Immobilier'],need:'Recherche un consultant pour accompagner son entreprise',name:'Business CTG',handle:'@business_ctg',location:'Kinshasa, RDC',source:'LinkedIn',demo:true},
{id:'kivu-advisory',category:'consultant',keywords:['consultant','conseil','strategie','finance'],role:'Consultant / Expert',skills:['Conseil & Stratégie'],sector:['Finance'],need:'Recherche un consultant pour structurer sa stratégie financière',name:'Kivu Advisory',handle:'@kivu_advisory',location:'Kinshasa, RDC',source:'LinkedIn',demo:true},
{id:'growth-congo',category:'consultant',keywords:['consultant','expert','strategie','business'],role:'Consultant / Expert',skills:['Conseil & Stratégie'],sector:['Commerce'],need:'Recherche un expert pour améliorer sa stratégie commerciale',name:'Growth Congo',handle:'@growth_congo',location:'Kinshasa, RDC',source:'Facebook',demo:true}
];
function cat(){const p=profile(),r=n(p.role),s=n(p.skills);if(r.includes('developpeur')||s.includes('developpement web'))return'developer';if(r.includes('photographe')||s.includes('video')||s.includes('photo'))return'photographer';if(r.includes('designer')||s.includes('ui/ux')||s.includes('branding'))return'designer';if(r.includes('marketing')||s.includes('reseaux sociaux'))return'marketing';if(r.includes('commercial')||s.includes('vente'))return'commercial';if(r.includes('consultant')||s.includes('conseil'))return'consultant';return''}
function terms(v){return n(Array.isArray(v)?v.join(' '):v).split(/[^a-z0-9]+/).filter(x=>x.length>2)}
function allUserTerms(query){const i=intent(),q=terms(query),explicit=Object.values(i.explicit||{}).flatMap(terms),behavior=(i.behavior?.topics||[]).flatMap(terms);return [...new Set([...explicit,...behavior,...q])];}
function overlap(a,b){const aa=new Set(terms(a).concat(terms(Array.isArray(a)?a:[])));const bb=new Set(terms(b).concat(terms(Array.isArray(b)?b:[])));let hit=0;for(const x of aa)if(bb.has(x))hit++;return hit}
function matches(query=''){
  const c=cat(),i=intent(),u=i.explicit||profile();
  let list=c?catalog.filter(p=>p.category===c):catalog.slice();
  const userTerms=allUserTerms(query);
  return list.map(p=>{
    const pText=n([p.need,p.name,p.role,p.skills,p.sector,p.keywords,p.location].flat().join(' '));
    const queryText=n(query);
    const explicitFields=['role','skills','sector','service','goal','clients','zone','level','availability'];
    let weightedHit=0,totalWeight=0;
    for(const key of explicitFields){
      const value=u[key]; if(!value) continue;
      const w=i.weights?.[key]||1;
      totalWeight+=w;
      const h=overlap(value,pText);
      if(h>0) weightedHit+=w;
    }
    const explicitRatio=totalWeight?weightedHit/totalWeight:0;
    const queryHits=query?terms(query).filter(t=>pText.includes(t)).length:0;
    const queryRatio=query?queryHits/Math.max(1,terms(query).length):0;
    const broadHits=userTerms.filter(t=>pText.includes(t)).length;
    const broadRatio=broadHits/Math.max(1,userTerms.length);
    const behaviorTopics=i.behavior?.topics||[];
    const behaviorBonus=behaviorTopics.length?Math.min(1,behaviorTopics.filter(t=>pText.includes(n(t))).length/behaviorTopics.length):0;
    let score=20+explicitRatio*48+queryRatio*22+broadRatio*8+behaviorBonus*2;
    if(c)score+=8;
    if((u.level||'').toLowerCase()==='intermediaire' && /intermediaire|mid|intermediate/.test(pText))score+=3;
    score=Math.max(0,Math.min(99,Math.round(score)));
    const reasonParts=[];
    if(overlap(u.service,pText))reasonParts.push('service correspondant');
    if(overlap(u.goal,pText))reasonParts.push('objectif compatible');
    if(overlap(u.sector,pText))reasonParts.push('secteur compatible');
    if(overlap(u.skills,pText))reasonParts.push('compétences adaptées');
    if(queryRatio>0.5)reasonParts.push('demande actuelle bien correspondante');
    return {...p,match:score+'%',score,initial:p.name[0],matchReason:reasonParts.slice(0,3).join(' · ')||'correspondance partielle'};
  }).sort((a,b)=>b.score-a.score);
}
window.NexoraMatching={matches,profile,catalog,categoryForProfile:cat,buildIntent:()=>window.NexoraIntent?.refresh?.()};
})();
