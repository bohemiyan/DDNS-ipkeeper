const net = require('net');
const { log } = require('../utils/logger');
const { MONGODB_PORT, TARGET_IP } = require('../config');

let targetIp = TARGET_IP;

function startMongodbProxy() {
  net.createServer((clientSocket) => {
    const serverSocket = net.connect(MONGODB_PORT, targetIp);
    clientSocket.pipe(serverSocket);
    serverSocket.pipe(clientSocket);
    clientSocket.on('error', (err) => log('MongoDB client socket error:', err.message));
    serverSocket.on('error', (err) => log('MongoDB server socket error:', err.message));
  }).listen(MONGODB_PORT, () => {
    log(`MongoDB passthrough (TCP stream) listening on port ${MONGODB_PORT}`);
  });
}

function updateTargetIp(newIp) {
  targetIp = newIp;
  log(`MongoDB proxy target IP updated to ${targetIp}`);
}

module.exports = { startMongodbProxy, updateTargetIp };
