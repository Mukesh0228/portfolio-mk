/* ===================================================================
   Mukeshkumar M — Portfolio
   script.js — Interactions, Three.js bg, typing, scroll, EmailJS
   =================================================================== */

// ---------- Loader ----------
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('loader')?.classList.add('hide'), 900);
});

// ---------- Theme toggle ----------
const themeBtn = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme') || 'dark';
if (savedTheme === 'light') document.body.classList.add('light');
updateThemeIcon();
themeBtn?.addEventListener('click', () => {
  document.body.classList.toggle('light');
  const t = document.body.classList.contains('light') ? 'light' : 'dark';
  localStorage.setItem('theme', t);
  updateThemeIcon();
});
function updateThemeIcon() {
  if (!themeBtn) return;
  themeBtn.innerHTML = document.body.classList.contains('light')
    ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
}

// ---------- Mobile nav ----------
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  hamburger.classList.remove('open');
  navLinks.classList.remove('open');
}));

// ---------- Navbar scroll + active link ----------
const navbar = document.querySelector('.navbar');
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  navbar?.classList.toggle('scrolled', window.scrollY > 30);
  const y = window.scrollY + 120;
  sections.forEach(s => {
    const top = s.offsetTop, h = s.offsetHeight;
    const link = document.querySelector(`.nav-links a[href="#${s.id}"]`);
    if (link) link.classList.toggle('active', y >= top && y < top + h);
  });
});

// ---------- Custom cursor ----------
const cDot = document.querySelector('.cursor-dot');
const cRing = document.querySelector('.cursor-ring');
let mx=0,my=0,rx=0,ry=0;
window.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  if (cDot) { cDot.style.transform = `translate(${mx-4}px, ${my-4}px)`; }
});
function animCursor() {
  rx += (mx - rx) * 0.15; ry += (my - ry) * 0.15;
  if (cRing) cRing.style.transform = `translate(${rx-19}px, ${ry-19}px)`;
  requestAnimationFrame(animCursor);
}
animCursor();
document.querySelectorAll('a, button, .glass, .chip').forEach(el => {
  el.addEventListener('mouseenter', () => cRing?.classList.add('hover'));
  el.addEventListener('mouseleave', () => cRing?.classList.remove('hover'));
});

// ---------- Typing animation ----------
const roles = [
  'Data Analyst',
  'Data Science Enthusiast',
  'Power BI Developer',
  'SQL Developer',
  'Python Developer',
  'Machine Learning Learner'
];
const typingEl = document.getElementById('typing');
let rIdx=0, cIdx=0, deleting=false;
function type() {
  if (!typingEl) return;
  const cur = roles[rIdx];
  typingEl.textContent = deleting ? cur.slice(0,--cIdx) : cur.slice(0,++cIdx);
  let delay = deleting ? 50 : 110;
  if (!deleting && cIdx === cur.length) { delay = 1600; deleting = true; }
  else if (deleting && cIdx === 0) { deleting = false; rIdx = (rIdx+1)%roles.length; delay = 400; }
  setTimeout(type, delay);
}
type();

// ---------- Scroll reveal ----------
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ---------- Counter animation ----------
const counterIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;
      const target = +el.dataset.target;
      let cur = 0; const step = Math.max(1, Math.ceil(target/60));
      const tick = () => {
        cur += step;
        if (cur >= target) { el.textContent = target + '+'; return; }
        el.textContent = cur;
        requestAnimationFrame(tick);
      };
      tick(); counterIO.unobserve(el);
    }
  });
}, { threshold: 0.4 });
document.querySelectorAll('.counter .num').forEach(el => counterIO.observe(el));

// ---------- 3D tilt on cards ----------
document.querySelectorAll('.tilt').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - .5;
    const py = (e.clientY - r.top) / r.height - .5;
    card.style.transform = `perspective(900px) rotateY(${px*10}deg) rotateX(${-py*10}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => card.style.transform = '');
});

// ---------- Three.js particle background ----------
function initThree() {
  if (typeof THREE === 'undefined') return;
  const canvas = document.getElementById('bg-canvas');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 1000);
  camera.position.z = 50;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

  // particles
  const count = 800;
  const geo = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  for (let i=0;i<count;i++) {
    positions[i*3] = (Math.random()-.5)*200;
    positions[i*3+1] = (Math.random()-.5)*200;
    positions[i*3+2] = (Math.random()-.5)*200;
    const c = i%2 ? [0,0.83,1] : [0.66,0.33,0.97];
    colors[i*3]=c[0]; colors[i*3+1]=c[1]; colors[i*3+2]=c[2];
  }
  geo.setAttribute('position', new THREE.BufferAttribute(positions,3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors,3));
  const mat = new THREE.PointsMaterial({ size: .6, vertexColors: true, transparent:true, opacity:.85 });
  const points = new THREE.Points(geo, mat);
  scene.add(points);

  // torus glow
  const torus = new THREE.Mesh(
    new THREE.TorusGeometry(18, .4, 16, 100),
    new THREE.MeshBasicMaterial({ color: 0x00d4ff, transparent:true, opacity:.15, wireframe:true })
  );
  torus.position.set(20,-10,-20);
  scene.add(torus);

  let mouseX=0, mouseY=0;
  window.addEventListener('mousemove', e => {
    mouseX = (e.clientX/innerWidth - .5);
    mouseY = (e.clientY/innerHeight - .5);
  });
  window.addEventListener('resize', () => {
    camera.aspect = innerWidth/innerHeight; camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });

  function animate() {
    points.rotation.y += 0.0008;
    points.rotation.x += 0.0004;
    torus.rotation.x += 0.005; torus.rotation.y += 0.007;
    camera.position.x += (mouseX*10 - camera.position.x) * 0.04;
    camera.position.y += (-mouseY*10 - camera.position.y) * 0.04;
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
}
initThree();

// ---------- Contact form (mailto redirect) ----------
// Opens the visitor's default email app with a pre-filled message to Mukesh.
const MY_EMAIL = 'mukeshkumar0211@gmail.com';

function showToast(msg, icon = 'check-circle') {
  const t = document.getElementById('toast');
  if (!t) return;
  t.innerHTML = `<i class="fas fa-${icon}"></i><span>${msg}</span>`;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 4500);
}

const form = document.getElementById('contactForm');
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  if (!data.name?.trim() || !data.email?.trim() || !data.subject?.trim() || !data.message?.trim()) {
    showToast('Please fill in all fields.', 'exclamation-circle'); return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    showToast('Please enter a valid email.', 'exclamation-circle'); return;
  }

  const subject = encodeURIComponent(data.subject);
  const body = encodeURIComponent(
    `Hi Mukesh,\n\n${data.message}\n\n— ${data.name}\n${data.email}`
  );
  const mailto = `mailto:${MY_EMAIL}?subject=${subject}&body=${body}`;
  const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${MY_EMAIL}&su=${subject}&body=${body}`;

  // Try native mail client first; offer Gmail web as a fallback after a short delay.
  window.location.href = mailto;
  setTimeout(() => {
    if (!document.hidden) window.open(gmail, '_blank', 'noopener');
  }, 800);

  showToast('Opening your email app to send the message…');
  form.reset();
});

// ---------- Year ----------
const y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
