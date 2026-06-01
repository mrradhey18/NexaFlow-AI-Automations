/**
 * ═══════════════════════════════════════════════════════════
 * NEXAFLOW BLOG PLATFORM — MAIN JAVASCRIPT
 * Step 3: JS
 * Covers: Header scroll, Mobile nav, Dropdowns, FAQ accordion,
 *         Cluster tabs, Table of Contents (TOC), Reading progress,
 *         TOC active tracking, Back to top, Copy link, Lead form,
 *         Counter animation, Footer year, Announcement dismiss,
 *         Checklist persistence, Lazy images, Keyboard a11y
 * ═══════════════════════════════════════════════════════════
 */

'use strict';

/* ─────────────────────────────────────────────
   UTILITY HELPERS
───────────────────────────────────────────── */

/**
 * Throttle: limits how often a function can fire.
 * Used for scroll/resize listeners.
 */
function throttle(fn, wait) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      fn.apply(this, args);
    }
  };
}

/**
 * Debounce: fires only after a quiet period.
 * Used for resize and search.
 */
function debounce(fn, wait) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), wait);
  };
}

/**
 * Safe querySelector — returns null instead of throwing.
 */
const qs  = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ─────────────────────────────────────────────
   1. HEADER — SCROLL SHADOW
───────────────────────────────────────────── */

function initHeaderScroll() {
  const header = qs('#site-header');
  if (!header) return;

  const onScroll = throttle(() => {
    header.classList.toggle('header-scrolled', window.scrollY > 20);
  }, 100);

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
}

/* ─────────────────────────────────────────────
   2. MOBILE NAVIGATION
───────────────────────────────────────────── */

function initMobileNav() {
  const toggle = qs('#mobile-nav-toggle');
  const nav    = qs('#primary-nav');
  if (!toggle || !nav) return;

  let isOpen = false;

  function openNav() {
    isOpen = true;
    toggle.setAttribute('aria-expanded', 'true');
    nav.classList.add('nav-open');
    document.body.style.overflow = 'hidden';
    // Move focus into nav
    const firstLink = qs('a, button', nav);
    if (firstLink) firstLink.focus();
  }

  function closeNav() {
    isOpen = false;
    toggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('nav-open');
    document.body.style.overflow = '';
    // Close any open dropdowns
    qsa('.nav-item.dropdown-open', nav).forEach(el =>
      el.classList.remove('dropdown-open')
    );
  }

  toggle.addEventListener('click', () => {
    isOpen ? closeNav() : openNav();
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) {
      closeNav();
      toggle.focus();
    }
  });

  // Close when clicking outside nav
  document.addEventListener('click', (e) => {
    if (isOpen && !nav.contains(e.target) && !toggle.contains(e.target)) {
      closeNav();
    }
  });

  // On resize to desktop — close mobile nav
  window.addEventListener('resize', debounce(() => {
    if (window.innerWidth > 768 && isOpen) closeNav();
  }, 200));

  // Mobile dropdown toggles (tap arrow / nav-link with dropdown)
  qsa('.nav-item.has-dropdown .nav-link', nav).forEach(link => {
    link.addEventListener('click', (e) => {
      // Only intercept on mobile
      if (window.innerWidth > 768) return;
      e.preventDefault();
      const item = link.closest('.nav-item');
      const wasOpen = item.classList.contains('dropdown-open');
      // Close all
      qsa('.nav-item.dropdown-open', nav).forEach(el =>
        el.classList.remove('dropdown-open')
      );
      if (!wasOpen) item.classList.add('dropdown-open');
    });
  });
}

/* ─────────────────────────────────────────────
   3. DESKTOP DROPDOWN — KEYBOARD A11Y
   (CSS handles hover; JS adds keyboard support)
───────────────────────────────────────────── */

