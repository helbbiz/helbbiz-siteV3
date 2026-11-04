const targets = document.querySelectorAll('a[href^="#"]');
targets.forEach(link => link.addEventListener('click', event => {
  const target = document.querySelector(link.getAttribute('href'));
  if (target) { event.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
}));

const reveal = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('in-view'); reveal.unobserve(entry.target); } });
}, { threshold: .08 });
document.querySelectorAll('.section, .connect').forEach(section => reveal.observe(section));

const dockItems = [...document.querySelectorAll('.dock-item[href^="#"]')];
const navSections = [...document.querySelectorAll('main section[id]')];
const navigation = new IntersectionObserver(entries => {
  const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;
  dockItems.forEach(item => item.classList.toggle('active', item.getAttribute('href') === `#${visible.target.id}`));
}, { rootMargin: '-35% 0px -45% 0px', threshold: .02 });
navSections.forEach(section => navigation.observe(section));

const parent = window.location.hostname || 'localhost';
const player = document.querySelector('#twitch-player');
const playerFallback = document.querySelector('#player-fallback');
const isPublicDomain = parent.includes('.') && parent !== 'localhost' && !/^\d{1,3}(\.\d{1,3}){3}$/.test(parent);
if (isPublicDomain) {
  player.src = `https://player.twitch.tv/?channel=helbbiz&parent=${encodeURIComponent(parent)}&muted=true&autoplay=false`;
  player.hidden = false;
  player.addEventListener('load', () => { playerFallback.hidden = true; }, { once: true });
} else {
  document.querySelector('#player-copy').textContent = 'Twitch embeds need a public domain. Deploy this site to Render, then the live player will appear here automatically.';
}

const dialog = document.querySelector('#clip-dialog');
const clipPlayer = document.querySelector('#clip-player');
const openClip = document.querySelector('#open-clip');
document.querySelectorAll('.clip[data-clip]').forEach(clip => clip.addEventListener('click', () => {
  const id = clip.dataset.clip;
  openClip.href = `https://www.twitch.tv/helbbiz/clip/${id}`;
  if (!isPublicDomain) { window.open(openClip.href, '_blank', 'noopener'); return; }
  clipPlayer.src = `https://clips.twitch.tv/embed?clip=${encodeURIComponent(id)}&parent=${encodeURIComponent(parent)}&autoplay=true`;
  dialog.showModal();
}));
document.querySelector('.close-clip').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => { clipPlayer.src = ''; });

const hole = document.querySelector('.black-hole');
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  window.addEventListener('pointermove', event => {
    const x = (event.clientX / innerWidth - .5) * 14;
    const y = (event.clientY / innerHeight - .5) * 14;
    hole.style.marginRight = `${x}px`;
    hole.style.marginTop = `${y}px`;
  }, { passive: true });
}

