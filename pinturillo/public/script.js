const socket = io();
let room = '';

function joinRoom() {
  room = document.getElementById('roomInput').value;
  socket.emit('joinRoom', room);
}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let drawing = false;

canvas.addEventListener('mousedown', () => drawing = true);
canvas.addEventListener('mouseup', () => drawing = false);
canvas.addEventListener('mousemove', draw);

function draw(e) {
  if (!drawing) return;
  const pos = { x: e.offsetX, y: e.offsetY };
  ctx.fillRect(pos.x, pos.y, 4, 4);
  socket.emit('draw', { room, x: pos.x, y: pos.y });
}

socket.on('draw', (data) => {
  ctx.fillRect(data.x, data.y, 4, 4);
});

document.getElementById('guessInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const guess = e.target.value;
    socket.emit('guess', { room, guess, player: socket.id });
    e.target.value = '';
  }
});

socket.on('guess', (data) => {
  console.log(`${data.player} adivinó: ${data.guess}`);
});
