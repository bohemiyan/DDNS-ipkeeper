const net = require('net');
const { log } = require('../utils/logger');
const { HTTPS_PORT, TARGET_IP } = require('../config');

let targetIp = TARGET_IP;

function startHttpsProxy() {
  net.createServer((clientSocket) => {
    const serverSocket = net.connect(HTTPS_PORT, targetIp);
    clientSocket.pipe(serverSocket);
    serverSocket.pipe(clientSocket);
    clientSocket.on('error', (err) => log('HTTPS client socket error:', err.message));
    serverSocket.on('error', (err) => log('HTTPS server socket error:', err.message));
  }).listen(HTTPS_PORT, () => {
    log(`HTTPS passthrough (TCP stream) listening on port ${HTTPS_PORT}`);
  });
}

function updateTargetIp(newIp) {
  targetIp = newIp;
  log(`HTTPS proxy target IP updated to ${targetIp}`);
}

module.exports = { startHttpsProxy, updateTargetIp };
