import React, { useState, useEffect, useReducer } from 'react';
import './App.scss';
import NavBar from './NavBar';
import ChatBar from './ChatBar';
import MessageList from './MessageList';
import messages from './lib/messages';

const messageReducer = (state, action) => {
  const actions = {
    incomingMessage: {
      ...state,
      messages: [...state.messages, action.message],
    },
    incomingNotification: {
      ...state,
      messages: [...state.messages, action.message],
    },
    updateUsername: {
      ...state,
      currentUser: { name: action.message },
    },
  };

  console.log('Action:', action.message, 'MEssages:', messages);

  if (!actions[action.type]) {
    throw new Error('Unkown type of action');
  }

  return actions[action.type];
};

const useSocket = url => {
  const [state, dispatch] = useReducer(messageReducer, messages);

  const [socketServer, setSocketServer] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    setSocketServer(new WebSocket(url));
    setConnected(true);
  }, [url]);

  useEffect(() => {
    // executes when connection is established
    if (connected) {
      socketServer.onopen = event => {
        console.log('connected to server');
      };
    }
  });

  useEffect(() => {
    // this executes when client receives a message
    if (connected) {
      socketServer.onmessage = event => {
        const message = JSON.parse(event.data);
        dispatch({ type: message.type, message });

        console.log(message);
      };
    }
  });

  return {
    state,
    socketServer,
    dispatch,
  };
};

const App = () => {
  // socket url is ws://localhost:8000

  const { socketServer, dispatch, state } = useSocket('ws://localhost:8000');

  // const [state, setState] = useState(messages);

  const sendMessage = msg => {
    console.log(`new message: ${msg}`);
    // build a newmessage object
    const newMessage = {
      type: 'postMessage',
      content: msg,
      username: state.currentUser.name,
    };

    socketServer.send(JSON.stringify(newMessage));
  };

  const updateUser = username => {
    console.log(`new username: ${username}`);

    dispatch({ type: 'updateUsername', message: username });

    const newNotification = {
      type: 'postNotification',
      content: `${
        state.currentUser.name
      } has changed their name to ${username}`,
    };

    socketServer.send(JSON.stringify(newNotification));
  };

  return (
    <div>
      <NavBar />
      <MessageList messages={state.messages} />
      <ChatBar
        username={state.currentUser.name}
        sendMessage={sendMessage}
        updateUser={updateUser}
      />
    </div>
  );
};

export default App;
