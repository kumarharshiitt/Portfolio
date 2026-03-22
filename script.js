// ── Theme toggle ──
const body = document.body;
const themeBtn = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

const savedTheme = localStorage.getItem('theme') || 'dark';
if (savedTheme === 'light') applyLight();

themeBtn.addEventListener('click', () => {
  body.classList.contains('light') ? applyDark() : applyLight();
});

function applyLight() {
  body.classList.add('light');
  themeIcon.className = 'fas fa-sun';
  localStorage.setItem('theme', 'light');
}
function applyDark() {
  body.classList.remove('light');
  themeIcon.className = 'fas fa-moon';
  localStorage.setItem('theme', 'dark');
}

// ── Glow cursor ──
const glow = document.getElementById('cursorGlow');
let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;

document.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });

// smooth lerp follow
(function animateGlow() {
  glowX += (mouseX - glowX) * 0.12;
  glowY += (mouseY - glowY) * 0.12;
  glow.style.left = glowX + 'px';
  glow.style.top  = glowY + 'px';
  requestAnimationFrame(animateGlow);
})();

document.addEventListener('mousedown', () => {
  glow.style.width = '80px'; glow.style.height = '80px';
  glow.style.filter = 'blur(4px)';
});
document.addEventListener('mouseup', () => {
  glow.style.width = '40px'; glow.style.height = '40px';
  glow.style.filter = 'blur(2px)';
});

// extra burst on links/buttons
document.querySelectorAll('a, button, .cert-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    glow.style.width = '65px'; glow.style.height = '65px';
    glow.style.filter = 'blur(3px)';
  });
  el.addEventListener('mouseleave', () => {
    glow.style.width = '40px'; glow.style.height = '40px';
    glow.style.filter = 'blur(2px)';
  });
});

// ── 3D tilt on cards ──
document.querySelectorAll('.skill-card, .project-card, .cert-card, .timeline-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `perspective(600px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) scale3d(1.03,1.03,1.03)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(600px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)';
  });
});

// ── About tabs ──
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    const tab = document.getElementById('tab-' + btn.dataset.tab);
    tab.classList.add('active');
    // animate bars when stats tab opens
    if (btn.dataset.tab === 'stats') animateBars();
  });
});

function animateBars() {
  document.querySelectorAll('.bar-fill').forEach(bar => {
    bar.style.width = bar.dataset.w + '%';
  });
}

// animate bars if stats tab is default visible on load (it's not, but just in case)
// also trigger when about section scrolls into view
const aboutObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting && document.querySelector('.tab-btn[data-tab="stats"]').classList.contains('active')) {
      animateBars();
    }
  });
}, { threshold: 0.3 });
const aboutSection = document.getElementById('about');
if (aboutSection) aboutObserver.observe(aboutSection);

// ── Matrix rain name effect ──
const nameEl = document.getElementById('heroName');
const finalName = 'Harsh Kumar';
const matrixChars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';

function randomChar() {
  return matrixChars[Math.floor(Math.random() * matrixChars.length)];
}

// build spans
finalName.split('').forEach((ch, i) => {
  const span = document.createElement('span');
  span.className = 'char';
  span.textContent = ch === ' ' ? '\u00A0' : randomChar();
  span.dataset.final = ch === ' ' ? '\u00A0' : ch;
  span.dataset.index = i;
  nameEl.appendChild(span);
});

function revealName() {
  const spans = nameEl.querySelectorAll('.char');
  spans.forEach((span, i) => {
    let iterations = 0;
    const maxIter = 10 + i * 4;
    const interval = setInterval(() => {
      if (iterations < maxIter - 6) {
        span.textContent = randomChar();
        span.classList.add('rain');
        setTimeout(() => span.classList.remove('rain'), 80);
      } else if (iterations >= maxIter) {
        span.textContent = span.dataset.final;
        span.classList.remove('rain');
        clearInterval(interval);
      } else {
        span.textContent = randomChar();
      }
      iterations++;
    }, 45);
  });
}

revealName();
// re-run on hover
nameEl.addEventListener('mouseenter', revealName);

// ── Typed effect ──
const phrases = ['CS Engineering Student', 'Cybersecurity Enthusiast', 'Web Developer', 'Ethical Hacker'];
let phraseIndex = 0, charIndex = 0, deleting = false;
const typedEl = document.getElementById('typed');

function type() {
  const current = phrases[phraseIndex];
  if (!deleting) {
    typedEl.innerHTML = current.slice(0, ++charIndex) + '<span class="cursor"></span>';
    if (charIndex === current.length) { deleting = true; setTimeout(type, 1800); return; }
  } else {
    typedEl.innerHTML = current.slice(0, --charIndex) + '<span class="cursor"></span>';
    if (charIndex === 0) { deleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; }
  }
  setTimeout(type, deleting ? 60 : 100);
}
type();

// ── Navbar scroll ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  document.getElementById('scrollTop').classList.toggle('visible', window.scrollY > 400);
});

// ── Hamburger ──
document.getElementById('hamburger').addEventListener('click', () => {
  document.querySelector('.nav-links').classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => document.querySelector('.nav-links').classList.remove('open'));
});

// ── Scroll top ──
document.getElementById('scrollTop').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ── Fade-in on scroll ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
}, { threshold: 0.1 });

document.querySelectorAll('.skill-card, .timeline-card, .project-card, .cert-card, .about-grid, .contact-grid').forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});

// ── Certificate viewer ──
function openCert(path) {
  window.open(path, '_blank');
}

// keyboard support for cert cards
document.querySelectorAll('.cert-card').forEach(card => {
  card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') card.click(); });
});

// ── Contact form ──
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const msg = document.getElementById('formMsg');
  msg.textContent = "Thanks for reaching out! I'll get back to you soon.";
  this.reset();
  setTimeout(() => msg.textContent = '', 4000);
});
