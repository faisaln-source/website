/* ===========================
   MAKEWISE - APP.JS (OPTIMIZED ENGINE)
   =========================== */

'use strict';

// Reduced motion preference check
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isDesktopPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

// ===== 1. HIGH-PERFORMANCE INTERACTIVE PARTICLE CANVAS =====
const canvas = document.getElementById('bg-canvas');
let ctx = canvas ? canvas.getContext('2d') : null;
let particles = [];
let mouse = { x: -1000, y: -1000, radius: 130 };
let primaryRGB = [212, 175, 55];
let secondaryRGB = [245, 158, 11];
let isCanvasVisible = true;
let canvasAnimId = null;

function getThemeRGB(varName, fallback) {
  const val = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  if (!val) return fallback;
  const parts = val.split(',').map(n => parseInt(n.trim(), 10));
  return parts.length === 3 && !parts.some(isNaN) ? parts : fallback;
}

function updateCanvasThemeColors() {
  primaryRGB = getThemeRGB('--primary-rgb', [59, 130, 246]);
  secondaryRGB = getThemeRGB('--secondary-rgb', [56, 189, 248]);
}

function resizeCanvas() {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initParticles();
}

function initParticles() {
  if (!canvas) return;
  particles = [];
  const isMobile = window.innerWidth < 768;
  const particleCount = isMobile ? 20 : Math.min(Math.max(Math.floor((canvas.width * canvas.height) / 24000), 28), 55);

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      size: Math.random() * 1.8 + 1,
      baseAlpha: Math.random() * 0.35 + 0.18,
      useSecondary: Math.random() > 0.5
    });
  }
}

function renderCanvas() {
  if (!ctx || !canvas || !isCanvasVisible || document.hidden || prefersReducedMotion) {
    canvasAnimId = null;
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const pLen = particles.length;
  // Connection line threshold: 105px, threshold squared = 11025
  const maxDist = 105;
  const maxDistSq = 11025;

  for (let i = 0; i < pLen; i++) {
    const pi = particles[i];
    for (let j = i + 1; j < pLen; j++) {
      const pj = particles[j];
      const dx = pi.x - pj.x;
      const dy = pi.y - pj.y;
      const distSq = dx * dx + dy * dy;

      // Avoid Math.sqrt unless particles are within threshold
      if (distSq < maxDistSq) {
        const dist = Math.sqrt(distSq);
        const alpha = (1 - dist / maxDist) * 0.2;
        ctx.strokeStyle = `rgba(${primaryRGB[0]}, ${primaryRGB[1]}, ${primaryRGB[2]}, ${alpha})`;
        ctx.lineWidth = 0.75;
        ctx.beginPath();
        ctx.moveTo(pi.x, pi.y);
        ctx.lineTo(pj.x, pj.y);
        ctx.stroke();
      }
    }
  }

  // Update and draw particles
  const mouseRadiusSq = 16900; // 130^2
  const hasMouse = mouse.x > 0;

  for (let i = 0; i < pLen; i++) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;

    // Bounce off edges
    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

    // Mouse gentle repulsion
    if (hasMouse) {
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const distSq = dx * dx + dy * dy;
      if (distSq < mouseRadiusSq && distSq > 0) {
        const dist = Math.sqrt(distSq);
        const force = (mouse.radius - dist) / mouse.radius;
        p.x += (dx / dist) * force * 1.4;
        p.y += (dy / dist) * force * 1.4;
      }
    }

    const rgb = p.useSecondary ? secondaryRGB : primaryRGB;
    ctx.fillStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${p.baseAlpha})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }

  canvasAnimId = requestAnimationFrame(renderCanvas);
}

function startCanvasLoop() {
  if (prefersReducedMotion || !canvas) return;
  if (!canvasAnimId && isCanvasVisible && !document.hidden) {
    canvasAnimId = requestAnimationFrame(renderCanvas);
  }
}

function stopCanvasLoop() {
  if (canvasAnimId) {
    cancelAnimationFrame(canvasAnimId);
    canvasAnimId = null;
  }
}

if (canvas && !prefersReducedMotion) {
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resizeCanvas, 150);
  }, { passive: true });

  if (isDesktopPointer) {
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      mouse.x = -1000;
      mouse.y = -1000;
    }, { passive: true });
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopCanvasLoop();
    } else {
      startCanvasLoop();
    }
  }, { passive: true });

  if ('IntersectionObserver' in window) {
    const canvasObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isCanvasVisible = entry.isIntersecting;
        if (isCanvasVisible) {
          startCanvasLoop();
        } else {
          stopCanvasLoop();
        }
      });
    }, { threshold: 0.05 });
    canvasObserver.observe(canvas);
  }

  updateCanvasThemeColors();
  resizeCanvas();
  startCanvasLoop();
}

