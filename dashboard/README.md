# 🏎️ Garage NFT Analytics Dashboard

A dynamic, real-time analytics dashboard for the Garage NFT Marketplace on Fuel Network.

## ✨ Features

### 📊 Real-Time Analytics
- **Total Volume Tracking** - Aggregate volume across all collections
- **Sales Statistics** - Total transactions and market activity
- **Floor Price Analysis** - Average floor prices and trends
- **Active Collections** - Number of collections with trading activity

### 📈 Interactive Charts
- **Volume Distribution** - Bar chart showing top collections by volume
- **Floor Price Comparison** - Line chart tracking floor prices
- **Sales Activity** - Doughnut chart of sales distribution
- **Market Share** - Pie chart showing volume percentages

### 🏆 Dynamic Rankings
- **Top Volume Collections** - Highest trading volume
- **Highest Floor Prices** - Premium collections
- **Most Sales** - Collections with highest transaction count

### 🔄 Auto-Refresh
- Updates every 5 minutes automatically
- Manual refresh button for instant updates
- Loading states and error handling

## 🚀 Quick Start

1. **Navigate to Dashboard Directory**
   ```bash
   cd dashboard
   ```

2. **Start the Server**
   ```bash
   npm start
   ```

3. **Open in Browser**
   ```
   http://localhost:8080
   ```

## 🎯 Collections Tracked

The dashboard analyzes these Fuel NFT collections:

| Collection | Contract Address |
|------------|------------------|
| **Mr. Jim** | `0xcda69aa111eb386de9e2881e039e99bc43ac21f6951e3da9b71ae4450f67858d` |
| **Bakteria** | `0x33f6d2bf0762223229bc5b17cee8c1c0090be95dfd3ece5b63e8efb9e456ee21` |
| **BearBros** | `0xf0b6e2320caccb9071e45b1150b4da6f5edf74e7375ac6c87084822a87832de2` |
| **Sangoro** | `0xb03ec5c6eeaf6d09ed6755e21dff896234c8f509b813f3ff17ef14a436fa8462` |
| **Koby** | `0x202b55f66b8bafaf3b4fdf0653f1a4320607781dbd368bb576bc09250dd7dbbe` |
| **FuelMonkees** | `0x0d34ec513cbaf7e15737120725cd3e235a8fd1716fa0eedc5da4a64c182e5a9f` |
| **Executoors** | `0x3f3f87bb15c693784e90521c64bac855ce23d971356a6ccd57aa92e02e696432` |
| **Fuel Dudes** | `0x65aa85875bf92fb5b487ade154f88507d74b233ef901b4a172f4616b527a4784` |
| **Fuel BomBa** | `0x59b10bd361740618f12bba00f1083ef304a294b37ed7a8756c1b9cfc9b491b16` |
| **Fuel Pumps** | `0x45c964371490bdfc2610ca116853d22a9b6e0de1abb67f61b81ab9d291b0015c` |
| **Fuel Pengus** | `0xaa919d413a57cb6c577b2e172480cbe2f88df0e28203fed52249cabca6cee74a` |

## 🛠️ Technical Details

### Architecture
- **Frontend**: Vanilla JavaScript with Chart.js for visualizations
- **Backend**: Node.js HTTP server for static file serving
- **API**: Direct integration with Garage API endpoints
- **Styling**: Modern CSS with glassmorphism effects

### Data Sources
- **Garage API**: `https://garage-api.bako.global/mainnet`
- **Collection Metrics**: Volume, floor price, sales count
- **Real-time Updates**: API polling every 5 minutes

### Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 📱 Responsive Design

The dashboard is fully responsive and works on:
- Desktop computers
- Tablets 
- Mobile phones

## 🔧 Configuration

### Environment Variables
- `PORT` - Server port (default: 8080)

### API Endpoints Used
- `GET /collections` - Fetch all collections with metrics
- `GET /collections/{id}` - Get specific collection details

## 🎨 Visual Features

- **Glassmorphism Design** - Modern frosted glass effects
- **Gradient Backgrounds** - Eye-catching color schemes  
- **Smooth Animations** - Hover effects and transitions
- **Interactive Charts** - Clickable and responsive visualizations
- **Loading States** - Smooth loading indicators

## 📊 Metrics Calculated

- **Total Volume**: Sum of all collection volumes in FUEL
- **Total Sales**: Aggregate transaction count
- **Average Floor**: Mean floor price across active collections
- **Market Share**: Volume percentage by collection
- **Activity Ranking**: Collections sorted by various metrics

## 🚀 Deployment

### Local Development
```bash
cd dashboard
npm start
```

### Production Deployment
1. Upload dashboard files to server
2. Install Node.js on server
3. Run `npm start` or use PM2 for process management
4. Configure reverse proxy (nginx) if needed

### Docker Support
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY dashboard/ .
EXPOSE 8080
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes to dashboard files
4. Test locally
5. Submit a pull request

## 📄 License

MIT License - see main project LICENSE file.