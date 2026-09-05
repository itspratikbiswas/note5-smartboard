# Implementation Plan 2: Advanced Note5 Smart Board Core Feature Extensions

## 1. System Overview & Goals

## 2. Advanced Feature Matrix & Architecture Breakdown
This document serves as the structural implementation blueprint for Phase 2 of the Note5 Smart Board Interactive Canvas application. Phase 2 introduces advanced canvas parameters, dynamic document ingestion (PDFs/Tem\plates), AI-driven stroke optimizations, and an modular architectural upgrade designed to handle multi-layered canvas elements without UI lag on heavy 4K Interactive Flat Panels (IFPs).

### 2.1 Dynamic Pen Styles & Stroke Layering
- **Brush Profiles**: Introduce custom stroke rendering vectors:
  - *Standard Chalk*: High-texture, anti-aliased chalk rendering paths.
  - *Calligraphy / Active Pen*: Velocity-sensitive cursive writing tracks.
  - *Transparent Highlighter*: High-opacity translucent layer overlaps.
- **Parametric Controls**: Fine-grain slider states for `strokeOpacity` (0.0 to 1.0) and dynamic `brushDashes`.

### 2.2 Changeable Background Matrix & Native Templates
- **Color Array Palette**: Expand background states to include an infinite multi-color canvas hex swatches (Traditional green, matte slate, deep navy, midnight black, and paper-white).
- **Importable Templates**: Pre-structured grid templates injected directly behind the vector drawing layer (Music Staves, Polar/Cartesian Coordinates, Isometric dot grids, and Cornell Note-taking blueprints).

### 2.3 Comprehensive Document Ingestion Engine (PDF Imports)
- **Multi-Page Parsing**: Integrating browser-side asset extraction libraries to unpack local `.pdf` files.
- **Background Binding**: Map targeted PDF page layers into static background canvases, allowing the teacher to flip through slides while running continuous vector ink overlays on top.

### 2.4 Smart Canvas Recognition & AI Math Formulas
- **Shape Processing**: Local geometric line-simplification engine to snap rough hand-drawn loops, lines, and triangles into crisp vector shapes.
- **AI Formula Conversion**: Hook up background microservice strings to translate complex handwritten math calculations into digital, high-fidelity LaTeX typographical expressions.

### 2.5 Infinite Page & Workspace State Manager
- **Page Array Management**: Track multi-canvas histories via index states (`prevPage()`, `nextPage()`, `insertPageAt()`).
- **State Serialization**: Cache page histories locally to prevent workspace data wiping during memory refreshes.

---

## 3. Directory Layout & Expanded Target Files

### File 1: `src/components/PenStyleSelector.jsx` (New Component)
- Builds an immersive sub-menu layout displaying ink types, opacity bars, and line thickness configurations.

### File 2: `src/components/TemplateManager.jsx` (New Component)
- Manages local SVG template states and houses the changeable color configuration matrices.

### File 3: `src/utils/pdfIngestionWorker.js` (New Utility File)
- Implements background worker sequences to convert uploaded binary PDF documents into scalable HTML5 canvas background layers.

### File 4: `src/components/SmartCanvas.jsx` (Upgraded Component)
- Extends the core drawing canvas engine to process variable pressure-brush vectors and render vector background grid matrices.

### File 5: `src/components/AiFormulaProcessor.jsx` (New Component)
- Processes bounding-box stroke coordinate snapshots and routes text tokens to active system APIs.

---

## 4. Autonomous Routing Matrix & Equal Model Workload Distribution
To ensure optimal system separation and execute balanced resource allocation, the Anti-Gravity IDE orchestrator must route task operations evenly across the three primary execution engines:

### 🌟 Domain 1: Structural UI Layering & State Orchestration (Powered by Gemini)
*   **Target Files**: `src/components/PenStyleSelector.jsx`, `src/components/TemplateManager.jsx`
*   **Gemini Specialization (3.8 / 3.7 Flash)**: Leverage Gemini's extensive token context capabilities to manage intricate CSS properties, structure expansive color/template menus, map interactive slider interfaces via Tailwind, and bind global workspace styles seamlessly.

### 📐 Domain 2: High-Performance Computational Math & Ink Vectors (Powered by Claude)
*   **Target Files**: `src/components/SmartCanvas.jsx` (Upgraded Extension Layers)
*   **Claude Specialization (Sonnet 4.6 / Deep Thinking)**: Utilize Claude's analytical execution mechanics to program line-simplification logic, code real-time pen velocity stroke-width smoothing calculations, and handle high-speed pixel transformation arrays cleanly without touch delays.

### ⚙️ Domain 3: File Input Pipelines & Third-Party System Logic (Powered by GPT-OSS)
*   **Target Files**: `src/utils/pdfIngestionWorker.js`, `src/components/AiFormulaProcessor.jsx`
*   **GPT-OSS Specialization (GPT-OSS-120b)**: Route to the open-source heavy-weight engine to build strict asynchronous data parsing handlers, integrate binary blob transformations, wire structural `html2canvas` page conversions, and format payload structures for OCR conversions.

---

## 5. End-to-End Build and Verification Directives
1. **Parallel Building Initialization**: The Anti-Gravity compiler should fire up three independent container workspace loops to prompt Gemini, Claude, and GPT-OSS simultaneously according to their designated file assignments.
2. **Context Compilation Check**: Once structural codes are declared, pass file configurations to the background **Nano Banana 2** visual parsing module to inspect bounding containers, check for element clippings, and verify theme contrasts across dark boards.
3. **Execution Flag Verification**: Trigger local server script tracking loops (`npm run dev`) to confirm that all imported scripts compile with 100% zero workspace deployment warning outputs.
