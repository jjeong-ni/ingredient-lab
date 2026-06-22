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
          stroke={active ? '#4B9EFF' : '#9CA3AF'} strokeWidth="2" />
        <path d="M7 8h10M7 12h10M7 16h6"
          stroke={active ? '#4B9EFF' : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'lab', label: '실험실',
    icon: (active) => (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <path d="M9 3h6M10 3v6l-4 8a2 2 0 001.8 2.9h8.4A2 2 0 0018 17l-4-8V3"
          stroke={active ? '#4B9EFF' : '#9CA3AF'} strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function App() {
  const [tab, setTab] = useState('dict');
  const [showOnboarding, setShowOnboarding] = useState(false);

  // 실험실에 추가된 성분 ID 세트 (DictTab ↔ LabTab 공유)
  const [labIngredientIds, setLabIngredientIds] = useState(new Set());

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

  return (
    <div className="min-h-screen" style={{ background: '#F8FAFC', fontFamily: "'Pretendard', 'Apple SD Gothic Neo', sans-serif" }}>
      <div className="max-w-[480px] mx-auto min-h-screen flex flex-col">
        {/* 상단 헤더 */}
        <header className="flex items-center justify-between px-4 pt-4 pb-2 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧪</span>
            <span className="font-extrabold text-gray-900 text-lg">성분 LAB</span>
          </div>
          <span className="text-xs text-gray-400 font-medium">
            {tab === 'dict' ? '성분 사전' : '실험실'}
          </span>
        </header>

        {/* 탭 콘텐츠 */}
        <main className="flex-1 overflow-y-auto pb-20">
          {tab === 'dict' && (
            <DictTab labIds={labIngredientIds} onLabToggle={handleLabToggle} />
          )}
          {tab === 'lab' && (
            <LabTab />
          )}
        </main>

        {/* 하단 네비바 */}
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white z-30"
          style={{ borderTop: '1px solid #F3F4F6', boxShadow: '0 -2px 20px rgba(0,0,0,0.06)' }}>
          <div className="flex">
            {NAV.map((n) => {
              const active = tab === n.id;
              return (
                <button key={n.id} onClick={() => setTab(n.id)}
                  className="flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 relative">
                  {active && (
                    <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-[#4B9EFF]" />
                  )}
                  {n.icon(active)}
                  <span className={`text-[10px] font-bold ${active ? 'text-[#4B9EFF]' : 'text-gray-400'}`}>
                    {n.label}
                  </span>
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
