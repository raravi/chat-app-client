import React from 'react';
import {
  Switch,
  Route,
} from "react-router-dom";
import axios from 'axios';
import { LoginSection } from './LoginSection';
import { RegisterSection } from './RegisterSection';
import { ForgotPassword } from './ForgotPassword';
import { ResetPassword } from './ResetPassword';
import { useLoginContext } from './context';

/**
 * The Login component.
 * Contains all Login / Register / ForgotPassword logic associated with this app.
 */
export const LoginPage = (props) => {
  let apiDetails = props.apiDetails;
  let {
    loginDispatch,
    registerDispatch,
    forgotPasswordDispatch,
    resetPasswordDispatch } = useLoginContext();

  /**
   * Try to login the user, send the details to the server
   * and display the server response to the user.
   */
  function loginUser() {
    var email = document.getElementsByClassName("login__email")[0];
    var password = document.getElementsByClassName("login__password")[0];

    loginDispatch({ type: 'reset-all' });

    /**
     * POST the user request to the API endpoint '/login'.
     */
    axios.post(apiDetails.url + apiDetails.endpoints.login, {
      email: email.value,
      password: password.value
    })
    .then(function (response) {
      props.loginSuccessCallback(response);
    })
    .catch(function (error) {
      if (error.response && error.response.data) {
        if (error.response.data.email) {
          loginDispatch({ type: 'email-error', text: error.response.data.email });
        }
        if (error.response.data.password) {
          loginDispatch({ type: 'password-error', text: error.response.data.password });
        }
      } else {
        loginDispatch({ type: 'email-error', text: "Unable to reach server..." });
      }
    });
  }

  /**
   * Try to register the new user, send the details to the server
   * and display the server response to the user.
   */
  function registerNewUser() {
    var username = document.getElementsByClassName("register__username")[0];
    var email = document.getElementsByClassName("register__email")[0];
    var password = document.getElementsByClassName("register__password")[0];
    var password2 = document.getElementsByClassName("register__password2")[0];

    registerDispatch({ type: 'reset-all' });

    /**
     * POST the user request to the API endpoint '/register'.
     */
    axios.post(apiDetails.url + apiDetails.endpoints.register, {
      name: username.value,
      email: email.value,
      password: password.value,
      password2: password2.value
    })
    .then(function (response) {
      registerDispatch({ type: 'success', text: response.data.createduser });
    })
    .catch(function (error) {
      if (error.response && error.response.data) {
        if (error.response.data.name) {
          registerDispatch({ type: 'username-error', text: error.response.data.name });
        }
        if (error.response.data.email) {
          registerDispatch({ type: 'email-error', text: error.response.data.email });
        }
        if (error.response.data.password) {
          registerDispatch({ type: 'password-error', text: error.response.data.password });
        }
        if (error.response.data.password2) {
          registerDispatch({ type: 'password2-error', text: error.response.data.password2 });
        }
      } else {
        registerDispatch({ type: 'username-error', text: "Unable to reach server..." });
      }
    });
  }

  /**
   * Try to initiate the reset of the user's password, send
   * the details to the server and display the server response
   * to the user.
   */
  function forgotPasswordOfUser() {
    var email = document.getElementsByClassName("forgot-password__email")[0];

    forgotPasswordDispatch({ type: 'reset-all' });

    /**
     * POST the user request to the API endpoint '/forgotpassword'.
     */
    axios.post(apiDetails.url + apiDetails.endpoints.forgotPassword, {
      email: email.value
    })
    .then(function (response) {
      if (response.data.emailsent)
        forgotPasswordDispatch({ type: 'email-success', text: response.data.emailsent });
    })
    .catch(function (error) {
      if (error.response && error.response.data && error.response.data.email) {
        forgotPasswordDispatch({ type: 'email-error', text: error.response.data.email });
      } else {
        forgotPasswordDispatch({ type: 'email-error', text: "Unable to reach server..." });
      }
    });
  }

  /**
   * Send the Reset Token to the backend for processing,
   * along with User details for password reset.
   */
  function resetPasswordOfUser() {
    const resetEmail = document.querySelector('.reset__email');
    const resetCode = document.querySelector('.reset__code');
    const resetPassword = document.querySelector('.reset__password');
    const resetPassword2 = document.querySelector('.reset__password2');

    resetPasswordDispatch({ type: 'reset-all' });

    fetch(apiDetails.url + apiDetails.endpoints.resetPassword, {
      method: "post",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: resetEmail.value,
        resetcode: resetCode.value,
        password: resetPassword.value,
        password2: resetPassword2.value
      })
    })
    .then(response => response.json())
    .then(text => {
      if (text.email) {
        resetPasswordDispatch({ type: 'email-error', text: text.email });
      }
      if (text.resetcode) {
        resetPasswordDispatch({ type: 'reset-code-error', text: text.resetcode });
      }
      if (text.password) {
        resetPasswordDispatch({ type: 'password-error', text: text.password });
      }
      if (text.password2) {
        resetPasswordDispatch({ type: 'password2-error', text: text.password2 });
      }
      if (text.success) {
        resetPasswordDispatch({ type: 'success', text: text.success });
        resetEmail.value = '';
        resetCode.value = '';
        resetPassword.value = '';
        resetPassword2.value = '';
      }
    })
    .catch(e => {
      resetPasswordDispatch({
        type: 'email-error',
        text: "Unable to reach server..."
      });
    });
  }

  return (
      <Switch>
        <Route exact path="/">
          <LoginSection loginCallback={loginUser} />
        </Route>
        <Route path="/register">
          <RegisterSection registerCallback={registerNewUser} />
        </Route>
        <Route path="/forgot-password">
          <ForgotPassword forgotPasswordCallback={forgotPasswordOfUser} />
        </Route>
        <Route path="/reset-password">
          <ResetPassword resetPasswordCallback={resetPasswordOfUser} />
        </Route>
      </Switch>
  );
}
