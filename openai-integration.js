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

  // After the quiz analysis screen appears, send the quiz profile + the demo prospect catalog to OpenAI.
  function prepareQuizMatches(){
    const profile=getJSON('nexoraProfile',{});
    const prospects=window.NexoraMatching?.matches?.('')||[];
    if(!Object.keys(profile).length||!prospects.length)return;
    rank(profile,'',prospects).then(ai=>{
      const byId=new Map(prospects.map(p=>[String(p.id||p.handle||p.name),p]));
      const prepared=ai.map(m=>{const base=byId.get(String(m.id));return base?{...base,match:`${Math.max(0,Math.min(100,Number(m.score)||0))}%`,aiReason:m.reason||''}:null}).filter(Boolean);
      if(prepared.length)save('nexoraPreparedMatches',prepared);
      localStorage.setItem('nexoraAIMatchedAt',new Date().toISOString());
    }).catch(()=>save('nexoraPreparedMatches',prospects));
  }
  const watch=setInterval(()=>{
    const card=document.getElementById('analysisCard');
    if(card&&!card.classList.contains('hidden')){clearInterval(watch);prepareQuizMatches();}
  },250);

  // Find: use the same AI ranking engine with the user's typed request.
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
      if(prepared.length)save('nexoraFindMatches',prepared);
    }catch{}
  },true);
})();