// ===== 2. AMBIENT CURSOR GLOW FOLLOWER =====
const cursorGlow = document.getElementById('cursor-glow');
if (cursorGlow && isDesktopPointer && !prefersReducedMotion) {
  let cursorX = window.innerWidth / 2;
  let cursorY = window.innerHeight / 2;
  let targetX = cursorX;
  let targetY = cursorY;
  let glowTicking = false;

  function updateCursorGlow() {
    cursorX += (targetX - cursorX) * 0.16;
    cursorY += (targetY - cursorY) * 0.16;
    cursorGlow.style.left = `${cursorX}px`;
    cursorGlow.style.top = `${cursorY}px`;

    if (Math.abs(targetX - cursorX) > 0.4 || Math.abs(targetY - cursorY) > 0.4) {
      requestAnimationFrame(updateCursorGlow);
    } else {
      glowTicking = false;
    }
  }

  window.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
    if (!cursorGlow.classList.contains('active')) {
      cursorGlow.classList.add('active');
    }
    if (!glowTicking) {
      glowTicking = true;
      requestAnimationFrame(updateCursorGlow);
    }
  }, { passive: true });
}

// ===== 3. DYNAMIC ROTATING TEXT IN HERO =====
const rotatorText = document.getElementById('rotator-text');
if (rotatorText && !prefersReducedMotion) {
  const phrases = [
    'Built to Win Clients',
    'Delivered in Days',
    'Zero Agency Markup',
    '100% Source Ownership',
    'Live Demo Before Payment',
    'Fast, Clean & Scalable'
  ];
  let phraseIndex = 0;

  setInterval(() => {
    rotatorText.classList.remove('flip-in');
    rotatorText.classList.add('flip-out');

    setTimeout(() => {
      phraseIndex = (phraseIndex + 1) % phrases.length;
      rotatorText.textContent = phrases[phraseIndex];
      rotatorText.classList.remove('flip-out');
      rotatorText.classList.add('flip-in');
    }, 380);
  }, 2900);
}

