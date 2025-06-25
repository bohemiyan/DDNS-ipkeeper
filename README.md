# 🌐 IPKeeper

> **Dynamic IP, Static Dreams** - Because your wallet shouldn't cry every time your IP changes! 💸

Transform your AWS free-tier EC2 instance into a magical reverse proxy that keeps your home server accessible 24/7, even when your ISP decides to play musical chairs with your IP address. No more expensive static IP services, no more "it worked yesterday" moments!

### 🎭 The Struggle is Real
- Your ISP changes your IP more often than you change socks 🧦
- Static IP costs more than your coffee addiction ☕
- Your friends can't access your awesome home server 😢
- You're tired of explaining "just use the new IP" every day 🔄

---

## ✨ What is IPKeeper?

IPKeeper is a lightweight Node.js application that bridges the gap between your dynamic home server and the internet. It runs on AWS EC2's free tier and automatically updates your server's changing IP address, ensuring uninterrupted access to your services.

### 🎯 Perfect For
- Home lab wizards on ramen budgets 🍜
- Developers who code more than they earn 💻
- Small businesses allergic to monthly fees 💊
- Anyone whose router has commitment issues 📡
- People who think $50/month for static IP is highway robbery 🦹‍♂️
- **Non-coders who just want it to work!** 🎯

### 🚀 Key Features

#### 🔄 **Smart Reverse Proxy**
- **HTTP Traffic**: Like a GPS for your web requests 🗺️
- **HTTPS Passthrough**: Keeps your secrets secret (end-to-end encryption) 🔐
- **Automatic Failover**: Gracefully handles server tantrums 😤

#### 🛡️ **Security That Actually Works**
- Complex API key that looks like someone smashed their keyboard 🎹
- Rate limiting because spam is for canned meat, not APIs 🥫
- Input validation that's pickier than a food critic 👨‍🍳
- Security headers that make hackers cry 😭

