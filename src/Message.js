import React from 'react';
import './Message.scss';

const Message = ({ username, content }) => {
  return (
    <div className="message">
      <span className="message-username">{username}</span>
      <span className="message-content">{content}</span>
    </div>
  );
};

export default Message;
