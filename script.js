(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Theme */
  const root = document.documentElement;
  try { const t = localStorage.getItem('theme'); if (t) root.dataset.theme = t; } catch (e) {}
  $('#themeToggle').addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  /* Mobile menu */
  const burger = $('#burger'), menu = $('#menu');
  const closeMenu = () => { menu.classList.remove('open'); burger.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); };
  burger.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
  });
  $$('#menu a').forEach(a => a.addEventListener('click', closeMenu));

  /* Typewriter */
  const roles = ['UI/UX Designer', 'Software Engineering Student', 'Front-End Enthusiast', 'Figma Prototyper', 'Full-Stack Learner'];
  const el = $('#typed');
  let r = 0, c = 0, del = false;
  (function type() {
    const word = roles[r];
    if (reduce) { el.textContent = roles[0]; return; }
    el.textContent = word.slice(0, c);
    let wait = del ? 40 : 85;
    if (!del && c === word.length) { del = true; wait = 1600; }
    else if (del && c === 0) { del = false; r = (r + 1) % roles.length; wait = 400; }
    else c += del ? -1 : 1;
    setTimeout(type, wait);
  })();

  /* Reveal on scroll (staggered) + counters + skill bars */
  $$('.cards, .stats, .hero-text').forEach(g => $$('.reveal', g).forEach((n, i) => n.style.setProperty('--d', i * 0.1 + 's')));
  $$('.bar').forEach(b => b.querySelector('i').style.setProperty('--w', b.dataset.v + '%'));

  const animateCount = n => {
    const target = +n.dataset.count, start = performance.now();
    const step = t => {
      const p = Math.min((t - start) / 1200, 1);
      n.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    $$('[data-count]', e.target).forEach(animateCount);
    if (e.target.classList.contains('panel')) $$('.bar', e.target).forEach(b => b.classList.add('go'));
    io.unobserve(e.target);
  }), { threshold: .15 });
  $$('.reveal').forEach(n => io.observe(n));

  /* Skill tabs */
  $$('.tab').forEach(t => t.addEventListener('click', () => {
    $$('.tab').forEach(x => x.classList.remove('active'));
    $$('.panel').forEach(p => p.classList.remove('active'));
    t.classList.add('active');
    const p = $('#p-' + t.dataset.tab);
    p.classList.add('active', 'in');
    $$('.bar', p).forEach(b => { b.classList.remove('go'); void b.offsetWidth; b.classList.add('go'); });
  }));

  /* Scroll: progress bar, nav state, back-to-top, active link */
  const bar = $('#progress'), nav = $('#nav'), top = $('#toTop');
  const links = $$('#menu a[href^="#"]:not(.btn)');
  const secs = links.map(a => $(a.getAttribute('href')));
  const onScroll = () => {
    const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = (y / h * 100) + '%';
    nav.classList.toggle('scrolled', y > 20);
    top.classList.toggle('show', y > 600);
    let cur = -1;
    secs.forEach((s, i) => { if (s.getBoundingClientRect().top < innerHeight * .4) cur = i; });
    links.forEach((a, i) => a.classList.toggle('active', i === cur));
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  top.addEventListener('click', () => scrollTo({ top: 0 }));

  /* Cursor glow (desktop) */
  const glow = $('#glow');
  if (matchMedia('(hover:hover)').matches && !reduce) {
    addEventListener('pointermove', e => { glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px'; }, { passive: true });
  }

  /* 3D tilt on cards & avatar (pointer devices) */
  if (matchMedia('(hover:hover)').matches && !reduce) {
    $$('.tilt, #tilt').forEach(card => {
      const max = card.id === 'tilt' ? 14 : 6;
      card.addEventListener('pointermove', e => {
        const b = card.getBoundingClientRect();
        const x = (e.clientX - b.left) / b.width - .5, y = (e.clientY - b.top) / b.height - .5;
        card.style.transform = `perspective(900px) rotateY(${x * max}deg) rotateX(${-y * max}deg)`;
      });
      card.addEventListener('pointerleave', () => card.style.transform = '');
    });
  }

  $('#year').textContent = new Date().getFullYear();
})();