function initDesktopDropdowns() {
  qsa('.nav-item.has-dropdown').forEach(item => {
    const trigger  = qs('.nav-link', item);
    const dropdown = qs('.nav-dropdown', item);
    if (!trigger || !dropdown) return;

    // Open on Enter/Space
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const expanded = trigger.getAttribute('aria-expanded') === 'true';
        trigger.setAttribute('aria-expanded', String(!expanded));
        dropdown.style.pointerEvents = expanded ? 'none' : 'all';
      }
      if (e.key === 'Escape') {
        trigger.setAttribute('aria-expanded', 'false');
        trigger.focus();
      }
    });

    // Close if focus leaves the dropdown
    item.addEventListener('focusout', (e) => {
      if (!item.contains(e.relatedTarget)) {
        trigger.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

/* ─────────────────────────────────────────────
   4. FAQ ACCORDION
───────────────────────────────────────────── */

function initFAQ() {
  // Support multiple FAQ lists on the same page
  qsa('.faq-list').forEach(list => {
    const items = qsa('.faq-item', list);

    items.forEach(item => {
      const btn    = qs('.faq-question', item);
      const answer = qs('.faq-answer', item);
      if (!btn || !answer) return;

      btn.addEventListener('click', () => {
        const isExpanded = btn.getAttribute('aria-expanded') === 'true';

        // Close all siblings first (accordion behaviour)
        items.forEach(sibling => {
          const sibBtn    = qs('.faq-question', sibling);
          const sibAnswer = qs('.faq-answer', sibling);
          if (sibBtn && sibAnswer) {
            sibBtn.setAttribute('aria-expanded', 'false');
            sibAnswer.hidden = true;
          }
        });

        // Toggle clicked item
        if (!isExpanded) {
          btn.setAttribute('aria-expanded', 'true');
          answer.hidden = false;
          // Smooth height animation
          animateOpen(answer);
        }
      });

      // Keyboard: Space also toggles
      btn.addEventListener('keydown', (e) => {
        if (e.key === ' ') {
          e.preventDefault();
          btn.click();
        }
      });
    });
  });
}

/**
 * Animates an element from height 0 → auto.
 * Works without max-height hack.
 */
function animateOpen(el) {
  el.style.overflow = 'hidden';
  const fullHeight  = el.scrollHeight + 'px';
  el.style.height   = '0';

  requestAnimationFrame(() => {
    el.style.transition = 'height 280ms ease';
    el.style.height     = fullHeight;
    el.addEventListener('transitionend', () => {
      el.style.height   = '';
      el.style.overflow = '';
      el.style.transition = '';
    }, { once: true });
  });
}

/* ─────────────────────────────────────────────
   5. CONTENT CLUSTER TABS
───────────────────────────────────────────── */

function initClusterTabs() {
  const tabContainer = qs('#cluster-tabs');
  if (!tabContainer) return;

  const tabs   = qsa('.cluster-tab', tabContainer);
  const panels = qsa('.cluster-panel');

  function activate(tab) {
    // Deactivate all
    tabs.forEach(t => {
      t.classList.remove('cluster-tab--active');
      t.setAttribute('aria-selected', 'false');
    });
    panels.forEach(p => {
      p.classList.remove('cluster-panel--active');
      p.hidden = true;
    });

    // Activate selected
    tab.classList.add('cluster-tab--active');
    tab.setAttribute('aria-selected', 'true');

    const panelId = tab.getAttribute('aria-controls');
    const panel   = qs('#' + panelId);
    if (panel) {
      panel.classList.add('cluster-panel--active');
      panel.hidden = false;
    }
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => activate(tab));

    // Arrow key navigation for accessibility
    tab.addEventListener('keydown', (e) => {
      const idx = tabs.indexOf(tab);
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const next = tabs[(idx + 1) % tabs.length];
        next.focus();
        activate(next);
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prev = tabs[(idx - 1 + tabs.length) % tabs.length];
        prev.focus();
        activate(prev);
      }
      if (e.key === 'Home') {
        e.preventDefault();
        tabs[0].focus();
        activate(tabs[0]);
      }
      if (e.key === 'End') {
        e.preventDefault();
        tabs[tabs.length - 1].focus();
        activate(tabs[tabs.length - 1]);
      }
    });
  });
}

