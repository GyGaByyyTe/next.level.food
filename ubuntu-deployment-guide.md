# Deployment Guide: NextLevel Food on Ubuntu 22.04

This guide provides step-by-step instructions for deploying the NextLevel Food application on an Ubuntu 22.04 server without Node.js or Git pre-installed.

## Overview

NextLevel Food is a Next.js application built with React and TypeScript that uses SQLite for data storage. This guide will walk you through the complete process of deploying the application on a fresh Ubuntu 22.04 server.

### Deployment Process Summary

1. Prepare the Ubuntu server
2. Install required dependencies (Node.js, SQLite, build tools)
3. Transfer the application code to the server
4. Set up and build the application
5. Configure a production environment with PM2
6. Set up Nginx as a reverse proxy
7. Secure the application with SSL

## Table of Contents

1. [Server Preparation](#1-server-preparation)
2. [Installing Dependencies](#2-installing-dependencies)
3. [Transferring Application Code](#3-transferring-application-code)
4. [Setting Up the Application](#4-setting-up-the-application)
5. [Building the Application](#5-building-the-application)
6. [Setting Up a Production Environment](#6-setting-up-a-production-environment)
7. [Starting the Application](#7-starting-the-application)
8. [Configuring Nginx](#8-configuring-nginx)
9. [Setting Up SSL with Certbot](#9-setting-up-ssl-with-certbot)
10. [Maintenance and Updates](#10-maintenance-and-updates)

## 1. Server Preparation

First, connect to your Ubuntu server via SSH:

```bash
ssh username@your_server_ip
```

Update the system packages:

```bash
sudo apt update
sudo apt upgrade -y
```

## 2. Installing Dependencies

### Install Node.js

The application requires Node.js. Install it using the following commands:

```bash
# Install curl if not already installed
sudo apt install -y curl

# Install Node.js 20.x (LTS version compatible with Next.js 15)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node -v
npm -v
```

### Install SQLite

The application uses SQLite for data storage:

```bash
sudo apt install -y sqlite3
```

### Install Build Essentials

These are required for compiling native Node.js modules:

```bash
sudo apt install -y build-essential
```

## 3. Transferring Application Code

Since Git is not available on the server, you'll need to transfer the application code from your local machine to the server.

### Option 1: Using SCP (Secure Copy)

From your local machine, compress the project directory:

```bash
# On your local machine
cd /path/to/project/parent/directory
tar -czvf food.does.cool.tar.gz food.does.cool/
```

Transfer the compressed file to the server:

```bash
# On your local machine
scp food.does.cool.tar.gz username@your_server_ip:~/
```

On the server, extract the compressed file:

```bash
# On the server
cd ~
mkdir -p applications
tar -xzvf food.does.cool.tar.gz -C applications/
cd applications/food.does.cool
```

### Option 2: Using SFTP

You can use an SFTP client like FileZilla to transfer files to the server.

1. Connect to your server using SFTP
2. Navigate to the desired directory on the server
3. Upload the entire project directory

## 4. Setting Up the Application

Navigate to the application directory on the server:

```bash
cd ~/applications/food.does.cool
```

### Environment Configuration

For production deployment, you may need to set up environment variables. Create a `.env.production` file:

```bash
cat > .env.production << EOL
# Production environment variables
NODE_ENV=production
# Add any other required environment variables here
EOL
```

### Installing Dependencies

Install dependencies:

```bash
npm install
```

### Database Initialization

Initialize the database:

```bash
node initdb.js
```

## 5. Building the Application

### Handling Static Assets

Next.js automatically handles static assets during the build process. Make sure the public directory and its contents are properly transferred to the server, as it contains images and other static files used by the application.

```bash
# Verify public directory exists and has correct permissions
ls -la public/
```

### Building for Production

Build the Next.js application for production:

```bash
npm run build
```

The build process will create a `.next` directory containing the optimized production build.

## 6. Setting Up a Production Environment

### Install PM2 Process Manager

PM2 will help keep the application running and restart it if it crashes:

```bash
sudo npm install -g pm2
```

Create a PM2 ecosystem file:

```bash
cat > ecosystem.config.js << EOL
module.exports = {
  apps: [{
    name: 'nextlevel-food',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    instances: 'max',
    exec_mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
EOL
```

## 7. Starting the Application

Start the application with PM2:

```bash
pm2 start ecosystem.config.js
```

Set up PM2 to start on system boot:

```bash
pm2 startup
# Run the command that PM2 outputs
pm2 save
```

## 8. Configuring Nginx

### Firewall Configuration

Before setting up Nginx, configure the firewall to allow HTTP and HTTPS traffic:

```bash
sudo apt install -y ufw
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

### Installing and Configuring Nginx

Install Nginx as a reverse proxy:

```bash
sudo apt install -y nginx
```

Create an Nginx configuration file for the application:

```bash
sudo nano /etc/nginx/sites-available/nextlevel-food
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name your_domain.com www.your_domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site and restart Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/nextlevel-food /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 9. Setting Up SSL with Certbot

Secure your site with HTTPS:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your_domain.com -d www.your_domain.com
```

Follow the prompts to complete the SSL setup.

## 10. Maintenance and Updates

### Updating the Application

When you need to update the application:

1. Transfer the updated code to the server
2. Navigate to the application directory
3. Install dependencies (if there are changes)
4. Rebuild the application
5. Restart the PM2 process

```bash
cd ~/applications/food.does.cool
# After transferring updated code
npm install
npm run build
pm2 restart nextlevel-food
```

### Database Backup

Regularly backup your SQLite database:

```bash
# Create a backup directory
mkdir -p ~/backups

# Backup the database
cp ~/applications/food.does.cool/meals.db ~/backups/meals_$(date +%Y%m%d).db
```

### Monitoring

Monitor your application with PM2:

```bash
pm2 monit
pm2 logs
```

## Troubleshooting

### Node.js Version Compatibility

This application uses Next.js 15 and React 19, which require Node.js 18.17 or later. If you encounter compatibility issues:

```bash
# Check current Node.js version
node -v

# If needed, install a different Node.js version
# For example, to install Node.js 20.x:
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

### Application Not Starting

Check the PM2 logs:

```bash
pm2 logs nextlevel-food
```

### Nginx Not Working

Check the Nginx error logs:

```bash
sudo tail -f /var/log/nginx/error.log
```

### Database Issues

Check if the database file exists and has the correct permissions:

```bash
ls -la ~/applications/food.does.cool/meals.db
```

If needed, reinitialize the database:

```bash
cd ~/applications/food.does.cool
node initdb.js
```
