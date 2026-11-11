#!/usr/bin/env node
/**
 * B2B Google Maps Leads & Company OSINT MCP Server (b2b-maps-leads-mcp)
 * Zero-dependency MCP stdio proxy routing focused niche tools to https://agent-kiosk.vercel.app/mcp
 *
 * Free tier: 2 free calls/day out of the box (no API key needed).
 * Unlimited upgrade: https://agent-kiosk.vercel.app/buy ($1 7-Day Starter Pass / $5 30-Day Pro Pass)
 */
import readline from "node:readline";

const SERVER_NAME = "b2b-maps-leads-mcp";
const SERVER_VERSION = "1.0.0";
const REMOTE_MCP_URL =
  process.env.AGENT_KIOSK_MCP_URL || "https://agent-kiosk.vercel.app/mcp";

const TOOLS = [
  {
    "name": "maps_leads",
    "description": "Find local businesses, companies, and places in any city worldwide. Extracts business name, phone number, website URL, address, opening hours, and GPS coordinates for lead generation and verification.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "query": {
          "type": "string",
          "description": "Business type or name (e.g., 'cafe', 'dentist', 'lawyer')"
        },
        "location": {
          "type": "string",
          "description": "City, region, or country (e.g., 'San Francisco', 'London', 'Istanbul')"
        },
        "limit": {
          "type": "number",
          "description": "Number of leads to return (1-25, default: 10)"
        },
        "payment_signature": {
          "type": "string",
          "description": "Optional x402 v2/v1 Base64 or JSON EIP-3009 USDC payment signature to unlock the full unmasked dataset directly via MCP"
        },
        "x_api_key": {
          "type": "string",
          "description": "Optional ak_live_... 30-day Prepaid API Pass key to unlock the full unmasked dataset"
        }
      },
      "required": [
        "query"
      ]
    },
    "annotations": {
      "title": "Maps Leads",
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": true
    }
  },
  {
    "name": "domain_intel",
    "description": "B2B company & domain infrastructure intelligence. Resolves DNS records (A, MX, TXT, NS), identifies email provider (Google Workspace, M365, etc.), detects SaaS tech stack from TXT verification records, queries RDAP registration dates, and discovers active subdomains.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "domain": {
          "type": "string",
          "description": "Target company domain or URL (e.g., 'stripe.com', 'vercel.com')"
        },
        "payment_signature": {
          "type": "string",
          "description": "Optional x402 v2/v1 Base64 or JSON EIP-3009 USDC payment signature to unlock the full unmasked dataset directly via MCP"
        },
        "x_api_key": {
          "type": "string",
          "description": "Optional ak_live_... 30-day Prepaid API Pass key to unlock the full unmasked dataset"
        }
      },
      "required": [
        "domain"
      ]
    },
    "annotations": {
      "title": "Domain Intel",
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": true
    }
  },
  {
    "name": "b2b_company_dossier",
    "description": "Complete 4-in-1 B2B Sales & Competitive Intelligence Dossier ($0.10 USDC). Combines DNS/MX/SaaS tech stack infrastructure, clean website extraction, local business contact/phone leads, and live social mentions.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "domain": {
          "type": "string",
          "description": "Company domain name (e.g., 'stripe.com', 'vercel.com')"
        },
        "company": {
          "type": "string",
          "description": "Optional company brand name (e.g., 'Stripe')"
        },
        "location": {
          "type": "string",
          "description": "Optional HQ or target city for physical lead lookup (default: 'San Francisco')"
        },
        "payment_signature": {
          "type": "string",
          "description": "Optional x402 v2/v1 Base64 or JSON EIP-3009 USDC payment signature to unlock the full unmasked dataset directly via MCP"
        },
        "x_api_key": {
          "type": "string",
          "description": "Optional ak_live_... 30-day Prepaid API Pass key to unlock the full unmasked dataset"
        }
      },
      "required": [
        "domain"
      ]
    },
    "annotations": {
      "title": "B2b Company Dossier",
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": true
    }
  }
];
const ALLOWED_TOOLS = new Set(TOOLS.map((t) => t.name));

function sendRpc(payload) {
  process.stdout.write(JSON.stringify(payload) + "\n");
}

