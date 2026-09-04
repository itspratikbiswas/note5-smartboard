import React, { useState, useEffect, useCallback } from 'react';
import SmartCanvas from './components/SmartCanvas';
import FloatingToolbar, { CHALK_COLORS } from './components/FloatingToolbar';
import TopHeader, { BACKGROUND_THEMES } from './components/TopHeader';
import SubjectModal from './components/SubjectModal';
import InteractiveToolLayer from './components/InteractiveToolLayer';
import PageManager from './components/PageManager';
import ExportModal from './components/ExportModal';
import PenStyleSelector from './components/PenStyleSelector';
import TemplateManager from './components/TemplateManager';
import AiFormulaProcessor from './components/AiFormulaProcessor';
import { ClassroomTimer, StickyNoteCard } from './components/ClassroomWidgets';

/**
 * Note5 Smart Board - Main Application Shell (Phase 2)
 */
export default function App() {
  // Session & Title State
  const [sessionTitle, setSessionTitle] = useState('Physics & Math Lecture Notes');
  const [currentBackground, setCurrentBackground] = useState('chalkboard-bg');
  const [customBgColor, setCustomBgColor] = useState('');

  // Brush & Pen Parameters
  const [activeTool, setActiveTool] = useState('pen');
  const [activeBrushProfile, setActiveBrushProfile] = useState('chalk'); // 'chalk' | 'calligraphy' | 'highlighter' | 'smart-shape' | 'laser'
  const [strokeColor, setStrokeColor] = useState(CHALK_COLORS[0].hex);
  const [strokeWidth, setStrokeWidth] = useState(6);
  const [strokeOpacity, setStrokeOpacity] = useState(1.0);
  const [brushDash, setBrushDash] = useState('solid');
  const [activeShape, setActiveShape] = useState('rectangle');

  // Modal Triggers
  const [showPenStyleModal, setShowPenStyleModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showAiFormulaModal, setShowAiFormulaModal] = useState(false);
  const [activeSubjectModal, setActiveSubjectModal] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showFilmstrip, setShowFilmstrip] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [dockPosition, setDockPosition] = useState('bottom');

  // On-Screen Math Tools
  const [activeTools, setActiveTools] = useState({
    ruler: false,
    protractor: false
  });

  // Multi-Page Board States
  const [pages, setPages] = useState([
    {
      id: 'page-1',
      bgType: 'chalkboard-bg',
      customBgColor: '',
      pdfBackground: null,
      strokes: [],
      shapes: [],
      stemObjects: [],
      formulas: [],
      stickyNotes: [
        {
          id: 'note-welcome',
          x: 40,
          y: 80,
          text: 'Welcome to Note5 Smart Board 2.0!\n• Velocity Calligraphy & Chalk\n• PDF Lecture Slide Ingestion\n• AI Math Formula Cards\n• 30cm Ruler & Protractor',
          color: 'yellow'
        }
      ]
    }
  ]);
  const [activePageIndex, setActivePageIndex] = useState(0);

  // Undo / Redo History
  const [historyStack, setHistoryStack] = useState([[]]);
  const [historyStep, setHistoryStep] = useState(0);

  const currentPage = pages[activePageIndex] || pages[0];

  /**
   * Commit Action Snapshot
   */
  const handleCommitAction = useCallback(() => {
    const activePage = pages[activePageIndex];
    const snapshot = {
      strokes: [...(activePage.strokes || [])],
      shapes: [...(activePage.shapes || [])],
      stemObjects: [...(activePage.stemObjects || [])],
      formulas: [...(activePage.formulas || [])],
      stickyNotes: [...(activePage.stickyNotes || [])]
    };

    setHistoryStack(prev => {
      const currentStack = prev.slice(0, historyStep + 1);
      return [...currentStack, snapshot];
    });
    setHistoryStep(prev => prev + 1);
  }, [pages, activePageIndex, historyStep]);

  /**
   * Undo
   */
  const handleUndo = useCallback(() => {
    if (historyStep > 0) {
      const targetStep = historyStep - 1;
      const targetSnapshot = historyStack[targetStep];
      if (targetSnapshot) {
        setPages(prev => prev.map((p, idx) => {
          if (idx === activePageIndex) {
            return {
              ...p,
              strokes: [...targetSnapshot.strokes],
              shapes: [...targetSnapshot.shapes],
              stemObjects: [...targetSnapshot.stemObjects],
              formulas: targetSnapshot.formulas ? [...targetSnapshot.formulas] : [],
              stickyNotes: targetSnapshot.stickyNotes ? [...targetSnapshot.stickyNotes] : []
            };
          }
          return p;
        }));
        setHistoryStep(targetStep);
      }
    }
  }, [historyStep, historyStack, activePageIndex]);

  /**
   * Redo
   */
  const handleRedo = useCallback(() => {
    if (historyStep < historyStack.length - 1) {
      const targetStep = historyStep + 1;
      const targetSnapshot = historyStack[targetStep];
      if (targetSnapshot) {
        setPages(prev => prev.map((p, idx) => {
          if (idx === activePageIndex) {
            return {
              ...p,
              strokes: [...targetSnapshot.strokes],
              shapes: [...targetSnapshot.shapes],
              stemObjects: [...targetSnapshot.stemObjects],
              formulas: targetSnapshot.formulas ? [...targetSnapshot.formulas] : [],
              stickyNotes: targetSnapshot.stickyNotes ? [...targetSnapshot.stickyNotes] : []
            };
          }
          return p;
        }));
        setHistoryStep(targetStep);
      }
    }
  }, [historyStep, historyStack, activePageIndex]);

  /**
   * Clear Canvas
   */
  const handleClearCanvas = () => {
    if (window.confirm('Clear all drawings on this board?')) {
      setPages(prev => prev.map((p, idx) => {
        if (idx === activePageIndex) {
          return { ...p, strokes: [], shapes: [], stemObjects: [], formulas: [] };
        }
        return p;
      }));
      handleCommitAction();
    }
  };

  /**
   * Add Page
   */
  const handleAddPage = () => {
    const newPage = {
      id: `page-${Date.now()}`,
      bgType: currentBackground,
      customBgColor: customBgColor,
      pdfBackground: null,
      strokes: [],
      shapes: [],
      stemObjects: [],
      formulas: [],
      stickyNotes: []
    };
    setPages(prev => [...prev, newPage]);
    setActivePageIndex(pages.length);
    setHistoryStack([[]]);
    setHistoryStep(0);
  };

  /**
   * Import PDF Pages into Whiteboard Slides
   */
  const handleImportPdfPages = (pdfPages) => {
    const newPages = pdfPages.map((pdfPage, idx) => ({
      id: `pdf-page-${Date.now()}-${idx}`,
      bgType: 'pdf-slide',
      customBgColor: '',
      pdfBackground: pdfPage,
      strokes: [],
      shapes: [],
      stemObjects: [],
      formulas: [],
      stickyNotes: []
    }));

    setPages(prev => [...prev, ...newPages]);
    setActivePageIndex(pages.length);
  };

  /**
   * Insert AI Formula
   */
  const handleInsertFormula = (formulaObj) => {
    setPages(prev => prev.map((p, idx) => {
      if (idx === activePageIndex) {
        return {
          ...p,
          formulas: [...(p.formulas || []), formulaObj]
        };
      }
      return p;
    }));
    handleCommitAction();
  };

  /**
   * Insert STEM Apparatus
   */
  const handleAddStemObject = (stemObj) => {
    setPages(prev => prev.map((p, idx) => {
      if (idx === activePageIndex) {
        return {
          ...p,
          stemObjects: [...(p.stemObjects || []), stemObj]
        };
      }
      return p;
    }));
    handleCommitAction();
  };

  /**
   * Sticky Notes Management
   */
  const handleAddStickyNote = () => {
    const newNote = {
      id: `note-${Date.now()}`,
      x: window.innerWidth / 2 - 100,
      y: window.innerHeight / 2 - 70,
      text: '',
      color: 'yellow'
    };
    setPages(prev => prev.map((p, idx) => {
      if (idx === activePageIndex) {
        return {
          ...p,
          stickyNotes: [...(p.stickyNotes || []), newNote]
        };
      }
      return p;
    }));
    handleCommitAction();
  };

  const handleUpdateStickyNote = (noteId, updates) => {
    setPages(prev => prev.map((p, idx) => {
      if (idx === activePageIndex) {
        return {
          ...p,
          stickyNotes: (p.stickyNotes || []).map(n => n.id === noteId ? { ...n, ...updates } : n)
        };
      }
      return p;
    }));
  };

  const handleDeleteStickyNote = (noteId) => {
    setPages(prev => prev.map((p, idx) => {
      if (idx === activePageIndex) {
        return {
          ...p,
          stickyNotes: (p.stickyNotes || []).filter(n => n.id !== noteId)
        };
      }
      return p;
    }));
    handleCommitAction();
  };

  const handleToggleTool = (toolName) => {
    setActiveTools(prev => ({
      ...prev,
      [toolName]: !prev[toolName]
    }));
  };

  const handleCloseTool = (toolName) => {
    setActiveTools(prev => ({
      ...prev,
      [toolName]: false
    }));
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none bg-slate-950 font-sans">
      
      {/* 1. Top Navigation Bar */}
      <TopHeader
        sessionTitle={sessionTitle}
        setSessionTitle={setSessionTitle}
        currentBackground={currentBackground}
        setCurrentBackground={setCurrentBackground}
        pages={pages}
        activePageIndex={activePageIndex}
        onSelectPage={(idx) => {
          setActivePageIndex(idx);
          setHistoryStack([[]]);
          setHistoryStep(0);
        }}
        onAddPage={handleAddPage}
        onDuplicatePage={(idx) => {
          const target = pages[idx];
          const newPage = JSON.parse(JSON.stringify(target));
          newPage.id = `page-${Date.now()}`;
          const newPages = [...pages];
          newPages.splice(idx + 1, 0, newPage);
          setPages(newPages);
          setActivePageIndex(idx + 1);
        }}
        onDeletePage={(idx) => {
          if (pages.length <= 1) return;
          setPages(pages.filter((_, i) => i !== idx));
          setActivePageIndex(Math.max(0, idx - 1));
        }}
        onOpenExportModal={() => setShowExportModal(true)}
        onOpenTemplateManager={() => setShowTemplateModal(true)}
        onOpenAiFormulas={() => setShowAiFormulaModal(true)}
        onOpenPenStyles={() => setShowPenStyleModal(true)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
        showFilmstrip={showFilmstrip}
        setShowFilmstrip={setShowFilmstrip}
      />

      {/* 2. Main Interactive Canvas Layer */}
      <SmartCanvas
        strokes={currentPage.strokes || []}
        setStrokes={(newStrokes) => {
          setPages(prev => prev.map((p, idx) => {
            if (idx === activePageIndex) {
              return {
                ...p,
                strokes: typeof newStrokes === 'function' ? newStrokes(p.strokes || []) : newStrokes
              };
            }
            return p;
          }));
        }}
        shapes={currentPage.shapes || []}
        setShapes={(newShapes) => {
          setPages(prev => prev.map((p, idx) => {
            if (idx === activePageIndex) {
              return {
                ...p,
                shapes: typeof newShapes === 'function' ? newShapes(p.shapes || []) : newShapes
              };
            }
            return p;
          }));
        }}
        stemObjects={currentPage.stemObjects || []}
        setStemObjects={(newObjs) => {
          setPages(prev => prev.map((p, idx) => {
            if (idx === activePageIndex) {
              return {
                ...p,
                stemObjects: typeof newObjs === 'function' ? newObjs(p.stemObjects || []) : newObjs
              };
            }
            return p;
          }));
        }}
        formulas={currentPage.formulas || []}
        setFormulas={(newForms) => {
          setPages(prev => prev.map((p, idx) => {
            if (idx === activePageIndex) {
              return {
                ...p,
                formulas: typeof newForms === 'function' ? newForms(p.formulas || []) : newForms
              };
            }
            return p;
          }));
        }}
        activeTool={activeTool}
        brushProfile={activeBrushProfile}
        strokeColor={strokeColor}
        strokeWidth={strokeWidth}
        strokeOpacity={strokeOpacity}
        brushDash={brushDash}
        activeShape={activeShape}
        onCommitAction={handleCommitAction}
        bgClass={currentBackground}
        customBgColor={customBgColor}
        pdfBackground={currentPage.pdfBackground}
      />

      {/* 3. Sticky Notes */}
      {currentPage.stickyNotes && currentPage.stickyNotes.map(note => (
        <StickyNoteCard
          key={note.id}
          note={note}
          onUpdate={handleUpdateStickyNote}
          onDelete={handleDeleteStickyNote}
        />
      ))}

      {/* 4. On-Screen Virtual Ruler & Protractor */}
      <InteractiveToolLayer
        activeTools={activeTools}
        onCloseTool={handleCloseTool}
      />

      {/* 5. Classroom Countdown Timer */}
      <ClassroomTimer
        isOpen={showTimer}
        onClose={() => setShowTimer(false)}
      />

      {/* 6. Dockable Floating Toolbar */}
      <FloatingToolbar
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        brushProfile={activeBrushProfile}
        setBrushProfile={setActiveBrushProfile}
        strokeColor={strokeColor}
        setStrokeColor={setStrokeColor}
        strokeWidth={strokeWidth}
        setStrokeWidth={setStrokeWidth}
        strokeOpacity={strokeOpacity}
        setStrokeOpacity={setStrokeOpacity}
        brushDash={brushDash}
        setBrushDash={setBrushDash}
        activeShape={activeShape}
        setActiveShape={setActiveShape}
        onClearCanvas={handleClearCanvas}
        onOpenSubjectModal={(tab) => setActiveSubjectModal(tab)}
        onToggleTimer={() => setShowTimer(!showTimer)}
        onAddStickyNote={handleAddStickyNote}
        onOpenPenStyles={() => setShowPenStyleModal(true)}
        canUndo={historyStep > 0}
        canRedo={historyStep < historyStack.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
        dockPosition={dockPosition}
        setDockPosition={setDockPosition}
      />

      {/* 7. Slide Thumbnail Filmstrip */}
      <PageManager
        isOpen={showFilmstrip}
        onClose={() => setShowFilmstrip(false)}
        pages={pages}
        activePageIndex={activePageIndex}
        onSelectPage={(idx) => {
          setActivePageIndex(idx);
          setHistoryStack([[]]);
          setHistoryStep(0);
        }}
        onAddPage={handleAddPage}
        onDuplicatePage={(idx) => {
          const target = pages[idx];
          const newPage = JSON.parse(JSON.stringify(target));
          newPage.id = `page-${Date.now()}`;
          const newPages = [...pages];
          newPages.splice(idx + 1, 0, newPage);
          setPages(newPages);
          setActivePageIndex(idx + 1);
        }}
        onDeletePage={(idx) => {
          if (pages.length <= 1) return;
          setPages(pages.filter((_, i) => i !== idx));
          setActivePageIndex(Math.max(0, idx - 1));
        }}
      />

      {/* 8. Pen Style & Brush Parameters Modal */}
      <PenStyleSelector
        isOpen={showPenStyleModal}
        onClose={() => setShowPenStyleModal(false)}
        activeBrushProfile={activeBrushProfile}
        setActiveBrushProfile={setActiveBrushProfile}
        strokeColor={strokeColor}
        setStrokeColor={setStrokeColor}
        strokeWidth={strokeWidth}
        setStrokeWidth={setStrokeWidth}
        strokeOpacity={strokeOpacity}
        setStrokeOpacity={setStrokeOpacity}
        brushDash={brushDash}
        setBrushDash={setBrushDash}
        isShapeRecognitionOn={activeBrushProfile === 'smart-shape'}
        setIsShapeRecognitionOn={(on) => setActiveBrushProfile(on ? 'smart-shape' : 'chalk')}
      />

      {/* 9. Template & PDF Ingestion Modal */}
      <TemplateManager
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        currentTheme={currentBackground}
        setCurrentTheme={setCurrentBackground}
        customBgColor={customBgColor}
        setCustomBgColor={setCustomBgColor}
        onImportPdfPages={handleImportPdfPages}
      />

      {/* 10. AI Math Formula Typesetting Modal */}
      <AiFormulaProcessor
        isOpen={showAiFormulaModal}
        onClose={() => setShowAiFormulaModal(false)}
        onInsertFormula={handleInsertFormula}
      />

      {/* 11. STEM Subject Drawer Modal */}
      <SubjectModal
        isOpen={!!activeSubjectModal}
        onClose={() => setActiveSubjectModal(null)}
        initialTab={activeSubjectModal || 'math'}
        onAddStemObject={handleAddStemObject}
        onToggleTool={handleToggleTool}
        activeTools={activeTools}
        onSetBackgroundGrid={(bgId) => setCurrentBackground(bgId)}
      />

      {/* 12. Export PDF / PNG Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        pages={pages}
        activePageIndex={activePageIndex}
        currentBackground={currentBackground}
        sessionTitle={sessionTitle}
        onLoadSession={(session) => {
          if (session.pages && session.pages.length > 0) {
            setPages(session.pages);
            setActivePageIndex(session.activePageIndex || 0);
            if (session.title) setSessionTitle(session.title);
          }
        }}
      />

    </div>
  );
}
