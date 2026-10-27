/**
 * NexusAI - Core Platform Logic & Interactive Lab Engine
 * Includes: Neural Particle Background, Metric Counters, Real-World App Filters,
 * Interactive AI Simulation Terminal, Knowledge Acumen Quiz, and FAQs.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNeuralCanvas();
  initMetricCounters();
  initAppFilters();
  initAiSimulator();
  initQuiz();
  initAccordion();
  initNavbarAndScroll();
  initNewsletter();
});

/* ==========================================================================
   1. Interactive Neural Network Canvas Background
   ========================================================================== */
function initNeuralCanvas() {
  const canvas = document.getElementById('neuralCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const particleCount = Math.min(Math.floor((width * height) / 14000), 85);
  const maxDistance = 140;

  const mouse = {
    x: null,
    y: null,
    radius: 160
  };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.75;
      this.vy = (Math.random() - 0.5) * 0.75;
      this.radius = Math.random() * 1.8 + 1.2;
      this.color = Math.random() > 0.4 ? '#00f2fe' : '#a855f7';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse interactive reaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 1.5;
          this.y -= (dy / dist) * force * 1.5;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting synapses
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          const alpha = (1 - dist / maxDistance) * 0.28;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
          ctx.lineWidth = 0.9;
          ctx.stroke();
        }
      }
    }

    // Connect to mouse if active
    if (mouse.x !== null && mouse.y !== null) {
      for (let i = 0; i < particles.length; i++) {
        const dx = mouse.x - particles[i].x;
        const dy = mouse.y - particles[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const alpha = (1 - dist / mouse.radius) * 0.45;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      }
    }

    // Update and draw each particle
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================================
   2. Metric Counters Animation (IntersectionObserver)
   ========================================================================== */
function initMetricCounters() {
  const metricElements = document.querySelectorAll('.metric-num');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        metricElements.forEach(el => animateNumber(el));
      }
    });
  }, { threshold: 0.4 });

  const heroMetrics = document.querySelector('.hero-metrics');
  if (heroMetrics) {
    observer.observe(heroMetrics);
  }

  function animateNumber(element) {
    const target = parseFloat(element.getAttribute('data-target'));
    const prefix = element.getAttribute('data-prefix') || '';
    const suffix = element.getAttribute('data-suffix') || '';
    const isDecimal = target % 1 !== 0;
    const duration = 1800;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = (easeProgress * target);

      element.textContent = `${prefix}${isDecimal ? current.toFixed(1) : Math.floor(current)}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = `${prefix}${target}${suffix}`;
      }
    }

    requestAnimationFrame(update);
  }
}

/* ==========================================================================
   3. Application Categories Filter
   ========================================================================== */
function initAppFilters() {
  const filterBtns = document.querySelectorAll('#appFilterTabs .filter-btn');
  const appCards = document.querySelectorAll('#appsGrid .app-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      appCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 40);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* ==========================================================================
   4. Interactive AI Simulator Lab Engine
   ========================================================================== */
function initAiSimulator() {
  const taskButtons = document.querySelectorAll('.task-presets .preset-btn');
  const tempSlider = document.getElementById('tempSlider');
  const tempValue = document.getElementById('tempValue');
  const tokensSlider = document.getElementById('tokensSlider');
  const tokensValue = document.getElementById('tokensValue');
  const runBtn = document.getElementById('runSimulationBtn');
  const outputBody = document.getElementById('terminalOutput');
  const statusEl = document.getElementById('simStatus');
  const latencyEl = document.getElementById('simLatency');
  const confidenceVal = document.getElementById('confidenceVal');
  const confidenceBar = document.getElementById('confidenceBar');
  const safetyVal = document.getElementById('safetyVal');

  let currentTask = 'med';
  let isSimulating = false;

  // Task simulation datasets
  const taskData = {
    med: {
      name: "Medical Diagnostic Reasoning",
      prompt: "Multimodal MRI Scan + Patient Clinical Histopathology Telemetry",
      steps: [
        { type: "dim", text: "[00:00.012] Ingesting 2.4 GB DICOM volume array..." },
        { type: "log", text: "[00:00.048] Segmenting axial slices via 3D Swin-Transformer..." },
        { type: "log", text: "[00:00.082] Cross-referencing 45,000 peer-reviewed oncological cases..." },
        { type: "reasoning", text: "[00:00.120] Latent attention focused on temporal lobe micro-lesion (dim: 2.1mm)." },
        { type: "verdict", text: "[DIAGNOSIS]: Early-stage benign meningioma candidate (Confidence: 99.4%)." },
        { type: "highlight", text: "[ACTIONABLE]: Recommending automated 6-month contrast MRI schedule + perfusion review." }
      ],
      baseConfidence: 99.4
    },
    auto: {
      name: "Autonomous Vehicle Trajectory",
      prompt: "LIDAR Cloud + 360 Camera Sensor Fusion at 65 MPH (Dense Rain Scenario)",
      steps: [
        { type: "dim", text: "[00:00.004] Ingesting 1.8M point-cloud vertices from 128-beam LIDAR..." },
        { type: "log", text: "[00:00.018] Occupancy network calculates obstacle velocity vectors..." },
        { type: "reasoning", text: "[00:00.035] Detected pedestrian abruptly stepping off sidewalk at 24.3 meters." },
        { type: "verdict", text: "[PLANNER VERDICT]: Regenerating micro-trajectory: Gentle left evasion + 35% regenerative braking." },
        { type: "highlight", text: "[SYSTEM SAFETY]: Collision probability: 0.0001% • Actuator brake latency: 3.2ms." }
      ],
      baseConfidence: 99.8
    },
    fin: {
      name: "Financial Fraud Detection",
      prompt: "Cross-Border High-Velocity Transaction Graph Stream (150k TPS)",
      steps: [
        { type: "dim", text: "[00:00.008] Ingesting sub-graph cluster from 4 foreign routing nodes..." },
        { type: "log", text: "[00:00.022] GNN analyzing topological cycle patterns and proxy hopping..." },
        { type: "reasoning", text: "[00:00.060] Anomaly detected: Synthetic identity card linked to 14 distributed burner cards within 3 seconds." },
        { type: "verdict", text: "[FRAUD SHIELD TRIGGERED]: High-risk smurfing pattern recognized." },
        { type: "highlight", text: "[ACTION]: Account isolation flag set. $48,250 fund transfer quarantined under AML rule 4-B." }
      ],
      baseConfidence: 98.7
    },
    code: {
      name: "Autonomous Code Architect",
      prompt: "Full-Stack Refactor & Zero-Day Vulnerability Patch (Rust/TypeScript)",
      steps: [
        { type: "dim", text: "[00:00.015] Parsing Abstract Syntax Tree across 142 microservice modules..." },
        { type: "log", text: "[00:00.052] Identifying memory leak in concurrent async Tokio threadpool..." },
        { type: "reasoning", text: "[00:00.098] Constructing zero-copy Arc<RwLock> buffer wrapper to avoid contention." },
        { type: "verdict", text: "[COMPILATION SUCCESS]: All 318 integration test suites green." },
        { type: "highlight", text: "[OPTIMIZATION]: Memory footprint reduced by 44% • p99 throughput improved by 2.8x." }
      ],
      baseConfidence: 99.1
    }
  };

  // Switch task
  taskButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (isSimulating) return;
      taskButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTask = btn.getAttribute('data-task');
      displayReadyState();
    });
  });

  // Slider feedback
  if (tempSlider && tempValue) {
    tempSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value).toFixed(2);
      tempValue.textContent = val;
    });
  }

  if (tokensSlider && tokensValue) {
    tokensSlider.addEventListener('input', (e) => {
      tokensValue.textContent = `${e.target.value}k tokens`;
    });
  }

  function displayReadyState() {
    const data = taskData[currentTask];
    outputBody.innerHTML = `
      <p class="t-dim">// Task Benchmark Selected: ${data.name}</p>
      <p class="t-dim">// Payload: ${data.prompt}</p>
      <p class="t-highlight">&gt; System ready. Click "Execute Neural Inference" to begin streaming...</p>
    `;
    statusEl.textContent = 'ENGINE READY • STANDBY';
    latencyEl.textContent = 'LATENCY: 0.0ms';
  }

  if (runBtn) {
    runBtn.addEventListener('click', () => {
      if (isSimulating) return;
      executeSimulation();
    });
  }

  function executeSimulation() {
    isSimulating = true;
    runBtn.disabled = true;
    runBtn.style.opacity = '0.6';
    statusEl.textContent = 'COMPUTING TENSORS...';
    outputBody.innerHTML = '';

    const data = taskData[currentTask];
    const temp = parseFloat(tempSlider ? tempSlider.value : 0.2);
    const tokens = parseInt(tokensSlider ? tokensSlider.value : 32);

    // Compute realistic latency based on tokens
    const calculatedLatency = (tokens * 0.12 + Math.random() * 2.5).toFixed(1);
    latencyEl.textContent = `LATENCY: ${calculatedLatency}ms`;

    // Calculate confidence affected slightly by temperature
    const confidenceAdjusted = (data.baseConfidence - (temp * 1.8) + (Math.random() * 0.4)).toFixed(1);
    confidenceVal.textContent = `${confidenceAdjusted}%`;
    confidenceBar.style.width = `${confidenceAdjusted}%`;

    let stepIndex = 0;

    function streamNextStep() {
      if (stepIndex < data.steps.length) {
        const step = data.steps[stepIndex];
        const p = document.createElement('p');
        p.className = `t-${step.type}`;
        p.textContent = step.text;
        outputBody.appendChild(p);
        outputBody.scrollTop = outputBody.scrollHeight;

        stepIndex++;
        const nextDelay = 320 + Math.random() * 220;
        setTimeout(streamNextStep, nextDelay);
      } else {
        // Finished
        statusEl.textContent = 'INFERENCE FINISHED • 200 OK';
        isSimulating = false;
        runBtn.disabled = false;
        runBtn.style.opacity = '1';
        showToast(`Simulation Complete: ${data.name}`);
      }
    }

    streamNextStep();
  }
}

/* ==========================================================================
   5. Interactive Knowledge Acumen Quiz
   ========================================================================== */
function initQuiz() {
  const quizData = [
    {
      question: "What is the primary breakthrough mechanism that powers modern Large Language Models?",
      options: [
        "Multi-Head Self-Attention in Transformers",
        "Linear Regression with Gradient Descent",
        "Standard Relational SQL Indexing",
        "Hardcoded Rule-Based Heuristic Trees"
      ],
      correct: 0,
      feedback: "Correct! The Self-Attention mechanism allows models to weigh the contextual importance of all tokens across deep sequences."
    },
    {
      question: "Which of the following describes Artificial General Intelligence (AGI)?",
      options: [
        "A chess engine that beats grandmasters",
        "Systems capable of human-level adaptability across any cognitive domain",
        "A deep convolutional neural network for tumor detection",
        "An algorithmic high-frequency cryptocurrency trading bot"
      ],
      correct: 1,
      feedback: "Spot on! Unlike Narrow AI, AGI represents cross-domain cognitive flexibility and reasoning without bespoke task retraining."
    },
    {
      question: "What is the primary purpose of Retrieval-Augmented Generation (RAG)?",
      options: [
        "To compress the size of GPU memory physically",
        "To generate completely fictional creative hallucinations",
        "To ground language models with verifiable external real-time data",
        "To replace neural networks with static lookup tables"
      ],
      correct: 2,
      feedback: "Accurate! RAG retrieves relevant factual documents from vector databases to keep answers truthful and up to date."
    }
  ];

  let currentQuestion = 0;
  let score = 0;

  const quizStep = document.getElementById('quizStep');
  const quizQuestion = document.getElementById('quizQuestion');
  const quizOptions = document.getElementById('quizOptions');
  const quizFeedback = document.getElementById('quizFeedback');
  const quizProgress = document.getElementById('quizProgress');
  const quizCard = document.getElementById('quizCard');
  const quizScoreCard = document.getElementById('quizScoreCard');
  const scoreSummary = document.getElementById('scoreSummary');
  const restartBtn = document.getElementById('restartQuizBtn');

  if (!quizQuestion || !quizOptions) return;

  function loadQuestion() {
    const q = quizData[currentQuestion];
    quizStep.textContent = `QUESTION ${currentQuestion + 1} OF ${quizData.length}`;
    quizProgress.style.width = `${((currentQuestion + 1) / quizData.length) * 100}%`;
    quizQuestion.textContent = q.question;
    quizFeedback.className = 'quiz-feedback';
    quizFeedback.textContent = '';
    quizOptions.innerHTML = '';

    q.options.forEach((opt, index) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-opt-btn';
      btn.textContent = `${String.fromCharCode(65 + index)}) ${opt}`;
      btn.addEventListener('click', () => selectAnswer(index));
      quizOptions.appendChild(btn);
    });
  }

  function selectAnswer(selectedIndex) {
    const q = quizData[currentQuestion];
    const buttons = quizOptions.querySelectorAll('.quiz-opt-btn');

    buttons.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === q.correct) {
        btn.classList.add('correct');
      } else if (idx === selectedIndex) {
        btn.classList.add('wrong');
      }
    });

    if (selectedIndex === q.correct) {
      score++;
      quizFeedback.textContent = `✓ ${q.feedback}`;
      quizFeedback.className = 'quiz-feedback show success';
    } else {
      quizFeedback.textContent = `✗ Incorrect. ${q.feedback}`;
      quizFeedback.className = 'quiz-feedback show fail';
    }

    setTimeout(() => {
      currentQuestion++;
      if (currentQuestion < quizData.length) {
        loadQuestion();
      } else {
        showResults();
      }
    }, 2000);
  }

  function showResults() {
    quizCard.classList.add('hidden');
    quizScoreCard.classList.remove('hidden');
    scoreSummary.textContent = `You scored ${score} out of ${quizData.length} (${Math.round((score / quizData.length) * 100)}%)!`;
  }

  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      currentQuestion = 0;
      score = 0;
      quizScoreCard.classList.add('hidden');
      quizCard.classList.remove('hidden');
      loadQuestion();
    });
  }

  loadQuestion();
}

/* ==========================================================================
   6. FAQ Accordion Logic
   ========================================================================== */
function initAccordion() {
  const items = document.querySelectorAll('#faqAccordion .accordion-item');

  items.forEach(item => {
    const trigger = item.querySelector('.accordion-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close other items
      items.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });

      // Toggle current
      if (isActive) {
        item.classList.remove('active');
      } else {
        item.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   7. Navigation, Sticky Header & Scroll Spy
   ========================================================================== */
function initNavbarAndScroll() {
  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Header background blur on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Active link highlighting
    let currentSectionId = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      const height = sec.offsetHeight;
      if (window.scrollY >= top && window.scrollY < top + height) {
        currentSectionId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile drawer toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });

    // Close mobile menu on clicking any link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }
}

/* ==========================================================================
   8. Newsletter Subscription & Toast Dispatcher
   ========================================================================== */
function initNewsletter() {
  const form = document.getElementById('newsletterForm');
  const feedback = document.getElementById('formFeedback');
  const emailInput = document.getElementById('emailInput');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = emailInput.value.trim();
      if (email) {
        feedback.classList.remove('hidden');
        emailInput.value = '';
        showToast('Subscribed to the NexusAI Frontier briefing!');
        setTimeout(() => {
          feedback.classList.add('hidden');
        }, 5000);
      }
    });
  }
}

function showToast(message) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = `⚡ ${message}`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}
