#!/bin/bash
set -e  # exit immediately if any command fails

echo "=== Updating system packages ==="
sudo apt-get update -y
sudo apt-get upgrade -y

echo "=== Installing prerequisites ==="
sudo apt-get install -y \
  ca-certificates \
  curl \
  gnupg \
  git \
  unzip

echo "=== Installing Docker ==="
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update -y
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Allow running docker without sudo
sudo usermod -aG docker ubuntu

echo "=== Installing AWS CLI v2 ==="
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip -q awscliv2.zip
sudo ./aws/install
rm -rf awscliv2.zip aws/

echo "=== Creating 2GB swap file ==="
# t3.micro only has 1GB RAM — a swap file prevents out-of-memory crashes
# during Docker builds or Node.js memory spikes
if [ ! -f /swapfile ]; then
  sudo fallocate -l 2G /swapfile
  sudo chmod 600 /swapfile
  sudo mkswap /swapfile
  sudo swapon /swapfile
  echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
fi

echo "=== Installing Certbot (for SSL later) ==="
sudo apt-get install -y certbot python3-certbot-nginx

echo "=== Installing nginx ==="
sudo apt-get install -y nginx

echo "=== Setup complete ==="
echo "Docker version: $(docker --version)"
echo "AWS CLI version: $(aws --version)"
echo "Swap status:"
free -h

echo ""
echo "IMPORTANT: log out and back in (or run 'newgrp docker') for docker group membership to take effect without sudo"