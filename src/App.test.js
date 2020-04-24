import React, { useReducer } from 'react';
import { Router } from "react-router-dom";
import { createMemoryHistory } from 'history';
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
import { apiDetails } from './config/apiDetails';
import {
  loginReducer,
  registerReducer,
  forgotPasswordReducer,
  resetPasswordReducer } from './components/login/reducers';

/**
 * Mocks of external dependencies
 */
jest.mock('axios');
jest.mock('jwt-decode');
jest.mock('./api');
console.error = jest.fn();

/**
 * Wrapper for Router
 */
function renderWithRouter(
  ui,
  {
    route = '/',
    history = createMemoryHistory({ initialEntries: [route] }),
  } = {}
) {
  const Wrapper = ({ children }) => (
    <Router history={history}>{children}</Router>
  );
  return {
    ...render(ui, { wrapper: Wrapper }),
    history
  };
}

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
      url: apiDetails.url + apiDetails.endpoints.login,
      options: {"email": "", "password": ""},
      successResponse: null,
      emailError: "Email not found",
      passwordError: "Password incorrect",
      errorResponse: null
    },
    registerData = {
      createdUser: "New user registered successfully!",
      url: apiDetails.url + apiDetails.endpoints.register,
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
      url: apiDetails.url + apiDetails.endpoints.forgotPassword,
      options: {"email": ""},
      emailSent: 'The reset email has been sent, please check your inbox!',
      successResponse: null,
      emailError: "Email not found",
      errorResponse: null
    },
    resetPasswordData = {
      url: apiDetails.url + apiDetails.endpoints.resetPassword,
      options: {"email": "", "resetcode": "", "password": "", "password2": ""},
      emailSent: 'The reset email has been sent, please check your inbox!',
      successResponse: {
        data: {
          success: "Password changed successfully!"
        }
      },
      validationResponse: {
        data: {
          email: "Email field is required",
          resetcode: "Reset code is required",
          password: "Password field is required",
          password2: "Confirm password field is required",
        }
      },
      errorResponse: { error: "Error!" }
    };

afterEach(() => {
  axiosMock.post.mockReset();
});