// ===== 4. CARD SPOTLIGHT (DESKTOP ONLY) =====
if (isDesktopPointer && !prefersReducedMotion) {
  const spotlightCards = document.querySelectorAll('.about-card-main, .hero-float-pill');
  spotlightCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    }, { passive: true });
  });

  // ===== 5. MAGNETIC BUTTONS =====
  const magneticBtns = document.querySelectorAll('.btn-magnetic');
  magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px) scale(1.025)`;
    }, { passive: true });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    }, { passive: true });
  });
}

// ===== 6. NAVBAR SCROLL & ACTIVE LINK (THROTTLED) =====
const navbar = document.getElementById('navbar');
const navSections = Array.from(document.querySelectorAll('section[id]'));
const navLinkMap = new Map();
document.querySelectorAll('.nav-link').forEach(link => {
  const href = link.getAttribute('href');
  if (href && href.startsWith('#')) {
    navLinkMap.set(href.slice(1), link);
  }
});

let scrollTicking = false;
function onScroll() {
  if (navbar) {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // Update active nav link
  const scrollPos = window.scrollY + 140;
  for (let i = navSections.length - 1; i >= 0; i--) {
    const sec = navSections[i];
    if (scrollPos >= sec.offsetTop) {
      const id = sec.getAttribute('id');
      const activeLink = navLinkMap.get(id);
      if (activeLink && !activeLink.classList.contains('active')) {
        navLinkMap.forEach(l => l.classList.remove('active'));
        activeLink.classList.add('active');
      }
      break;
    }
  }
  scrollTicking = false;
}

window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    scrollTicking = true;
    requestAnimationFrame(onScroll);
  }
}, { passive: true });

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Close menu on link click
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

// ===== HARDWARE-ACCELERATED SCROLL REVEAL =====
if ('IntersectionObserver' in window && !prefersReducedMotion) {
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.value-item, .contact-item, .about-card-main').forEach((el, i) => {
    el.classList.add('reveal-item');
    el.style.transitionDelay = `${(i % 3) * 0.1}s`;
    revealObserver.observe(el);
  });
} else {
  document.querySelectorAll('.value-item, .contact-item, .about-card-main').forEach(el => {
    el.classList.add('visible');
  });
}

// ===== SMOOTH SCROLL FOR IN-PAGE ANCHORS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId && targetId !== '#') {
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = 76;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      }
    }
  });
});

// ===== BUDGET RANGE SLIDER & TYPED AMOUNT IN RUPEES =====
const budgetSlider = document.getElementById('contact-budget');
const budgetInput = document.getElementById('contact-budget-input');
const whatsappBtn = document.getElementById('btn-whatsapp-direct');

const MIN_BUDGET = 250;
const MAX_SLIDER = 150000;

function syncFromSlider() {
  if (!budgetSlider || !budgetInput) return;
  const val = parseInt(budgetSlider.value, 10) || MIN_BUDGET;
  budgetInput.value = val;
  updateSliderTrack(val);
  updateWhatsAppLink();
}

function syncFromInput() {
  if (!budgetSlider || !budgetInput) return;
  const raw = budgetInput.value.trim();
  if (!raw) {
    updateSliderTrack(MIN_BUDGET);
    updateWhatsAppLink();
    return;
  }
  const val = parseInt(raw, 10);
  if (isNaN(val)) return;

  const sliderVal = Math.min(Math.max(val, MIN_BUDGET), MAX_SLIDER);
  budgetSlider.value = sliderVal;
  updateSliderTrack(sliderVal);
  updateWhatsAppLink();
}

function updateSliderTrack(val) {
  if (!budgetSlider) return;
  const min = parseInt(budgetSlider.min, 10) || MIN_BUDGET;
  const max = parseInt(budgetSlider.max, 10) || MAX_SLIDER;
  const clamped = Math.min(Math.max(val, min), max);
  const percent = ((clamped - min) / (max - min)) * 100;
  budgetSlider.style.background = `linear-gradient(to right, var(--primary) 0%, var(--secondary) ${percent}%, rgba(255, 255, 255, 0.1) ${percent}%)`;
}

function handleInputBlur() {
  if (!budgetInput) return;
  let val = parseInt(budgetInput.value, 10);
  if (isNaN(val) || val < MIN_BUDGET) {
    val = MIN_BUDGET;
    budgetInput.value = val;
  }
  if (budgetSlider) {
    budgetSlider.value = Math.min(val, MAX_SLIDER);
    updateSliderTrack(budgetSlider.value);
  }
  updateWhatsAppLink();
}

function updateWhatsAppLink() {
  if (!whatsappBtn) return;
  const name = document.getElementById('contact-name')?.value.trim() || '';
  const service = document.getElementById('contact-service')?.value || '';
  const message = document.getElementById('contact-message')?.value.trim() || '';
  const numBudget = parseInt(budgetInput?.value, 10) || parseInt(budgetSlider?.value, 10) || 25000;
  const formattedBudget = numBudget.toLocaleString('en-IN');
  
  let msg = 'Hello MakeWise! I would like to inquire about your digital services.';
  if (name) msg += `\n• Name: ${name}`;
  if (service) msg += `\n• Service: ${service}`;
  msg += `\n• Budget: ₹${formattedBudget}`;
  if (message) msg += `\n• Details: ${message}`;
  
  whatsappBtn.href = `https://wa.me/917012080365?text=${encodeURIComponent(msg)}`;
}

if (budgetSlider && budgetInput) {
  budgetSlider.addEventListener('input', syncFromSlider);
  budgetInput.addEventListener('input', syncFromInput);
  budgetInput.addEventListener('blur', handleInputBlur);
  syncFromSlider();
}

['contact-name', 'contact-service', 'contact-message'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', updateWhatsAppLink);
});

// ===== CONTACT FORM AJAX SUBMISSION =====
const form = document.getElementById('contact-form');
const submitBtn = document.getElementById('form-submit-btn');
const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
const btnLoader = submitBtn ? submitBtn.querySelector('.btn-loader') : null;
const formSuccess = document.getElementById('form-success');

