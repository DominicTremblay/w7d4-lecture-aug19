import React, { useState, useEffect, useReducer } from 'react';
import logo from './logo.svg';
import './App.scss';
import NavBar from './NavBar';
import ChatBar from './ChatBar';
import MessageList from './MessageList';
// import lib from './lib/messages';

// create a message reducer to update the state

// return the state from the corresponding action

// Create a custom hook to connect to WebSocket

const messageReducer = (state, action) => {
	// type: newMessage or updateUser

	const actions = {
		// adding a new message to the state
		newMessage: {
			...state,
			messages: [ ...state.messages, action.message ]
		},
		updateUser: {
			...state,
			currentUser: { name: action.message }
		}
	};

	if (!actions[action.type]) {
		throw new Error('Unknown message type');
	}

	return actions[action.type];
};

const useSocket = (url) => {
	// use the reducer
	const [ state, dispatch ] = useReducer(messageReducer, {
		currentUser: { name: 'Anonymous' },
		messages: []
	});

	// Create 2 states: socketServer, connected
	const [ socketServer, setSocketServer ] = useState(null);
	const [ connected, setConnected ] = useState(false);

	// useEffect to connect to WebSocket

	useEffect(
		() => {
			setSocketServer(new WebSocket(url));
			setConnected(true);
		},
		[ url ]
	);

	useEffect(() => {
		if (connected) {
			socketServer.onopen = () => {
				console.log('client connected to server');
			};
			socketServer.onmessage = (event) => {
				const message = JSON.parse(event.data);

				// update the list of messages
				dispatch({ type: 'newMessage', message });
			};

			socketServer.onClose = () => console.log('Client disconnected from server');
		}
	});

	return { socketServer, state, dispatch };
};

// useEffect to attach event listeners onopen and onmessage

// return state, dispatch,socketServer

function App() {
	// use the custom hook
	const { socketServer, state, dispatch } = useSocket('ws://localhost:5000');

	// Sending message from the chat to the server
	const sendMessage = (message) => {
		const newMessage = {
			type: 'postMessage',
			content: message,
			username: state.currentUser.name
		};

		// send a message to the server
		socketServer.send(JSON.stringify(newMessage));
	};

	const updateUser = (username) => {
		// {
		//   type: 'incomingNotification',
		//   content: 'Anonymous1 changed their name to nomnom',
		// },

		const newNotificaton = {
			type: 'postNotification',
			content: `${state.currentUser.name} has changed their name to ${username}`
		};
		// updated the current username in the state
		// lib.currentUser = {
		// 	name: username
		// };

		// updating the username in the state
		dispatch({ type: 'updateUser', message: username });

		// send a message to the server
		socketServer.send(JSON.stringify(newNotificaton));
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
