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

// ---------- Interactive RAG pipeline demo (simulated, canned knowledge base) ----------
(function () {
  var input = document.getElementById('demoInput');
  var askBtn = document.getElementById('demoAsk');
  var chunksEl = document.getElementById('demoChunks');
  var answerEl = document.getElementById('demoAnswer');
  if (!input || !askBtn || !chunksEl || !answerEl) return;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var running = false;
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, reduced ? 0 : ms); }); }

  var DOCS = [
    { title: 'Eval dimensions — production checklist', text: 'Every system ships with its own measurement: groundedness and citations, latency budgets, per-query cost, guardrails, and human review sampling.', keys: ['evaluat', 'metric', 'test', 'benchmark', 'judge', 'measur', 'quality', 'faithful'] },
    { title: 'Amex — systematic provider benchmarking', text: 'LLM providers and vector databases evaluated through systematic latency, cost, and accuracy experiments; results informed platform-wide build-vs-buy decisions.', keys: ['evaluat', 'benchmark', 'latency', 'cost', 'provider', 'build', 'buy'] },
    { title: 'Responsible-AI reviews', text: 'Evaluation criteria and bias-mitigation controls documented for production agentic AI and RAG systems, with observability checkpoints after launch.', keys: ['responsible', 'bias', 'review', 'guardrail', 'observab', 'evaluat'] },
    { title: 'Vanguard — RAG over fund documentation', text: 'RAG pipelines (LangChain, Pinecone, FAISS, Vertex AI) over legacy fund and account documentation; OpenSearch and pgvector evaluated as alternatives.', keys: ['rag', 'retriev', 'document', 'pinecone', 'faiss', 'langchain', 'vertex', 'chunk'] },
    { title: 'Amex — retrieval-augmented NLP', text: 'LLM-powered agents and event-driven APIs (LangChain, Pinecone, FAISS) powering retrieval-augmented NLP and agentic document-intelligence workflows.', keys: ['rag', 'retriev', 'document', 'agent', 'langchain', 'pinecone', 'faiss'] },
    { title: 'Chunking & indexing discipline', text: 'Document chunking and indexing engineered for precision and recall; hybrid retrieval strategies tuned per document type.', keys: ['chunk', 'index', 'retriev', 'precision', 'recall', 'hybrid'] },
    { title: 'Amex — agentic fraud triage', text: 'LLM-powered agents with tool use and event-driven orchestration triage fraud alerts end to end; multi-agent systems with vector-database retrieval.', keys: ['agent', 'tool', 'fraud', 'triage', 'mcp', 'orchestra', 'autonom', 'assistant'] },
    { title: 'MCP + SharePoint agents', text: 'Real hands-on MCP experience connecting AI agents to SharePoint applications at American Express.', keys: ['mcp', 'sharepoint', 'agent', 'tool'] },
    { title: 'Claude in daily production use', text: 'Claude used daily to build, evaluate, and operate production agentic AI systems and RAG pipelines.', keys: ['claude', 'agent', 'production', 'daily', 'llm'] },
    { title: 'LoRA/QLoRA fine-tuning', text: 'Iterative LoRA/QLoRA fine-tuning of Llama and Mistral on compliance and transaction datasets; the eval set was built before training began.', keys: ['lora', 'qlora', 'fine-tun', 'llama', 'mistral', 'train'] },
    { title: 'Prompt engineering', text: 'Prompt-engineering strategies including hybrid prompting at Vanguard; prompt templates versioned like code.', keys: ['prompt', 'hybrid'] },
    { title: 'MLOps & monitoring', text: 'MLflow and Airflow for experiment tracking, versioning, and automated retraining; model monitoring in production.', keys: ['mlops', 'mlflow', 'airflow', 'monitor', 'retrain', 'deploy', 'ci', 'cd'] },
    { title: 'XGBoost & anomaly detection', text: 'XGBoost and gradient-boosting models with rule-based logic for anomaly detection and customer risk scoring.', keys: ['xgboost', 'anomaly', 'risk', 'scor', 'gradient'] },
    { title: 'Background', text: '7+ years of software engineering; 3+ years building production LLM/ML systems. American Express (2026–present), Vanguard (2023–2026), HCLTech (2019–2023).', keys: ['experience', 'background', 'years', 'career', 'work', 'job', 'history'] }
  ];

  function cite(n) { return '<span class="cite">[' + n + ']</span>'; }

  var CANNED = {
    eval: {
      chunks: [
        { title: 'Eval dimensions — production checklist', text: DOCS[0].text, score: 0.94 },
        { title: 'Amex — systematic provider benchmarking', text: DOCS[1].text, score: 0.89 },
        { title: 'Responsible-AI reviews', text: DOCS[2].text, score: 0.85 }
      ],
      answer: 'Pranay evaluates AI on five dimensions before anything ships: <b>(1) groundedness</b> — every generated claim must trace to a cited source ' + cite(1) + '; <b>(2) latency</b> — p50/p95 budgets set per use case; <b>(3) cost</b> — per-query token economics feeding build-vs-buy decisions ' + cite(2) + '; <b>(4) guardrails</b> — PII handling and refusal paths; <b>(5) human review</b> — analysts sample outputs in production, with bias-mitigation controls documented ' + cite(3) + '.'
    },
    rag: {
      chunks: [
        { title: 'Vanguard — RAG over fund documentation', text: DOCS[3].text, score: 0.95 },
        { title: 'Amex — retrieval-augmented NLP', text: DOCS[4].text, score: 0.90 },
        { title: 'Chunking & indexing discipline', text: DOCS[5].text, score: 0.83 }
      ],
      answer: 'Pranay has built production RAG at two financial institutions. At Vanguard: retrieval over fund and account docs with LangChain + Pinecone/FAISS on Vertex AI — including evaluated alternatives (OpenSearch, pgvector) ' + cite(1) + '. At American Express: retrieval-augmented NLP and agentic document-intelligence workflows delivering cited answers ' + cite(2) + '. His chunking and indexing work is engineered around precision/recall tradeoffs, not defaults ' + cite(3) + '.'
    },
    agent: {
      chunks: [
        { title: 'Amex — agentic fraud triage', text: DOCS[6].text, score: 0.96 },
        { title: 'MCP + SharePoint agents', text: DOCS[7].text, score: 0.91 },
        { title: 'Claude in daily production use', text: DOCS[8].text, score: 0.87 }
      ],
      answer: 'Yes — agentic AI is his current day job. At American Express he builds LLM-powered agents with tool use and event-driven orchestration for fraud detection ' + cite(1) + ', including SharePoint-connected agents using MCP ' + cite(2) + '. He uses Claude daily to build, evaluate, and operate these production agent systems ' + cite(3) + '.'
    }
  };

  function route(q) {
    var s = ' ' + q.toLowerCase() + ' ';
    if (/evaluat|metric|test|benchmark|judge|measur|quality/.test(s)) return CANNED.eval;
    if (/rag|retriev|document|pinecone|faiss|chunk|search|knowledge/.test(s)) return CANNED.rag;
    if (/agent|tool|mcp|autonom|assistant|triage|fraud/.test(s)) return CANNED.agent;
    return null;
  }

  function genericResult(q) {
    var words = q.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(function (w) { return w.length > 3; });
    if (!words.length) return null;
    var scored = [];
    DOCS.forEach(function (d) {
      var score = 0;
      words.forEach(function (w) {
        for (var i = 0; i < d.keys.length; i++) {
          var k = d.keys[i];
          if (k.indexOf(w) > -1 || w.indexOf(k) > -1) { score++; break; }
        }
      });
      if (score > 0) scored.push({ doc: d, score: score });
    });
    scored.sort(function (a, b) { return b.score - a.score; });
    scored = scored.slice(0, 3);
    if (!scored.length) return null;
    var chunks = scored.map(function (x, i) {
      return { title: x.doc.title, text: x.doc.text, score: Math.min(0.92, 0.62 + x.score * 0.08 + (2 - i) * 0.02) };
    });
    var answer = 'Here is what the knowledge base has on that: ' + chunks.map(function (c, i) {
      return '<b>' + c.title + '</b> — ' + c.text + ' ' + cite(i + 1);
    }).join(' ') + ' For the full story, the case studies below go deeper.';
    return { chunks: chunks, answer: answer };
  }

  function setStage(n, state) {
    var el = document.querySelector('.demo-stage[data-stage="' + n + '"]');
    if (!el) return;
    el.classList.remove('active', 'done');
    if (state) el.classList.add(state);
  }

  function addChunk(c, i) {
    var div = document.createElement('div');
    div.className = 'demo-chunk';
    div.innerHTML = '<div class="demo-chunk-head"><span class="demo-chunk-title">[' + (i + 1) + '] ' + c.title + '</span>' +
      '<span class="demo-chunk-score">' + c.score.toFixed(2) + '</span></div>' +
      '<p>' + c.text + '</p><div class="demo-score-bar"><div class="demo-score-fill"></div></div>';
    chunksEl.appendChild(div);
    var fill = div.querySelector('.demo-score-fill');
    requestAnimationFrame(function () { requestAnimationFrame(function () { fill.style.width = Math.round(c.score * 100) + '%'; }); });
    return div;
  }

  function rerank(chunkEls, chunks) {
    var order = chunks.map(function (c, i) { return i; }).sort(function (a, b) { return chunks[b].score - chunks[a].score; });
    chunksEl.innerHTML = '';
    order.forEach(function (oi, rank) {
      var el = addChunk(chunks[oi], rank);
      if (rank === 0) el.classList.add('reranked');
    });
  }

  function answerHTML(body) {
    return '<span class="ans-label">Generated answer</span><p>' + body + '</p>';
  }

  function fallbackHTML() {
    return '<span class="ans-label">No strong match</span><p>That is not in this demo\u2019s canned knowledge base — try one of the sample questions above, or <a href="#contact">ask Pranay directly</a>.</p>';
  }

  async function run(q) {
    if (running) return;
    q = (q || '').trim();
    if (!q) { input.focus(); return; }
    running = true;
    askBtn.disabled = true;
    chunksEl.innerHTML = '';
    answerEl.innerHTML = '';
    [1, 2, 3, 4].forEach(function (n) { setStage(n, null); });

    setStage(1, 'active');
    await sleep(550);
    setStage(1, 'done');

    setStage(2, 'active');
    await sleep(350);
    var res = route(q) || genericResult(q);
    if (!res) {
      setStage(2, 'done'); setStage(3, 'done');
      setStage(4, 'active'); await sleep(400);
      answerEl.innerHTML = answerHTML(fallbackHTML().replace(/^<span class="ans-label">[^<]*<\/span>/, ''));
      answerEl.querySelector('.ans-label').textContent = 'No strong match';
      setStage(4, 'done');
      running = false; askBtn.disabled = false;
      return;
    }
    var els = [];
    for (var i = 0; i < res.chunks.length; i++) {
      els.push(addChunk(res.chunks[i], i));
      await sleep(420);
    }
    setStage(2, 'done');

    setStage(3, 'active');
    await sleep(550);
    rerank(els, res.chunks);
    await sleep(350);
    setStage(3, 'done');

    setStage(4, 'active');
    await sleep(650);
    answerEl.innerHTML = answerHTML(res.answer);
    setStage(4, 'done');

    running = false;
    askBtn.disabled = false;
  }

  askBtn.addEventListener('click', function () { run(input.value); });
  input.addEventListener('keydown', function (e) { if (e.key === 'Enter') run(input.value); });
  document.querySelectorAll('.demo-chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      input.value = chip.getAttribute('data-q');
      run(input.value);
    });
  });
})();

