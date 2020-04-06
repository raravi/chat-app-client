import React from 'react';
import { act, render, cleanup, fireEvent } from '@testing-library/react';
import ReactTestUtils from 'react-dom/test-utils';
import '@testing-library/jest-dom/extend-expect';
import axiosMock from 'axios';
import jwtDecodeMock from 'jwt-decode';
import {  connectSocket,
          disconnectSocket,
          subscribeToNewMessages,
          authenticateUser,
          getOldMessages,
          sendMessage } from './api';
import App from './App';

jest.mock('axios');
jest.mock('jwt-decode');
jest.mock('./api');
console.error = jest.fn();

/**
 *   A Mock Event.
 */
const mockEvent = () => {
  return {
    key: "",
    keyCode: null,
    preventDefault: () => {}
  };
};

/**
 *   Stubs / Mocks.
 */
let dummyMessage = {
      user: {
        id: 'dummyid',
        name: 'dummyname'
      },
      message: 'dummymessage'
    },
    loginData = {
      token: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlNDVmNzUzZWNkNzRkYzUxODc1ZDNkOSIsIm5hbWUiOiJBbWl0aCBSYXJhdmkiLCJpYXQiOjE1ODYxMzMyNTQsImV4cCI6MTYxNzY5MDE4MH0.rlS_1QxEHh5BU1DeJOIoaZmvpfzSn3qmpNV4mAP1LWg',
      tokenDecoded: {
        id: "5e45f753ecd74dc51875d3d9",
        name: "Amith Raravi",
        iat: 1586133254,
        exp: 1617690180
      },
      url: 'http://localhost:8000/api/users/login',
      options: {"email": "", "password": ""},
      successResponse: null,
      emailError: "Email not found",
      passwordError: "Password incorrect",
      errorResponse: null
    },
    registerData = {
      createdUser: "New user registered successfully!",
      url: "http://localhost:8000/api/users/register",
      options: {"name": "", "email": "", "password": "", "password2": ""},
      successResponse: {
        data: {
          createduser: "New user registered successfully!"
        }
      },
      nameError: "Name field is required",
      emailError: "Email already exists",
      passwordError: "Password must be at least 6 characters",
      password2Error: "Passwords must match",
      errorResponse: null
    },
    forgotPasswordData = {
      url: "http://localhost:8000/api/users/forgotpassword",
      options: {"email": ""},
      emailSent: 'The reset email has been sent, please check your inbox!',
      successResponse: null,
      emailError: "Email not found",
      errorResponse: null
    };

afterEach(() => {
  axiosMock.post.mockReset();
});

/**
 * LOGIN page
 */
