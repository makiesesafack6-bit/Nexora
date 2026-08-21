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

const findInput = document.getElementById('findInput');
const findButton = document.getElementById('findButton');

function showToast(message){
  let toast=document.getElementById('workspaceToast');
  if(!toast){toast=document.createElement('div');toast.id='workspaceToast';toast.style.cssText='position:fixed;right:24px;bottom:24px;z-index:160;padding:12px 15px;background:#151a27;border:1px solid #2a3244;color:#e8ebf3;border-radius:12px;font-size:10px;box-shadow:0 15px 40px rgba(0,0,0,.3)';document.body.appendChild(toast);}
  toast.textContent=message; toast.style.opacity='1'; clearTimeout(window.__toast); window.__toast=setTimeout(()=>toast.style.opacity='0',2400);
}

/* Demo opportunity index. This is intentionally local demo data for the prototype. */
const prospects = [
 {id:1,name:'Jessica Events',handle:'@jessica_events',role:'Event planner',need:'Photographer for wedding events',location:'Kinshasa, RDC',source:'Instagram',match:95,detected:8,description:'Jessica is preparing several weddings and is looking for a reliable photographer who can cover events in Kinshasa.',tags:['Photography','Wedding','Kinshasa'],avatar:'J'},
 {id:2,name:'Business CTG',handle:'@business_ctg',role:'Small business',need:'Business website and online presence',location:'Kinshasa, RDC',source:'Facebook',match:89,detected:24,description:'A growing local business is looking for a web professional to improve its online presence and create a modern website.',tags:['Web','Business','Kinshasa'],avatar:'B'},
 {id:3,name:'Tony Mart',handle:'@tony_mart',role:'E-commerce owner',need:'Online store solution',location:'Kinshasa, RDC',source:'TikTok',match:80,detected:61,description:'Tony is looking for help launching an online store and improving his digital sales flow.',tags:['E-commerce','Web','Digital'],avatar:'T'},
 {id:4,name:'Coach Anna',handle:'@coach_anna',role:'Coach',need:'Marketing strategy and content',location:'Kinshasa, RDC',source:'Instagram',match:72,detected:143,description:'Coach Anna is searching for a marketing partner to improve visibility and attract new clients.',tags:['Marketing','Coaching','Content'],avatar:'A'},
 {id:5,name:'Studio Kivu',handle:'@studio_kivu',role:'Creative studio',need:'Website redesign',location:'Goma, RDC',source:'LinkedIn',match:96,detected:8,description:'Studio Kivu needs a clean website redesign and a stronger portfolio experience.',tags:['Web','Design','RDC'],avatar:'K'},
 {id:6,name:'Maison M',handle:'@maison_m',role:'Restaurant group',need:'Digital marketing partner',location:'Lubumbashi, RDC',source:'Instagram',match:91,detected:24,description:'Maison M is looking for a digital partner to improve social media and online customer acquisition.',tags:['Marketing','Restaurant','RDC'],avatar:'M'}
];

