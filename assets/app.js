const body = document.body;
const toggle = document.getElementById('themeToggle');

const THEME_KEY = 'gokl-theme';
const MODE_KEY = 'gokl-theme-mode';

// Daytime: 07:00–18:59 => Apple light
// Night:   19:00–06:59 => Cyberpunk dark
function themeFromTime() {
  const hour = new Date().getHours();
  return (hour >= 7 && hour < 19) ? 'light' : 'dark';
}

function applyTheme(theme) {
  body.classList.toggle('light', theme === 'light');
  body.dataset.theme = theme;
  if (toggle) {
    toggle.textContent = theme === 'light' ? '◐' : '◑';
    toggle.setAttribute('aria-label', theme === 'light' ? '다크 모드로 전환' : '라이트 모드로 전환');
    toggle.title = theme === 'light' ? '현재: 라이트 모드 (클릭하면 수동 다크)' : '현재: 다크 모드 (클릭하면 수동 라이트)';
  }
}

// manual mode is respected across visits.
// If no manual override exists, the theme follows local clock time.
const savedMode = localStorage.getItem(MODE_KEY);
const savedTheme = localStorage.getItem(THEME_KEY);

if (savedMode === 'manual' && (savedTheme === 'light' || savedTheme === 'dark')) {
  applyTheme(savedTheme);
} else {
  applyTheme(themeFromTime());
}

toggle?.addEventListener('click', () => {
  const current = body.classList.contains('light') ? 'light' : 'dark';
  const next = current === 'light' ? 'dark' : 'light';
  applyTheme(next);
  localStorage.setItem(THEME_KEY, next);
  localStorage.setItem(MODE_KEY, 'manual');
});

// Double click returns theme control to automatic time-based mode.
toggle?.addEventListener('dblclick', () => {
  localStorage.removeItem(THEME_KEY);
  localStorage.setItem(MODE_KEY, 'auto');
  applyTheme(themeFromTime());
});

// If the page remains open across the day/night boundary, update automatically
// only when the user has not manually overridden the theme.
setInterval(() => {
  if (localStorage.getItem(MODE_KEY) !== 'manual') {
    applyTheme(themeFromTime());
  }
}, 60 * 1000);


const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const heroStage = document.getElementById('heroStage');
if (heroStage && window.matchMedia('(pointer:fine)').matches) {
  heroStage.addEventListener('mousemove', e => {
    const r = heroStage.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    heroStage.querySelectorAll('.floating-card').forEach((card, i) => {
      const strength = (i + 1) * 6;
      card.style.translate = `${x * strength}px ${y * strength}px`;
    });
  });
  heroStage.addEventListener('mouseleave', () => {
    heroStage.querySelectorAll('.floating-card').forEach(card => card.style.translate = '');
  });
}


document.querySelectorAll('.cta.primary, .release-button').forEach(el => {
  if (!window.matchMedia('(pointer:fine)').matches) return;
  el.addEventListener('mousemove', e => {
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * 0.06;
    const y = (e.clientY - r.top - r.height / 2) * 0.06;
    el.style.transform = `translate(${x}px, ${y}px)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = '';
  });
});


// Enhanced project-card motion + filter transitions
const motionCards = Array.from(document.querySelectorAll('.project-card'));

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

motionCards.forEach((card, index) => {
  if (!reduceMotion) {
    card.classList.add('card-enter');
    setTimeout(() => {
      card.classList.add('card-enter-active');
      setTimeout(() => {
        card.classList.remove('card-enter', 'card-enter-active');
      }, 450);
    }, 90 + index * 80);
  }

  if (!reduceMotion && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const xPct = ((e.clientX - r.left) / r.width) * 100;
      const yPct = ((e.clientY - r.top) / r.height) * 100;
      card.style.setProperty('--mx', `${xPct}%`);
      card.style.setProperty('--my', `${yPct}%`);

      // stronger tilt only in dark mode
      if (!document.body.classList.contains('light')) {
        const x = (e.clientX - r.left) / r.width - .5;
        const y = (e.clientY - r.top) / r.height - .5;
        card.style.transform = `perspective(1000px) rotateX(${(-y * 3.3).toFixed(2)}deg) rotateY(${(x * 4.4).toFixed(2)}deg) translateY(-4px)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.removeProperty('--mx');
      card.style.removeProperty('--my');
      card.style.transform = '';
    });
  }
});

// Override/augment filter behavior with fade/slide transitions.
document.querySelectorAll('[data-filter]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
    button.classList.add('active');

    const filter = button.dataset.filter;

    motionCards.forEach(card => {
      const shouldShow = filter === 'all' || card.dataset.kind === filter;

      if (!shouldShow && card.style.display !== 'none') {
        if (reduceMotion) {
          card.style.display = 'none';
        } else {
          card.classList.add('is-hiding');
          setTimeout(() => {
            card.style.display = 'none';
            card.classList.remove('is-hiding');
          }, 220);
        }
      }

      if (shouldShow && card.style.display === 'none') {
        card.style.display = '';
        if (!reduceMotion) {
          card.classList.add('is-showing');
          setTimeout(() => card.classList.remove('is-showing'), 460);
        }
      }
    });
  });
});