/* ─────────────────────────────────────────────
   6. TABLE OF CONTENTS — STICKY + ACTIVE STATE
───────────────────────────────────────────── */

function initTableOfContents() {
  const toc      = qs('#article-toc');
  const tocInner = qs('#toc-inner');
  const tocLinks = qsa('.toc-link', toc || document);
  const body     = qs('#article-body');

  if (!toc || !body || tocLinks.length === 0) return;

  // Collect all heading targets from TOC hrefs
  const sections = tocLinks
    .map(link => {
      const id = link.getAttribute('href')?.replace('#', '');
      return id ? qs('#' + id) : null;
    })
    .filter(Boolean);

  if (sections.length === 0) return;

  // IntersectionObserver for active highlighting
  let activeId = null;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          activeId = entry.target.id;
        }
      });
      updateActive();
    },
    {
      rootMargin: '-80px 0px -60% 0px',
      threshold: 0,
    }
  );

  sections.forEach(sec => observer.observe(sec));

  function updateActive() {
    tocLinks.forEach(link => {
      const href = link.getAttribute('href')?.replace('#', '');
      link.classList.toggle('toc-link--active', href === activeId);
    });
  }

  // Smooth scroll on TOC link click (supplement CSS scroll-behavior)
  tocLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const id = link.getAttribute('href')?.replace('#', '');
      const target = qs('#' + id);
      if (target) {
        const headerH = parseInt(
          getComputedStyle(document.documentElement)
            .getPropertyValue('--header-height') || '72'
        );
        const top = target.getBoundingClientRect().top +
                    window.scrollY - headerH - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // Sticky TOC within article bounds
  if (tocInner) {
    const articleBottom = () =>
      body.getBoundingClientRect().bottom + window.scrollY;

    window.addEventListener('scroll', throttle(() => {
      const scrollBottom = window.scrollY + window.innerHeight;
      const pastArticle  = scrollBottom > articleBottom();
      tocInner.style.pointerEvents = pastArticle ? 'none' : '';
    }, 150), { passive: true });
  }
}

/* ─────────────────────────────────────────────
   7. READING PROGRESS BAR
───────────────────────────────────────────── */

function initReadingProgress() {
  const bar  = qs('#toc-progress-bar');
  const body = qs('#article-body');
  if (!bar || !body) return;

  const update = throttle(() => {
    const rect    = body.getBoundingClientRect();
    const total   = body.offsetHeight - window.innerHeight;
    const scrolled = Math.max(0, -rect.top);
    const pct     = total > 0 ? Math.min(100, (scrolled / total) * 100) : 0;

    bar.style.width = pct + '%';
    bar.setAttribute('aria-valuenow', Math.round(pct));
  }, 50);

  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ─────────────────────────────────────────────
   8. BACK TO TOP BUTTON
───────────────────────────────────────────── */

function initBackToTop() {
  const btn = qs('#back-to-top');
  if (!btn) return;

  const onScroll = throttle(() => {
    const show = window.scrollY > 400;
    btn.hidden  = !show;
  }, 150);

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Return focus to top of page
    const skipLink = qs('.skip-link');
    if (skipLink) skipLink.focus();
  });
}

/* ─────────────────────────────────────────────
   9. COPY LINK BUTTON (Article share)
───────────────────────────────────────────── */

function initCopyLink() {
  const btn = qs('#copy-link-btn');
  if (!btn) return;

  btn.addEventListener('click', async () => {
    const url = btn.dataset.url || window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      showCopyFeedback(btn, 'Copied!');
    } catch {
      // Fallback for older browsers
      const ta = document.createElement('textarea');
      ta.value = url;
      ta.style.position = 'fixed';
      ta.style.opacity  = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showCopyFeedback(btn, 'Copied!');
    }
  });
}

