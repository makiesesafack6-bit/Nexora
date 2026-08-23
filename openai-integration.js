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

  function profileCandidates(profile,query=''){
    const engine=window.NexoraMatching;
    if(!engine?.catalog?.length)return [];
    let candidates=query ? (engine.matches(query)||[]) : engine.catalog.slice();
    const category=engine.categoryForProfile?.();
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
    const prospects=profileCandidates(profile,'');
    if(!Object.keys(profile).length||!prospects.length)return;
    try{
      const ai=await rank(profile,'',prospects);
      const byId=new Map(prospects.map(p=>[String(p.id||p.handle||p.name),p]));
      const prepared=ai.map(m=>{const base=byId.get(String(m.id));return base?{...base,match:`${clamp(m.score)}%`,aiReason:m.reason||''}:null}).filter(Boolean);
      if(prepared.length){save('nexoraPreparedMatches',prepared);installPreparedMatcher(prepared)}
      localStorage.setItem('nexoraAIMatchedAt',new Date().toISOString());
    }catch{save('nexoraPreparedMatches',prospects)}
  }

  const watch=setInterval(()=>{
    const card=document.getElementById('analysisCard');
    if(card&&!card.classList.contains('hidden')){clearInterval(watch);prepareQuizMatches();}
  },250);
  const stored=getJSON('nexoraPreparedMatches',[]);if(stored.length)installPreparedMatcher(stored);

  // Find: first restrict by the user's typed request and profile category, then let OpenAI rank only those candidates.
  document.addEventListener('click',async e=>{
    const btn=e.target.closest?.('#findButton,#quickFind');
    if(!btn)return;
    const input=document.getElementById('findInput');
    const query=input?.value?.trim()||'';
    const profile=getJSON('nexoraProfile',{});
    const candidates=profileCandidates(profile,query);
    if(!query||!candidates.length)return;
    try{
      const matches=await rank(profile,query,candidates);
      const byId=new Map(candidates.map(p=>[String(p.id||p.handle||p.name),p]));
      const prepared=matches.map(m=>{const base=byId.get(String(m.id));return base?{...base,match:`${clamp(m.score)}%`,aiReason:m.reason||''}:null}).filter(Boolean);
      if(!prepared.length)return;
      save('nexoraFindMatches',prepared);
      setTimeout(()=>{
        const table=document.querySelector('.prospect-table');if(!table)return;
        table.querySelectorAll('.prospect.find-result').forEach(x=>x.remove());
        prepared.slice(0,4).forEach((p,i)=>{
          const row=document.createElement('div');row.className='prospect find-result nexora-ai-result';row.style.cssText='cursor:pointer;animation:nxFindIn .45s ease '+(i*.1)+'s both';
          row.innerHTML='<div class="person"><div class="person-avatar a1">'+(p.initial||p.name?.[0]||'N')+'</div><div><strong>'+p.handle+'</strong><small>'+p.name+'</small></div></div><span class="source">'+p.source+'</span><p>'+p.need+'</p><b class="match high">'+p.match+'</b><button type="button" class="find-detail">Voir les détails →</button>';
          const open=()=>window.NexoraOpenProspect?.(i,p);row.onclick=ev=>{if(!ev.target.closest('button'))open()};row.querySelector('.find-detail').onclick=ev=>{ev.stopPropagation();open()};table.appendChild(row);
        });
        document.getElementById('prospectEmpty')?.remove();
      },15800);
    }catch(err){console.warn('Nexora AI Find unavailable',err)}
  },true);

  window.NexoraPrepareQuizMatches=prepareQuizMatches;
})();
