const canvas = document.querySelector('#game-screen');
const screen = canvas.getContext('2d', { alpha: false });
const player = document.querySelector('#game-player');
const start = document.querySelector('#game-start');
const pause = document.querySelector('#game-pause');
const mute = document.querySelector('#game-mute');
const fullscreen = document.querySelector('#game-fullscreen');
const status = document.querySelector('#game-status');
const touchButtons = [...document.querySelectorAll('[data-key]')];
const keyCodes = new Map([
  ['ArrowLeft', 263], ['ArrowRight', 262], ['ArrowUp', 265], ['ArrowDown', 264],
  ['ControlLeft', 341], ['ControlRight', 345], ['AltLeft', 342], ['AltRight', 346],
  ['Enter', 257], ['Space', 32], ['Escape', 256], ['KeyY', 89], ['KeyN', 78],
  ['F1', 290], ['F2', 291], ['F3', 292], ['F9', 298], ['F10', 299],
]);
let emulator;
let runtime;
let bundle;
let configuration;
let generation = 0;
let loading = false;
let paused = false;
let muted = false;
let audio;
let volume;
let audioTime = 0;
let image;
const held = new Map();
const audioSources = new Set();

function releaseKeys() {
  for (const code of new Set(held.values())) emulator?.sendKeyEvent(code, false);
  held.clear();
  touchButtons.forEach(button => button.removeAttribute('data-held'));
}
function press(id, code) {
  if (!emulator || paused || held.has(id)) return;
  if (![...held.values()].includes(code)) emulator.sendKeyEvent(code, true);
  held.set(id, code);
}
function release(id) {
  const code = held.get(id);
  held.delete(id);
  if (code !== undefined && ![...held.values()].includes(code)) emulator?.sendKeyEvent(code, false);
}
function clearSound() {
  for (const source of audioSources) source.stop();
  audioSources.clear();
  audioTime = 0;
}
function setPaused(value) {
  if (!emulator) return;
  releaseKeys();
  paused = value;
  clearSound();
  if (paused) emulator.pause(); else emulator.resume();
  pause.textContent = paused ? 'Resume' : 'Pause';
  status.textContent = paused ? 'Paused.' : 'Playing. Click the screen to use the keyboard.';
}
function fail(error) {
  console.error('Dangerous Dave:', error);
  releaseKeys();
  clearSound();
  generation++;
  const old = emulator;
  emulator = undefined;
  old?.exit().catch(console.error);
  // Reset the upstream WASM cache so a failed download can be retried.
  runtime = undefined;
  if (window.compiled) delete window.compiled.WDOSBOX;
  start.textContent = 'Start game';
  status.textContent = 'Could not start the game. Select Start game to retry, or download the sampler below.';
  pause.disabled = mute.disabled = fullscreen.disabled = true;
}
function loadRuntime() {
  if (!runtime) runtime = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'vendor/emulators.js';
    script.onload = () => resolve(window.emulators);
    script.onerror = () => { script.remove(); runtime = undefined; reject(new Error('Emulator download failed')); };
    document.head.append(script);
  });
  return runtime;
}
async function prepare() {
  const library = await loadRuntime();
  library.pathPrefix = new URL('vendor/', location.href).href;
  if (!bundle || !configuration) {
    const responses = await Promise.all([fetch('gameedge.zip'), fetch('dosbox.conf')]);
    if (responses.some(response => !response.ok)) throw new Error('Game download failed');
    bundle = new Uint8Array(await responses[0].arrayBuffer());
    configuration = await responses[1].text();
  }
  return library;
}
function playSound(samples, instance) {
  if (!audio || audio.state !== 'running' || paused || muted || document.hidden) return;
  const length = Math.floor(samples.length / 2);
  if (!length) return;
  const buffer = audio.createBuffer(2, length, instance.soundFrequency());
  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel);
    for (let i = 0; i < length; i++) data[i] = samples[i * 2 + channel];
  }
  // Keep audio bounded if the browser throttles a worker or audio context.
  if (audioTime < audio.currentTime || audioTime > audio.currentTime + 0.25) audioTime = audio.currentTime + 0.02;
  const source = audio.createBufferSource();
  source.buffer = buffer;
  source.connect(volume);
  audioSources.add(source);
  source.onended = () => audioSources.delete(source);
  source.start(audioTime);
  audioTime += buffer.duration;
}
function paint(rgb, rgba) {
  if (!emulator) return;
  const width = emulator.width();
  const height = emulator.height();
  if (!width || !height) return;
  if (!image || image.width !== width || image.height !== height) {
    canvas.width = width;
    canvas.height = height;
    image = screen.createImageData(width, height);
  }
  if (rgba) image.data.set(rgba);
  else if (rgb) {
    for (let source = 0, target = 0; source < rgb.length; source += 3, target += 4) {
      image.data[target] = rgb[source];
      image.data[target + 1] = rgb[source + 1];
      image.data[target + 2] = rgb[source + 2];
      image.data[target + 3] = 255;
    }
  } else return;
  screen.putImageData(image, 0, 0);
}

