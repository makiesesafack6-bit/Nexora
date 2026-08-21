const profile = JSON.parse(localStorage.getItem('nexoraProfile') || '{}');
const account = JSON.parse(localStorage.getItem('nexoraAccount') || '{}');
const name = account.name || 'Votre compte';
const role = profile.role || 'Professionnel';
const zone = profile.zone || 'International';
const sector = profile.sector || 'Tech';
const clients = profile.clients || 'PME';

const setText = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value; };
setText('sideName', name); setText('topName', name); setText('sideAvatar', name.charAt(0).toUpperCase()); setText('topAvatar', name.charAt(0).toUpperCase());
setText('welcomeTitle', `Good evening, ${name}. 👋`);
setText('welcomeSub', `${role} · ${zone}. Nexora continue de surveiller les opportunités qui correspondent à votre profil.`);
setText('profileRole', role); setText('profileMeta', `${zone} · ${clients}`); setText('profileAvatar', role.charAt(0).toUpperCase());
const tagTarget = document.getElementById('profileTags'); if (tagTarget) tagTarget.innerHTML = [profile.skills, sector, clients, zone].filter(Boolean).map(v=>`<span>${v}</span>`).join('');

const overlay = document.getElementById('searchLoading');
const findInput = document.getElementById('findInput');
const globalSearch = document.getElementById('globalSearch');
const showComingSoon = (event) => { event?.preventDefault(); showToast('Le moteur Find sera activé après la finalisation du workspace.'); };

function showToast(message){
  let toast=document.getElementById('workspaceToast');
  if(!toast){toast=document.createElement('div');toast.id='workspaceToast';toast.style.cssText='position:fixed;right:24px;bottom:24px;z-index:160;padding:12px 15px;background:#151a27;border:1px solid #2a3244;color:#e8ebf3;border-radius:12px;font-size:10px;box-shadow:0 15px 40px rgba(0,0,0,.3)';document.body.appendChild(toast);}
  toast.textContent=message; toast.style.opacity='1'; clearTimeout(window.__toast); window.__toast=setTimeout(()=>toast.style.opacity='0',2400);
}

// The original Find handler is intentionally replaced below by the real 12-second AI search.

document.querySelectorAll('.search-suggestions button').forEach(btn=>btn.addEventListener('click',()=>{if(findInput){findInput.value=btn.textContent;showToast('Suggestion ajoutée.');}}));
globalSearch?.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();document.getElementById('findButton')?.click();}});

document.getElementById('findNav')?.addEventListener('click',()=>setTimeout(()=>findInput?.focus(),150));

document.getElementById('notifButton')?.addEventListener('click',()=>document.getElementById('messages')?.scrollIntoView({behavior:'smooth'}));
document.getElementById('markRead')?.addEventListener('click',()=>{
  document.querySelectorAll('.alerts article>b').forEach(el=>el.remove());
  setText('notificationCount','0'); setText('alertStat','0'); showToast('Notifications marquées comme lues.');
});

