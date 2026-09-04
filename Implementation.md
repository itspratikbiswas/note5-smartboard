# Implementation Plan: Note5 Smart Board Interactive Canvas App

## 1. System Overview & Goals
Build a production-ready, highly responsive smart-board application inspired by "EasiNote 5" used by coaching institutes. The core goal is an intuitive, low-latency drawing app optimized for large-scale presentation screens (smart boards), featuring a clean floating toolbar, academic utility drawers, and student resource exporting.

## 2. Tech Stack & Infrastructure
- **Framework**: React (Vite-based Single Page Application structure) using modern functional components.
- **Styling**: Tailwind CSS for high-fidelity UI layout, canvas layering, and dark-theme configurations.
- **Canvas Engine**: HTML5 Canvas managed via Lucide icons for custom drawing path states.
- **Export Utility**: `jspdf` and `html2canvas` for stitching canvas asynchronous state snapshots into student-ready multi-page PDFs.
- **Interactivity**: Unified HTML5 `PointerEvents` API to support high-precision active stylus pen inputs, palm rejection, and multi-finger touchscreen execution.

---

## 3. Architecture & File Breakdown

### File 1: `src/App.jsx`
- **Role**: Root application container establishing full-screen framework bounds.
- **State Management**: Controls global states including `activeTool` (Pen, Eraser, Select), `strokeColor`, `strokeWidth`, `activeModal` (Math, Science, None), and `canvasPages`.
- **Canvas Environments**: Implements layout background toggles for academic presentation settings:
  - Traditional Dark Green Chalkboard (`#1e3f20`)
  - Isometric Grid lines
  - Production Matte Black

### File 2: `src/components/SmartCanvas.jsx`
- **Role**: Hardware-accelerated 2D drawing engine wrapper.
- **Input Orchestration**: Intercepts low-level browser cursor logic (`pointerdown`, `pointermove`, `pointerup`) to map pen velocity/pressure data arrays to rendering sequences.
- **Vector Overlay Layers**: Handles standard primitive shape generation (Straight Lines, Circles, Squares, Arrow notations).

### File 3: `src/components/FloatingToolbar.jsx`
- **Role**: Ergonomically-designed presentation dock stationed at the viewport footer or collapsible side panels.
- **Interface Target Rules**: Buttons feature large click-targets (minimum 48px padding) to maximize standard arm logistics when a teacher stands directly in front of large interactive flat panels (IFPs).
- **Core Toggles**: Pen, Highlighter, Eraser, and Clear Canvas.
- **Chalk Presets**: High-contrast, presentation-optimized color swatches (Pure White, Chalk-Yellow, Sky-Blue, Neon-Green).

### File 4: `src/components/SubjectModal.jsx`
- **Role**: Slide-out multi-disciplinary resource drawer overlaying the drawing layer.
- **Math Drawer**: Contains scalable geometric interactive SVGs, specifically a Protractor and a 12-inch Ruler layout matrix.
- **Science Drawer**: Pre-rendered vector graphics asset library containing Chemistry laboratory equipment blueprints (Beakers, Florence flasks, Bunsen burners) designed for drag-and-drop structural positioning.

### File 5: `src/utils/exportEngine.js`
- **Role**: Asynchronous asset generation utility.
- **Compilation Logic**: Iterates over active canvas page states, flattens current graphical metrics, and uses `jsPDF` to compile a clean multi-page session log file for student distribution.

---

## 4. Execution Directives for Anti-Gravity Agent
1. **Scaffold Layout**: Initialize a clean directory structure containing `/src/components` and `/src/utils`. Ensure dependencies `lucide-react`, `jspdf`, and `html2canvas` are initialized inside the workspace.
2. **Ink Interpolation**: Prioritize continuous brush stroke calculations using mid-point math algorithm models to eliminate raw vector jaggedness on 4K digital display boards.
3. **Viewport Bindings**: Enforce absolute full-screen styling boundaries (`h-screen w-screen overflow-hidden`) to completely block horizontal or vertical browser layout clipping.

---

## 5. Strict Model Isolation & Environment Routing Rules
To execute this build, the Antigravity Orchestrator must strictly split task execution across external endpoints. Do not fall back to a single model provider for compilation:

1. FORCE CLAUDE ROUTING: The mathematical algorithms, line rendering, and high-precision PointerEvents array stroke parsing for `src/components/SmartCanvas.jsx` MUST be sent to the Claude Code router endpoint.
2. FORCE GPT ROUTING: The data serialization, multi-page layout building, and asynchronous canvas capturing inside `src/utils/exportEngine.js` MUST be routed through the GPT utility script engine.
3. NATIVE GEMINI ROUTING: Use the native Gemini 3.7 engine strictly for structural layout rendering (`src/App.jsx`, `src/components/FloatingToolbar.jsx`, and UI drawer layouts).
