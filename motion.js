/* Axion Bangladesh — motion layer
   Preloader, smooth scrolling, scroll-driven reveals and pointer effects.
   Everything here is enhancement: without GSAP, or when the visitor prefers
   reduced motion, the page renders as the plain HTML/CSS underneath. */

(() => {
  const root = document.documentElement;
  const preloader = document.querySelector('.preloader');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

  function removePreloader() {
    root.classList.remove('is-loading');
    root.style.overflow = '';
    preloader?.remove();
  }

  if (reduceMotion || !window.gsap || !window.ScrollTrigger || !window.SplitText) {
    removePreloader();
    return;
  }

  gsap.registerPlugin(ScrollTrigger, SplitText);
  root.classList.add('motion');

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const isBn = () => root.lang === 'bn';
  const header = $('.header');
  const menuToggle = $('.header__toggle');

  // The intro is choreographed from the top of the page.
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if (!location.hash) window.scrollTo(0, 0);

  /* ------------------------------------------------------------------ */
  /* Smooth scroll                                                       */
  /* ------------------------------------------------------------------ */

  const lenis = window.Lenis ? new Lenis({ lerp: 0.085, wheelMultiplier: 0.95 }) : null;
  if (lenis) {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  function scrollToTarget(hash, immediate = false) {
    const el = hash === '#top' || !hash ? null : document.querySelector(hash);
    if (hash && hash !== '#top' && !el) return;
    const y = el ? el.getBoundingClientRect().top + window.scrollY : 0;
    // The header slides away when scrolling down, so only leave room for it when heading up.
    const offset = y < window.scrollY ? -header.offsetHeight : 0;
    if (lenis) {
      lenis.scrollTo(el || 0, { offset, immediate, duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) });
    } else {
      window.scrollTo({ top: y + offset, behavior: immediate ? 'auto' : 'smooth' });
    }
    if (el) {
      if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
      el.focus({ preventScroll: true });
    }
  }

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const hash = link.getAttribute('href');
    if (hash === '#' || (hash !== '#top' && !document.querySelector(hash))) return;
    e.preventDefault();
    scrollToTarget(hash);
    history.pushState(null, '', hash);
  });
  window.addEventListener('popstate', () => scrollToTarget(location.hash || '#top'));

  /* ------------------------------------------------------------------ */
  /* Split-text reveals                                                  */
  /* ------------------------------------------------------------------ */

  // Headings are split only while they animate, then restored, so the language
  // switcher always works on the original markup.
  const liveSplits = new Set();

  function revealHeading(el, vars = {}) {
    const original = el.innerHTML;
    // SplitText breaks the line at every <br>, even ones CSS hides on small screens.
    $$('br', el).forEach((br) => { if (getComputedStyle(br).display === 'none') br.remove(); });
    const split = SplitText.create(el, { type: 'lines,words', mask: 'lines', linesClass: 'split-line' });
    const entry = { el, split, original };
    liveSplits.add(entry);
    el.classList.remove('is-split-pending');
    entry.tween = gsap.from(split.words, {
      yPercent: 115,
      rotate: 4,
      transformOrigin: '0% 100%',
      duration: 1.25,
      ease: 'expo.out',
      stagger: 0.045,
      ...vars,
      onComplete: () => restoreHeading(entry),
    });
    return entry.tween;
  }

  function restoreHeading(entry) {
    if (!liveSplits.delete(entry)) return;
    entry.split.revert();
    entry.el.innerHTML = entry.original;
  }

  const headingSel = '.h2, .footer__tagline';
  $$(`.hero__title, ${headingSel}`).forEach((el) => el.classList.add('is-split-pending'));
  $$(headingSel).forEach((el) => {
    ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: () => revealHeading(el) });
  });

  // Lead paragraphs that light up word by word as they scroll through the viewport.
  let scrubbedText = [];

  function buildScrubbedText() {
    scrubbedText = $$('.quality__lead, .company__lead').map((el) => {
      const split = SplitText.create(el, { type: 'words' });
      const tween = gsap.fromTo(split.words, { opacity: 0.16 }, {
        opacity: 1,
        stagger: 0.1,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 52%', scrub: true },
      });
      return { split, tween };
    });
  }

  function clearScrubbedText() {
    scrubbedText.forEach(({ split, tween }) => {
      tween.scrollTrigger?.kill();
      tween.kill();
      split.revert();
    });
    scrubbedText = [];
  }

  buildScrubbedText();

  // script.js swaps innerHTML on a language change: finish and restore any split text first.
  document.addEventListener('axion:beforelang', () => {
    liveSplits.forEach((entry) => {
      entry.tween.progress(1);
      restoreHeading(entry);
    });
    clearScrubbedText();
  });
  document.addEventListener('axion:lang', () => {
    buildScrubbedText();
    ScrollTrigger.refresh();
  });

  /* ------------------------------------------------------------------ */
  /* Generic scroll reveals                                              */
  /* ------------------------------------------------------------------ */

  function batchReveal(selector, from, { start = 'top 88%', onEnter } = {}) {
    const els = $$(selector);
    if (!els.length) return;
    gsap.set(els, { opacity: 0, ...from });
    ScrollTrigger.batch(els, {
      start,
      once: true,
      onEnter: (batch) => {
        gsap.to(batch, { opacity: 1, x: 0, y: 0, scale: 1, duration: 1.1, ease: 'expo.out', stagger: 0.09 });
        onEnter?.(batch);
      },
    });
  }

  batchReveal('.eyebrow:not(.hero__eyebrow)', { x: -16 }, {
    start: 'top 90%',
    onEnter: (batch) => batch.forEach((el) => el.classList.add('is-in')),
  });
  batchReveal('.section-head .lead, .process__head .lead, .company__text, .inquiry__lead', { y: 28 });
  batchReveal('.section-head > .btn, .team__note, .process__cta, .quality .btn, .company .btn', { y: 24 });
  batchReveal('.value', { y: 30 }, {
    start: 'top 92%',
    onEnter: (batch) => gsap.from(batch.map((el) => $('.value__icon', el)), {
      scale: 0, rotate: -90, duration: 1, ease: 'back.out(2)', stagger: 0.09,
    }),
  });
  batchReveal('.advisor', { y: 40 });
  batchReveal('.tags li, .inquiry__types li', { y: 12, scale: 0.9 });
  batchReveal('.checklist li', { x: -24 }, {
    onEnter: (batch) => gsap.from(batch.map((el) => $('.checklist__icon', el)), {
      scale: 0, rotate: -45, duration: 0.9, ease: 'back.out(2.4)', stagger: 0.09, delay: 0.15,
    }),
  });
  batchReveal('.step', { y: 40 });
  batchReveal('.contact', { y: 24 }, { start: 'top 94%' });
  batchReveal('.footer__brand, .footer__col', { y: 30 }, { start: 'top 94%' });
  batchReveal('.footer__bottom > :not(.footer__tagline)', { y: 16 }, { start: 'top 98%' });

  /* ------------------------------------------------------------------ */
  /* Cards: lift in while the photograph wipes up behind them            */
  /* ------------------------------------------------------------------ */

  function revealCards(cardSel, mediaSel, popSel, from) {
    const cards = $$(cardSel);
    cards.forEach((card) => {
      gsap.set(card, { opacity: 0, ...from });
      gsap.set($(mediaSel, card), { clipPath: 'inset(100% 0% 0% 0%)' });
      gsap.set($(`${mediaSel} img`, card), { '--rs': 1.3 });
      gsap.set($$(popSel, card), { opacity: 0, y: 10, scale: 0.85 });
    });
    ScrollTrigger.batch(cards, {
      start: 'top 96%',
      once: true,
      onEnter: (batch) => batch.forEach((card, i) => {
        gsap.timeline({ delay: i * 0.12, defaults: { ease: 'expo.out' } })
          .to(card, { opacity: 1, y: 0, rotationX: 0, duration: 1.3 })
          .to($(mediaSel, card), { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut', clearProps: 'clipPath' }, 0)
          .to($(`${mediaSel} img`, card), { '--rs': 1, duration: 2 }, 0.1)
          .to($$(popSel, card), { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.06, ease: 'back.out(2)' }, 0.7);
      }),
    });
  }

  revealCards('.cat-card', '.cat-card__media', '.pill, .add-btn, .round-arrow', { y: 80 });
  revealCards('.feat-card', '.feat-card__media', '.pill, .add-btn, .chips li', {
    y: 100, rotationX: -10, transformPerspective: 1200, transformOrigin: '50% 100%',
  });
  revealCards('.person', '.person__photo', '.pill', { y: 80 });

  // Photography drifts against the scroll inside its frame.
  $$('.cat-card__media img, .feat-card__media img, .quality__media img, .company__media img').forEach((img) => {
    gsap.fromTo(img, { '--py': '-5%' }, {
      '--py': '5%',
      ease: 'none',
      scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });

  /* ------------------------------------------------------------------ */
  /* Full-bleed sections                                                 */
  /* ------------------------------------------------------------------ */

  function wipeIn(media, fromInset, note) {
    const trigger = { trigger: media, start: 'top 75%', once: true };
    gsap.fromTo(media, { clipPath: `inset(${fromInset})` }, {
      clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'expo.inOut', clearProps: 'clipPath', scrollTrigger: trigger,
    });
    gsap.fromTo($('img', media), { '--rs': 1.25 }, { '--rs': 1, duration: 2.2, ease: 'expo.out', scrollTrigger: trigger });
    if (note) gsap.from(note, { y: 40, opacity: 0, duration: 1.1, delay: 0.9, ease: 'expo.out', scrollTrigger: trigger });
  }

  wipeIn($('.quality__media'), '0% 100% 0% 0%', $('.quality__note'));
  wipeIn($('.company__media'), '0% 0% 0% 100%', $('.company__badge'));

  gsap.from('.quote', {
    x: 80, opacity: 0, duration: 1.3, ease: 'expo.out',
    scrollTrigger: { trigger: '.inquiry__grid', start: 'top 75%', once: true },
  });
  gsap.from('.quote__head, .quote .field, .quote__foot', {
    y: 20, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.07, delay: 0.35,
    scrollTrigger: { trigger: '.inquiry__grid', start: 'top 75%', once: true },
  });

  // The closing wordmark rises out of the bottom edge as the page ends.
  gsap.from('.footer__mark span', {
    yPercent: 100,
    ease: 'none',
    stagger: 0.08,
    scrollTrigger: { trigger: '.footer__mark', start: 'top bottom', end: 'bottom bottom', scrub: 0.6 },
  });

  /* ------------------------------------------------------------------ */
  /* Process: steps fill in sequence (pinned on large screens)           */
  /* ------------------------------------------------------------------ */

  const steps = $$('.step');
  steps.forEach((step) => step.classList.remove('is-active'));

  function setStepProgress(progress) {
    steps.forEach((step, i) => {
      const local = gsap.utils.clamp(0, 1, progress * steps.length - i);
      step.style.setProperty('--fill', local.toFixed(3));
      step.classList.toggle('is-active', local > 0);
    });
  }

  const mm = gsap.matchMedia();
  mm.add({
    pinned: '(min-width: 1181px) and (min-height: 720px)',
    flowing: '(max-width: 1180px), (max-height: 719px)',
  }, (ctx) => {
    if (ctx.conditions.pinned) {
      // Fill the viewport while pinned so the next section doesn't peek in underneath.
      const process = $('.process');
      process.classList.add('is-pinned');
      ScrollTrigger.create({
        trigger: process,
        start: 'top top',
        end: '+=140%',
        pin: true,
        refreshPriority: 1,
        onUpdate: (self) => setStepProgress(self.progress),
      });
      return () => process.classList.remove('is-pinned');
    } else {
      ScrollTrigger.create({
        trigger: '.steps',
        start: 'top 75%',
        end: 'bottom 45%',
        onUpdate: (self) => setStepProgress(self.progress),
      });
    }
  });

  /* ------------------------------------------------------------------ */
  /* Crossed ribbons: marquee that answers scroll speed and direction    */
  /* ------------------------------------------------------------------ */

  const ribbonTracks = $$('.ribbon__track').map((el) => ({
    x: 0,
    // Back ribbon drifts right, front ribbon left (in % of track width per frame).
    base: el.closest('.ribbon--back') ? 0.016 : -0.022,
    set: gsap.quickSetter(el, 'xPercent'),
  }));
  let ribbonDir = 1;
  let ribbonSpeed = 1;
  const ribbonWatch = ScrollTrigger.create({
    trigger: '.ribbons',
    start: 'top bottom',
    end: 'bottom top',
    onUpdate: (self) => {
      ribbonDir = self.direction;
      ribbonSpeed = ribbonDir * (1 + Math.min(Math.abs(self.getVelocity()) / 350, 7));
    },
  });
  gsap.ticker.add((time, delta) => {
    if (!ribbonWatch.isActive) return;
    ribbonSpeed += (ribbonDir - ribbonSpeed) * 0.05;
    ribbonTracks.forEach((r) => {
      r.x = gsap.utils.wrap(-50, 0, r.x + r.base * ribbonSpeed * (delta / 16.67));
      r.set(r.x);
    });
  });
  // The bands open like scissors as the page scrolls, sliding their crossing point sideways.
  const ribbonScrub = { trigger: '.ribbons', start: 'top bottom', end: 'bottom top', scrub: true };
  gsap.fromTo('.ribbon--front', { rotation: -3 }, { rotation: -1.5, ease: 'none', scrollTrigger: ribbonScrub });
  gsap.fromTo('.ribbon--back', { rotation: 5 }, { rotation: 2.5, ease: 'none', scrollTrigger: ribbonScrub });

  /* ------------------------------------------------------------------ */
  /* Page chrome: progress bar, header, current section                  */
  /* ------------------------------------------------------------------ */

  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.append(progressBar);
  gsap.to(progressBar, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });

  // Direction comes from the scroll position itself: ScrollTrigger's own direction also
  // flips when the page grows (lazy images), which would flash the header back in.
  // It only comes back after a deliberate scroll up, not a few pixels of settling at the end of a jump.
  let lastY = window.scrollY;
  let upTravel = 0;
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => {
      const y = self.scroll();
      if (y === lastY) return;
      const menuOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      upTravel = y < lastY ? upTravel + (lastY - y) : 0;
      header.classList.toggle('is-scrolled', y > 40);
      if (y > lastY && y > 260 && !menuOpen) header.classList.add('is-hidden');
      else if (upTravel > 24 || y <= 260) header.classList.remove('is-hidden');
      lastY = y;
    },
  });
  header.addEventListener('focusin', () => header.classList.remove('is-hidden'));

  // About and Leadership both belong to the "About" link, so count active sections per link.
  const activeCount = new Map();
  $$('.nav__list a, .mobile-menu__nav a').forEach((link) => {
    const hash = link.getAttribute('href');
    const ids = hash === '#about' ? ['#about', '#leadership'] : [hash];
    ids.forEach((id) => {
      if (!$(id)) return;
      ScrollTrigger.create({
        trigger: id,
        start: 'top 50%',
        end: 'bottom 50%',
        onToggle: (self) => {
          const n = (activeCount.get(link) || 0) + (self.isActive ? 1 : -1);
          activeCount.set(link, n);
          link.classList.toggle('is-current', n > 0);
        },
      });
    });
  });

  /* ------------------------------------------------------------------ */
  /* Pointer effects (mouse and trackpad only)                           */
  /* ------------------------------------------------------------------ */

  function magnetize(el, strength) {
    const xTo = gsap.quickTo(el, 'x', { duration: 0.7, ease: 'elastic.out(1, 0.4)' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.7, ease: 'elastic.out(1, 0.4)' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    });
    el.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
  }

  function tilt(card, max) {
    gsap.set(card, { transformPerspective: 1100 });
    const rx = gsap.quickTo(card, 'rotationX', { duration: 0.6, ease: 'power3' });
    const ry = gsap.quickTo(card, 'rotationY', { duration: 0.6, ease: 'power3' });
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      ry(((e.clientX - r.left) / r.width - 0.5) * max * 2);
      rx(-((e.clientY - r.top) / r.height - 0.5) * max * 2);
    });
    card.addEventListener('pointerleave', () => { rx(0); ry(0); });
  }

  let cursorEl = null;

  // A modal dialog sits in the top layer, above any z-index, so the custom cursor steps aside while one is open.
  function setCursor(on) {
    if (!cursorEl) return;
    root.classList.toggle('has-cursor', on);
    cursorEl.style.display = on ? '' : 'none';
  }

  // The heading link of a category card is stretched over the whole card, so pointer
  // events land on it even above the photo; check the photo's box directly.
  function overCardPhoto(t, e) {
    if (!t.matches('.cat-card__link')) return false;
    const r = t.closest('.cat-card').querySelector('.cat-card__media').getBoundingClientRect();
    return e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
  }

  function initCursor() {
    const cursor = document.createElement('div');
    cursorEl = cursor;
    cursor.className = 'cursor is-hidden';
    cursor.setAttribute('aria-hidden', 'true');
    cursor.innerHTML = '<span class="cursor__ring"></span><span class="cursor__dot"></span>';
    document.body.append(cursor);
    const [ring, dot] = cursor.children;
    const dotX = gsap.quickSetter(dot, 'x', 'px');
    const dotY = gsap.quickSetter(dot, 'y', 'px');
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3' });
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3' });

    const LENS = '.hero__media, .cat-card__media, .feat-card__media, .quality__media, .company__media, .person__photo';
    const LINK = 'a, button, label, .lang__btn';
    const DARK = '.preloader, .mobile-menu, .topbar, .quality, .inquiry, .footer, .ribbon--back, .shortlist__dock';

    window.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
      const t = e.target instanceof Element ? e.target : document.body;
      cursor.classList.remove('is-hidden');
      cursor.classList.toggle('is-text', !!t.closest('input, textarea'));
      cursor.classList.toggle('is-lens', !t.closest('.add-btn') && (!!t.closest(LENS) || overCardPhoto(t, e)));
      cursor.classList.toggle('is-link', !!t.closest(LINK));
      cursor.classList.toggle('is-dark', !!t.closest(DARK) && !t.closest('.quote'));
    }, { passive: true });
    root.addEventListener('mouseleave', () => cursor.classList.add('is-hidden'));
    root.classList.add('has-cursor');
  }

  function initHeroParallax() {
    const hero = $('.hero');
    const follow = (el, prop) => gsap.quickTo(el, prop, { duration: 1.1, ease: 'power3' });
    const layers = [
      [$('.hero__media img'), -16, -10],
      [$('.hero__card'), 24, 18],
      [$('.hero__badge'), 14, 10],
    ].map(([el, dx, dy]) => ({ x: follow(el, 'x'), y: follow(el, 'y'), dx, dy }));

    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      layers.forEach((l) => { l.x(px * l.dx); l.y(py * l.dy); });
      hero.style.setProperty('--mx', px.toFixed(3));
      hero.style.setProperty('--my', py.toFixed(3));
    });
  }

  if (finePointer) {
    $$('.btn, .socials a, .footer__top, .header__toggle, .mobile-menu__close').forEach((el) => magnetize(el, 0.3));
    $$('.cat-card, .feat-card, .person').forEach((card) => tilt(card, 5));
    initCursor();
  }

  /* ------------------------------------------------------------------ */
  /* Mobile menu: colour layers sweep in from the right and out the left */
  /* ------------------------------------------------------------------ */

  const menu = $('#mobile-menu');
  const menuInner = $('.mobile-menu__inner', menu);
  const menuLayers = $$('.mobile-menu__layers span', menu);
  // The layers are 180vw wide, so 78% of their width parks them just past either edge.
  const MENU_OFF = 78;
  let menuTl;

  // GSAP owns visibility from here on, so the panel can stay up while it animates out.
  gsap.set(menu, { visibility: 'hidden' });
  gsap.set(menuLayers, { xPercent: MENU_OFF });

  function openMenu() {
    menuTl?.kill();
    lenis?.stop();
    gsap.set(menu, { visibility: 'visible' });
    gsap.set(menuInner, { opacity: 1, y: 0 });
    menuTl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      // An ease-out so the sweep answers the tap straight away.
      .fromTo(menuLayers, { xPercent: MENU_OFF }, { xPercent: 0, duration: 1.1, ease: 'power3.out', stagger: 0.09 }, 0)
      .fromTo('.mobile-menu__swoosh path', { strokeDashoffset: 1.02 }, { strokeDashoffset: 0, duration: 1.8, ease: 'expo.inOut' }, 0.35)
      .fromTo('.mobile-menu__nav li', { '--line': 0 }, { '--line': 1, duration: 1.2, ease: 'expo.inOut', stagger: 0.07 }, 0.45)
      .fromTo('.mobile-menu__text', { yPercent: 120, rotate: 7, transformOrigin: '0% 100%' }, {
        yPercent: 0, rotate: 0, duration: 1.2, stagger: 0.07,
      }, 0.55)
      .fromTo('.mobile-menu__nav .icon', { x: -24, opacity: 0 }, { x: 0, opacity: 1, duration: 0.9, stagger: 0.07 }, 0.75)
      .fromTo('.mobile-menu__top > *, .mobile-menu__actions > *, .mobile-menu__foot > *', { y: 24, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1, stagger: 0.05,
      }, 0.6)
      // The close button's lines start flat, like the hamburger that opened the menu, then cross.
      .fromTo('.mobile-menu__close span', { rotation: 0, scaleX: 0.5 }, {
        rotation: (i) => (i ? -45 : 45), scaleX: 1, duration: 0.9, ease: 'back.out(2)',
      }, 0.65);
  }

  function closeMenu() {
    menuTl?.kill();
    lenis?.start();
    menuTl = gsap.timeline({ onComplete: () => gsap.set(menu, { visibility: 'hidden' }) })
      .to(menuInner, { opacity: 0, y: -24, duration: 0.35, ease: 'power2.in' }, 0)
      // Top layer leaves first and every layer carries on to the left, peeling the colours back off.
      .to([...menuLayers].reverse(), { xPercent: -MENU_OFF, duration: 1, ease: 'power3.inOut', stagger: 0.08 }, 0.12);
  }

  document.addEventListener('axion:menu', (e) => (e.detail.open ? openMenu() : closeMenu()));

  /* ------------------------------------------------------------------ */
  /* Equipment list: the photo flies into the dock                       */
  /* ------------------------------------------------------------------ */

  const shortlistEl = $('.shortlist');

  document.addEventListener('axion:list', (e) => {
    const { added, from } = e.detail;
    if (shortlistEl.hidden) return;
    const dock = $('.shortlist__dock', shortlistEl);
    const bump = () => {
      gsap.fromTo(dock, { scale: 1.08 }, { scale: 1, duration: 0.9, ease: 'elastic.out(1, 0.4)' });
      gsap.fromTo('.shortlist__count', { scale: 1.6 }, { scale: 1, duration: 0.6, ease: 'back.out(3)' });
    };
    const source = added && from?.closest('.cat-card, .feat-card')?.querySelector('img');
    const thumb = $('.shortlist__thumbs img:last-child', shortlistEl);
    if (!source || !thumb) { bump(); return; }

    const a = source.getBoundingClientRect();
    const b = thumb.getBoundingClientRect();
    // The dock may still be sliding up from its entrance; aim for where it will settle.
    const settle = new DOMMatrix(getComputedStyle(shortlistEl).transform).m42;
    const fly = document.createElement('img');
    fly.src = source.currentSrc || source.src;
    fly.className = 'fly-thumb';
    fly.alt = '';
    Object.assign(fly.style, { left: `${a.left}px`, top: `${a.top}px`, width: `${a.width}px`, height: `${a.height}px` });
    document.body.append(fly);
    gsap.set(thumb, { opacity: 0 });

    gsap.timeline({
      onComplete: () => {
        fly.remove();
        gsap.fromTo(thumb, { opacity: 1, scale: 0.4 }, { scale: 1, duration: 0.6, ease: 'back.out(3)' });
        bump();
      },
    })
      .to(fly, { width: b.width, height: b.height, borderRadius: '50%', duration: 0.85, ease: 'power3.inOut' }, 0)
      .to(fly, { x: b.left - a.left, duration: 0.85, ease: 'power2.inOut' }, 0)
      .to(fly, { y: b.top - settle - a.top, duration: 0.85, ease: 'back.in(1.3)' }, 0)
      .fromTo(fly, { rotation: 0 }, { rotation: 12, duration: 0.85, ease: 'sine.inOut' }, 0);
  });

  // Requests to bring the quote form into view use the same smooth scroll as links.
  document.addEventListener('axion:goto', (e) => {
    e.preventDefault();
    scrollToTarget(`#${e.detail.target.id}`);
  });

  /* ------------------------------------------------------------------ */
  /* Setup finder                                                        */
  /* ------------------------------------------------------------------ */

  const finderEl = $('#finder');
  const finderPanel = $('.finder__panel', finderEl);
  const sheetQuery = matchMedia('(max-width: 680px)');

  document.addEventListener('axion:finder', (e) => {
    if (!e.detail.open) {
      lenis?.start();
      setCursor(true);
      return;
    }
    lenis?.stop();
    setCursor(false);
    finderEl.classList.remove('is-closing');
    const from = sheetQuery.matches ? { yPercent: 100 } : { y: 90, scale: 0.94, rotationX: 8, transformPerspective: 1200 };
    gsap.fromTo(finderPanel, { opacity: 0, ...from }, {
      opacity: 1, y: 0, yPercent: 0, scale: 1, rotationX: 0, duration: 0.9, ease: 'expo.out',
    });
    gsap.fromTo('.finder__head > *', { y: -14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'expo.out', stagger: 0.06, delay: 0.15 });
  });

  document.addEventListener('axion:finderclose', (e) => {
    e.preventDefault();
    if (finderEl.classList.contains('is-closing')) return;
    finderEl.classList.add('is-closing');
    const to = sheetQuery.matches ? { yPercent: 100 } : { y: 60, scale: 0.96 };
    gsap.to(finderPanel, {
      opacity: 0, ...to, duration: 0.42, ease: 'power3.in',
      onComplete: () => {
        finderEl.close();
        finderEl.classList.remove('is-closing');
        gsap.set(finderPanel, { clearProps: 'all' });
      },
    });
  });

  // Each step's content slides in from the side the visitor is moving toward.
  document.addEventListener('axion:finderstep', (e) => {
    const { el, dir } = e.detail;
    const parts = $$('.finder__q, .finder__hint, .finder__summary, .opt, .finder__picks li, .finder__note', el);
    gsap.fromTo(parts, { '--ox': `${56 * dir}px`, opacity: 0 }, {
      '--ox': '0px', opacity: 1, duration: 0.8, ease: 'expo.out', stagger: 0.045, overwrite: true,
    });
    if (el.classList.contains('finder__result')) {
      gsap.fromTo($$('.pick__tick', el), { scale: 0, rotate: -90 }, {
        scale: 1, rotate: 0, duration: 0.7, ease: 'back.out(2.6)', stagger: 0.07, delay: 0.35,
      });
    }
  });

  /* ------------------------------------------------------------------ */
  /* Inquiry form feedback                                               */
  /* ------------------------------------------------------------------ */

  const form = $('#quote-form');
  // Registered after script.js's handler, so the status text and aria-invalid flags are already set.
  form.addEventListener('submit', () => {
    const invalid = $$('[aria-invalid="true"]', form);
    if (invalid.length) {
      gsap.fromTo(invalid, { x: -8 }, { x: 0, duration: 0.7, ease: 'elastic.out(1, 0.25)', clearProps: 'x' });
    }
    gsap.fromTo('.quote__status', { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'expo.out' });
  });

  /* ------------------------------------------------------------------ */
  /* Hero intro                                                          */
  /* ------------------------------------------------------------------ */

  const heroImg = $('.hero__media img');
  gsap.set(heroImg, { scale: 1.12 });

  function playHeroIntro() {
    const tl = gsap.timeline({ defaults: { ease: 'expo.out', duration: 1.2 } });
    tl.from('.topbar__inner > *', { yPercent: -120, opacity: 0, duration: 0.9, stagger: 0.08 }, 0)
      .from('.header__logo, .nav__list li, .header__actions > *, .header__toggle', {
        y: -24, opacity: 0, duration: 1, stagger: 0.05,
      }, 0.05)
      .fromTo('.hero__media', { clipPath: 'circle(0% at 50% 60%)' }, {
        clipPath: 'circle(80% at 50% 60%)', duration: 1.8, ease: 'expo.inOut', clearProps: 'clipPath',
      }, 0)
      .fromTo(heroImg, { scale: 1.5 }, { scale: 1.12, duration: 2.4 }, 0.35)
      .from('.hero__eyebrow', { x: -24, opacity: 0 }, 0.25)
      .add(revealHeading($('.hero__title'), { stagger: 0.06, duration: 1.4 }), 0.3)
      .from('.hero__text', { y: 30, opacity: 0 }, 0.7)
      .from('.hero__actions > *', { y: 30, opacity: 0, stagger: 0.1 }, 0.8)
      .from('.hero__points li', { y: 18, opacity: 0, stagger: 0.1 }, 0.95)
      .fromTo('.hero__badge', { y: -18, scale: 0.7, opacity: 0 }, {
        y: 0, scale: 1, opacity: 1, ease: 'back.out(2.2)', duration: 0.9,
      }, 1.25)
      .fromTo('.hero__card', { y: 40, opacity: 0 }, { y: 0, opacity: 1, ease: 'back.out(1.7)', duration: 1 }, 1.35);

    tl.then(() => {
      if (finePointer) initHeroParallax();
      // Hero content drifts up and fades as the page scrolls past it.
      const pastHero = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true };
      gsap.to('.hero__content', { y: -80, opacity: 0.25, ease: 'none', scrollTrigger: pastHero });
      gsap.to(heroImg, { yPercent: 4, ease: 'none', scrollTrigger: pastHero });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Preloader                                                           */
  /* ------------------------------------------------------------------ */

  const STATUS = {
    en: ['Warming the steamers', 'Calibrating the handpieces', 'Adjusting the lamp', 'Opening the showroom'],
    bn: ['স্টিমার গরম হচ্ছে', 'হ্যান্ডপিস ক্যালিব্রেট হচ্ছে', 'ল্যাম্প ঠিক করা হচ্ছে', 'শোরুম খুলছে'],
  };

  function assetsReady() {
    const waits = [document.fonts?.ready, heroImg.decode?.().catch(() => {})];
    const timeout = new Promise((resolve) => { setTimeout(resolve, 3500); });
    return Promise.race([Promise.all(waits), timeout]);
  }

  function reveal() {
    root.style.overflow = '';
    lenis?.start();
    playHeroIntro();
    if (location.hash) scrollToTarget(location.hash, true);
    ScrollTrigger.refresh();
  }

  function playPreloader() {
    // Skip it if the CSS failsafe has already hidden it (very slow script load).
    if (!preloader || !root.classList.contains('is-loading') || performance.now() > 5500) {
      removePreloader();
      reveal();
      return;
    }
    preloader.style.animation = 'none';
    root.style.overflow = 'hidden';
    lenis?.stop();

    const lines = STATUS[isBn() ? 'bn' : 'en'];
    const num = $('.preloader__num', preloader);
    const bar = $('.preloader__bar span', preloader);
    const status = $('.preloader__status span', preloader);
    const strokes = $$('.preloader__mark path', preloader);
    // Top layer first: the night panel lifts, then the maroon curtain beneath it.
    const panels = [$('.preloader__panel', preloader), $('.preloader__curtain', preloader)];
    status.textContent = lines[0];

    gsap.set(panels, { clipPath: 'ellipse(100% 120% at 50% 0%)' });

    const counter = { v: 0 };
    let stage = 0;
    function swapStatus(text) {
      gsap.timeline()
        .to(status, { yPercent: -100, opacity: 0, duration: 0.25, ease: 'power2.in' })
        .add(() => { status.textContent = text; })
        .fromTo(status, { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.45, ease: 'expo.out' });
    }
    function render() {
      num.textContent = Math.round(counter.v);
      bar.style.transform = `scaleX(${counter.v / 100})`;
      const next = counter.v >= 100 ? 3 : Math.min(2, Math.floor(counter.v / 34));
      if (next !== stage) {
        stage = next;
        swapStatus(lines[stage]);
      }
    }

    // Hidden by CSS until now so nothing flashes before this script runs.
    const intro = gsap.timeline()
      .fromTo('.preloader__foot', { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, 0.1)
      .to(strokes[0], { strokeDashoffset: 0, duration: 0.8, ease: 'power3.inOut' }, 0.15)
      .to(strokes[1], { strokeDashoffset: 0, duration: 0.8, ease: 'power3.inOut' }, 0.4)
      .to(strokes[2], { strokeDashoffset: 0, duration: 1, ease: 'expo.inOut' }, 0.75)
      .fromTo('.preloader__word span', { yPercent: 110, opacity: 0 }, {
        yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.05, ease: 'expo.out',
      }, 1)
      .fromTo('.preloader__sub', { opacity: 0, letterSpacing: '0.7em' }, {
        opacity: 1, letterSpacing: '0.3em', duration: 1.2, ease: 'expo.out',
      }, 1.15)
      .to(counter, { v: 82, duration: 1.9, ease: 'power2.inOut', onUpdate: render }, 0);

    Promise.all([assetsReady(), intro.then()]).then(() => {
      gsap.timeline()
        .to(counter, { v: 100, duration: 0.55, ease: 'power2.out', onUpdate: render })
        .to('.preloader__center, .preloader__foot', {
          y: -40, opacity: 0, duration: 0.6, ease: 'power3.in', stagger: 0.06,
        }, '+=0.25')
        .to(panels[0], { clipPath: 'ellipse(100% 0% at 50% 0%)', duration: 1.15, ease: 'power4.inOut' }, '-=0.15')
        .to(panels[1], { clipPath: 'ellipse(100% 0% at 50% 0%)', duration: 1.15, ease: 'power4.inOut' }, '<0.14')
        .add(reveal, '<0.1')
        .add(removePreloader);
    });
  }

  playPreloader();
})();
