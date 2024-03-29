'use strict';

const net = require('net');

const PORT = process.env.PORT || 3001;
const server = net.createServer();

server.listen(PORT, () => console.log(`Server up on ${PORT}`) );

let socketPool = {};

server.on('connection', (socket) => {
  const id = `Socket-${Math.random()}`;
  socketPool[id] = socket;
  socket.on('data', (buffer) => dispatchEvent(buffer));
  socket.on('close', () => {
    delete socketPool[id];
  });
});

let dispatchEvent = (buffer) => {
  let text = buffer.toString().trim();
  const [eventType, eventPayload] = text.split(':');
  console.log(eventType, eventPayload);
  for (let socket in socketPool) {
    socketPool[socket].write(`${eventType}:${eventPayload}`);
  }
};


