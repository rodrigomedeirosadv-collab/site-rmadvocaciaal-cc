(function () {
  var blocked = ['r', 'mod', 'uri', 'elementor_library', 'et_core_page_resource'];
  var params = new URLSearchParams(window.location.search);
  var dirty = blocked.some(function (p) { return params.has(p); });
  if (dirty) { window.location.replace(window.location.pathname); }
})();

/* Nav scroll behavior */
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

/* Mobile nav toggle */
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    navToggle.classList.toggle('open', isOpen);
  });

  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Abrir menu');
      navToggle.classList.remove('open');
    }
  });
}

/* Fade-in on scroll (Intersection Observer) */
const fadeEls = document.querySelectorAll('.fade-in');
if (fadeEls.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  fadeEls.forEach((el) => io.observe(el));
}

/* Cookie banner */
const cookieBanner = document.getElementById('cookie-banner');
const cookieAccept = document.getElementById('cookie-accept');
if (cookieBanner && cookieAccept) {
  if (!localStorage.getItem('cookies-accepted')) {
    cookieBanner.classList.add('show');
  }
  cookieAccept.addEventListener('click', () => {
    localStorage.setItem('cookies-accepted', '1');
    cookieBanner.classList.remove('show');
  });
}

/* Timeline auto-play — acende itens de cima para baixo ao entrar na viewport */
const timeline = document.querySelector('.timeline');
if (timeline) {
  const tlObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const items = timeline.querySelectorAll('.timeline__item');
      items.forEach((item, i) => {
        setTimeout(() => item.classList.add('active'), i * 550);
      });
      tlObserver.unobserve(timeline);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  tlObserver.observe(timeline);
}


/* Contact form validation + submission */
const form = document.getElementById('contact-form');
if (form) {
  const fields = {
    nome: { el: document.getElementById('nome'), error: document.getElementById('nome-error'), msg: 'Por favor, informe seu nome.' },
    telefone: { el: document.getElementById('telefone'), error: document.getElementById('telefone-error'), msg: 'Por favor, informe um telefone para contato.' },
    email: { el: document.getElementById('email'), error: document.getElementById('email-error'), msg: 'Por favor, informe um e-mail válido.' },
    mensagem: { el: document.getElementById('mensagem'), error: document.getElementById('mensagem-error'), msg: 'Por favor, escreva sua mensagem.' },
  };

  const submitBtn = document.getElementById('form-submit');
  const successMsg = document.getElementById('form-success');

  const validateField = (key) => {
    const { el, error, msg } = fields[key];
    if (!el) return true;
    const val = el.value.trim();
    let valid = val.length > 0;
    if (key === 'email' && valid) {
      valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    }
    error.textContent = valid ? '' : msg;
    el.setAttribute('aria-invalid', String(!valid));
    return valid;
  };

  Object.keys(fields).forEach((key) => {
    const el = fields[key].el;
    if (el) {
      el.addEventListener('blur', () => validateField(key));
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const valid = Object.keys(fields).map(validateField).every(Boolean);
    if (!valid) {
      const firstInvalid = Object.values(fields).find(f => f.el && f.el.getAttribute('aria-invalid') === 'true');
      if (firstInvalid) firstInvalid.el.focus();
      return;
    }

    const nome     = document.getElementById('nome').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const email    = document.getElementById('email').value.trim();
    const assunto  = document.getElementById('assunto');
    const assuntoTxt = assunto && assunto.value ? assunto.options[assunto.selectedIndex].text : '';
    const mensagem = document.getElementById('mensagem').value.trim();

    const linhas = [
      `*Novo contato via site*`,
      ``,
      `*Nome:* ${nome}`,
      `*Telefone:* ${telefone}`,
      `*E-mail:* ${email}`,
      assuntoTxt ? `*Assunto:* ${assuntoTxt}` : null,
      ``,
      `*Mensagem:*`,
      mensagem,
    ].filter(l => l !== null).join('\n');

    const url = `https://wa.me/5582993150122?text=${encodeURIComponent(linhas)}`;
    window.open(url, '_blank', 'noopener,noreferrer');

    form.reset();
    form.style.display = 'none';
    successMsg.style.display = 'flex';
  });
}

/* Video players */
document.querySelectorAll('.reel-video').forEach(card => {
  const video = card.querySelector('.reel-video__el');
  const overlay = card.querySelector('.reel-video__overlay');

  overlay.addEventListener('click', () => {
    video.setAttribute('controls', '');
    video.play();
    overlay.classList.add('hidden');
  });

  video.addEventListener('pause', () => {
    overlay.classList.remove('hidden');
  });

  video.addEventListener('ended', () => {
    video.removeAttribute('controls');
    overlay.classList.remove('hidden');
  });
});
