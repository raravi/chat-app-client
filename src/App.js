import React, { useState, useEffect } from 'react';
import moment from 'moment';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import {  subscribeToTimer,
          subscribeToNewMessages,
          authenticateUser,
          sendMessage } from './api';
import './App.css';

function App() {
  let [ timestamp, setTimestamp ] = useState(moment());
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
    subscribeToTimer(1000, (timestamp) => setTimestamp(timestamp));
    subscribeToNewMessages( (message) => setNewMessage(message));
    authenticateUser('user');
  }, []);

  useEffect(() => {
    newMessageReceived(newMessage);
  }, [newMessage]);

  useEffect(() => {
    var messagesBox = document.getElementsByClassName("messages-box")[0];
    if (userAuthenticated) {
      messagesBox.scrollTop = messagesBox.scrollHeight;
    }
  }, [messageBoxText]);

  function addNewMessageToBox(message) {
    if(message) {
      let tempMsges = messageBoxText.slice();
      tempMsges.push(message);
      setMessageBoxText(tempMsges);
    }
  }

  function onNewMessage() {
    var input = document.getElementsByClassName("message-new__input")[0];
    if (input.value !== "") {
      addNewMessageToBox({user: {id: userAuthenticated.id, name: userAuthenticated.name}, message: input.value});
      sendMessage({user: {id: userAuthenticated.id, name: userAuthenticated.name}, message: input.value});
      input.value = "";
    }
  }

  function getInput(e) {
    if (e.key === "Enter") {
      onNewMessage();
    }
  }

  function getInputMessage() {
    onNewMessage();
  }

  function newMessageReceived(message) {
    if(message) {
      addNewMessageToBox(message);
    }
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
      <header className="header">
        <h1>texter</h1>
      </header>
      {userAuthenticated && <section className="message-section">
        <div className="messages-box">
          <div className="messages-box__messages">
            {
              messageBoxText.map(message =>
                  <div className={message.user.id === userAuthenticated.id
                                    ? "messages-box__message-box messages-box__message-box--me"
                                    : "messages-box__message-box"}
                  >
                    <p className="messages-box__name">{message.user.name}</p>
                    <p className="messages-box__message">{message.message}</p>
                  </div>
              )
            }
          </div>
        </div>
        <div className="message-new">
          <input type="text" name="message" className="message-new__input" placeholder="Type here..." onKeyUp={(e) => getInput(e)} />
          <button type="button" className="message-new__button" onClick={getInputMessage}>Submit</button>
        </div>
      </section>}
      {!userAuthenticated && !newUser &&
        <section className="login">
          <div className="login__header-group">
          <h2 className="login__header login__header--selected">Login</h2>
          <h2 className="login__header" onClick={() => setNewUser(!newUser)}>Register</h2>
          </div>
          <input type="email" name="email" className="login__email" placeholder="Email" /><br />
          <label className="login__email-error">{loginEmailError}</label>
          <input type="password" name="password" className="login__password" placeholder="Password"/>
          <label className="login__password-error">{loginPasswordError}</label><br />
          <button type="button" className="login__submit" onClick={login}>Submit</button>
        </section>
      }
      {!userAuthenticated && newUser &&
        <section className="register">
          <div className="register__header-group">
            <h2 className="register__header"  onClick={() => setNewUser(!newUser)}>Login</h2>
            <h2 className="register__header register__header--selected">Register</h2>
          </div>
          <input type="username" name="username" className="register__username" placeholder="Username" /><br />
          <label className="register__username-error">{registerUsernameError}</label>
          <input type="email" name="email" className="register__email" placeholder="Email" /><br />
          <label className="register__email-error">{registerEmailError}</label>
          <input type="password" name="password" className="register__password" placeholder="Password"/>
          <label className="register__password-error">{registerPasswordError}</label>
          <input type="password" name="password2" className="register__password2" placeholder="Confirm password"/>
          <label className="register__password2-error">{registerPassword2Error}</label><br />
          <button type="button" className="register__submit" onClick={register}>Submit</button>
        </section>
      }
      <footer className="footer">
        <p>&#169; 2020 Amith Raravi - source code on <a href="https://github.com/raravi/chat-app-client">Github</a></p>
      </footer>
    </div>
  );
}

export default App;
