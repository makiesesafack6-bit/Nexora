const toast = document.getElementById('toast');
const mobileMenu = document.getElementById('mobileMenu');
const mobileMenuButton = document.getElementById('mobileMenuButton');

const showToast = (message = 'Cette action sera activée dans une prochaine version.') => {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove('show'), 2800);
};

mobileMenuButton?.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  mobileMenuButton.setAttribute('aria-expanded', String(open));
  mobileMenuButton.textContent = open ? '×' : '☰';
});

mobileMenu?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    mobileMenuButton?.setAttribute('aria-expanded', 'false');
    if (mobileMenuButton) mobileMenuButton.textContent = '☰';
  });
});

document.querySelectorAll('.demo-action').forEach((button) => {
  button.addEventListener('click', () => {
    showToast('La fiche opportunité complète arrive dans la prochaine étape de Nexora.');
  });
});

document.querySelectorAll('.quiz-option').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.quiz-option').forEach((option) => option.classList.remove('selected'));
    button.classList.add('selected');
  });
});

document.querySelector('.mini-button')?.addEventListener('click', () => {
  showToast('Le moteur de quiz sera activé dans V0.2.');
});

const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.nav-link')];

const observer = new IntersectionObserver((entries) => {
  const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;
  const current = visible.target.id;
  navLinks.forEach((link) => link.classList.toggle('active', link.dataset.section === current));
}, { rootMargin: '-35% 0px -55% 0px', threshold: [0.01, 0.2, 0.5] });

sections.forEach((section) => observer.observe(section));

window.addEventListener('hashchange', () => {
  const target = window.location.hash;
  if (!target) return;
  document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
});
