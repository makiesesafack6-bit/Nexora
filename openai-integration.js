/* Nexora OpenAI bridge: the API key stays server-side. */
(function(){
  const getJSON=(key,fallback={})=>{try{return JSON.parse(localStorage.getItem(key)||JSON.stringify(fallback))}catch{return fallback}};
  const save=(key,value)=>localStorage.setItem(key,JSON.stringify(value));
  const clamp=n=>Math.max(0,Math.min(100,Number(n)||0));
  async function rank(profile,search,prospects){
    const res=await fetch('/api/openai-match',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({profile,search,prospects})});
    if(!res.ok) throw new Error('AI matching unavailable');
    const data=await res.json();
    return Array.isArray(data.matches)?data.matches:[];
  }
  window.NexoraAI={rank};

  /* Always give OpenAI the full relevant demo pool. The query is for ranking, not for pre-filtering. */
  function profileCandidates(profile){
    const engine=window.NexoraMatching;
    if(!engine?.catalog?.length)return [];
    const category=engine.categoryForProfile?.();
    let candidates=engine.catalog.slice();
    if(category)candidates=candidates.filter(p=>p.category===category);
    return candidates;
  }

  function installPreparedMatcher(list){
    if(!Array.isArray(list)||!list.length||!window.NexoraMatching)return;
    const base=window.NexoraMatching;
    if(!base.__originalMatches)base.__originalMatches=base.matches.bind(base);
    const original=base.__originalMatches;
    base.matches=function(query=''){
      const q=String(query||'').trim();
      if(!q)return list.slice();
      const terms=q.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').split(/[^a-z0-9]+/).filter(x=>x.length>2);
      return list.filter(p=>terms.some(t=>[p.need,p.name,p.role,p.skills,p.sector,p.keywords].flat().join(' ').toLowerCase().includes(t)));
    };
    base.originalMatches=original;
  }

  async function prepareQuizMatches(){
    const profile=getJSON('nexoraProfile',{});
    const prospects=profileCandidates(profile);
    if(!Object.keys(profile).length||!prospects.length)return;
    try{
      const ai=await rank(profile,'',prospects);
      const byId=new Map(prospects.map(p=>[String(p.id||p.handle||p.name),p]));
      const prepared=ai.map(m=>{
        const base=byId.get(String(m.id));
        return base?{...base,match:`${clamp(m.score)}%`,aiReason:m.reason||'',need:m.displayNeed||base.need}:null;
      }).filter(Boolean);
      if(prepared.length){save('nexoraPreparedMatches',prepared);installPreparedMatcher(prepared)}
      localStorage.setItem('nexoraAIMatchedAt',new Date().toISOString());
    }catch{save('nexoraPreparedMatches',prospects)}
  }

  const watch=setInterval(()=>{
    const card=document.getElementById('analysisCard');
    if(card&&!card.classList.contains('hidden')){clearInterval(watch);prepareQuizMatches();}
  },250);
  const stored=getJSON('nexoraPreparedMatches',[]);if(stored.length)installPreparedMatcher(stored);

  function setLoading(overlay,pct,stage){
    if(!overlay)return;
    overlay.classList.remove('hidden');
    let box=overlay.querySelector('.nx-ai-progress');
    if(!box){box=document.createElement('div');box.className='nx-ai-progress';box.style.cssText='width:min(520px,88vw);margin-top:18px';box.innerHTML='<div style="display:flex;justify-content:space-between;font:700 14px DM Sans"><span id="nxAiStage">Analyse de votre demande…</span><b id="nxAiPct">0%</b></div><div style="height:8px;background:#e7eaf0;border-radius:99px;margin:10px 0 16px;overflow:hidden"><i id="nxAiBar" style="display:block;width:0;height:100%;background:#111827;border-radius:99px"></i></div><div style="display:grid;gap:7px;text-align:left;font:600 13px DM Sans;color:#687287"><span>✓ Profil Nexora pris en compte</span><span>✓ Demande Find envoyée à l’IA</span><span>✓ Prospects compatibles comparés</span><span>✓ Scores calculés selon la pertinence</span></div>';overlay.appendChild(box)}
    const bar=box.querySelector('#nxAiBar'),p=box.querySelector('#nxAiPct'),s=box.querySelector('#nxAiStage');if(bar)bar.style.width=pct+'%';if(p)p.textContent=pct+'%';if(s)s.textContent=stage;
  }

  async function runFind(btn){
    const input=document.getElementById('findInput');
    const query=input?.value?.trim()||'';
    const profile=getJSON('nexoraProfile',{});
    if(!query){input?.focus();return;}
    const overlay=document.getElementById('searchLoading');
    /* Do not pre-filter by the words in the query. OpenAI must see the full profile-relevant pool and decide relevance itself. */
    const candidates=profileCandidates(profile);
    if(!candidates.length){
      if(overlay){overlay.classList.remove('hidden');setLoading(overlay,100,'Aucun prospect compatible avec votre profil.');setTimeout(()=>overlay.classList.add('hidden'),1600)}
      return;
    }
    let ai=[];
    const started=Date.now();
    setLoading(overlay,2,'Analyse de votre demande…');
    const progress=setInterval(()=>{const elapsed=Date.now()-started;const pct=Math.min(94,Math.floor(elapsed/15000*94));let stage='Analyse de votre demande…';if(elapsed>=3500&&elapsed<7000)stage='Recherche des opportunités compatibles…';else if(elapsed>=7000&&elapsed<10500)stage='Comparaison des profils…';else if(elapsed>=10500)stage='Classement des meilleurs matchs…';setLoading(overlay,pct,stage)},200);
    try{ai=await rank(profile,query,candidates)}catch(e){console.warn('Nexora AI Find unavailable',e)}
    const remaining=Math.max(0,15000-(Date.now()-started));
    setTimeout(()=>{
      clearInterval(progress);setLoading(overlay,100,'Recherche terminée — résultats prêts.');
      const byId=new Map(candidates.map(p=>[String(p.id||p.handle||p.name),p]));
      const prepared=(ai||[]).map(m=>{
        const base=byId.get(String(m.id));
        return base?{...base,match:`${clamp(m.score)}%`,aiReason:m.reason||'',need:m.displayNeed||base.need}:null;
      }).filter(Boolean);
      const final=prepared.length?prepared:candidates.map(p=>({...p,match:p.match||'0%'}));
      save('nexoraFindMatches',final);
      setTimeout(()=>{renderFindResults(final);overlay?.classList.add('hidden')},700);
    },remaining);
  }

  function renderFindResults(list){
    const table=document.querySelector('.prospect-table');if(!table)return;
    table.querySelectorAll('.prospect.find-result').forEach(x=>x.remove());
    list.slice(0,5).forEach((p,i)=>{
      const row=document.createElement('div');row.className='prospect find-result nexora-ai-result';row._nexoraProspect=p;row.dataset.match=p.match||'0%';row.style.cssText='cursor:pointer;animation:nxFindIn .45s ease '+(i*.1)+'s both';
      row.innerHTML='<div class="person"><div class="person-avatar a1">'+(p.initial||p.name?.[0]||'N')+'</div><div><strong>'+p.handle+'</strong><small>'+p.name+'</small></div></div><span class="source">'+p.source+'</span><p>'+p.need+'</p><b class="match high">'+p.match+'</b><button type="button" class="find-detail">Voir les détails →</button>';
      const open=()=>window.NexoraOpenProspect?.(i,p);row.onclick=ev=>{if(!ev.target.closest('button'))open()};row.querySelector('.find-detail').onclick=ev=>{ev.stopPropagation();open()};table.appendChild(row);
    });
    document.getElementById('prospectEmpty')?.remove();
    const count=document.getElementById('prospectsCount');if(count)count.textContent=String(Math.min(list.length,5));
    document.querySelector('.nav-item[href="#prospects"]')?.click();
  }

  /* Intercept Find before the legacy demo handler. */
  document.addEventListener('click',function(e){
    const btn=e.target.closest?.('#findButton,#quickFind');
    if(!btn)return;
    e.preventDefault();e.stopImmediatePropagation();runFind(btn);
  },true);

  const stored2=getJSON('nexoraPreparedMatches',[]);if(stored2.length)installPreparedMatcher(stored2);
  window.NexoraPrepareQuizMatches=prepareQuizMatches;
})();
