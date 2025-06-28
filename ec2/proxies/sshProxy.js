const net = require('net');
const { log } = require('../utils/logger');
const { SSH_PORT, TARGET_IP } = require('../config');

let targetIp = TARGET_IP;

function startSshProxy() {
  net.createServer((clientSocket) => {
    const serverSocket = net.connect(SSH_PORT, targetIp);
    clientSocket.pipe(serverSocket);
    serverSocket.pipe(clientSocket);
    clientSocket.on('error', (err) => log('SSH client socket error:', err.message));
    serverSocket.on('error', (err) => log('SSH server socket error:', err.message));
  }).listen(SSH_PORT, () => {
    log(`SSH passthrough (TCP stream) listening on port ${SSH_PORT}`);
  });
}

function updateTargetIp(newIp) {
  targetIp = newIp;
  log(`SSH proxy target IP updated to ${targetIp}`);
}

module.exports = { startSshProxy, updateTargetIp };
