(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  function setupBackground() {
    const bg = document.createElement('div');
    bg.className = 'nx-bg';
    bg.setAttribute('aria-hidden', 'true');
    const stars = document.createElement('div'); stars.className = 'nx-stars';
    const scan = document.createElement('div'); scan.className = 'nx-scan';
    const network = document.createElement('div'); network.className = 'nx-network';
    bg.append(stars, scan, network);
    document.body.prepend(bg);
  }

  function setupLoader() {
    const loader = document.createElement('div');
    loader.className = 'nx-page-loader hide';
    loader.innerHTML = '<div class="nx-loader-box"><div class="nx-loader-orb"><i></i><i></i><i></i><b class="nx-loader-core">N</b></div><h3>Nexora prépare votre espace…</h3><p>Connexion sécurisée · Préparation du profil</p><div class="nx-loader-progress"><span></span></div></div>';
    document.body.appendChild(loader);
    window.NexoraShowLandingLoader = (text = 'Nexora prépare votre espace…') => {
      const title = $('.nx-loader-box h3');
      if (title) title.textContent = text;
      loader.classList.remove('hide');
    };
    window.NexoraHideLandingLoader = () => loader.classList.add('hide');
  }

  function setupMobileMenu() {
    const button = $('#mobileMenuButton');
    const menu = $('#mobileMenu');
    if (!button || !menu) return;
    button.addEventListener('click', () => menu.classList.toggle('open'));
    $$('a', menu).forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));
  }

  function setupFaq() {
    $$('.faq-question').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        $$('.faq-item').forEach(other => { if (other !== item) other.classList.remove('open'); });
        item?.classList.toggle('open');
      });
    });
  }

  function setupTilt() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    $$('.nx-tilt').forEach(card => {
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(900px) rotateY(${x * 5}deg) rotateX(${y * -5}deg) translateY(-4px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }

  function setupReveal() {
    const els = $$('.nx-reveal');
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach(el => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
    }), { threshold: 0.12 });
    els.forEach(el => io.observe(el));
  }

  function setupCounters() {
    const counters = $$('[data-count]');
    counters.forEach(el => {
      const target = Number(el.dataset.count);
      if (!Number.isFinite(target)) return;
      const duration = 900;
      const start = performance.now();
      const tick = now => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(target * eased).toLocaleString('fr-FR');
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }

  function setupCTA() {
    $$('a[href="onboarding.html"], a[href="login.html"]').forEach(a => {
      a.addEventListener('click', e => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        window.NexoraShowLandingLoader(a.getAttribute('href') === 'login.html' ? 'Ouverture de votre connexion…' : 'Préparation de votre inscription…');
        setTimeout(() => { window.location.href = a.href; }, 650);
      });
    });
  }

  function setupAnchorActive() {
    const sections = $$('main section[id]');
    const links = $$('.desktop-nav a[href^="#"]');
    const io = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
    }), { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
    sections.forEach(s => io.observe(s));
  }

  function setupSupportButtons() {
    $$('.support-contact').forEach(a => a.addEventListener('click', () => {
      const number = a.dataset.phone || '';
      window.NexoraShowLandingLoader(`Ouverture du service client…`);
      setTimeout(() => { window.location.href = `tel:${number}`; }, 250);
    }));
  }

  function setupTooltips() {
    $$('[data-tip]').forEach(el => {
      el.title = el.dataset.tip;
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    setupBackground();
    setupLoader();
    setupMobileMenu();
    setupFaq();
    setupTilt();
    setupReveal();
    setupCounters();
    setupCTA();
    setupAnchorActive();
    setupSupportButtons();
    setupTooltips();
    setTimeout(() => window.NexoraHideLandingLoader?.(), 120);
  });
})();
