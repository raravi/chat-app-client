import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { subscribeToTimer, subscribeToNewMessages, sendMessage } from './api';
import './App.css';

function App() {
  let [ timestamp, setTimestamp ] = useState(moment());
  let [ messageBoxText, setMessageBoxText ] = useState([]);
  let [ newMessage, setNewMessage ] = useState('');

  useEffect(() => {
    subscribeToTimer(3000, (timestamp) => setTimestamp(timestamp));
    subscribeToNewMessages( (message) => setNewMessage(message));
  }, []);

  useEffect(() => {
    newMessageReceived(newMessage);
  }, [newMessage]);

  function getInput(e) {
    var input = document.getElementsByClassName("message")[0];
    if (e.key === "Enter" && input.value !== "") {
      let tempMsges = messageBoxText.slice();
      sendMessage(input.value);
      tempMsges.push(input.value);
      setMessageBoxText(tempMsges);
      input.value = "";

    }
  }

  function getInputMessage() {
    var input = document.getElementsByClassName("message")[0];
    if (input.value !== "") {
      let tempMsges = messageBoxText.slice();
      sendMessage(input.value);
      tempMsges.push(input.value);
      setMessageBoxText(tempMsges);
      input.value = "";
    }
  }

  function newMessageReceived(message) {
    if(message !== '') {
      let tempMsges = messageBoxText.slice();
      tempMsges.push(message);
      setMessageBoxText(tempMsges);
    }
  }

  return (
    <>
      <p>Hello World!</p>
      <p>This is the timer value: {moment(timestamp).format('h:mm:ss a, DD/MM/YYYY')}</p>
      <textarea name="messagebox" className="messagebox" readOnly value={messageBoxText}/>
      <br />
      <input type="text" name="message" className="message" placeholder="Type here..." onKeyUp={(e) => getInput(e)} />
      <button type="button" onClick={getInputMessage}>Submit</button>
    </>
  );
}

export default App;
