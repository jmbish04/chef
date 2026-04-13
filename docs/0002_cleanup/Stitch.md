# **🧵 Stitch Prompts: "Chef" Application (Dark Theme Shadcn UI)**

Use the following prompts in Stitch to generate the foundational frontend screens for the "Chef" application. These are optimized based on the Idea, Theme, and Content formula, and align directly with the Orchestrator's Master Build Blueprint.

## **1\. The Interactive Split-Pane Layout (Desktop)**

*Targeting the Orchestrator Chat & Meal Planner side-by-side view.*

**PROMPT**

**Idea**

A split-pane dashboard for an AI-powered kitchen management web app named "Chef".

**Theme**

Default dark mode Shadcn UI style. Sleek, functional, and high contrast using dark slate grays and crisp white text. Use subtle borders and slightly rounded corners (rounded-lg or rounded-2xl).

**Content**

A responsive split-pane architecture. The left pane (70% width) displays a "Meal Planner" showing a calendar grid with recipe cards. The right pane (30% width) is a persistent chat interface sidebar ("KitchenOrchestrator"). The chat should include AI message bubbles, user message bubbles, and a text input field at the bottom with a submit button. Use Shadcn UI standard button, card, and input component styles.

## **2\. Recipe Discovery (Masonry Grid)**

*Targeting the visually appealing recipe exploration page.*

**PROMPT**

**Idea**

A recipe discovery page for a smart culinary command center app.

**Theme**

Default dark mode Shadcn UI style. Modern, highly visual, and Pinterest-like. Dark minimal background with soft rounded corners (rounded-2xl) and subtle drop shadows (shadow-sm) on components.

**Content**

A masonry grid layout displaying various recipe cards. Each card must feature a high-quality food image, a bold recipe title, a prep time indicator, and a small primary call-to-action button to "View". At the top of the page, include a navigation bar featuring a Shadcn UI search input field and a filter dropdown menu.

## **3\. Inventory Scanner (Mobile)**

*Targeting the hardware/input layer for logging fridge items.*

**PROMPT**

**Idea**

A mobile camera scanning interface for logging fridge and pantry inventory for a cooking app.

**Theme**

Dark mode Shadcn UI style. Minimalist and focused. Dark, semi-transparent overlays with bright, haptic visual feedback (like neon green) to indicate success.

**Content**

A full-screen camera view layout. In the center, a scanning bracket with a green pulsing border to indicate a successful item parse. At the bottom, a pull-up bottom sheet (Sheet component) displaying a list of recently scanned items (e.g., "Organic Milk", "Eggs") using Shadcn badge components. Include a large, primary "Add to Inventory" button inside the bottom sheet.

### **💡 Iteration Tips for Stitch (Post-Generation)**

Once Stitch generates the initial designs, use these targeted follow-up prompts to refine specific components:

* **To refine the Chat Input:** *"Update the text input area in the right chat pane to include a small paperclip icon button for attachments, utilizing standard Shadcn icon button styling."*  
* **To enhance the Recipe Cards:** *"Select the recipe cards in the masonry grid. Add a small 'Badge' component over the top right corner of the images displaying dietary tags like 'Vegan' or 'Keto'."*  
* **To tweak the Mobile Sheet:** *"Increase the border radius on the top corners of the mobile bottom sheet to make it feel more like a native iOS component, keeping the dark mode background."*