describe('Login Page', () => {
  beforeEach(() => {
    loginData.successResponse = {
      data: {
        success: true
      }
    };
    loginData.errorResponse = {
      response: {
        status: 404,
        data: {
          email: "",
          password: ""
        }
      }
    };
  });

  afterEach(() => {
    jwtDecodeMock.mockReset();
    connectSocket.mockReset();
    disconnectSocket.mockReset();
    subscribeToNewMessages.mockReset();
    authenticateUser.mockReset();
    getOldMessages.mockReset();
    sendMessage.mockReset();
  });

  it('submit button is present', () => {
    const { getByTestId } = render(<App />);

    expect(getByTestId('login-button')).toBeInTheDocument();
  });

  it('login is successful', async () => {
    let callbackSubscribeToNewMessages, callbackGetOldMessages;
    subscribeToNewMessages.mockImplementation(cb => {
      callbackSubscribeToNewMessages = cb;
    });
    getOldMessages.mockImplementation(cb => {
      callbackGetOldMessages = cb;
    });
    loginData.successResponse.data.token = loginData.token;
    axiosMock.post.mockResolvedValueOnce(loginData.successResponse);
    jwtDecodeMock.mockImplementation(() => loginData.tokenDecoded);
    const { getByTestId, findByTestId } = render(<App />);

    fireEvent.click(getByTestId('login-button'));

    const dashboardNoteElement = await findByTestId('message-section');
    expect(axiosMock.post).toHaveBeenCalledTimes(1);
    expect(axiosMock.post).toHaveBeenCalledWith(loginData.url, loginData.options);
    expect(jwtDecodeMock).toHaveBeenCalledTimes(1);
    expect(jwtDecodeMock).toHaveBeenCalledWith(loginData.token);
    expect(connectSocket).toHaveBeenCalledTimes(1);
    expect(subscribeToNewMessages).toHaveBeenCalledTimes(1);
    expect(authenticateUser).toHaveBeenCalledTimes(1);
    expect(getOldMessages).toHaveBeenCalledTimes(1);

    callbackSubscribeToNewMessages(dummyMessage);
    callbackGetOldMessages([dummyMessage]);
  });

  it('login is successful: jwtDecode returns null', async () => {
    loginData.successResponse.data.token = loginData.token;
    axiosMock.post.mockResolvedValueOnce(loginData.successResponse);
    jwtDecodeMock.mockImplementation(() => null);
    const { getByTestId, findByTestId } = render(<App />);

    fireEvent.click(getByTestId('login-button'));

    try {
      const dashboardNoteElement = await findByTestId('message-section');
    } catch(error) {
      let errorString = "" + error;
      if (!errorString.includes('TestingLibraryElementError: Unable to find an element by: [data-testid="message-section"]'))
        throw error;
    }
    expect(axiosMock.post).toHaveBeenCalledTimes(1);
    expect(axiosMock.post).toHaveBeenCalledWith(loginData.url, loginData.options);
    expect(jwtDecodeMock).toHaveBeenCalledTimes(1);
    expect(jwtDecodeMock).toHaveBeenCalledWith(loginData.token);
  });

  it('login error: no response.data.email', async () => {
    loginData.errorResponse.response.data.password = loginData.passwordError;
    axiosMock.post.mockImplementation(() => Promise.reject(loginData.errorResponse));
    const { getByTestId, findByText } = render(<App />);

    fireEvent.click(getByTestId('login-button'));

    const passwordErrorElement = await findByText(loginData.errorResponse.response.data.password);
    expect(axiosMock.post).toHaveBeenCalledTimes(1);
    expect(axiosMock.post).toHaveBeenCalledWith(loginData.url, loginData.options);
  });

  it('login error: no response.data.password', async () => {
    loginData.errorResponse.response.data.email = loginData.emailError;
    axiosMock.post.mockImplementation(() => Promise.reject(loginData.errorResponse));
    const { getByTestId, findByText } = render(<App />);

    fireEvent.click(getByTestId('login-button'));

    const emailErrorElement = await findByText(loginData.errorResponse.response.data.email);
    expect(axiosMock.post).toHaveBeenCalledTimes(1);
    expect(axiosMock.post).toHaveBeenCalledWith(loginData.url, loginData.options);
  });

  it('login error: no error.response.data', () => {
    loginData.errorResponse.response.data = null;
    axiosMock.post.mockImplementation(() => Promise.reject(loginData.errorResponse));
    const { getByTestId, findByText } = render(<App />);

    fireEvent.click(getByTestId('login-button'));

    expect(axiosMock.post).toHaveBeenCalledTimes(1);
    expect(axiosMock.post).toHaveBeenCalledWith(loginData.url, loginData.options);
  });

  it('logout is clicked', async () => {
    loginData.successResponse.data.token = loginData.token;
    axiosMock.post.mockResolvedValueOnce(loginData.successResponse);
    jwtDecodeMock.mockImplementation(() => loginData.tokenDecoded);
    const { getByTestId, findByTestId } = render(<App />);

    fireEvent.click(getByTestId('login-button'));
    const dashboardNoteElement = await findByTestId('message-section');

    fireEvent.click(getByTestId('logout-button'));
    expect(disconnectSocket).toHaveBeenCalledTimes(1);
  });

  it('Register link is clicked', () => {
    const { getByTestId } = render(<App />);

    fireEvent.click(getByTestId('login-register'));

    expect(getByTestId('register-button')).toBeInTheDocument();
  });

  it('Forgot Password is clicked', () => {
    const { getByTestId } = render(<App />);

    fireEvent.click(getByTestId('login-forgotpassword'));

    expect(getByTestId('forgotpassword-button')).toBeInTheDocument();
  });
});

/**
 * REGISTER page
 */
