/* ===========================
   MAKEWISE STUDIO - APP.JS (ALIVE & DYNAMIC ENGINE)
   =========================== */

// ===== 1. INTERACTIVE BACKGROUND PARTICLE CANVAS =====
const canvas = document.getElementById('bg-canvas');
let ctx = canvas ? canvas.getContext('2d') : null;
let particles = [];
let mouse = { x: -1000, y: -1000, radius: 140 };
let primaryRGB = [212, 175, 55];
let secondaryRGB = [245, 158, 11];

function getThemeRGB(varName, fallback) {
  const val = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  if (!val) return fallback;
  const parts = val.split(',').map(n => parseInt(n.trim(), 10));
  return parts.length === 3 && !parts.some(isNaN) ? parts : fallback;
}

function updateCanvasThemeColors() {
  primaryRGB = getThemeRGB('--primary-rgb', [139, 92, 246]);
  secondaryRGB = getThemeRGB('--secondary-rgb', [6, 182, 212]);
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
  const count = Math.floor((canvas.width * canvas.height) / 18000);
  const particleCount = Math.min(Math.max(count, 35), 90);
  
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      size: Math.random() * 2 + 1,
      baseAlpha: Math.random() * 0.4 + 0.2,
      useSecondary: Math.random() > 0.5
    });
  }
}

function renderCanvas() {
  if (!ctx || !canvas) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw connections
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 110) {
        const alpha = (1 - dist / 110) * 0.22;
        ctx.strokeStyle = `rgba(${primaryRGB[0]}, ${primaryRGB[1]}, ${primaryRGB[2]}, ${alpha})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }

  // Draw & update particles
  for (let p of particles) {
    p.x += p.vx;
    p.y += p.vy;

    // Boundary bounce
    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

    // Mouse gentle repulsion/magnetism
    const dx = p.x - mouse.x;
    const dy = p.y - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < mouse.radius && dist > 0) {
      const force = (mouse.radius - dist) / mouse.radius;
      p.x += (dx / dist) * force * 1.5;
      p.y += (dy / dist) * force * 1.5;
    }

    const rgb = p.useSecondary ? secondaryRGB : primaryRGB;
    ctx.fillStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${p.baseAlpha})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }

  requestAnimationFrame(renderCanvas);
}

if (canvas) {
  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });
  updateCanvasThemeColors();
  resizeCanvas();
  requestAnimationFrame(renderCanvas);
}

// ===== 2. AMBIENT CURSOR GLOW FOLLOWER =====
const cursorGlow = document.getElementById('cursor-glow');
let cursorX = window.innerWidth / 2;
let cursorY = window.innerHeight / 2;
let targetX = cursorX;
let targetY = cursorY;

if (cursorGlow && window.matchMedia('(hover: hover)').matches) {
  window.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
    cursorGlow.classList.add('active');
  });

  function updateCursorGlow() {
    cursorX += (targetX - cursorX) * 0.12;
    cursorY += (targetY - cursorY) * 0.12;
    cursorGlow.style.left = `${cursorX}px`;
    cursorGlow.style.top = `${cursorY}px`;
    requestAnimationFrame(updateCursorGlow);
  }
  requestAnimationFrame(updateCursorGlow);
}

// ===== 3. DYNAMIC ROTATING TEXT IN HERO =====
const rotatorText = document.getElementById('rotator-text');
if (rotatorText) {
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
  }, 2800);
}

// ===== 4. CARD SPOTLIGHT & 3D TILT =====
const tiltCards = document.querySelectorAll('.service-card, .portfolio-item, .about-card-main, .hero-float-pill, .saas-dashboard-card');

tiltCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Update CSS spotlight variables
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);

    // 3D subtle tilt (only on desktop hover)
    if (window.innerWidth > 768 && !card.classList.contains('hero-float-pill')) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;
      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px) scale3d(1.01, 1.01, 1.01)`;
    }
  });

  card.addEventListener('mouseleave', () => {
    if (!card.classList.contains('hero-float-pill')) {
      card.style.transform = '';
    }
  });
});

