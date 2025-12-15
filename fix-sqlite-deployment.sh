#!/bin/bash

echo "🔧 Fixing SQLite3 Deployment Issue..."

cd server

echo "🧹 Cleaning old dependencies..."
rm -rf node_modules
rm -f package-lock.json
rm -f pharmacy_system.db

echo "📦 Installing fresh dependencies with better-sqlite3..."
npm install

echo "🧪 Testing database connection..."
node -e "
const { connectDB } = require('./config/database');
connectDB().then(() => {
  console.log('✅ Database connection test successful!');
  process.exit(0);
}).catch(err => {
  console.error('❌ Database connection failed:', err.message);
  process.exit(1);
});
"

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ SQLite3 issue fixed!"
  echo ""
  echo "🚀 Ready for Render deployment:"
  echo "1. Go to Render dashboard"
  echo "2. Redeploy your service (it will use the clean build command)"
  echo "3. The new better-sqlite3 package should work correctly"
  echo ""
  echo "📋 Or create a new service with these settings:"
  echo "   - Root Directory: server"
  echo "   - Build Command: rm -rf node_modules package-lock.json && npm install"
  echo "   - Start Command: npm start"
  echo "   - Node Version: 18 (from .nvmrc)"
else
  echo "❌ Local test failed. Check your configuration."
fi