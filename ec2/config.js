require('dotenv').config();

module.exports = {
  API_KEY: process.env.API_KEY,
  TARGET_IP: process.env.TARGET_IP || '0.0.0.0',
  HTTP_PORT: process.env.HTTP_PORT || 80,
  HTTPS_PORT: process.env.HTTPS_PORT || 443,
  ADMIN_PORT: process.env.ADMIN_PORT || 3080,
  SMTP_PORT: process.env.SMTP_PORT || 25,
  SSH_PORT: process.env.SSH_PORT || 22,
  MYSQL_PORT: process.env.MYSQL_PORT || 3306,
  POSTGRES_PORT: process.env.POSTGRES_PORT || 5432,
  MONGODB_PORT: process.env.MONGODB_PORT || 27017,
  FTP_PORT: process.env.FTP_PORT || 21,
  SFTP_PORT: process.env.SFTP_PORT || 22,
};
