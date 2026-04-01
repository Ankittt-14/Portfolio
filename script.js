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

// TELEGRAM CONTACT FORM
const BOT_TOKEN = '8663994603:AAH5sEcZnVujXMPL7q-wCjY6A-yPSBGA2ZU';
const CHAT_ID   = '7138121677';

document.querySelector('.contact-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  const btn     = this.querySelector('.submit-btn');

  const text =
    `📬 *New Portfolio Message!*\n\n` +
    `👤 *Name:* ${name}\n` +
    `📧 *Email:* ${email}\n` +
    `💬 *Message:*\n${message}`;

  btn.disabled = true;
  btn.textContent = 'Sending…';

  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: 'Markdown' })
    });

    const data = await res.json();
    if (data.ok) {
      window.location.href = 'success.html';
    } else {
      throw new Error(data.description);
    }
  } catch (err) {
    btn.disabled = false;
    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg> Send Message`;
    alert('Failed to send. Please email me directly at masterrajaniket@gmail.com');
    console.error(err);
  }
});
