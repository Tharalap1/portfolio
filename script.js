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
