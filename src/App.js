import React, { useState, useEffect, useReducer } from 'react';
import logo from './logo.svg';
import './App.scss';
import NavBar from './NavBar';
import ChatBar from './ChatBar';
import MessageList from './MessageList';
// import messages from './lib/messages';

// create a message reducer to update the state
const messageReducer = (state, action) => {
	const actions = {
		incomingNotification: {
			...state,
			messages: [ ...state.messages, action.message ]
		},
		incomingMessage: {
			...state,
			messages: [ ...state.messages, action.message ]
		},
		updateUsername: {
			...state,
			currentUser: {
				name: action.message
			}
		}
	};

	if (!actions[action.type]) {
		throw new Error('Unkown action type');
	}

	// return the state from the corresponding action
	return actions[action.type];
};

// Create a custom hook to connect to WebSocket
const useSocket = (url) => {
	const [ socketServer, setSocketServer ] = useState(null);
	const [ connected, setConnected ] = useState(false);

	// use messageReducer to manage the messages state
	const [ state, dispatch ] = useReducer(messageReducer, {
		currentUser: { name: 'Anonymous' },
		messages: []
	});

	// useEffect to connect to WebSocket
	useEffect(
		() => {
			setSocketServer(new WebSocket(url));
			setConnected(true);
		},
		[ url ]
	);

	// useEffect to attach event listeners onopen and onmessage
	useEffect(() => {
		if (connected) {
			socketServer.onopen = (event) => {
				console.log('Client connected to server');
			};
			socketServer.onmessage = (event) => {
				const message = JSON.parse(event.data);
				console.log(message);
				switch (message.type) {
					case 'incomingNotification':
						dispatch({ type: 'incomingNotification', message });
						break;
					case 'incomingMessage':
						dispatch({ type: 'incomingMessage', message });
						break;
					default:
						console.log('unkown message type');
				}
			};
		}
	});

	return {
		state,
		dispatch,
		socketServer
	};
};

function App() {
	const { state, dispatch, socketServer } = useSocket('ws://localhost:5000');

	// Sending message from the chat to the server
	const sendMessage = (message) => {
		console.log('sending message', message);
		// build new message object with type, content, username
		const newMessage = {
			type: 'postMessage',
			content: message,
			username: state.currentUser.name
		};

		socketServer.send(JSON.stringify(newMessage));
	};

	const updateUser = (username) => {
		// create notification object that the user has changed their username
		const newNotification = {
			type: 'postNotification',
			content: `${state.currentUser.name} has change their name to ${username}`
		};

		// change the username in the state
		dispatch({ type: 'updateUsername', message: username });

		// send notification to server
		socketServer.send(JSON.stringify(newNotification));
	};
	return (
		<div>
			<NavBar />
			<MessageList messages={state.messages} />
			<ChatBar username={state.currentUser.name} sendMessage={sendMessage} updateUser={updateUser} />
		</div>
	);
}

export default App;
