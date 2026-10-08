const body = document.body;
const toggle = document.getElementById('themeToggle');

let manualOverride = false;

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
    toggle.setAttribute(
      'aria-label',
      theme === 'light' ? '다크 모드로 임시 전환' : '라이트 모드로 임시 전환'
    );
    toggle.title =
      theme === 'light'
        ? '현재: 시간 자동 라이트 모드 · 클릭하면 임시 다크'
        : '현재: 시간 자동 다크 모드 · 클릭하면 임시 라이트';
  }
}

// Always start from local device time on every page load.
applyTheme(themeFromTime());

// A single click changes theme only for the current page session.
// Reloading the page returns to automatic time-based mode.
toggle?.addEventListener('click', () => {
  manualOverride = true;
  const current = body.classList.contains('light') ? 'light' : 'dark';
  applyTheme(current === 'light' ? 'dark' : 'light');
});

// Double-click immediately returns to automatic time-based mode.
toggle?.addEventListener('dblclick', () => {
  manualOverride = false;
  applyTheme(themeFromTime());
});

// While the page stays open, switch automatically when the day/night boundary passes,
// unless the user temporarily changed the theme in this session.
setInterval(() => {
  if (!manualOverride) {
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


const projectGrid = document.getElementById('projectGrid');
const latestReleaseMount = document.getElementById('latestReleaseMount');
let projectData = [];
let currentFilter = 'all';

function esc(v=''){return String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'","&#039;");}

function metaItems(p){
  return [...new Set([p.version,p.platform,p.gameId,p.emulator].filter(Boolean))];
}

function renderCard(p){
  const meta = metaItems(p).map(x=>`<span>${esc(x)}</span>`).join('');
  const links = [];
  if(p.downloadUrl) links.push(`<a class="tool-download-primary" href="${esc(p.downloadUrl)}">DOWNLOAD ↓</a>`);
  if(p.detailUrl) links.push(`<a href="${esc(p.detailUrl)}">VIEW PROJECT</a>`);
  if(p.repoUrl) links.push(`<a href="${esc(p.repoUrl)}">GITHUB ↗</a>`);
  if(p.releaseUrl) links.push(`<a href="${esc(p.releaseUrl)}">RELEASE NOTES ↗</a>`);
  const live = (p.status==='released'||p.status==='in-progress') ? ' active-status' : '';
  const featured = p.featured ? ' featured' : '';
  const tool = (p.type==='tools' && p.status==='released') ? ' tool-live-card' : '';
  return `<article class="project-card tilt-card${featured}${tool}" data-kind="${esc(p.type)}">
    <div class="project-visual ${esc(p.visualClass||'visual-blue')}">
      <div class="visual-top"><span class="visual-chip">${esc(p.typeLabel||p.type)}</span><span class="visual-no">${String(p.order||'').padStart(2,'0')}</span></div>
      ${p.featured?'<div class="visual-hud"></div>':''}
      <div class="visual-copy"><small>${esc(p.platform||'')}${p.version?` / ${esc(p.version)}`:''}</small><strong>${esc(p.title)}</strong></div>
    </div>
    <div class="project-content ${p.featured?'':'compact'}">
      <div class="project-row-top"><div><span class="project-type">${esc(p.typeLabel||p.type)}</span><h3>${esc(p.subtitle||p.title)}</h3></div><span class="status${live}">${esc(p.statusLabel||p.status)}</span></div>
      <p>${esc(p.description||'')}</p>
      ${meta?`<div class="project-meta">${meta}</div>`:''}
      ${links.length?`<div class="project-links tool-download-links">${links.join('')}</div>`:''}
    </div>
  </article>`;
}

function attachMotion(){
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('.project-card').forEach((card,i)=>{
    if(!reduce){card.classList.add('card-enter');setTimeout(()=>{card.classList.add('card-enter-active');setTimeout(()=>card.classList.remove('card-enter','card-enter-active'),450)},70+i*70);}
    if(!reduce && window.matchMedia('(hover:hover) and (pointer:fine)').matches){
      card.addEventListener('mousemove',e=>{
        const r=card.getBoundingClientRect(), x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
        card.style.setProperty('--mx',`${((e.clientX-r.left)/r.width)*100}%`);
        card.style.setProperty('--my',`${((e.clientY-r.top)/r.height)*100}%`);
        if(!document.body.classList.contains('light')) card.style.transform=`perspective(1000px) rotateX(${(-y*3.3).toFixed(2)}deg) rotateY(${(x*4.4).toFixed(2)}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave',()=>{card.style.removeProperty('--mx');card.style.removeProperty('--my');card.style.transform='';});
    }
  });
}

function renderProjects(){
  const rows=projectData.filter(p=>currentFilter==='all'||p.type===currentFilter).sort((a,b)=>(a.order||999)-(b.order||999));
  projectGrid.innerHTML = rows.length ? rows.map(renderCard).join('') : '<div class="project-empty">이 분류에 등록된 프로젝트가 없습니다.</div>';
  attachMotion();
}

function renderLatestRelease(){
  if(!latestReleaseMount) return;
  const p=projectData.find(x=>x.type==='tools'&&x.status==='released'&&x.downloadUrl);
  if(!p){latestReleaseMount.innerHTML='';return;}
  latestReleaseMount.innerHTML=`<div class="release-panel tool-release-panel">
    <div class="release-copy"><p class="eyebrow">PATCH &amp; TOOLS · LATEST RELEASE</p><h2>${esc(p.title)}</h2>
    <p>현재 공개 버전은 <strong>${esc(p.version||'Latest')}</strong>입니다. ${esc(p.platform||'')}용 파일을 바로 다운로드할 수 있습니다.</p>
    <div class="release-meta">${metaItems(p).map(x=>`<span>${esc(x)}</span>`).join('')}</div>
    ${p.releaseUrl?`<a class="release-notes-link" href="${esc(p.releaseUrl)}">릴리즈 정보 보기 ↗</a>`:''}</div>
    <a class="release-button" href="${esc(p.downloadUrl)}"><span>PATCH INSTALLER</span><b>DOWNLOAD ↓</b></a>
  </div>`;
}

document.querySelectorAll('[data-filter]').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('[data-filter]').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter=btn.dataset.filter||'all';
    renderProjects();
  });
});

async function loadProjects(){
  try{
    const r=await fetch(`data/projects.json?v=${Date.now()}`,{cache:'no-store'});
    if(!r.ok) throw new Error(`HTTP ${r.status}`);
    projectData=await r.json();
    if(!Array.isArray(projectData)) throw new Error('projects.json must be an array');
    renderProjects();
    renderLatestRelease();
  }catch(err){
    console.error(err);
    projectGrid.innerHTML='<div class="project-load-error">프로젝트 데이터를 불러오지 못했습니다.<br><small>data/projects.json 파일을 확인해주세요.</small></div>';
  }
}
loadProjects();