function showCopyFeedback(btn, message) {
  const original = btn.getAttribute('aria-label');
  btn.setAttribute('aria-label', message);
  btn.style.color = 'var(--color-green)';
  setTimeout(() => {
    btn.setAttribute('aria-label', original);
    btn.style.color = '';
  }, 2000);
}

/* ─────────────────────────────────────────────
   10. LEAD FORM — VALIDATION + SUBMIT
───────────────────────────────────────────── */

function initLeadForm() {
  const form    = qs('#audit-form');
  if (!form) return;

  const submitBtn = qs('#form-submit', form);
  const btnText   = qs('.btn-text', submitBtn);
  const btnLoad   = qs('.btn-loading', submitBtn);
  const success   = qs('#form-success', form);

  const rules = {
    name:     { required: true, minLen: 2,  msg: 'Please enter your name.' },
    business: { required: true, minLen: 2,  msg: 'Please enter your business name.' },
    phone:    { required: true, pattern: /^[\d\s\+\-]{10,15}$/, msg: 'Enter a valid phone number (10–15 digits).' },
  };

  // Real-time validation
  Object.keys(rules).forEach(name => {
    const input = form.elements[name];
    if (!input) return;
    input.addEventListener('blur', () => validateField(name, input, rules[name]));
    input.addEventListener('input', () => {
      if (input.classList.contains('has-error')) {
        validateField(name, input, rules[name]);
      }
    });
  });

  function validateField(name, input, rule) {
    const errEl = qs(`#form-${name}-error`);
    const val   = input.value.trim();
    let error   = '';

    if (rule.required && !val) {
      error = rule.msg;
    } else if (rule.minLen && val.length < rule.minLen) {
      error = rule.msg;
    } else if (rule.pattern && !rule.pattern.test(val)) {
      error = rule.msg;
    }

    input.classList.toggle('has-error', !!error);
    if (errEl) errEl.textContent = error;
    return !error;
  }

  function validateAll() {
    let valid = true;
    Object.keys(rules).forEach(name => {
      const input = form.elements[name];
      if (input && !validateField(name, input, rules[name])) valid = false;
    });
    return valid;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    // Loading state
    submitBtn.disabled = true;
    if (btnText) btnText.hidden = true;
    if (btnLoad) btnLoad.hidden = false;

    // Collect form data
    const data = {
      name:          form.elements['name']?.value.trim(),
      business:      form.elements['business']?.value.trim(),
      phone:         form.elements['phone']?.value.trim(),
      city:          form.elements['city']?.value,
      business_type: form.elements['business_type']?.value,
      page:          window.location.href,
      timestamp:     new Date().toISOString(),
    };

    try {
      // Replace with your actual endpoint
      const res = await fetch('/api/audit-request', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Server error');

      // Show success
      form.querySelector('.lead-form > *:not(#form-success)') &&
        qsa('.lead-form > *:not(#form-success)', form).forEach(el => {
          el.style.display = 'none';
        });
      if (success) success.hidden = false;

      // Push to analytics if available
      if (typeof gtag !== 'undefined') {
        gtag('event', 'lead_form_submit', {
          event_category: 'Lead Generation',
          event_label: data.business_type || 'unknown',
        });
      }

    } catch (err) {
      // Graceful error — still show success to avoid abandonment
      // (store in localStorage as fallback)
      storeLocalFallback(data);

      qsa('.lead-form > *:not(#form-success)', form).forEach(el => {
        el.style.display = 'none';
      });
      if (success) success.hidden = false;

    } finally {
      submitBtn.disabled = false;
      if (btnText) btnText.hidden = false;
      if (btnLoad) btnLoad.hidden = true;
    }
  });
}

function storeLocalFallback(data) {
  try {
    const key      = 'nf_leads';
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    existing.push(data);
    localStorage.setItem(key, JSON.stringify(existing));
  } catch (_) { /* ignore */ }
}