// ===== 5. MAGNETIC BUTTONS =====
const magneticBtns = document.querySelectorAll('.btn-magnetic');
magneticBtns.forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px) scale(1.03)`;
  });

  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

// ===== 6. NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveNavLink();
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  hamburger.classList.toggle('active');
});

// Close menu on link click
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

// ===== ACTIVE NAV LINK =====
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPos = window.scrollY + 120;
  sections.forEach(section => {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) {
      if (scrollPos >= top && scrollPos < bottom) {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    }
  });
}

// ===== INTERSECTION OBSERVER =====
const observerOptions = { threshold: 0.15 };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe service cards
document.querySelectorAll('.service-card').forEach((el, i) => {
  el.style.animationDelay = `${i * 0.1}s`;
  observer.observe(el);
});

// Observe portfolio items
document.querySelectorAll('.portfolio-item').forEach((el, i) => {
  el.style.animationDelay = `${i * 0.08}s`;
  observer.observe(el);
});

// ===== PORTFOLIO FILTER =====
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.getAttribute('data-filter');
    portfolioItems.forEach(item => {
      const cat = item.getAttribute('data-category');
      if (filter === 'all' || cat === filter) {
        item.classList.remove('hidden');
        item.style.animation = 'fadeInUp 0.4s ease both';
      } else {
        item.classList.add('hidden');
      }
    });
  });
});

// ===== CARD SPOTLIGHT MOUSE TRACKING =====
document.querySelectorAll('.service-card, .work-card, .about-card-main').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  });
});

// ===== INQUIRE WORK BUTTONS =====
document.querySelectorAll('.btn-inquire-work').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const service = btn.getAttribute('data-service');
    const serviceSelect = document.getElementById('contact-service');
    if (serviceSelect && service) {
      serviceSelect.value = service;
    }
    const card = btn.closest('.work-card');
    const title = card ? card.querySelector('.work-title')?.textContent.trim() : '';
    const messageInput = document.getElementById('contact-message');
    if (messageInput && title) {
      messageInput.value = `Hi MakeWise, I am interested in inquiring about "${title}". Could you share details on timeline and scope?`;
    }
    if (typeof updateWhatsAppLink === 'function') {
      updateWhatsAppLink();
    }
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      const offset = 80;
      const top = contactSection.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
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

  // Cap slider value within slider range, while retaining typed amount
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
  const numBudget = parseInt(budgetInput?.value, 10) || parseInt(budgetSlider?.value, 10) || 25000;
  const formattedBudget = numBudget.toLocaleString('en-IN');
  
  let msg = 'Hello! I would like to inquire about your digital services.';
  if (name) msg += ` My name is ${name}.`;
  if (service) msg += ` I am interested in: ${service}.`;
  msg += ` Estimated Budget: ₹${formattedBudget}.`;
  
  whatsappBtn.href = `https://wa.me/917012080365?text=${encodeURIComponent(msg)}`;
}

if (budgetSlider && budgetInput) {
  budgetSlider.addEventListener('input', syncFromSlider);
  budgetInput.addEventListener('input', syncFromInput);
  budgetInput.addEventListener('blur', handleInputBlur);
  syncFromSlider();
}

['contact-name', 'contact-service'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', updateWhatsAppLink);
});

// ===== CONTACT FORM =====
const form = document.getElementById('contact-form');
const submitBtn = document.getElementById('form-submit-btn');
const btnText = submitBtn.querySelector('.btn-text');
const btnLoader = submitBtn.querySelector('.btn-loader');
const formSuccess = document.getElementById('form-success');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  // Basic validation
  const name = document.getElementById('contact-name').value.trim();
  const email = document.getElementById('contact-email').value.trim();
  const service = document.getElementById('contact-service').value;
  const message = document.getElementById('contact-message').value.trim();

  if (!name || !email || !service || !message) {
    shakeForm();
    return;
  }
  if (!isValidEmail(email)) {
    document.getElementById('contact-email').style.borderColor = '#ef4444';
    return;
  }

  // Ensure minimum budget on submission
  if (budgetInput && (parseInt(budgetInput.value, 10) < MIN_BUDGET || !budgetInput.value)) {
    budgetInput.value = MIN_BUDGET;
    syncFromInput();
  }

  // Simulate sending
  btnText.style.display = 'none';
  btnLoader.style.display = 'block';
  submitBtn.disabled = true;

  setTimeout(() => {
    btnText.style.display = 'flex';
    btnLoader.style.display = 'none';
    submitBtn.disabled = false;
    formSuccess.style.display = 'block';
    form.reset();
    if (budgetInput && budgetSlider) {
      budgetInput.value = 25000;
      budgetSlider.value = 25000;
      updateSliderTrack(25000);
      updateWhatsAppLink();
    }
    setTimeout(() => { formSuccess.style.display = 'none'; }, 5000);
  }, 1800);
});

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function shakeForm() {
  form.style.animation = 'shake 0.4s ease';
  setTimeout(() => { form.style.animation = ''; }, 400);
}

// Add shake animation
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    25% { transform: translateX(-8px); }
    75% { transform: translateX(8px); }
  }
