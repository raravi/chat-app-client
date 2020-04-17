import React, { createContext, useContext, useReducer } from 'react';
import {
  loginReducer,
  registerReducer,
  forgotPasswordReducer
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

  return (
    <LoginContext.Provider value={
      {
        loginState, loginDispatch,
        registerState, registerDispatch,
        forgotPasswordState, forgotPasswordDispatch
      }
    }>
      {children}
    </LoginContext.Provider>
  );
};

export const useLoginContext = () => useContext(LoginContext);
