(() => {
  const LANGS={auto:'Automatique',fr:'Français',en:'English',es:'Español',pt:'Português',de:'Deutsch',it:'Italiano',sw:'Kiswahili',ln:'Lingála',ar:'العربية',zh:'中文',hi:'हिन्दी',tr:'Türkçe'};
  const RTL=new Set(['ar']);
  let currentSelect=null;
  const readSettings=()=>{try{return JSON.parse(localStorage.getItem('nexoraSettings')||'{}')}catch{return{}}};
  const saveLanguage=language=>{try{const s=readSettings();localStorage.setItem('nexoraSettings',JSON.stringify({...s,language}));localStorage.setItem('nexoraLanguage',language)}catch{}};
  const getCurrent=()=>{const s=readSettings();return LANGS[s.language]?s.language:(window.NexoraI18n?.getLanguage?.()||'auto')};
  function apply(next){
    const value=LANGS[next]?next:'auto';
    saveLanguage(value);
    const api=window.NexoraI18n;
    if(api?.setLanguage) api.setLanguage(value);
    setTimeout(()=>api?.translateTree?.(),50);
    document.documentElement.lang=value==='auto'?'en':value;
    document.documentElement.dir=RTL.has(value)?'rtl':'ltr';
    document.body.classList.toggle('nx-rtl',RTL.has(value));
  }
  function forceSelector(){
    const select=document.getElementById('nxLanguage');
    if(!select)return;
    const signature=Object.entries(LANGS).map(([k,v])=>k+'='+v).join('|');
    if(select.dataset.nxLanguageSignature!==signature){
      const old=select.value;
      const frag=document.createDocumentFragment();
      Object.entries(LANGS).forEach(([code,label])=>{const o=document.createElement('option');o.value=code;o.textContent=label;frag.appendChild(o)});
      select.replaceChildren(frag);
      select.dataset.nxLanguageSignature=signature;
      select.value=LANGS[old]?old:getCurrent();
    } else if(!LANGS[select.value]) {
      select.value=getCurrent();
    }
    if(currentSelect!==select){
      select.onchange=e=>apply(e.target.value);
      currentSelect=select;
    }
  }
  function boot(){
    forceSelector();
    const observer=new MutationObserver(forceSelector);
    observer.observe(document.body,{subtree:true,childList:true});
    setInterval(forceSelector,250);
    window.NexoraI18nSettings={setup:forceSelector,languages:LANGS};
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
