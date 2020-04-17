import React from 'react';
import { LoginContextProvider } from './context';
import { Login } from './Login';

/**
 * Login Component: Can be reused across applications.
 * It requires 2 props:
 * 1. loginSuccessCallback: For handling
 *    the 'response' object upon successful login.
 * 2. apiDetails: An object containing below details
 *    {
 *      url: 'http://www.url.com',
 *      endpoints: {
 *        login: '/login',
 *        register: '/register',
 *        forgotPassword: '/forgotpassword'
 *      }
 *    }
 */
export const LoginComponent = (props) => {
  return (
    <LoginContextProvider>
      <Login
        loginSuccessCallback={props.loginSuccessCallback}
        apiDetails={props.apiDetails} />
    </LoginContextProvider>
  )
}
