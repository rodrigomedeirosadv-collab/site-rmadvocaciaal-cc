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

/* Instagram embeds loader */
if (document.querySelector('blockquote.instagram-media')) {
  const script = document.createElement('script');
  script.src = 'https://www.instagram.com/embed.js';
  script.async = true;
  document.body.appendChild(script);
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

    submitBtn.disabled = true;
    submitBtn.querySelector('.form-submit__text').style.display = 'none';
    submitBtn.querySelector('.form-submit__loading').style.display = 'inline-flex';

    const data = new FormData(form);
    try {
      const res = await fetch('https://formsubmit.co/ajax/contato@rmadvocaciaal.com.br', {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' },
      });
      if (res.ok) {
        form.reset();
        form.style.display = 'none';
        successMsg.style.display = 'flex';
      } else {
        throw new Error('Erro no envio');
      }
    } catch {
      submitBtn.disabled = false;
      submitBtn.querySelector('.form-submit__text').style.display = 'inline';
      submitBtn.querySelector('.form-submit__loading').style.display = 'none';
      alert('Não foi possível enviar. Tente pelo WhatsApp ou e-mail diretamente.');
    }
  });
}
