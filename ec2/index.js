const { startHttpProxy } = require('./proxies/httpProxy');
const { startHttpsProxy } = require('./proxies/httpsProxy');
const { startSshProxy } = require('./proxies/sshProxy');
const { startSmtpProxy } = require('./proxies/smtpProxy');
const { startMysqlProxy } = require('./proxies/mysqlProxy');
const { startPostgresProxy } = require('./proxies/postgresProxy');
const { startMongodbProxy } = require('./proxies/mongodbProxy');
const { startFtpProxy } = require('./proxies/ftpProxy');
const { startAdminApi } = require('./router/adminRouter');
const { log } = require('./utils/logger');
const { startSftpProxy } = require('./proxies/sftpProxy');

// Start all proxies and admin API
log('Starting proxy server...');
startHttpProxy();
startHttpsProxy();
// startSshProxy();
startSmtpProxy();
startMysqlProxy();
startPostgresProxy();
startMongodbProxy();
startFtpProxy();
// startSftpProxy();
startAdminApi();