if (form && submitBtn) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const serviceInput = document.getElementById('contact-service');
    const messageInput = document.getElementById('contact-message');

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const service = serviceInput ? serviceInput.value : '';
    const message = messageInput ? messageInput.value.trim() : '';
    const numBudget = parseInt(budgetInput?.value, 10) || parseInt(budgetSlider?.value, 10) || 25000;
    const formattedBudget = '₹' + numBudget.toLocaleString('en-IN');

    if (!name || !email || !service || !message) {
      shakeForm();
      return;
    }
    if (!isValidEmail(email)) {
      if (emailInput) emailInput.style.borderColor = '#ef4444';
      return;
    }

    if (budgetInput && (parseInt(budgetInput.value, 10) < MIN_BUDGET || !budgetInput.value)) {
      budgetInput.value = MIN_BUDGET;
      syncFromInput();
    }

    if (btnText) btnText.style.display = 'none';
    if (btnLoader) btnLoader.style.display = 'block';
    submitBtn.disabled = true;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    try {
      const response = await fetch('https://formsubmit.co/ajax/makewisedigitalsolution@gmail.com', {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `New MakeWise Inquiry: ${service} from ${name}`,
          _template: 'table',
          _captcha: 'false',
          Name: name,
          Email: email,
          Service: service,
          Budget: formattedBudget,
          Message: message
        })
      });
      clearTimeout(timeoutId);

      const result = await response.json().catch(() => ({}));
      if (result.message && result.message.includes('Activation')) {
        showSubmissionSuccess(name, 'activation');
      } else {
        showSubmissionSuccess(name, 'success');
      }
    } catch (err) {
      clearTimeout(timeoutId);
      showSubmissionSuccess(name, 'fallback', { email, service, formattedBudget, message });
    } finally {
      if (btnText) btnText.style.display = 'flex';
      if (btnLoader) btnLoader.style.display = 'none';
      submitBtn.disabled = false;
    }
  });
}

