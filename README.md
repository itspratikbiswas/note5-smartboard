# Note5 Smart Board Interactive Canvas 🎨

An ultra-responsive, feature-rich interactive smart board and whiteboard application inspired by **EasiNote 5**, engineered for interactive flat panels (IFPs), coaching institutes, smart classrooms, and live lectures.

![Note5 Smart Board Preview](https://raw.githubusercontent.com/itspratikbiswas/note5-smartboard/main/preview.png) *(or launch standalone.html)*

---

## ✨ Key Features

### 🖋️ Advanced Inking & Dynamic Pen Styles
- **5 Inking Profiles**:
  - **Classroom Chalk**: Anti-aliased, textured blackboard path.
  - **Calligraphy / Stylus Pen**: Velocity & pressure-sensitive dynamic cursive strokes.
  - **Translucent Highlighter**: Smooth highlight overlay mode.
  - **Presenter Laser Pointer**: Ephemeral glowing particle decay trail.
  - **Smart Shape Assistant**: Automatic real-time vectorization of hand-drawn shapes.
- **Parametric Controls**:
  - Stroke Opacity (10% to 100%).
  - Line patterns: **Solid Line**, **Dashed**, and **Dotted**.
  - Dynamic Thickness slider (1px to 40px).

### 🎨 Unlimited Color Palette & Custom Picker
- 14+ curated academic chalk swatches (*Pure White, Chalk Yellow, Sky Blue, Neon Green, Coral Red, Vivid Violet, Solar Orange, Rose Pink, Cyan Aqua, Warm Gold, Mint Green, Lavender, Crimson, Slate Gray*).
- Real-time **Color Wheel Picker** (`<input type="color">`) supporting any custom hex/RGB/HSL hue.

### 📐 Academic STEM & Math Drawer
- **Virtual 30cm Ruler**: Movable on-screen scale with centimeter & millimeter ticks.
- **360° Angle Protractor**: Circular degree finder for geometry classes.
- **Chemistry Vector Apparatus**: Beakers, Erlenmeyer Flasks, Florence Flasks, and Benzene Rings ($C_6H_6$).
- **Physics Laboratory**: DC Batteries, Bulbs, Resistors, and Biconvex Lenses.

### 🖼️ Board Themes & PDF Slide Ingestion
- **8 Board Base Colors**: Classic Chalkboard Green, Obsidian Black, Oxford Navy, Charcoal Slate, Clean Whiteboard, Warm Parchment, Crimson Slate, and Royal Blue.
- **Custom Background Color Picker**: Apply any custom color to the canvas.
- **6 Grid & Paper Blueprints**: 40px Coordinate Grid, Isometric 3D Dots, Ruled Notebook Lines, Cornell Notes, Musical Staves, and Plain Solid.
- **PDF Slide Ingestion**: Ingest multi-page lecture decks as background slide layers with live vector ink overlays on top.

### ⏱️ Classroom Widgets & Multi-Page Management
- **Classroom Countdown Timer & Stopwatch** with presets.
- **Sticky Memo Notes**: Movable, editable colored cards on canvas.
- **Multi-Page Management**: Add, duplicate, delete, and jump between slides.
- **Export Engine**: Export full-resolution multi-page PDF documents or high-definition PNG images.

---

## 🚀 Quick Start

### Option 1: Standalone Zero-Install (Recommended)
Simply open `standalone.html` in any modern web browser:
```bash
# In Windows Explorer:
double-click standalone.html

# Or via Python local server:
python -m http.server 8000
# Then open http://127.0.0.1:8000/standalone.html
```

### Option 2: React Development Server
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

---

## 🛠️ Technology Stack
- **Frontend Framework**: React 18 / Vanilla HTML5 Canvas
- **Styling**: Tailwind CSS + Custom Glassmorphism & Chalkboard Textures
- **Icons**: Lucide Icons
- **PDF Ingestion & Export**: PDF.js & jsPDF
- **Spline Calculations**: Quadratic Bezier Vector Smoothing Engine

---

## 📄 License
MIT License. Free for educational and commercial use.
