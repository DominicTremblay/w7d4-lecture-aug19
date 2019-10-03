import React, { useState } from 'react';
import './ChatBar.scss';

const ChatBar = ({ username: defaultUsername, sendMessage, updateUser }) => {
  const [username, setUsername] = useState(defaultUsername || 'Anonymous');
  const [msgInput, setMsgInput] = useState('');

  const handleUsername = event => {
    const commitKey = event.key === 'Enter' || event.key === 'Tab';
    if (commitKey) {
      updateUser(username);
    }
  };

  const handleMessage = event => {
    const commitKey = event.key === 'Enter' || event.key === 'Tab';
    if (commitKey) {
      sendMessage(msgInput);
      setMsgInput('');
    }
  };

  return (
    <footer className="chatbar">
      <input
        className="chatbar-username"
        name="username"
        placeholder="Your Name (Optional)"
        value={username}
        onChange={event => setUsername(event.target.value)}
        onKeyDown={handleUsername}
      />
      <input
        className="chatbar-message"
        name="message"
        placeholder="Type a message and hit ENTER"
        onKeyDown={handleMessage}
        value={msgInput}
        onChange={event => setMsgInput(event.target.value)}
      />
    </footer>
  );
};

export default ChatBar;
