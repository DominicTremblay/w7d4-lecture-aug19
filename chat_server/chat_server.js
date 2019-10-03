const express = require('express');
const uuid = require('uuid/v4');
const SocketServer = require('ws');
const PORT = process.env.port || 5000;

const app = express();

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
