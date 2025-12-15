#!/bin/bash

# PharmaCare Backend Deployment Script for EC2
echo "🚀 Preparing PharmaCare Backend for EC2 deployment..."

# Create deployment package
echo "📦 Creating deployment package..."
cd server

# Create a deployment directory
mkdir -p ../deployment
cp -r . ../deployment/
cd ../deployment

# Remove development files
rm -rf node_modules
rm -f .env
rm -f pharmacy_system.db

# Create production package
echo "📋 Creating production setup script..."
cat > setup-production.sh << 'EOF'
#!/bin/bash

echo "🔧 Setting up PharmaCare Backend on EC2..."

# Update system
sudo yum update -y

# Install Node.js
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18

# Install PM2
npm install -g pm2

# Install dependencies
npm install

# Copy production environment
cp .env.production .env

# Create initial database and test user
node createTestUser.js

# Start application with PM2
pm2 start index.js --name "pharmacare-api"
pm2 startup
pm2 save

echo "✅ Backend setup complete!"
echo "🌐 API available at: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):5000"
EOF

chmod +x setup-production.sh

echo "✅ Deployment package ready!"
echo ""
echo "📋 Manual EC2 Deployment Steps:"
echo "1. Launch EC2 instance (t2.micro, Amazon Linux 2)"
echo "2. Configure security group (SSH:22, HTTP:80, Custom:5000)"
echo "3. Upload this deployment folder to EC2"
echo "4. Run: ./setup-production.sh"
echo ""
echo "📁 Deployment files created in: ../deployment/"