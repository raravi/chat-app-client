import io from 'socket.io-client';
import { appApiDetails } from './config/apiDetails';

/**
 * This file contains the functions needed to connect to
 * socket.io for realtime communication.
 */
let socket;

/**
 * This function connects to the server upon login.
 */
function connectSocket(setUserAuthenticated) {
  socket = io(appApiDetails.url, {
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
    sessionStorage.removeItem("token");
  });
}

/**
 * This function disconnects from the server.
 */
function disconnectSocket() {
  socket.disconnect();
}

/**
 * This function asks the server to autheticate user upon login.
 */
function authenticateUser(user) {
  socket.emit('authenticateUser', user);
}

/**
 * This function gets chat history from the server upon login.
 */
function getOldMessages(cb) {
  socket.on('getOldMessages', messages => cb(messages));
}

/**
 * This function subscribes to new messages upon login.
 */
function subscribeToNewMessages(cb) {
  socket.on('newMessage', message => cb(message));
}

/**
 * This function sends new message from the user to the server.
 */
function sendMessage(message) {
  socket.emit('sendMessage', message);
}

export { connectSocket, disconnectSocket, subscribeToNewMessages, getOldMessages, authenticateUser, sendMessage };
