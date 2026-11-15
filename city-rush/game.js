'use strict';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const overlay = document.getElementById('overlay');
const title = document.getElementById('overlayTitle');
const message = document.getElementById('overlayText');
const startButton = document.getElementById('startButton');
const scoreDisplay = document.getElementById('score');
const timeDisplay = document.getElementById('time');
const healthDisplay = document.getElementById('health');
const keys = new Set();
const road = { left: 225, right: 735 };
const carColors = ['#e8a28c', '#a9c0cf', '#c9ae76', '#a9a0c9', '#cfccc0'];
let game = null;
let lastFrame = 0;
let frameId = null;

function newGame() {
  return { player: { x: 480, y: 450, w: 38, h: 70 }, cars: [], cash: [],
    score: 0, health: 3, elapsed: 0, carTimer: 0.8, cashTimer: 1.5,
    roadOffset: 0, invincible: 0, running: true };
}

function resetGame() {
  if (frameId !== null) cancelAnimationFrame(frameId);
  keys.clear();
  game = newGame();
  updateHud();
  overlay.hidden = true;
  lastFrame = 0;
  frameId = requestAnimationFrame(frame);
}

function updateHud() {
  scoreDisplay.textContent = '$' + game.score.toLocaleString();
  const seconds = Math.floor(game.elapsed);
  timeDisplay.textContent = String(Math.floor(seconds / 60)).padStart(2, '0') + ':' + String(seconds % 60).padStart(2, '0');
  healthDisplay.textContent = '♥ '.repeat(game.health).trim() + (game.health < 3 ? ' ♡'.repeat(3 - game.health) : '');
}

function overlaps(a, b) {
  return Math.abs(a.x - b.x) < (a.w + b.w) / 2 && Math.abs(a.y - b.y) < (a.h + b.h) / 2;
}

function update(dt) {
  game.elapsed += dt;
  const speed = Math.min(270, 155 + game.elapsed * 2);
  game.roadOffset = (game.roadOffset + speed * dt) % 80;
  game.invincible = Math.max(0, game.invincible - dt);
  const p = game.player;
  const dx = (keys.has('ArrowRight') || keys.has('d') ? 1 : 0) - (keys.has('ArrowLeft') || keys.has('a') ? 1 : 0);
  const dy = (keys.has('ArrowDown') || keys.has('s') ? 1 : 0) - (keys.has('ArrowUp') || keys.has('w') ? 1 : 0);
  const magnitude = Math.hypot(dx, dy) || 1;
  p.x = Math.max(road.left + p.w / 2 + 8, Math.min(road.right - p.w / 2 - 8, p.x + dx / magnitude * 250 * dt));
  p.y = Math.max(p.h / 2 + 5, Math.min(canvas.height - p.h / 2 - 5, p.y + dy / magnitude * 250 * dt));

  game.carTimer -= dt;
  if (game.carTimer <= 0) {
    const lane = Math.floor(Math.random() * 4);
    game.cars.push({ x: road.left + 64 + lane * 127, y: -80, w: 40, h: 72,
      speed: speed * (0.75 + Math.random() * 0.5), color: carColors[Math.floor(Math.random() * carColors.length)] });
    game.carTimer = Math.max(0.55, 1.25 - game.elapsed * 0.008) + Math.random() * 0.45;
  }
  game.cashTimer -= dt;
  if (game.cashTimer <= 0) {
    game.cash.push({ x: road.left + 64 + Math.floor(Math.random() * 4) * 127, y: -30, w: 32, h: 32 });
    game.cashTimer = 2 + Math.random() * 1.3;
  }
  for (const car of game.cars) {
    car.y += car.speed * dt;
    if (game.invincible === 0 && overlaps(p, car)) {
      game.health--;
      game.invincible = 1.5;
      if (game.health <= 0) endGame();
    }
  }
  for (const cash of game.cash) {
    cash.y += speed * dt;
    if (overlaps(p, cash)) { cash.collected = true; game.score += 100; }
  }
  game.cars = game.cars.filter(car => car.y < canvas.height + 80);
  game.cash = game.cash.filter(cash => cash.y < canvas.height + 30 && !cash.collected);
  updateHud();
}

function endGame() {
  game.running = false;
  keys.clear();
  title.textContent = 'Run complete.';
  message.textContent = `You collected $${game.score.toLocaleString()} and survived ${Math.floor(game.elapsed)} seconds. Ready for another ride?`;
  startButton.innerHTML = 'PLAY AGAIN <span>↗</span>';
  overlay.hidden = false;
}

