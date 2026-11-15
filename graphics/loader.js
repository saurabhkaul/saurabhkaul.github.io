const canvas = document.querySelector('#screensaver');
const toggle = document.querySelector('#toggle');
const reset = document.querySelector('#reset');
const status = document.querySelector('#graphics-status');
status.textContent = 'Loading animation…';
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let renderer;
let playing = !reducedMotion.matches;
let yaw = 0.25;
let pitch = 0.0;
let elapsed = 0;
let frame = 0;
let previousTime;
let drag;
let failed = false;

function fail(error) {
  console.error('Screensaver renderer:', error);
  failed = true;
  cancelAnimationFrame(frame);
  frame = 0;
  toggle.disabled = reset.disabled = true;
  canvas.removeAttribute('tabindex');
  status.textContent = 'Animation unavailable. Try a browser with WebGPU or WebGL2 enabled, or reload to try again.';
}

function draw() {
  if (!renderer || failed || document.hidden) return;
  const bounds = canvas.getBoundingClientRect();
  const scale = Math.min(devicePixelRatio || 1, 2, 1200 / Math.max(bounds.width, bounds.height));
  const width = Math.max(1, Math.round(bounds.width * scale));
  const height = Math.max(1, Math.round(bounds.height * scale));
  if (canvas.width !== width) canvas.width = width;
  if (canvas.height !== height) canvas.height = height;
  try { renderer.render(width, height, yaw, pitch, elapsed); }
  catch (error) { fail(error); }
}

function animate(time) {
  frame = 0;
  if (!playing || document.hidden || failed) return;
  if (previousTime !== undefined) {
    const delta = Math.min((time - previousTime) / 1000, 0.05);
    elapsed += delta;
    // The background animates; the statue stays at the angle chosen by the visitor.
  }
  previousTime = time;
  draw();
  if (!failed) frame = requestAnimationFrame(animate);
}

function syncPlayback() {
  cancelAnimationFrame(frame);
  frame = 0;
  previousTime = undefined;
  toggle.textContent = playing ? 'Pause' : 'Play';
  if (renderer && !failed && !document.hidden) {
    draw();
    if (playing && !failed) frame = requestAnimationFrame(animate);
  }
}

toggle.addEventListener('click', () => { playing = !playing; syncPlayback(); });
reset.addEventListener('click', () => { yaw = 0.25; pitch = 0.0; elapsed = 0; draw(); });
reducedMotion.addEventListener('change', () => {
  if (reducedMotion.matches) { playing = false; syncPlayback(); }
});
document.addEventListener('visibilitychange', () => { drag = undefined; syncPlayback(); });
new ResizeObserver(draw).observe(canvas);
window.addEventListener('resize', draw);
canvas.addEventListener('pointerdown', event => {
  if (!renderer || failed || !event.isPrimary || event.button !== 0) return;
  drag = { id: event.pointerId, x: event.clientX, y: event.clientY };
  canvas.setPointerCapture(event.pointerId);
  canvas.focus({ preventScroll: true });
});
canvas.addEventListener('pointermove', event => {
  if (!drag || event.pointerId !== drag.id) return;
  yaw += (event.clientX - drag.x) * 0.01;
  pitch = Math.max(-1.5, Math.min(1.5, pitch + (event.clientY - drag.y) * 0.01));
  drag.x = event.clientX;
  drag.y = event.clientY;
  draw();
});
canvas.addEventListener('lostpointercapture', () => { drag = undefined; });
canvas.addEventListener('pointerup', () => { drag = undefined; });
canvas.addEventListener('pointercancel', () => { drag = undefined; });
canvas.addEventListener('keydown', event => {
  if (!renderer || failed || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
  event.preventDefault();
  if (event.key === 'ArrowLeft') yaw -= 0.1;
  if (event.key === 'ArrowRight') yaw += 0.1;
  if (event.key === 'ArrowUp') pitch = Math.max(-1.5, pitch - 0.1);
  if (event.key === 'ArrowDown') pitch = Math.min(1.5, pitch + 0.1);
  draw();
});

try {
  const { default: init, Renderer } = await import('./pkg/site_graphics.js');
  await init();
  const response = await fetch('../assets/models/venus.bin');
  if (!response.ok) throw new Error('Could not load the statue model');
  const mesh = new Uint8Array(await response.arrayBuffer());
  let backend = 'WebGPU';
  try {
    renderer = await Renderer.create(canvas, false, mesh);
  } catch (error) {
    console.info('Trying WebGL2 after WebGPU initialization failed:', error);
    backend = 'WebGL2';
    renderer = await Renderer.create(canvas, true, mesh);
  }
  status.textContent = `Rendered with ${backend}.`;
  toggle.disabled = reset.disabled = false;
  syncPlayback();
} catch (error) { fail(error); }