// ---------- Recruiter guided tour ----------
(function () {
  var btn = document.getElementById('tourBtn');
  if (!btn) return;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var stops = [
    { sel: '#top', title: 'Meet Pranay', text: 'Senior AI/ML Engineer — 7+ years of software engineering, 3+ years shipping production LLM systems in regulated finance. Currently open to Senior AI Engineer / AI-ML roles.' },
    { sel: '#demo', title: 'The centerpiece', text: 'A simulated RAG pipeline running in your browser. Ask it how he evaluates AI — retrieve, rerank, generate, all live.' },
    { sel: '#evaluate', title: 'How he evaluates AI', text: 'Groundedness, latency budgets, cost per query, guardrails, human review — the bar before anything ships to production.' },
    { sel: '#projects', title: 'Design-doc case studies', text: 'Three production systems with architecture diagrams, key tradeoffs, and honest results. Expand any case study.' },
    { sel: '#experience', title: 'The trajectory', text: 'American Express → Vanguard → HCLTech: fraud AI, document intelligence, fine-tuned LLMs, and full-stack foundations.' },
    { sel: '#contact', title: 'Reach him', text: 'Email, phone, WhatsApp, LinkedIn — replies usually within a day. Grab the resume on the way out.' }
  ];
  var idx = 0, timer = null, overlay = null, current = null, escHandler = null;

  function clearHighlight() {
    if (current) { current.classList.remove('tour-highlight'); current = null; }
  }
  function stopTimer() { if (timer) { clearTimeout(timer); timer = null; } }
  function restartTimer() { stopTimer(); timer = setTimeout(function () { show(idx + 1); }, 8000); }

  function show(i) {
    clearHighlight();
    idx = ((i % stops.length) + stops.length) % stops.length;
    var s = stops[idx];
    var el = document.querySelector(s.sel);
    if (el) {
      el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
      setTimeout(function () { el.classList.add('tour-highlight'); current = el; }, reduced ? 0 : 650);
    }
    if (!overlay) return;
    overlay.querySelector('.tour-progress').textContent = 'STOP ' + (idx + 1) + ' OF ' + stops.length;
    overlay.querySelector('.tour-title').textContent = s.title;
    overlay.querySelector('.tour-text').textContent = s.text;
    restartTimer();
  }

  function end() {
    stopTimer();
    clearHighlight();
    if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
    overlay = null;
    if (escHandler) { document.removeEventListener('keydown', escHandler); escHandler = null; }
    btn.focus();
  }

  function start() {
    if (overlay) { end(); return; }
    overlay = document.createElement('div');
    overlay.className = 'tour-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-label', 'Guided portfolio tour');
    overlay.innerHTML =
      '<p class="tour-progress"></p><p class="tour-title"></p><p class="tour-text"></p>' +
      '<div class="tour-controls">' +
      '<button class="btn" data-t="prev" type="button">\u2190 Back</button>' +
      '<button class="btn" data-t="next" type="button">Next \u2192</button>' +
      '<button class="btn tour-end" data-t="end" type="button">End tour</button>' +
      '</div>';
    document.body.appendChild(overlay);
    overlay.addEventListener('click', function (e) {
      var t = e.target && e.target.getAttribute ? e.target.getAttribute('data-t') : null;
      if (t === 'next') show(idx + 1);
      else if (t === 'prev') show(idx - 1);
      else if (t === 'end') end();
    });
    escHandler = function (e) { if (e.key === 'Escape') end(); };
    document.addEventListener('keydown', escHandler);
    show(0);
  }

  btn.addEventListener('click', start);
})();

