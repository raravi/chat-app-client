import openSocket from 'socket.io-client';
const socket = openSocket('http://192.168.1.99:8000');

function subscribeToTimer(interval, cb) {
  socket.on('timer', timestamp => cb(timestamp));
  socket.emit('subscribeToTimer', interval);
}

function authenticateUser(user) {
  socket.emit('authenticateUser', user);
}

function subscribeToNewMessages(cb) {
  socket.on('newMessage', message => cb(message));
}

function sendMessage(message) {
  socket.emit('sendMessage', message);
}

export { subscribeToTimer, subscribeToNewMessages, authenticateUser, sendMessage };
