import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import {  connectSocket,
          subscribeToNewMessages,
          authenticateUser,
          getOldMessages,
          sendMessage } from './api';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { MessageSection } from './components/MessageSection';
import { LoginSection } from './components/LoginSection';
import { RegisterSection } from './components/RegisterSection';
import './App.css';

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
  let [ newUser, setNewUser ] = useState(false);

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

  function addNewMessageToBox(message) {
    if(message) {
      let tempMsges = messageBoxText.slice();
      tempMsges.push(message);
      setMessageBoxText(tempMsges);
    }
  }

  function getMessageFromUser() {
    var input = document.getElementsByClassName("message-new__input")[0];
    if (input.value !== "") {
      addNewMessageToBox({user: {id: userAuthenticated.id, name: userAuthenticated.name}, message: input.value});
      sendMessage({user: {id: userAuthenticated.id, name: userAuthenticated.name}, message: input.value});
      input.value = "";
    }
  }

  function onEnterKeyClicked(e) {
    if (e.key === "Enter") {
      getMessageFromUser();
    }
  }

  function toggleNewUser() {
    setNewUser(!newUser);
  }

  function login() {
    var email = document.getElementsByClassName("login__email")[0];
    var password = document.getElementsByClassName("login__password")[0];

    setLoginEmailError('');
    setLoginPasswordError('');

    axios.post('http://localhost:8000/api/users/login', {
      email: email.value,
      password: password.value
    })
    .then(function (response) {
      let tokenDecoded = jwtDecode(response.data.token);
      if(tokenDecoded) {
        setUserAuthenticated({id: tokenDecoded.id, name: tokenDecoded.name});
        connectSocket(setUserAuthenticated);
        subscribeToNewMessages((message) => setNewMessage(message));
        authenticateUser({id: tokenDecoded.id, name: tokenDecoded.name});
        getOldMessages((messages) => {
          console.log(messages);
          // TODO: Populate messages in the DOM
          setMessageBoxText(messages.slice());
        });
      }
    })
    .catch(function (error) {
      if (error.response) {
        if (error.response.data) {
          console.log(error.response.data);
          if (error.response.data.email) {
            setLoginEmailError(error.response.data.email);
          }
          if (error.response.data.password) {
            setLoginPasswordError(error.response.data.password);
          }
        }
      } else {
        console.log(error);
      }
    });
  }

  function register () {
    console.log('Clicked Register!');
    var username = document.getElementsByClassName("register__username")[0];
    var email = document.getElementsByClassName("register__email")[0];
    var password = document.getElementsByClassName("register__password")[0];
    var password2 = document.getElementsByClassName("register__password2")[0];

    setRegisterUsernameError('');
    setRegisterEmailError('');
    setRegisterPasswordError('');
    setRegisterPassword2Error('');

    axios.post('http://localhost:8000/api/users/register', {
      name: username.value,
      email: email.value,
      password: password.value,
      password2: password2.value
    })
    .then(function (response) {
      console.log('New user created: ', response.data);
    })
    .catch(function (error) {
      if (error.response) {
        if (error.response.data) {
          console.log(error.response.data);
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
        }
      } else {
        console.log(error);
      }
    });
  }

  return (
    <div className="container">
      <Header />
      { userAuthenticated &&
        <MessageSection
          messageBoxText={messageBoxText}
          userAuthenticated={userAuthenticated}
          onEnterKeyClicked={onEnterKeyClicked}
          getMessageFromUser={getMessageFromUser}
        />
      }
      { !userAuthenticated && !newUser &&
        <LoginSection
          toggleNewUser={toggleNewUser}
          loginEmailError={loginEmailError}
          loginPasswordError={loginPasswordError}
          login={login}
        />
      }
      { !userAuthenticated && newUser &&
        <RegisterSection
          toggleNewUser={toggleNewUser}
          registerUsernameError={registerUsernameError}
          registerEmailError={registerEmailError}
          registerPasswordError={registerPasswordError}
          registerPassword2Error={registerPassword2Error}
          register={register}
        />
      }
      <Footer />
    </div>
  );
}

export default App;