describe('Register Page', () => {
  beforeEach(() => {
    registerData.errorResponse = {
      response: {
        status: 404,
        data: {
          name: "",
          email: "",
          password: "",
          password2: "",
        }
      }
    };
  });

  it('submit button is present', () => {
    const { getByTestId } = render(<App />);

    fireEvent.click(getByTestId('login-register'));

    expect(getByTestId('register-button')).toBeInTheDocument();
  });

  it('Register is successful', async () => {
    axiosMock.post.mockResolvedValueOnce(registerData.successResponse);
    const { getByTestId, findByText } = render(<App />);
    fireEvent.click(getByTestId('login-register'));
    expect(getByTestId('register-button')).toBeInTheDocument();

    fireEvent.click(getByTestId('register-button'));

    const registerSuccessElement = await findByText(registerData.successResponse.data.createduser);
    expect(axiosMock.post).toHaveBeenCalledTimes(1);
    expect(axiosMock.post).toHaveBeenCalledWith(registerData.url, registerData.options);
  });

  it('Register error occured: only name error', async () => {
    registerData.errorResponse.response.data.name = registerData.nameError;
    axiosMock.post.mockImplementation(() => Promise.reject(registerData.errorResponse));
    const { getByTestId, findByText } = render(<App />);
    fireEvent.click(getByTestId('login-register'));
    expect(getByTestId('register-button')).toBeInTheDocument();

    fireEvent.click(getByTestId('register-button'));

    const nameErrorElement = await findByText(registerData.errorResponse.response.data.name);
    expect(axiosMock.post).toHaveBeenCalledTimes(1);
    expect(axiosMock.post).toHaveBeenCalledWith(registerData.url, registerData.options);
  });

  it('Register error occured: no name error', async () => {
    registerData.errorResponse.response.data.email = registerData.emailError;
    registerData.errorResponse.response.data.password = registerData.passwordError;
    registerData.errorResponse.response.data.password2 = registerData.password2Error;
    axiosMock.post.mockImplementation(() => Promise.reject(registerData.errorResponse));
    const { getByTestId, findByText } = render(<App />);
    fireEvent.click(getByTestId('login-register'));
    expect(getByTestId('register-button')).toBeInTheDocument();

    fireEvent.click(getByTestId('register-button'));

    const emailErrorElement = await findByText(registerData.errorResponse.response.data.email);
    const passwordErrorElement = await findByText(registerData.errorResponse.response.data.password);
    const password2ErrorElement = await findByText(registerData.errorResponse.response.data.password2);
    expect(axiosMock.post).toHaveBeenCalledTimes(1);
    expect(axiosMock.post).toHaveBeenCalledWith(registerData.url, registerData.options);
  });

  it('Register error occured: no error.response.data', async () => {
    registerData.errorResponse.response.data = null;
    axiosMock.post.mockImplementation(() => Promise.reject(registerData.errorResponse));
    const { getByTestId, findByText } = render(<App />);
    fireEvent.click(getByTestId('login-register'));
    expect(getByTestId('register-button')).toBeInTheDocument();

    fireEvent.click(getByTestId('register-button'));

    expect(axiosMock.post).toHaveBeenCalledTimes(1);
    expect(axiosMock.post).toHaveBeenCalledWith(registerData.url, registerData.options);
  });

  it('Login link is clicked', () => {
    const { getByTestId } = render(<App />);
    fireEvent.click(getByTestId('login-register'));
    expect(getByTestId('register-button')).toBeInTheDocument();

    fireEvent.click(getByTestId('register-login'));

    expect(getByTestId('login-button')).toBeInTheDocument();
  });

});

/**
 * FORGOT PASSWORD page
 */
