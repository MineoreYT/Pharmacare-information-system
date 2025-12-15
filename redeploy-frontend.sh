#!/bin/bash

echo "🔄 Redeploying Frontend with Updated API URL..."

cd client

echo "🔧 Building with production API URL: https://pharmacare-api.onrender.com/api"
npm run build

echo "📤 Deploying to Surge.sh..."
cd dist
surge --domain pharmacare-system.surge.sh

echo "✅ Frontend redeployed successfully!"
echo "🌐 Live at: https://pharmacare-system.surge.sh"