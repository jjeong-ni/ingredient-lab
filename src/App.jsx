import { useState, useCallback, useEffect } from 'react';
import DictTab from './components/DictTab';
import LabTab from './components/LabTab';
import OnboardingModal from './components/OnboardingModal';

const NAV = [
  {
    id: 'dict', label: '성분사전',
    icon: (active) => (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="3"
          stroke={active ? '#7B9EFF' : '#b4b4cc'} strokeWidth="2" />
        <path d="M7 8h10M7 12h10M7 16h6"
          stroke={active ? '#7B9EFF' : '#b4b4cc'} strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'lab', label: '실험실',
    icon: (active) => (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <path d="M9 3h6M10 3v6l-4 8a2 2 0 001.8 2.9h8.4A2 2 0 0018 17l-4-8V3"
          stroke={active ? '#C084FC' : '#b4b4cc'} strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function App() {
  const [tab, setTab] = useState('dict');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [labIngredientIds, setLabIngredientIds] = useState(new Set());
  const [favorites, setFavorites] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('favorites') || '[]')); }
    catch { return new Set(); }
  });
  const [savedFormulas, setSavedFormulas] = useState(() => {
    try { return JSON.parse(localStorage.getItem('savedFormulas') || '[]'); }
    catch { return []; }
  });

  useEffect(() => {
    const seen = localStorage.getItem('seenOnboarding');
    if (!seen) setShowOnboarding(true);
  }, []);

  const handleLabToggle = useCallback((ingredient) => {
    setLabIngredientIds((prev) => {
      const next = new Set(prev);
      if (next.has(ingredient.id)) next.delete(ingredient.id);
      else next.add(ingredient.id);
      return next;
    });
  }, []);

  const handleFavoriteToggle = useCallback((ingredient) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(ingredient.id)) next.delete(ingredient.id);
      else next.add(ingredient.id);
      localStorage.setItem('favorites', JSON.stringify([...next]));
      return next;
    });
  }, []);

  const handleSaveFormula = useCallback((formula) => {
    setSavedFormulas(prev => {
      const next = [...prev, formula];
      localStorage.setItem('savedFormulas', JSON.stringify(next));
      return next;
    });
  }, []);

  const handleDeleteFormula = useCallback((id) => {
    setSavedFormulas(prev => {
      const next = prev.filter(f => f.id !== id);
      localStorage.setItem('savedFormulas', JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Pretendard', 'Apple SD Gothic Neo', sans-serif" }}>
      <div className="max-w-[480px] mx-auto min-h-screen flex flex-col">
        <header className="flex-shrink-0 px-5 pt-5 pb-3 flex items-center justify-between"
          style={{
            background: 'rgba(255,255,255,0.62)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255,255,255,0.85)',
          }}>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧪</span>
            <span className="font-extrabold tracking-tight" style={{ color: '#2d2d4e', fontSize: 18 }}>성분 LAB</span>
          </div>
          <span className="text-xs font-semibold" style={{ color: '#9999bb' }}>
            {tab === 'dict' ? '성분 사전' : '실험실'}
          </span>
        </header>

        <main className="flex-1 overflow-y-auto pb-20">
          {tab === 'dict' && (
            <DictTab
              labIds={labIngredientIds}
              onLabToggle={handleLabToggle}
              favorites={favorites}
              onFavoriteToggle={handleFavoriteToggle}
            />
          )}
          {tab === 'lab' && (
            <LabTab
              savedFormulas={savedFormulas}
              onSaveFormula={handleSaveFormula}
              onDeleteFormula={handleDeleteFormula}
              labDictIds={labIngredientIds}
            />
          )}
        </main>

        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-30"
          style={{
            background: 'rgba(255,255,255,0.78)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(255,255,255,0.92)',
            boxShadow: '0 -4px 24px rgba(120,120,180,0.10)',
          }}>
          <div className="flex">
            {NAV.map((n) => {
              const active = tab === n.id;
              const accent = n.id === 'dict' ? '#7B9EFF' : '#C084FC';
              return (
                <button key={n.id} onClick={() => setTab(n.id)}
                  className="flex-1 flex flex-col items-center justify-center py-3 gap-0.5 relative">
                  {active && (
                    <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
                      style={{ background: accent }} />
                  )}
                  {n.icon(active)}
                  <span className="text-[10px] font-bold" style={{ color: active ? accent : '#b4b4cc' }}>
                    {n.label}
                  </span>
                  {n.id === 'lab' && labIngredientIds.size > 0 && (
                    <span className="absolute top-1.5 right-8 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                      style={{ background: '#C084FC' }}>
                      {labIngredientIds.size}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {showOnboarding && (
          <OnboardingModal onClose={() => { setShowOnboarding(false); localStorage.setItem('seenOnboarding', '1'); }} />
        )}
      </div>
    </div>
  );
}
