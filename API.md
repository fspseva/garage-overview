# Garage NFT Marketplace API Documentation

A comprehensive REST API for the Garage NFT marketplace, built with Hono and TypeScript. This API provides endpoints for managing collections, NFTs, orders, receipts, and user data.

## Table of Contents

- [Base URL](#base-url)
- [Authentication](#authentication)
- [Common Parameters](#common-parameters)
- [API Endpoints](#api-endpoints)
  - [Collections](#collections)
  - [NFTs](#nfts)
  - [Orders](#orders)
  - [Receipts](#receipts)
  - [User](#user)
- [Response Format](#response-format)
- [Error Handling](#error-handling)

## Base URL

```
Development: http://localhost:3000
Production: https://garage-api.bako.global
```

## Network Parameter

All endpoints require a network parameter in the URL path. The network parameter specifies which blockchain network to use.

**Supported Networks:**
- `mainnet` - Fuel mainnet (chain ID: 9889)
- `testnet` - Fuel testnet (chain ID: 0)

**URL Format:** `{baseUrl}/{network}/{endpoint}`

**Example:** `https://garage-api.bako.global/mainnet/collections`

## Authentication

Currently, this API does not require authentication for read operations. Write operations may require authentication in the future.

## Common Parameters

### Pagination Parameters

Most endpoints support pagination with the following query parameters:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number (1-based) |
| `limit` | number | 10 | Number of items per page |
| `orderBy` | string | "created_at" | Field to sort by |
| `orderDirection` | string | "DESC" | Sort direction ("ASC" or "DESC") |

### Response Format

All endpoints return responses in the following format:

```json
{
  "success": true,
  "data": {
    // Response data
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

## API Endpoints

### Collections

#### Get All Collections

Retrieve a paginated list of all collections with metrics.

```http
GET /{network}/collections
```

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | No | Filter collections by name |
| `limit` | number | No | Number of items per page (default: 10) |
| `page` | number | No | Page number (default: 1) |
| `orderBy` | string | No | Sort field (default: "created_at") |
| `orderDirection` | string | No | Sort direction (default: "DESC") |
| `fromDate` | string | No | Filter from date (ISO format) |

**Example Request:**
```bash
curl "https://garage-api.bako.global/mainnet/collections?limit=5&page=1&orderBy=name&orderDirection=ASC"
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "collection-1",
        "name": "Bored Ape Yacht Club",
        "description": "A collection of unique Bored Apes",
        "image": "https://example.com/image.jpg",
        "created_at": "2024-01-01T00:00:00Z",
        "latestSalesNFTs": []
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 5,
      "total": 100,
      "totalPages": 20,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

#### Get Featured Collections

Retrieve featured collections.

```http
GET /{network}/collections/featured
```

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | number | No | Number of featured collections (default: 3) |

**Example Request:**
```bash
curl "https://garage-api.bako.global/mainnet/collections/featured?limit=5"
```

#### Get Collection Details

Retrieve detailed information about a specific collection.

```http
GET /{network}/collections/{collectionId}
```

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `network` | string | Yes | Network identifier (mainnet or testnet) |
| `collectionId` | string | Yes | Unique collection identifier |

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `fromDate` | string | No | Filter metrics from date (ISO format) |

**Example Request:**
```bash
curl "https://garage-api.bako.global/mainnet/collections/collection-1?fromDate=2024-01-01"
```

#### Get Collection NFTs

Retrieve NFTs belonging to a specific collection.

```http
GET /{network}/collections/{collectionId}/nfts
```

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `network` | string | Yes | Network identifier (mainnet or testnet) |
| `collectionId` | string | Yes | Unique collection identifier |

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | number | No | Number of items per page (default: 10) |
| `page` | number | No | Page number (default: 0) |
| `orderBy` | string | No | Sort field (default: "created_at") |
| `orderDirection` | string | No | Sort direction (default: "DESC") |

**Example Request:**
```bash
curl "https://garage-api.bako.global/mainnet/collections/collection-1/nfts?limit=20&page=1"
```

#### Get Collection Orders

Retrieve orders for a specific collection.

```http
GET /{network}/collections/{collectionId}/orders
```

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `network` | string | Yes | Network identifier (mainnet or testnet) |
| `collectionId` | string | Yes | Unique collection identifier |

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | number | No | Number of items per page (default: 10) |
| `page` | number | No | Page number (default: 0) |
| `orderBy` | string | No | Sort field (default: "created_at") |
| `orderDirection` | string | No | Sort direction (default: "DESC") |
| `status` | number | No | Order status (default: 0 - ACTIVE) |
| `assetId` | string | No | Filter by specific asset ID |

**Order Status Values:**
- `0`: ACTIVE
- `1`: CANCELLED
- `2`: COMPLETED

**Example Request:**
```bash
curl "https://garage-api.bako.global/mainnet/collections/collection-1/orders?status=0&limit=10"
```

#### Get Collection Activities

Retrieve activity history for a specific collection.

```http
GET /{network}/collections/{collectionId}/activities
```

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `network` | string | Yes | Network identifier (mainnet or testnet) |
| `collectionId` | string | Yes | Unique collection identifier |

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | number | No | Number of items per page (default: 10) |
| `page` | number | No | Page number (default: 0) |
| `orderBy` | string | No | Sort field (default: "created_at") |
| `orderDirection` | string | No | Sort direction (default: "DESC") |

**Example Request:**
```bash
curl "https://garage-api.bako.global/mainnet/collections/collection-1/activities?limit=20"
```

#### Get Collection Social Preview

Generate social media preview HTML for a collection.

```http
GET /{network}/collections/s/{collectionId}
```

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `network` | string | Yes | Network identifier (mainnet or testnet) |
| `collectionId` | string | Yes | Unique collection identifier |

**Example Request:**
```bash
curl "https://garage-api.bako.global/mainnet/collections/s/collection-1"
```

**Response:** Returns HTML for social media preview cards.

### NFTs

#### Get NFT Details

Retrieve detailed information about a specific NFT.

```http
GET /{network}/nfts/{nftId}
```

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `network` | string | Yes | Network identifier (mainnet or testnet) |
| `nftId` | string | Yes | Unique NFT identifier |

**Example Request:**
```bash
curl "https://garage-api.bako.global/mainnet/nfts/nft-123"
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": "nft-123",
    "name": "Bored Ape #123",
    "description": "A unique Bored Ape",
    "image": "https://example.com/nft-123.jpg",
    "collection_id": "collection-1",
    "owner_address": "0x123...",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

#### Get NFT Activities

Retrieve activity history for a specific NFT.

```http
GET /{network}/nfts/{nftId}/activities
```

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `network` | string | Yes | Network identifier (mainnet or testnet) |
| `nftId` | string | Yes | Unique NFT identifier |

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | number | No | Number of items per page (default: 10) |
| `page` | number | No | Page number (default: 0) |
| `orderBy` | string | No | Sort field (default: "created_at") |
| `orderDirection` | string | No | Sort direction (default: "DESC") |

**Example Request:**
```bash
curl "https://garage-api.bako.global/mainnet/nfts/nft-123/activities?limit=20"
```

### Orders

#### Get Order Details

Retrieve detailed information about a specific order.

```http
GET /{network}/orders/{orderId}
```

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `network` | string | Yes | Network identifier (mainnet or testnet) |
| `orderId` | string | Yes | Unique order identifier |

**Example Request:**
```bash
curl "https://garage-api.bako.global/mainnet/orders/order-456"
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": "order-456",
    "status": "ACTIVE",
    "asset_id": "nft-123",
    "price": "1000000000",
    "price_currency": "ETH",
    "seller_address": "0x123...",
    "buyer_address": null,
    "network": 1,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

#### Get Order Social Preview

Generate social media preview HTML for an order.

```http
GET /{network}/orders/s/{orderId}
```

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `network` | string | Yes | Network identifier (mainnet or testnet) |
| `orderId` | string | Yes | Unique order identifier |

**Example Request:**
```bash
curl "https://garage-api.bako.global/mainnet/orders/s/order-456"
```

**Response:** Returns HTML for social media preview cards.

### Receipts

#### Save Receipt from Transaction

Save receipt data from a blockchain transaction.

```http
POST /{network}/receipts/tx/{txId}
```

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `network` | string | Yes | Network identifier (mainnet or testnet) |
| `txId` | string | Yes | Transaction ID (b256 format) |

**Example Request:**
```bash
curl -X POST "https://garage-api.bako.global/mainnet/receipts/tx/0x1234567890abcdef..."
```

**Example Response:**
```json
{
  "success": true,
  "data": null
}
```

#### Get Receipt Status

Check the processing status of a transaction receipt.

```http
GET /{network}/receipts/tx/{txId}
```

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `network` | string | Yes | Network identifier (mainnet or testnet) |
| `txId` | string | Yes | Transaction ID (b256 format) |

**Example Request:**
```bash
curl "https://garage-api.bako.global/mainnet/receipts/tx/0x1234567890abcdef..."
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "isProcessed": true,
    "event": "OrderCreated"
  }
}
```

### User

#### Get User Orders

Retrieve orders created by a specific user address.

```http
GET /{network}/user/orders/{sellerAddress}
```

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `network` | string | Yes | Network identifier (mainnet or testnet) |
| `sellerAddress` | string | Yes | User's wallet address |

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | number | No | Number of items per page (default: 10) |
| `page` | number | No | Page number (default: 0) |
| `orderBy` | string | No | Sort field (default: "created_at") |
| `orderDirection` | string | No | Sort direction (default: "DESC") |

**Example Request:**
```bash
curl "https://garage-api.bako.global/mainnet/user/orders/0x123...?limit=20&page=1"
```

## Response Format

### Success Response

All successful API calls return a response with the following structure:

```json
{
  "success": true,
  "data": {
    // Response data varies by endpoint
  }
}
```

### Paginated Response

Endpoints that return lists support pagination:

```json
{
  "success": true,
  "data": {
    "items": [
      // Array of items
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

## Error Handling

### Error Response Format

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  }
}
```

### Common HTTP Status Codes

- `200 OK` - Request successful
- `400 Bad Request` - Invalid request parameters
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

### Example Error Response

```json
{
  "success": false,
  "error": {
    "message": "NFT not found",
    "code": "NOT_FOUND"
  }
}
```
