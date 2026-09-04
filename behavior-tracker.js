(() => {
  function loadScript(src,attr){
    if(document.querySelector(`script[data-${attr}]`)) return;
    const s=document.createElement('script');s.src=src;s.async=true;s.dataset[attr]='1';
    s.onerror=()=>console.warn(`[Nexora] ${attr} unavailable.`);document.head.appendChild(s);
  }
  loadScript('/i18n.js?v=20260904-3','nexora-i18n');
  loadScript('/i18n-settings.js?v=20260904-3','nexora-i18n-settings');
  loadScript('/i18n-extra.js?v=20260904-3','nexora-i18n-extra');
  loadScript('/i18n-force.js?v=20260904-1','nexora-i18n-force');

  const I=()=>window.NexoraIntent;
  const text=el=>(el?.textContent||'').trim();
  const topicsFrom=(s)=>I?.normalize?.(s||'').split(/[^a-z0-9]+/).filter(x=>x.length>2).slice(0,10)||[];
  document.addEventListener('click',(event)=>{
    const target=event.target?.closest?.('button,a');
    if(!target||!I) return;
    const label=text(target).toLowerCase();
    if(/find clients|new search|rechercher|trouver/.test(label)){
      const input=document.querySelector('#findInput');
      I.trackAction('search',{query:input?.value||'',topics:topicsFrom((input?.value||'')+' '+label)});return;
    }
    if(/copier le message|copy message|copier/.test(label)){
      I.trackAction('copy_message',{topics:topicsFrom(target.parentElement?.textContent||'')});return;
    }
    if(/voir le prospect|voir les details|voir les détails|ouvrir le profil|view profile/.test(label)){
      I.trackAction('open_prospect',{prospectId:target.closest('[data-prospect-id]')?.dataset?.prospectId||null,topics:topicsFrom(target.closest('.prospect')?.textContent||'')});return;
    }
    if(/auto-match|automatch/.test(label)) I.trackAction('open_auto_match',{topics:topicsFrom(label)});
  },true);
  document.addEventListener('submit',(event)=>{
    if(!I) return;
    const textContent=event.target?.textContent||'';
    if(/find/i.test(textContent)){
      const input=event.target.querySelector('input,textarea');
      I.trackAction('search',{query:input?.value||'',topics:topicsFrom(textContent+' '+(input?.value||''))});
    }
  },true);
  I?.refresh?.();
})();
