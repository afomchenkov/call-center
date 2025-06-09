#!/usr/bin/env bash
set -x
apt-get update -y

echo "Installing Git..."
apt-get install -y git
/usr/bin/yum install -y git

echo "Installing pm2 globally..."
/opt/nodejs/bin/npm install pm2 -g

echo "Cloning code..."
mkdir /app
git clone https://github.com/my-user/my-nodejs-app-repo.git /app
cd /app

echo "Installing npm packages..."
/opt/nodejs/bin/npm install
EC2_IP=$(curl http://169.254.169.254/latest/meta-data/public-ipv4)

export HOSTED_ON="Hosted on EC2 having IP $EC2_IP"
export DEM_INFO="${DEM_INFO}"

echo "HOSTED_ON=$HOSTED_ON" >> /app/.env
echo "DEM_INFO=$DEM_INFO" >> /app/.env
chown -R my-user:my-user /app

sudo -u my-user bash -c  'cd /app;/opt/nodejs/bin/pm2 start bin/www --name demo'
sudo -u my-user bash -c 'node -v;whoami'
whoami

echo "************** Cloud-init END ********************"