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
const clipFallback = document.querySelector('#clip-fallback');
document.querySelectorAll('.clip[data-clip]').forEach(clip => clip.addEventListener('click', () => {
  const id = clip.dataset.clip;
  openClip.href = `https://www.twitch.tv/helbbiz/clip/${id}`;
  if (!isPublicDomain) {
    clipPlayer.hidden = true;
    clipFallback.hidden = false;
    dialog.showModal();
    return;
  }
  clipPlayer.hidden = false;
  clipFallback.hidden = true;
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

// Keep the objects around the black hole moving even when the operating system
// requests reduced motion (the rest of the site still respects that setting).
const flybyPaths = [
  ['translate3d(42vw,-18vh,0) rotate(20deg)', 'translate3d(-43vw,48vh,0) rotate(20deg)', 7600],
  ['translate3d(29vw,37vh,0) rotate(145deg)', 'translate3d(-48vw,-34vh,0) rotate(145deg)', 10500],
  ['translate3d(45vw,22vh,0) rotate(-32deg)', 'translate3d(-43vw,-45vh,0) rotate(-32deg)', 8800],
  ['translate3d(37vw,-8vh,0) rotate(28deg)', 'translate3d(-50vw,55vh,0) rotate(28deg)', 11600],
  ['translate3d(34vw,38vh,0) rotate(152deg)', 'translate3d(-46vw,-26vh,0) rotate(152deg)', 9500],
  ['translate3d(49vw,15vh,0) rotate(-27deg)', 'translate3d(-43vw,-52vh,0) rotate(-27deg)', 13200]
];
document.querySelectorAll('.comet').forEach((comet, index) => {
  const [start, end, duration] = flybyPaths[index];
  comet.animate([{ transform: start, opacity: 0 }, { transform: start, opacity: 1, offset: .13 }, { transform: end, opacity: 1, offset: .8 }, { transform: end, opacity: 0 }], { duration, delay: -index * 1400, iterations: Infinity, easing: 'linear' });
});
document.querySelectorAll('.rock').forEach((rock, index) => {
  rock.animate([{ transform: 'translate3d(0,0,0) rotate(0deg)' }, { transform: `translate3d(${-110 - index * 30}px,${55 + index * 36}px,0) rotate(${270 + index * 80}deg)` }, { transform: 'translate3d(0,0,0) rotate(540deg)' }], { duration: 5800 + index * 1200, delay: -index * 900, iterations: Infinity, easing: 'ease-in-out' });
});