// Demo detection timestamps: Auto-Match records when Nexora says it discovered each opportunity.
const detectedOffsets = [8, 24, 61, 143];
const formatDetected = (minutesAgo) => {
  const d = new Date(Date.now() - minutesAgo * 60000);
  return d.toLocaleString('fr-FR', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' });
};

document.querySelectorAll('.prospect').forEach((row, index) => {
  const small = row.querySelector('.person small');
  if (small) small.textContent = `${small.textContent} · Détecté ${formatDetected(detectedOffsets[index] || 10)}`;
});

document.querySelectorAll('.alerts article').forEach((article, index) => {
  const small = article.querySelector('small');
  if (small) {
    const minutes = detectedOffsets[index] || 10;
    small.textContent = `Détecté le ${formatDetected(minutes)} · il y a ${minutes >= 60 ? `${Math.floor(minutes/60)} h` : `${minutes} min`}`;
  }
});

// Animated AI-style placeholder in Find. It never overwrites what the user types.
const aiPrompts = [
  'Je cherche un photographe à Kinshasa...',
  'Je cherche des entreprises qui ont besoin d’un site web...',
  'Je cherche des clients pour mon agence...',
  'Trouve-moi des prospects dans mon secteur...',
  'Je veux trouver des opportunités qui me correspondent...'
];
let promptIndex = 0;
let promptChar = 0;
let deleting = false;
let placeholderTimer;
const animatePlaceholder = () => {
  if (!findInput || document.activeElement === findInput || findInput.value) return;
  const text = aiPrompts[promptIndex];
  if (!deleting) {
    promptChar++;
    findInput.placeholder = text.slice(0, promptChar) + (promptChar < text.length ? '▌' : '');
    if (promptChar >= text.length) { deleting = true; placeholderTimer = setTimeout(animatePlaceholder, 1700); return; }
  } else {
    promptChar--;
    findInput.placeholder = text.slice(0, promptChar) + (promptChar > 0 ? '▌' : '');
    if (promptChar <= 0) { deleting = false; promptIndex = (promptIndex + 1) % aiPrompts.length; }
  }
  placeholderTimer = setTimeout(animatePlaceholder, deleting ? 35 : 55);
};
setTimeout(animatePlaceholder, 500);
findInput?.addEventListener('focus',()=>{ clearTimeout(placeholderTimer); findInput.placeholder='Décrivez ce que vous recherchez...'; });
findInput?.addEventListener('blur',()=>{ if(!findInput.value) { promptChar=0; deleting=false; clearTimeout(placeholderTimer); animatePlaceholder(); } });

// Keep the workspace feeling alive without pretending a live external search already exists.
let seconds=0; setInterval(()=>{seconds++; const target=document.getElementById('scanTimer'); if(target && seconds<60) target.textContent=`il y a ${seconds}s`;},1000);

document.querySelectorAll('.nav-item[href^="#"]').forEach(link=>link.addEventListener('click',e=>{
  const id=link.getAttribute('href').slice(1); const target=document.getElementById(id); if(target){e.preventDefault();target.scrollIntoView({behavior:'smooth'});document.querySelectorAll('.nav-item').forEach(x=>x.classList.remove('active'));link.classList.add('active');}
}));

// ===== Nexora AI Search / Auto-Match runtime =====
// Replace the original click targets so the old "coming soon" handler cannot fire.
const originalFindButton=document.getElementById('findButton');
const findButton=originalFindButton?.cloneNode(true);
if(originalFindButton && findButton){originalFindButton.replaceWith(findButton);}
const originalAutoToggle=document.getElementById('autoToggle');
const autoToggle=originalAutoToggle?.cloneNode(true);
if(originalAutoToggle && autoToggle){originalAutoToggle.replaceWith(autoToggle);}

let autoMatchActive=true;
let searchRunning=false;
let searchTimer=null;
let searchProgressTimer=null;

const autoSection=document.getElementById('auto');
let cancelAuto=document.getElementById('cancelAutoSearch');
if(autoSection && !cancelAuto){
  cancelAuto=document.createElement('button');
  cancelAuto.id='cancelAutoSearch';
  cancelAuto.type='button';
  cancelAuto.textContent='Annuler la recherche';
  cancelAuto.style.cssText='margin-left:auto;flex:none;border:1px solid #d8dde8;background:#fff;color:#4d5668;border-radius:10px;padding:11px 15px;font:600 13px/1 DM Sans,Arial,sans-serif;cursor:pointer;white-space:nowrap';
  autoSection.appendChild(cancelAuto);
}

const scanStatus=document.getElementById('scanTimer');
function setAuto(active,toast=true){
  autoMatchActive=active;
  autoToggle?.classList.toggle('on',active);
  autoToggle?.setAttribute('aria-pressed',String(active));
  const mini=document.querySelector('.ai-mini strong');
  const miniSmall=document.querySelector('.ai-mini small');
  const live=document.querySelector('.automation .live');
  const pulse=autoSection?.querySelector('.pulse');
  if(mini)mini.textContent=active?'Auto-Match active':'Auto-Match paused';
  if(miniSmall)miniSmall.textContent=active?'Recherche continue':'Recherche annulée';
  if(live)live.textContent=active?'LIVE':'PAUSED';
  if(pulse)pulse.style.opacity=active?'1':'.35';
  if(cancelAuto){cancelAuto.textContent=active?'Annuler la recherche':'Relancer la recherche';cancelAuto.style.opacity=active?'1':'.8';}
  if(toast)showToast(active?'Nexora Auto-Match recherche en continu.':'Recherche Auto-Match annulée.');
}

autoToggle?.addEventListener('click',()=>setAuto(!autoMatchActive));
cancelAuto?.addEventListener('click',()=>setAuto(!autoMatchActive));
setAuto(true,false);

function ensureSearchOverlay(){
  if(!overlay)return null;
  let box=overlay.querySelector('.nexora-search-progress');
  if(!box){
    box=document.createElement('div');box.className='nexora-search-progress';box.style.cssText='width:min(560px,88vw);margin-top:24px';
    box.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;font:700 14px/1 DM Sans,Arial,sans-serif;color:#1b2230"><span id="nxSearchStep">Analyse de votre demande...</span><b id="nxSearchPct">0%</b></div><div style="height:8px;background:#e8ecf3;border-radius:999px;overflow:hidden"><div id="nxSearchBar" style="height:100%;width:0%;background:linear-gradient(90deg,#111827,#6d5dfc);border-radius:999px;transition:width .2s ease"></div></div><div style="display:grid;gap:8px;margin-top:18px;text-align:left;font:600 13px/1.4 DM Sans,Arial,sans-serif;color:#6b7485"><span id="nxStep1">○ Lecture de la demande</span><span id="nxStep2">○ Scan des opportunités</span><span id="nxStep3">○ Comparaison des profils</span><span id="nxStep4">○ Classement des meilleurs matchs</span></div><button id="cancelFindSearch" type="button" style="margin-top:22px;border:1px solid #cfd5e1;background:#fff;color:#424b5c;border-radius:10px;padding:11px 18px;font:700 13px/1 DM Sans,Arial,sans-serif;cursor:pointer">Annuler la recherche</button>';
    overlay.appendChild(box);
  }
  return box;
}
function setSearchStep(index,title){
  const labels=['Lecture de la demande','Scan des opportunités','Comparaison des profils','Classement des meilleurs matchs'];
  const titleEl=document.getElementById('nxSearchStep');if(titleEl)titleEl.textContent=title;
  labels.forEach((label,i)=>{const e=document.getElementById('nxStep'+(i+1));if(e){e.textContent=(i<index?'✓ ':i===index?'• ':'○ ')+label;e.style.color=i<=index?'#111827':'#7b8495';}});
}
function startFindSearch(query){
  if(searchRunning||!overlay)return;
  searchRunning=true;
  const box=ensureSearchOverlay();
  overlay.classList.remove('hidden');
  const bar=document.getElementById('nxSearchBar'),pct=document.getElementById('nxSearchPct');
  if(bar)bar.style.width='0%';if(pct)pct.textContent='0%';
  setSearchStep(0,'Analyse de votre demande...');
  const started=Date.now();
  searchProgressTimer=setInterval(()=>{
    const elapsed=Date.now()-started;
    const progress=Math.min(96,Math.floor(elapsed/12000*100));
    if(bar)bar.style.width=progress+'%';if(pct)pct.textContent=progress+'%';
    if(elapsed<3000)setSearchStep(0,'Analyse de votre demande...');
    else if(elapsed<6000)setSearchStep(1,'Scan des opportunités...');
    else if(elapsed<9000)setSearchStep(2,'Comparaison des profils...');
    else setSearchStep(3,'Classement des meilleurs matchs...');
  },200);
  searchTimer=setTimeout(()=>{
    clearInterval(searchProgressTimer);searchProgressTimer=null;searchRunning=false;
    if(bar)bar.style.width='100%';if(pct)pct.textContent='100%';
    setSearchStep(4,'Recherche terminée — résultats prêts.');
    setTimeout(()=>{overlay.classList.add('hidden');showToast(`Recherche terminée : ${query||'votre demande'}`);document.getElementById('prospects')?.scrollIntoView({behavior:'smooth',block:'start'});},700);
  },12000);
}
function cancelFindSearch(){
  if(!searchRunning)return;
  clearTimeout(searchTimer);clearInterval(searchProgressTimer);searchTimer=null;searchProgressTimer=null;searchRunning=false;overlay?.classList.add('hidden');showToast('Recherche Find annulée.');
}
findButton?.addEventListener('click',()=>startFindSearch(findInput?.value.trim()||'ma recherche'));
document.getElementById('quickFind')?.addEventListener('click',()=>startFindSearch('recherche rapide'));
const cancelFindSearchButton=document.getElementById('cancelFindSearch');cancelFindSearchButton?.addEventListener('click',cancelFindSearch);
if(overlay){overlay.addEventListener('click',e=>{if(e.target.id==='cancelFindSearch')cancelFindSearch();});}
