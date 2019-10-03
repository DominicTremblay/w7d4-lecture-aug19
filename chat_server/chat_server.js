/* eslint-disable indent */
const express = require('express');
const uuid = require('uuid/v4');
const SocketServer = require('ws');
const PORT = process.env.port || 5000;

const app = express();

const server = app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));

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
		const message = JSON.parse(data);
		message.id = uuid();

		switch (message.type) {
			case 'postMessage':
				message.type = 'incomingMessage';
				wss.broadcast(JSON.stringify(message));
				break;
			case 'postNotification':
				message.type = 'incomingNotification';
				wss.broadcast(JSON.stringify(message));
				break;
			default:
				throw new Error('Unkown Type of Message');
		}
	});
});

wss.on('close', () => {
	console.log('client disconnected');
});