// ---------- Neural-network canvas hero ----------
(function () {
  var canvas = document.getElementById('netCanvas');
  if (!canvas || !canvas.getContext) return;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ctx = canvas.getContext('2d');
  var W = 0, H = 0, nodes = [], raf = null, running = false;
  var mouse = { x: -9999, y: -9999 };
  var COLORS = ['139,92,246', '34,211,238', '244,114,182'];
  var LINK = 130, REPEL = 150;

  function resize() {
    var r = canvas.parentElement.getBoundingClientRect();
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = r.width; H = r.height;
    canvas.width = Math.floor(W * dpr); canvas.height = Math.floor(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var count = Math.min(80, Math.max(28, Math.floor(W * H / 24000)));
    nodes = [];
    for (var i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
        c: COLORS[i % 3], r: 1.4 + Math.random() * 1.8
      });
    }
  }

  function drawFrame() {
    ctx.clearRect(0, 0, W, H);
    var i, j, n, dx, dy, d;
    for (i = 0; i < nodes.length; i++) {
      n = nodes[i];
      dx = n.x - mouse.x; dy = n.y - mouse.y; d = Math.sqrt(dx * dx + dy * dy);
      if (d < REPEL && d > 0.1) { n.vx += (dx / d) * 0.06; n.vy += (dy / d) * 0.06; }
      n.vx *= 0.985; n.vy *= 0.985;
      // keep a minimum drift so nodes never freeze
      if (Math.abs(n.vx) < 0.08) n.vx += (Math.random() - 0.5) * 0.02;
      if (Math.abs(n.vy) < 0.08) n.vy += (Math.random() - 0.5) * 0.02;
      n.x += n.vx; n.y += n.vy;
      if (n.x < -10) n.x = W + 10; if (n.x > W + 10) n.x = -10;
      if (n.y < -10) n.y = H + 10; if (n.y > H + 10) n.y = -10;
    }
    for (i = 0; i < nodes.length; i++) {
      for (j = i + 1; j < nodes.length; j++) {
        dx = nodes[i].x - nodes[j].x; dy = nodes[i].y - nodes[j].y;
        d = Math.sqrt(dx * dx + dy * dy);
        if (d < LINK) {
          ctx.strokeStyle = 'rgba(' + nodes[i].c + ',' + ((1 - d / LINK) * 0.32).toFixed(3) + ')';
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); ctx.stroke();
        }
      }
    }
    for (i = 0; i < nodes.length; i++) {
      n = nodes[i];
      ctx.fillStyle = 'rgba(' + n.c + ',0.9)';
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill();
    }
  }

  function loop() {
    if (!document.hidden) drawFrame();
    raf = requestAnimationFrame(loop);
  }

  function start() { if (!running) { running = true; loop(); } }
  function stop() { running = false; if (raf) cancelAnimationFrame(raf); raf = null; }

  document.addEventListener('visibilitychange', function () {
    if (reduced) return;
    if (document.hidden) stop(); else start();
  });
  canvas.parentElement.addEventListener('mousemove', function (e) {
    var r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
  }, { passive: true });
  canvas.parentElement.addEventListener('mouseleave', function () { mouse.x = -9999; mouse.y = -9999; }, { passive: true });
  window.addEventListener('resize', resize);

  resize();
  if (reduced) { drawFrame(); } else { start(); }
})();

