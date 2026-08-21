/* Nexora Auto-Match live simulation layer. Demo-only: no external client data is queried yet. */
(function(){
  const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
  let active=true, tick=0, detectTimer=null;
  const toast=(m)=>{let t=$('#workspaceToast');if(!t)return;t.textContent=m;t.style.opacity='1';clearTimeout(window.__nxToast);window.__nxToast=setTimeout(()=>t.style.opacity='0',2800)};
  const auto=$('.automation');
  if(!auto)return;
  // Persistent animated scanner shown whenever Auto-Match is active.
  let scanner=auto.querySelector('.nx-live-scanner');
  if(!scanner){scanner=document.createElement('div');scanner.className='nx-live-scanner';scanner.innerHTML='<span class="nx-scan-orb"></span><div><strong>Nexora AI is searching…</strong><small id="nxScanWords">Scanning profiles · analysing signals · comparing matches</small></div><b id="nxScanDots">•••</b>';scanner.style.cssText='display:flex;align-items:center;gap:12px;margin-top:14px;padding:12px 14px;border:1px solid #dfe4ed;border-radius:12px;background:#fafbfc';auto.querySelector('.auto-copy')?.appendChild(scanner)}
  const orb=scanner.querySelector('.nx-scan-orb'); if(orb)orb.style.cssText='width:10px;height:10px;border-radius:50%;background:#111827;box-shadow:0 0 0 0 #11182755;animation:nxPulse 1.4s infinite';
  const st=document.createElement('style');st.textContent='@keyframes nxPulse{0%{box-shadow:0 0 0 0 #11182755}70%{box-shadow:0 0 0 9px transparent}100%{box-shadow:0 0 0 0 transparent}}@keyframes nxDots{0%,20%{opacity:.2}50%{opacity:1}80%,100%{opacity:.2}}#nxScanDots{letter-spacing:3px;animation:nxDots 1.2s infinite}';document.head.appendChild(st);
  const words=['Scanning profiles · analysing signals · comparing matches','Searching new opportunities · checking compatibility','Monitoring new requests · evaluating your profile','Still searching · Nexora is watching for a strong match'];
  setInterval(()=>{if(!active)return;tick++;const w=scanner.querySelector('#nxScanWords');if(w&&tick%4===0)w.textContent=words[(tick/4)%words.length|0]},1000);
  // Demo-only detection cycle: every 30s while active, reveal one preloaded notification.
  function notify(){if(!active)return;const cards=$$('.notifications-panel .alerts article');const hidden=cards.find(c=>getComputedStyle(c).display==='none');if(!hidden)return;hidden.style.display='flex';const small=hidden.querySelector('small');const now=new Date();if(small)small.textContent='Détecté à l’instant · '+now.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'});const badge=hidden.querySelector('b');if(badge)badge.textContent='NEW';const navBadge=$('.nav-badge');if(navBadge){navBadge.textContent=String((parseInt(navBadge.textContent)||0)+1)}toast('Nouveau match détecté par Auto-Match.');}
  function schedule(){clearTimeout(detectTimer);detectTimer=setTimeout(()=>{notify();schedule()},30000)}
  // Keep Auto-Match controls synchronized with the existing platform runtime.
  const sync=()=>{const live=document.querySelector('.automation .live');active=live?.textContent!=='PAUSED';scanner.style.opacity=active?'1':'.55';const strong=scanner.querySelector('strong');if(strong)strong.textContent=active?'Nexora AI is searching…':'Nexora AI search paused';if(active)schedule();else clearTimeout(detectTimer)};
  document.addEventListener('click',e=>{if(e.target.closest('.auto-cancel,#autoToggle,.toggle'))setTimeout(sync,40)});
  sync();
})();