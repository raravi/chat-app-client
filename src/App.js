import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { subscribeToTimer, subscribeToNewMessages, authenticateUser, sendMessage } from './api';
import './App.css';

function App() {
  let [ timestamp, setTimestamp ] = useState(moment());
  let [ messageBoxText, setMessageBoxText ] = useState([]);
  let [ newMessage, setNewMessage ] = useState('');

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
    messagesBox.scrollTop = messagesBox.scrollHeight;
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
      addNewMessageToBox({user: 'me', message: input.value});
      sendMessage(input.value);
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

  return (
    <div className="container">
      <header className="header">
        <h1>texter</h1>
      </header>
      <section className="message-section">
        <div className="messages-box">
          <div className="messages-box__messages">
            {
              messageBoxText.map(message =>
                  <div className={message.user === "me"
                                    ? "messages-box__message-box messages-box__message-box--me"
                                    : "messages-box__message-box"}
                  >
                    <p className="messages-box__name">{message.user}</p>
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
      </section>
      <footer className="footer">
        <p>&#169; 2020 Amith Raravi - source code on <a href="https://github.com/raravi/chat-app-client">Github</a></p>
      </footer>
    </div>
  );
}

export default App;