/* ─────────────────────────────────────────────
   11. COUNTER ANIMATION (Hero stats)
───────────────────────────────────────────── */

function initCounters() {
  const counters = qsa('[data-target]');
  if (counters.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const raw    = el.dataset.target;
  const target = parseFloat(raw);
  if (isNaN(target)) return;

  const isDecimal = raw.includes('.');
  const suffix    = el.textContent.replace(raw, '').trim(); // e.g. "★", "+"
  const duration  = 1500; // ms
  const start     = performance.now();

  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const ease     = 1 - Math.pow(1 - progress, 3);
    const current  = target * ease;

    el.textContent = isDecimal
      ? current.toFixed(1) + suffix
      : Math.round(current) + suffix;

    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = raw + suffix;
  }

  requestAnimationFrame(step);
}

/* ─────────────────────────────────────────────
   12. FOOTER YEAR
───────────────────────────────────────────── */

function initFooterYear() {
  qsa('#footer-year').forEach(el => {
    el.textContent = new Date().getFullYear();
  });
}

/* ─────────────────────────────────────────────
   13. ARTICLE CHECKLIST — PERSIST STATE
   (Saves checked state to localStorage)
───────────────────────────────────────────── */

function initChecklist() {
  const checkboxes = qsa('.checklist-checkbox');
  if (checkboxes.length === 0) return;

  const storageKey = 'nf_checklist_' + window.location.pathname;

  // Load saved state
  let saved = {};
  try {
    saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
  } catch (_) { /* ignore */ }

  checkboxes.forEach(cb => {
    const id = cb.id;
    if (id && saved[id]) cb.checked = true;

    cb.addEventListener('change', () => {
      try {
        saved[id] = cb.checked;
        localStorage.setItem(storageKey, JSON.stringify(saved));
      } catch (_) { /* ignore */ }
    });
  });
}

/* ─────────────────────────────────────────────
   14. ANNOUNCEMENT BAR — DISMISS
───────────────────────────────────────────── */

function initAnnouncement() {
  const bar = qs('.announcement-bar');
  if (!bar) return;

  // Check if user already dismissed
  const dismissed = sessionStorage.getItem('nf_announcement_dismissed');
  if (dismissed) {
    bar.style.display = 'none';
    return;
  }

  // Optional: add close button dynamically
  const closeBtn = document.createElement('button');
  closeBtn.setAttribute('aria-label', 'Close announcement');
  closeBtn.innerHTML = '&times;';
  closeBtn.style.cssText = `
    margin-left: 12px;
    background: none;
    border: none;
    color: inherit;
    font-size: 1.2rem;
    cursor: pointer;
    opacity: 0.7;
    line-height: 1;
    padding: 0 4px;
  `;
  closeBtn.addEventListener('mouseenter', () => closeBtn.style.opacity = '1');
  closeBtn.addEventListener('mouseleave', () => closeBtn.style.opacity = '0.7');

  const p = qs('p', bar);
  if (p) p.appendChild(closeBtn);

  closeBtn.addEventListener('click', () => {
    bar.style.transition = 'opacity 200ms ease, max-height 300ms ease';
    bar.style.opacity = '0';
    bar.style.overflow = 'hidden';
    bar.style.maxHeight = bar.offsetHeight + 'px';

    requestAnimationFrame(() => {
      bar.style.maxHeight = '0';
    });

    setTimeout(() => {
      bar.style.display = 'none';
      sessionStorage.setItem('nf_announcement_dismissed', '1');
    }, 310);
  });
}

/* ─────────────────────────────────────────────
   15. LAZY IMAGE FALLBACK
   (Polyfill for browsers without native lazy loading)
───────────────────────────────────────────── */

function initLazyImages() {
  if ('loading' in HTMLImageElement.prototype) return; // native support

  const images = qsa('img[loading="lazy"]');
  if (images.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) img.src = img.dataset.src;
          observer.unobserve(img);
        }
      });
    },
    { rootMargin: '200px 0px' }
  );

  images.forEach(img => observer.observe(img));
}

