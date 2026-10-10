/* Axion Bangladesh — motion layer
   Preloader and page transitions, smooth scrolling, scroll-driven reveals and pointer effects.
   Everything here is enhancement: without GSAP, or when the visitor prefers reduced
   motion, every page renders as the plain HTML/CSS underneath. Each page only has some
   of the sections below, so every effect checks that its elements exist. */

(() => {
  const root = document.documentElement;
  const preloader = document.querySelector('.preloader');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  // Set by the inline script in <head>: the full preloader has already played this visit.
  const returning = root.classList.contains('is-returning');

  function removePreloader() {
    root.classList.remove('is-loading', 'is-returning');
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
  const wait = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); });
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

  /* ------------------------------------------------------------------ */
  /* Links: anchors on this page scroll, other pages get a curtain       */
  /* ------------------------------------------------------------------ */

  const VISITED_KEY = 'axion-visited';
  const LABEL_KEY = 'axion-label';
  // Translation keys for the name shown on the curtain, by folder.
  const PAGE_LABELS = {
    '': 'crumb.home',
    equipment: 'nav.equipment',
    solutions: 'nav.solutions',
    wholesale: 'nav.wholesale',
    about: 'nav.about',
    contact: 'nav.contact',
    privacy: 'ft.privacy',
    terms: 'ft.terms',
  };
  const siteRoot = new URL(root.dataset.root || './', location.href);
  const pathOf = (url) => url.pathname.replace(/index\.html$/, '');

  function labelFor(url) {
    const folder = pathOf(url).slice(pathOf(siteRoot).length).replace(/\/$/, '');
    const key = PAGE_LABELS[folder];
    // `t` is script.js's translation lookup, so the label follows the chosen language.
    return key && typeof window.t === 'function' ? window.t(key) : 'Axion';
  }

  let leaving = false;

  // The curtain rises from the bottom; the next page's opener carries on upward with the same name on it.
  function leaveTo(href) {
    if (leaving) return;
    leaving = true;
    const label = labelFor(new URL(href));
    try { sessionStorage.setItem(LABEL_KEY, label); } catch (e) { /* storage unavailable */ }

    const cover = document.createElement('div');
    cover.className = 'page-cover';
    cover.setAttribute('aria-hidden', 'true');
    cover.innerHTML = '<div class="preloader__curtain"></div><div class="preloader__panel"><p class="cover-label"></p></div>';
    const text = $('.cover-label', cover);
    text.textContent = label;
    document.body.append(cover);
    lenis?.stop();

    const [curtain, panel] = cover.children;
    const shut = 'ellipse(100% 0% at 50% 100%)';
    const full = 'ellipse(100% 120% at 50% 100%)';
    gsap.timeline({ onComplete: () => { location.href = href; } })
      .fromTo(curtain, { clipPath: shut }, { clipPath: full, duration: 0.75, ease: 'power4.inOut' }, 0)
      .fromTo(panel, { clipPath: shut }, { clipPath: full, duration: 0.75, ease: 'power4.inOut' }, 0.1)
      .fromTo(text, { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5, ease: 'expo.out' }, 0.42);
  }

  // Coming back through the browser's back/forward cache restores the page with the curtain still up.
  window.addEventListener('pageshow', (e) => {
    if (!e.persisted) return;
    $$('.page-cover').forEach((el) => el.remove());
    leaving = false;
    lenis?.start();
  });

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if ((link.target && link.target !== '_self') || link.hasAttribute('download') || link.getAttribute('href') === '#') return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || url.protocol !== location.protocol) return;
    e.preventDefault();
    if (pathOf(url) !== pathOf(location) || url.search !== location.search) {
      leaveTo(url.href);
      return;
    }
    scrollToTarget(url.hash || '#top');
    history.pushState(null, '', url.hash || location.pathname + location.search);
  });
  window.addEventListener('popstate', () => scrollToTarget(location.hash || '#top'));

  // script.js asks for a page change (e.g. carrying the equipment list to the contact page).
  document.addEventListener('axion:navigate', (e) => {
    e.preventDefault();
    leaveTo(new URL(e.detail.url, location.href).href);
  });

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
  $$(`.hero__title, .page-hero__title, ${headingSel}`).forEach((el) => el.classList.add('is-split-pending'));

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

  let scenesBuilt = false;

  // script.js swaps innerHTML on a language change: finish and restore any split text first.
  document.addEventListener('axion:beforelang', () => {
    liveSplits.forEach((entry) => {
      entry.tween.progress(1);
      restoreHeading(entry);
    });
    clearScrubbedText();
  });
  document.addEventListener('axion:lang', () => {
    if (scenesBuilt) buildScrubbedText();
    ScrollTrigger.refresh();
  });

  /* ------------------------------------------------------------------ */
  /* Scroll scenes, built as the curtain lifts so nothing plays unseen   */
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

  // Cards lift in while their photograph wipes up behind them.
  function revealCards(cardSel, mediaSel, popSel, from) {
    const cards = $$(cardSel);
    if (!cards.length) return;
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

  function wipeIn(media, fromInset, note) {
    if (!media) return;
    const trigger = { trigger: media, start: 'top 75%', once: true };
    gsap.fromTo(media, { clipPath: `inset(${fromInset})` }, {
      clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'expo.inOut', clearProps: 'clipPath', scrollTrigger: trigger,
    });
    gsap.fromTo($('img', media), { '--rs': 1.25 }, { '--rs': 1, duration: 2.2, ease: 'expo.out', scrollTrigger: trigger });
    if (note) gsap.from(note, { y: 40, opacity: 0, duration: 1.1, delay: 0.9, ease: 'expo.out', scrollTrigger: trigger });
  }

  function buildProcess() {
    const process = $('.process');
    if (!process) return;
    const steps = $$('.step', process);
    steps.forEach((step) => step.classList.remove('is-active'));

    function setStepProgress(progress) {
      steps.forEach((step, i) => {
        const local = gsap.utils.clamp(0, 1, progress * steps.length - i);
        step.style.setProperty('--fill', local.toFixed(3));
        step.classList.toggle('is-active', local > 0);
      });
    }

    gsap.matchMedia().add({
      pinned: '(min-width: 1181px) and (min-height: 720px)',
      flowing: '(max-width: 1180px), (max-height: 719px)',
    }, (ctx) => {
      if (ctx.conditions.pinned) {
        // Fill the viewport while pinned so the next section doesn't peek in underneath.
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
      }
      ScrollTrigger.create({
        trigger: $('.steps', process),
        start: 'top 75%',
        end: 'bottom 45%',
        onUpdate: (self) => setStepProgress(self.progress),
      });
      return undefined;
    });
  }

  // Crossed ribbons: a marquee that answers scroll speed and direction.
  function buildRibbons() {
    if (!$('.ribbons')) return;
    const tracks = $$('.ribbon__track').map((el) => ({
      x: 0,
      // Back ribbon drifts right, front ribbon left (in % of track width per frame).
      base: el.closest('.ribbon--back') ? 0.016 : -0.022,
      set: gsap.quickSetter(el, 'xPercent'),
    }));
    let dir = 1;
    let speed = 1;
    const watch = ScrollTrigger.create({
      trigger: '.ribbons',
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        dir = self.direction;
        speed = dir * (1 + Math.min(Math.abs(self.getVelocity()) / 350, 7));
      },
    });
    gsap.ticker.add((time, delta) => {
      if (!watch.isActive) return;
      speed += (dir - speed) * 0.05;
      tracks.forEach((r) => {
        r.x = gsap.utils.wrap(-50, 0, r.x + r.base * speed * (delta / 16.67));
        r.set(r.x);
      });
    });
    // The bands open like scissors as the page scrolls, sliding their crossing point sideways.
    const scrub = { trigger: '.ribbons', start: 'top bottom', end: 'bottom top', scrub: true };
    gsap.fromTo('.ribbon--front', { rotation: -3 }, { rotation: -1.5, ease: 'none', scrollTrigger: scrub });
    gsap.fromTo('.ribbon--back', { rotation: 5 }, { rotation: 2.5, ease: 'none', scrollTrigger: scrub });
  }

  // Showroom: on large screens the section pins and vertical scrolling walks sideways
  // through the products; on touch screens it is a native swipe (see script.js).
  function buildShowroom() {
    const showroom = $('.showroom');
    if (!showroom) return;
    const viewport = $('.showroom__viewport', showroom);
    const track = $('.showroom__track', showroom);
    const slides = $$('.showroom__slide', showroom);
    const index = $('.showroom__index', showroom);

    gsap.from(slides, {
      y: 70, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: 0.08,
      scrollTrigger: { trigger: viewport, start: 'top 88%', once: true },
    });

    gsap.matchMedia().add('(min-width: 961px) and (min-height: 640px)', () => {
      showroom.classList.add('is-pinned');
      viewport.scrollLeft = 0;
      const distance = () => track.scrollWidth - viewport.clientWidth;
      gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: showroom,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          refreshPriority: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            index.textContent = Math.round(self.progress * (slides.length - 1)) + 1;
            showroom.style.setProperty('--progress', self.progress.toFixed(3));
          },
        },
      });
      return () => {
        showroom.classList.remove('is-pinned');
        gsap.set(track, { clearProps: 'x' });
      };
    });
  }

  // Wholesale steps: each card eases back as the next one slides over it.
  function buildJourney() {
    const cards = $$('.journey__card');
    if (!cards.length) return;
    batchReveal('.journey__card', { y: 60 });
    cards.forEach((card, i) => {
      const next = cards[i + 1];
      if (!next) return;
      gsap.to(card, {
        scale: 0.9 + i * 0.025,
        ease: 'none',
        scrollTrigger: { trigger: next, start: 'top bottom', end: 'top 35%', scrub: true },
      });
    });
  }

  function buildScenes() {
    scenesBuilt = true;

    $$(headingSel).forEach((el) => {
      ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: () => revealHeading(el) });
    });
    buildScrubbedText();

    batchReveal('.eyebrow:not(.hero__eyebrow)', { x: -16 }, {
      start: 'top 90%',
      onEnter: (batch) => batch.forEach((el) => el.classList.add('is-in')),
    });
    batchReveal('.section-head .lead, .company__text, .inquiry__lead, .cta-band__text, .journey__intro .lead, .brief__form > .lead', { y: 28 });
    batchReveal('.showroom__aside, .brief__group, .brief__city', { y: 24 });
    batchReveal('.brief__card', { y: 50 });
    batchReveal('.section-head > .btn, .team__note, .process__cta, .quality .btn, .company .btn, .cta-band__actions > *', { y: 24 });
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

    revealCards('.cat-card', '.cat-card__media', '.pill, .add-btn, .round-arrow', { y: 80 });
    revealCards('.feat-card', '.feat-card__media', '.pill, .add-btn, .chips li', {
      y: 100, rotationX: -10, transformPerspective: 1200, transformOrigin: '50% 100%',
    });
    revealCards('.person', '.person__photo', '.pill', { y: 80 });
    revealCards('.explore-card', '.explore-card__media', '.explore-card__arrow, .explore-card__body', { y: 90 });

    // Photography drifts against the scroll inside its frame.
    $$('.cat-card__media img, .feat-card__media img, .quality__media img, .company__media img, .explore-card__media img').forEach((img) => {
      gsap.fromTo(img, { '--py': '-5%' }, {
        '--py': '5%',
        ease: 'none',
        scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });

    wipeIn($('.quality__media'), '0% 100% 0% 0%', $('.quality__note'));
    wipeIn($('.company__media'), '0% 0% 0% 100%', $('.company__badge'));

    if ($('.quote')) {
      const trigger = { trigger: '.inquiry__grid', start: 'top 75%', once: true };
      gsap.from('.quote', { x: 80, opacity: 0, duration: 1.3, ease: 'expo.out', scrollTrigger: trigger });
      gsap.from('.quote__head, .quote .field, .quote__foot', {
        y: 20, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.07, delay: 0.35, scrollTrigger: trigger,
      });
    }

    // The closing call to action draws the logo's ribbon across itself.
    if ($('.cta-band')) {
      gsap.fromTo('.cta-band__swoosh path', { strokeDashoffset: 1.02 }, {
        strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: '.cta-band', start: 'top 85%', end: 'bottom 70%', scrub: 1 },
      });
    }

    // "Up next" slides its page name in as it arrives.
    const next = $('.next-page');
    if (next) {
      const scrub = { trigger: next, start: 'top bottom', end: 'top 40%', scrub: 0.6 };
      gsap.fromTo($('.next-page__title', next), { xPercent: 14, opacity: 0.15 }, { xPercent: 0, opacity: 1, ease: 'none', scrollTrigger: scrub });
      gsap.fromTo($('.next-page__arrow', next), { scale: 0.4, rotate: -120 }, { scale: 1, rotate: 0, ease: 'none', scrollTrigger: scrub });
    }

    // The closing wordmark rises out of the bottom edge as the page ends.
    gsap.from('.footer__mark span', {
      yPercent: 100,
      ease: 'none',
      stagger: 0.08,
      scrollTrigger: { trigger: '.footer__mark', start: 'top bottom', end: 'bottom bottom', scrub: 0.6 },
    });

    buildProcess();
    buildRibbons();
    buildShowroom();
    buildJourney();
  }

  /* ------------------------------------------------------------------ */
  /* Page chrome: progress bar, header                                   */
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

  // The heading link of a product card is stretched over the whole card, so pointer
  // events land on it even above the photo; check the photo's box directly.
  function overCardPhoto(t, e) {
    if (!t.matches('.cat-card__link, .feat-card__link')) return false;
    const r = t.closest('.cat-card, .feat-card').querySelector('.cat-card__media, .feat-card__media').getBoundingClientRect();
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

    const LENS = '.hero__media, .showroom__media, .cat-card__media, .feat-card__media, .quality__media, .company__media, .person__photo, .explore-card';
    const LINK = 'a, button, label, .lang__btn';
    const DARK = '.preloader, .page-cover, .mobile-menu, .topbar, .quality, .inquiry, .cta-band, .showroom, .brief__card, .footer, .ribbon--back, .shortlist__dock';

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
    $$('.cat-card, .feat-card, .person, .explore-card').forEach((card) => tilt(card, 5));
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

  /* ------------------------------------------------------------------ */
  /* Product quick view                                                  */
  /* ------------------------------------------------------------------ */

  const qvEl = $('#quickview');
  const qvPanel = $('.qv__panel', qvEl);

  function quickViewContentIn(delay) {
    gsap.fromTo($$('.qv__media, .qv__body > *:not([hidden])', qvEl), { y: 24, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.7, ease: 'expo.out', stagger: 0.04, delay, overwrite: true,
    });
    gsap.fromTo('.qv__img', { scale: 1.15 }, { scale: 1, duration: 1.3, ease: 'expo.out', delay });
  }

  document.addEventListener('axion:qv', (e) => {
    if (!e.detail.open) {
      lenis?.start();
      setCursor(true);
      return;
    }
    lenis?.stop();
    setCursor(false);
    qvEl.classList.remove('is-closing');
    gsap.fromTo(qvPanel, sheetQuery.matches ? { yPercent: 100 } : { xPercent: 100 }, {
      xPercent: 0, yPercent: 0, duration: 0.85, ease: 'expo.out',
    });
    quickViewContentIn(0.2);
  });
  document.addEventListener('axion:qvswap', () => quickViewContentIn(0));
  document.addEventListener('axion:qvclose', (e) => {
    e.preventDefault();
    if (qvEl.classList.contains('is-closing')) return;
    qvEl.classList.add('is-closing');
    gsap.to(qvPanel, {
      ...(sheetQuery.matches ? { yPercent: 100 } : { xPercent: 100 }),
      duration: 0.45,
      ease: 'power3.in',
      onComplete: () => {
        qvEl.close();
        qvEl.classList.remove('is-closing');
        gsap.set(qvPanel, { clearProps: 'transform' });
      },
    });
  });

  // Wholesale tabs: the chosen panel's contents settle in.
  document.addEventListener('axion:tab', (e) => {
    const { panel } = e.detail;
    gsap.fromTo($$('.buyer__text, .buyer__ready-label, .buyer__ready li', panel), { y: 16, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.6, ease: 'expo.out', stagger: 0.05, overwrite: true,
    });
  });

  // The brief card answers every choice with a small nudge.
  $('.brief__form')?.addEventListener('change', () => {
    gsap.fromTo('.brief__card', { scale: 0.985 }, { scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.5)', overwrite: true });
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
  form?.addEventListener('submit', () => {
    const invalid = $$('[aria-invalid="true"]', form);
    if (invalid.length) {
      gsap.fromTo(invalid, { x: -8 }, { x: 0, duration: 0.7, ease: 'elastic.out(1, 0.25)', clearProps: 'x' });
    }
    gsap.fromTo('.quote__status', { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'expo.out' });
  });

  /* ------------------------------------------------------------------ */
  /* Page intro                                                          */
  /* ------------------------------------------------------------------ */

  const heroImg = $('.hero__media img');
  if (heroImg) gsap.set(heroImg, { scale: 1.12 });

  // The Axion Line (ride.js) opens the home page. Coming back to it later in the same visit,
  // after riding it once, the page opens at the hero instead; the ride is still above.
  const ride = $('.ride');
  let skipRide = false;
  try { skipRide = Boolean(ride && returning && sessionStorage.getItem('axion-ride')); } catch (e) { /* storage unavailable */ }

  function playIntro() {
    const tl = gsap.timeline({ defaults: { ease: 'expo.out', duration: 1.2 } });

    // The header animates in once per visit; after that it stays put between pages.
    if (!returning) {
      tl.from('.topbar__inner > *', { yPercent: -120, opacity: 0, duration: 0.9, stagger: 0.08 }, 0)
        .from('.header__logo, .nav__list li, .header__actions > *, .header__toggle', {
          y: -24, opacity: 0, duration: 1, stagger: 0.05,
        }, 0.05);
    }

    if (heroImg) {
      // On the home page the ride comes first, so the hero plays as it arrives instead of unseen.
      const heroTl = ride && !skipRide ? gsap.timeline({ paused: true, defaults: tl.vars.defaults }) : tl;
      if (heroTl !== tl) {
        ScrollTrigger.create({ trigger: '.hero', start: 'top 70%', once: true, onEnter: () => heroTl.play() });
      }
      heroTl.fromTo('.hero__media', { clipPath: 'circle(0% at 50% 60%)' }, {
        clipPath: 'circle(80% at 50% 60%)', duration: 1.8, ease: 'expo.inOut', clearProps: 'clipPath',
      }, 0)
        .fromTo(heroImg, { scale: 1.5 }, { scale: 1.12, duration: 2.4 }, 0.35)
        .from('.hero__eyebrow', { x: -24, opacity: 0 }, 0.25)
        .add(revealHeading($('.hero__title'), { stagger: 0.06, duration: 1.4 }), 0.3)
        .from('.hero__text', { y: 30, opacity: 0 }, 0.7)
        .from('.intent__q, .intent__options li, .intent__browse', { y: 24, opacity: 0, stagger: 0.07 }, 0.8)
        .fromTo('.hero__badge', { y: -18, scale: 0.7, opacity: 0 }, {
          y: 0, scale: 1, opacity: 1, ease: 'back.out(2.2)', duration: 0.9,
        }, 1.25)
        .fromTo('.hero__card', { y: 40, opacity: 0 }, { y: 0, opacity: 1, ease: 'back.out(1.7)', duration: 1 }, 1.35);

      heroTl.then(() => {
        if (finePointer) initHeroParallax();
        // Hero content drifts up and fades as the page scrolls past it.
        const pastHero = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true };
        gsap.to('.hero__content', { y: -80, opacity: 0.25, ease: 'none', scrollTrigger: pastHero });
        gsap.to(heroImg, { yPercent: 4, ease: 'none', scrollTrigger: pastHero });
      });
    }

    const pageHero = $('.page-hero');
    if (pageHero) {
      tl.add(revealHeading($('.page-hero__title', pageHero), { stagger: 0.05, duration: 1.3 }), 0.2)
        .from($$('.page-hero__foot > *', pageHero), { y: 28, opacity: 0, stagger: 0.1 }, 0.55);
      if ($('.buyer', pageHero)) tl.from('.buyer', { y: 50, opacity: 0, duration: 1.3 }, 0.75);
    }

    // Breadcrumbs, wherever the page puts them.
    const crumbs = $$('.crumbs li');
    if (crumbs.length) tl.from(crumbs, { y: 14, opacity: 0, stagger: 0.08, duration: 0.9 }, 0.1);
  }

  /* ------------------------------------------------------------------ */
  /* Preloader and page opener                                           */
  /* ------------------------------------------------------------------ */

  const STATUS = {
    en: ['Warming the steamers', 'Calibrating the handpieces', 'Adjusting the lamp', 'Opening the showroom'],
    bn: ['স্টিমার গরম হচ্ছে', 'হ্যান্ডপিস ক্যালিব্রেট হচ্ছে', 'ল্যাম্প ঠিক করা হচ্ছে', 'শোরুম খুলছে'],
  };

  function assetsReady() {
    const waits = [document.fonts?.ready, heroImg?.decode?.().catch(() => {})];
    if (ride) waits.push(new Promise((resolve) => { document.addEventListener('axion:rideready', resolve, { once: true }); }));
    return Promise.race([Promise.all(waits), wait(3500)]);
  }

  function reveal() {
    root.style.overflow = '';
    lenis?.start();
    try { sessionStorage.setItem(VISITED_KEY, '1'); } catch (e) { /* storage unavailable */ }
    buildScenes();
    playIntro();
    ScrollTrigger.refresh();
    if (location.hash) scrollToTarget(location.hash, true);
    else if (skipRide) scrollToTarget('#hero', true);
    root.classList.add('is-revealed');
    document.dispatchEvent(new CustomEvent('axion:revealed'));
  }

  // The panels lift with a curved edge: the night panel first, then the maroon curtain beneath it.
  function liftPanels(tl, at) {
    const panels = [$('.preloader__panel', preloader), $('.preloader__curtain', preloader)];
    return tl
      .to(panels[0], { clipPath: 'ellipse(100% 0% at 50% 0%)', duration: 1.1, ease: 'power4.inOut' }, at)
      .to(panels[1], { clipPath: 'ellipse(100% 0% at 50% 0%)', duration: 1.1, ease: 'power4.inOut' }, '<0.13')
      .add(reveal, '<0.1')
      .add(removePreloader);
  }

  // Later pages in the same visit: the curtain from the page that was clicked is already up,
  // showing that page's name, and simply lifts.
  function playOpener() {
    try { sessionStorage.removeItem(LABEL_KEY); } catch (e) { /* storage unavailable */ }
    Promise.race([Promise.all([document.fonts?.ready, wait(200)]), wait(900)]).then(() => {
      const tl = gsap.timeline()
        .to('.preloader__page', { yPercent: -40, opacity: 0, duration: 0.45, ease: 'power3.in' }, 0);
      liftPanels(tl, 0.12);
    });
  }

  // First page of a visit: draw the mark, count up while assets load, then lift.
  function playPreloader() {
    const lines = STATUS[isBn() ? 'bn' : 'en'];
    const num = $('.preloader__num', preloader);
    const bar = $('.preloader__bar span', preloader);
    const status = $('.preloader__status span', preloader);
    const strokes = $$('.preloader__mark path', preloader);
    status.textContent = lines[0];

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
      const tl = gsap.timeline()
        .to(counter, { v: 100, duration: 0.55, ease: 'power2.out', onUpdate: render })
        .to('.preloader__center, .preloader__foot', {
          y: -40, opacity: 0, duration: 0.6, ease: 'power3.in', stagger: 0.06,
        }, '+=0.25');
      liftPanels(tl, '-=0.15');
    });
  }

  function start() {
    // Skip it if the CSS failsafe has already hidden it (very slow script load).
    if (!preloader || !root.classList.contains('is-loading') || performance.now() > 5500) {
      removePreloader();
      reveal();
      return;
    }
    preloader.style.animation = 'none';
    root.style.overflow = 'hidden';
    lenis?.stop();
    gsap.set([$('.preloader__panel', preloader), $('.preloader__curtain', preloader)], { clipPath: 'ellipse(100% 120% at 50% 0%)' });
    if (returning) playOpener();
    else playPreloader();
  }

  start();
})();
