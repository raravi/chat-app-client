import React, { createContext, useContext, useReducer } from 'react';
import {
  loginReducer,
  registerReducer,
  forgotPasswordReducer,
  resetPasswordReducer
} from './reducers';

const LoginContext = createContext();

export const LoginContextProvider = ({ children }) => {
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
    <LoginContext.Provider value={
      {
        loginState, loginDispatch,
        registerState, registerDispatch,
        forgotPasswordState, forgotPasswordDispatch,
        resetPasswordState, resetPasswordDispatch
      }
    }>
      {children}
    </LoginContext.Provider>
  );
};

export const useLoginContext = () => useContext(LoginContext);
