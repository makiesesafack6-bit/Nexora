(() => {
  const LANGS={
    auto:'Automatique',fr:'Français',en:'English',es:'Español',pt:'Português',de:'Deutsch',it:'Italiano',sw:'Kiswahili',ln:'Lingála',ar:'العربية',zh:'中文',hi:'हिन्दी',tr:'Türkçe'
  };
  function setup(){
    const select=document.getElementById('nxLanguage');
    if(!select)return false;
    const saved=(()=>{try{return JSON.parse(localStorage.getItem('nexoraSettings')||'{}')}catch{return{}}})();
    const current=saved.language||window.NexoraI18n?.getLanguage?.()||'auto';
    select.innerHTML='';
    Object.entries(LANGS).forEach(([code,label])=>{const o=document.createElement('option');o.value=code;o.textContent=label;select.appendChild(o)});
    select.value=LANGS[current]?current:'auto';
    select.onchange=()=>{window.NexoraI18n?.setLanguage?.(select.value);localStorage.setItem('nexoraLanguage',select.value)};
    return true;
  }
  function boot(){
    if(!setup())setTimeout(boot,100);
    const obs=new MutationObserver(()=>setup());
    obs.observe(document.body,{childList:true,subtree:true});
    window.NexoraI18nSettings={setup};
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
