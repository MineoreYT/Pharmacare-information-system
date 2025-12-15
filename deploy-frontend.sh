#!/bin/bash

# PharmaCare Frontend Deployment Script
echo "🚀 Deploying PharmaCare Frontend to AWS S3..."

# Configuration
BUCKET_NAME="pharmacare-frontend-$(whoami)"
REGION="us-east-1"

# Build the React app
echo "📦 Building React application..."
cd client
npm run build

# Create S3 bucket if it doesn't exist
echo "🪣 Creating S3 bucket..."
aws s3 mb s3://$BUCKET_NAME --region $REGION 2>/dev/null || echo "Bucket already exists"

# Upload files to S3
echo "⬆️ Uploading files to S3..."
aws s3 sync dist/ s3://$BUCKET_NAME --delete

# Configure bucket for static website hosting
echo "🌐 Configuring static website hosting..."
aws s3 website s3://$BUCKET_NAME --index-document index.html --error-document index.html

# Create bucket policy for public access
echo "🔓 Setting up public access..."
cat > bucket-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
    }
  ]
}
EOF

aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy file://bucket-policy.json
rm bucket-policy.json

# Get website URL
WEBSITE_URL="http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com"

echo "✅ Frontend deployed successfully!"
echo "🌐 Website URL: $WEBSITE_URL"
echo ""
echo "Next steps:"
echo "1. Update your backend CORS_ORIGIN to: $WEBSITE_URL"
echo "2. Deploy your backend to EC2"
echo "3. Update VITE_API_URL in client/.env.production"