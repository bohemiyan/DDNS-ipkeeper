const net = require('net');
const { log } = require('../utils/logger');
const { SFTP_PORT, TARGET_IP } = require('../config');

let targetIp = TARGET_IP;

function startSftpProxy() {
  net.createServer((clientSocket) => {
    const serverSocket = net.connect(SFTP_PORT, targetIp);
    clientSocket.pipe(serverSocket);
    serverSocket.pipe(clientSocket);
    clientSocket.on('error', (err) => log('SFTP client socket error:', err.message));
    serverSocket.on('error', (err) => log('SFTP server socket error:', err.message));
  }).listen(SFTP_PORT, () => {
    log(`SFTP passthrough (TCP stream) listening on port ${SFTP_PORT}`);
  });
}

function updateTargetIp(newIp) {
  targetIp = newIp;
  log(`SFTP proxy target IP updated to ${targetIp}`);
}

module.exports = { startSftpProxy, updateTargetIp };