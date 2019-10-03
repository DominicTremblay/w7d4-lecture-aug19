const express = require('express');
const uuid = require('uuid/v4');
const SocketServer = require('ws');
const PORT = process.env.port || 5000;

const app = express();

const server = app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));

// Create the ws server
const wss = new SocketServer.Server({ server });

wss.broadcast = (data) => {
	wss.clients.forEach((client) => {
		if (client.readyState === SocketServer.OPEN) {
			client.send(data);
		}
	});
};

wss.on('connection', (wsClient) => {
	console.log('Client connected');

	wsClient.on('message', (data) => {
		// make the message to an object
		const message = JSON.parse(data);

		message.id = uuid();

		switch (message.type) {
			case 'postNotification':
				message.type = 'incomingNotification';
				// Broadcast the message to all clients
				wss.broadcast(JSON.stringify(message));
				break;
			case 'postMessage':
				message.type = 'incomingMessage';
				// Broadcast the message to all clients
				wss.broadcast(JSON.stringify(message));
				break;
			default:
				console.log('Unkown message type');
		}
	});

	wsClient.on('close', () => {
		console.log('client disconnected');
	});
});