afterEach(cleanup);

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
    const { getByTestId } = renderWithRouter(<App />);

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
    const { getByTestId, findByTestId } = renderWithRouter(<App />);

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
    const { getByTestId, findByTestId } = renderWithRouter(<App />);

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
    const { getByTestId, findByText } = renderWithRouter(<App />);

    fireEvent.click(getByTestId('login-button'));

    const passwordErrorElement = await findByText(loginData.errorResponse.response.data.password);
    expect(axiosMock.post).toHaveBeenCalledTimes(1);
    expect(axiosMock.post).toHaveBeenCalledWith(loginData.url, loginData.options);
  });

  it('login error: no response.data.password', async () => {
    loginData.errorResponse.response.data.email = loginData.emailError;
    axiosMock.post.mockImplementation(() => Promise.reject(loginData.errorResponse));
    const { getByTestId, findByText } = renderWithRouter(<App />);

    fireEvent.click(getByTestId('login-button'));

    const emailErrorElement = await findByText(loginData.errorResponse.response.data.email);
    expect(axiosMock.post).toHaveBeenCalledTimes(1);
    expect(axiosMock.post).toHaveBeenCalledWith(loginData.url, loginData.options);
  });

  it('login error: no error.response.data', () => {
    loginData.errorResponse.response.data = null;
    axiosMock.post.mockImplementation(() => Promise.reject(loginData.errorResponse));
    const { getByTestId, findByText } = renderWithRouter(<App />);

    fireEvent.click(getByTestId('login-button'));

    expect(axiosMock.post).toHaveBeenCalledTimes(1);
    expect(axiosMock.post).toHaveBeenCalledWith(loginData.url, loginData.options);
  });

  it('logout is clicked', async () => {
    loginData.successResponse.data.token = loginData.token;
    axiosMock.post.mockResolvedValueOnce(loginData.successResponse);
    jwtDecodeMock.mockImplementation(() => loginData.tokenDecoded);
    const { getByTestId, findByTestId } = renderWithRouter(<App />);

    fireEvent.click(getByTestId('login-button'));
    const dashboardNoteElement = await findByTestId('message-section');

    fireEvent.click(getByTestId('logout-button'));
    expect(disconnectSocket).toHaveBeenCalledTimes(1);
  });

  it('Register link is clicked', () => {
    const { getByTestId } = renderWithRouter(<App />);

    fireEvent.click(getByTestId('login-register'));

    expect(getByTestId('register-button')).toBeInTheDocument();
  });

  it('Forgot Password is clicked', () => {
    const { getByTestId } = renderWithRouter(<App />);

    fireEvent.click(getByTestId('login-forgotpassword'));

    expect(getByTestId('forgotpassword-button')).toBeInTheDocument();
  });

  describe('Test the Reducers', () => {
    let MockLogin;
    beforeAll(() => {
      MockLogin = (props) => {
        const [loginState, loginDispatch] = useReducer(loginReducer, {
          emailError: '',
          passwordError: '',
        });
        const [registerState, registerDispatch] = useReducer(registerReducer, {
          usernameError: '',
          emailError: '',
          passwordError: '',
          password2Error: '',
          success: '',
        });
        const [forgotPasswordState, forgotPasswordDispatch] = useReducer(forgotPasswordReducer, {
          emailError: '',
          emailSuccess: '',
        });
        const [resetPasswordState, resetPasswordDispatch] = useReducer(resetPasswordReducer, {
          emailError: '',
          resetCodeError: '',
          passwordError: '',
          password2Error: '',
          success: '',
        });
        return (
          <>
            <p
              data-testid="mock-login"
              onClick={() => loginDispatch({ type: 'dummy', text: "dummy" })}
            >
              Login
            </p>
            <p
              data-testid="mock-register"
              onClick={() => registerDispatch({ type: 'dummy', text: "dummy" })}
            >
              Register
            </p>
            <p
              data-testid="mock-forgot-password"
              onClick={() => forgotPasswordDispatch({ type: 'dummy', text: "dummy" })}
            >
              Forgot Password
            </p>
            <p
              data-testid="mock-reset-password"
              onClick={() => resetPasswordDispatch({ type: 'dummy', text: "dummy" })}
            >
              Reset Password
            </p>
          </>
        )
      };
    });
    it('Login Reducer', () => {
      const { getByTestId } = render(<MockLogin />);

      try {
        fireEvent.click(getByTestId('mock-login'));
      } catch (e) {
        expect(e.toString()).toBe('Error: Unexpected action');
      }
    });

    it('Register Reducer', () => {
      const { getByTestId } = render(<MockLogin />);

      try {
        fireEvent.click(getByTestId('mock-register'));
      } catch (e) {
        expect(e.toString()).toBe('Error: Unexpected action');
      }
    });

    it('Forgot Password Reducer', () => {
      const { getByTestId } = render(<MockLogin />);

      try {
        fireEvent.click(getByTestId('mock-forgot-password'));
      } catch (e) {
        expect(e.toString()).toBe('Error: Unexpected action');
      }
    });

    it('Reset Password Reducer', () => {
      const { getByTestId } = render(<MockLogin />);

      try {
        fireEvent.click(getByTestId('mock-reset-password'));
      } catch (e) {
        expect(e.toString()).toBe('Error: Unexpected action');
      }
    });
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
    const { getByTestId } = renderWithRouter(<App />);

    fireEvent.click(getByTestId('login-register'));

    expect(getByTestId('register-button')).toBeInTheDocument();
  });

  it('Register is successful', async () => {
    axiosMock.post.mockResolvedValueOnce(registerData.successResponse);
    const { getByTestId, findByText } = renderWithRouter(<App />);
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
    const { getByTestId, findByText } = renderWithRouter(<App />);
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
    const { getByTestId, findByText } = renderWithRouter(<App />);
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
    const { getByTestId, findByText } = renderWithRouter(<App />);
    fireEvent.click(getByTestId('login-register'));
    expect(getByTestId('register-button')).toBeInTheDocument();

    fireEvent.click(getByTestId('register-button'));

    expect(axiosMock.post).toHaveBeenCalledTimes(1);
    expect(axiosMock.post).toHaveBeenCalledWith(registerData.url, registerData.options);
  });

  it('Login link is clicked', () => {
    const { getByTestId } = renderWithRouter(<App />);
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
    const { getByTestId } = renderWithRouter(<App />);

    fireEvent.click(getByTestId('login-forgotpassword'));

    expect(getByTestId('forgotpassword-button')).toBeInTheDocument();
  });

  it('Forgot Password is successful', async () => {
    forgotPasswordData.successResponse.data.emailsent = forgotPasswordData.emailSent;
    axiosMock.post.mockResolvedValueOnce(forgotPasswordData.successResponse);
    const { getByTestId, findByText } = renderWithRouter(<App />);
    fireEvent.click(getByTestId('login-forgotpassword'));
    expect(getByTestId('forgotpassword-button')).toBeInTheDocument();

    fireEvent.click(getByTestId('forgotpassword-button'));

    const forgotPasswordSuccessElement = await findByText(forgotPasswordData.successResponse.data.emailsent);
    expect(axiosMock.post).toHaveBeenCalledTimes(1);
    expect(axiosMock.post).toHaveBeenCalledWith(forgotPasswordData.url, forgotPasswordData.options);
  });

  it('Forgot Password is successful: no response.data.emailsent', async () => {
    axiosMock.post.mockResolvedValueOnce(forgotPasswordData.successResponse);
    const { getByTestId, findByText } = renderWithRouter(<App />);
    fireEvent.click(getByTestId('login-forgotpassword'));
    expect(getByTestId('forgotpassword-button')).toBeInTheDocument();

    fireEvent.click(getByTestId('forgotpassword-button'));

    expect(axiosMock.post).toHaveBeenCalledTimes(1);
    expect(axiosMock.post).toHaveBeenCalledWith(forgotPasswordData.url, forgotPasswordData.options);
  });

  it('Forgot Password error', async () => {
    forgotPasswordData.errorResponse.response.data.email = forgotPasswordData.emailError;
    axiosMock.post.mockImplementation(() => Promise.reject(forgotPasswordData.errorResponse));
    const { getByTestId, findByText } = renderWithRouter(<App />);
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
    const { getByTestId, findByText } = renderWithRouter(<App />);
    fireEvent.click(getByTestId('login-forgotpassword'));
    expect(getByTestId('forgotpassword-button')).toBeInTheDocument();

    fireEvent.click(getByTestId('forgotpassword-button'));

    expect(axiosMock.post).toHaveBeenCalledTimes(1);
    expect(axiosMock.post).toHaveBeenCalledWith(forgotPasswordData.url, forgotPasswordData.options);
  });
});

