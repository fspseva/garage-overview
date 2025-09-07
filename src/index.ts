#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import fetch from "node-fetch";

const server = new Server(
  {
    name: "garage-nft-mcp-server",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const BASE_URLS = {
  development: "http://localhost:3000",
  production: "https://garage-api.bako.global"
};

const NETWORKS = ["mainnet", "testnet"] as const;
type Network = typeof NETWORKS[number];

// Collection ID to Name mapping
const COLLECTION_NAMES: Record<string, string> = {
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

// Reverse mapping for name to ID lookup
const COLLECTION_IDS: Record<string, string> = Object.fromEntries(
  Object.entries(COLLECTION_NAMES).map(([id, name]) => [name.toLowerCase(), id])
);

interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  error?: {
    message: string;
    code: string;
  };
}

// Helper functions for collection resolution
function resolveCollectionId(collectionIdentifier: string): string {
  // If it's already a full contract address, return as-is
  if (collectionIdentifier.startsWith('0x') && collectionIdentifier.length > 10) {
    return collectionIdentifier;
  }
  
  // Try to resolve from collection name
  const lowercaseName = collectionIdentifier.toLowerCase();
  const resolvedId = COLLECTION_IDS[lowercaseName];
  
  if (resolvedId) {
    return resolvedId;
  }
  
  // If not found, return the original input (might be a partial ID)
  return collectionIdentifier;
}

function getCollectionName(collectionId: string): string {
  return COLLECTION_NAMES[collectionId] || collectionId;
}

function formatCollectionInfo(collectionId: string): string {
  const name = COLLECTION_NAMES[collectionId];
  if (name) {
    return `${name} (${collectionId})`;
  }
  return collectionId;
}

async function makeApiRequest<T = any>(
  network: Network,
  endpoint: string,
  environment: "development" | "production" = "production"
): Promise<ApiResponse<T>> {
  const baseUrl = BASE_URLS[environment];
  const url = `${baseUrl}/${network}/${endpoint}`;
  
  const response = await fetch(url);
  const data = await response.json() as ApiResponse<T>;
  
  if (!response.ok) {
    throw new Error(`API request failed: ${data.error?.message || response.statusText}`);
  }
  
  return data;
}

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "garage_list_known_collections",
        description: "List all known collections with their names and contract addresses",
        inputSchema: {
          type: "object",
          properties: {},
          additionalProperties: false
        }
      },
      {
        name: "garage_get_collections",
        description: "Get all collections from Garage NFT marketplace with optional filtering and pagination",
        inputSchema: {
          type: "object",
          properties: {
            network: {
              type: "string",
              enum: NETWORKS,
              description: "Blockchain network (mainnet or testnet)"
            },
            name: {
              type: "string",
              description: "Filter collections by name"
            },
            limit: {
              type: "number",
              description: "Number of items per page (default: 10)"
            },
            page: {
              type: "number",
              description: "Page number (default: 1)"
            },
            orderBy: {
              type: "string",
              description: "Sort field (default: created_at)"
            },
            orderDirection: {
              type: "string",
              enum: ["ASC", "DESC"],
              description: "Sort direction (default: DESC)"
            },
            fromDate: {
              type: "string",
              description: "Filter from date (ISO format)"
            },
            environment: {
              type: "string",
              enum: ["development", "production"],
              description: "API environment (default: production)"
            }
          },
          required: ["network"]
        }
      },
      {
        name: "garage_get_featured_collections",
        description: "Get featured collections from Garage NFT marketplace",
        inputSchema: {
          type: "object",
          properties: {
            network: {
              type: "string",
              enum: NETWORKS,
              description: "Blockchain network (mainnet or testnet)"
            },
            limit: {
              type: "number",
              description: "Number of featured collections (default: 3)"
            },
            environment: {
              type: "string",
              enum: ["development", "production"],
              description: "API environment (default: production)"
            }
          },
          required: ["network"]
        }
      },
      {
        name: "garage_get_collection_details",
        description: "Get detailed information about a specific collection. You can use collection name (e.g., 'Mr. Jim', 'Bakteria') or contract address.",
        inputSchema: {
          type: "object",
          properties: {
            network: {
              type: "string",
              enum: NETWORKS,
              description: "Blockchain network (mainnet or testnet)"
            },
            collectionId: {
              type: "string",
              description: "Collection identifier - can be collection name (e.g., 'Mr. Jim', 'Bakteria', 'BearBros') or contract address"
            },
            fromDate: {
              type: "string",
              description: "Filter metrics from date (ISO format)"
            },
            environment: {
              type: "string",
              enum: ["development", "production"],
              description: "API environment (default: production)"
            }
          },
          required: ["network", "collectionId"]
        }
      },
      {
        name: "garage_get_collection_nfts",
        description: "Get NFTs belonging to a specific collection. You can use collection name (e.g., 'Mr. Jim', 'Bakteria') or contract address.",
        inputSchema: {
          type: "object",
          properties: {
            network: {
              type: "string",
              enum: NETWORKS,
              description: "Blockchain network (mainnet or testnet)"
            },
            collectionId: {
              type: "string",
              description: "Collection identifier - can be collection name (e.g., 'Mr. Jim', 'Bakteria', 'BearBros') or contract address"
            },
            limit: {
              type: "number",
              description: "Number of items per page (default: 10)"
            },
            page: {
              type: "number",
              description: "Page number (default: 0)"
            },
            orderBy: {
              type: "string",
              description: "Sort field (default: created_at)"
            },
            orderDirection: {
              type: "string",
              enum: ["ASC", "DESC"],
              description: "Sort direction (default: DESC)"
            },
            environment: {
              type: "string",
              enum: ["development", "production"],
              description: "API environment (default: production)"
            }
          },
          required: ["network", "collectionId"]
        }
      },
      {
        name: "garage_get_collection_orders",
        description: "Get orders for a specific collection. You can use collection name (e.g., 'Mr. Jim', 'Bakteria') or contract address.",
        inputSchema: {
          type: "object",
          properties: {
            network: {
              type: "string",
              enum: NETWORKS,
              description: "Blockchain network (mainnet or testnet)"
            },
            collectionId: {
              type: "string",
              description: "Collection identifier - can be collection name (e.g., 'Mr. Jim', 'Bakteria', 'BearBros') or contract address"
            },
            limit: {
              type: "number",
              description: "Number of items per page (default: 10)"
            },
            page: {
              type: "number",
              description: "Page number (default: 0)"
            },
            orderBy: {
              type: "string",
              description: "Sort field (default: created_at)"
            },
            orderDirection: {
              type: "string",
              enum: ["ASC", "DESC"],
              description: "Sort direction (default: DESC)"
            },
            status: {
              type: "number",
              enum: [0, 1, 2],
              description: "Order status (0: ACTIVE, 1: CANCELLED, 2: COMPLETED, default: 0)"
            },
            assetId: {
              type: "string",
              description: "Filter by specific asset ID"
            },
            environment: {
              type: "string",
              enum: ["development", "production"],
              description: "API environment (default: production)"
            }
          },
          required: ["network", "collectionId"]
        }
      },
      {
        name: "garage_get_collection_activities",
        description: "Get activity history for a specific collection. You can use collection name (e.g., 'Mr. Jim', 'Bakteria') or contract address.",
        inputSchema: {
          type: "object",
          properties: {
            network: {
              type: "string",
              enum: NETWORKS,
              description: "Blockchain network (mainnet or testnet)"
            },
            collectionId: {
              type: "string",
              description: "Collection identifier - can be collection name (e.g., 'Mr. Jim', 'Bakteria', 'BearBros') or contract address"
            },
            limit: {
              type: "number",
              description: "Number of items per page (default: 10)"
            },
            page: {
              type: "number",
              description: "Page number (default: 0)"
            },
            orderBy: {
              type: "string",
              description: "Sort field (default: created_at)"
            },
            orderDirection: {
              type: "string",
              enum: ["ASC", "DESC"],
              description: "Sort direction (default: DESC)"
            },
            environment: {
              type: "string",
              enum: ["development", "production"],
              description: "API environment (default: production)"
            }
          },
          required: ["network", "collectionId"]
        }
      },
      {
        name: "garage_get_nft_details",
        description: "Get detailed information about a specific NFT",
        inputSchema: {
          type: "object",
          properties: {
            network: {
              type: "string",
              enum: NETWORKS,
              description: "Blockchain network (mainnet or testnet)"
            },
            nftId: {
              type: "string",
              description: "Unique NFT identifier"
            },
            environment: {
              type: "string",
              enum: ["development", "production"],
              description: "API environment (default: production)"
            }
          },
          required: ["network", "nftId"]
        }
      },
      {
        name: "garage_get_nft_activities",
        description: "Get activity history for a specific NFT",
        inputSchema: {
          type: "object",
          properties: {
            network: {
              type: "string",
              enum: NETWORKS,
              description: "Blockchain network (mainnet or testnet)"
            },
            nftId: {
              type: "string",
              description: "Unique NFT identifier"
            },
            limit: {
              type: "number",
              description: "Number of items per page (default: 10)"
            },
            page: {
              type: "number",
              description: "Page number (default: 0)"
            },
            orderBy: {
              type: "string",
              description: "Sort field (default: created_at)"
            },
            orderDirection: {
              type: "string",
              enum: ["ASC", "DESC"],
              description: "Sort direction (default: DESC)"
            },
            environment: {
              type: "string",
              enum: ["development", "production"],
              description: "API environment (default: production)"
            }
          },
          required: ["network", "nftId"]
        }
      },
      {
        name: "garage_get_order_details",
        description: "Get detailed information about a specific order",
        inputSchema: {
          type: "object",
          properties: {
            network: {
              type: "string",
              enum: NETWORKS,
              description: "Blockchain network (mainnet or testnet)"
            },
            orderId: {
              type: "string",
              description: "Unique order identifier"
            },
            environment: {
              type: "string",
              enum: ["development", "production"],
              description: "API environment (default: production)"
            }
          },
          required: ["network", "orderId"]
        }
      },
      {
        name: "garage_get_user_orders",
        description: "Get orders created by a specific user address",
        inputSchema: {
          type: "object",
          properties: {
            network: {
              type: "string",
              enum: NETWORKS,
              description: "Blockchain network (mainnet or testnet)"
            },
            sellerAddress: {
              type: "string",
              description: "User's wallet address"
            },
            limit: {
              type: "number",
              description: "Number of items per page (default: 10)"
            },
            page: {
              type: "number",
              description: "Page number (default: 0)"
            },
            orderBy: {
              type: "string",
              description: "Sort field (default: created_at)"
            },
            orderDirection: {
              type: "string",
              enum: ["ASC", "DESC"],
              description: "Sort direction (default: DESC)"
            },
            environment: {
              type: "string",
              enum: ["development", "production"],
              description: "API environment (default: production)"
            }
          },
          required: ["network", "sellerAddress"]
        }
      },
      {
        name: "garage_get_receipt_status",
        description: "Check the processing status of a transaction receipt",
        inputSchema: {
          type: "object",
          properties: {
            network: {
              type: "string",
              enum: NETWORKS,
              description: "Blockchain network (mainnet or testnet)"
            },
            txId: {
              type: "string",
              description: "Transaction ID (b256 format)"
            },
            environment: {
              type: "string",
              enum: ["development", "production"],
              description: "API environment (default: production)"
            }
          },
          required: ["network", "txId"]
        }
      }
    ]
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  try {
    const environment = (args?.environment as "development" | "production") || "production";
    
    switch (name) {
      case "garage_list_known_collections": {
        const collectionsInfo = Object.entries(COLLECTION_NAMES).map(([id, name]) => ({
          name,
          contractAddress: id,
          displayName: formatCollectionInfo(id)
        }));
        
        return { 
          content: [{ 
            type: "text", 
            text: JSON.stringify({
              success: true,
              data: {
                collections: collectionsInfo,
                total: collectionsInfo.length,
                message: "These collections can be referenced by name or contract address in other tools"
              }
            }, null, 2) 
          }] 
        };
      }
      
      case "garage_get_collections": {
        const { network, ...queryParams } = args as any;
        const filteredParams: Record<string, string> = {};
        Object.entries(queryParams).forEach(([key, value]) => {
          if (value !== undefined && value !== "production" && key !== "environment") {
            filteredParams[key] = String(value);
          }
        });
        const queryString = new URLSearchParams(filteredParams).toString();
        const endpoint = `collections${queryString ? `?${queryString}` : ''}`;
        const result = await makeApiRequest(network as Network, endpoint, environment);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      
      case "garage_get_featured_collections": {
        const { network, limit } = args as any;
        const queryString = limit ? `?limit=${limit}` : '';
        const endpoint = `collections/featured${queryString}`;
        const result = await makeApiRequest(network as Network, endpoint, environment);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      
      case "garage_get_collection_details": {
        const { network, collectionId, fromDate } = args as any;
        const resolvedCollectionId = resolveCollectionId(collectionId);
        const queryString = fromDate ? `?fromDate=${fromDate}` : '';
        const endpoint = `collections/${resolvedCollectionId}${queryString}`;
        const result = await makeApiRequest(network as Network, endpoint, environment);
        
        // Enhance the response with collection name info
        if (result.success && result.data) {
          const collectionName = getCollectionName(resolvedCollectionId);
          result.data.resolvedInfo = {
            inputId: collectionId,
            resolvedId: resolvedCollectionId,
            collectionName: collectionName,
            displayName: formatCollectionInfo(resolvedCollectionId)
          };
        }
        
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      
      case "garage_get_collection_nfts": {
        const { network, collectionId, ...queryParams } = args as any;
        const resolvedCollectionId = resolveCollectionId(collectionId);
        const filteredParams: Record<string, string> = {};
        Object.entries(queryParams).forEach(([key, value]) => {
          if (value !== undefined && value !== "production" && key !== "environment") {
            filteredParams[key] = String(value);
          }
        });
        const queryString = new URLSearchParams(filteredParams).toString();
        const endpoint = `collections/${resolvedCollectionId}/nfts${queryString ? `?${queryString}` : ''}`;
        const result = await makeApiRequest(network as Network, endpoint, environment);
        
        // Enhance the response with collection name info
        if (result.success && result.data) {
          const collectionName = getCollectionName(resolvedCollectionId);
          result.data.resolvedInfo = {
            inputId: collectionId,
            resolvedId: resolvedCollectionId,
            collectionName: collectionName,
            displayName: formatCollectionInfo(resolvedCollectionId)
          };
        }
        
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      
      case "garage_get_collection_orders": {
        const { network, collectionId, ...queryParams } = args as any;
        const resolvedCollectionId = resolveCollectionId(collectionId);
        const filteredParams: Record<string, string> = {};
        Object.entries(queryParams).forEach(([key, value]) => {
          if (value !== undefined && value !== "production" && key !== "environment") {
            filteredParams[key] = String(value);
          }
        });
        const queryString = new URLSearchParams(filteredParams).toString();
        const endpoint = `collections/${resolvedCollectionId}/orders${queryString ? `?${queryString}` : ''}`;
        const result = await makeApiRequest(network as Network, endpoint, environment);
        
        // Enhance the response with collection name info
        if (result.success && result.data) {
          const collectionName = getCollectionName(resolvedCollectionId);
          result.data.resolvedInfo = {
            inputId: collectionId,
            resolvedId: resolvedCollectionId,
            collectionName: collectionName,
            displayName: formatCollectionInfo(resolvedCollectionId)
          };
        }
        
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      
      case "garage_get_collection_activities": {
        const { network, collectionId, ...queryParams } = args as any;
        const resolvedCollectionId = resolveCollectionId(collectionId);
        const filteredParams: Record<string, string> = {};
        Object.entries(queryParams).forEach(([key, value]) => {
          if (value !== undefined && value !== "production" && key !== "environment") {
            filteredParams[key] = String(value);
          }
        });
        const queryString = new URLSearchParams(filteredParams).toString();
        const endpoint = `collections/${resolvedCollectionId}/activities${queryString ? `?${queryString}` : ''}`;
        const result = await makeApiRequest(network as Network, endpoint, environment);
        
        // Enhance the response with collection name info
        if (result.success && result.data) {
          const collectionName = getCollectionName(resolvedCollectionId);
          result.data.resolvedInfo = {
            inputId: collectionId,
            resolvedId: resolvedCollectionId,
            collectionName: collectionName,
            displayName: formatCollectionInfo(resolvedCollectionId)
          };
        }
        
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      
      case "garage_get_nft_details": {
        const { network, nftId } = args as any;
        const endpoint = `nfts/${nftId}`;
        const result = await makeApiRequest(network as Network, endpoint, environment);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      
      case "garage_get_nft_activities": {
        const { network, nftId, ...queryParams } = args as any;
        const filteredParams: Record<string, string> = {};
        Object.entries(queryParams).forEach(([key, value]) => {
          if (value !== undefined && value !== "production" && key !== "environment") {
            filteredParams[key] = String(value);
          }
        });
        const queryString = new URLSearchParams(filteredParams).toString();
        const endpoint = `nfts/${nftId}/activities${queryString ? `?${queryString}` : ''}`;
        const result = await makeApiRequest(network as Network, endpoint, environment);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      
      case "garage_get_order_details": {
        const { network, orderId } = args as any;
        const endpoint = `orders/${orderId}`;
        const result = await makeApiRequest(network as Network, endpoint, environment);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      
      case "garage_get_user_orders": {
        const { network, sellerAddress, ...queryParams } = args as any;
        const filteredParams: Record<string, string> = {};
        Object.entries(queryParams).forEach(([key, value]) => {
          if (value !== undefined && value !== "production" && key !== "environment") {
            filteredParams[key] = String(value);
          }
        });
        const queryString = new URLSearchParams(filteredParams).toString();
        const endpoint = `user/orders/${sellerAddress}${queryString ? `?${queryString}` : ''}`;
        const result = await makeApiRequest(network as Network, endpoint, environment);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      
      case "garage_get_receipt_status": {
        const { network, txId } = args as any;
        const endpoint = `receipts/tx/${txId}`;
        const result = await makeApiRequest(network as Network, endpoint, environment);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [{ 
        type: "text", 
        text: `Error: ${error instanceof Error ? error.message : String(error)}` 
      }],
      isError: true,
    };
  }
});

async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Garage NFT MCP Server running on stdio");
}

runServer().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});