describe('Forgot Password Page', () => {
  beforeEach(() => {
    forgotPasswordData.successResponse = {
      data: {
        emailsent: null,
      }
    };
    forgotPasswordData.errorResponse = {
      response: {
        status: 404,
        data: {
          email: ""
        }
      }
    };
  });

  it('submit button is present', () => {
    const { getByTestId } = render(<App />);

    fireEvent.click(getByTestId('login-forgotpassword'));

    expect(getByTestId('forgotpassword-button')).toBeInTheDocument();
  });

  it('Forgot Password is successful', async () => {
    forgotPasswordData.successResponse.data.emailsent = forgotPasswordData.emailSent;
    axiosMock.post.mockResolvedValueOnce(forgotPasswordData.successResponse);
    const { getByTestId, findByText } = render(<App />);
    fireEvent.click(getByTestId('login-forgotpassword'));
    expect(getByTestId('forgotpassword-button')).toBeInTheDocument();

    fireEvent.click(getByTestId('forgotpassword-button'));

    const forgotPasswordSuccessElement = await findByText(forgotPasswordData.successResponse.data.emailsent);
    expect(axiosMock.post).toHaveBeenCalledTimes(1);
    expect(axiosMock.post).toHaveBeenCalledWith(forgotPasswordData.url, forgotPasswordData.options);
  });

  it('Forgot Password is successful: no response.data.emailsent', async () => {
    axiosMock.post.mockResolvedValueOnce(forgotPasswordData.successResponse);
    const { getByTestId, findByText } = render(<App />);
    fireEvent.click(getByTestId('login-forgotpassword'));
    expect(getByTestId('forgotpassword-button')).toBeInTheDocument();

    fireEvent.click(getByTestId('forgotpassword-button'));

    expect(axiosMock.post).toHaveBeenCalledTimes(1);
    expect(axiosMock.post).toHaveBeenCalledWith(forgotPasswordData.url, forgotPasswordData.options);
  });

  it('Forgot Password error', async () => {
    forgotPasswordData.errorResponse.response.data.email = forgotPasswordData.emailError;
    axiosMock.post.mockImplementation(() => Promise.reject(forgotPasswordData.errorResponse));
    const { getByTestId, findByText } = render(<App />);
    fireEvent.click(getByTestId('login-forgotpassword'));
    expect(getByTestId('forgotpassword-button')).toBeInTheDocument();

    fireEvent.click(getByTestId('forgotpassword-button'));

    const forgotPasswordErrorElement = await findByText(forgotPasswordData.errorResponse.response.data.email);
    expect(axiosMock.post).toHaveBeenCalledTimes(1);
    expect(axiosMock.post).toHaveBeenCalledWith(forgotPasswordData.url, forgotPasswordData.options);
  });

  it('Forgot Password error: no error.response.data', async () => {
    forgotPasswordData.errorResponse.response.data = null;
    axiosMock.post.mockImplementation(() => Promise.reject(forgotPasswordData.errorResponse));
    const { getByTestId, findByText } = render(<App />);
    fireEvent.click(getByTestId('login-forgotpassword'));
    expect(getByTestId('forgotpassword-button')).toBeInTheDocument();

    fireEvent.click(getByTestId('forgotpassword-button'));

    expect(axiosMock.post).toHaveBeenCalledTimes(1);
    expect(axiosMock.post).toHaveBeenCalledWith(forgotPasswordData.url, forgotPasswordData.options);
  });
});

describe('onEnterKeyClicked', () => {
  beforeEach(() => {
    loginData.successResponse = {
      data: {
        success: true
      }
    };
  });

  afterEach(() => {
    jwtDecodeMock.mockReset();
  });

  it('A is pressed', async () => {
    loginData.successResponse.data.token = loginData.token;
    axiosMock.post.mockResolvedValueOnce(loginData.successResponse);
    jwtDecodeMock.mockImplementation(() => loginData.tokenDecoded);
    const { getByTestId, findByTestId } = render(<App />);

    fireEvent.click(getByTestId('login-button'));
    const dashboardNoteElement = await findByTestId('message-section');

    ReactTestUtils.Simulate.keyUp(getByTestId("message-input"), {key: "A", keyCode: 65, which: 65});
  });

  it('Enter key is pressed', async () => {
    loginData.successResponse.data.token = loginData.token;
    axiosMock.post.mockResolvedValueOnce(loginData.successResponse);
    jwtDecodeMock.mockImplementation(() => loginData.tokenDecoded);
    const { getByTestId, findByTestId } = render(<App />);

    fireEvent.click(getByTestId('login-button'));
    const dashboardNoteElement = await findByTestId('message-section');

    ReactTestUtils.Simulate.keyUp(getByTestId("message-input"), {key: "Enter", keyCode: 13, which: 13});
  });

  it('Enter key is pressed with text', async () => {
    loginData.successResponse.data.token = loginData.token;
    axiosMock.post.mockResolvedValueOnce(loginData.successResponse);
    jwtDecodeMock.mockImplementation(() => loginData.tokenDecoded);
    const { getByTestId, findByTestId } = render(<App />);

    fireEvent.click(getByTestId('login-button'));
    const dashboardNoteElement = await findByTestId('message-section');

    let input = document.getElementsByClassName("message-new__input")[0];
    input.value = "Some text here";

    ReactTestUtils.Simulate.keyUp(getByTestId("message-input"), {key: "Enter", keyCode: 13, which: 13});
  });
});
