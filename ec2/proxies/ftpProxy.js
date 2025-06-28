const net = require('net');
const { log } = require('../utils/logger');
const { FTP_PORT, TARGET_IP } = require('../config');

let targetIp = TARGET_IP;

function startFtpProxy() {
  net.createServer((clientSocket) => {
    const serverSocket = net.connect(FTP_PORT, targetIp);
    clientSocket.pipe(serverSocket);
    serverSocket.pipe(clientSocket);
    clientSocket.on('error', (err) => log('FTP client socket error:', err.message));
    serverSocket.on('error', (err) => log('FTP server socket error:', err.message));
  }).listen(FTP_PORT, () => {
    log(`FTP passthrough (TCP stream) listening on port ${FTP_PORT}`);
  });
}

function updateTargetIp(newIp) {
  targetIp = newIp;
  log(`FTP proxy target IP updated to ${targetIp}`);
}

module.exports = { startFtpProxy, updateTargetIp };