const formatDetected = minutesAgo => {
  const d = new Date(Date.now() - minutesAgo * 60000);
  return d.toLocaleString('fr-FR',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'});
};

document.querySelectorAll('.prospect').forEach((row,index)=>{
  const small=row.querySelector('.person small');
  if(small) small.textContent=`${small.textContent} · Détecté ${formatDetected(prospects[index]?.detected || 10)}`;
  const button=row.querySelector('button');
  if(button) button.addEventListener('click',()=>openProspect(prospects[index]));
});

document.querySelectorAll('.alerts article').forEach((article,index)=>{
  const small=article.querySelector('small');
  if(small){const m=prospects[index]?.detected||10;small.textContent=`Détecté le ${formatDetected(m)} · il y a ${m>=60?`${Math.floor(m/60)} h`:`${m} min`}`;}
});

function ensureModal(){
  let modal=document.getElementById('nexoraModal');
  if(modal) return modal;
  modal=document.createElement('div'); modal.id='nexoraModal';
  modal.style.cssText='position:fixed;inset:0;z-index:200;background:rgba(3,6,12,.72);backdrop-filter:blur(14px);display:none;align-items:center;justify-content:center;padding:20px';
  modal.innerHTML=`<div id="nexoraModalCard" style="width:min(620px,100%);max-height:90vh;overflow:auto;background:#0d111b;border:1px solid #252c3d;border-radius:22px;box-shadow:0 30px 100px rgba(0,0,0,.5);padding:26px"></div>`;
  modal.addEventListener('click',e=>{if(e.target===modal) closeModal();});
  document.body.appendChild(modal); return modal;
}
function closeModal(){const m=document.getElementById('nexoraModal');if(m)m.style.display='none';}
function openProspect(p){
  const m=ensureModal(), c=document.getElementById('nexoraModalCard');
  c.innerHTML=`<button id="closeModal" style="float:right;border:0;background:#171d29;color:#9da5b5;border-radius:10px;width:34px;height:34px;cursor:pointer">×</button><div style="display:flex;gap:14px;align-items:center"><div style="width:58px;height:58px;border-radius:16px;background:linear-gradient(135deg,#6049e8,#8b72ff);display:grid;place-items:center;color:#fff;font:800 20px Manrope">${p.avatar}</div><div><span style="color:#8b79ff;font-size:9px;font-weight:800">${p.source} · DETECTED ${formatDetected(p.detected)}</span><h2 style="margin:5px 0 3px;color:#fff;font:800 24px Manrope">${p.name}</h2><p style="margin:0;color:#7d8799;font-size:10px">${p.handle} · ${p.role} · ${p.location}</p></div></div><div style="margin:24px 0;padding:17px;border:1px solid #242b3a;border-radius:16px;background:#111622"><div style="display:flex;justify-content:space-between;gap:15px"><strong style="color:#eef0f5;font-size:11px">Nexora Match</strong><b style="color:#9ae8be;font-size:18px">${p.match}%</b></div><div style="height:6px;background:#1b2230;border-radius:99px;margin-top:10px;overflow:hidden"><i style="display:block;height:100%;width:${p.match}%;background:linear-gradient(90deg,#6a55ff,#5de1a2);border-radius:99px"></i></div></div><span style="color:#727d90;font-size:9px;font-weight:800;letter-spacing:.1em">NEED DETECTED</span><h3 style="margin:7px 0;color:#f1f2f5;font:700 18px Manrope">${p.need}</h3><p style="color:#858ea0;font-size:11px;line-height:1.7">${p.description}</p><div style="display:flex;gap:7px;flex-wrap:wrap;margin:16px 0 24px">${p.tags.map(t=>`<span style="padding:7px 9px;background:#171d29;border:1px solid #242b3a;border-radius:999px;color:#8d98aa;font-size:9px">${t}</span>`).join('')}</div><button id="prepareContact" style="width:100%;height:44px;border:0;border-radius:11px;background:linear-gradient(135deg,#6d54ff,#8058ff);color:#fff;font-size:10px;font-weight:800">Préparer le contact</button>`;
  m.style.display='flex'; document.getElementById('closeModal').onclick=closeModal; document.getElementById('prepareContact').onclick=()=>{showToast('Le contact sera activé avec la messagerie Nexora.');};
}

function runSearch(query){
  const q=(query||'').trim().toLowerCase();
  if(!q){showToast('Décrivez ce que vous recherchez.');findInput?.focus();return;}
  const terms=q.split(/\s+/).filter(x=>x.length>2);
  const results=prospects.map(p=>{const hay=[p.name,p.handle,p.role,p.need,p.location,p.source,...p.tags].join(' ').toLowerCase();const hits=terms.filter(t=>hay.includes(t)).length;return {...p,score:Math.min(99,Math.max(45,p.match+hits*3))};}).sort((a,b)=>b.score-a.score);
  const matched=results.filter(p=>terms.some(t=>[p.role,p.need,p.location,p.source,...p.tags].join(' ').toLowerCase().includes(t)));
  openSearchResults(matched.length?matched:results.slice(0,4),q);
}
function openSearchResults(results,q){
  const m=ensureModal(),c=document.getElementById('nexoraModalCard');
  c.innerHTML=`<button id="closeModal" style="float:right;border:0;background:#171d29;color:#9da5b5;border-radius:10px;width:34px;height:34px;cursor:pointer">×</button><span style="color:#8b79ff;font-size:9px;font-weight:800">NEXORA FIND</span><h2 style="margin:7px 0 5px;color:#fff;font:800 25px Manrope">Résultats pour “${escapeHtml(q)}”</h2><p style="margin:0 0 20px;color:#7d8799;font-size:10px">${results.length} opportunités correspondantes · classées par compatibilité</p><div id="searchResults" style="display:grid;gap:9px">${results.map(p=>`<button class="result-row" data-id="${p.id}" style="text-align:left;width:100%;border:1px solid #202838;background:#111622;border-radius:14px;padding:14px;cursor:pointer;color:#fff"><div style="display:flex;align-items:center;gap:11px"><span style="width:38px;height:38px;border-radius:11px;background:linear-gradient(135deg,#6049e8,#8b72ff);display:grid;place-items:center;font-weight:800">${p.avatar}</span><span style="flex:1"><strong style="display:block;font-size:11px">${p.name}</strong><small style="display:block;color:#788294;font-size:9px;margin-top:3px">${p.need} · ${p.location}</small></span><b style="color:#9ae8be;font-size:12px">${p.score}%</b></div><div style="display:flex;justify-content:space-between;margin-top:9px;color:#596477;font-size:8px"><span>${p.source}</span><span>Détecté ${formatDetected(p.detected)}</span></div></button>`).join('')}</div>`;
  m.style.display='flex';document.getElementById('closeModal').onclick=closeModal;document.querySelectorAll('.result-row').forEach(btn=>btn.addEventListener('click',()=>openProspect(prospects.find(p=>p.id===Number(btn.dataset.id)))));
}
function escapeHtml(s){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}

findButton?.addEventListener('click',()=>runSearch(findInput?.value));
findInput?.addEventListener('keydown',e=>{if(e.key==='Enter')runSearch(findInput.value);});
document.querySelectorAll('.chips button').forEach(btn=>btn.addEventListener('click',()=>{findInput.value=btn.textContent;runSearch(btn.textContent);}));
document.getElementById('findNav')?.addEventListener('click',()=>setTimeout(()=>findInput?.focus(),150));
document.querySelectorAll('.prospect button').forEach(btn=>btn.addEventListener('click',e=>e.stopPropagation()));

document.getElementById('notifButton')?.addEventListener('click',()=>document.getElementById('messages')?.scrollIntoView({behavior:'smooth'}));
document.getElementById('markRead')?.addEventListener('click',()=>{document.querySelectorAll('.alerts article>b').forEach(el=>el.remove());setText('notificationCount','0');setText('alertStat','0');showToast('Notifications marquées comme lues.');});

document.getElementById('autoToggle')?.addEventListener('click',e=>{const btn=e.currentTarget;const on=btn.classList.toggle('on');btn.setAttribute('aria-pressed',String(on));const status=document.querySelector('.ai-mini strong');if(status)status.textContent=on?'Auto-Match active':'Auto-Match paused';showToast(on?'Nexora Auto-Match est actif.':'Auto-Match a été mis en pause.');});

/* Auto-Match demo: continuously simulates the background worker and can surface a new notification. */
let autoSeen=false;
setTimeout(()=>{
  const toggle=document.getElementById('autoToggle');
  if(toggle?.classList.contains('on') && !autoSeen){
    autoSeen=true;const p=prospects[4];const alerts=document.querySelector('.alerts');
    if(alerts){const article=document.createElement('article');article.innerHTML=`<div class="alert-icon">${p.avatar}</div><div><strong>${p.match}% match · ${p.name}</strong><p>${p.need} — opportunité détectée par Auto-Match.</p><small>Détecté le ${formatDetected(0)} · à l’instant</small></div><b>NEW</b>`;alerts.prepend(article);}
    showToast(`Nouveau match ${p.match}% détecté par Auto-Match.`);
  }
},12000);

/* Animated AI-style placeholder in Find. */
const aiPrompts=['Je cherche un photographe à Kinshasa...','Je cherche des entreprises qui ont besoin d’un site web...','Je cherche des clients pour mon agence...','Trouve-moi des prospects dans mon secteur...','Je veux trouver des opportunités qui me correspondent...'];
let promptIndex=0,promptChar=0,deleting=false,promptTimer;
const animatePlaceholder=()=>{if(!findInput||document.activeElement===findInput||findInput.value)return;const text=aiPrompts[promptIndex];if(!deleting){promptChar++;findInput.placeholder=text.slice(0,promptChar)+(promptChar<text.length?'▌':'');if(promptChar>=text.length){deleting=true;promptTimer=setTimeout(animatePlaceholder,1700);return;}}else{promptChar--;findInput.placeholder=text.slice(0,promptChar)+(promptChar>0?'▌':'');if(promptChar<=0){deleting=false;promptIndex=(promptIndex+1)%aiPrompts.length;}}promptTimer=setTimeout(animatePlaceholder,deleting?35:55);};
setTimeout(animatePlaceholder,500);
findInput?.addEventListener('focus',()=>{clearTimeout(promptTimer);findInput.placeholder='Décrivez ce que vous recherchez...';});
findInput?.addEventListener('blur',()=>{if(!findInput.value){promptChar=0;deleting=false;clearTimeout(promptTimer);animatePlaceholder();}});

let seconds=0;setInterval(()=>{seconds++;const target=document.getElementById('scanTimer');if(target&&seconds<60)target.textContent=`il y a ${seconds}s`;},1000);

document.querySelectorAll('.nav-item[href^="#"]').forEach(link=>link.addEventListener('click',e=>{const id=link.getAttribute('href').slice(1);const target=document.getElementById(id);if(target){e.preventDefault();target.scrollIntoView({behavior:'smooth'});document.querySelectorAll('.nav-item').forEach(x=>x.classList.remove('active'));link.classList.add('active');}}));