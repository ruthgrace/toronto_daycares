# Nginx Configuration for Toronto Daycare Finder

## Setup Instructions

### 1. Copy the nginx config to your server:
```bash
# On your Alma Linux server
sudo cp torontodaycare.conf /etc/nginx/conf.d/
```

### 2. Test the configuration:
```bash
sudo nginx -t
```

### 3. Reload nginx:
```bash
sudo systemctl reload nginx
```

### 4. Set up DNS:
Create an A record pointing `torontodaycare.ruthgracewong.com` to your server's IP address.

### 5. Start the Next.js application:
```bash
cd /var/www/toronto_daycares/nextjs_app
npm install
npm run build

# Using PM2 to keep it running
pm2 start npm --name "toronto-daycare" -- start
pm2 save
pm2 startup systemd
```

### 6. Set up SSL with Let's Encrypt:
```bash
# Install certbot if not already installed
sudo dnf install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d torontodaycare.ruthgracewong.com

# Certbot will automatically update the nginx config
```

### 7. Firewall Configuration:
```bash
# Open HTTP and HTTPS ports
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

## File Locations

- Nginx config: `/etc/nginx/conf.d/torontodaycare.conf`
- Next.js app: `/var/www/toronto_daycares/nextjs_app`
- SSL certificates: `/etc/letsencrypt/live/torontodaycare.ruthgracewong.com/`

## Useful Commands

```bash
# Check nginx status
sudo systemctl status nginx

# View nginx error logs
sudo tail -f /var/log/nginx/error.log

# Check PM2 status
pm2 status

# View app logs
pm2 logs toronto-daycare

# Restart the app
pm2 restart toronto-daycare

# Stop the app
pm2 stop toronto-daycare
```

## Troubleshooting

1. **502 Bad Gateway**: Make sure the Next.js app is running on port 3001
2. **Connection refused**: Check firewall settings and that the app is listening on 127.0.0.1:3001
3. **SSL issues**: Run `sudo certbot renew --dry-run` to test certificate renewal