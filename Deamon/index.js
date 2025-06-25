const axios = require('axios');
const cron = require('node-cron');
require('dotenv').config();

const EC2_API_URL = process.env.EC2_API_URL;
const API_KEY = process.env.API_KEY;
let currentIp = '';

// Logger with timestamp
function log(...args) {
  const time = new Date().toISOString();
  console.log(`[${time}]`, ...args);
}

async function updateEc2Ip() {
  try {
    if (!EC2_API_URL || !API_KEY) {
      log('Missing configuration: EC2_API_URL or API_KEY not set');
      return;
    }

    log('Attempting to update IP with EC2 proxy');
    const response = await axios.get(EC2_API_URL, {
      headers: { 'X-API-Key': API_KEY }
    });

    if (response.data.newIp) {
      log(`IP updated successfully on EC2: ${response.data.newIp}`);
      currentIp = response.data.newIp;
    } else {
      log('No IP returned from EC2 proxy');
    }
  } catch (error) {
    log(`Error updating EC2 IP: ${error.message}`);
  }
}

// Run every minute
cron.schedule('* * * * *', () => {
  log('Scheduled IP update check');
  updateEc2Ip();
});

// Initial IP update
log('Starting DDNS Daemon');
updateEc2Ip();