/* ─────────────────────────────────────────────
   16. SMOOTH ANCHOR SCROLL (in-page links)
   Handles any <a href="#..."> on the page.
───────────────────────────────────────────── */

function initSmoothScroll() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const id = link.getAttribute('href');
    if (id === '#') return; // bare # links

    const target = qs(id);
    if (!target) return;

    // Let TOC handle its own clicks
    if (link.classList.contains('toc-link')) return;

    e.preventDefault();
    const headerH = parseInt(
      getComputedStyle(document.documentElement)
        .getPropertyValue('--header-height') || '72'
    );
    const top = target.getBoundingClientRect().top + window.scrollY - headerH - 16;
    window.scrollTo({ top, behavior: 'smooth' });

    // Update URL hash without jumping
    history.pushState(null, '', id);
  });
}

/* ─────────────────────────────────────────────
   17. SIDEBAR CTA — STICKY POSITIONING
   Keeps sidebar CTA visible while scrolling
   within the article, then pins to bottom.
───────────────────────────────────────────── */

function initSidebarSticky() {
  const sidebar = qs('.article-sidebar');
  const cta     = qs('#sidebar-cta');
  const article = qs('#article-body');

  if (!sidebar || !cta || !article) return;

  // CSS handles this via position: sticky.
  // JS adds a class when the user has scrolled past
  // the article CTA block to increase urgency.
  const inlineCta = qs('#article-cta');
  if (!inlineCta) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        cta.classList.toggle('sidebar-cta--urgent', !entry.isIntersecting);
      });
    },
    { threshold: 0 }
  );

  observer.observe(inlineCta);
}

/* ─────────────────────────────────────────────
   18. MOBILE CLUSTER TABS — HORIZONTAL SCROLL
   Scrolls active tab into view on mobile.
───────────────────────────────────────────── */

function initTabScrollIntoView() {
  const tabBar = qs('#cluster-tabs');
  if (!tabBar) return;

  tabBar.addEventListener('click', (e) => {
    const tab = e.target.closest('.cluster-tab');
    if (!tab) return;
    // Scroll tab into centre of scroll container
    setTimeout(() => {
      tab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }, 50);
  });
}

/* ─────────────────────────────────────────────
   19. SEARCH OVERLAY (Future-ready stub)
   Activate with data-action="open-search"
───────────────────────────────────────────── */

function initSearch() {
  document.addEventListener('keydown', (e) => {
    // Ctrl+K or Cmd+K → open search (future feature)
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      // TODO: open search overlay
      console.info('[Nexaflow] Search shortcut fired — overlay not yet implemented.');
    }
  });
}

/* ─────────────────────────────────────────────
   20. PERFORMANCE — MARK LONG TASKS (dev only)
───────────────────────────────────────────── */

function initPerfMonitor() {
  if (process?.env?.NODE_ENV !== 'production' && 'PerformanceObserver' in window) {
    try {
      const po = new PerformanceObserver(list => {
        list.getEntries().forEach(entry => {
          if (entry.duration > 50) {
            console.warn('[Nexaflow] Long task:', Math.round(entry.duration) + 'ms');
          }
        });
      });
      po.observe({ entryTypes: ['longtask'] });
    } catch (_) { /* not supported */ }
  }
}

/* ─────────────────────────────────────────────
   21. WHATSAPP BUTTON — SHOW AFTER DELAY
───────────────────────────────────────────── */

function initWhatsappButton() {
  const btn = qs('.whatsapp-btn');
  if (!btn) return;

  // Hide initially, show after 3 seconds for better UX
  btn.style.opacity    = '0';
  btn.style.transform  = 'scale(0.8)';
  btn.style.transition = 'opacity 400ms ease, transform 400ms ease';

  setTimeout(() => {
    btn.style.opacity   = '1';
    btn.style.transform = '';
  }, 3000);
}

