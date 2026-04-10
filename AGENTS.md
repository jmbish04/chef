# Coding Agent Instructions — ChefOS Retrofit

## MANDATORY STANDARDS

### 1. Database Modularity
* You **MUST** follow the directory structure: `src/backend/db/schemas/{module}/{table}.ts`.
* Example: `src/backend/db/schemas/recipes/ingredients.ts`.
* Every table must have a corresponding health check in `src/backend/db/health.ts`.

### 2. The "GAS to Worker" Logic
* The original `gas-recipe-to-doc` uses Google-specific services.
* You **MUST** replace `GoogleDocs.create()` with a database `insert` into D1.
* You **MUST** replace `AI` calls with `env.AI.gateway(env.AI_GATEWAY_NAME).run()`.

### 3. Hardware-Aware RAG (CRITICAL)
* When a user selects an appliance, you must:
    1.  Query D1 for the `model` and `brand`.
    2.  Query Vectorize for relevant manual chunks using metadata filters for that `model`.
    3.  Inject chunks into the Agent prompt to customize the `instructions`.

### 4. PDF Layout
* Frontend Agent: Create a specific Astro layout at `src/frontend/pages/print/[id].astro`.
* Use Tailwind's `print:hidden` and `print:block` utilities.
* The 8.5x11 target is primary; use `break-after-page` to ensure the ingredients are on the front and instructions start on the back if length permits.

### 5. AI Safety & Tools
* Ingredient Identification: Build a tool `getIngredientAlternatives(ingredientName)` that the Agent can call.
* Do not allow the Agent to hallucinate appliance settings; if the Vectorize search returns low-confidence scores, have the agent explicitly ask the user for the manual setting.

## PRD Reference
Refer to `PRD.md` for the full feature set.

## Task Plan Reference
Refer to `project_tasks.json`. Start with Phase 1 and update status to `started` immediately.
