/* STEMpathi site: phone menu. Plain JS, no storage, no network. */
(() => {
  document.documentElement.classList.add('js');
  const btn = document.querySelector('.menu-btn'), menu = document.getElementById('site-menu');
  if (!btn || !menu) return;
  const set = open => { btn.setAttribute('aria-expanded', String(open)); menu.classList.toggle('open', open); };
  btn.addEventListener('click', () => set(btn.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', e => { if (e.target.closest('a')) set(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') { set(false); btn.focus(); } });
  document.addEventListener('click', e => { if (!e.target.closest('header nav')) set(false); });
})();
