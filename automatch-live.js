(function(){
const found=[];let timer=null,active=true,cursor=0;
const root=()=>document.querySelector('.prospect-table');const alerts=()=>document.querySelector('.alerts');
function list(){
  const prepared=(()=>{try{return JSON.parse(localStorage.getItem('nexoraPreparedMatches')||'[]')}catch{return []}})();
  if(prepared.length)return prepared;
  return window.NexoraMatching?.matches('')||[];
}
function detail(p){const idx=window.NexoraProspectData?.findIndex(x=>x.id===p.id);if(window.NexoraOpenProspect)window.NexoraOpenProspect(idx>=0?idx:0,p)}
function render(){const r=root();if(!r)return;r.querySelectorAll('.prospect.nexora-auto-prospect').forEach(x=>x.remove());found.slice().reverse().forEach(p=>{const row=document.createElement('div');row.className='prospect nexora-auto-prospect';row.style.cssText='cursor:pointer;transition:transform .2s ease,box-shadow .2s ease,background .2s ease';row.innerHTML='<div class="person"><div class="person-avatar a1">'+(p.initial||p.name?.[0]||'N')+'</div><div><strong>'+p.handle+'</strong><small>'+p.name+'</small></div></div><span class="source">'+p.source+'</span><p>'+p.need+'</p><b class="match high">'+p.match+'</b><button type="button" class="auto-detail">Voir les détails →</button>';row.onclick=e=>{if(!e.target.closest('button'))detail(p)};row.querySelector('.auto-detail').onclick=e=>{e.stopPropagation();detail(p)};row.onmouseenter=()=>{row.style.transform='translateY(-2px)';row.style.boxShadow='0 8px 24px rgba(17,24,39,.10)';row.style.background='#fafbfc'};row.onmouseleave=()=>{row.style.transform='';row.style.boxShadow='';row.style.background=''};r.appendChild(row)});const c=document.getElementById('prospectsCount');if(c)c.textContent=String(found.length)}
function notify(p){const a=alerts();if(!a)return;const n=document.createElement('div');n.className='alert nexora-auto-alert';n.innerHTML='<div><strong>'+p.match+' match · '+p.name+'</strong><p>Nouveau besoin détecté : '+p.need+'</p><small>Détecté à l’instant · <button type="button" class="alert-detail">Voir le prospect →</button></small></div><span class="nav-badge">NEW</span>';n.querySelector('.alert-detail').onclick=e=>{e.stopPropagation();detail(p)};n.onclick=()=>detail(p);a.prepend(n);while(a.children.length>10)a.lastElementChild.remove()}
async function add(){if(!active)return;const matches=list();if(!matches.length)return;let p={...matches[cursor%matches.length],id:Date.now()+cursor};cursor++;
  try{
    if(window.NexoraAI?.rank){
      const profile=JSON.parse(localStorage.getItem('nexoraProfile')||'{}');
      const ai=await window.NexoraAI.rank(profile,'',[...matches]);
      const chosen=ai.map(m=>{const base=matches.find(x=>String(x.id||x.handle||x.name)===String(m.id));return base?{...base,match:Math.max(0,Math.min(100,Number(m.score)||0))+'%',aiReason:m.reason||''}:null}).filter(Boolean);
      if(chosen.length)p={...chosen[cursor%chosen.length],id:Date.now()+cursor};
    }
  }catch(e){console.warn('Auto-Match AI unavailable; using prepared profile matches',e)}
  found.push(p);while(found.length>10)found.shift();window.NexoraProspectData=found.slice();render();notify(p)}
function start(){if(timer)clearInterval(timer);active=true;setTimeout(()=>{if(!window.NexoraMatching){start();return}timer=setInterval(add,18000);add()},1000)}
window.NexoraAutoMatch={start,stop:()=>{active=false;if(timer)clearInterval(timer)},add,found};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
