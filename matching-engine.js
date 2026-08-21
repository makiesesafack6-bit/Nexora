(function(){
  const profile=()=>JSON.parse(localStorage.getItem('nexoraProfile')||'{}');
  const account=()=>JSON.parse(localStorage.getItem('nexoraAccount')||'{}');
  const normalize=s=>(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const catalog=[
    {role:'Developpeur',skills:['Developpement web'],sector:['Tech'],need:'Développement web / site internet',name:'Kivu Digital',handle:'@kivu_digital',location:'Kinshasa, RDC',source:'LinkedIn'},
    {role:'Photographe / Vidéaste',skills:['Vidéo & Photo'],sector:['Médias & Création'],need:'Photographie pour événement et contenu',name:'Nova Events',handle:'@nova_events',location:'Kinshasa, RDC',source:'Instagram'},
    {role:'Designer / Créatif',skills:['UI/UX & Design','Branding & Création'],sector:['Médias & Création'],need:'Identité visuelle et design',name:'Studio Lemba',handle:'@studio_lemba',location:'Kinshasa, RDC',source:'Instagram'},
    {role:'Marketing / Communication',skills:['Marketing & Réseaux sociaux'],sector:['Commerce'],need:'Gestion des réseaux sociaux et marketing',name:'Maison M',handle:'@maison_m',location:'Kinshasa, RDC',source:'Facebook'},
    {role:'Commercial',skills:['Vente & Business'],sector:['Commerce'],need:'Prospection commerciale et ventes',name:'AfriMarket',handle:'@afr_imarket',location:'Kinshasa, RDC',source:'Facebook'},
    {role:'Consultant / Expert',skills:['Conseil & Stratégie'],sector:['Finance','Immobilier'],need:'Conseil et stratégie pour entreprise',name:'Business CTG',handle:'@business_ctg',location:'Kinshasa, RDC',source:'LinkedIn'}
  ];
  function score(p,query){
    const q=normalize(query); const prof=profile(); let s=0;
    const terms=[prof.role,prof.skills,prof.sector,prof.zone,prof.clients,prof.goal].flatMap(x=>Array.isArray(x)?x:[x]).filter(Boolean).map(normalize);
    const hay=normalize([p.need,p.name,p.role,...p.skills,...p.sector].join(' '));
    terms.forEach(t=>{if(t&&hay.includes(t))s+=18});
    if(q){q.split(/\s+/).filter(x=>x.length>2).forEach(t=>{if(hay.includes(t))s+=12})}
    if(prof.zone==='Ma ville'&&p.location.includes('Kinshasa'))s+=8;
    if(prof.zone==='International')s+=4;
    return Math.min(99,Math.max(40,s));
  }
  function matches(query=''){
    return catalog.map(p=>({...p,match:score(p,query)+'%',initial:p.name[0]})).sort((a,b)=>parseInt(b.match)-parseInt(a.match));
  }
  window.NexoraMatching={matches,profile};
  // Replace the static Find result set with quiz/query-aware results while keeping the existing 15s UX.
  function findHandler(e){
    const btn=e.target.closest('#findButton,#quickFind'); if(!btn)return;
    const input=document.getElementById('findInput'); const q=input?.value||''; 
    // The existing Find handler owns the loading animation. We only refresh results after it completes.
    const original=window.renderFindResults;
    window.NexoraFindQuery=q;
    setTimeout(()=>{
      const table=document.querySelector('.prospect-table'); if(!table)return;
      const results=matches(q).slice(0,5); table.querySelectorAll('.find-result').forEach(x=>x.remove());
      results.forEach((p,i)=>{const row=document.createElement('div');row.className='prospect find-result nexora-clickable-prospect';row.style.cssText='cursor:pointer;transition:transform .2s ease,box-shadow .2s ease,background .2s ease;animation:nxFindIn .45s ease '+i*.1+'s both';row.innerHTML='<div class="person"><div class="person-avatar a1">'+p.initial+'</div><div><strong>'+p.handle+'</strong><small>'+p.name+'</small></div></div><span class="source">'+p.source+'</span><p>'+p.need+'</p><b class="match high">'+p.match+'</b><button type="button" class="find-detail">Voir les détails →</button>';const open=()=>window.NexoraOpenProspect?.(i,p);row.addEventListener('click',x=>{if(!x.target.closest('.find-detail'))open()});row.querySelector('.find-detail').onclick=x=>{x.stopPropagation();open()};row.onmouseenter=()=>{row.style.transform='translateY(-2px)';row.style.boxShadow='0 8px 24px rgba(17,24,39,.10)';row.style.background='#fafbfc'};row.onmouseleave=()=>{row.style.transform='';row.style.boxShadow='';row.style.background=''};table.appendChild(row)});
      document.getElementById('prospectsCount').textContent=String(results.length);
    },15850);
  }
  document.addEventListener('click',findHandler,true);
})();