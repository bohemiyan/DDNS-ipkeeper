const net = require('net');
const { log } = require('../utils/logger');
const { SMTP_PORT, TARGET_IP } = require('../config');

let targetIp = TARGET_IP;

function startSmtpProxy() {
  net.createServer((clientSocket) => {
    const serverSocket = net.connect(SMTP_PORT, targetIp);
    clientSocket.pipe(serverSocket);
    serverSocket.pipe(clientSocket);
    clientSocket.on('error', (err) => log('SMTP client socket error:', err.message));
    serverSocket.on('error', (err) => log('SMTP server socket error:', err.message));
  }).listen(SMTP_PORT, () => {
    log(`SMTP passthrough (TCP stream) listening on port ${SMTP_PORT}`);
  });
}

function updateTargetIp(newIp) {
  targetIp = newIp;
  log(`SMTP proxy target IP updated to ${targetIp}`);
}

module.exports = { startSmtpProxy, updateTargetIp };