// ---------- Cursor glow (desktop only) ----------
(function () {
  if (!window.matchMedia('(pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var g = document.createElement('div');
  g.id = 'cursorGlow';
  g.setAttribute('aria-hidden', 'true');
  document.body.appendChild(g);
  var tx = window.innerWidth / 2, ty = window.innerHeight / 2, x = tx, y = ty;
  window.addEventListener('mousemove', function (e) { tx = e.clientX; ty = e.clientY; }, { passive: true });
  (function follow() {
    x += (tx - x) * 0.12; y += (ty - y) * 0.12;
    g.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
    requestAnimationFrame(follow);
  })();
})();

// ---------- Interactive terminal ----------
(function () {
  var card = document.getElementById('terminalCard');
  var body = document.getElementById('termBody');
  var input = document.getElementById('termInput');
  if (!card || !body || !input) return;
  var hist = [], hi = 0;

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function print(html, cls) {
    var d = document.createElement('div');
    d.className = 'term-line' + (cls ? ' ' + cls : '');
    d.innerHTML = html;
    body.appendChild(d);
    body.scrollTop = body.scrollHeight;
  }
  function echo(raw) {
    print('<span class="term-prompt">pranay@portfolio:~$</span> ' + esc(raw));
  }

  var CMDS = {
    'help': function () {
      return 'Available commands:<br>' +
        '&nbsp;&nbsp;<span class="term-hl">whoami</span> — one-line intro<br>' +
        '&nbsp;&nbsp;<span class="term-hl">skills</span> — top of the stack<br>' +
        '&nbsp;&nbsp;<span class="term-hl">experience</span> — where he has worked<br>' +
        '&nbsp;&nbsp;<span class="term-hl">projects</span> — flagship AI systems<br>' +
        '&nbsp;&nbsp;<span class="term-hl">eval</span> — how he evaluates AI<br>' +
        '&nbsp;&nbsp;<span class="term-hl">contact</span> — reach him<br>' +
        '&nbsp;&nbsp;<span class="term-hl">open resume</span> — download the PDF<br>' +
        '&nbsp;&nbsp;<span class="term-hl">clear</span> — wipe the screen<br>' +
        'Psst: try <span class="term-hl">sudo hire pranay</span>';
    },
    'whoami': function () {
      return 'Pranay Tharala — Senior AI/ML Engineer. 7+ yrs building production ML &amp; GenAI systems (RAG, agentic AI, LoRA/QLoRA) in regulated financial services. Currently open to Senior AI Engineer / AI-ML roles.';
    },
    'skills': function () {
      return 'Python · FastAPI · LangChain · RAG (Pinecone, FAISS) · Agentic AI &amp; tool use · LoRA/QLoRA fine-tuning · MCP · Claude (daily, production) · XGBoost · MLOps (MLflow, Airflow) · AWS / GCP / Azure';
    },
    'experience': function () {
      return 'Senior AI Engineer — American Express (Mar 2026–present)<br>' +
        'AI/ML Engineer — Vanguard (Sep 2023–Mar 2026)<br>' +
        'Software Engineer — HCLTech (Jul 2019–Jul 2023)';
    },
    'projects': function () {
      return '1. Fraud-Detection Virtual Assistant (Amex) — agentic alert triage<br>' +
        '2. Enterprise Document-Intelligence RAG Assistant (Vanguard) — cited Q&amp;A<br>' +
        '3. Fine-Tuned Financial-Domain LLM (Vanguard) — LoRA/QLoRA<br>' +
        'Full writeups in the <span class="term-hl">Selected work</span> section below.';
    },
    'eval': function () {
      return 'His production bar: groundedness &amp; citations → latency budgets (p50/p95) → cost per query → guardrails → human review. No citation, no ship.';
    },
    'contact': function () {
      return 'Email: <span class="term-hl">t.pranaytharala@gmail.com</span><br>' +
        'Phone/WhatsApp: <span class="term-hl">(201) 268-9549</span><br>' +
        'LinkedIn: <span class="term-hl">linkedin.com/in/pranay-t-35157035b</span>';
    },
    'open resume': function () {
      window.open('assets/Pranay_Tharala_Resume.pdf', '_blank', 'noopener');
      return 'Opening resume PDF in a new tab…';
    },
    'sudo hire pranay': function () {
      return '<span class="term-ok">[sudo] permission granted.</span> 🎉<br>' +
        'Offer letter not included — email <span class="term-hl">t.pranaytharala@gmail.com</span> to complete the hire.';
    }
  };

  function run(raw) {
    var cmd = raw.trim().toLowerCase().replace(/\s+/g, ' ');
    echo(raw);
    if (!cmd) return;
    if (cmd === 'clear') { body.innerHTML = ''; return; }
    if (CMDS[cmd]) { print(CMDS[cmd]()); }
    else { print('command not found: ' + esc(cmd) + ' — try <span class="term-hl">help</span>', 'term-err'); }
  }

  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      var v = input.value;
      hist.push(v); hi = hist.length;
      run(v); input.value = '';
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (hi > 0) { hi--; input.value = hist[hi] || ''; }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (hi < hist.length - 1) { hi++; input.value = hist[hi] || ''; }
      else { hi = hist.length; input.value = ''; }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      var v = input.value.toLowerCase();
      var names = Object.keys(CMDS).concat(['clear']);
      var m = names.filter(function (n) { return n.indexOf(v) === 0; });
      if (m.length === 1) input.value = m[0];
      else if (m.length > 1) print(m.join(' &nbsp;&nbsp; '));
    }
  });
  card.addEventListener('click', function () { input.focus(); });
  print('Welcome to pranay@portfolio — type <span class="term-hl">help</span> to explore. <span class="term-prompt">▊</span>');
})();

