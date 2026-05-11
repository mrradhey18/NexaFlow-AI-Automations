/* ════════════════════════════════════════════
   NEXAFLOW — script.js  v2.0  PRODUCTION
   ════════════════════════════════════════════ */

'use strict';

/* ── 1. PAGE PROGRESS BAR ── */
(function initProgressBar() {
  const bar = document.createElement('div');
  bar.id = 'progress-bar';
  document.body.prepend(bar);

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total    = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = total > 0 ? (scrolled / total * 100) + '%' : '0%';
  }, { passive: true });
})();

/* ── 2. NAVBAR: SCROLL SHADOW + ACTIVE LINK ── */
(function initNavbar() {
  const navbar  = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Highlight active nav link
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });
    navLinks.forEach(a => {
      const href = a.getAttribute('href');
      a.classList.toggle('active', href === `#${current}` || href === `/${current}`);
    });
  }, { passive: true });
})();

/* ── 3. HAMBURGER / MOBILE MENU ── */
(function initMobileMenu() {
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!hamburger || !mobileMenu) return;

  function toggleMenu(open) {
    hamburger.classList.toggle('open', open);
    mobileMenu.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    mobileMenu.setAttribute('aria-hidden',  String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
  }

  hamburger.addEventListener('click', () => {
    toggleMenu(!hamburger.classList.contains('open'));
  });

  // Close on link click
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => toggleMenu(false));
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (
      hamburger.classList.contains('open') &&
      !hamburger.contains(e.target) &&
      !mobileMenu.contains(e.target)
    ) toggleMenu(false);
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && hamburger.classList.contains('open')) toggleMenu(false);
  });
})();

/* ── 3b. DESKTOP DROPDOWN CLICK FIX ── */
(function initDropdown() {
  const dropdown = document.querySelector('.nav-dropdown');
  const panel = document.querySelector('.dropdown-panel');
  if (!dropdown || !panel) return;

  const isMobile = () => window.innerWidth <= 768;

  // Mobile: click to toggle
  dropdown.addEventListener('click', function(e) {
    if (!isMobile()) return;
    e.stopPropagation();
    panel.classList.toggle('open');
  });

  // Desktop: hover
  dropdown.addEventListener('mouseenter', function() {
    if (isMobile()) return;
    panel.classList.add('open');
  });
  dropdown.addEventListener('mouseleave', function() {
    if (isMobile()) return;
    panel.classList.remove('open');
  });

  // Close on link click
  panel.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => panel.classList.remove('open'));
  });

  // Close on outside click (mobile)
  document.addEventListener('click', function(e) {
    if (!dropdown.contains(e.target)) panel.classList.remove('open');
  });
})();

/* ── 4. SCROLL REVEAL (IntersectionObserver) ── */
(function initScrollReveal() {
  const targets = document.querySelectorAll('.fade-up, .fade-left, .fade-right, .zoom-in');
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
}, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });

  targets.forEach(el => observer.observe(el));
})();

/* ── 5. COUNTER ANIMATION ── */
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const easeOut = t => 1 - Math.pow(1 - t, 3);

  function animateCounter(el) {
    const target   = parseFloat(el.dataset.count);
    const suffix   = el.dataset.suffix || '';
    const prefix   = el.dataset.prefix || '';
    const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
    const duration = 1800;
    const start    = performance.now();

    function tick(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value    = easeOut(progress) * target;
      el.textContent = prefix + value.toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = prefix + target.toFixed(decimals) + suffix;
    }
    requestAnimationFrame(tick);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();

/* ── 6. FAQ ACCORDION ── */
function toggleFaq(item) {
  const isOpen = item.classList.contains('open');
  // Close all open items
  document.querySelectorAll('.faq-item.open').forEach(el => {
    el.classList.remove('open');
  });
  // Open clicked item if it was closed
  if (!isOpen) item.classList.add('open');
}

/* ── 7. FAQ KEYBOARD NAVIGATION ── */
(function initFaqKeyboard() {
  document.querySelectorAll('.faq-item').forEach(item => {
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleFaq(item);
      }
    });
  });
})();