function drawCar(car, color, player = false) {
  ctx.save();
  ctx.translate(car.x, car.y);
  ctx.fillStyle = '#0008'; ctx.fillRect(-car.w / 2 + 4, -car.h / 2 + 6, car.w, car.h);
  ctx.fillStyle = color; ctx.beginPath(); ctx.roundRect(-car.w / 2, -car.h / 2, car.w, car.h, 7); ctx.fill();
  ctx.fillStyle = '#1b303a'; ctx.beginPath(); ctx.roundRect(-car.w / 2 + 5, -car.h / 2 + 15, car.w - 10, 30, 4); ctx.fill();
  ctx.fillStyle = '#71939b'; ctx.fillRect(-car.w / 2 + 7, -car.h / 2 + 17, car.w - 14, 5);
  ctx.fillStyle = player ? '#f4ffbb' : '#ffdbb0'; ctx.fillRect(-car.w / 2 + 3, -car.h / 2 + 1, 7, 4); ctx.fillRect(car.w / 2 - 10, -car.h / 2 + 1, 7, 4);
  ctx.fillStyle = '#f17868'; ctx.fillRect(-car.w / 2 + 3, car.h / 2 - 5, 7, 4); ctx.fillRect(car.w / 2 - 10, car.h / 2 - 5, 7, 4);
  ctx.restore();
}

function drawScene() {
  ctx.fillStyle = '#202e35'; ctx.fillRect(0, 0, 960, 560);
  // Sidewalks and buildings give the street a city-at-night backdrop.
  ctx.fillStyle = '#53615c'; ctx.fillRect(190, 0, 35, 560); ctx.fillRect(735, 0, 35, 560);
  const offset = game ? game.roadOffset : 0;
  for (let y = -160 + offset * 2; y < 600; y += 160) {
    for (const x of [20, 790]) {
      ctx.fillStyle = '#111e25'; ctx.fillRect(x, y, 150, 126);
      ctx.fillStyle = '#30454a'; ctx.fillRect(x + 8, y + 8, 134, 110);
      ctx.fillStyle = '#1d3037'; ctx.fillRect(x + 16, y + 16, 118, 94);
      ctx.fillStyle = '#b3a770';
      for (let wx = x + 25; wx < x + 130; wx += 28) for (let wy = y + 26; wy < y + 100; wy += 25) ctx.fillRect(wx, wy, 9, 7);
    }
  }
  ctx.fillStyle = '#313d43'; ctx.fillRect(road.left, 0, road.right - road.left, 560);
  ctx.fillStyle = '#d5d0a0'; ctx.fillRect(road.left + 7, 0, 3, 560); ctx.fillRect(road.right - 10, 0, 3, 560);
  ctx.fillStyle = '#b5b8a4';
  for (let lane = 1; lane < 4; lane++) for (let y = -80 + offset; y < 560; y += 80) ctx.fillRect(road.left + lane * 127 - 2, y, 4, 38);
  if (game) {
    for (const cash of game.cash) {
      ctx.fillStyle = '#132d24'; ctx.beginPath(); ctx.arc(cash.x, cash.y, 19, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#d9fa5d'; ctx.font = 'bold 25px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('$', cash.x, cash.y + 1);
    }
    for (const car of game.cars) drawCar(car, car.color);
    if (!game.invincible || Math.floor(game.invincible * 8) % 2 === 0) drawCar(game.player, '#d9fa5d', true);
  } else drawCar({ x: 480, y: 400, w: 38, h: 70 }, '#d9fa5d', true);
}

function frame(timestamp) {
  if (!game || !game.running) { frameId = null; return; }
  const dt = lastFrame ? Math.min((timestamp - lastFrame) / 1000, 0.05) : 0;
  lastFrame = timestamp;
  update(dt);
  drawScene();
  if (game.running) frameId = requestAnimationFrame(frame);
  else frameId = null;
}

const allowed = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd']);
window.addEventListener('keydown', event => {
  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
  if (allowed.has(key) && game && game.running) { event.preventDefault(); keys.add(key); }
});
window.addEventListener('keyup', event => keys.delete(event.key.length === 1 ? event.key.toLowerCase() : event.key));
window.addEventListener('blur', () => keys.clear());
document.querySelectorAll('[data-key]').forEach(button => {
  const key = button.dataset.key;
  button.addEventListener('pointerdown', event => { event.preventDefault(); button.setPointerCapture(event.pointerId); keys.add(key); });
  for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) button.addEventListener(type, () => keys.delete(key));
});
startButton.addEventListener('click', resetGame);
drawScene();
