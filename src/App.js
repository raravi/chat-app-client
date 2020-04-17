import React, { useState, useEffect } from 'react';
import {
  Switch,
  Route,
  Redirect
} from "react-router-dom";
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
import Login from './components/login';
import './App.css';

/**
 * The main App component.
 * Acts as a Controller (MVC jargon) / Single Source of Truth (React jargon).
 * Contains all Business logic associated with this app.
 */
function App() {
  const apiDetails = {
    url: 'http://localhost:8000',
    endpoints: {
      login: '/api/users/login',
      register: '/api/users/register',
      forgotPassword: '/api/users/forgotpassword'
    }
  };

  let [ messageBoxText, setMessageBoxText ] = useState([]);
  let [ newMessage, setNewMessage ] = useState('');
  let [ userAuthenticated, setUserAuthenticated ] = useState(null);

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

  function onSuccessfulLogin(response) {
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
  }

  return (
    <div className="container">
      <Header userAuthenticated={userAuthenticated} logout={logout} />
      <Switch>
        <Route path="/app">
          { userAuthenticated
            ? <MessageSection
                messageBoxText={messageBoxText}
                userAuthenticated={userAuthenticated}
                onEnterKeyClicked={onEnterKeyClicked}
                getMessageFromUser={getMessageFromUser}
              />
            : <Redirect to="/" />
          }
        </Route>
        <Route path="/">
          { userAuthenticated
            ? <Redirect to="/app" />
            : <Login
                loginSuccessCallback={onSuccessfulLogin}
                apiDetails={apiDetails} />
          }
        </Route>
      </Switch>
      <Footer />
    </div>
  );
}

export default App;
