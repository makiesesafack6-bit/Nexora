/* Nexora OpenAI bridge: uses the server-side /api/openai-match endpoint. The API key never reaches the browser. */
(function(){
  const getJSON=(key,fallback={})=>{try{return JSON.parse(localStorage.getItem(key)||JSON.stringify(fallback))}catch{return fallback}};
  const save=(key,value)=>localStorage.setItem(key,JSON.stringify(value));
  async function rank(profile,search,prospects){
    const res=await fetch('/api/openai-match',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({profile,search,prospects})});
    if(!res.ok) throw new Error('AI matching unavailable');
    const data=await res.json();
    return Array.isArray(data.matches)?data.matches:[];
  }
  window.NexoraAI={rank};
  function installPreparedMatcher(list){
    if(!Array.isArray(list)||!list.length||!window.NexoraMatching)return;
    const base=window.NexoraMatching;
    const original=base.matches.bind(base);
    base.matches=function(query=''){
      const q=String(query||'').toLowerCase().trim();
      if(!q)return list.slice();
      const terms=q.normalize('NFD').replace(/[\u0300-\u036f]/g,'').split(/[^a-z0-9]+/).filter(x=>x.length>2);
      return list.filter(p=>terms.some(t=>[p.need,p.name,p.role,p.skills,p.sector,p.keywords].flat().join(' ').toLowerCase().includes(t)));
    };
    base.originalMatches=original;
  }
  function prepareQuizMatches(){
    const profile=getJSON('nexoraProfile',{});
    const prospects=window.NexoraMatching?.matches?.('')||[];
    if(!Object.keys(profile).length||!prospects.length)return;
    rank(profile,'',prospects).then(ai=>{
      const byId=new Map(prospects.map(p=>[String(p.id||p.handle||p.name),p]));
      const prepared=ai.map(m=>{const base=byId.get(String(m.id));return base?{...base,match:`${Math.max(0,Math.min(100,Number(m.score)||0))}%`,aiReason:m.reason||''}:null}).filter(Boolean);
      if(prepared.length){save('nexoraPreparedMatches',prepared);installPreparedMatcher(prepared)}
      localStorage.setItem('nexoraAIMatchedAt',new Date().toISOString());
    }).catch(()=>save('nexoraPreparedMatches',prospects));
  }
  const watch=setInterval(()=>{
    const card=document.getElementById('analysisCard');
    if(card&&!card.classList.contains('hidden')){clearInterval(watch);prepareQuizMatches();}
  },250);
  const stored=getJSON('nexoraPreparedMatches',[]);if(stored.length)installPreparedMatcher(stored);

  // Find: rank the same catalog using the user's exact typed request and keep the AI scores stable.
  document.addEventListener('click',async e=>{
    const btn=e.target.closest?.('#findButton,#quickFind');
    if(!btn)return;
    const input=document.getElementById('findInput');
    const query=input?.value?.trim()||'';
    const profile=getJSON('nexoraProfile',{});
    const catalog=window.NexoraMatching?.catalog||[];
    if(!query||!catalog.length)return;
    try{
      const matches=await rank(profile,query,catalog);
      const byId=new Map(catalog.map(p=>[String(p.id||p.handle||p.name),p]));
      const prepared=matches.map(m=>{const base=byId.get(String(m.id));return base?{...base,match:`${Math.max(0,Math.min(100,Number(m.score)||0))}%`,aiReason:m.reason||''}:null}).filter(Boolean);
      if(prepared.length){save('nexoraFindMatches',prepared);setTimeout(()=>{const table=document.querySelector('.prospect-table');if(!table)return;table.querySelectorAll('.prospect.find-result').forEach(x=>x.remove());const rows=prepared.slice(0,4);rows.forEach((p,i)=>{const row=document.createElement('div');row.className='prospect find-result nexora-ai-result';row.style.cssText='cursor:pointer;animation:nxFindIn .45s ease '+(i*.1)+'s both';row.innerHTML='<div class="person"><div class="person-avatar a1">'+(p.initial||p.name?.[0]||'N')+'</div><div><strong>'+p.handle+'</strong><small>'+p.name+'</small></div></div><span class="source">'+p.source+'</span><p>'+p.need+'</p><b class="match high">'+p.match+'</b><button type="button" class="find-detail">Voir les détails →</button>';const open=()=>window.NexoraOpenProspect?.(i,p);row.onclick=ev=>{if(!ev.target.closest('button'))open()};row.querySelector('.find-detail').onclick=ev=>{ev.stopPropagation();open()};table.appendChild(row)});document.getElementById('prospectEmpty')?.remove();},15800)}
    }catch{}
  },true);
})();