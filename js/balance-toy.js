/* STEMpathi site: "Try it here" balance. Two tabs: Find x (x + 3 = 8 style) and Make it level.
   Plain JS. No storage, no network, no outside hosts. Respects prefers-reduced-motion. */
(() => {
  const root = document.getElementById('try');
  if (!root) return;
  const $ = s => root.querySelector(s);
  const svg = $('#toy-svg'), beam = $('#beam'), panL = $('#panL'), panR = $('#panR');
  const eq = $('.toy-eq'), read = $('.toy-read');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const PUZZLES = [[5, 3], [4, 2], [5, 4], [6, 1]]; // [x, cubes beside x]: x + 3 = 8, x + 2 = 6, x + 4 = 9, x + 1 = 7
  const MAX = 10, PER = 3, CX = 260, CY = 104, ARM = 170;
  const st = { mode: 'findx', p: 0, a: 3, b: 8, x: 5, L: 3, R: 1 };
  let ang = 0, vel = 0, target = 0, raf = null, open = 0, openT = 0;

  function cube(x, y, s) {
    return '<g transform="translate(' + x + ',' + y + ')"><rect width="' + s + '" height="' + s + '" rx="6" fill="#9fe3c9" fill-opacity=".92" stroke="#5bb79a" stroke-width="1.5"/>' +
      '<rect x="3" y="3" width="' + (s - 6) + '" height="' + (s * 0.32) + '" rx="4" fill="#fff" fill-opacity=".35"/>' +
      '<text x="' + s / 2 + '" y="' + (s * 0.68) + '" font-size="' + (s * 0.42) + '" text-anchor="middle" fill="#173d40" font-weight="700" font-family="Fredoka,Inter,sans-serif">+1</text></g>';
  }
  function xbox(x, y, lift) { // 46 x 40 box; lift 0..1 opens the lid and shows the cubes inside
    let h = '';
    if (lift > 0) { // the x cubes rise out of the box at full size (23 px, same as the others)
      const n = st.x, s = 23, cols = Math.min(n, 3);
      for (let i = 0; i < n; i++) { const c = i % 3, r = Math.floor(i / 3);
        h += '<g opacity="' + lift + '">' + cube(x + 23 - cols * 12.5 + c * 25, y - 26 - lift * 30 - r * 25, s) + '</g>'; }
    }
    h += '<rect x="' + x + '" y="' + y + '" width="46" height="40" rx="7" fill="#2a4c9a" stroke="#1b336e" stroke-width="2"/>';
    h += '<g transform="rotate(' + (-lift * 75) + ' ' + x + ' ' + y + ')"><rect x="' + (x - 2) + '" y="' + (y - 8) + '" width="50" height="11" rx="5" fill="#3459ad" stroke="#1b336e" stroke-width="2"/></g>';
    if (lift < 0.5) h += '<text x="' + (x + 23) + '" y="' + (y + 29) + '" font-size="24" text-anchor="middle" fill="#fff" font-weight="700" font-family="Fredoka,Inter,sans-serif">x</text>';
    return h;
  }
  function pan(g, x, y, items) {
    let h = '<line x1="' + x + '" y1="' + y + '" x2="' + (x - 60) + '" y2="' + (y + 120) + '" stroke="#1f7a74" stroke-width="3"/>' +
      '<line x1="' + x + '" y1="' + y + '" x2="' + (x + 60) + '" y2="' + (y + 120) + '" stroke="#1f7a74" stroke-width="3"/>' +
      '<ellipse cx="' + x + '" cy="' + (y + 128) + '" rx="84" ry="8" fill="#000" fill-opacity=".08"/>' +
      '<ellipse cx="' + x + '" cy="' + (y + 122) + '" rx="82" ry="15" fill="#f6f1e6" stroke="#d9d2c0" stroke-width="2"/>';
    h += items(x, y + 118);
    g.innerHTML = h;
  }
  function stack(n, x0, base) {
    let h = '';
    for (let i = 0; i < n; i++) { const c = i % 5, r = Math.floor(i / 5); h += cube(x0 + c * 25, base - 24 - r * 25, 23); }
    return h;
  }
  function draw() {
    const a = ang * Math.PI / 180;
    beam.setAttribute('transform', 'rotate(' + ang + ' ' + CX + ' ' + CY + ')');
    const lx = CX - ARM * Math.cos(a), ly = CY - ARM * Math.sin(a), rx = CX + ARM * Math.cos(a), ry = CY + ARM * Math.sin(a);
    if (st.mode === 'findx') {
      pan(panL, lx, ly, (x, base) => xbox(x - 56, base - 40, open) + stack(st.a, x - 4, base));
      pan(panR, rx, ry, (x, base) => stack(st.b, x - 62, base));
    } else {
      pan(panL, lx, ly, (x, base) => stack(st.L, x - 62, base));
      pan(panR, rx, ry, (x, base) => stack(st.R, x - 62, base));
    }
  }
  function tick() {
    vel += (target - ang) * 0.08; vel *= 0.82; ang += vel;
    if (open < openT) open = Math.min(openT, open + 0.06);
    draw();
    if (Math.abs(target - ang) > 0.05 || Math.abs(vel) > 0.05 || open < openT) raf = requestAnimationFrame(tick);
    else { ang = target; open = openT; draw(); raf = null; }
  }
  function show(sel, on) { root.querySelectorAll(sel).forEach(e => { e.hidden = !on; }); }
  function update(msg) {
    let left, right, diff;
    if (st.mode === 'findx') {
      left = st.x + st.a; right = st.b; diff = right - left;
      const level = diff === 0, alone = st.a === 0 && level;
      eq.textContent = alone ? 'x = ' + st.x : (st.a ? 'x + ' + st.a : 'x') + (level ? ' = ' : ' ≠ ') + st.b;
      openT = alone ? 1 : 0;
      show('[data-a="both-"]', !alone && level); show('[data-a="both+"]', level && !alone && st.a < PUZZLES[st.p][1]);
      show('[data-a="left-"]', level && !alone && st.a > 0); show('[data-a="left+"]', !level);
      show('[data-a="next"]', alone);
      read.textContent = msg || (alone ? 'x is worth ' + st.x + '. The box held ' + st.x + ' cubes.' :
        level ? eq.textContent + '. The scale is level.' : 'The left side is lighter. Do the same on both pans to keep it level.');
    } else {
      left = st.L; right = st.R; diff = right - left;
      read.textContent = st.L + ' and ' + st.R + ' — ' + (diff === 0 ? 'Level! Both sides match.' : diff < 0 ? 'The left side is heavier.' : 'The right side is heavier.');
    }
    target = Math.max(-MAX, Math.min(MAX, diff * PER));
    if (reduce) { ang = target; open = openT; draw(); } else if (!raf) raf = requestAnimationFrame(tick);
  }
  function load(i) { st.p = i % PUZZLES.length; [st.x, st.a] = PUZZLES[st.p]; st.b = st.x + st.a; open = openT = 0; }
  root.querySelectorAll('[data-a]').forEach(b => b.addEventListener('click', () => {
    const a = b.dataset.a;
    if (a === 'both-' && st.a > 0 && st.b > 0) { st.a--; st.b--; }
    else if (a === 'both+') { st.a++; st.b++; }
    else if (a === 'left-' && st.a > 0) { st.a--; }
    else if (a === 'left+') { st.a++; }
    else if (a === 'next') { load(st.p + 1); }
    else if (a === 'restart') { load(st.p); }
    else if (a === 'L+') st.L = Math.min(12, st.L + 1);
    else if (a === 'L-') st.L = Math.max(0, st.L - 1);
    else if (a === 'R+') st.R = Math.min(12, st.R + 1);
    else if (a === 'R-') st.R = Math.max(0, st.R - 1);
    else if (a === 'level0') { st.L = 3; st.R = 1; }
    update();
  }));
  root.querySelectorAll('[role="tab"]').forEach(t => t.addEventListener('click', () => {
    st.mode = t.dataset.mode;
    root.querySelectorAll('[role="tab"]').forEach(o => o.setAttribute('aria-selected', String(o === t)));
    show('.toy-findx', st.mode === 'findx'); show('.toy-level', st.mode === 'level');
    open = openT = 0; update();
  }));
  load(0); update();
})();
