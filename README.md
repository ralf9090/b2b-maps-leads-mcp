# B2B Google Maps Leads & Company OSINT MCP Server

[![MCP Compatible](https://img.shields.io/badge/MCP-2024--11--05%20%7C%202025--06--18-blue)](https://modelcontextprotocol.io)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)](#)
[![Free Tier](https://img.shields.io/badge/Free%20Tier-2%20Calls%2FDay-success)](https://agent-kiosk.vercel.app/mcp)
[![Unlimited Pass](https://img.shields.io/badge/Unlimited%20Pass-%241%20%2F%20%245-purple)](https://agent-kiosk.vercel.app/buy)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

> Local business lead generation (phone, website, GPS, hours), DNS/MX/SaaS tech-stack OSINT & 4-in-1 B2B company dossiers for Claude, Cursor & AI SDR agents.

Need a **Maps Leads MCP**, **Google Maps B2B lead scraper alternative**, or **B2B OSINT MCP server** for AI sales agents? `b2b-maps-leads-mcp` equips Claude, Cursor, Codex, and outbound SDR workflows with verified local business contacts, domain DNS/MX/SPF/SaaS infrastructure fingerprinting, and complete 4-in-1 B2B company intelligence dossiers.

---

## Why Use `b2b-maps-leads-mcp`?

- **Worldwide Local Business Lead Extraction (`maps_leads`)** — Find dentists, clinics, agencies, lawyers, SaaS offices, or restaurants in any city with phone numbers, websites, addresses, opening hours, and GPS coordinates.
- **Domain & Tech-Stack OSINT (`domain_intel`)** — Inspect DNS, email provider (Google Workspace, Microsoft 365, Proton), SPF/DMARC security posture, TLS certs, and SaaS stack signals.
- **4-in-1 B2B Sales Dossier (`b2b_company_dossier`)** — Combines domain infrastructure, clean homepage extraction, local office contact leads, and live Reddit/HN brand sentiment in a single tool call.
- **2 Free Calls / Day Out of the Box** — Works immediately with **zero configuration** and **no API key required**.
- **Instant Unlimited Upgrade** — Need high-volume production calls? Grab an instant API key at **[https://agent-kiosk.vercel.app/buy](https://agent-kiosk.vercel.app/buy)** (**$1 Starter 7-Day Pass** or **$5 Pro 30-Day Pass**) or pay per request natively via **x402 (USDC on Base)**.

---

## Option 1: Zero-Install Remote MCP URL (Fastest)

Connect directly via **Streamable-HTTP MCP** without installing anything locally:

- **Free Tier (2 Free Calls/Day, Zero Config):**
  ```text
  https://agent-kiosk.vercel.app/mcp
  ```
- **Paid Unlimited URL (With Prepaid Pass Key):**
  ```text
  https://agent-kiosk.vercel.app/mcp?api_key=ak_live_YOUR_KEY_HERE
  ```

> **Get an Instant API Key in 10 Seconds:** **[https://agent-kiosk.vercel.app/buy](https://agent-kiosk.vercel.app/buy)**
> - **$1.00 USDC** — **7-Day Starter Pass** (Instant `ak_live_...` key)
> - **$5.00 USDC** — **30-Day Pro Pass** (Full unmasked datasets across all endpoints)

---

## Option 2: Local `npx` / Stdio Setup (Claude Desktop, Cursor, Codex)

This package is **pure Node.js >= 18** with **zero external npm dependencies**, exposing **only** the 3 focused tools for this workflow so your LLM context window stays lean.

### Claude Desktop (`claude_desktop_config.json`)

```json
{
  "mcpServers": {
    "b2b-maps-leads-mcp": {
      "command": "npx",
      "args": ["-y", "github:ralf9090/b2b-maps-leads-mcp"],
      "env": {
        "AGENT_KIOSK_API_KEY": ""
      }
    }
  }
}
```
*(Leave `AGENT_KIOSK_API_KEY` empty for **2 free calls/day**, or paste your `ak_live_...` key from [agent-kiosk.vercel.app/buy](https://agent-kiosk.vercel.app/buy) for unlimited access.)*

### Cursor (`.cursor/mcp.json`)

```json
{
  "mcpServers": {
    "b2b-maps-leads-mcp": {
      "command": "npx",
      "args": ["-y", "github:ralf9090/b2b-maps-leads-mcp"],
      "env": {
        "AGENT_KIOSK_API_KEY": "ak_live_OPTIONAL_PASS_KEY"
      }
    }
  }
}
```

### OpenAI Codex CLI (`~/.codex/config.toml`)

```toml
[mcp_servers.b2b_maps_leads_mcp]
command = "npx"
args = ["-y", "github:ralf9090/b2b-maps-leads-mcp"]
env = { AGENT_KIOSK_API_KEY = "" }
```

### Run Directly via `git clone` + `node index.js`

```bash
git clone https://github.com/ralf9090/b2b-maps-leads-mcp.git
cd b2b-maps-leads-mcp
node index.js
```

---

## Included MCP Tools (3)

### `maps_leads`
Find local businesses, companies, and places in any city worldwide. Extracts business name, phone number, website URL, address, opening hours, and GPS coordinates for lead generation and verification.

| Parameter | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `query` | `string` | **Yes** | Business type or name (e.g., 'cafe', 'dentist', 'lawyer') |
| `location` | `string` | No | City, region, or country (e.g., 'San Francisco', 'London', 'Istanbul') |
| `limit` | `number` | No | Number of leads to return (1-25, default: 10) |
| `x_api_key` | `string` | No | Optional ak_live_... 30-day Prepaid API Pass key to unlock the full unmasked dataset |

### `domain_intel`
B2B company & domain infrastructure intelligence. Resolves DNS records (A, MX, TXT, NS), identifies email provider (Google Workspace, M365, etc.), detects SaaS tech stack from TXT verification records, queries RDAP registration dates, and discovers active subdomains.

| Parameter | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `domain` | `string` | **Yes** | Target company domain or URL (e.g., 'stripe.com', 'vercel.com') |
| `x_api_key` | `string` | No | Optional ak_live_... 30-day Prepaid API Pass key to unlock the full unmasked dataset |

### `b2b_company_dossier`
Complete 4-in-1 B2B Sales & Competitive Intelligence Dossier ($0.10 USDC). Combines DNS/MX/SaaS tech stack infrastructure, clean website extraction, local business contact/phone leads, and live social mentions.

| Parameter | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `domain` | `string` | **Yes** | Company domain name (e.g., 'stripe.com', 'vercel.com') |
| `company` | `string` | No | Optional company brand name (e.g., 'Stripe') |
| `location` | `string` | No | Optional HQ or target city for physical lead lookup (default: 'San Francisco') |
| `x_api_key` | `string` | No | Optional ak_live_... 30-day Prepaid API Pass key to unlock the full unmasked dataset |


---

## Example Prompts

- "Find 15 dental clinics in Austin, Texas with their phone numbers, websites, and addresses."
- "Run domain_intel on linear.app to see their MX email provider, DNS setup, and SaaS stack."
- "Build a full B2B company dossier on stripe.com before my outbound sales call."

---

## Pricing & Rate Limits

| Tier | Cost | Quota | Setup |
| :--- | :--- | :--- | :--- |
| **Free Trial** | **$0** | **2 Free Calls / Day** | Zero config — works out of the box |
| **Starter Pass** | **$1 USDC** | **7 Days Unlimited** | Get `ak_live_...` at [agent-kiosk.vercel.app/buy](https://agent-kiosk.vercel.app/buy) |
| **Pro Pass** | **$5 USDC** | **30 Days Unlimited** | Get `ak_live_...` at [agent-kiosk.vercel.app/buy](https://agent-kiosk.vercel.app/buy) |
| **x402 Pay-Per-Call** | **$0.008–$0.10** | Unlimited autonomous | Pass `payment_signature` (Base USDC EIP-3009) |

---

## License

MIT © [ralf9090](https://github.com/ralf9090) — Powered by [Agent Kiosk](https://agent-kiosk.vercel.app) ([Upgrade / Buy API Key](https://agent-kiosk.vercel.app/buy)).
