(() => {
  const LANGS = {
    auto:'Automatique', fr:'Français', en:'English', es:'Español', pt:'Português', de:'Deutsch',
    it:'Italiano', sw:'Kiswahili', ln:'Lingála', ar:'العربية', zh:'中文', hi:'हिन्दी', tr:'Türkçe'
  };
  let lastSelect = null;
  let bound = false;
  function readSaved(){
    try { return JSON.parse(localStorage.getItem('nexoraSettings')||'{}'); } catch { return {}; }
  }
  function buildSelect(select){
    if (!select) return false;
    const saved = readSaved();
    const current = LANGS[saved.language] ? saved.language : (window.NexoraI18n?.getLanguage?.() || 'auto');
    const sig = Object.entries(LANGS).map(([k,v])=>k+'='+v).join('|');
    if (select.dataset.nxLangSig !== sig) {
      select.innerHTML = Object.entries(LANGS).map(([code,label]) => `<option value="${code}">${label}</option>`).join('');
      select.dataset.nxLangSig = sig;
    }
    select.value = LANGS[select.value] ? select.value : (LANGS[current] ? current : 'auto');
    if (lastSelect !== select || !bound) {
      select.onchange = () => {
        const next = select.value;
        try {
          const s = readSaved();
          localStorage.setItem('nexoraSettings', JSON.stringify({...s, language: next}));
          localStorage.setItem('nexoraLanguage', next);
        } catch {}
        if (window.NexoraI18n?.setLanguage) window.NexoraI18n.setLanguage(next);
        else window.dispatchEvent(new CustomEvent('nexora-language-changed',{detail:{language:next}}));
        setTimeout(() => window.NexoraI18n?.translateTree?.(), 0);
      };
      lastSelect = select;
      bound = true;
    }
    return true;
  }
  function tick(){
    const select = document.getElementById('nxLanguage');
    if (select) buildSelect(select);
    if (window.NexoraI18n?.translateTree) window.NexoraI18n.translateTree();
  }
  const obs = new MutationObserver(tick);
  function boot(){
    tick();
    if(document.body) obs.observe(document.body,{subtree:true,childList:true});
    setInterval(tick,500);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
})();
