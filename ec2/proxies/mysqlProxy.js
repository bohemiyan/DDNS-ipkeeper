const net = require('net');
const { log } = require('../utils/logger');
const { MYSQL_PORT, TARGET_IP } = require('../config');

let targetIp = TARGET_IP;

function startMysqlProxy() {
  net.createServer((clientSocket) => {
    const serverSocket = net.connect(MYSQL_PORT, targetIp);
    clientSocket.pipe(serverSocket);
    serverSocket.pipe(clientSocket);
    clientSocket.on('error', (err) => log('MySQL client socket error:', err.message));
    serverSocket.on('error', (err) => log('MySQL server socket error:', err.message));
  }).listen(MYSQL_PORT, () => {
    log(`MySQL passthrough (TCP stream) listening on port ${MYSQL_PORT}`);
  });
}

function updateTargetIp(newIp) {
  targetIp = newIp;
  log(`MySQL proxy target IP updated to ${targetIp}`);
}

module.exports = { startMysqlProxy, updateTargetIp };
