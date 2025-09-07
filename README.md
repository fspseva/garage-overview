# Garage NFT Marketplace MCP Server

A Model Context Protocol (MCP) server that provides access to the Garage NFT Marketplace API. This server enables AI assistants to interact with NFT collections, orders, receipts, and user data on the Fuel blockchain network.

## Features

- **Collections Management**: Browse collections, get featured collections, view collection details
- **NFT Operations**: Retrieve NFT details and activity history
- **Order Management**: Access order information and user orders
- **Activity Tracking**: Monitor collection and NFT activities
- **Receipt Verification**: Check transaction receipt status
- **Multi-Network Support**: Works with both Fuel mainnet and testnet
- **Environment Flexibility**: Supports both development and production API endpoints

## Installation

```bash
npm install
npm run build
```

## Usage

### With Claude Desktop

Add to your Claude Desktop configuration file:

```json
{
  "mcpServers": {
    "garage-nft": {
      "command": "node",
      "args": ["/path/to/garage-nft-mcp-server/build/index.js"]
    }
  }
}
```

### With MCP Client

```bash
npm start
```

## Available Tools

### Collection Tools

- `garage_list_known_collections` - List all known collections with their names and contract addresses
- `garage_get_collections` - Get all collections with optional filtering and pagination
- `garage_get_featured_collections` - Get featured collections
- `garage_get_collection_details` - Get detailed information about a specific collection (supports collection names)
- `garage_get_collection_nfts` - Get NFTs belonging to a collection (supports collection names)
- `garage_get_collection_orders` - Get orders for a collection (supports collection names)
- `garage_get_collection_activities` - Get activity history for a collection (supports collection names)

### NFT Tools

- `garage_get_nft_details` - Get detailed information about a specific NFT
- `garage_get_nft_activities` - Get activity history for a specific NFT

### Order Tools

- `garage_get_order_details` - Get detailed information about a specific order
- `garage_get_user_orders` - Get orders created by a specific user address

### Transaction Tools

- `garage_get_receipt_status` - Check the processing status of a transaction receipt

## Parameters

### Network
All tools require a `network` parameter:
- `mainnet` - Fuel mainnet (chain ID: 9889)
- `testnet` - Fuel testnet (chain ID: 0)

### Environment
Optional `environment` parameter (defaults to "production"):
- `production` - https://garage-api.bako.global
- `development` - http://localhost:3000

### Pagination
Most listing endpoints support:
- `limit` - Number of items per page (default: 10)
- `page` - Page number (default: 1 for collections, 0 for others)
- `orderBy` - Sort field (default: "created_at")
- `orderDirection` - Sort direction ("ASC" or "DESC", default: "DESC")

## Collection Name Support

The MCP server now supports using collection names instead of contract addresses for easier interaction. Known collections include:

- **Mr. Jim** - `0xcda69aa111eb386de9e2881e039e99bc43ac21f6951e3da9b71ae4450f67858d`
- **Bakteria** - `0x33f6d2bf0762223229bc5b17cee8c1c0090be95dfd3ece5b63e8efb9e456ee21`
- **BearBros** - `0xf0b6e2320caccb9071e45b1150b4da6f5edf74e7375ac6c87084822a87832de2`
- **Sangoro** - `0xb03ec5c6eeaf6d09ed6755e21dff896234c8f509b813f3ff17ef14a436fa8462`
- **Koby** - `0x202b55f66b8bafaf3b4fdf0653f1a4320607781dbd368bb576bc09250dd7dbbe`
- **FuelMonkees** - `0x0d34ec513cbaf7e15737120725cd3e235a8fd1716fa0eedc5da4a64c182e5a9f`
- **Executoors** - `0x3f3f87bb15c693784e90521c64bac855ce23d971356a6ccd57aa92e02e696432`
- **Fuel Dudes** - `0x65aa85875bf92fb5b487ade154f88507d74b233ef901b4a172f4616b527a4784`
- **Fuel BomBa** - `0x59b10bd361740618f12bba00f1083ef304a294b37ed7a8756c1b9cfc9b491b16`
- **Fuel Pumps** - `0x45c964371490bdfc2610ca116853d22a9b6e0de1abb67f61b81ab9d291b0015c`
- **Fuel Pengus** - `0xaa919d413a57cb6c577b2e172480cbe2f88df0e28203fed52249cabca6cee74a`

## Example Usage

```javascript
// List all known collections
await mcp.callTool("garage_list_known_collections", {});

// Get collection details using collection name
await mcp.callTool("garage_get_collection_details", {
  network: "mainnet",
  collectionId: "Mr. Jim"  // or use contract address
});

// Get collection details with metrics from a specific date
await mcp.callTool("garage_get_collection_details", {
  network: "mainnet",
  collectionId: "Bakteria",
  fromDate: "2024-01-01T00:00:00Z"
});

// Get activities for BearBros collection
await mcp.callTool("garage_get_collection_activities", {
  network: "mainnet",
  collectionId: "BearBros",
  limit: 20
});

// Get featured collections on mainnet
await mcp.callTool("garage_get_featured_collections", {
  network: "mainnet",
  limit: 5
});

// Get user's orders
await mcp.callTool("garage_get_user_orders", {
  network: "mainnet",
  sellerAddress: "0x123...",
  limit: 20,
  page: 1
});
```

## API Response Format

All tools return responses in the following format:

```json
{
  "success": true,
  "data": {
    // Response data varies by endpoint
  },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## Error Handling

Errors are returned in a structured format:

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  }
}
```

## Development

```bash
# Install dependencies
npm install

# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Run built version
npm start
```

## Network Information

### Fuel Mainnet
- Chain ID: 9889
- API Base URL: https://garage-api.bako.global

### Fuel Testnet
- Chain ID: 0
- API Base URL: https://garage-api.bako.global

## Order Status Codes

- `0`: ACTIVE - Order is available for purchase
- `1`: CANCELLED - Order has been cancelled
- `2`: COMPLETED - Order has been fulfilled

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Create an issue in the repository
- Check the Garage NFT Marketplace documentation
- Review the Model Context Protocol specification