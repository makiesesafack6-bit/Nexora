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
const findButton = document.getElementById('findButton');
const globalSearch = document.getElementById('globalSearch');
const showComingSoon = (event) => { event?.preventDefault(); showToast('Le moteur Find sera activé après la finalisation du workspace.'); };

function showToast(message){
  let toast=document.getElementById('workspaceToast');
  if(!toast){toast=document.createElement('div');toast.id='workspaceToast';toast.style.cssText='position:fixed;right:24px;bottom:24px;z-index:160;padding:12px 15px;background:#151a27;border:1px solid #2a3244;color:#e8ebf3;border-radius:12px;font-size:10px;box-shadow:0 15px 40px rgba(0,0,0,.3)';document.body.appendChild(toast);}
  toast.textContent=message; toast.style.opacity='1'; clearTimeout(window.__toast); window.__toast=setTimeout(()=>toast.style.opacity='0',2400);
}

findButton?.addEventListener('click', showComingSoon);

document.querySelectorAll('.search-suggestions button').forEach(btn=>btn.addEventListener('click',()=>{findInput.value=btn.textContent;showToast('Suggestion ajoutée. Appuyez sur Find quand le moteur sera activé.');}));
globalSearch?.addEventListener('keydown',e=>{if(e.key==='Enter')showComingSoon(e);});

document.getElementById('findNav')?.addEventListener('click',()=>setTimeout(()=>findInput?.focus(),150));

document.getElementById('notifButton')?.addEventListener('click',()=>document.getElementById('notifications')?.scrollIntoView({behavior:'smooth'}));
document.getElementById('markRead')?.addEventListener('click',()=>{
  document.querySelectorAll('.notif-item>b').forEach(el=>el.remove());
  setText('notificationCount','0'); setText('alertStat','0'); showToast('Notifications marquées comme lues.');
});

document.getElementById('autoToggle')?.addEventListener('click',e=>{
  const btn=e.currentTarget; const on=btn.classList.toggle('on'); btn.setAttribute('aria-pressed',String(on));
  const status=document.querySelector('.ai-status strong');
  if(status) status.textContent=on?'Auto-Match active':'Auto-Match paused';
  showToast(on?'Nexora Auto-Match est actif.':'Auto-Match a été mis en pause.');
});

// Keep the workspace feeling alive without pretending a live external search already exists.
let seconds=0; setInterval(()=>{seconds++; const target=document.getElementById('scanTimer'); if(target && seconds<60) target.textContent=`il y a ${seconds}s`;},1000);

document.querySelectorAll('.side-item[href^="#"]').forEach(link=>link.addEventListener('click',e=>{
  const id=link.getAttribute('href').slice(1); const target=document.getElementById(id); if(target){e.preventDefault();target.scrollIntoView({behavior:'smooth'});document.querySelectorAll('.side-item').forEach(x=>x.classList.remove('active'));link.classList.add('active');}
}));