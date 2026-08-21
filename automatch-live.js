/* Nexora Auto-Match live simulation layer. Demo-only: no external client data is queried yet. */
(function(){
  const $=s=>document.querySelector(s);
  let active=true,tick=0,detectTimer=null;
  const auto=$('.automation'); if(!auto)return;
  let scanner=auto.querySelector('.nx-live-scanner');
  if(!scanner){scanner=document.createElement('div');scanner.className='nx-live-scanner';scanner.innerHTML='<span class="nx-scan-orb"></span><div><strong>Nexora AI is searching…</strong><small id="nxScanWords">Scanning profiles · analysing signals · comparing matches</small></div><b id="nxScanDots">•••</b>';scanner.style.cssText='display:flex;align-items:center;gap:12px;margin-top:14px;padding:12px 14px;border:1px solid #dfe4ed;border-radius:12px;background:#fafbfc';auto.querySelector('.auto-copy')?.appendChild(scanner)}
  const st=document.createElement('style');st.textContent='@keyframes nxPulse{0%{box-shadow:0 0 0 0 #11182755}70%{box-shadow:0 0 0 9px transparent}100%{box-shadow:0 0 0 0 transparent}}@keyframes nxDots{0%,20%{opacity:.2}50%{opacity:1}80%,100%{opacity:.2}}.nx-scan-orb{width:10px;height:10px;border-radius:50%;background:#111827;box-shadow:0 0 0 0 #11182755;animation:nxPulse 1.4s infinite}#nxScanDots{letter-spacing:3px;animation:nxDots 1.2s infinite}';document.head.appendChild(st);
  const words=['Scanning profiles · analysing signals · comparing matches','Searching new opportunities · checking compatibility','Monitoring new requests · evaluating your profile','Still searching · Nexora is watching for a strong match'];
  setInterval(()=>{if(!active)return;tick++;const w=scanner.querySelector('#nxScanWords');if(w&&tick%4===0)w.textContent=words[(tick/4)%words.length|0]},1000);
  const demo=[
    ['K','Studio Kivu','@studio_kivu','New website redesign opportunity detected.','96%'],['M','Maison M','@maison_m','Restaurant group looking for a digital partner.','91%'],['N','Nexum Agency','@nexum_agency','Marketing design brief detected.','87%'],['A','AfriMarket','@afr_market','E-commerce storefront project detected.','94%'],['L','Lumi Events','@lumi_events','Event photography request detected.','89%'],['C','Congo Creators','@congo_creators','Looking for a social media specialist.','86%'],['B','Business CTG','@business_ctg','Business website opportunity detected.','84%'],['T','Tony Mart','@tony_mart','Online store support request detected.','82%'],['K','Kivu Homes','@kivu_homes','Real-estate marketing need detected.','90%'],['P','Pixel House','@pixel_house','Brand identity project detected.','88%'],['S','Safi Services','@safi_services','Digital campaign opportunity detected.','85%'],['R','RDC Retail','@rdc_retail','Customer acquisition project detected.','83%']
  ];
  let index=0;
  function createNotification(){
    if(!active)return;
    const d=demo[index%demo.length];index++;const now=new Date();const time=now.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'});
    const data={initial:d[0],name:d[1],handle:d[2],need:d[3],match:d[4],time};
    window.NexoraAddAutoProspect?.(data); window.NexoraShowAutoNotification?.(data);
    const badge=$('.nav-badge');if(badge)badge.textContent=String((parseInt(badge.textContent)||0)+1);
    const toast=$('#workspaceToast');if(toast){toast.textContent=`Nouveau match détecté · ${d[4]} · ${d[1]}`;toast.style.opacity='1';clearTimeout(window.__nxToast);window.__nxToast=setTimeout(()=>toast.style.opacity='0',2800)}
    schedule();
  }
  function schedule(){clearTimeout(detectTimer);if(!active)return;detectTimer=setTimeout(createNotification,16000+Math.floor(Math.random()*9000));}
  function sync(){const live=auto.querySelector('.live');active=live?.textContent!=='PAUSED';scanner.style.opacity=active?'1':'.55';const strong=scanner.querySelector('strong');if(strong)strong.textContent=active?'Nexora AI is searching…':'Nexora AI search paused';if(active)schedule();else clearTimeout(detectTimer)}
  document.addEventListener('click',e=>{if(e.target.closest('.auto-cancel,#autoToggle,.toggle'))setTimeout(sync,40)});
  sync();
})();