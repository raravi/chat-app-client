import ioMock from 'socket.io-client';
import { apiDetails } from './config/apiDetails';
import {  connectSocket,
          disconnectSocket,
          subscribeToNewMessages,
          authenticateUser,
          getOldMessages,
          sendMessage } from './api';

jest.mock('socket.io-client');

/**
 *   Stubs / Mocks.
 */
let setUserAuthenticated = () => {},
    message = {
      user: { id: 'dummyid', name: 'dummyname' },
      message: 'dummymessage',
      date: Date.now()
    },
    messages = [ message ],
    socket,
    user = {
      token : 'dummytoken'
    };

/**
 *   Unit tests for api.js
 */
describe('api.js: unit tests', () => {
  beforeEach(() => {
    socket = {
      on: jest.fn(() => {})
    };
    ioMock.mockImplementation(() => {
      return socket;
    });
  });

  afterEach(() => {
    ioMock.mockReset();
  });

  it('connectSocket', async () => {
    await connectSocket(setUserAuthenticated);
    expect(ioMock).toHaveBeenCalledTimes(1);
    expect(ioMock).toHaveBeenCalledWith(apiDetails.url, {
      reconnection: false
    });
    expect(socket.on.mock.calls[0][0]).toBe('connect');
    expect(socket.on.mock.calls[1][0]).toBe('reconnect');
    expect(socket.on.mock.calls[2][0]).toBe('disconnect');

    let callbackConnect = socket.on.mock.calls[0][1],
        callbackReconnect = socket.on.mock.calls[1][1],
        callbackDisconnect = socket.on.mock.calls[2][1];

    callbackConnect();
    callbackReconnect();
    callbackDisconnect();
  });

  it('disconnectSocket', async () => {
    socket.disconnect = jest.fn(() => {});
    await connectSocket(setUserAuthenticated);
    expect(ioMock).toHaveBeenCalledTimes(1);

    await disconnectSocket();
    expect(socket.disconnect).toHaveBeenCalledTimes(1);
  });

  it('authenticateUser', async () => {
    socket.emit = jest.fn(() => {});
    await connectSocket(setUserAuthenticated);
    expect(ioMock).toHaveBeenCalledTimes(1);

    await authenticateUser(user);
    expect(socket.emit).toHaveBeenCalledTimes(1);
    expect(socket.emit).toHaveBeenCalledWith('authenticateUser', user);
  });

  it('getOldMessages', async () => {
    let callbackGetOldMessages = jest.fn(() => {});
    await connectSocket(setUserAuthenticated);
    expect(ioMock).toHaveBeenCalledTimes(1);
    socket.on.mockReset();

    await getOldMessages(callbackGetOldMessages);
    expect(socket.on).toHaveBeenCalledTimes(1);
    expect(socket.on.mock.calls[0][0]).toBe('getOldMessages');
    let callbackSocket = socket.on.mock.calls[0][1];

    callbackSocket(messages);
    expect(callbackGetOldMessages).toHaveBeenCalledTimes(1);
    expect(callbackGetOldMessages).toHaveBeenCalledWith(messages);
  });

  it('subscribeToNewMessages', async () => {
    let callbackSubscribeToNewMessages = jest.fn(() => {});
    await connectSocket(setUserAuthenticated);
    expect(ioMock).toHaveBeenCalledTimes(1);
    socket.on.mockReset();

    await subscribeToNewMessages(callbackSubscribeToNewMessages);
    expect(socket.on).toHaveBeenCalledTimes(1);
    expect(socket.on.mock.calls[0][0]).toBe('newMessage');
    let callbackSocket = socket.on.mock.calls[0][1];

    callbackSocket(message);
    expect(callbackSubscribeToNewMessages).toHaveBeenCalledTimes(1);
    expect(callbackSubscribeToNewMessages).toHaveBeenCalledWith(message);
  });

  it('sendMessage', async () => {
    socket.emit = jest.fn(() => {});
    await connectSocket(setUserAuthenticated);
    expect(ioMock).toHaveBeenCalledTimes(1);
    expect(ioMock).toHaveReturnedWith(socket);

    await sendMessage(message);
    expect(socket.emit).toHaveBeenCalledTimes(1);
    expect(socket.emit).toHaveBeenCalledWith('sendMessage', message);
  });
});
