\# Smart Kitchen Hub (Project: chef) — Product Requirements Document

\#\# 1\. Executive Summary  
Smart Kitchen Hub (\`chef\`) is an intelligent, edge-native culinary management system built on Cloudflare Workers. It leverages a rich pre-configured Cloudflare ecosystem (D1, R2, Vectorize, KV, Browser Rendering, and AI Gateway) to deliver a seamless kitchen experience. Features include an AI-generated seasonal landing page (cached via D1 \`hero\_images\` / \`dashboardMetrics\` concepts), R2-backed appliance manual storage with Vectorize RAG chat, real-time WebSocket barcode scanning for inventory, and a Vision-powered "Magic Fridge" reverse recipe search.

\#\# 2\. Target Users & Use Cases  
\- **\*\*Home Chefs & Tech Enthusiasts:\*\*** Users digitizing their kitchen inventory, chatting with appliance manuals (RAG), and getting AI recipe suggestions based on fridge photos.  
\- **\*\*Inventory Scripts:\*\*** Local Python scripts equipped with barcode scanners pushing real-time data to the Cloudflare edge via WebSockets.

\#\# 3\. System Architecture Overview  
\`\`\`mermaid  
graph TD  
    Client\[Astro Frontend / React Islands\] \--\>|REST & WS| API\[Hono API Gateway\]  
    Scanner\[Python Barcode Scanner\] \--\>|WebSockets| BarcodeAgent\[BarcodeAgent DO\]  
      
    API \--\> HeroWorkflow\[Hero Gen Workflow\]  
    HeroWorkflow \--\> AI\[Workers AI: SDXL via Gateway\]  
    HeroWorkflow \--\> Images\[CF Images API\]  
    HeroWorkflow \--\> D1\[(D1: chef-db)\]  
      
    API \--\> KitchenOrchestrator\[KitchenOrchestrator DO\]  
    KitchenOrchestrator \--\> Vectorize\[(Vectorize: chef-appliance-manuals)\]  
    KitchenOrchestrator \--\> R2\[(R2: menuforge-appliances)\]  
    KitchenOrchestrator \--\> AI\_Vision\[Workers AI: Vision\]

## **4\. Cloudflare Services Used (Derived from wrangler.jsonc)**

| Service | Purpose | Binding | ID / Name |
| :---- | :---- | :---- | :---- |
| **D1** | Relational data | DB | 126adffd-53c1-40f8-a8be-db8b909d383d (chef-db) |
| **R2** | Storing appliance PDF manuals | BUCKET | menuforge-appliances |
| **Vectorize** | Embeddings for appliance manuals | VECTOR\_INDEX | chef-appliance-manuals |
| **KV** | Session management | SESSION | 2ec2b50f79074013ad7d4dec27e58f5e |
| **Workers AI** | Text, Image, Vision | AI | (Gateway: default-gateway) |
| **Browser** | Puppeteer scraping/rendering | MY\_BROWSER | N/A |
| **Durable Objects** | Agent state & WebSockets | KitchenAgent, BarcodeAgent | Mapped in migrations |

## **5\. Wrangler Configuration Blueprint**

*(Incorporating your exact IDs, Secrets, and augmenting DO classes for the new agents)*

Code snippet

{  
  "name": "chef",  
  "main": "dist/\_worker.js/index.js",  
  "compatibility\_date": "2026-04-09",  
  "compatibility\_flags": \["nodejs\_compat"\],  
  "upload\_source\_maps": true,  
  "workers\_dev": true,  
  "preview\_urls": true,  
  "observability": {  
    "enabled": true,  
    "head\_sampling\_rate": 1,  
    "logs": {  
      "enabled": true,  
      "head\_sampling\_rate": 1,  
      "persist": true,  
      "invocation\_logs": true  
    },  
    "traces": {  
      "enabled": false,  
      "persist": true,  
      "head\_sampling\_rate": 1  
    }  
  },  
  "assets": {  
    "binding": "ASSETS",  
    "directory": "./dist",  
    "not\_found\_handling": "single-page-application"  
  },  
  "ai": {  
    "binding": "AI"  
  },  
  "kv\_namespaces": \[  
    {  
      "binding": "SESSION",  
      "id": "2ec2b50f79074013ad7d4dec27e58f5e"  
    }  
  \],  
  "d1\_databases": \[  
    {  
      "binding": "DB",  
      "database\_name": "chef-db",  
      "database\_id": "126adffd-53c1-40f8-a8be-db8b909d383d",  
      "migrations\_dir": "drizzle"  
    }  
  \],  
  "secrets\_store\_secrets": \[  
    { "binding": "GITHUB\_TOKEN", "store\_id": "8c42fa70938644e0a8a109744467375f", "secret\_name": "GH\_TOKEN" },  
    { "binding": "CLOUDFLARE\_ACCOUNT\_ID", "store\_id": "8c42fa70938644e0a8a109744467375f", "secret\_name": "CLOUDFLARE\_ACCOUNT\_ID" },  
    { "binding": "CLOUDFLARE\_API\_TOKEN", "store\_id": "8c42fa70938644e0a8a109744467375f", "secret\_name": "CLOUDFLARE\_API\_TOKEN" },  
    { "binding": "CLOUDFLARE\_SECRETS\_STORE\_TOKEN", "store\_id": "8c42fa70938644e0a8a109744467375f", "secret\_name": "CLOUDFLARE\_SECRETS\_STORE\_TOKEN" },  
    { "binding": "CLOUDFLARE\_WORKER\_ADMIN\_TOKEN", "store\_id": "8c42fa70938644e0a8a109744467375f", "secret\_name": "CLOUDFLARE\_WORKER\_ADMIN\_TOKEN" },  
    { "binding": "CLOUDFLARE\_AI\_SEARCH\_TOKEN", "store\_id": "8c42fa70938644e0a8a109744467375f", "secret\_name": "CLOUDFLARE\_AI\_SEARCH\_TOKEN" },  
    { "binding": "CLOUDFLARE\_OBSERVABILITY\_TOKEN", "store\_id": "8c42fa70938644e0a8a109744467375f", "secret\_name": "CLOUDFLARE\_OBSERVABILITY\_TOKEN" },  
    { "binding": "WORKER\_API\_KEY", "store\_id": "8c42fa70938644e0a8a109744467375f", "secret\_name": "WORKER\_API\_KEY" },  
    { "binding": "AGENTIC\_WORKER\_API\_KEY", "store\_id": "8c42fa70938644e0a8a109744467375f", "secret\_name": "AGENTIC\_WORKER\_API\_KEY" },  
    { "binding": "AI\_GATEWAY\_TOKEN", "store\_id": "8c42fa70938644e0a8a109744467375f", "secret\_name": "CLOUDFLARE\_AI\_GATEWAY\_TOKEN" },  
    { "binding": "CF\_BROWSER\_RENDER\_TOKEN", "store\_id": "8c42fa70938644e0a8a109744467375f", "secret\_name": "CLOUDFLARE\_BROWSER\_RENDER\_TOKEN" },  
    { "binding": "JULES\_API\_KEY", "store\_id": "8c42fa70938644e0a8a109744467375f", "secret\_name": "JULES\_API\_KEY" },  
    { "binding": "GEMINI\_API\_KEY", "store\_id": "8c42fa70938644e0a8a109744467375f", "secret\_name": "GOOGLE\_API\_KEY" },  
    { "binding": "ANTHROPIC\_API\_KEY", "store\_id": "8c42fa70938644e0a8a109744467375f", "secret\_name": "ANTHROPIC\_API\_KEY" },  
    { "binding": "OPENAI\_API\_KEY", "store\_id": "8c42fa70938644e0a8a109744467375f", "secret\_name": "OPENAI\_API\_KEY" }  
  \],  
  "r2\_buckets": \[  
    {  
      "binding": "BUCKET",  
      "bucket\_name": "menuforge-appliances"  
    }  
  \],  
  "vectorize": \[  
    {  
      "binding": "VECTOR\_INDEX",  
      "index\_name": "chef-appliance-manuals"  
    }  
  \],  
  "browser": {  
    "binding": "MY\_BROWSER"  
  },  
  "durable\_objects": {  
    "bindings": \[  
      { "name": "KitchenAgent", "class\_name": "KitchenOrchestrator" },  
      { "name": "BarcodeAgent", "class\_name": "BarcodeAgent" },  
      { "name": "ApplianceAgent", "class\_name": "ApplianceChatAgent" }  
    \]  
  },  
  "migrations": \[  
    {  
      "tag": "v1",  
      "new\_sqlite\_classes": \["KitchenOrchestrator"\]  
    },  
    {  
      "tag": "v2",  
      "new\_sqlite\_classes": \["BarcodeAgent", "ApplianceChatAgent"\]  
    }  
  \],  
  "vars": {  
    "AI\_GATEWAY\_NAME": "default-gateway"  
  }  
}

## **6\. Database Design (Drizzle)**

*(Using your exact src/backend/db/schema.ts implementation)*

### **6.1 Schema Reference**

The system utilizes the exact schema provided in src/backend/db/schema.ts:

* users, sessions: Authentication & State.  
* dashboardMetrics: Used to track system health and persist the "last generated hero image URL" & timestamp (avoiding a separate table, storing it as a metric type).  
* threads, messages: Managed by AIChatAgent (Cloudflare Agents SDK native SQLite is preferred for Agent state, but these D1 tables track global thread metadata).  
* healthChecks, notifications, documents (PlateJS).  
* recipes (id, title, ingredients JSON, generic\_steps JSON).  
* appliances (id, name, model, manualVectorId).  
* inventory (id, barcode, itemName, quantity).

## **7\. API Design (Hono \+ Zod OpenAPI)**

### **7.1 REST API Endpoints**

* GET /api/hero: Checks dashboardMetrics for a hero image generated in the last 12h. If none, calls SDXL, uploads to CF Images (using CLOUDFLARE\_API\_TOKEN), saves URL to D1, and returns it.  
* GET /api/appliances: Returns appliances table contents.  
* POST /api/appliances: Accepts a manual, triggers BUCKET upload and Vectorize embedding extraction.  
* GET /api/inventory: Lists inventory table.

### **7.2 WebSocket APIs**

* WS /ws/barcode: Connects to BarcodeAgent for the Python scanner.  
* WS /ws/chat/appliance/:id: Connects to ApplianceChatAgent for RAG.  
* WS /ws/chat/kitchen: Connects to KitchenOrchestrator for Magic Fridge Vision search.

## **8\. AI & Agents**

### **8.1 Agent Inventory**

1. **KitchenOrchestrator**: The master agent handling the "Magic Fridge" reverse search. Uses Vision models to look at fridge uploads, calls a search\_recipes tool.  
2. **ApplianceChatAgent**: RAG agent bound to VECTOR\_INDEX (chef-appliance-manuals).  
3. **BarcodeAgent**: Listens for barcode scans, enriches data, updates inventory table in D1.

## **9\. Frontend UX Design (Astro \+ shadcn/ui)**

**DEFAULT DARK THEME SHADCN.**

### **9.1 Pages**

* **Landing Page (/)**: Hero section fetching the 12-hour cached AI image. Overview of recent recipes.  
* **Docs Page (/docs)**: Exhaustive OpenAPI spec via Swagger, DB schema map, Agent Prompts.  
* **Health Dashboard (/health)**: Polls healthChecks and dashboardMetrics.  
* **Appliances (/appliances)**: Grid view of items in appliances. Click opens detail page with assistant-ui chat hooked to ApplianceChatAgent.  
* **Magic Fridge (/magic-fridge)**: Vision upload \+ assistant-ui chat hooked to KitchenOrchestrator.  
* **Inventory (/inventory)**: Live view of inventory table.

## **10\. Security & Dependencies**

* Package manager: pnpm (per pnpm-lock.yaml).  
* Uses existing dependencies: hono, @hono/zod-openapi, @cloudflare/agents, @cloudflare/ai-chat, drizzle-orm, astro, @assistant-ui/react.