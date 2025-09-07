// Garage NFT Analytics Dashboard - GitHub Pages Version
class GarageAnalytics {
    constructor() {
        // Use CORS proxy for GitHub Pages hosting
        this.baseUrl = 'https://garage-api.bako.global/mainnet';
        this.collections = {
            "0xcda69aa111eb386de9e2881e039e99bc43ac21f6951e3da9b71ae4450f67858d": "Mr. Jim",
            "0x33f6d2bf0762223229bc5b17cee8c1c0090be95dfd3ece5b63e8efb9e456ee21": "Bakteria",
            "0xf0b6e2320caccb9071e45b1150b4da6f5edf74e7375ac6c87084822a87832de2": "BearBros", 
            "0xb03ec5c6eeaf6d09ed6755e21dff896234c8f509b813f3ff17ef14a436fa8462": "Sangoro",
            "0x202b55f66b8bafaf3b4fdf0653f1a4320607781dbd368bb576bc09250dd7dbbe": "Koby",
            "0x0d34ec513cbaf7e15737120725cd3e235a8fd1716fa0eedc5da4a64c182e5a9f": "FuelMonkees",
            "0x3f3f87bb15c693784e90521c64bac855ce23d971356a6ccd57aa92e02e696432": "Executoors",
            "0x65aa85875bf92fb5b487ade154f88507d74b233ef901b4a172f4616b527a4784": "Fuel Dudes",
            "0x59b10bd361740618f12bba00f1083ef304a294b37ed7a8756c1b9cfc9b491b16": "Fuel BomBa",
            "0x45c964371490bdfc2610ca116853d22a9b6e0de1abb67f61b81ab9d291b0015c": "Fuel Pumps",
            "0xaa919d413a57cb6c577b2e172480cbe2f88df0e28203fed52249cabca6cee74a": "Fuel Pengus"
        };
        this.collectionData = [];
        this.charts = {};
    }

    async fetchCollectionData(collectionId) {
        try {
            const proxyUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent(`${this.baseUrl}/collections/${collectionId}`);
            const response = await fetch(proxyUrl);
            const proxyData = await response.json();
            const data = JSON.parse(proxyData.contents);
            
            if (data.data) {
                return {
                    id: collectionId,
                    name: this.collections[collectionId] || collectionId,
                    ...data.data,
                    metrics: data.data.metrics || {}
                };
            }
            return null;
        } catch (error) {
            console.error(`Error fetching data for ${this.collections[collectionId]}:`, error);
            return null;
        }
    }

