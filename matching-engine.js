(function(){
  const profile=()=>JSON.parse(localStorage.getItem('nexoraProfile')||'{}');
  const normalize=s=>(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const catalog=[
    {category:'developer',keywords:['developpeur','developer','web developer','web developpeur','developpement web','site web','application','logiciel','frontend','backend','full stack'],role:'Développeur',skills:['Développement web'],sector:['Tech'],need:'Recherche un développeur web pour créer un site internet',name:'Kivu Digital',handle:'@kivu_digital',location:'Kinshasa, RDC',source:'LinkedIn'},
    {category:'photographer',keywords:['photographe','photography','photo','videaste','mariage','evenement'],role:'Photographe / Vidéaste',skills:['Vidéo & Photo'],sector:['Médias & Création'],need:'Recherche un photographe professionnel pour un événement',name:'Nova Events',handle:'@nova_events',location:'Kinshasa, RDC',source:'Instagram'},
    {category:'designer',keywords:['designer','design','ui','ux','branding','identite visuelle','graphiste'],role:'Designer / Créatif',skills:['UI/UX & Design','Branding & Création'],sector:['Médias & Création'],need:'Recherche un designer pour une identité visuelle',name:'Studio Lemba',handle:'@studio_lemba',location:'Kinshasa, RDC',source:'Instagram'},
    {category:'marketing',keywords:['marketing','communication','reseaux sociaux','social media','community manager'],role:'Marketing / Communication',skills:['Marketing & Réseaux sociaux'],sector:['Commerce'],need:'Recherche un spécialiste pour gérer les réseaux sociaux',name:'Maison M',handle:'@maison_m',location:'Kinshasa, RDC',source:'Facebook'},
    {category:'commercial',keywords:['commercial','vente','sales','prospection','business development'],role:'Commercial',skills:['Vente & Business'],sector:['Commerce'],need:'Recherche un commercial pour développer les ventes',name:'AfriMarket',handle:'@afr_imarket',location:'Kinshasa, RDC',source:'Facebook'},
    {category:'consultant',keywords:['consultant','conseil','strategie','expert','finance','immobilier'],role:'Consultant / Expert',skills:['Conseil & Stratégie'],sector:['Finance','Immobilier'],need:'Recherche un consultant pour accompagner son entreprise',name:'Business CTG',handle:'@business_ctg',location:'Kinshasa, RDC',source:'LinkedIn'}
  ];
  function text(p){return normalize([p.need,p.name,p.role,p.skills,p.sector,p.keywords].flat().join(' '));}
  function queryTerms(query){return normalize(query).split(/[^a-z0-9]+/).filter(x=>x.length>2)}
  function score(p,query){
    const prof=profile();
    const profileText=normalize([prof.role,prof.skills,prof.sector,prof.zone,prof.clients,prof.goal].flat().filter(Boolean).join(' '));
    const q=normalize(query); const hay=text(p); const terms=queryTerms(q);
    const profileHits=p.keywords.filter(k=>profileText.includes(normalize(k))).length;
    const queryHits=terms.filter(t=>hay.includes(t)).length;
    const relevantProfile=profileHits>0;
    const relevantQuery=queryTerms(q).length>0;
    if((relevantProfile||relevantQuery) && profileHits===0 && queryHits===0) return 0;
    let s=35 + profileHits*16 + queryHits*12;
    if(profileText.includes(normalize(p.role))) s+=18;
    if(q && hay.includes(q)) s+=12;
    if(prof.zone==='Ma ville'&&p.location.includes('Kinshasa'))s+=5;
    if(prof.zone==='International')s+=3;
    return Math.min(99,Math.max(0,s));
  }
  function matches(query=''){
    const q=normalize(query); const terms=queryTerms(q); const prof=profile();
    const profileText=normalize([prof.role,prof.skills,prof.sector,prof.goal,prof.clients].flat().filter(Boolean).join(' '));
    let scored=catalog.map(p=>({...p,match:score(p,query),initial:p.name[0]}));
    const relevant=scored.filter(p=>{
      const hay=text(p);
      const profileRelevant=profileText && p.keywords.some(k=>profileText.includes(normalize(k)));
      const queryRelevant=terms.length && terms.some(t=>hay.includes(t));
      return profileRelevant||queryRelevant;
    });
    const pool=(q||profileText)?relevant:scored;
    return pool.sort((a,b)=>b.match-a.match).map(p=>({...p,match:p.match+'%'}));
  }
  window.NexoraMatching={matches,profile,catalog};
  function findHandler(e){
    const btn=e.target.closest('#findButton,#quickFind'); if(!btn)return;
    const input=document.getElementById('findInput'); const q=input?.value||''; window.NexoraFindQuery=q;
    setTimeout(()=>{
      const table=document.querySelector('.prospect-table'); if(!table)return;
      const results=matches(q).slice(0,5); table.querySelectorAll('.find-result').forEach(x=>x.remove());
      results.forEach((p,i)=>{const row=document.createElement('div');row.className='prospect find-result nexora-clickable-prospect';row.style.cssText='cursor:pointer;transition:transform .2s ease,box-shadow .2s ease,background .2s ease;animation:nxFindIn .45s ease '+i*.1+'s both';row.innerHTML='<div class="person"><div class="person-avatar a1">'+p.initial+'</div><div><strong>'+p.handle+'</strong><small>'+p.name+'</small></div></div><span class="source">'+p.source+'</span><p>'+p.need+'</p><b class="match high">'+p.match+'</b><button type="button" class="find-detail">Voir les détails →</button>';const open=()=>window.NexoraOpenProspect?.(i,p);row.addEventListener('click',x=>{if(!x.target.closest('.find-detail'))open()});row.querySelector('.find-detail').onclick=x=>{x.stopPropagation();open()};row.onmouseenter=()=>{row.style.transform='translateY(-2px)';row.style.boxShadow='0 8px 24px rgba(17,24,39,.10)';row.style.background='#fafbfc'};row.onmouseleave=()=>{row.style.transform='';row.style.boxShadow='';row.style.background=''};table.appendChild(row)});
      const c=document.getElementById('prospectsCount');if(c)c.textContent=String(results.length);
    },15850);
  }
  document.addEventListener('click',findHandler,true);
})();