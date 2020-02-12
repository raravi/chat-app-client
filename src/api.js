import io from 'socket.io-client';

let socket;

function connectSocket(setUserAuthenticated) {
  socket = io('http://192.168.1.99:8000', {
    reconnection: false
  });
  socket.on('connect', () => {
    console.log('Connected');
  });
  socket.on('reconnect', () => {
    console.log('Reconnected');
  });
  socket.on('disconnect', () => {
    console.log('Disconnected');
    setUserAuthenticated(null);
  });
}

function authenticateUser(user) {
  socket.emit('authenticateUser', user);
}

function getOldMessages(cb) {
  socket.on('getOldMessages', messages => cb(messages));
}

function subscribeToNewMessages(cb) {
  socket.on('newMessage', message => cb(message));
}

function sendMessage(message) {
  socket.emit('sendMessage', message);
}

export { connectSocket, subscribeToNewMessages, getOldMessages, authenticateUser, sendMessage };
