#!/bin/bash

echo "🚀 PharmaCare Easy Deployment - Vercel + Railway"
echo "================================================"

# Check if required tools are installed
command -v npm >/dev/null 2>&1 || { echo "❌ npm is required but not installed. Aborting." >&2; exit 1; }

# Install Vercel CLI if not present
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo ""
echo "🎯 Step 1: Preparing Frontend for Deployment"
echo "============================================="

cd client

# Create production environment file
echo "📝 Creating production environment..."
cat > .env.production << EOF
VITE_API_URL=https://pharmacare-api.up.railway.app/api
EOF

echo "✅ Production environment created!"

echo ""
echo "🚀 Step 2: Deploying Frontend to Vercel"
echo "======================================="

echo "📦 Building React application..."
npm run build

echo "🌐 Deploying to Vercel..."
echo "Note: You'll need to login to Vercel when prompted"
vercel --prod

echo ""
echo "✅ Frontend deployment complete!"
echo ""
echo "🎯 Step 3: Backend Deployment Instructions"
echo "========================================="
echo ""
echo "For the backend, please follow these steps:"
echo ""
echo "1. Go to https://railway.app/"
echo "2. Sign up/login with GitHub"
echo "3. Click 'New Project' → 'Deploy from GitHub repo'"
echo "4. Select your repository: 'Pharmacare-information-system'"
echo "5. Choose the 'server' folder"
echo "6. Railway will automatically detect Node.js and deploy!"
echo ""
echo "🔧 Environment Variables to add in Railway:"
echo "- NODE_ENV: production"
echo "- JWT_SECRET: your-secure-jwt-secret"
echo "- PORT: 5000"
echo ""
echo "📱 After Railway deployment:"
echo "1. Copy your Railway app URL (e.g., https://yourapp.up.railway.app)"
echo "2. Update VITE_API_URL in client/.env.production"
echo "3. Redeploy frontend with: vercel --prod"
echo ""
echo "🎉 Your app will be live at:"
echo "Frontend: Check Vercel dashboard for URL"
echo "Backend: Check Railway dashboard for URL"
echo ""
echo "💼 Perfect for job applications! 🚀"