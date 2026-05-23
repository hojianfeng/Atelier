/* ═══════════════════════════════════════════════════════════════
   LUMIÈRE INTERIORS — script.js
   Premium Interior Design Landing Page
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── HELPERS ──────────────────────────────────────────────── */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];


  /* ─── FOOTER YEAR ──────────────────────────────────────────── */
  const yearEl = $('#footerYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  /* ─── STICKY NAVBAR ────────────────────────────────────────── */
  const navbar = $('#navbar');

  const updateNavbar = () => {
    const scrolled = window.scrollY > 60;
    navbar.classList.toggle('scrolled', scrolled);
  };

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();


  /* ─── ACTIVE NAV LINK ON SCROLL ────────────────────────────── */
  const navLinks = $$('.nav-link');
  const sections = $$('section[id], div[id="home"]');

  const setActiveLink = () => {
    const scrollPos = window.scrollY + window.innerHeight * 0.35;
    let current = '';

    sections.forEach(sec => {
      if (sec.offsetTop <= scrollPos) current = sec.id;
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active', href === current);
    });
  };

  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();


  /* ─── MOBILE MENU ──────────────────────────────────────────── */
  const hamburger     = $('#hamburger');
  const mobileOverlay = $('#mobileOverlay');
  const mobileClose   = $('#mobileClose');
  const mobileLinks   = $$('.mobile-link');

  const openMenu = () => {
    mobileOverlay.classList.add('open');
    mobileOverlay.setAttribute('aria-hidden', 'false');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    mobileOverlay.classList.remove('open');
    mobileOverlay.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', openMenu);
  mobileClose.addEventListener('click', closeMenu);
  mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

  mobileOverlay.addEventListener('click', e => {
    if (e.target === mobileOverlay) closeMenu();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileOverlay.classList.contains('open')) closeMenu();
  });


  /* ─── DARK / LIGHT MODE TOGGLE ─────────────────────────────── */
  const themeToggle = $('#themeToggle');
  const themeIcon   = $('#themeIcon');
  const root        = document.documentElement;

  const savedTheme  = localStorage.getItem('lumiere-theme') || 'light';
  root.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeToggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const next    = current === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    localStorage.setItem('lumiere-theme', next);
    updateThemeIcon(next);
  });

  function updateThemeIcon(theme) {
    themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  }


  /* ─── SCROLL FADE-IN ANIMATIONS ────────────────────────────── */
  const animEls = $$('.fade-up, .fade-left, .fade-right');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  animEls.forEach(el => observer.observe(el));


  /* ─── HERO: Trigger initial animation ─────────────────────── */
  const heroContent = $('.hero-content');
  if (heroContent) {
    requestAnimationFrame(() => heroContent.classList.add('visible'));
  }


  /* ─── STATISTICS COUNTER ───────────────────────────────────── */
  const statNums    = $$('.stat-num[data-target]');
  let countersStarted = false;

  const easeOutQuart = t => 1 - Math.pow(1 - t, 4);

  const animateCounter = (el, target, duration = 1800) => {
    const start = performance.now();
    const step = (now) => {
      const elapsed  = Math.min((now - start) / duration, 1);
      const progress = easeOutQuart(elapsed);
      el.textContent = Math.floor(progress * target);
      if (elapsed < 1) requestAnimationFrame(step);
      else el.textContent = target;
    };
    requestAnimationFrame(step);
  };

  const heroObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersStarted) {
          countersStarted = true;
          statNums.forEach(el => animateCounter(el, +el.dataset.target));
        }
      });
    },
    { threshold: 0.5 }
  );

  const heroSection = $('#home');
  if (heroSection) heroObserver.observe(heroSection);


  /* ─── PORTFOLIO FILTER ──────────────────────────────────────── */
  const filterBtns    = $$('.filter-btn');
  const portfolioItems = $$('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      portfolioItems.forEach((item, i) => {
        const match = filter === 'all' || item.dataset.category === filter;

        if (match) {
          item.classList.remove('hidden');
          item.style.setProperty('--delay', `${i * 0.04}s`);
          requestAnimationFrame(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          });
        } else {
          item.style.opacity = '0';
          item.style.transform = 'translateY(16px)';
          setTimeout(() => item.classList.add('hidden'), 280);
        }
      });
    });
  });


  /* ─── LIGHTBOX ──────────────────────────────────────────────── */
  const lightbox         = $('#lightbox');
  const lightboxBackdrop = $('#lightboxBackdrop');
  const lightboxImg      = $('#lightboxImg');
  const lightboxCat      = $('#lightboxCat');
  const lightboxTitle    = $('#lightboxTitle');
  const lightboxClose    = $('#lightboxClose');
  const lightboxPrev     = $('#lightboxPrev');
  const lightboxNext     = $('#lightboxNext');

  let lightboxItems = [];
  let lightboxIndex = 0;

  const openLightbox = (index) => {
    lightboxIndex = index;
    showLightboxSlide(index);
    lightbox.hidden = false;
    lightboxBackdrop.classList.add('open');
    requestAnimationFrame(() => lightbox.classList.add('open'));
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  };

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    lightboxBackdrop.classList.remove('open');
    setTimeout(() => { lightbox.hidden = true; }, 350);
    document.body.style.overflow = '';
  };

  const showLightboxSlide = (index) => {
    const item  = lightboxItems[index];
    const img   = item.querySelector('img');
    const cat   = item.querySelector('.portfolio-cat')?.textContent || '';
    const title = item.querySelector('.portfolio-title')?.textContent || '';

    lightboxImg.src   = img.src.replace('w=700', 'w=1200');
    lightboxImg.alt   = img.alt;
    lightboxCat.textContent   = cat;
    lightboxTitle.textContent = title;
  };

  const prevSlide = () => {
    lightboxIndex = (lightboxIndex - 1 + lightboxItems.length) % lightboxItems.length;
    showLightboxSlide(lightboxIndex);
  };

  const nextSlide = () => {
    lightboxIndex = (lightboxIndex + 1) % lightboxItems.length;
    showLightboxSlide(lightboxIndex);
  };

  const rebuildLightboxItems = () => {
    lightboxItems = $$('.portfolio-item:not(.hidden)');
  };

  rebuildLightboxItems();

  $$('.portfolio-zoom').forEach(btn => {
    btn.addEventListener('click', () => {
      rebuildLightboxItems();
      const card  = btn.closest('.portfolio-item');
      const index = lightboxItems.indexOf(card);
      if (index !== -1) openLightbox(index);
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxBackdrop.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', prevSlide);
  lightboxNext.addEventListener('click', nextSlide);

  document.addEventListener('keydown', e => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   prevSlide();
    if (e.key === 'ArrowRight')  nextSlide();
  });

  // Re-build on filter change
  filterBtns.forEach(btn => btn.addEventListener('click', () => {
    setTimeout(rebuildLightboxItems, 350);
  }));


  /* ─── TESTIMONIALS SLIDER ───────────────────────────────────── */
  const track     = $('#testimonialsTrack');
  const cards     = $$('.testimonial-card', track);
  const dotsWrap  = $('#sliderDots');
  const prevBtn   = $('#sliderPrev');
  const nextBtn   = $('#sliderNext');

  let currentSlide   = 0;
  let autoSlideTimer = null;

  // Build dots
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = `slider-dot${i === 0 ? ' active' : ''}`;
    dot.setAttribute('role', 'listitem');
    dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
    dot.addEventListener('click', () => goToSlide(i));
    dotsWrap.appendChild(dot);
  });

  const goToSlide = (index) => {
    currentSlide = (index + cards.length) % cards.length;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    $$('.slider-dot', dotsWrap).forEach((d, i) => d.classList.toggle('active', i === currentSlide));
  };

  const startAutoSlide = () => {
    clearInterval(autoSlideTimer);
    autoSlideTimer = setInterval(() => goToSlide(currentSlide + 1), 5000);
  };

  prevBtn.addEventListener('click', () => { goToSlide(currentSlide - 1); startAutoSlide(); });
  nextBtn.addEventListener('click', () => { goToSlide(currentSlide + 1); startAutoSlide(); });

  // Pause on hover
  const sliderWrap = $('.testimonials-slider');
  sliderWrap.addEventListener('mouseenter', () => clearInterval(autoSlideTimer));
  sliderWrap.addEventListener('mouseleave', startAutoSlide);

  // Touch swipe
  let touchStartX = 0;
  sliderWrap.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  sliderWrap.addEventListener('touchend',   e => {
    const delta = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) goToSlide(currentSlide + (delta > 0 ? 1 : -1));
    startAutoSlide();
  });

  startAutoSlide();


  /* ─── CONTACT FORM ──────────────────────────────────────────── */
  const form        = $('#enquiryForm');
  const submitBtn   = $('#submitBtn');
  const formSuccess = $('#formSuccess');
  const formError   = $('#formError');

  /* Validation helpers */
  const showError = (inputId, errorId, msg) => {
    const input = $(`#${inputId}`);
    const error = $(`#${errorId}`);
    input.classList.add('invalid');
    if (error) error.textContent = msg;
  };

  const clearError = (inputId, errorId) => {
    const input = $(`#${inputId}`);
    const error = $(`#${errorId}`);
    input.classList.remove('invalid');
    if (error) error.textContent = '';
  };

  const validateForm = () => {
    let valid = true;

    const name    = $('#name').value.trim();
    const email   = $('#email').value.trim();
    const message = $('#message').value.trim();

    clearError('name', 'nameError');
    clearError('email', 'emailError');
    clearError('message', 'messageError');

    if (!name) {
      showError('name', 'nameError', 'Please enter your full name.');
      valid = false;
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError('email', 'emailError', 'Please enter a valid email address.');
      valid = false;
    }

    if (!message || message.length < 10) {
      showError('message', 'messageError', 'Please enter a message of at least 10 characters.');
      valid = false;
    }

    return valid;
  };

  // Real-time validation on blur
  ['name', 'email', 'message'].forEach(id => {
    const el = $(`#${id}`);
    if (el) {
      el.addEventListener('blur', () => {
        const errId = `${id}Error`;
        if (el.value.trim()) clearError(id, errId);
      });
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Hide previous notifications
    formSuccess.hidden = true;
    formError.hidden   = true;

    // Loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    const formData = {
      name:    $('#name').value.trim(),
      email:   $('#email').value.trim(),
      phone:   $('#phone').value.trim(),
      service: $('#service').value,
      message: $('#message').value.trim(),
    };

    try {
      /* ── FormSubmit integration ────────────────────────────────
         Replace 'hojianfeng1@gmail.com' with your desired recipient.
         FormSubmit.co accepts the first submission and requires a
         one-time email confirmation before it goes live.
      ─────────────────────────────────────────────────────────── */
      const response = await fetch('https://formsubmit.co/ajax/hojianfeng1@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept':        'application/json',
        },
        body: JSON.stringify({
          name:           formData.name,
          email:          formData.email,
          phone:          formData.phone || 'Not provided',
          service:        formData.service || 'Not specified',
          message:        formData.message,
          _subject:       `New enquiry from ${formData.name} — Lumière Interiors`,
          _captcha:       'false',
          _template:      'box',
        }),
      });

      const result = await response.json();

      if (result.success === 'true' || result.success === true) {
        formSuccess.hidden = false;
        form.reset();
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        throw new Error('FormSubmit returned failure');
      }
    } catch (err) {
      console.error('Form submission error:', err);
      formError.hidden = false;
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  });


  /* ─── BACK TO TOP BUTTON ────────────────────────────────────── */
  const backToTop = $('#backToTop');

  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ─── SMOOTH SCROLL FOR ANCHOR LINKS ───────────────────────── */
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = $(targetId);
      if (!target) return;

      e.preventDefault();
      const offset = window.innerWidth <= 768 ? 68 : 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  /* ─── PORTFOLIO ITEM HOVER — keyboard accessible ───────────── */
  $$('.portfolio-item').forEach(item => {
    item.setAttribute('tabindex', '0');
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.querySelector('.portfolio-zoom')?.click();
      }
    });
  });

});