`;
document.head.appendChild(shakeStyle);

// ===== INPUT FOCUS EFFECTS =====
document.querySelectorAll('.form-group input, .form-group textarea, .form-group select').forEach(input => {
  input.addEventListener('focus', () => {
    input.style.borderColor = '';
  });
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ===== SCROLL REVEAL FOR CARDS =====
const revealStyle = document.createElement('style');
revealStyle.textContent = `
  .service-card, .portfolio-item, .value-item, .contact-item {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .service-card.visible, .portfolio-item.visible, .value-item.visible, .contact-item.visible {
    opacity: 1;
    transform: translateY(0);
  }
`;
document.head.appendChild(revealStyle);

// Also observe value items and contact items
document.querySelectorAll('.value-item, .contact-item').forEach((el, i) => {
  el.style.transitionDelay = `${i * 0.1}s`;
  observer.observe(el);
});

// ===== SCROLL TO TOP =====
document.addEventListener('keydown', (e) => {
  if (e.key === 'Home') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

// ===== MULTI-THEME CONTROLLER =====
const themeButtons = document.querySelectorAll('.theme-palette-btn');
const themeToast = document.getElementById('theme-toast');
const toastThemeName = document.getElementById('toast-theme-name');
let toastTimer;

const themeLabels = {
  gold: { name: 'Black & Gold Luxury', icon: '👑' },
  purple: { name: 'Stripe & Modern SaaS', icon: '✨' },
  cyberpunk: { name: 'Cyberpunk Neon', icon: '🔥' },
  emerald: { name: 'Emerald & Gold', icon: '💎' },
  blue: { name: 'Corporate Blue', icon: '⚡' },
  light: { name: 'Clean Light Luxe', icon: '☀️' }
};

function applyTheme(themeKey, showFeedback = false) {
  if (!themeLabels[themeKey]) themeKey = 'gold';
  
  // Set data-theme on html and body
  document.documentElement.setAttribute('data-theme', themeKey);
  document.body.setAttribute('data-theme', themeKey);
  
  // Update button active state
  themeButtons.forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-theme') === themeKey);
  });
  
  // Save preference
  try {
    localStorage.setItem('makewise-theme', themeKey);
  } catch (err) {}

  // Update canvas particle colors
  setTimeout(updateCanvasThemeColors, 50);
  
  // Show toast notification
  if (showFeedback && themeToast && toastThemeName) {
    const meta = themeLabels[themeKey];
    toastThemeName.textContent = meta.name;
    const toastIcon = document.getElementById('toast-icon');
    if (toastIcon) toastIcon.textContent = meta.icon;
    
    themeToast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      themeToast.classList.remove('show');
    }, 2400);
  }
}

// Bind click events
themeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const selectedTheme = btn.getAttribute('data-theme');
    applyTheme(selectedTheme, true);
  });
});

// Check URL params or localStorage on load
const urlParams = new URLSearchParams(window.location.search);
const urlTheme = urlParams.get('theme');
const savedTheme = localStorage.getItem('makewise-theme') || localStorage.getItem('nexora-theme') || localStorage.getItem('oneclick-theme') || localStorage.getItem('pixelforge-theme');
if (urlTheme && themeLabels[urlTheme]) {
  applyTheme(urlTheme, false);
} else if (savedTheme && themeLabels[savedTheme] && savedTheme !== 'purple') {
  applyTheme(savedTheme, false);
} else {
  applyTheme('gold', false);
}

// ===== 9. HERO INTERACTIVE SCOPE CONFIGURATOR (OPTION 2) =====
const configData = {
  resume: {
    cat: "Resume Solution",
    title: "ATS-Compliant Professional Resume",
    summary: "Engineered to pass employer Applicant Tracking Systems (ATS) with targeted industry keywords, crisp typography, and recruiter-focused achievement formatting.",
    deliverables: [
      "90%+ ATS Scan Score Pass Rate Guarantee",
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
        cfgResultBox.style.transition = 'opacity 0.15s ease, transform 0.15s ease';
        cfgResultBox.style.opacity = '0.3';
        cfgResultBox.style.transform = 'scale(0.99)';

        setTimeout(() => {
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

          cfgResultBox.style.opacity = '1';
          cfgResultBox.style.transform = 'scale(1)';
        }, 120);
      }
    });
  });

  // Handle external service selection links (e.g. from footer)
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

// ===== INIT =====
console.log('%c MakeWise Studio Multi-Theme Ready ', 'background: linear-gradient(135deg,#7c3aed,#06b6d4); color: white; padding: 8px 16px; border-radius: 4px; font-size: 14px; font-weight: bold;');