# AWS Deployment Guide for PharmaCare System

## Prerequisites
1. AWS Account (free tier eligible)
2. AWS CLI installed
3. Node.js and npm installed

## Step 1: Setup AWS Account
1. Go to https://aws.amazon.com/
2. Create free account
3. Verify email and phone
4. Set up billing (free tier won't charge)

## Step 2: Install AWS CLI
```bash
# Windows (using chocolatey)
choco install awscli

# Or download from: https://aws.amazon.com/cli/
```

## Step 3: Configure AWS CLI
```bash
aws configure
# Enter your:
# - AWS Access Key ID
# - AWS Secret Access Key  
# - Default region (e.g., us-east-1)
# - Default output format (json)
```

## Step 4: Deploy Frontend to S3 + CloudFront

### Build React App
```bash
cd client
npm run build
```

### Create S3 Bucket
```bash
aws s3 mb s3://pharmacare-frontend-your-name
```

### Upload Build Files
```bash
aws s3 sync dist/ s3://pharmacare-frontend-your-name --delete
```

### Configure S3 for Static Website
```bash
aws s3 website s3://pharmacare-frontend-your-name --index-document index.html --error-document index.html
```

### Make Bucket Public
Create bucket policy:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::pharmacare-frontend-your-name/*"
    }
  ]
}
```

## Step 5: Deploy Backend to EC2

### Launch EC2 Instance
1. Go to EC2 Dashboard
2. Launch Instance
3. Choose Amazon Linux 2 AMI (free tier)
4. Select t2.micro (free tier)
5. Configure security group:
   - SSH (port 22) - Your IP
   - HTTP (port 80) - Anywhere
   - Custom TCP (port 5000) - Anywhere

### Connect to EC2 and Setup
```bash
# Connect via SSH
ssh -i your-key.pem ec2-user@your-ec2-ip

# Install Node.js
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18

# Install PM2 for process management
npm install -g pm2

# Clone your repository
git clone https://github.com/MineoreYT/Pharmacare-information-system.git
cd Pharmacare-information-system/server

# Install dependencies
npm install

# Create production environment
cp .env.production .env

# Start with PM2
pm2 start index.js --name "pharmacare-api"
pm2 startup
pm2 save
```

## Step 6: Setup Domain (Optional)
1. Register domain or use Route 53
2. Point domain to CloudFront distribution
3. Update CORS_ORIGIN in server .env

## Step 7: SSL Certificate (Optional)
1. Use AWS Certificate Manager
2. Request certificate for your domain
3. Attach to CloudFront distribution

## Estimated Costs (Free Tier)
- S3: Free for first 5GB
- CloudFront: Free for first 50GB transfer
- EC2: Free t2.micro for 750 hours/month
- Route 53: $0.50/month per hosted zone (if using custom domain)

## URLs After Deployment
- Frontend: `http://pharmacare-frontend-your-name.s3-website-us-east-1.amazonaws.com`
- Backend: `http://your-ec2-ip:5000`

## Monitoring
- CloudWatch for logs and metrics
- EC2 monitoring for server health
- S3 access logs for frontend usage