async function forwardToolCall(id, params) {
  const toolName = params?.name;
  const rawArgs =
    params?.arguments && typeof params.arguments === "object"
      ? { ...params.arguments }
      : {};

  if (!toolName || !ALLOWED_TOOLS.has(toolName)) {
    return sendRpc({
      jsonrpc: "2.0",
      id,
      error: {
        code: -32601,
        message: `Unknown tool '${toolName}'. Available tools in ${SERVER_NAME}: ${Array.from(ALLOWED_TOOLS).join(", ")}`,
      },
    });
  }

  const apiKey = (
    rawArgs.x_api_key ||
    process.env.AGENT_KIOSK_API_KEY ||
    ""
  ).trim();

  if (apiKey && !rawArgs.x_api_key) {
    rawArgs.x_api_key = apiKey;
  }

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "User-Agent": `${SERVER_NAME}/${SERVER_VERSION}`,
  };

  if (apiKey) {
    headers["X-API-KEY"] = apiKey;
  }
  if (rawArgs.payment_signature) {
    headers["PAYMENT-SIGNATURE"] = String(rawArgs.payment_signature);
  }

  try {
    const response = await fetch(REMOTE_MCP_URL, {
      method: "POST",
      headers,
      body: JSON.stringify({
        jsonrpc: "2.0",
        id,
        method: "tools/call",
        params: {
          name: toolName,
          arguments: rawArgs,
        },
      }),
    });

    const text = await response.text();
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = null;
    }

    if (parsed && parsed.jsonrpc === "2.0") {
      parsed.id = id;
      return sendRpc(parsed);
    }

    return sendRpc({
      jsonrpc: "2.0",
      id,
      result: {
        isError: !response.ok,
        content: [
          {
            type: "text",
            text: parsed ? JSON.stringify(parsed, null, 2) : text,
          },
        ],
      },
    });
  } catch (err) {
    return sendRpc({
      jsonrpc: "2.0",
      id,
      result: {
        isError: true,
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                error: "UPSTREAM_CONNECTION_ERROR",
                message: err?.message || String(err),
                remote_mcp_url: REMOTE_MCP_URL,
                upgrade_url: "https://agent-kiosk.vercel.app/buy",
              },
              null,
              2
            ),
          },
        ],
      },
    });
  }
}

async function handleLine(line) {
  const trimmed = line.trim();
  if (!trimmed) return;

  let rpc;
  try {
    rpc = JSON.parse(trimmed);
  } catch (err) {
    return sendRpc({
      jsonrpc: "2.0",
      id: null,
      error: { code: -32700, message: `Parse error: ${err.message}` },
    });
  }

  const { id, method, params } = rpc;

  if (method && method.startsWith("notifications/")) {
    return;
  }

  if (method === "initialize") {
    const requestedVersion = params?.protocolVersion;
    const supportedVersions = ["2024-11-05", "2025-03-26", "2025-06-18"];
    const protocolVersion = supportedVersions.includes(requestedVersion)
      ? requestedVersion
      : "2024-11-05";

    return sendRpc({
      jsonrpc: "2.0",
      id,
      result: {
        protocolVersion,
        capabilities: {
          tools: {},
        },
        serverInfo: {
          name: SERVER_NAME,
          version: SERVER_VERSION,
        },
      },
    });
  }

  if (method === "ping" || method === "logging/setLevel") {
    return sendRpc({
      jsonrpc: "2.0",
      id,
      result: {},
    });
  }

  if (method === "tools/list") {
    return sendRpc({
      jsonrpc: "2.0",
      id,
      result: {
        tools: TOOLS,
      },
    });
  }

  if (method === "resources/list") {
    return sendRpc({
      jsonrpc: "2.0",
      id,
      result: { resources: [] },
    });
  }

  if (method === "resources/templates/list") {
    return sendRpc({
      jsonrpc: "2.0",
      id,
      result: { resourceTemplates: [] },
    });
  }

  if (method === "prompts/list") {
    return sendRpc({
      jsonrpc: "2.0",
      id,
      result: { prompts: [] },
    });
  }

  if (method === "tools/call") {
    return await forwardToolCall(id, params);
  }

  if (id !== undefined) {
    return sendRpc({
      jsonrpc: "2.0",
      id,
      error: { code: -32601, message: `Method not found: ${method}` },
    });
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  terminal: false,
});

let queue = Promise.resolve();
rl.on("line", (line) => {
  queue = queue.then(() => handleLine(line)).catch((err) => {
    sendRpc({
      jsonrpc: "2.0",
      id: null,
      error: { code: -32603, message: err?.message || "Internal error" },
    });
  });
});
