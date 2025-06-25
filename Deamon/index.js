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

async function getPublicIp() {
  try {
    log('Fetching public IP from ipify');
    const response = await axios.get('https://api.ipify.org?format=json');
    if (response.data.ip) {
      log(`Public IP fetched: ${response.data.ip}`);
      return response.data.ip;
    }
    log('No IP returned from ipify');
    return null;
  } catch (error) {
    log(`Error fetching public IP: ${error.message}`);
    return null;
  }
}

async function updateEc2Ip(newIp) {
  try {
    if (!EC2_API_URL || !API_KEY) {
      log('Missing configuration: EC2_API_URL or API_KEY not set');
      return;
    }

    log(`Sending IP update to EC2 proxy: ${newIp}`);
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

async function checkIpChange() {
  const newIp = await getPublicIp();
  if (!newIp) {
    log('Skipping IP update due to failed IP fetch');
    return;
  }

  if (newIp !== currentIp) {
    log(`IP change detected: ${currentIp} -> ${newIp}`);
    await updateEc2Ip(newIp);
  } else {
    log('No IP change detected');
  }
}

// Run every minute
cron.schedule('* * * * *', () => {
  log('Scheduled IP update check');
  checkIpChange();
});

// Initial IP check
log('Starting DDNS Daemon');
checkIpChange();