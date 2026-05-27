/* ─────────────────────────────────────────
   CUSTOM CURSOR
───────────────────────────────────────── */
const cur   = document.getElementById('cur');
const trail = document.getElementById('trail');

document.addEventListener('mousemove', e => {
  cur.style.left   = e.clientX + 'px';
  cur.style.top    = e.clientY + 'px';
  trail.style.left = e.clientX + 'px';
  trail.style.top  = e.clientY + 'px';
});

const interactiveEls = 'a, button, input, textarea, .proj-card, .si, .c-card, .soc-icon-btn, .hchip, .sk-card';
document.querySelectorAll(interactiveEls).forEach(el => {
  el.addEventListener('mouseenter', () => {
    cur.style.width    = '18px';
    cur.style.height   = '18px';
    trail.style.width  = '65px';
    trail.style.height = '65px';
  });
  el.addEventListener('mouseleave', () => {
    cur.style.width    = '10px';
    cur.style.height   = '10px';
    trail.style.width  = '44px';
    trail.style.height = '44px';
  });
});

/* ─────────────────────────────────────────
   NAV — scroll effect
───────────────────────────────────────── */
window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 50);
});

/* ─────────────────────────────────────────
   MOBILE HAMBURGER MENU
───────────────────────────────────────── */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

// Close menu on link click
document.querySelectorAll('.mob-link, .mob-resume, .mob-hire').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ─────────────────────────────────────────
   SCROLL REVEAL (IntersectionObserver)
───────────────────────────────────────── */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: .1 });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ─────────────────────────────────────────
   ANIMATED COUNTERS
───────────────────────────────────────── */
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.querySelectorAll('[data-count]').forEach(el => {
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.s || '';
      const isDec  = el.dataset.dec === 'true';
      let current  = 0;
      const steps  = 60;
      const step   = target / steps;

      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = isDec
          ? current.toFixed(2)
          : Math.floor(current) + suffix;

        if (current >= target) {
          el.textContent = isDec ? target.toFixed(2) : target + suffix;
          clearInterval(timer);
        }
      }, 28);
    });
    counterObs.unobserve(e.target);
  });
}, { threshold: .3 });

document.querySelectorAll('.stats-inline').forEach(el => counterObs.observe(el));

/* ─────────────────────────────────────────
   SKILL CARD STAGGER ENTRANCE
───────────────────────────────────────── */
const skillObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.querySelectorAll('.sk-card').forEach((card, i) => {
      setTimeout(() => card.classList.add('sk-visible'), i * 75);
    });
    skillObs.unobserve(e.target);
  });
}, { threshold: 0.1 });

document.querySelectorAll('.sk-group').forEach(g => skillObs.observe(g));

/* ─────────────────────────────────────────
   CONTACT FORM (Cloudflare Worker)
───────────────────────────────────────── */
const WORKER_URL = 'https://portfolio-contact.pvtankit7858.workers.dev/';

const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const turnstileResponse = document.querySelector('[name="cf-turnstile-response"]')?.value;
    if (!turnstileResponse) {
      alert('Please complete the Cloudflare security check before sending.');
      return;
    }

    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    const btn     = document.getElementById('submitBtn');

    // Loading state
    btn.disabled     = true;
    btn.textContent  = 'Sending…';

    try {
      const res  = await fetch(WORKER_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name, email, message, turnstileResponse }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        window.location.href = 'success.html';
      } else {
        throw new Error(data.error || 'Failed to send message');
      }
    } catch (err) {
      btn.disabled = false;
      btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
      </svg> Send Message`;
      alert('Error: ' + err.message + '\n\nPlease try again or email me directly.');
    }
  });
}
