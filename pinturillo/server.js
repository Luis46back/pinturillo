const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let rooms = {};

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('Nuevo jugador conectado:', socket.id);

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    if (!rooms[roomId]) {
      rooms[roomId] = [];
    }
    rooms[roomId].push(socket.id);
    io.to(roomId).emit('playerList', rooms[roomId]);
  });

  socket.on('draw', (data) => {
    socket.to(data.room).emit('draw', data);
  });

  socket.on('guess', ({ room, guess, player }) => {
    socket.to(room).emit('guess', { player, guess });
    // Aquí puedes comparar si el guess es correcto
  });

  socket.on('disconnect', () => {
    for (const room in rooms) {
      rooms[room] = rooms[room].filter(id => id !== socket.id);
      io.to(room).emit('playerList', rooms[room]);
    }
  });
});

server.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
