import { useState, useMemo, useCallback } from 'react';
import { ingredients, CATEGORIES } from './data/ingredients';
import IngredientCard from './components/IngredientCard';
import LabPanel from './components/LabPanel';
import OnboardingModal from './components/OnboardingModal';
import { useEffect } from 'react';

const PAGE_SIZE = 30;

const NAV = [
  {
    id: 'dictionary', label: '성분사전',
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
  {
    id: 'search', label: '검색',
    icon: (active) => (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="7" stroke={active ? '#4B9EFF' : '#9CA3AF'} strokeWidth="2" />
        <path d="M16.5 16.5L21 21" stroke={active ? '#4B9EFF' : '#9CA3AF'}
          strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function App() {
  const [tab, setTab] = useState('dictionary');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [labSelected, setLabSelected] = useState([]);
  const [labSearch, setLabSearch] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!localStorage.getItem('ingredient-lab-visited')) setShowOnboarding(true);
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ingredients.filter((ing) => {
      const matchSearch =
        !q ||
        ing.name.includes(search.trim()) ||
        (ing.nameEn || '').toLowerCase().includes(q) ||
        ing.painPoints.some((p) => p.includes(search.trim())) ||
        (ing.tags || []).some((t) => t.includes(search.trim()));
      const matchCat = categoryFilter === 'all' || ing.category === categoryFilter;
      return matchSearch && matchCat;
    });
  }, [search, categoryFilter]);

  // 필터 바뀌면 페이지 리셋
  useEffect(() => { setPage(1); }, [search, categoryFilter]);

  const visibleIngredients = useMemo(() => filtered.slice(0, page * PAGE_SIZE), [filtered, page]);
  const hasMore = visibleIngredients.length < filtered.length;

  const handleLabToggle = useCallback((ing) => {
    setLabSelected((prev) =>
      prev.includes(ing.id) ? prev.filter((i) => i !== ing.id) : [...prev, ing.id]
    );
  }, []);

  const handleLabAdd = useCallback((id) => {
    setLabSelected((prev) => prev.includes(id) ? prev : [...prev, id]);
  }, []);

  const handleLabRemove = useCallback((id) => {
    setLabSelected((prev) => prev.filter((i) => i !== id));
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#EEF3FA' }}>

      {/* ── 헤더 ── */}
      <header className="sticky top-0 z-30 bg-white" style={{ boxShadow: '0 1px 0 #E5E7EB' }}>
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold shadow-sm"
              style={{ background: 'linear-gradient(135deg, #4B9EFF, #3B7DD8)' }}>
              🧬
            </div>
            <span className="font-extrabold text-gray-900 text-[17px] tracking-tight">성분 LAB</span>
          </div>
          {tab === 'lab' && labSelected.length > 0 && (
            <span className="text-xs font-bold px-2.5 py-1 rounded-full text-white"
              style={{ background: '#4B9EFF' }}>
              {labSelected.length}개 선택
            </span>
          )}
          {tab === 'dictionary' && (
            <span className="text-xs text-gray-400 font-medium">{filtered.length}종</span>
          )}
        </div>
      </header>

      {/* ── 배너 ── */}
      <div className="mx-3 mt-3 rounded-2xl px-4 py-2.5 flex items-center gap-2.5 text-white text-xs font-semibold"
        style={{ background: 'linear-gradient(90deg, #4B9EFF 0%, #6B7FFF 100%)' }}>
        <span className="text-base">✨</span>
        <span className="flex-1">오늘의 추천: 히알루론산 + 세라마이드 + 판테놀</span>
        <span className="opacity-60 text-sm">›</span>
      </div>

      {/* ── 메인 ── */}
      <main className="flex-1 px-3 py-4 pb-24 space-y-4 overflow-y-auto">

        {/* ══ 성분사전 탭 ══ */}
        {tab === 'dictionary' && (
          <>
            {/* 검색 */}
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
              <input
                type="text" value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="성분명, 효능, 페인포인트 검색..."
                className="w-full pl-9 pr-4 py-3 bg-white rounded-2xl text-sm border-0 outline-none focus:ring-2 focus:ring-blue-200"
                style={{ boxShadow: '0 1px 8px rgba(75,158,255,0.08)' }}
              />
              {search && (
                <button onClick={() => setSearch('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 text-base leading-none">
                  ✕
                </button>
              )}
            </div>

            {/* ── 카테고리 필터 ── */}
            <CategoryFilter value={categoryFilter} onChange={setCategoryFilter} />

            {/* 카드 목록 */}
            <div className="space-y-2.5">
              {visibleIngredients.map((ing) => (
                <IngredientCard
                  key={ing.id}
                  ingredient={ing}
                  onClick={setSelectedDetail}
                  inLab={labSelected.includes(ing.id)}
                  onLabToggle={handleLabToggle}
                />
              ))}
              {filtered.length === 0 && (
                <div className="text-center py-16 bg-white rounded-2xl">
                  <p className="text-4xl mb-3">🔬</p>
                  <p className="text-gray-500 font-semibold">검색 결과가 없어요</p>
                  <p className="text-gray-400 text-sm mt-1">다른 키워드로 검색해보세요</p>
                </div>
              )}
              {hasMore && (
                <button
                  onClick={() => setPage((p) => p + 1)}
                  className="w-full py-3 bg-white rounded-2xl text-sm font-bold text-blue-500 transition-all active:scale-[0.98]"
                  style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
                  더보기 ({filtered.length - visibleIngredients.length}개 더)
                </button>
              )}
            </div>
          </>
        )}

        {/* ══ 검색 탭 ══ */}
        {tab === 'search' && (
          <>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
              <input
                type="text" value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="어떤 피부 고민이 있으신가요?"
                className="w-full pl-9 pr-4 py-3.5 bg-white rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-200"
                style={{ boxShadow: '0 1px 8px rgba(75,158,255,0.08)' }}
                autoFocus
              />
            </div>

            {!search && (
              <div className="bg-white rounded-2xl p-4" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
                <p className="text-sm font-bold text-gray-700 mb-3">🔥 인기 검색어</p>
                <div className="flex flex-wrap gap-2">
                  {['보습','미백','주름','여드름','모공','진정','각질','탄력','항산화','발효'].map((kw) => (
                    <button key={kw} onClick={() => setSearch(kw)}
                      className="px-3 py-1.5 bg-blue-50 text-blue-500 rounded-full text-xs font-semibold">
                      {kw}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {search && (
              <>
                <p className="text-xs text-gray-400 px-1">"{search}" 검색 결과 {filtered.length}개</p>
                <div className="space-y-2.5">
                  {filtered.slice(0, 50).map((ing) => (
                    <IngredientCard key={ing.id} ingredient={ing}
                      onClick={setSelectedDetail}
                      inLab={labSelected.includes(ing.id)}
                      onLabToggle={handleLabToggle} />
                  ))}
                  {filtered.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-2xl">
                      <p className="text-3xl mb-2">🤔</p>
                      <p className="text-gray-500 text-sm">검색 결과가 없어요</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        )}

        {/* ══ 실험실 탭 ══ */}
        {tab === 'lab' && (
          <>
            {/* 선택된 성분 */}
            <div className="bg-white rounded-2xl p-4" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
              <div className="flex items-center justify-between mb-3">
                <p className="font-bold text-gray-800 text-sm">📦 선택한 성분</p>
                {labSelected.length > 0 && (
                  <button onClick={() => setLabSelected([])}
                    className="text-xs text-gray-400 font-medium">
                    전체 초기화
                  </button>
                )}
              </div>
              {labSelected.length === 0 ? (
                <div className="text-center py-5">
                  <p className="text-3xl mb-2">🧪</p>
                  <p className="text-gray-400 text-sm">아래에서 성분을 추가하세요</p>
                  <p className="text-gray-300 text-xs mt-1">무제한으로 조합 가능</p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {labSelected.map((id) => {
                    const ing = ingredients.find((i) => i.id === id);
                    if (!ing) return null;
                    const cat = CATEGORIES[ing.category] || {};
                    return (
                      <button key={id} onClick={() => handleLabRemove(id)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95"
                        style={{ background: cat.bg, color: cat.color, border: `1.5px solid ${cat.color}30` }}>
                        <span>{ing.emoji}</span>
                        <span>{ing.name}</span>
                        <span className="opacity-40 text-[10px]">✕</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 조합 결과 */}
            {labSelected.length >= 2 && (
              <LabPanel selectedIds={labSelected} onAdd={handleLabAdd} onRemove={handleLabRemove} />
            )}

            {/* 성분 추가 영역 */}
            <div className="bg-white rounded-2xl p-4" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
              <p className="font-bold text-gray-800 text-sm mb-3">➕ 성분 추가</p>
              <div className="relative mb-3">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">🔍</span>
                <input type="text" value={labSearch}
                  onChange={(e) => setLabSearch(e.target.value)}
                  placeholder="성분 검색..."
                  className="w-full pl-8 pr-3 py-2.5 bg-gray-50 rounded-xl text-sm outline-none" />
              </div>
              <div className="space-y-1.5 max-h-72 overflow-y-auto">
                {ingredients
                  .filter((ing) =>
                    !labSearch ||
                    ing.name.includes(labSearch) ||
                    (ing.nameEn || '').toLowerCase().includes(labSearch.toLowerCase())
                  )
                  .map((ing) => {
                    const cat = CATEGORIES[ing.category] || {};
                    const selected = labSelected.includes(ing.id);
                    return (
                      <button key={ing.id} onClick={() => handleLabToggle(ing)}
                        className="w-full flex items-center gap-2.5 p-2.5 rounded-xl transition-all active:scale-[0.98] text-left"
                        style={{
                          background: selected ? cat.bg : '#F9FAFB',
                          border: selected ? `1.5px solid ${cat.color}40` : '1.5px solid transparent',
                        }}>
                        <span className="text-lg flex-shrink-0">{ing.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-gray-800 truncate">{ing.name}</p>
                          <p className="text-[11px] truncate" style={{ color: cat.color }}>
                            {cat.icon} {cat.label}
                          </p>
                        </div>
                        <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold transition-all"
                          style={selected
                            ? { background: cat.color, color: 'white' }
                            : { background: '#E5E7EB', color: '#9CA3AF' }}>
                          {selected ? '✓' : '+'}
                        </div>
                      </button>
                    );
                  })}
              </div>
            </div>
          </>
        )}
      </main>

      {/* ── 하단 탭바 ── */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white z-30"
        style={{ boxShadow: '0 -1px 0 #E5E7EB, 0 -4px 16px rgba(0,0,0,0.05)' }}>
        <div className="flex">
          {NAV.map((n) => {
            const active = tab === n.id;
            return (
              <button key={n.id} onClick={() => setTab(n.id)}
                className="flex-1 flex flex-col items-center gap-1 py-2.5 relative transition-all active:scale-95">
                {active && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
                    style={{ background: '#4B9EFF' }} />
                )}
                {n.icon(active)}
                <span className="text-[11px] font-semibold"
                  style={{ color: active ? '#4B9EFF' : '#9CA3AF' }}>
                  {n.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* ── 온보딩 ── */}
      {showOnboarding && (
        <OnboardingModal onClose={() => {
          localStorage.setItem('ingredient-lab-visited', '1');
          setShowOnboarding(false);
        }} />
      )}

      {/* ── 상세 바텀시트 ── */}
      {selectedDetail && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end"
          style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
          onClick={() => setSelectedDetail(null)}>
          <div className="bg-white rounded-t-3xl max-h-[90vh] overflow-y-auto"
            style={{ maxWidth: 480, margin: '0 auto', width: '100%' }}
            onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-gray-200" />
            </div>
            <IngredientCard ingredient={selectedDetail} modal />
            <div className="px-4 pb-8 pt-2 flex gap-2">
              <button
                onClick={() => { handleLabToggle(selectedDetail); setSelectedDetail(null); setTab('lab'); }}
                className="flex-1 py-3.5 rounded-2xl text-white font-bold text-sm transition-all active:scale-95"
                style={{
                  background: labSelected.includes(selectedDetail.id)
                    ? '#EF4444'
                    : 'linear-gradient(135deg, #4B9EFF 0%, #3B7DD8 100%)',
                  boxShadow: '0 4px 16px rgba(75,158,255,0.3)',
                }}>
                {labSelected.includes(selectedDetail.id) ? '⚗️ 실험실에서 제거' : '⚗️ 실험실에 추가'}
              </button>
              <button onClick={() => setSelectedDetail(null)}
                className="px-5 py-3.5 rounded-2xl bg-gray-100 text-gray-600 font-bold text-sm">
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── 카테고리 필터 컴포넌트 ── */
function CategoryFilter({ value, onChange }) {
  return (
    /* 전체 + 20개 카테고리를 4열 그리드에 통합 */
    <div className="grid grid-cols-4 gap-1.5">
      {/* 전체 — span 2 열로 눈에 띄게 */}
      <button
        onClick={() => onChange('all')}
        className="col-span-2 flex items-center justify-center gap-1.5 py-2 rounded-xl font-bold text-xs transition-all active:scale-95"
        style={value === 'all'
          ? { background: '#4B9EFF', color: 'white', boxShadow: '0 2px 8px rgba(75,158,255,0.3)' }
          : { background: 'white', color: '#6B7280', border: '1.5px solid #E5E7EB' }}>
        <span className="text-sm">🔍</span>
        <span>전체 보기</span>
      </button>

      {/* 나머지 2 빈칸 채우기 (3·4열) — 인기 카테고리 2개 빠르게 */}
      {['moisturizing', 'brightening'].map((key) => {
        const cat = CATEGORIES[key];
        const active = value === key;
        return (
          <button key={key}
            onClick={() => onChange(active ? 'all' : key)}
            className="flex flex-col items-center gap-0.5 py-2 px-1 rounded-xl text-center transition-all active:scale-95"
            style={active
              ? { background: cat.color, color: 'white', boxShadow: `0 2px 8px ${cat.color}50` }
              : { background: 'white', color: cat.color, border: '1.5px solid #E5E7EB' }}>
            <span className="text-base leading-none">{cat.icon}</span>
            <span className="text-[10px] font-bold leading-tight">{cat.label}</span>
          </button>
        );
      })}

      {/* 나머지 18개 카테고리 */}
      {Object.entries(CATEGORIES)
        .filter(([key]) => key !== 'moisturizing' && key !== 'brightening')
        .map(([key, cat]) => {
          const active = value === key;
          return (
            <button
              key={key}
              onClick={() => onChange(active ? 'all' : key)}
              className="flex flex-col items-center gap-0.5 py-2 px-1 rounded-xl text-center transition-all active:scale-95"
              style={active
                ? { background: cat.color, color: 'white', boxShadow: `0 2px 8px ${cat.color}50` }
                : { background: 'white', color: cat.color, border: '1.5px solid #E5E7EB' }}>
              <span className="text-base leading-none">{cat.icon}</span>
              <span className="text-[10px] font-bold leading-tight">{cat.label}</span>
            </button>
          );
        })}
    </div>
  );
}
