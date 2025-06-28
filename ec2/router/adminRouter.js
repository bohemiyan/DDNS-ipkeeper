const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const validator = require('validator');
const { log } = require('../utils/logger');
const { API_KEY, ADMIN_PORT } = require('../config');
const { updateTargetIp: updateHttpIp } = require('../proxies/httpProxy');
const { updateTargetIp: updateHttpsIp } = require('../proxies/httpsProxy');
const { updateTargetIp: updateSshIp } = require('../proxies/sshProxy');
const { updateTargetIp: updateSmtpIp } = require('../proxies/smtpProxy');
const { updateTargetIp: updateMysqlIp } = require('../proxies/mysqlProxy');
const { updateTargetIp: updatePostgresIp } = require('../proxies/postgresProxy');
const { updateTargetIp: updateMongodbIp } = require('../proxies/mongodbProxy');
const { updateTargetIp: updateFtpIp } = require('../proxies/ftpProxy');
const { updateTargetIp: updateSftpIp } = require('../proxies/sftpProxy');

function startAdminApi() {
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

    // Update target IP for all proxies
    updateHttpIp(clientIp);
    updateHttpsIp(clientIp);
    // updateSshIp(clientIp);
    updateSmtpIp(clientIp);
    updateMysqlIp(clientIp);
    updatePostgresIp(clientIp);
    updateMongodbIp(clientIp);
    updateFtpIp(clientIp);
    // updateSftpIp(clientIp);

    res.json({ message: 'IP updated successfully', newIp: clientIp });
  });

  app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
  });

  app.listen(ADMIN_PORT, () => {
    log(`Admin API listening on port ${ADMIN_PORT}`);
  });
}

module.exports = { startAdminApi };
