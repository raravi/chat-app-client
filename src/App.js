import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import {  connectSocket,
          disconnectSocket,
          subscribeToNewMessages,
          authenticateUser,
          getOldMessages,
          sendMessage } from './api';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { MessageSection } from './components/MessageSection';
import { LoginSection } from './components/LoginSection';
import { RegisterSection } from './components/RegisterSection';
import { ForgotPassword } from './components/ForgotPassword';
import './App.css';

/**
 * The main App component.
 * Acts as a Controller (MVC jargon) / Single Source of Truth (React jargon).
 * Contains all Business logic associated with this app.
 */
function App() {
  let [ messageBoxText, setMessageBoxText ] = useState([]);
  let [ newMessage, setNewMessage ] = useState('');
  let [ userAuthenticated, setUserAuthenticated ] = useState(null);
  let [ loginEmailError, setLoginEmailError ] = useState('');
  let [ loginPasswordError, setLoginPasswordError ] = useState('');
  let [ registerUsernameError, setRegisterUsernameError ] = useState('');
  let [ registerEmailError, setRegisterEmailError ] = useState('');
  let [ registerPasswordError, setRegisterPasswordError ] = useState('');
  let [ registerPassword2Error, setRegisterPassword2Error ] = useState('');
  let [ registerSuccess, setRegisterSuccess ] = useState('');
  let [ forgotPasswordEmailError, setForgotPasswordEmailError ] = useState('');
  let [ forgotPasswordEmailSuccess, setForgotPasswordEmailSuccess ] = useState('');
  let [ newUser, setNewUser ] = useState(false);
  let [ forgotPassword, setForgotPassword ] = useState(false);

  useEffect(() => {
    sessionStorage.removeItem("token");
  }, []);

  useEffect(() => {
    addNewMessageToBox(newMessage);
  // eslint-disable-next-line
  }, [newMessage]);

  useEffect(() => {
    var messagesBox = document.getElementsByClassName("messages-box")[0];
    if (userAuthenticated) {
      messagesBox.scrollTop = messagesBox.scrollHeight;
    }
  // eslint-disable-next-line
  }, [messageBoxText]);

  /**
   * These functions toggle/set state variables.
   */
  function toggleNewUser() {
    setNewUser(!newUser);
  }
  function onClickForgotPassword() {
    setForgotPassword(true);
  }

  /**
   * Add New Message (either from the user or someone else) to the Message Box.
   */
  function addNewMessageToBox(message) {
    if(message) {
      let tempMsges = messageBoxText.slice();
      tempMsges.push(message);
      setMessageBoxText(tempMsges);
    }
  }

  /**
   * Get the message from user and
   * 1. Add it to the message box.
   * 2. Send to server for broadcast to other users & saving to DB.
   */
  function getMessageFromUser() {
    var input = document.getElementsByClassName("message-new__input")[0];
    if (input.value !== "") {
      addNewMessageToBox({user: {id: userAuthenticated.id, name: userAuthenticated.name}, message: input.value});
      sendMessage({token: sessionStorage.getItem("token"), message: input.value});
      input.value = "";
    }
  }

  /**
   * On Enter Key click, send user message to getMessageFromUser()
   * function defined above.
   */
  function onEnterKeyClicked(e) {
    if (e.key === "Enter") {
      getMessageFromUser();
    }
  }

  /**
   * On Log out, disconnect the client from the server.
   */
  function logout() {
    disconnectSocket();
  }

  /**
   * Try to login the user, send the details to the server
   * and display the server response to the user.
   */
  function login() {
    var email = document.getElementsByClassName("login__email")[0];
    var password = document.getElementsByClassName("login__password")[0];

    setLoginEmailError('');
    setLoginPasswordError('');

    /**
     * POST the user request to the API endpoint '/login'.
     */
    axios.post('http://localhost:8000/api/users/login', {
      email: email.value,
      password: password.value
    })
    .then(function (response) {
      sessionStorage.setItem("token", response.data.token);
      let tokenDecoded = jwtDecode(response.data.token);
      if(tokenDecoded) {
        setUserAuthenticated({id: tokenDecoded.id, name: tokenDecoded.name});
        connectSocket(setUserAuthenticated);
        subscribeToNewMessages((message) => setNewMessage(message));
        authenticateUser({ token: sessionStorage.getItem("token")});
        getOldMessages((messages) => {
          setMessageBoxText(messages.slice());
        });
      }
    })
    .catch(function (error) {
      if (error.response && error.response.data) {
        if (error.response.data.email) {
          setLoginEmailError(error.response.data.email);
        }
        if (error.response.data.password) {
          setLoginPasswordError(error.response.data.password);
        }
      } else {
        console.log(error);
      }
    });
  }

  /**
   * Try to register the new user, send the details to the server
   * and display the server response to the user.
   */
  function register () {
    var username = document.getElementsByClassName("register__username")[0];
    var email = document.getElementsByClassName("register__email")[0];
    var password = document.getElementsByClassName("register__password")[0];
    var password2 = document.getElementsByClassName("register__password2")[0];

    setRegisterUsernameError('');
    setRegisterEmailError('');
    setRegisterPasswordError('');
    setRegisterPassword2Error('');
    setRegisterSuccess('');

    /**
     * POST the user request to the API endpoint '/register'.
     */
    axios.post('http://localhost:8000/api/users/register', {
      name: username.value,
      email: email.value,
      password: password.value,
      password2: password2.value
    })
    .then(function (response) {
      setRegisterSuccess(response.data.createduser);
    })
    .catch(function (error) {
      if (error.response && error.response.data) {
        if (error.response.data.name) {
          setRegisterUsernameError(error.response.data.name);
        }
        if (error.response.data.email) {
          setRegisterEmailError(error.response.data.email);
        }
        if (error.response.data.password) {
          setRegisterPasswordError(error.response.data.password);
        }
        if (error.response.data.password2) {
          setRegisterPassword2Error(error.response.data.password2);
        }
      } else {
        console.log(error);
      }
    });
  }

  /**
   * Try to initiate the reset of the user's password, send
   * the details to the server and display the server response
   * to the user.
   */
  function sendForPasswordReset() {
    var email = document.getElementsByClassName("forgot-password__email")[0];

    setForgotPasswordEmailError('');
    setForgotPasswordEmailSuccess('');

    /**
     * POST the user request to the API endpoint '/forgotpassword'.
     */
    axios.post('http://localhost:8000/api/users/forgotpassword', {
      email: email.value
    })
    .then(function (response) {
      if (response.data.emailsent)
        setForgotPasswordEmailSuccess(response.data.emailsent);
    })
    .catch(function (error) {
      if (error.response && error.response.data && error.response.data.email) {
        setForgotPasswordEmailError(error.response.data.email);
      } else {
        console.log(error);
      }
    });
  }

  return (
    <div className="container">
      <Header userAuthenticated={userAuthenticated} logout={logout} />
      { userAuthenticated &&
        <MessageSection
          messageBoxText={messageBoxText}
          userAuthenticated={userAuthenticated}
          onEnterKeyClicked={onEnterKeyClicked}
          getMessageFromUser={getMessageFromUser}
        />
      }
      { !userAuthenticated && !forgotPassword && !newUser &&
        <LoginSection
          toggleNewUser={toggleNewUser}
          loginEmailError={loginEmailError}
          loginPasswordError={loginPasswordError}
          login={login}
          onClickForgotPassword={onClickForgotPassword}
        />
      }
      { !userAuthenticated && !forgotPassword && newUser &&
        <RegisterSection
          toggleNewUser={toggleNewUser}
          registerUsernameError={registerUsernameError}
          registerEmailError={registerEmailError}
          registerPasswordError={registerPasswordError}
          registerPassword2Error={registerPassword2Error}
          registerSuccess={registerSuccess}
          register={register}
        />
      }
      { !userAuthenticated && forgotPassword &&
        <ForgotPassword
          forgotPasswordEmailError={forgotPasswordEmailError}
          forgotPasswordEmailSuccess={forgotPasswordEmailSuccess}
          sendForPasswordReset={sendForPasswordReset}
        />
      }
      <Footer />
    </div>
  );
}

export default App;
