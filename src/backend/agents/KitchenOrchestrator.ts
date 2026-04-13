// @ts-nocheck
import puppeteer from "@cloudflare/puppeteer";
import { Agent as AIChatAgent } from "agents";

import type { Bindings } from "../api/index";

export class KitchenOrchestrator extends AIChatAgent<Bindings> {
  async onStart() {
    // Implement internal SQLite database setup for Agent's persistent memory
    const sql = this.ctx.storage.sql;
    sql.exec(`
      CREATE TABLE IF NOT EXISTS agent_memory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT UNIQUE,
        value TEXT
      )
    `);
  }

  async ingest_manual({ manual_text }: { manual_text: string }) {
    try {
      // Chunk text into 1000 character pieces (simple approach)
      const chunks = [];
      const chunkSize = 1000;
      for (let i = 0; i < manual_text.length; i += chunkSize) {
        chunks.push(manual_text.substring(i, i + chunkSize));
      }

      const embeddings = await this.env.AI.run("@cf/baai/bge-large-en-v1.5", {
        text: chunks,
      });

      const vectors = chunks.map((chunk, i) => ({
        id: crypto.randomUUID(),
        values: embeddings.data[i],
        metadata: { text: chunk },
      }));

      // We process inserts in batches of max 10 to avoid payload limits
      for (let i = 0; i < vectors.length; i += 10) {
        await this.env.MANUALS_INDEX.upsert(vectors.slice(i, i + 10));
      }

      return `Successfully ingested manual in ${chunks.length} chunks.`;
    } catch (e) {
      console.error(e);
      return "Failed to ingest manual: " + String(e);
    }
  }
  async query_appliance_instructions({
    query,
    appliance_id: _appliance_id,
  }: {
    query: string;
    appliance_id: string;
  }) {
    try {
      const embedding = await this.env.AI.run("@cf/baai/bge-large-en-v1.5", {
        text: [query],
      });

      const matches = await this.env.MANUALS_INDEX.query(embedding.data[0], {
        topK: 3,
        returnMetadata: true,
      });

      if (!matches.matches || matches.matches.length === 0) {
        return "No specific instructions found for this appliance regarding the query.";
      }

      const context = matches.matches.map((m) => m.metadata?.text).join("\n---\n");
      return `Found relevant instructions:\n${context}`;
    } catch (e) {
      console.error(e);
      return "Failed to query instructions: " + String(e);
    }
  }

  async scrape_recipe({ url }: { url: string }) {
    try {
      const browser = await puppeteer.launch(this.env.BROWSER);
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: "domcontentloaded" });

      const text = await page.evaluate(() => {
        return document.body.innerText;
      });

      await browser.close();
      return text.substring(0, 15000); // return up to 15k chars
    } catch (e) {
      console.error(e);
      return "Failed to scrape recipe from " + url + ": " + String(e);
    }
  }
}
