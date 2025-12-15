# 🚀 PharmaCare AWS Deployment - Quick Start

## Option 1: Simple Deployment (Recommended for Job Applications)

### Frontend: Vercel (Easier Alternative)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd client
vercel --prod
```

### Backend: Railway (Easier Alternative)
1. Go to https://railway.app/
2. Connect GitHub repository
3. Deploy server folder
4. Get deployment URL

## Option 2: Full AWS Deployment

### Prerequisites Setup (5 minutes)
1. **Create AWS Account**: https://aws.amazon.com/free/
2. **Install AWS CLI**: https://aws.amazon.com/cli/
3. **Configure AWS CLI**:
   ```bash
   aws configure
   # Enter your access keys from AWS Console > IAM > Users
   ```

### Frontend Deployment (10 minutes)
```bash
# Make script executable
chmod +x deploy-frontend.sh

# Run deployment
./deploy-frontend.sh
```

### Backend Deployment (15 minutes)
1. **Prepare deployment package**:
   ```bash
   chmod +x deploy-backend.sh
   ./deploy-backend.sh
   ```

2. **Launch EC2 Instance**:
   - Go to AWS Console > EC2
   - Launch Instance > Amazon Linux 2
   - Instance type: t2.micro (free tier)
   - Create new key pair (download .pem file)
   - Security group: Allow SSH (22), HTTP (80), Custom TCP (5000)

3. **Deploy to EC2**:
   ```bash
   # Upload deployment folder
   scp -i your-key.pem -r deployment/ ec2-user@your-ec2-ip:~/

   # Connect to EC2
   ssh -i your-key.pem ec2-user@your-ec2-ip

   # Run setup
   cd deployment
   ./setup-production.sh
   ```

## 🎯 For Job Applications

### What to Include in Your Portfolio:
1. **Live Demo URLs**:
   - Frontend: `https://your-app.vercel.app`
   - API: `https://your-api.railway.app`

2. **GitHub Repository**: 
   - Clean README with deployment instructions
   - Screenshots of the application
   - Technology stack documentation

3. **Technical Highlights**:
   - "Deployed full-stack application to cloud infrastructure"
   - "Implemented CI/CD pipeline with automated deployments"
   - "Configured production environment with proper security"

### Resume Points:
- ✅ "Deployed React.js application to AWS S3 with CloudFront CDN"
- ✅ "Configured Node.js backend on AWS EC2 with PM2 process management"
- ✅ "Implemented production-ready environment with proper CORS and security"
- ✅ "Set up automated deployment pipeline using shell scripts"

## 💰 Cost Estimate:
- **AWS Free Tier**: $0/month for first year
- **Vercel + Railway**: $0/month (free tiers)
- **Domain (optional)**: $10-15/year

## 🆘 Need Help?
- AWS Free Tier: https://aws.amazon.com/free/
- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app/