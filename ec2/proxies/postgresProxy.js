const net = require('net');
const { log } = require('../utils/logger');
const { POSTGRES_PORT, TARGET_IP } = require('../config');

let targetIp = TARGET_IP;

function startPostgresProxy() {
  net.createServer((clientSocket) => {
    const serverSocket = net.connect(POSTGRES_PORT, targetIp);
    clientSocket.pipe(serverSocket);
    serverSocket.pipe(clientSocket);
    clientSocket.on('error', (err) => log('PostgreSQL client socket error:', err.message));
    serverSocket.on('error', (err) => log('PostgreSQL server socket error:', err.message));
  }).listen(POSTGRES_PORT, () => {
    log(`PostgreSQL passthrough (TCP stream) listening on port ${POSTGRES_PORT}`);
  });
}

function updateTargetIp(newIp) {
  targetIp = newIp;
  log(`PostgreSQL proxy target IP updated to ${targetIp}`);
}

module.exports = { startPostgresProxy, updateTargetIp };