/**
 * RESET PASSWORD page
 */
describe('Reset Password Page', () => {
  it('Load RESET PASSWORD', () => {
    // const history = createMemoryHistory();
    // const route = '/some-route';
    const { getByTestId, findByTestId } = renderWithRouter(<App />, {
      route: '/reset-password',
    });

    expect(getByTestId('resetpassword-button')).toBeInTheDocument();
  });

  it('Reset Password is successful', async () => {
    fetch = jest.fn(() => Promise.resolve({ json: () => resetPasswordData.successResponse.data }));
    const { getByTestId, findByText } = renderWithRouter(<App />, {
      route: '/reset-password',
    });

    fireEvent.click(getByTestId('resetpassword-button'));

    const resetPasswordSuccessElement = await findByText(resetPasswordData.successResponse.data.success);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('Reset Password error', async () => {
    fetch = jest.fn(() => Promise.reject(resetPasswordData.errorResponse));
    const { getByTestId, findByText } = renderWithRouter(<App />, {
      route: '/reset-password',
    });

    fireEvent.click(getByTestId('resetpassword-button'));

    const resetPasswordErrorElement = await findByText("Unable to reach server...");
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('Reset Password error: validation errors', async () => {
    fetch = jest.fn(() => Promise.resolve({ json: () => resetPasswordData.validationResponse.data }));
    const { getByTestId, findByText } = renderWithRouter(<App />, {
      route: '/reset-password',
    });

    fireEvent.click(getByTestId('resetpassword-button'));

    const resetPasswordErrorElement = await findByText(resetPasswordData.validationResponse.data.email);
    expect(fetch).toHaveBeenCalledTimes(1);
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
    const { getByTestId, findByTestId } = renderWithRouter(<App />);

    fireEvent.click(getByTestId('login-button'));
    const dashboardNoteElement = await findByTestId('message-section');

    ReactTestUtils.Simulate.keyUp(getByTestId("message-input"), {key: "A", keyCode: 65, which: 65});
  });

  it('Enter key is pressed', async () => {
    loginData.successResponse.data.token = loginData.token;
    axiosMock.post.mockResolvedValueOnce(loginData.successResponse);
    jwtDecodeMock.mockImplementation(() => loginData.tokenDecoded);
    const { getByTestId, findByTestId } = renderWithRouter(<App />);

    fireEvent.click(getByTestId('login-button'));
    const dashboardNoteElement = await findByTestId('message-section');

    ReactTestUtils.Simulate.keyUp(getByTestId("message-input"), {key: "Enter", keyCode: 13, which: 13});
  });

  it('Enter key is pressed with text', async () => {
    loginData.successResponse.data.token = loginData.token;
    axiosMock.post.mockResolvedValueOnce(loginData.successResponse);
    jwtDecodeMock.mockImplementation(() => loginData.tokenDecoded);
    const { getByTestId, findByTestId } = renderWithRouter(<App />);

    fireEvent.click(getByTestId('login-button'));
    const dashboardNoteElement = await findByTestId('message-section');

    let input = document.getElementsByClassName("message-new__input")[0];
    input.value = "Some text here";

    ReactTestUtils.Simulate.keyUp(getByTestId("message-input"), {key: "Enter", keyCode: 13, which: 13});
  });
});
