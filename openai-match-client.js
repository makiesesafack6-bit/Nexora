(function(){
  async function aiMatch({profile={},search='',prospects=[]}={}){
    const res=await fetch('/api/openai-match',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({profile,search,prospects})});
    if(!res.ok) throw new Error('AI matching unavailable');
    const data=await res.json();
    return Array.isArray(data.matches)?data.matches:[];
  }
  window.NexoraAIMatch=aiMatch;
})();