#### 📊 **Logging That Tells Stories**
- Detailed request logs (who, what, when, how long) 📚
- Error tracking for when things go sideways 🎢
- IP update notifications (your server's diary) 📖
- Unauthorized access alerts (digital burglar alarms) 🚨

---

## 🛠️ Quick Setup Guide (Choose Your Adventure!)

### 🎯 Adventure Path A: "I Have a Domain" (The Fancy Route)

#### Step 1: Launch Your Free EC2 Instance

1. **Sign up for AWS Free Tier** (it's like Christmas, but for developers) 🎄
2. **Launch a t2.micro instance** - it's tiny but mighty! 💪
3. **Configure Security Group** (your digital bouncer):
   ```
   Port 80 (HTTP) - Source: 0.0.0.0/0    # Let everyone in for HTTP
   Port 443 (HTTPS) - Source: 0.0.0.0/0  # HTTPS party too!
   Port 3080 (Admin API) - Source: Your IP # VIP access only
   Port 22 (SSH) - Source: Your IP       # Your secret backdoor
   ```

#### Step 2: Domain Magic ✨

1. **Purchase a domain** (or beg a free subdomain from the internet gods)
2. **Add an A record** like you're planting a digital flag:
   ```
   Type: A
   Name: @ (or whatever makes you happy)
   Value: [Your Shiny EC2 Public IP]
   TTL: 300 (because patience is overrated)
   ```

### 🚀 Adventure Path B: "Domains Are Expensive!" (The Rebel Route)

**Plot twist!** You don't actually need a domain! Just use your EC2's public IP directly:

1. **Get your EC2 Public IP** from the AWS console (something like `12.34.56.78`)
2. **Use it directly** in all configurations:
   - Access your services: `http://12.34.56.78`
   - Update endpoint: `http://12.34.56.78:3080/update-ip`
3. **Bookmark it** because memorizing IPs is for masochists 📑
4. **Pro tip**: EC2 IPs change when you stop/start, so either keep it running or use an Elastic IP (which is free as long as it's attached!) 💡

> **"But what about HTTPS?"** - You can still use HTTPS with IP addresses! Your browser will complain about certificates, but your data will still be encrypted. For production, consider a free domain or Let's Encrypt with DNS challenges.

### Step 3: Install the Magic ✨

SSH into your EC2 instance (time to get your hands dirty!):

```bash
# Update your system (like taking vitamins for your server)
sudo apt update && sudo apt upgrade -y

# Install Node.js (the heart of our operation)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone the magic kingdom
git clone https://github.com/bohemiyan/ipkeeper.git
cd ipkeeper/ec2

# Install all dependencies (they're already in package.json!)
npm install

# Install PM2 globally (your process manager bestie)
npm install -g pm2
```

### Step 4: Configure Your EC2 Server (No Coding Required!) 🎛️

**Don't worry - you don't need to touch any code!** Just update the environment file:

1. **Edit the `.env` file** in the `ec2` folder:
   ```bash
   nano .env
   ```

2. **Update these values** with your specific information:
   ```env
   # 🔐 Security Key (Keep this secret!)
   API_KEY=9kX#2mP$7vN!qW3rT8yU&zL5jF@h%R6tB

   # 🏠 Your Home Server's Current IP (this will update automatically)
   TARGET_IP=12.34.56.78

   # 🌐 Server Ports (usually don't need to change these)
   HTTP_PORT=80
   HTTPS_PORT=443
   ADMIN_PORT=3080
   ```

3. **Save and exit** (Ctrl+X, then Y, then Enter in nano)

> **🎯 Pro Tip**: The `TARGET_IP` will be automatically updated by your home server daemon, so don't worry if it's wrong initially!

### Step 5: Awaken the Service 🌟

Use the built-in scripts (because we're fancy like that):

```bash
# Start the service (production mode)
npm run pm2

# Other handy commands for your toolbelt:
npm run pm2:stop      # Put it to sleep
npm run pm2:restart   # Wake it up refreshed
npm run pm2:logs      # See what it's thinking
npm run pm2:delete    # Nuclear option
```

### Step 6: Configure Your Home Server Daemon (Also No Coding!) 🏠

Set up the daemon on your home server:

```bash
# Clone the repo on your home server too
git clone https://github.com/yourusername/ipkeeper.git
cd ipkeeper/daemon

# Install dependencies
npm install
```

### Step 7: Configure Your Home Server (Super Easy!) 📝

1. **Edit the `.env` file** in the `daemon` folder:
   ```bash
   nano .env
   ```

2. **Update these values** (just copy-paste with your EC2 IP):
   ```env
   # 🌐 Your EC2 Server URL (replace with your EC2's public IP)
   EC2_API_URL=http://12.34.56.78:3080/update-ip

   # 🔐 Same Security Key as your EC2 server
   API_KEY=9kX#2mP$7vN!qW3rT8yU&zL5jF@h%R6tB

   ```

3. **Save and exit** (Ctrl+X, then Y, then Enter in nano)

### Step 8: Start Your Home Server Daemon 🚀

```bash
# Start the daemon
npm run pm2:start

# Other daemon commands:
npm run pm2:stop      # Stop the daemon
npm run pm2:restart   # Restart the daemon
npm run pm2:logs      # Check daemon logs
npm run pm2:delete    # Remove the daemon
```

> **🎉 That's it!** The daemon will automatically detect your public IP and send it to your EC2 instance every 5 minutes. No manual IP hunting required!

---

## 🔧 Configuration Reference (The Complete Guide)

### EC2 Server Environment Variables 🌩️
```env
# Security & Authentication
API_KEY=9kX#2mP$7vN!qW3rT8yU&zL5jF@h%R6tB    # Your secret handshake

# Target Configuration
TARGET_IP=12.34.56.78                        # Your home server IP (auto-updated)

# Port Configuration
HTTP_PORT=80                                     # Standard HTTP port
HTTPS_PORT=443                                   # Standard HTTPS port
ADMIN_PORT=3080                                  # Admin API port

```

### Home Server Daemon Environment Variables 🏠
```env
# EC2 Connection
EC2_API_URL=http://12.34.56.78:3080/update-ip  # Your EC2 update endpoint
API_KEY=9kX#2mP$7vN!qW3rT8yU&zL5jF@h%R6tB        # Same key as EC2

```

### 🎯 Quick Configuration Examples

**Example 1: Basic Home Lab Setup**
```env
# EC2 Server (.env in ec2/ folder)
API_KEY=your-super-secret-key-here
TARGET_IP=192.168.1.100
HTTP_PORT=80
HTTPS_PORT=443
ADMIN_PORT=3080

# Home Server (.env in daemon/ folder)
EC2_API_URL=http://your-ec2-ip:3080/update-ip
API_KEY=your-super-secret-key-here
```

**Example 2: Development/Testing Setup**
```env
# EC2 Server
API_KEY=dev-key-123
TARGET_IP=localhost
HTTP_PORT=8080
HTTPS_PORT=8443
ADMIN_PORT=3080

# Home Server
EC2_API_URL=http://localhost:3080/update-ip
API_KEY=dev-key-123
UPDATE_INTERVAL=1  # Check every minute for testing
```

---

## 📡 API Reference (The Technical Bits)

### The Magic Update Endpoint 🪄

**Endpoint**: `GET /update-ip`  
**Port**: 3080 (or whatever you set in `ADMIN_PORT`)  
**Authentication**: The secret handshake (X-API-Key header)

**Request Example**:
```bash
# With domain
curl -H "X-API-Key: 9kX#2mP$7vN!qW3rT8yU&zL5jF@h%R6tB" \
     http://your-domain.com:3080/update-ip

# With EC2 IP (for the domain-less rebels)
curl -H "X-API-Key: 9kX#2mP$7vN!qW3rT8yU&zL5jF@h%R6tB" \
     http://12.34.56.78:3080/update-ip
```

**Success Response** (The happy ending):
```json
{
  "message": "IP updated successfully! 🎉",
  "newIp": "12.34.56.78"
}
```

**Error Responses** (When things go sideways):
- `401 Unauthorized`: "Who are you? Papers, please!" 👮‍♂️
- `400 Bad Request`: "That's not a valid IP, buddy" 🤷‍♂️
- `429 Too Many Requests`: "Slow down there, speedy!" 🐌
- `404 Not Found`: "You're lost, aren't you?" 🗺️

---

## 🛡️ Security Best Practices

### 🔐 **API Key Management**
- The default API key is: `9kX#2mP$7vN!qW3rT8yU&zL5jF@h%R6tB`
- **Change it immediately** for production use
- Use a password manager to generate a strong key
- Never share your API key in screenshots or logs

### 🌐 **Network Security**
- Restrict API port (3080) access to trusted IPs in AWS Security Groups
- Use security groups to limit inbound traffic
- Consider VPN access for admin endpoints

### 📊 **Monitoring**
- Set up CloudWatch alarms for unusual traffic
- Monitor application logs regularly with `npm run pm2:logs`
- Track unauthorized access attempts

---

## 🔍 Troubleshooting (When Murphy's Law Strikes)

### The Hall of Fame: Common Issues 🏆

**"API Key Mismatch" Error** 🔑
```bash
# Make sure both .env files have the EXACT same API_KEY
# Check for extra spaces or invisible characters
# Default key: 9kX#2mP$7vN!qW3rT8yU&zL5jF@h%R6tB
```

**"Can't Connect to EC2" Error** 🌐
```bash
# Verify your EC2_API_URL in daemon/.env
# Should be: http://YOUR-EC2-IP:3080/update-ip
# Example: http://12.34.56.78:3080/update-ip

# Test manually:
curl -H "X-API-Key: 9kX#2mP$7vN!qW3rT8yU&zL5jF@h%R6tB" \
     http://12.34.56.78:3080/update-ip
```

**"Port Already in Use" Error** 🚪
```bash
# Find the port squatter
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :443
sudo netstat -tlnp | grep :3080

# Evict them (use with caution!)
sudo kill -9 [PID]
```

**"Proxy Not Working" Nightmare** 🌙
1. ✅ Check if your home server is running
2. ✅ Verify the TARGET_IP in ec2/.env matches your home server
3. ✅ Test direct access to your home server first
4. ✅ Check both server logs: `npm run pm2:logs`

**"Environment File Not Found"** 📄
```bash
# Create the .env file if it doesn't exist
touch .env

# Copy the example configuration above
# Make sure you're in the right directory (ec2/ or daemon/)
```

### 🆘 Emergency Commands

**Restart Everything:**
```bash
# On EC2 server
cd ipkeeper/ec2
npm run pm2:restart

# On home server
cd ipkeeper/daemon
npm run pm2:restart
```

**Check What's Running:**
```bash
pm2 list
pm2 logs
```

**Nuclear Reset:**
```bash
pm2 delete all
npm run pm2  # or npm run pm2:start for daemon
```

---

## 📊 Monitoring Dashboard

Track your IPKeeper performance:

- **Uptime**: Monitor service availability with `pm2 monit`
- **Request Count**: Track HTTP/HTTPS traffic in logs
- **IP Changes**: Monitor daemon logs for update notifications
- **Error Rate**: Watch for failed connections
- **Response Time**: Measure proxy performance

### Useful Monitoring Commands
```bash
# Real-time monitoring
pm2 monit

# Check logs
npm run pm2:logs

# System resource usage
pm2 list
```

---

## 🎯 For Non-Coders: Complete Setup Checklist

### ✅ EC2 Setup Checklist
- [ ] AWS account created and EC2 instance launched
- [ ] Security group configured (ports 80, 443, 3080, 22)
- [ ] Connected to EC2 via SSH
- [ ] Node.js installed
- [ ] IPKeeper code downloaded
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file configured with your settings
- [ ] Service started (`npm run pm2`)

### ✅ Home Server Setup Checklist
- [ ] IPKeeper daemon code downloaded
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file configured with EC2 URL and API key
- [ ] Daemon started (`npm run pm2:start`)
- [ ] Daemon logs show successful IP updates

### ✅ Testing Checklist
- [ ] Can access EC2 server at `http://YOUR-EC2-IP`
- [ ] Home server IP updates automatically
- [ ] Services accessible through EC2 proxy
- [ ] Both services restart automatically after reboot

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch
3. **Commit** your changes
4. **Push** to the branch
5. **Create** a Pull Request

### Development Setup
```bash
git clone https://github.com/yourusername/ipkeeper.git
cd ipkeeper
npm install
npm run dev
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## ⭐ Support IPKeeper

If IPKeeper helped you save money and hassle, consider:

- ⭐ **Starring** this repository
- 🐛 **Reporting** bugs and issues
- 💡 **Suggesting** new features
- 📖 **Improving** documentation
- 🔄 **Sharing** with others who need it

---

**Happy proxying, you magnificent human! 🚀**

> Remember: The best solutions are the ones that work while you sleep. And maybe eat pizza. Probably eat pizza. 🍕

---

## 🎈 Final Words

IPKeeper isn't just code – it's freedom from the tyranny of static IP pricing! Whether you're running a blog, a game server, a home lab, or that weird IoT project that monitors your houseplants, IPKeeper has your back.

**The best part?** Once it's set up, you can literally forget about it. Your IP can change 100 times, and your friends will still be able to access your services without you lifting a finger. It's like having a personal assistant for your network, except it doesn't judge your 3 AM coding sessions.

**And for non-coders?** We've made it as simple as editing two text files. No programming knowledge required – just copy, paste, and run the commands. If you can follow a recipe, you can set up IPKeeper!

Now go forth and proxy like the budget-conscious genius you are! 🎊