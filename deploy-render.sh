#!/bin/bash

echo "🚀 Deploying PharmaCare to Render..."

# Step 1: Prepare backend for Render
echo "📦 Preparing backend..."
cd server

# Remove old SQLite database for fresh start
rm -f pharmacy_system.db

# Install dependencies (Render will do this, but good to test locally)
echo "📋 Testing dependencies..."
npm install

echo "✅ Backend ready for Render deployment!"

# Step 2: Prepare frontend for Surge.sh update
echo "📦 Preparing frontend..."
cd ../client

# Build with production API URL
echo "🔧 Building with production API URL..."
npm run build

echo "✅ Frontend built successfully!"

echo ""
echo "🎯 Next Steps:"
echo ""
echo "1. 🌐 Deploy Backend to Render:"
echo "   - Go to https://render.com/dashboard"
echo "   - Click 'New +' → 'Web Service'"
echo "   - Connect your GitHub repository"
echo "   - Select 'server' folder as root directory"
echo "   - Render will auto-detect Node.js"
echo "   - Add environment variables:"
echo "     NODE_ENV=production"
echo "     JWT_SECRET=pharmacare-super-secure-jwt-secret-2024"
echo "     CORS_ORIGIN=https://pharmacare-system.surge.sh"
echo ""
echo "2. 📱 Update Frontend:"
echo "   cd client/dist"
echo "   surge --domain pharmacare-system.surge.sh"
echo ""
echo "3. 🧪 Test the deployment:"
echo "   - Frontend: https://pharmacare-system.surge.sh"
echo "   - Backend: https://pharmacare-api.onrender.com/api/test"
echo ""
echo "🎉 Your app will be live in ~5 minutes!"