start.addEventListener('click', async () => {
  if (loading) return;
  loading = true;
  start.disabled = true;
  pause.disabled = mute.disabled = fullscreen.disabled = true;
  const current = ++generation;
  status.textContent = 'Loading Dangerous Dave…';
  releaseKeys();
  clearSound();
  // Create audio during the user gesture, before any asynchronous loading.
  try {
    if (!audio) {
      audio = new AudioContext();
      volume = audio.createGain();
      volume.connect(audio.destination);
    }
    await audio.resume();
  } catch (error) { console.info('Audio unavailable:', error); }
  try {
    if (emulator) { const old = emulator; emulator = undefined; await old.exit(); }
    const library = await prepare();
    // Worker initialization transfers its archive buffer; preserve the cached copy.
    const instance = await library.dosboxWorker([bundle.slice(), {
      dosboxConf: configuration, jsdosConf: { version: '8' },
    }]);
    if (current !== generation) { await instance.exit(); return; }
    emulator = instance;
    paused = false;
    pause.textContent = 'Pause';
    instance.events().onFrame(paint);
    instance.events().onSoundPush(samples => playSound(samples, instance));
    instance.events().onExit(() => {
      if (current !== generation) return;
      releaseKeys(); clearSound(); emulator = undefined;
      pause.disabled = mute.disabled = fullscreen.disabled = true;
      start.textContent = 'Start game';
      status.textContent = 'Game closed. Select Start game to play again.';
    });
    start.textContent = 'Restart game';
    pause.disabled = false;
    mute.disabled = !audio;
    fullscreen.disabled = !player.requestFullscreen;
    status.textContent = 'Playing. Click the screen to use the keyboard.';
    if (document.hidden) setPaused(true);
    else canvas.focus({ preventScroll: true });
  } catch (error) { fail(error); }
  finally { loading = false; start.disabled = false; }
});
pause.addEventListener('click', () => {
  setPaused(!paused);
  if (!paused) { audio?.resume(); canvas.focus({ preventScroll: true }); }
});
mute.addEventListener('click', () => {
  muted = !muted;
  if (volume) volume.gain.value = muted ? 0 : 1;
  clearSound();
  mute.textContent = muted ? 'Unmute' : 'Mute';
  mute.setAttribute('aria-pressed', String(muted));
});
fullscreen.addEventListener('click', async () => {
  try { await player.requestFullscreen(); canvas.focus({ preventScroll: true }); }
  catch { status.textContent = 'Fullscreen is unavailable in this browser. You can keep playing here.'; }
});
canvas.addEventListener('keydown', event => {
  if (event.metaKey || (event.ctrlKey && event.code.startsWith('Key'))) return;
  const code = keyCodes.get(event.code);
  if (code === undefined || !emulator) return;
  event.preventDefault();
  press(`keyboard:${event.code}`, code);
});
canvas.addEventListener('keyup', event => {
  if (!keyCodes.has(event.code)) return;
  event.preventDefault();
  release(`keyboard:${event.code}`);
});
canvas.addEventListener('blur', releaseKeys);
window.addEventListener('blur', () => { if (emulator && !paused) setPaused(true); });
document.addEventListener('visibilitychange', () => { if (document.hidden && emulator) setPaused(true); });
for (const button of touchButtons) {
  button.addEventListener('pointerdown', event => {
    if (!emulator || paused || event.button !== 0) return;
    event.preventDefault();
    button.setPointerCapture(event.pointerId);
    button.setAttribute('data-held', '');
    press(`pointer:${event.pointerId}`, Number(button.dataset.key));
  });
  for (const eventName of ['pointerup', 'pointercancel', 'lostpointercapture']) {
    button.addEventListener(eventName, event => { release(`pointer:${event.pointerId}`); button.removeAttribute('data-held'); });
  }
  // Native click activation also makes the touch buttons usable with a keyboard.
  button.addEventListener('click', event => {
    if (event.detail === 0 && emulator && !paused) emulator.simulateKeyPress(Number(button.dataset.key));
  });
}
window.addEventListener('pagehide', () => { generation++; releaseKeys(); clearSound(); emulator?.exit(); emulator = undefined; });
window.addEventListener('pageshow', event => {
  if (!event.persisted) return;
  pause.disabled = mute.disabled = fullscreen.disabled = true;
  start.disabled = false; start.textContent = 'Start game';
  status.textContent = 'Select Start game to play.';
});
if (screen && typeof WebAssembly !== 'undefined') {
  start.disabled = false;
  status.textContent = 'Select Start game to play. A keyboard or the buttons below the screen control Dave.';
} else status.textContent = 'This browser needs WebAssembly and canvas support to play. You can download the sampler below.';