/* ── 8. FORM SUBMISSION ── */
function handleFormSubmit(e) {
  e.preventDefault();
  const form    = e.target;
  const btn     = document.getElementById('form-submit-btn');
  const success = document.getElementById('form-success');

  // Basic validation
  const required = form.querySelectorAll('[required]');
  let valid = true;
  required.forEach(field => {
    field.style.borderColor = '';
    if (!field.value.trim()) {
      field.style.borderColor = '#ef4444';
      valid = false;
    }
  });
  if (!valid) {
    required[0]?.focus();
    return;
  }

  // Loading state
  btn.classList.add('loading');
  btn.textContent = 'Sending...';

  // Submit to Formspree
  fetch(form.action, {
    method: 'POST',
    body: new FormData(form),
    headers: { 'Accept': 'application/json' }
  })
  .then(res => {
    if (res.ok) {
      form.reset();
      if (success) {
        success.style.display = 'block';
        success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      // Also send WhatsApp message
      const name     = form.querySelector('[name="name"]')?.value || 'Customer';
      const business = form.querySelector('[name="business_name"]')?.value || 'their business';
      const phone    = form.querySelector('[name="phone"]')?.value || '';
      const city     = form.querySelector('[name="city"]')?.value || '';
      setTimeout(() => {
        const msg = encodeURIComponent(
          `Hi NexaFlow! I just submitted the free audit form.\nName: ${name}\nBusiness: ${business}\nPhone: ${phone}\nCity: ${city}`
        );
        // Optional: open WhatsApp after form submit
        // window.open(`https://wa.me/919369699864?text=${msg}`, '_blank');
      }, 1000);
    } else {
      alert('Something went wrong. Please WhatsApp us directly at +91 93696 99864.');
    }
  })
  .catch(() => {
    alert('Network error. Please WhatsApp us directly at +91 93696 99864.');
  })
  .finally(() => {
    btn.classList.remove('loading');
    btn.textContent = 'Submit & Get Free Audit';
  });
}

/* ── 9. SMOOTH SCROLL FOR ANCHOR LINKS ── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id  = a.getAttribute('href').slice(1);
      const el  = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      const navH = document.getElementById('navbar')?.offsetHeight || 68;
      const top  = el.getBoundingClientRect().top + window.scrollY - navH - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ── 10. SCROLL TO TOP BUTTON ── */
(function initScrollTop() {
  const btn = document.createElement('button');
  btn.id = 'scroll-top';
  btn.setAttribute('aria-label', 'Scroll to top');
  btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 15l-6-6-6 6"/></svg>`;
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ── 11. TESTIMONIALS AUTO-SCROLL CLONE ── */
(function initTestimonialsTrack() {
  const track = document.querySelector('.testimonials-track');
  if (!track) return;
  // Clone items for seamless loop
  const items = track.innerHTML;
  track.innerHTML = items + items;
})();

/* ── 12. COOKIE CONSENT BANNER ── */
(function initCookieBanner() {
  if (localStorage.getItem('nf_cookie_consent')) return;

  const banner = document.createElement('div');
  banner.id = 'cookie-banner';
  banner.className = 'show';
  banner.innerHTML = `
    <p class="cookie-text">
      🍪 We use cookies to improve your experience and analyse site traffic.
      By continuing, you agree to our <a href="/privacy-policy">Privacy Policy</a>.
    </p>
    <div class="cookie-btns">
      <button class="cookie-accept" id="cookie-accept">Accept All</button>
      <button class="cookie-decline" id="cookie-decline">Decline</button>
    </div>
  `;
  document.body.appendChild(banner);

  document.getElementById('cookie-accept').addEventListener('click', () => {
    localStorage.setItem('nf_cookie_consent', 'accepted');
    banner.remove();
  });
  document.getElementById('cookie-decline').addEventListener('click', () => {
    localStorage.setItem('nf_cookie_consent', 'declined');
    banner.remove();
  });
})();

/* ── 13. LAZY IMAGE LOADING ── */
(function initLazyImages() {
  const imgs = document.querySelectorAll('img[data-src]');
  if (!imgs.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });

  imgs.forEach(img => observer.observe(img));
})();

/* ── 14. RIPPLE EFFECT ON BUTTONS ── */
(function initRipple() {
  document.querySelectorAll('.btn-primary, .form-submit, .nav-cta, .mob-cta').forEach(btn => {
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.addEventListener('click', function(e) {
      const rect   = btn.getBoundingClientRect();
      const size   = Math.max(rect.width, rect.height);
      const x      = e.clientX - rect.left - size / 2;
      const y      = e.clientY - rect.top  - size / 2;
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255,255,255,0.25);
        border-radius: 50%;
        transform: scale(0);
        animation: rippleAnim 0.55s ease-out;
        pointer-events: none;
      `;
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });

  // Inject ripple keyframe once
  if (!document.getElementById('ripple-style')) {
    const style = document.createElement('style');
    style.id = 'ripple-style';
    style.textContent = `
      @keyframes rippleAnim {
        to { transform: scale(2.5); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
})();

/* ── 15. TYPED TEXT EFFECT (Hero subtitle cycling) ── */
(function initTyped() {
  const el = document.querySelector('.hero-highlight');
  if (!el) return;

  const phrases = ['Google Maps', 'Local Search', 'Google Top 3'];
  let idx = 0;
  let charIdx = 0;
  let deleting = false;

  function tick() {
    const current = phrases[idx];
    if (deleting) {
      el.textContent = current.slice(0, charIdx--);
      if (charIdx < 0) {
        deleting = false;
        idx = (idx + 1) % phrases.length;
        setTimeout(tick, 500);
        return;
      }
      setTimeout(tick, 50);
    } else {
      el.textContent = current.slice(0, charIdx++);
      if (charIdx > current.length) {
        deleting = true;
        setTimeout(tick, 2200);
        return;
      }
      setTimeout(tick, 80);
    }
  }

  // Start after 2 seconds
  setTimeout(tick, 2000);
})();

/* ── 16. CARD HOVER TILT EFFECT (subtle 3D tilt) ── */
(function initTilt() {
  const cards = document.querySelectorAll(
    '.service-card, .cs-card, .problem-card, .stat-block'
  );

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const rotX   = ((y / rect.height) - 0.5) * -6;
      const rotY   = ((x / rect.width)  - 0.5) *  6;
      card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-5px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.4s ease';
      setTimeout(() => card.style.transition = '', 400);
    });
  });
})();

/* ── 17. STICKY CTA BAR (mobile only, shows after hero) ── */
(function initStickyCTA() {
  if (window.innerWidth > 768) return;

  const hero = document.querySelector('.hero');
  if (!hero) return;

  const bar = document.createElement('div');
  bar.id = 'sticky-cta';
  bar.innerHTML = `
    <a href="#audit" class="sticky-audit-btn">📋 Get Free Audit</a>
    <a href="https://wa.me/919369699864?text=Hi%20NexaFlow!" target="_blank" rel="noopener" class="sticky-wa-btn">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      WhatsApp
    </a>
  `;

  const style = document.createElement('style');
  style.textContent = `
    #sticky-cta {
      position: fixed;
      bottom: 0; left: 0; right: 0;
      background: var(--white);
      border-top: 1px solid var(--gray-200);
      padding: 10px 16px;
      display: none;
      gap: 10px;
      z-index: 750;
      box-shadow: 0 -4px 20px rgba(0,0,0,0.08);
    }
    #sticky-cta.show { display: flex; }
    .sticky-audit-btn {
      flex: 1;
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      color: white;
      padding: 12px;
      border-radius: 10px;
      font-weight: 700;
      font-size: 0.88rem;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }
    .sticky-wa-btn {
      flex: 1;
      background: #25d366;
      color: white;
      padding: 12px;
      border-radius: 10px;
      font-weight: 700;
      font-size: 0.88rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const heroBottom = hero.offsetTop + hero.offsetHeight;
    bar.classList.toggle('show', window.scrollY > heroBottom - 100);
  }, { passive: true });
})();

/* ── 18. GOOGLE MAPS CARD TYPING ANIMATION ── */
(function initGCTyping() {
  const gcInput = document.querySelector('.gc-input span');
  if (!gcInput) return;

  const queries = [
    'Best Clinic Near Me',
    'Dentist in Kanpur',
    'Gym Near Me',
    'Restaurant Near Me',
    'Best CA in Lucknow'
  ];
  let qi = 0;
  let ci = 0;
  let del = false;

  function typeTick() {
    const q = queries[qi];
    if (del) {
      gcInput.textContent = q.slice(0, ci--);
      if (ci < 0) {
        del = false;
        qi  = (qi + 1) % queries.length;
        setTimeout(typeTick, 400);
        return;
      }
      setTimeout(typeTick, 55);
    } else {
      gcInput.textContent = q.slice(0, ci++);
      if (ci > q.length) {
        del = true;
        setTimeout(typeTick, 1800);
        return;
      }
      setTimeout(typeTick, 90);
    }
  }
  setTimeout(typeTick, 1500);
})();

/* ── 19. PERFORMANCE: DEFER NON-CRITICAL SCRIPTS ── */
(function deferAnalytics() {
  // Defer Google Analytics until after user interaction
  const events = ['mouseover', 'keydown', 'touchstart', 'scroll'];
  function loadGA() {
    events.forEach(ev => document.removeEventListener(ev, loadGA));
    // GA already loaded via HTML tag manager - this is a hook for future use
  }
  events.forEach(ev => document.addEventListener(ev, loadGA, { once: true, passive: true }));
})();

/* ── 20. STRUCTURED DATA ENHANCEMENT (Dynamic) ── */
(function enhanceStructuredData() {
  // Add breadcrumb tracking for SPA-like navigation
  window.addEventListener('popstate', () => {
    document.dispatchEvent(new CustomEvent('routeChange', { detail: window.location.pathname }));
  });
})();

/* ── DOM READY: Wire everything up ── */
document.addEventListener('DOMContentLoaded', () => {
  // Add aria-labels to all clickable cards
  document.querySelectorAll('.service-card, .problem-card, .cs-card, .stat-block').forEach(card => {
    if (!card.getAttribute('aria-label')) {
      const heading = card.querySelector('h2, h3, h4');
      if (heading) card.setAttribute('aria-label', heading.textContent.trim());
    }
  });

  // Pre-load hero person image
  const heroImg = document.querySelector('.hero-person-img');
  if (heroImg && heroImg.complete) {
    heroImg.classList.add('loaded');
  } else if (heroImg) {
    heroImg.addEventListener('load', () => heroImg.classList.add('loaded'));
  }

  console.log('%cNexaFlow v2.0 🚀', 'color: #2563eb; font-weight: bold; font-size: 14px;');
  console.log('%c#1 Local SEO & Google Maps Ranking Experts', 'color: #22c55e;');
});

/* ── SOCIAL FLOAT TOGGLE ── */
(function initSocialFloat() {
  const btn = document.getElementById('social-float-btn');
  const icons = document.getElementById('social-float-icons');
  const wrap = document.getElementById('social-float-wrap');
  if (!btn || !icons || !wrap) return;

  const isMobile = () => window.innerWidth <= 768;

  btn.addEventListener('click', function(e) {
    e.stopPropagation();
    icons.classList.toggle('open');
  });

  wrap.addEventListener('mouseenter', () => {
    if (!isMobile()) icons.classList.add('open');
  });
  wrap.addEventListener('mouseleave', () => {
    if (!isMobile()) icons.classList.remove('open');
  });

  document.addEventListener('click', (e) => {
    if (!wrap.contains(e.target)) icons.classList.remove('open');
  });
})();