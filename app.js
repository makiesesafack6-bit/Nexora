const toast = document.getElementById('toast');
const mobileMenu = document.getElementById('mobileMenu');
const mobileMenuButton = document.getElementById('mobileMenuButton');
const showToast = (message = 'Cette action sera activée dans une prochaine version.') => { if (!toast) return; toast.textContent = message; toast.classList.add('show'); window.clearTimeout(showToast.timeout); showToast.timeout = window.setTimeout(() => toast.classList.remove('show'), 2800); };
mobileMenuButton?.addEventListener('click', () => { const open = mobileMenu.classList.toggle('open'); mobileMenuButton.setAttribute('aria-expanded', String(open)); mobileMenuButton.textContent = open ? '×' : '☰'; });
mobileMenu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => { mobileMenu.classList.remove('open'); mobileMenuButton?.setAttribute('aria-expanded', 'false'); if (mobileMenuButton) mobileMenuButton.textContent = '☰'; }));
document.querySelectorAll('.demo-action').forEach((button) => button.addEventListener('click', () => showToast('La fiche opportunité complète arrive dans la prochaine étape de Nexora.')));
document.querySelectorAll('.quiz-option').forEach((button) => button.addEventListener('click', () => { document.querySelectorAll('.quiz-option').forEach((option) => option.classList.remove('selected')); button.classList.add('selected'); }));
document.querySelector('.mini-button')?.addEventListener('click', () => showToast('Le moteur de quiz sera activé dans V0.2.'));
document.querySelector('a[href="#login"]')?.addEventListener('click', (event) => { event.preventDefault(); showToast('La connexion réelle sera activée après le prototype visuel.'); });
const sections = [...document.querySelectorAll('main section[id]')]; const navLinks = [...document.querySelectorAll('.nav-link')];
const observer = new IntersectionObserver((entries) => { const visible = entries.filter((entry) => entry.isIntersecting).sort((a,b) => b.intersectionRatio-a.intersectionRatio)[0]; if (!visible) return; const current = visible.target.id; navLinks.forEach((link) => link.classList.toggle('active', link.dataset.section === current)); }, { rootMargin: '-35% 0px -55% 0px', threshold: [0.01,0.2,0.5] }); sections.forEach((section) => observer.observe(section));
window.addEventListener('hashchange', () => { const target = window.location.hash; if (target) document.querySelector(target)?.scrollIntoView({ behavior:'smooth' }); });

// Profils de démonstration supplémentaires : avatars générés, clairement présentés comme fictifs.
const demoProfiles = [
  ['Kevin R.','Full-stack developer','Johannesburg','Kevin'],
  ['Grace T.','UX/UI designer','Lagos','Grace'],
  ['Maya S.','Social media strategist','Nairobi','Maya'],
  ['Jonathan P.','Video editor','Accra','Jonathan'],
  ['Esther W.','Business consultant','Kigali','Esther'],
  ['Noah A.','Graphic designer','Dakar','Noah']
];
const track = document.getElementById('testimonialTrack');
if (track) {
  demoProfiles.forEach(([name, role, city, seed]) => {
    const card = document.createElement('article');
    card.className = 'testimonial-card';
    card.innerHTML = `<img src="https://api.dicebear.com/9.x/personas/svg?seed=${seed}" alt="Avatar de démonstration ${name}" /><div><div class="stars">★★★★★</div><p>« Nexora m'aide à voir rapidement les opportunités qui correspondent à mon profil et à mes objectifs. »</p><strong>${name}</strong><span>${role} · ${city}</span></div>`;
    track.appendChild(card);
  });

  // Double la piste pour un défilement continu.
  const originals = [...track.children];
  originals.forEach((card) => track.appendChild(card.cloneNode(true)));
  let offset = 0;
  const step = () => {
    const first = track.children[0];
    if (!first) return;
    const distance = first.getBoundingClientRect().width + 16;
    offset += distance;
    track.style.transition = 'transform .65s ease';
    track.style.transform = `translateX(-${offset}px)`;
    if (offset >= distance * originals.length) {
      window.setTimeout(() => {
        track.style.transition = 'none';
        offset = 0;
        track.style.transform = 'translateX(0)';
      }, 700);
    }
  };
  window.setInterval(step, 3200);
}
