const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const http = require('http');
const httpProxy = require('http-proxy');
const net = require('net');
const rateLimit = require('express-rate-limit');
const validator = require('validator');
require('dotenv').config();

// Config
const API_KEY = process.env.API_KEY ;
let targetIp = process.env.TARGET_IP || '0.0.0.0';

const HTTP_PORT = process.env.HTTP_PORT || 80;
const HTTPS_PORT = process.env.HTTPS_PORT || 443;
const ADMIN_PORT = process.env.ADMIN_PORT || 3080;

// Logger with timestamp
function log(...args) {
  const time = new Date().toISOString();
  console.log(`[${time}]`, ...args);
}

// HTTP reverse proxy
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

// HTTPS passthrough (TCP)
net.createServer((clientSocket) => {
  const serverSocket = net.connect(HTTPS_PORT, targetIp);
  clientSocket.pipe(serverSocket);
  serverSocket.pipe(clientSocket);
  clientSocket.on('error', (err) => log('Client socket error:', err.message));
  serverSocket.on('error', (err) => log('Server socket error:', err.message));
}).listen(HTTPS_PORT, () => {
  log(`HTTPS passthrough (TCP stream) listening on port ${HTTPS_PORT}`);
});

// Admin API with Express
const app = express();
app.use(helmet());
app.use(morgan(':method :url :status - :response-time ms'));
app.use(express.json());

// Rate limiter: max 10 requests per minute per IP
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: 'Too many requests, please try again later' }
});

app.use('/update-ip', limiter);

app.get('/update-ip', (req, res) => {
  const apiKey = req.headers['x-api-key'];
  let clientIp = req.ip;

  // Validate API key
  if (!apiKey || apiKey !== API_KEY) {
    log('Unauthorized IP update attempt');
    return res.status(401).json({ error: 'Invalid or missing API key' });
  }

  // Validate client IP
  if (!clientIp) {
    log('Unable to determine client IP');
    return res.status(400).json({ error: 'Unable to determine client IP' });
  }

  // Clean and validate IP address
  clientIp = clientIp.replace(/^::ffff:/, ''); // Handle IPv6-mapped IPv4
  if (!validator.isIP(clientIp, 4)) {
    log(`Invalid IP address: ${clientIp}`);
    return res.status(400).json({ error: 'Invalid IP address' });
  }

  // Update target IP if changed
  if (clientIp !== targetIp) {
    targetIp = clientIp;
    log(`Target IP updated to ${targetIp}`);
  } else {
    log(`No IP change needed: ${targetIp}`);
  }

  res.json({ message: 'IP updated successfully', newIp: targetIp });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.listen(ADMIN_PORT, () => {
  log(`Admin API listening on port ${ADMIN_PORT}`);
});