import React from 'react';

/**
 * MessageSection component
 * contains the logged-in Messages 'page'.
 */
export const MessageSection = (props) => {
  return (
    <section className="message-section" data-testid="message-section">
      <div className="messages-box">
        <div className="messages-box__messages">
          {
            props.messageBoxText.map(message =>
                <div className={message.user.id === props.userAuthenticated.id
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
        <input type="text" name="message" className="message-new__input" placeholder="Type here..." data-testid="message-input" onKeyUp={(e) => props.onEnterKeyClicked(e)} />
        <button type="button" className="message-new__button" onClick={props.getMessageFromUser}>Submit</button>
      </div>
    </section>
  )
}
