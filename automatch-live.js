(function(){
  const seed=[
    {name:'Jessica Events',handle:'@jessica_events',need:'Photographe pour un mariage',location:'Kinshasa, RDC',match:'95%',source:'Instagram'},
    {name:'Business CTG',handle:'@business_ctg',need:'Site web professionnel pour son entreprise',location:'Kinshasa, RDC',match:'89%',source:'Facebook'},
    {name:'Tony Mart',handle:'@tony_mart',need:'Solution e-commerce pour une boutique',location:'Kinshasa, RDC',match:'80%',source:'TikTok'},
    {name:'Coach Anna',handle:'@coach_anna',need:'Accompagnement marketing',location:'Kinshasa, RDC',match:'72%',source:'Instagram'},
    {name:'Kivu Design',handle:'@kivu_design',need:'Identité visuelle pour une nouvelle marque',location:'Goma, RDC',match:'91%',source:'Instagram'},
    {name:'Kinshasa Events',handle:'@kin_events',need:'Gestion des réseaux sociaux',location:'Kinshasa, RDC',match:'87%',source:'Facebook'},
    {name:'AfriMarket',handle:'@afr_imarket',need:'Boutique en ligne et catalogue produit',location:'Kinshasa, RDC',match:'93%',source:'TikTok'}
  ];
  const found=[];
  let timer=null, active=true, cursor=0;
  const root=()=>document.querySelector('.prospect-table');
  const alerts=()=>document.querySelector('.alerts');
  function detail(p){
    if(window.NexoraOpenProspect){
      const idx=window.NexoraProspectData?.findIndex(x=>x.handle===p.handle);
      window.NexoraOpenProspect(idx>=0?idx:0,p);
      return;
    }
    alert(p.name+' — '+p.need+' — '+p.location+' — '+p.match+' match');
  }
  function render(){
    const r=root(); if(!r)return;
    r.querySelectorAll('.prospect').forEach(x=>x.remove());
    found.slice().reverse().forEach((p)=>{
      const row=document.createElement('div'); row.className='prospect nexora-auto-prospect'; row.style.cssText='cursor:pointer;transition:transform .2s ease,box-shadow .2s ease,background .2s ease';
      row.innerHTML='<div class="person"><div class="person-avatar a1">'+p.name[0]+'</div><div><strong>'+p.handle+'</strong><small>'+p.name+'</small></div></div><span class="source">'+p.source+'</span><p>'+p.need+'</p><b class="match high">'+p.match+'</b><button type="button" class="auto-detail">→</button>';
      const open=()=>detail(p); row.addEventListener('click',e=>{if(!e.target.closest('button'))open()});
      row.querySelector('.auto-detail').addEventListener('click',e=>{e.stopPropagation();open()});
      row.addEventListener('mouseenter',()=>{row.style.transform='translateY(-2px)';row.style.boxShadow='0 8px 24px rgba(17,24,39,.10)';row.style.background='#fafbfc'});
      row.addEventListener('mouseleave',()=>{row.style.transform='';row.style.boxShadow='';row.style.background=''});
      r.appendChild(row);
    });
    const count=document.getElementById('prospectsCount'); if(count)count.textContent=String(found.length);
    const high=document.querySelector('.stats article:nth-child(4) strong'); if(high)high.textContent=String(found.filter(p=>parseInt(p.match)>=80).length);
  }
  function notify(p){
    const a=alerts(); if(!a)return;
    const n=document.createElement('div'); n.className='alert nexora-auto-alert';
    n.innerHTML='<div><strong>'+p.match+' match · '+p.name+'</strong><p>Nouveau besoin détecté : '+p.need+'</p><small>Détecté à l’instant · <button type="button" class="alert-detail">Voir le prospect →</button></small></div><span class="nav-badge">NEW</span>';
    n.querySelector('.alert-detail').onclick=e=>{e.stopPropagation();detail(p)};
    n.style.cursor='pointer'; n.onclick=()=>detail(p); a.prepend(n);
    while(a.children.length>10)a.lastElementChild.remove();
  }
  function add(){
    if(!active)return;
    const p={...seed[cursor%seed.length],id:Date.now()+cursor}; cursor++;
    found.push(p); while(found.length>10)found.shift();
    window.NexoraProspectData=found.slice(); render(); notify(p);
  }
  function start(){
    if(timer)clearInterval(timer); active=true;
    timer=setInterval(add,18000);
  }
  window.NexoraAutoMatch={start,stop:()=>{active=false;if(timer)clearInterval(timer)},add,found};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();