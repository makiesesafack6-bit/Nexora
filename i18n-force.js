(() => {
  const FALLBACK_LANGS = {
    auto:'Automatique', fr:'Français', en:'English', es:'Español', pt:'Português', de:'Deutsch', it:'Italiano', sw:'Kiswahili', ln:'Lingála', ar:'العربية', zh:'中文', hi:'हिन्दी', tr:'Türkçe'
  };

  function getSaved(){
    try{return JSON.parse(localStorage.getItem('nexoraSettings')||'{}')}catch{return{}}
  }

  function saveLanguage(language){
    const s=getSaved();
    localStorage.setItem('nexoraSettings',JSON.stringify({...s,language}));
    localStorage.setItem('nexoraLanguage',language);
  }

  function detect(){
    const code=(navigator.language||'en').toLowerCase().split('-')[0];
    return Object.prototype.hasOwnProperty.call(FALLBACK_LANGS,code) ? code : 'en';
  }

  function available(){
    const api=window.NexoraI18n?.languages||{};
    return {...FALLBACK_LANGS,...api};
  }

  function patchSelect(){
    const select=document.getElementById('nxLanguage');
    if(!select)return;
    const langs=available();
    const saved=getSaved();
    const selected=saved.language||window.NexoraI18n?.getLanguage?.()||'auto';
    const signature=Object.keys(langs).join('|');
    if(select.dataset.nxLangSignature!==signature){
      select.innerHTML='';
      Object.entries(langs).forEach(([code,label])=>{
        const option=document.createElement('option');
        option.value=code;
        option.textContent=label;
        select.appendChild(option);
      });
      select.dataset.nxLangSignature=signature;
    }
    select.value=Object.prototype.hasOwnProperty.call(langs,selected)?selected:'auto';
    if(select.dataset.nxBound!=='1'){
      select.dataset.nxBound='1';
      select.addEventListener('change',()=>{
        const value=select.value;
        saveLanguage(value);
        const resolved=value==='auto'?detect():value;
        if(window.NexoraI18n?.setLanguage) window.NexoraI18n.setLanguage(resolved);
        window.NexoraI18n?.translateTree?.();
        window.dispatchEvent(new CustomEvent('nexora-language-changed',{detail:{language:resolved,userSelected:value}}));
      });
    }
  }

  function boot(){
    patchSelect();
    if(window.MutationObserver){
      const obs=new MutationObserver(()=>patchSelect());
      obs.observe(document.body,{subtree:true,childList:true});
    }
    setInterval(patchSelect,500);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
})();
