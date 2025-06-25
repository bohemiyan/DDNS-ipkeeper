const axios = require('axios');
const cron = require('node-cron');
require('dotenv').config();

const EC2_API_URL = process.env.EC2_API_URL;
const API_KEY = process.env.API_KEY ;
let currentIp = '';

async function updateEc2Ip() {
  try {
    const response = await axios.get(EC2_API_URL, {
      headers: { 'X-API-Key': API_KEY }
    });
    console.log(`IP updated on EC2: ${response.data.newIp}`);
    currentIp = response.data.newIp;
  } catch (error) {
    console.error('Error updating EC2 IP:', error.message);
  }
}

// Run every minute
cron.schedule('* * * * *', updateEc2Ip);

// Initial IP update
updateEc2Ip();