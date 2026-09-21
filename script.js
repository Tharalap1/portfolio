// Animated stat counters
(function () {
  var counters = document.querySelectorAll('.stat-num');
  if (!('IntersectionObserver' in window)) {
    counters.forEach(function (el) { el.textContent = el.dataset.target + (el.dataset.suffix || ''); });
    return;
  }
  function animate(el) {
    var target = parseInt(el.dataset.target, 10);
    var suffix = el.dataset.suffix || '';
    var duration = 1400;
    var start = null;
    function frame(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  var seen = new WeakSet();
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && !seen.has(entry.target)) {
        seen.add(entry.target);
        animate(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(function (el) { io.observe(el); });
})();

// Mobile nav toggle
(function () {
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  if (!toggle || !links) return;
  toggle.addEventListener('click', function () { links.classList.toggle('open'); });
  links.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') links.classList.remove('open');
  });
})();

// Footer year
(function () {
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();

// Typing effect for hero specialties
(function () {
  var el = document.getElementById('typed');
  if (!el) return;
  var phrases = [
    'LLM Applications in production',
    'RAG pipelines with cited answers',
    'Agentic AI with tool use',
    'LoRA / QLoRA fine-tuning',
    'MLOps, evaluation & guardrails'
  ];
  var pi = 0, ci = 0, deleting = false;
  function tick() {
    var phrase = phrases[pi];
    if (!deleting) {
      ci++;
      el.textContent = phrase.slice(0, ci);
      if (ci === phrase.length) { deleting = true; return void setTimeout(tick, 1800); }
      setTimeout(tick, 55);
    } else {
      ci--;
      el.textContent = phrase.slice(0, ci);
      if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; return void setTimeout(tick, 350); }
      setTimeout(tick, 28);
    }
  }
  setTimeout(tick, 900);
})();

// Scroll-reveal on sections, cards, stats, faq items
(function () {
  var targets = document.querySelectorAll('.section, .card, .stat, .faq-item, .contact-card');
  targets.forEach(function (el) { el.classList.add('reveal'); });
  if (!('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('visible'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        // stagger siblings slightly
        var siblings = Array.prototype.slice.call(entry.target.parentElement.children);
        var idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = Math.min(idx * 70, 350) + 'ms';
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  targets.forEach(function (el) { io.observe(el); });
})();

// 3D tilt on cards (fine pointers only)
(function () {
  if (!window.matchMedia('(pointer: fine)').matches) return;
  document.querySelectorAll('.card').forEach(function (card) {
    var raf = null;
    card.addEventListener('mousemove', function (e) {
      var r = card.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(function () {
        card.style.transform = 'perspective(900px) rotateX(' + (-y * 7).toFixed(2) + 'deg) rotateY(' + (x * 9).toFixed(2) + 'deg) translateY(-4px)';
      });
    });
    card.addEventListener('mouseleave', function () {
      if (raf) cancelAnimationFrame(raf);
      card.style.transform = '';
    });
  });
})();
