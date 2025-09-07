#!/bin/bash

# Garage NFT Analytics Dashboard Deployment Script

echo "🏎️  Garage NFT Analytics Dashboard Deployment"
echo "=============================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if we're in the dashboard directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the dashboard directory"
    exit 1
fi

# Stop any existing server
echo "🔄 Stopping any existing dashboard server..."
pkill -f "node server.js" 2>/dev/null || true

# Start the server
echo "🚀 Starting Garage Analytics Dashboard..."
echo ""

# Check if PM2 is available for production deployment
if command -v pm2 &> /dev/null; then
    echo "📦 PM2 detected - using for production deployment"
    pm2 start server.js --name "garage-dashboard" --watch
    echo ""
    echo "✅ Dashboard deployed with PM2!"
    echo "   • Use 'pm2 list' to see running processes"
    echo "   • Use 'pm2 logs garage-dashboard' to view logs"
    echo "   • Use 'pm2 stop garage-dashboard' to stop"
    echo "   • Use 'pm2 restart garage-dashboard' to restart"
else
    echo "🔧 Starting in development mode..."
    node server.js &
    SERVER_PID=$!
    echo "Server PID: $SERVER_PID"
    
    # Save PID for later cleanup
    echo $SERVER_PID > .server.pid
    
    echo ""
    echo "✅ Dashboard started in background!"
    echo "   • Use 'kill $(cat .server.pid)' to stop the server"
fi

echo ""
echo "🌐 Dashboard is now running at:"
echo "   • Local:   http://localhost:8080"
echo "   • Network: http://$(hostname -I | awk '{print $1}'):8080"
echo ""
echo "📊 Features available:"
echo "   • Real-time collection analytics"
echo "   • Volume and floor price tracking" 
echo "   • Interactive rankings and charts"
echo "   • Auto-refresh every 5 minutes"
echo ""
echo "🔄 The dashboard will automatically fetch data from Garage API"
echo "   API: https://garage-api.bako.global/mainnet"
echo ""
echo "💡 Tip: Bookmark the URL for easy access to your analytics!"

# Wait a moment and test the server
sleep 2
if curl -f http://localhost:8080 > /dev/null 2>&1; then
    echo "✅ Server is responding correctly!"
else
    echo "⚠️  Server might still be starting up. Please check manually."
fi

echo ""
echo "🎉 Garage Analytics Dashboard deployment complete!"