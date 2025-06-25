const axios = require('axios');
const cron = require('node-cron');
require('dotenv').config();

const EC2_API_URL = process.env.EC2_API_URL;
const API_KEY = process.env.API_KEY ;
let currentIp = '';

async function getPublicIp() {
  try {
    const response = await axios.get(EC2_API_URL, {
      headers: { 'X-API-Key': API_KEY }
    });
    return response.data.ip; // Expect EC2 to return the client's IP
  } catch (error) {
    console.error('Error fetching IP from EC2:', error.message);
    return null;
  }
}

async function updateEc2Ip(newIp) {
  try {
    await axios.post(EC2_API_URL, { ip: newIp, apiKey: API_KEY });
    console.log(`IP updated on EC2: ${newIp}`);
  } catch (error) {
    console.error('Error updating EC2 IP:', error.message);
  }
}

async function checkIpChange() {
  const newIp = await getPublicIp();
  if (newIp && newIp !== currentIp) {
    console.log(`IP changed from ${currentIp} to ${newIp}`);
    currentIp = newIp;
    await updateEc2Ip(newIp);
  } else {
    console.log('No IP change detected');
  }
}

// Run every minute
cron.schedule('* * * * *', checkIpChange);

// Initial IP check
checkIpChange();