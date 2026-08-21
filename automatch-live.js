/* Nexora Auto-Match live simulation layer. Demo-only: no external client data is queried yet. */
(function(){
  const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
  let active=true, tick=0, detectTimer=null, scanTimer=null;
  const toast=(m)=>{let t=$('#workspaceToast');if(!t)return;t.textContent=m;t.style.opacity='1';clearTimeout(window.__nxToast);window.__nxToast=setTimeout(()=>t.style.opacity='0',2800)};
  const auto=$('.automation');
  const panel=$('.notifications-panel .alerts');
  if(!auto||!panel)return;

  let scanner=auto.querySelector('.nx-live-scanner');
  if(!scanner){scanner=document.createElement('div');scanner.className='nx-live-scanner';scanner.innerHTML='<span class="nx-scan-orb"></span><div><strong>Nexora AI is searching…</strong><small id="nxScanWords">Scanning profiles · analysing signals · comparing matches</small></div><b id="nxScanDots">•••</b>';scanner.style.cssText='display:flex;align-items:center;gap:12px;margin-top:14px;padding:12px 14px;border:1px solid #dfe4ed;border-radius:12px;background:#fafbfc';auto.querySelector('.auto-copy')?.appendChild(scanner)}
  const orb=scanner.querySelector('.nx-scan-orb');if(orb)orb.style.cssText='width:10px;height:10px;border-radius:50%;background:#111827;box-shadow:0 0 0 0 #11182755;animation:nxPulse 1.4s infinite';
  const st=document.createElement('style');st.textContent='@keyframes nxPulse{0%{box-shadow:0 0 0 0 #11182755}70%{box-shadow:0 0 0 9px transparent}100%{box-shadow:0 0 0 0 transparent}}@keyframes nxDots{0%,20%{opacity:.2}50%{opacity:1}80%,100%{opacity:.2}}#nxScanDots{letter-spacing:3px;animation:nxDots 1.2s infinite}';document.head.appendChild(st);

  const words=['Scanning profiles · analysing signals · comparing matches','Searching new opportunities · checking compatibility','Monitoring new requests · evaluating your profile','Still searching · Nexora is watching for a strong match'];
  setInterval(()=>{if(!active)return;tick++;const w=scanner.querySelector('#nxScanWords');if(w&&tick%4===0)w.textContent=words[(tick/4)%words.length|0]},1000);

  const demo=[
    ['K','Studio Kivu','New website redesign opportunity detected.','96%'],
    ['M','Maison M','Restaurant group looking for a digital partner.','91%'],
    ['N','Nexum Agency','Marketing design brief detected.','87%'],
    ['A','AfriMarket','E-commerce storefront project detected.','94%'],
    ['L','Lumi Events','Event photography request detected.','89%'],
    ['C','Congo Creators','Looking for a social media specialist.','86%'],
    ['B','Business CTG','Business website opportunity detected.','84%'],
    ['T','Tony Mart','Online store support request detected.','82%'],
    ['K','Kivu Homes','Real-estate marketing need detected.','90%'],
    ['P','Pixel House','Brand identity project detected.','88%'],
    ['S','Safi Services','Digital campaign opportunity detected.','85%'],
    ['R','RDC Retail','Customer acquisition project detected.','83%']
  ];
  let index=0;
  function createNotification(){
    if(!active)return;
    const d=demo[index%demo.length];index++;
    const now=new Date();
    const article=document.createElement('article');
    article.className='nx-live-notification';
    article.style.cssText='display:flex;opacity:0;transform:translateY(-8px);transition:opacity .45s ease,transform .45s ease';
    article.innerHTML=`<div class="alert-icon">${d[0]}</div><div><strong>${d[3]} match · ${d[1]}</strong><p>${d[2]}</p><small>Détecté à l’instant · ${now.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})}</small></div><b>NEW</b>`;
    panel.prepend(article);
    requestAnimationFrame(()=>{article.style.opacity='1';article.style.transform='translateY(0)'});
    const live=panel.querySelectorAll('.nx-live-notification');
    if(live.length>10){const old=live[live.length-1];old.style.opacity='0';setTimeout(()=>old.remove(),450)}
    const navBadge=$('.nav-badge');if(navBadge)navBadge.textContent=String((parseInt(navBadge.textContent)||0)+1);
    toast(`Nouveau match détecté · ${d[3]} · ${d[1]}`);
  }
  function schedule(){clearTimeout(detectTimer);if(!active)return;detectTimer=setTimeout(()=>{createNotification();schedule()},22000+Math.floor(Math.random()*12000));}
  const sync=()=>{const live=document.querySelector('.automation .live');active=live?.textContent!=='PAUSED';scanner.style.opacity=active?'1':'.55';const strong=scanner.querySelector('strong');if(strong)strong.textContent=active?'Nexora AI is searching…':'Nexora AI search paused';if(active)schedule();else clearTimeout(detectTimer)};
  document.addEventListener('click',e=>{if(e.target.closest('.auto-cancel,#autoToggle,.toggle'))setTimeout(sync,40)});
  sync();
})();