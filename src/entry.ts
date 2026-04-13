// Re-export the Durable Object class
export { KitchenOrchestrator } from "./backend/index";

// Export the default fetch handler from Astro's output
export { default } from "../dist/_worker.js/index.js";
