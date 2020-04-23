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
    case 'reset-all':
      return {
        ...state,
        emailError: '',
        passwordError: ''
      };
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
    case 'reset-all':
      return {
        ...state,
        usernameError: '',
        emailError: '',
        passwordError: '',
        password2Error: '',
        success: ''
      };
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
    case 'reset-all':
      return {
        ...state,
        emailError: '',
        emailSuccess: ''
      };
    default:
      throw new Error('Unexpected action');
  }
};

const resetPasswordReducer = (state, action) => {
  switch (action.type) {
    case 'email-error':
      return { ...state, emailError: action.text };
    case 'reset-code-error':
      return { ...state, resetCodeError: action.text };
    case 'password-error':
      return { ...state, passwordError: action.text };
    case 'password2-error':
      return { ...state, password2Error: action.text };
    case 'success':
      return { ...state, success: action.text };
    case 'reset-all':
      return {
        ...state,
        emailError: '',
        resetCodeError: '',
        passwordError: '',
        password2Error: '',
        success: ''
      };
    default:
      throw new Error('Unexpected action');
  }
};

export { loginReducer, registerReducer, forgotPasswordReducer, resetPasswordReducer };
