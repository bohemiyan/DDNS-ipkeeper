const http = require('http');
const httpProxy = require('http-proxy');
const { log } = require('../utils/logger');
const { HTTP_PORT, TARGET_IP } = require('../config');

let targetIp = TARGET_IP;

function startHttpProxy() {
  const proxy = httpProxy.createProxyServer({});
  http.createServer((req, res) => {
    proxy.web(req, res, { target: `http://${targetIp}:${HTTP_PORT}` }, (err) => {
      log('HTTP proxy error:', err.message);
      res.writeHead(502);
      res.end('Bad Gateway');
    });
  }).listen(HTTP_PORT, () => {
    log(`HTTP proxy listening on port ${HTTP_PORT}`);
  });
}

function updateTargetIp(newIp) {
  targetIp = newIp;
  log(`HTTP proxy target IP updated to ${targetIp}`);
}

module.exports = { startHttpProxy, updateTargetIp };
