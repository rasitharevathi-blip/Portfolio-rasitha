/**
 * Personal Portfolio Website - Rasitha A
 * Features: Interactive Cosmic Particle Canvas, Dynamic Tab Routing,
 * Multi-Category Project Filtering, Modal Details, Theme Switching & Form Validation.
 */

document.addEventListener('DOMContentLoaded', () => {
  initCosmicCanvas();
  initTabNavigation();
  initThemeToggle();
  initProjectFilters();
  initContactForm();
  initBackToTop();
  initMobileMenu();
});

/* ==========================================================================
   1. Dynamic Cosmic Nebula Background Canvas
   ========================================================================== */
function initCosmicCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);
  
  let particles = [];
  const particleCount = Math.min(Math.floor(width / 12), 100);
  
  const mouse = { x: null, y: null, radius: 150 };

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
      this.radius = Math.random() * 2 + 1;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = (Math.random() - 0.5) * 0.8;
      this.baseAlpha = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse Interaction
      if (mouse.x && mouse.y) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const angle = Math.atan2(dy, dx);
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= Math.cos(angle) * force * 2;
          this.y -= Math.sin(angle) * force * 2;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      const isLight = document.body.getAttribute('data-theme') === 'light';
      ctx.fillStyle = isLight 
        ? `rgba(0, 131, 176, ${this.baseAlpha})` 
        : `rgba(0, 242, 254, ${this.baseAlpha})`;
      ctx.fill();
    }
  }

  // Populate particles
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    
    // Draw constellation connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          const isLight = document.body.getAttribute('data-theme') === 'light';
          const alpha = (1 - dist / 120) * 0.2;
          ctx.strokeStyle = isLight 
            ? `rgba(0, 131, 176, ${alpha})` 
            : `rgba(0, 242, 254, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. Tab Switcher System
   ========================================================================== */
function initTabNavigation() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  function switchTab(targetTabId) {
    tabBtns.forEach((btn) => {
      if (btn.getAttribute('data-tab') === targetTabId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    tabContents.forEach((content) => {
      if (content.id === targetTabId) {
        content.classList.add('active');
      } else {
        content.classList.remove('active');
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      switchTab(tabId);
      
      // Close mobile menu if open
      const navMenu = document.getElementById('nav-menu');
      if (navMenu) navMenu.classList.remove('open');
    });
  });

  // Global helper for CTA buttons
  window.switchTab = switchTab;
}

/* ==========================================================================
   3. Theme Switcher (Dark / Light)
   ========================================================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.body.setAttribute('data-theme', newTheme);
    toggleBtn.textContent = newTheme === 'light' ? '🌙' : '☀️';
  });
}

/* ==========================================================================
   4. Projects Filter & Detail Modal View
   ========================================================================== */
const projectDetailsData = {
  1: {
    title: "KG CAS Student Management Portal",
    category: "Web Application",
    tech: ["HTML5", "CSS Grid", "Vanilla JS"],
    desc: "A custom academic management dashboard engineered specifically for KG College students. It enables tracking course modules, calculating semester SGPA, and accessing department notices."
  },
  2: {
    title: "Responsive E-Learning Hub UI",
    category: "UI/UX & Web Design",
    tech: ["CSS Flexbox", "JavaScript", "HTML5"],
    desc: "An interactive online learning platform interface with dynamic video player UI, expandable course accordions, and integrated progress indicators."
  },
  3: {
    title: "Automated Academic GPA Calculator",
    category: "Utility Tool",
    tech: ["Vanilla JS", "HTML5", "CSS3"],
    desc: "A high-precision grade point calculator tailored for college subject credit systems. Features real-time grade calculations, validation, and historical export."
  },
  4: {
    title: "Smart Task & Study Tracker",
    category: "Web Application",
    tech: ["JavaScript", "LocalStorage API", "CSS"],
    desc: "A productivity app featuring Pomodoro timer integration, category tags, priority filters, and persistent local storage sync."
  },
  5: {
    title: "Modern Department Event Website",
    category: "Web Design",
    tech: ["HTML5", "CSS Animation", "JS"],
    desc: "An event registration and showcase site built for college symposiums with interactive schedules, speaker profiles, and countdown timers."
  },
  6: {
    title: "Interactive Weather Dashboard",
    category: "Web Application",
    tech: ["Fetch API", "JavaScript", "CSS Grid"],
    desc: "A real-time weather tracking application showcasing temperature trends, atmospheric pressure, and dynamic weather icons based on user search queries."
  },
  7: {
    title: "Personal Portfolio v1 Prototype",
    category: "UI/UX Design",
    tech: ["HTML5", "CSS3", "JavaScript"],
    desc: "An initial design exploration showcasing CSS glassmorphism, floating micro-interactions, and custom responsive layouts."
  }
};

function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

function openProjectModal(id) {
  const modal = document.getElementById('project-modal');
  const data = projectDetailsData[id];
  if (!modal || !data) return;

  document.getElementById('modal-title').textContent = data.title;
  document.getElementById('modal-category').textContent = `${data.category} | Tech Stack: ${data.tech.join(', ')}`;
  document.getElementById('modal-description').textContent = data.desc;

  modal.classList.add('active');
}

function closeModal() {
  const modal = document.getElementById('project-modal');
  if (modal) modal.classList.remove('active');
}

window.openProjectModal = openProjectModal;
window.closeModal = closeModal;

/* ==========================================================================
   5. Client-side Contact Form Validation
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Name Validation
    const nameInput = document.getElementById('contact-name');
    const nameErr = document.getElementById('name-error');
    if (nameInput.value.trim().length < 2) {
      nameErr.style.display = 'block';
      isValid = false;
    } else {
      nameErr.style.display = 'none';
    }

    // Email Validation
    const emailInput = document.getElementById('contact-email');
    const emailErr = document.getElementById('email-error');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
      emailErr.style.display = 'block';
      isValid = false;
    } else {
      emailErr.style.display = 'none';
    }

    // Message Validation
    const msgInput = document.getElementById('contact-message');
    const msgErr = document.getElementById('message-error');
    if (msgInput.value.trim().length < 10) {
      msgErr.style.display = 'block';
      isValid = false;
    } else {
      msgErr.style.display = 'none';
    }

    if (isValid) {
      showToast('Message validated and simulated successfully!');
      form.reset();
    }
  });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('active');
  setTimeout(() => {
    toast.classList.remove('active');
  }, 3500);
}

/* ==========================================================================
   6. Auxiliary Controls (Back to Top & Mobile Menu)
   ========================================================================== */
function initBackToTop() {
  const bttBtn = document.getElementById('back-to-top');
  if (!bttBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      bttBtn.classList.add('active');
    } else {
      bttBtn.classList.remove('active');
    }
  });

  bttBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });
  }
}