// ---------- AI assistant ("Ask Pranay's AI") ----------
(function () {
  var fab = document.getElementById('chatFab');
  var panel = document.getElementById('chatPanel');
  var msgs = document.getElementById('chatMsgs');
  var input = document.getElementById('chatInput');
  var sendBtn = document.getElementById('chatSend');
  var chips = document.getElementById('chatChips');
  var closeBtn = document.getElementById('chatClose');
  if (!fab || !panel) return;

  var EMAIL = 't.pranaytharala@gmail.com';
  var KB = [
    { k: ['skill', 'stack', 'tool', 'good at', 'expertise', 'technology', 'technologies', 'language'],
      a: '<b>Top skills:</b> Python, FastAPI, LangChain, RAG pipelines (Pinecone, FAISS), agentic AI with tool use, LoRA/QLoRA fine-tuning, MCP, Claude (daily production use), XGBoost, MLOps (MLflow, Airflow), AWS / GCP / Azure.<span class="src">Source: Skills section</span>' },
    { k: ['experience', 'work', 'job', 'company', 'career', 'background', 'where has', 'worked'],
      a: '<b>Experience:</b><br>• Senior AI Engineer @ <b>American Express</b> (Mar 2026–present) — agentic fraud detection, RAG/document intelligence<br>• AI/ML Engineer @ <b>Vanguard</b> (Sep 2023–Mar 2026) — document-intelligence RAG, LoRA/QLoRA fine-tuning<br>• Software Engineer @ <b>HCLTech</b> (Jul 2019–Jul 2023) — Java/Spring Boot, Angular<span class="src">Source: Experience section</span>' },
    { k: ['project'],
      a: '<b>Flagship systems:</b><br>1. Fraud-Detection Virtual Assistant (Amex) — agentic alert triage<br>2. Enterprise Document-Intelligence RAG Assistant (Vanguard) — cited Q&amp;A over fund docs<br>3. Fine-Tuned Financial-Domain LLM (Vanguard) — LoRA/QLoRA<br>Each has a full design-doc writeup in the Selected work section.<span class="src">Source: Projects section</span>' },
    { k: ['education', 'degree', 'college', 'university', 'study', 'studied', 'school', 'master', 'bachelor'],
      a: '<b>Education:</b> Master\u2019s in Information Technology — St. Francis College; BCA — SASTRA University.<span class="src">Source: Education section</span>' },
    { k: ['contact', 'email', 'phone', 'reach', 'hire', 'hiring', 'whatsapp', 'linkedin', 'touch', 'call', 'message'],
      a: '<b>Contact him:</b><br>• Email: ' + EMAIL + '<br>• Phone/WhatsApp: (201) 268-9549<br>• LinkedIn: linkedin.com/in/pranay-t-35157035b<br>Replies usually go out within a day.<span class="src">Source: Contact section</span>' },
    { k: ['open to', 'looking for', 'available', 'opportunity', 'opportunities', 'role', 'roles', 'job search', 'seeking'],
      a: 'Yes — he\u2019s currently <b>open to Senior AI Engineer / AI-ML roles</b> (full-time, hybrid or remote, US).<span class="src">Source: homepage banner</span>' },
    { k: ['visa', 'sponsor', 'sponsorship', 'authorized', 'authorization', 'opt', 'ead', 'h4', 'h1b', 'work permit', 'eligible', 'citizen'],
      a: 'He\u2019s on <b>F-1 OPT EAD</b> and converting to <b>H4 EAD</b> soon — <b>no sponsorship needed now or in the future</b>.<span class="src">Source: FAQ</span>' },
    { k: ['who is', 'about', 'introduce', 'himself', 'summary', 'overview'],
      a: 'Pranay Tharala is a <b>Senior AI/ML Engineer</b> with 7+ years building production ML &amp; GenAI systems — RAG pipelines, agentic AI, LoRA/QLoRA fine-tuning — shipped at American Express and Vanguard in regulated financial services.<span class="src">Source: homepage</span>' },
    { k: ['eval', 'test', 'quality', 'production bar', 'measure'],
      a: 'His production bar: <b>groundedness &amp; citations → latency budgets (p50/p95) → cost per query → guardrails → human review</b>. No citation, no ship.<span class="src">Source: How I evaluate AI</span>' },
    { k: ['resume', 'cv'],
      a: 'Grab it with the <b>Download Resume</b> button in the nav — it\u2019s his latest PDF.<span class="src">Source: this site</span>' },
    { k: ['salary', 'pay', 'rate', 'compensation', 'money'],
      a: 'I don\u2019t have his compensation details — email him at ' + EMAIL + ' and he\u2019ll talk numbers.' },
    { k: ['hello', 'hi', 'hey', 'yo', 'sup'],
      a: 'Hey! I can tell you about Pranay\u2019s skills, experience, projects, education, work authorization, or how to contact him. What\u2019s on your mind?' },
    { k: ['thank', 'thanks', 'thx'],
      a: 'Anytime! If you want the full story, the case studies in Selected work are worth the read.' }
  ];
  var FALLBACK = 'I only know what\u2019s on this site — try asking about his <b>skills</b>, <b>experience</b>, <b>projects</b>, <b>education</b>, or <b>contact</b>. Or email him directly at ' + EMAIL + '.';

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  function addMsg(html, who) {
    var d = document.createElement('div');
    d.className = 'chat-msg ' + who;
    if (who === 'user') d.textContent = html;
    else d.innerHTML = html;
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
    return d;
  }

  function answer(q) {
    var t = q.toLowerCase();
    var best = null, bestScore = 0;
    KB.forEach(function (entry) {
      var score = 0;
      entry.k.forEach(function (kw) { if (t.indexOf(kw) !== -1) score += kw.length; });
      if (score > bestScore) { bestScore = score; best = entry; }
    });
    return best ? best.a : FALLBACK;
  }

  function ask(q) {
    if (!q || !q.trim()) return;
    addMsg(q.trim(), 'user');
    input.value = '';
    var typing = addMsg('<span class="chat-typing"><span></span><span></span><span></span></span>', 'bot');
    setTimeout(function () {
      typing.innerHTML = answer(q);
      msgs.scrollTop = msgs.scrollHeight;
    }, 650);
  }

  function open() {
    panel.hidden = false;
    fab.setAttribute('aria-expanded', 'true');
    if (!msgs.children.length) {
      addMsg('Hey, I\u2019m Pranay\u2019s on-page AI. Ask me about his experience, skills, projects — anything on this site.', 'bot');
    }
    setTimeout(function () { input.focus(); }, 60);
  }
  function close() {
    panel.hidden = true;
    fab.setAttribute('aria-expanded', 'false');
    fab.focus();
  }

  fab.addEventListener('click', function () { panel.hidden ? open() : close(); });
  closeBtn.addEventListener('click', close);
  sendBtn.addEventListener('click', function () { ask(input.value); });
  input.addEventListener('keydown', function (e) { if (e.key === 'Enter') ask(input.value); });
  chips.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-q]');
    if (b) ask(b.getAttribute('data-q'));
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !panel.hidden) close();
  });

  // expose for command palette
  window.__openChat = open;
})();