    async fetchAllCollections() {
        try {
            const proxyUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent(`${this.baseUrl}/collections?limit=50`);
            console.log('Fetching from:', proxyUrl);
            
            const response = await fetch(proxyUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const proxyData = await response.json();
            console.log('Proxy response:', proxyData);
            
            if (!proxyData.contents) {
                throw new Error('No contents in proxy response');
            }
            
            const data = JSON.parse(proxyData.contents);
            console.log('Parsed API data:', data);
            
            // Handle the API response structure
            if (data.data && data.data.items) {
                console.log(`Found ${data.data.items.length} collections`);
                return data.data.items;
            }
            console.log('No items found in API response');
            return [];
        } catch (error) {
            console.error('Error fetching all collections:', error);
            return [];
        }
    }

    async loadData() {
        try {
            // Fetch all collections data
            const allCollections = await this.fetchAllCollections();
            this.collectionData = allCollections.map(collection => ({
                ...collection,
                name: this.collections[collection.id] || collection.name || collection.id.substring(0, 8) + '...',
                floorPrice: collection.metrics?.floorPrice || 0,
                volume: collection.metrics?.volume || 0,
                sales: parseInt(collection.metrics?.sales) || 0
            }));

            // Sort by volume for better analytics
            this.collectionData.sort((a, b) => (b.volume || 0) - (a.volume || 0));

            console.log('Loaded collection data:', this.collectionData);
            
            this.updateStats();
            this.updateCharts();
            this.updateRankings();
            this.updateLastUpdated();
            
        } catch (error) {
            console.error('Error loading data:', error);
            this.showError('Failed to load marketplace data. Please try again.');
        }
    }

    updateStats() {
        const totalVolume = this.collectionData.reduce((sum, col) => sum + (col.volume || 0), 0);
        const totalSales = this.collectionData.reduce((sum, col) => sum + (col.sales || 0), 0);
        const avgFloorPrice = this.collectionData.filter(col => col.floorPrice > 0)
            .reduce((sum, col, _, arr) => sum + col.floorPrice / arr.length, 0);
        const activeCollections = this.collectionData.filter(col => col.volume > 0).length;

        const statsHtml = `
            <div class="stat-card">
                <div class="stat-number">${totalVolume.toFixed(2)}</div>
                <div class="stat-label">Total Volume (FUEL)</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${totalSales.toLocaleString()}</div>
                <div class="stat-label">Total Sales</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${avgFloorPrice.toFixed(2)}</div>
                <div class="stat-label">Avg Floor Price (FUEL)</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${activeCollections}</div>
                <div class="stat-label">Active Collections</div>
            </div>
        `;

        document.getElementById('statsGrid').innerHTML = statsHtml;
    }

    updateCharts() {
        this.createVolumeChart();
        this.createFloorPriceChart();
        this.createSalesChart();
        this.createMarketShareChart();
    }

    createVolumeChart() {
        const ctx = document.getElementById('volumeChart').getContext('2d');
        const topCollections = this.collectionData.slice(0, 8);
        
        if (this.charts.volume) {
            this.charts.volume.destroy();
        }

        this.charts.volume = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: topCollections.map(col => col.name),
                datasets: [{
                    label: 'Volume (FUEL)',
                    data: topCollections.map(col => col.volume || 0),
                    backgroundColor: 'rgba(102, 126, 234, 0.8)',
                    borderColor: 'rgba(102, 126, 234, 1)',
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false,
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    createFloorPriceChart() {
        const ctx = document.getElementById('floorPriceChart').getContext('2d');
        const collectionsWithFloor = this.collectionData.filter(col => col.floorPrice > 0).slice(0, 8);
        
        if (this.charts.floorPrice) {
            this.charts.floorPrice.destroy();
        }

        this.charts.floorPrice = new Chart(ctx, {
            type: 'line',
            data: {
                labels: collectionsWithFloor.map(col => col.name),
                datasets: [{
                    label: 'Floor Price (FUEL)',
                    data: collectionsWithFloor.map(col => col.floorPrice),
                    backgroundColor: 'rgba(118, 75, 162, 0.2)',
                    borderColor: 'rgba(118, 75, 162, 1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: 'rgba(118, 75, 162, 1)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 6
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    createSalesChart() {
        const ctx = document.getElementById('salesChart').getContext('2d');
        const topSalesCollections = this.collectionData
            .filter(col => col.sales > 0)
            .sort((a, b) => b.sales - a.sales)
            .slice(0, 6);
        
        if (this.charts.sales) {
            this.charts.sales.destroy();
        }

        this.charts.sales = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: topSalesCollections.map(col => col.name),
                datasets: [{
                    data: topSalesCollections.map(col => col.sales),
                    backgroundColor: [
                        'rgba(102, 126, 234, 0.8)',
                        'rgba(118, 75, 162, 0.8)',
                        'rgba(52, 152, 219, 0.8)',
                        'rgba(46, 204, 113, 0.8)',
                        'rgba(155, 89, 182, 0.8)',
                        'rgba(241, 196, 15, 0.8)'
                    ],
                    borderWidth: 3,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    }

    createMarketShareChart() {
        const ctx = document.getElementById('marketShareChart').getContext('2d');
        const totalVolume = this.collectionData.reduce((sum, col) => sum + (col.volume || 0), 0);
        const topCollections = this.collectionData.slice(0, 6);
        
        if (this.charts.marketShare) {
            this.charts.marketShare.destroy();
        }

        this.charts.marketShare = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: topCollections.map(col => col.name),
                datasets: [{
                    data: topCollections.map(col => ((col.volume || 0) / totalVolume * 100).toFixed(1)),
                    backgroundColor: [
                        'rgba(102, 126, 234, 0.8)',
                        'rgba(118, 75, 162, 0.8)',
                        'rgba(52, 152, 219, 0.8)',
                        'rgba(46, 204, 113, 0.8)',
                        'rgba(155, 89, 182, 0.8)',
                        'rgba(241, 196, 15, 0.8)'
                    ],
                    borderWidth: 3,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.parsed}%`;
                            }
                        }
                    }
                }
            }
        });
    }

    updateRankings() {
        const volumeRanking = [...this.collectionData]
            .sort((a, b) => (b.volume || 0) - (a.volume || 0))
            .slice(0, 5);

        const floorRanking = [...this.collectionData]
            .filter(col => col.floorPrice > 0)
            .sort((a, b) => (b.floorPrice || 0) - (a.floorPrice || 0))
            .slice(0, 5);

        const salesRanking = [...this.collectionData]
            .filter(col => col.sales > 0)
            .sort((a, b) => (b.sales || 0) - (a.sales || 0))
            .slice(0, 5);

        const rankingsHtml = `
            <div class="ranking-category">
                <h3>🔥 Top Volume</h3>
                ${volumeRanking.map((col, index) => `
                    <div class="ranking-item">
                        <div class="rank-number">${index + 1}</div>
                        <div class="collection-info">
                            <div class="collection-name">${col.name}</div>
                            <div class="collection-value">${(col.volume || 0).toFixed(2)} FUEL</div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="ranking-category">
                <h3>💎 Highest Floor</h3>
                ${floorRanking.map((col, index) => `
                    <div class="ranking-item">
                        <div class="rank-number">${index + 1}</div>
                        <div class="collection-info">
                            <div class="collection-name">${col.name}</div>
                            <div class="collection-value">${(col.floorPrice || 0).toFixed(2)} FUEL</div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="ranking-category">
                <h3>📈 Most Sales</h3>
                ${salesRanking.map((col, index) => `
                    <div class="ranking-item">
                        <div class="rank-number">${index + 1}</div>
                        <div class="collection-info">
                            <div class="collection-name">${col.name}</div>
                            <div class="collection-value">${(col.sales || 0).toLocaleString()} sales</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        document.getElementById('rankingsGrid').innerHTML = rankingsHtml;
    }

    updateLastUpdated() {
        const now = new Date();
        document.getElementById('lastUpdated').textContent = 
            `Last updated: ${now.toLocaleString()}`;
    }

    showError(message) {
        const errorHtml = `
            <div class="error">
                <strong>Error:</strong> ${message}
            </div>
        `;
        document.getElementById('statsGrid').innerHTML = errorHtml;
        document.getElementById('rankingsGrid').innerHTML = errorHtml;
    }

    async refreshData() {
        // Show loading state
        document.getElementById('statsGrid').innerHTML = `
            <div class="stat-card">
                <div class="loading">
                    <div class="loading-spinner"></div>
                    Refreshing data...
                </div>
            </div>
        `;
        
        document.getElementById('rankingsGrid').innerHTML = `
            <div class="loading">
                <div class="loading-spinner"></div>
                Updating rankings...
            </div>
        `;

        await this.loadData();
    }
}

// Initialize the dashboard
const analytics = new GarageAnalytics();

// Global refresh function
async function refreshData() {
    await analytics.refreshData();
}

// Load data when page loads
document.addEventListener('DOMContentLoaded', async () => {
    await analytics.loadData();
    
    // Auto-refresh every 5 minutes
    setInterval(() => {
        analytics.loadData();
    }, 5 * 60 * 1000);
});