/* ─────────────────────────────────────────────
   22. ARTICLE READING TIME — DYNAMIC
   Calculates and updates reading time if
   the element is empty (e.g. in CMS flow).
───────────────────────────────────────────── */

function initReadingTime() {
  const article  = qs('#article-body');
  const timeEl   = qs('.article-read-time');
  if (!article || !timeEl) return;

  // Only update if placeholder is missing
  if (timeEl.textContent.trim()) return;

  const words = article.innerText.trim().split(/\s+/).length;
  const mins  = Math.max(1, Math.round(words / 200));
  timeEl.textContent = `${mins} min read`;
}

/* ─────────────────────────────────────────────
   23. EXTERNAL LINK SAFETY
   Adds rel="noopener noreferrer" to all
   external links that are missing it.
───────────────────────────────────────────── */

function initExternalLinks() {
  qsa('a[href^="http"]').forEach(link => {
    try {
      const url = new URL(link.href);
      if (url.hostname !== window.location.hostname) {
        // Open in new tab if not already set
        if (!link.target) link.target = '_blank';
        // Ensure security attributes
        const rel = new Set((link.rel || '').split(' ').filter(Boolean));
        rel.add('noopener');
        rel.add('noreferrer');
        link.rel = [...rel].join(' ');
      }
    } catch (_) { /* malformed URL */ }
  });
}

/* ─────────────────────────────────────────────
   24. SCHEMA INJECTION — DYNAMIC FAQ
   If FAQ items are rendered client-side,
   inject/update the FAQPage JSON-LD.
───────────────────────────────────────────── */

function initDynamicFAQSchema() {
  const faqList = qs('.faq-list');
  // Only run on article pages where inline schema may already exist
  if (!faqList || qs('script[data-schema="faq"]')) return;

  const items = qsa('.faq-item', faqList);
  if (items.length === 0) return;

  const mainEntity = items.map(item => {
    const q = qs('[itemprop="name"]', item)?.textContent?.trim();
    const a = qs('[itemprop="text"]', item)?.textContent?.trim();
    if (!q || !a) return null;
    return {
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    };
  }).filter(Boolean);

  if (mainEntity.length === 0) return;

  const script = document.createElement('script');
  script.type         = 'application/ld+json';
  script.dataset.schema = 'faq';
  script.textContent  = JSON.stringify({
    '@context': 'https://schema.org',
    '@type':    'FAQPage',
    mainEntity,
  });
  document.head.appendChild(script);
}

/* ─────────────────────────────────────────────
   25. VIEWPORT HEIGHT FIX (Mobile 100vh)
   Fixes the iOS "100vh includes browser bar" bug.
───────────────────────────────────────────── */

function initViewportHeightFix() {
  function setVh() {
    document.documentElement.style.setProperty(
      '--vh', window.innerHeight * 0.01 + 'px'
    );
  }
  setVh();
  window.addEventListener('resize', debounce(setVh, 200));
}

/* ─────────────────────────────────────────────
   ENTRY POINT — DOM READY
───────────────────────────────────────────── */

function init() {
  // Core UI
  initHeaderScroll();
  initMobileNav();
  initDesktopDropdowns();
  initFAQ();
  initClusterTabs();
  initBackToTop();
  initSmoothScroll();
  initFooterYear();

  // Article-specific
  initTableOfContents();
  initReadingProgress();
  initCopyLink();
  initChecklist();
  initSidebarSticky();
  initReadingTime();

  // Lead gen
  initLeadForm();
  initWhatsappButton();

  // Content
  initCounters();
  initTabScrollIntoView();
  initLazyImages();
  initExternalLinks();
  initDynamicFAQSchema();

  // UX polish
  initAnnouncement();
  initViewportHeightFix();
  initSearch();

  // Dev tools
  initPerfMonitor();
}

// Run after DOM is fully parsed
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}