// CURSOR
const cur = document.getElementById('cur'), trail = document.getElementById('trail');
document.addEventListener('mousemove', e => {
  cur.style.left = e.clientX + 'px'; cur.style.top = e.clientY + 'px';
  trail.style.left = e.clientX + 'px'; trail.style.top = e.clientY + 'px';
});
document.querySelectorAll('a, button, input, textarea, .proj-card, .si, .c-card, .soc-icon-btn').forEach(el => {
  el.addEventListener('mouseenter', () => { cur.style.width = '18px'; cur.style.height = '18px'; trail.style.width = '65px'; trail.style.height = '65px'; });
  el.addEventListener('mouseleave', () => { cur.style.width = '10px'; cur.style.height = '10px'; trail.style.width = '44px'; trail.style.height = '44px'; });
});

// NAV SCROLL
window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 50);
});

// REVEAL
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: .1 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// SKILL BARS
const sobs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.querySelectorAll('.sk-fill').forEach(b => {
      setTimeout(() => b.style.width = b.dataset.w + '%', 200);
    });
  });
}, { threshold: .2 });
document.querySelectorAll('.skill-category').forEach(el => sobs.observe(el));

// COUNTERS
const cobs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.querySelectorAll('[data-count]').forEach(el => {
      const target = parseFloat(el.dataset.count), suffix = el.dataset.s || '', dec = el.dataset.dec === 'true';
      let c = 0, steps = 60, step = target / steps;
      const t = setInterval(() => {
        c = Math.min(c + step, target);
        el.textContent = dec ? c.toFixed(2) : Math.floor(c) + suffix;
        if (c >= target) { el.textContent = dec ? target.toFixed(2) : target + suffix; clearInterval(t); }
      }, 28);
    });
    cobs.unobserve(e.target);
  });
}, { threshold: .3 });
document.querySelectorAll('.stats-inline').forEach(el => cobs.observe(el));

// RESUME MODAL
const viewResumeBtn = document.getElementById('view-resume-btn');
const resumeModal = document.getElementById('resume-modal');
const closeModalBtn = document.getElementById('close-modal-btn');

if (viewResumeBtn && resumeModal && closeModalBtn) {
  viewResumeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    resumeModal.classList.add('active');
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  });

  closeModalBtn.addEventListener('click', () => {
    resumeModal.classList.remove('active');
    document.body.style.overflow = '';
  });

  // Close when clicking outside of modal content
  resumeModal.addEventListener('click', (e) => {
    if (e.target === resumeModal) {
      resumeModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}