// ---------- Command palette (Ctrl/Cmd+K) ----------
(function () {
  var root = document.getElementById('cmdk');
  var input = document.getElementById('cmdkInput');
  var list = document.getElementById('cmdkList');
  var hint = document.getElementById('cmdkHint');
  if (!root || !input || !list) return;

  function scrollToId(id) {
    var el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  function toast(msg) {
    var t = document.createElement('div');
    t.className = 'toast'; t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(function () { t.classList.add('show'); });
    setTimeout(function () { t.classList.remove('show'); setTimeout(function () { t.remove(); }, 300); }, 2200);
  }

  var ITEMS = [
    { t: 'Ask Pranay\u2019s AI', kind: 'action', run: function () { if (window.__openChat) window.__openChat(); } },
    { t: 'Take the 2-minute tour', kind: 'action', run: function () { var b = document.getElementById('tourBtn'); if (b) b.click(); } },
    { t: 'Open the terminal', kind: 'go', run: function () { scrollToId('terminalCard'); setTimeout(function () { var i = document.getElementById('termInput'); if (i) i.focus({ preventScroll: true }); }, 600); } },
    { t: 'Go to interactive RAG demo', kind: 'go', run: function () { scrollToId('demo'); } },
    { t: 'Go to selected work / case studies', kind: 'go', run: function () { scrollToId('projects'); } },
    { t: 'Go to experience', kind: 'go', run: function () { scrollToId('experience'); } },
    { t: 'Go to skills', kind: 'go', run: function () { scrollToId('skills'); } },
    { t: 'Go to how I evaluate AI', kind: 'go', run: function () { scrollToId('evaluate'); } },
    { t: 'Go to contact', kind: 'go', run: function () { scrollToId('contact'); } },
    { t: 'Download resume (PDF)', kind: 'action', run: function () { var a = document.createElement('a'); a.href = 'assets/Pranay_Tharala_Resume.pdf'; a.download = 'Pranay_Tharala_Resume.pdf'; document.body.appendChild(a); a.click(); a.remove(); } },
    { t: 'Open LinkedIn profile', kind: 'action', run: function () { window.open('https://www.linkedin.com/in/pranay-t-35157035b', '_blank', 'noopener'); } },
    { t: 'Copy email address', kind: 'action', run: function () {
        var email = 't.pranaytharala@gmail.com';
        function done() { toast('Email copied to clipboard'); }
        if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(email).then(done, function () { toast(email); }); }
        else { toast(email); }
      } }
  ];

  var filtered = ITEMS.slice(), active = 0;

  function fuzzyMatch(q, text) {
    q = q.toLowerCase(); text = text.toLowerCase();
    if (!q) return true;
    var qi = 0;
    for (var i = 0; i < text.length && qi < q.length; i++) {
      if (text[i] === q[qi]) qi++;
    }
    return qi === q.length;
  }

  function render() {
    list.innerHTML = '';
    if (!filtered.length) {
      var e = document.createElement('div');
      e.className = 'cmdk-empty';
      e.textContent = 'No matches — try "demo", "resume", or "tour".';
      list.appendChild(e);
      return;
    }
    filtered.forEach(function (item, i) {
      var li = document.createElement('li');
      li.setAttribute('role', 'option');
      li.setAttribute('data-kind', item.kind);
      li.setAttribute('aria-selected', i === active ? 'true' : 'false');
      if (i === active) li.classList.add('active');
      var k = document.createElement('span');
      k.className = 'cmdk-kind'; k.textContent = item.kind;
      li.appendChild(k);
      li.appendChild(document.createTextNode(item.t));
      li.addEventListener('click', function () { choose(i); });
      li.addEventListener('mousemove', function () { if (active !== i) { active = i; render(); } });
      list.appendChild(li);
    });
  }

  function choose(i) {
    var item = filtered[i];
    close();
    if (item) setTimeout(function () { item.run(); }, 60);
  }

  function open() {
    root.hidden = false;
    input.value = '';
    filtered = ITEMS.slice(); active = 0;
    render();
    setTimeout(function () { input.focus(); }, 40);
  }
  function close() { root.hidden = true; }

  input.addEventListener('input', function () {
    var q = input.value.trim();
    filtered = ITEMS.filter(function (item) { return fuzzyMatch(q, item.t); });
    active = 0;
    render();
  });
  input.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); if (filtered.length) { active = (active + 1) % filtered.length; render(); } }
    else if (e.key === 'ArrowUp') { e.preventDefault(); if (filtered.length) { active = (active + filtered.length - 1) % filtered.length; render(); } }
    else if (e.key === 'Enter') { e.preventDefault(); choose(active); }
    else if (e.key === 'Escape') { close(); }
  });
  root.addEventListener('click', function (e) { if (e.target === root) close(); });
  document.addEventListener('keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); root.hidden ? open() : close(); }
    else if (e.key === 'Escape' && !root.hidden) close();
  });
  if (hint) hint.addEventListener('click', open);
})();
