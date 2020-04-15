/**
 * Reducers for maintaining the state of
 * 1. Login page,
 * 2. Register page &
 * 3. Forgot password page.
 */
const loginReducer = (state, action) => {
  switch (action.type) {
    case 'email-error':
      return { ...state, emailError: action.text };
    case 'password-error':
      return { ...state, passwordError: action.text };
    default:
      throw new Error('Unexpected action');
  }
};

const registerReducer = (state, action) => {
  switch (action.type) {
    case 'username-error':
      return { ...state, usernameError: action.text };
    case 'email-error':
      return { ...state, emailError: action.text };
    case 'password-error':
      return { ...state, passwordError: action.text };
    case 'password2-error':
      return { ...state, password2Error: action.text };
    case 'success':
      return { ...state, success: action.text };
    default:
      throw new Error('Unexpected action');
  }
};

const forgotPasswordReducer = (state, action) => {
  switch (action.type) {
    case 'email-error':
      return { ...state, emailError: action.text };
    case 'email-success':
      return { ...state, emailSuccess: action.text };
    default:
      throw new Error('Unexpected action');
  }
};

export { loginReducer, registerReducer, forgotPasswordReducer };
