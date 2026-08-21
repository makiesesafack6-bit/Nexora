(function(){
  const prospects=[
    {name:'Jessica Events',handle:'@jessica_events',need:'Photographe pour un mariage',location:'Kinshasa, RDC',match:'95%',reason:['Photographie événementielle','Localisation compatible','Besoin récent'],source:'Instagram'},
    {name:'Business CTG',handle:'@business_ctg',need:'Site web professionnel pour son entreprise',location:'Kinshasa, RDC',match:'89%',reason:['Développement web','PME','Besoin digital identifié'],source:'Facebook'},
    {name:'Tony Mart',handle:'@tony_mart',need:'Solution e-commerce pour une boutique',location:'Kinshasa, RDC',match:'80%',reason:['E-commerce','Business local','Besoin de solution en ligne'],source:'TikTok'},
    {name:'Coach Anna',handle:'@coach_anna',need:'Accompagnement marketing',location:'Kinshasa, RDC',match:'72%',reason:['Marketing','Coaching','Besoin de visibilité'],source:'Instagram'}
  ];
  function openProspect(i){
    const p=prospects[i]||prospects[0];
    let modal=document.getElementById('prospectModal');
    if(!modal){modal=document.createElement('div');modal.id='prospectModal';modal.style.cssText='position:fixed;inset:0;background:#11182755;backdrop-filter:blur(5px);z-index:300;display:flex;align-items:center;justify-content:center;padding:24px';document.body.appendChild(modal)}
    modal.innerHTML='<div style="width:min(680px,96vw);max-height:90vh;overflow:auto;background:#fff;border-radius:24px;padding:30px;box-shadow:0 30px 80px #11182733;font-family:DM Sans,Arial;color:#182033"><button id="closeProspect" style="float:right;border:0;background:#f1f3f7;border-radius:10px;width:38px;height:38px;font-size:20px;cursor:pointer">×</button><span style="font-size:12px;font-weight:800;letter-spacing:.12em;color:#747c8c">NEXORA AI · PROSPECT</span><div style="display:flex;gap:16px;align-items:center;margin:20px 0"><div style="width:58px;height:58px;border-radius:17px;background:#eef1f6;display:grid;place-items:center;font-size:22px;font-weight:800">'+p.name[0]+'</div><div><h2 style="margin:0;font:800 28px Manrope,Arial">'+p.name+'</h2><p style="margin:4px 0;color:#697386">'+p.handle+' · '+p.source+'</p></div><strong style="margin-left:auto;font-size:24px">'+p.match+'<small style="display:block;font-size:11px;text-align:right;color:#687287">MATCH</small></strong></div><div style="background:#f7f8fa;border-radius:16px;padding:20px;margin:18px 0"><span style="font-size:11px;font-weight:800;letter-spacing:.1em;color:#737c8d">NEED DETECTED</span><h3 style="margin:8px 0;font-size:21px">'+p.need+'</h3><p style="margin:0;color:#687287">📍 '+p.location+' · Détecté par Nexora Auto-Match</p></div><h3 style="font-size:17px">Pourquoi ce match ?</h3><div style="display:grid;gap:10px">'+p.reason.map(x=>'<div style="font-size:15px">✓ '+x+'</div>').join('')+'</div><div style="display:flex;gap:12px;margin-top:26px"><button id="contactProspect" style="flex:1;border:0;background:#111827;color:#fff;border-radius:12px;padding:14px 18px;font-weight:800;cursor:pointer">Contacter ce prospect</button><button id="copyProspect" style="border:1px solid #d9deea;background:#fff;border-radius:12px;padding:14px 18px;font-weight:800;cursor:pointer">Copier les infos</button></div><div id="contactBox" style="display:none;margin-top:18px;background:#f7f8fa;border-radius:16px;padding:18px"><strong>Message recommandé par Nexora AI</strong><p style="line-height:1.6">Bonjour '+p.name+', j’ai vu que vous recherchez '+p.need.toLowerCase()+'. Je peux vous aider sur ce projet. Seriez-vous disponible pour en discuter ?</p><button id="copyMessage" style="border:1px solid #d9deea;background:#fff;border-radius:10px;padding:10px 14px;font-weight:700;cursor:pointer">Copier le message</button><button id="sendDemo" style="margin-left:8px;border:0;background:#111827;color:#fff;border-radius:10px;padding:10px 14px;font-weight:700;cursor:pointer">Envoyer · Démo</button></div></div>';
    modal.style.display='flex';
    modal.querySelector('#closeProspect').onclick=()=>modal.style.display='none';
    modal.querySelector('#contactProspect').onclick=()=>modal.querySelector('#contactBox').style.display='block';
    modal.querySelector('#copyProspect').onclick=()=>navigator.clipboard?.writeText(p.name+' · '+p.need+' · '+p.location);
    modal.querySelector('#copyMessage').onclick=()=>navigator.clipboard?.writeText('Bonjour '+p.name+', j’ai vu que vous recherchez '+p.need.toLowerCase()+'. Je peux vous aider sur ce projet. Seriez-vous disponible pour en discuter ?');
    modal.querySelector('#sendDemo').onclick=()=>{modal.querySelector('#sendDemo').textContent='✓ Envoyé · Démo';modal.querySelector('#sendDemo').disabled=true};
  }
  function bindRow(row,i){
    if(!row||row.dataset.prospectBound)return;
    row.dataset.prospectBound='1';
    const action=row.querySelector('.prospect-arrow,.prospect-action,.arrow,.view-prospect');
    if(action){action.style.cursor='pointer';action.title='Voir les détails';action.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();openProspect(i)});}
    row.addEventListener('click',e=>{if(e.target.closest('button,a,.prospect-arrow,.prospect-action,.arrow,.view-prospect'))return;openProspect(i)});
  }
  function bindAll(){[...document.querySelectorAll('.prospect')].forEach((r,i)=>bindRow(r,i));}
  bindAll();
  const observer=new MutationObserver(bindAll);observer.observe(document.body,{childList:true,subtree:true});
  window.NexoraOpenProspect=openProspect;
})();