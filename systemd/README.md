# Systemd Service for Toronto Daycare App

## Installation

1. Copy the service file to systemd:
```bash
sudo cp toronto-daycare.service /etc/systemd/system/
```

2. Create log directory:
```bash
sudo mkdir -p /var/log/toronto-daycare
sudo chown nginx:nginx /var/log/toronto-daycare
```

3. Reload systemd and start the service:
```bash
sudo systemctl daemon-reload
sudo systemctl start toronto-daycare
sudo systemctl enable toronto-daycare
```

## Management Commands

```bash
# Check status
sudo systemctl status toronto-daycare

# Start/Stop/Restart
sudo systemctl start toronto-daycare
sudo systemctl stop toronto-daycare
sudo systemctl restart toronto-daycare

# View logs
sudo journalctl -u toronto-daycare -f

# View log files
tail -f /var/log/toronto-daycare/app.log
tail -f /var/log/toronto-daycare/error.log

# Disable service
sudo systemctl disable toronto-daycare
```

## Troubleshooting

If the service fails to start:

1. Check npm is in the path:
```bash
which npm
# If not /usr/bin/npm, update ExecStart path in the service file
```

2. Check permissions:
```bash
sudo -u nginx npm --version
```

3. Make sure dependencies are installed:
```bash
cd /var/www/toronto_daycares/nextjs_app
sudo npm install
```

4. Check SELinux:
```bash
sudo setsebool -P httpd_can_network_connect 1
```

5. View detailed errors:
```bash
sudo journalctl -xe -u toronto-daycare
```