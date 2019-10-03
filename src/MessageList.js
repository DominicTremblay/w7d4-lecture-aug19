import React from 'react';
import Message from './Message';
import Notification from './Notification';

const MessageList = ({ messages }) => {
  const messageList = messages.map(message => {
    const messageType = {
      incomingMessage: (
        <Message
          key={message.id}
          username={message.username}
          content={message.content}
        />
      ),
      incomingNotification: (
        <Notification key={message.id} content={message.content} />
      ),
    };
    return messageType[message.type];
  });

  return <main className="messages">{messageList}</main>;
};

export default MessageList;