function showSubmissionSuccess(name, status = 'success', data = null) {
  if (!formSuccess) return;

  if (status === 'activation') {
    formSuccess.innerHTML = `
      <div style="text-align:center;">
        <p style="font-weight:700; font-size:1.05rem; margin-bottom:6px;">&#9989; Thank you, <strong>${name}</strong>! Your inquiry was sent.</p>
        <p style="font-size:0.86rem; color:#94a3b8; line-height:1.5;">Notice for MakeWise Admin: FormSubmit has sent a 1-click activation link to <strong>makewisedigitalsolution@gmail.com</strong>. Please check your inbox and click it once to activate automatic email forwarding.</p>
      </div>
    `;
  } else if (status === 'fallback') {
    const waText = encodeURIComponent(`Hi MakeWise, I am ${name}. I just submitted an inquiry on your website:\nService: ${data?.service || ''}\nBudget: ${data?.formattedBudget || ''}\nEmail: ${data?.email || ''}\nMessage: ${data?.message || ''}`);
    formSuccess.innerHTML = `
      <div style="text-align:center;">
        <p style="font-weight:700; font-size:1.05rem; margin-bottom:6px;">&#9989; Message Received from <strong>${name}</strong>!</p>
        <p style="font-size:0.88rem; color:#94a3b8; margin-bottom:12px;">We will contact you at <strong>${data?.email || 'your email'}</strong> within 24 hours.</p>
        <a href="https://wa.me/917012080365?text=${waText}" target="_blank" rel="noopener" class="btn btn-whatsapp" style="display:inline-flex; padding:8px 18px; font-size:0.85rem; border-radius:100px; text-decoration:none;">
          <span>&#128172; Or Connect Directly on WhatsApp &rarr;</span>
        </a>
      </div>
    `;
  } else {
    formSuccess.innerHTML = `&#9989; Thank you <strong>${name}</strong>! Your inquiry has been sent directly to <strong>makewisedigitalsolution@gmail.com</strong>. We will contact you within 24 hours.`;
  }
  formSuccess.style.display = 'block';
  if (form) form.reset();
  if (budgetInput && budgetSlider) {
    budgetInput.value = 25000;
    budgetSlider.value = 25000;
    updateSliderTrack(25000);
    updateWhatsAppLink();
  }
  setTimeout(() => { formSuccess.style.display = 'none'; }, 9000);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function shakeForm() {
  if (!form) return;
  form.classList.remove('shake');
  void form.offsetWidth; // Force reflow
  form.classList.add('shake');
  setTimeout(() => { form.classList.remove('shake'); }, 400);
}

// Reset invalid border styling on focus
document.querySelectorAll('.form-group input, .form-group textarea, .form-group select').forEach(input => {
  input.addEventListener('focus', () => {
    input.style.borderColor = '';
  }, { passive: true });
});

// Legacy theme cleanup
try {
  localStorage.removeItem('makewise-gold-theme');
} catch (e) {}

// ===== 7. HERO INTERACTIVE SCOPE CONFIGURATOR =====
const configData = {
  resume: {
    cat: "Resume Solution",
    title: "ATS Resume",
    summary: "Engineered to pass employer Applicant Tracking Systems (ATS) with targeted industry keywords, crisp typography, and recruiter-focused achievement formatting.",
    deliverables: [
      "Guaranteed ATS-Friendly Parsing & Formatting",
      "Role-Specific Keyword & Skill Mapping",
      "Dual Formats: Editable DOCX + Clean PDF",
      "Targeted Executive Cover Letter Included"
    ],
    price: "₹250",
    time: "⏱ 24–48h Turnaround"
  },
  portfolio: {
    cat: "Portfolio Design",
    title: "Personal & Developer Showcase Portfolio",
    summary: "High-speed, conversion-oriented personal website designed for software engineers, designers, and professionals to showcase live projects and skills.",
    deliverables: [
      "Interactive Project Showcase & Live Demos",
      "GitHub API / Tech Stack Badges Integration",
      "Blazing 99+ Lighthouse Speed Score",
      "Custom Domain Setup & Free Cloud Hosting"
    ],
    price: "₹1,500+",
    time: "⏱ 3–5 Days Delivery"
  },
  website: {
    cat: "Website Development",
    title: "High-Converting Business & E-Commerce Website",
    summary: "Bespoke corporate website or online store built to establish industry authority, rank on Google, and seamlessly convert visitors into paying clients.",
    deliverables: [
      "Custom Responsive UI/UX (Desktop, Tablet, Mobile)",
      "On-Page Technical SEO & Search Console Setup",
      "Direct WhatsApp Chat & Lead Capture Forms",
      "Integrated Payment Gateways (Stripe, Razorpay, UPI)"
    ],
    price: "₹3,500+",
    time: "⏱ 5–7 Days Delivery"
  },
  webapp: {
    cat: "Web Application",
    title: "Custom SaaS & Web Platform MVP",
    summary: "Scalable full-stack web applications with authentication, structured database architecture, REST/GraphQL APIs, and polished administrative workflows.",
    deliverables: [
      "Secure User Authentication & Role Access Control",
      "Database Design (PostgreSQL / Supabase / MongoDB)",
      "Modern Frontend (React / Next.js) with Responsive UI",
      "Production Cloud Deployment & Environment Setup"
    ],
    price: "₹8,000+",
    time: "⏱ 1–2 Weeks Delivery"
  },
  pos: {
    cat: "POS Software",
    title: "Point of Sale (POS) Billing & Inventory System",
    summary: "Production-ready Point-of-Sale billing software tailored for retail shops, restaurants, and cloud kitchens with barcode scanning, thermal printing, and stock tracking.",
    deliverables: [
      "High-Speed Thermal Receipt Printing (USB / Bluetooth)",
      "Barcode Scanning & SKU Inventory Management",
      "Daily Sales, Profit/Loss & GST Tax Reports",
      "Multi-User Cashier Roles with Table / Order Mapping"
    ],
    price: "₹6,000+",
    time: "⏱ 1–2 Weeks Delivery"
  }
};

const cfgTabs = document.querySelectorAll('.config-tab');
const cfgCat = document.getElementById('cfg-cat');
const cfgTitle = document.getElementById('cfg-title');
const cfgSummary = document.getElementById('cfg-summary');
const cfgPrice = document.getElementById('cfg-price');
const cfgTime = document.getElementById('cfg-time');
const cfgDeliverables = document.getElementById('cfg-deliverables');
const cfgWhatsappBtn = document.getElementById('cfg-whatsapp-btn');
const cfgResultBox = document.getElementById('config-result-box');

if (cfgTabs.length > 0 && cfgResultBox) {
  cfgTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      cfgTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const sKey = tab.getAttribute('data-service');
      const data = configData[sKey];
      if (data) {
        if (cfgCat) cfgCat.textContent = data.cat;
        if (cfgTitle) cfgTitle.textContent = data.title;
        if (cfgSummary) cfgSummary.textContent = data.summary;
        if (cfgPrice) cfgPrice.textContent = data.price;
        if (cfgTime) cfgTime.textContent = data.time;

        if (cfgDeliverables) {
          cfgDeliverables.innerHTML = data.deliverables
            .map(d => `<li><span class="check-icon">&#10003;</span> ${d}</li>`)
            .join('');
        }

        if (cfgWhatsappBtn) {
          const encodedText = encodeURIComponent(`Hi MakeWise, I would like to inquire about the ${data.title} (Starting at ${data.price})`);
          cfgWhatsappBtn.href = `https://wa.me/917012080365?text=${encodedText}`;
        }
      }
    });
  });

  document.querySelectorAll('[data-select-service]').forEach(link => {
    link.addEventListener('click', () => {
      const sKey = link.getAttribute('data-select-service');
      const targetTab = document.querySelector(`.config-tab[data-service="${sKey}"]`);
      if (targetTab) {
        targetTab.click();
      }
    });
  });
}

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (e) => {
  if (e.key === 'Home') {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  }
});