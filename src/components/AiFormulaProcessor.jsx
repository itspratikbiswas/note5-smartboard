import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Copy, 
  Plus, 
  Check, 
  Calculator, 
  Atom, 
  Sigma, 
  FunctionSquare 
} from 'lucide-react';

export const FORMULA_PRESETS = [
  {
    category: 'Calculus & Analysis',
    formulas: [
      { name: 'Fundamental Theorem of Calculus', latex: '\\int_{a}^{b} f(x)\\,dx = F(b) - F(a)', preview: '∫[a,b] f(x)dx = F(b) - F(a)' },
      { name: 'Taylor Series Expansion', latex: 'f(x) = \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(a)}{n!}(x-a)^n', preview: 'f(x) = Σ f⁽ⁿ⁾(a)/n! (x-a)ⁿ' },
      { name: 'Euler\'s Identity', latex: 'e^{i\\pi} + 1 = 0', preview: 'e^(iπ) + 1 = 0' },
      { name: 'Quadratic Formula', latex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}', preview: 'x = (-b ± √(b² - 4ac)) / 2a' }
    ]
  },
  {
    category: 'Physics & Electromagnetism',
    formulas: [
      { name: 'Mass-Energy Equivalence', latex: 'E = mc^2', preview: 'E = mc²' },
      { name: 'Schrödinger Wave Equation', latex: 'i\\hbar \\frac{\\partial}{\\partial t}\\Psi = \\hat{H}\\Psi', preview: 'iℏ ∂Ψ/∂t = ĤΨ' },
      { name: 'Maxwell-Faraday Equation', latex: '\\nabla \\times \\vec{E} = -\\frac{\\partial \\vec{B}}{\\partial t}', preview: '∇ × E = -∂B/∂t' },
      { name: 'Gravitational Force', latex: 'F = G \\frac{m_1 m_2}{r^2}', preview: 'F = G(m₁m₂)/r²' }
    ]
  },
  {
    category: 'Chemistry & Thermodynamics',
    formulas: [
      { name: 'Ideal Gas Law', latex: 'PV = nRT', preview: 'PV = nRT' },
      { name: 'Gibbs Free Energy', latex: '\\Delta G = \\Delta H - T\\Delta S', preview: 'ΔG = ΔH - TΔS' },
      { name: 'Arrhenius Rate Equation', latex: 'k = A e^{-\\frac{E_a}{RT}}', preview: 'k = A e^(-Ea/RT)' },
      { name: 'Nernst Cell Potential', latex: 'E = E^\\circ - \\frac{RT}{nF}\\ln Q', preview: 'E = E° - (RT/nF) ln Q' }
    ]
  }
];

/**
 * AI Math & LaTeX Formula Processor Modal
 */
export default function AiFormulaProcessor({
  isOpen,
  onClose,
  onInsertFormula
}) {
  const [selectedCategory, setSelectedCategory] = useState('Calculus & Analysis');
  const [customFormula, setCustomFormula] = useState('E = mc^2');
  const [copiedId, setCopiedId] = useState(null);

  if (!isOpen) return null;

  const currentCategoryObj = FORMULA_PRESETS.find(c => c.category === selectedCategory) || FORMULA_PRESETS[0];

  const handlePlaceFormulaCard = (formula) => {
    onInsertFormula({
      id: `formula-${Date.now()}`,
      name: formula.name,
      latex: formula.latex,
      preview: formula.preview,
      x: window.innerWidth / 2 - 120,
      y: window.innerHeight / 2 - 50
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-2xl rounded-3xl overflow-hidden border border-white/20 shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-900/70">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white shadow-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">AI Math & Formula Typesetting</h2>
              <p className="text-xs text-slate-400">Insert high-precision mathematical and scientific LaTeX notations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 px-6 pt-3 pb-2 border-b border-white/5 bg-slate-950/40 overflow-x-auto">
          {FORMULA_PRESETS.map((cat) => (
            <button
              key={cat.category}
              onClick={() => setSelectedCategory(cat.category)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.category
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat.category}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          
          {/* Preset Formulas */}
          <div className="space-y-2.5">
            {currentCategoryObj.formulas.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-800/50 hover:bg-slate-800 border border-white/10 flex items-center justify-between transition-all group"
              >
                <div>
                  <h4 className="text-xs font-bold text-purple-300">{item.name}</h4>
                  <div className="text-sm font-mono font-bold text-white mt-1 bg-slate-950/40 px-3 py-1.5 rounded-lg border border-white/5">
                    {item.preview}
                  </div>
                </div>

                <button
                  onClick={() => handlePlaceFormulaCard(item)}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Insert</span>
                </button>
              </div>
            ))}
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-white/10 bg-slate-950/70 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}
