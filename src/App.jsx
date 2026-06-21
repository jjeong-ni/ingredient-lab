import { useState, useMemo } from 'react';
import { ingredients, CATEGORIES } from './data/ingredients';
import IngredientCard from './components/IngredientCard';
import LabPanel from './components/LabPanel';

const NAV = [
  { id: 'dictionary', label: '성분사전', icon: (active) => (
    <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="3" stroke={active ? '#4B9EFF' : '#9CA3AF'} strokeWidth="2"/>
      <path d="M7 8h10M7 12h10M7 16h6" stroke={active ? '#4B9EFF' : '#9CA3AF'} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )},
  { id: 'lab', label: '실험실', icon: (active) => (
    <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
      <path d="M9 3h6M10 3v6l-4 8a2 2 0 001.8 2.9h8.4A2 2 0 0018 17l-4-8V3" stroke={active ? '#4B9EFF' : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )},
  { id: 'search', label: '검색', icon: (active) => (
    <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="7" stroke={active ? '#4B9EFF' : '#9CA3AF'} strokeWidth="2"/>
      <path d="M16.5 16.5L21 21" stroke={active ? '#4B9EFF' : '#9CA3AF'} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )},
];

export default function App() {
  const [tab, setTab] = useState('dictionary');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [labSelected, setLabSelected] = useState([]);
  const [labSearch, setLabSearch] = useState('');

  const filtered = useMemo(() => {
    return ingredients.filter((ing) => {
      const q = search.trim();
      const matchSearch =
        !q ||
        ing.name.includes(q) ||
        ing.nameEn.toLowerCase().includes(q.toLowerCase()) ||
        ing.painPoints.some((p) => p.includes(q)) ||
        ing.tags.some((t) => t.includes(q));
      const matchCat = categoryFilter === 'all' || ing.category === categoryFilter;
      return matchSearch && matchCat;
    });
  }, [search, categoryFilter]);

  const handleLabToggle = (ing) => {
    setLabSelected((prev) =>
      prev.includes(ing.id) ? prev.filter((i) => i !== ing.id) : [...prev, ing.id]
    );
  };

  const handleLabAdd = (id) => {
    setLabSelected((prev) => prev.includes(id) ? prev : [...prev, id]);
  };

  const handleLabRemove = (id) => {
    setLabSelected((prev) => prev.filter((i) => i !== id));
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#EEF3FA' }}>
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-base font-bold shadow-sm"
              style={{ background: 'linear-gradient(135deg, #4B9EFF 0%, #3B7DD8 100%)' }}>
              🧬
            </div>
            <span className="font-bold text-gray-900 text-lg tracking-tight">성분 LAB</span>
          </div>
          {tab === 'lab' && labSelected.length > 0 && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full text-white"
              style={{ background: '#4B9EFF' }}>
              {labSelected.length}개 선택됨
            </span>
          )}
        </div>
      </header>

      {/* 알림 배너 */}
      <div className="mx-3 mt-3 rounded-2xl px-4 py-3 flex items-center gap-3 text-white text-sm font-medium"
        style={{ background: 'linear-gradient(90deg, #4B9EFF 0%, #6B7FFF 100%)' }}>
        <span className="text-lg">🌿</span>
        <span className="flex-1">오늘의 추천 조합: 히알루론산 + 세라마이드</span>
        <span className="opacity-70">›</span>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-hidden px-3 py-4">

        {/* 성분 사전 탭 */}
        {tab === 'dictionary' && (
          <div className="space-y-4">
            {/* 검색 */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base">🔍</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="성분명, 효능, 페인포인트로 검색..."
                className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl text-sm shadow-sm border-0 outline-none focus:ring-2 focus:ring-blue-200"
                style={{ boxShadow: '0 2px 12px rgba(75,158,255,0.08)' }}
              />
            </div>

            {/* 카테고리 필터 */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              <button
                onClick={() => setCategoryFilter('all')}
                className="px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0"
                style={categoryFilter === 'all'
                  ? { background: '#4B9EFF', color: 'white', boxShadow: '0 4px 12px rgba(75,158,255,0.3)' }
                  : { background: 'white', color: '#6B7280' }}
              >
                전체
              </button>
              {Object.entries(CATEGORIES).map(([key, cat]) => (
                <button
                  key={key}
                  onClick={() => setCategoryFilter(key)}
                  className="px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0"
                  style={categoryFilter === key
                    ? { background: cat.color, color: 'white', boxShadow: `0 4px 12px ${cat.color}50` }
                    : { background: 'white', color: cat.color }}
                >
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>

            <p className="text-xs text-gray-400 px-1">총 {filtered.length}가지 성분</p>

            {/* 카드 목록 */}
            <div className="space-y-3">
              {filtered.map((ing) => (
                <IngredientCard
                  key={ing.id}
                  ingredient={ing}
                  onClick={setSelectedDetail}
                  inLab={labSelected.includes(ing.id)}
                  onLabToggle={handleLabToggle}
                />
              ))}
              {filtered.length === 0 && (
                <div className="text-center py-16 bg-white rounded-3xl">
                  <p className="text-4xl mb-3">🔬</p>
                  <p className="text-gray-500 font-medium">검색 결과가 없어요</p>
                  <p className="text-gray-400 text-sm mt-1">다른 키워드로 검색해보세요</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 검색 탭 */}
        {tab === 'search' && (
          <div className="space-y-4">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base">🔍</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="어떤 피부 고민이 있으신가요?"
                className="w-full pl-10 pr-4 py-3.5 bg-white rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-200"
                style={{ boxShadow: '0 2px 12px rgba(75,158,255,0.08)' }}
                autoFocus
              />
            </div>
            {/* 인기 검색어 */}
            {!search && (
              <div className="bg-white rounded-3xl p-4" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
                <p className="text-sm font-bold text-gray-700 mb-3">🔥 인기 검색어</p>
                <div className="flex flex-wrap gap-2">
                  {['보습', '미백', '주름', '여드름', '모공', '진정', '각질', '탄력'].map((kw) => (
                    <button key={kw} onClick={() => setSearch(kw)}
                      className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                      {kw}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="space-y-3">
              {search && filtered.map((ing) => (
                <IngredientCard
                  key={ing.id}
                  ingredient={ing}
                  onClick={setSelectedDetail}
                  inLab={labSelected.includes(ing.id)}
                  onLabToggle={handleLabToggle}
                  compact
                />
              ))}
            </div>
          </div>
        )}

        {/* 실험실 탭 */}
        {tab === 'lab' && (
          <div className="space-y-4">
            {/* 성분 선택 영역 */}
            <div className="bg-white rounded-3xl p-4" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
              <div className="flex items-center justify-between mb-3">
                <p className="font-bold text-gray-800 text-sm">📦 선택한 성분</p>
                {labSelected.length > 0 && (
                  <button onClick={() => setLabSelected([])}
                    className="text-xs text-gray-400 hover:text-red-400 transition-colors">
                    전체 초기화
                  </button>
                )}
              </div>
              {labSelected.length === 0 ? (
                <div className="text-center py-5">
                  <p className="text-3xl mb-2">🧪</p>
                  <p className="text-gray-400 text-sm">아래에서 성분을 추가하세요</p>
                  <p className="text-gray-300 text-xs mt-1">개수 제한 없이 조합할 수 있어요</p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {labSelected.map((id) => {
                    const ing = ingredients.find((i) => i.id === id);
                    if (!ing) return null;
                    const cat = CATEGORIES[ing.category];
                    return (
                      <button key={id} onClick={() => handleLabRemove(id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all active:scale-95"
                        style={{ background: cat.bg, color: cat.color, border: `1.5px solid ${cat.color}30` }}>
                        <span>{ing.emoji}</span>
                        <span>{ing.name}</span>
                        <span className="text-xs opacity-50">✕</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 조합 결과 */}
            {labSelected.length >= 2 && (
              <LabPanel
                selectedIds={labSelected}
                onAdd={handleLabAdd}
                onRemove={handleLabRemove}
              />
            )}

            {/* 성분 추가 선택 */}
            <div className="bg-white rounded-3xl p-4" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
              <p className="font-bold text-gray-800 text-sm mb-3">➕ 성분 추가하기</p>
              <div className="relative mb-3">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
                <input
                  type="text"
                  value={labSearch}
                  onChange={(e) => setLabSearch(e.target.value)}
                  placeholder="성분 검색..."
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-50 rounded-xl text-sm outline-none"
                />
              </div>
              <div className="space-y-2 max-h-72 overflow-y-auto pr-0.5">
                {ingredients
                  .filter((ing) =>
                    !labSearch ||
                    ing.name.includes(labSearch) ||
                    ing.nameEn.toLowerCase().includes(labSearch.toLowerCase())
                  )
                  .map((ing) => {
                    const cat = CATEGORIES[ing.category];
                    const selected = labSelected.includes(ing.id);
                    return (
                      <button key={ing.id} onClick={() => handleLabToggle(ing)}
                        className="w-full flex items-center gap-3 p-3 rounded-2xl transition-all active:scale-98 text-left"
                        style={{
                          background: selected ? cat.bg : '#F9FAFB',
                          border: selected ? `1.5px solid ${cat.color}40` : '1.5px solid transparent',
                        }}>
                        <span className="text-xl flex-shrink-0">{ing.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-gray-800 truncate">{ing.name}</p>
                          <span className="text-xs font-medium" style={{ color: cat.color }}>
                            {cat.icon} {cat.label}
                          </span>
                        </div>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                          selected ? 'text-white' : 'bg-gray-200 text-gray-400'
                        }`} style={selected ? { background: cat.color } : {}}>
                          {selected ? '✓' : '+'}
                        </div>
                      </button>
                    );
                  })}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 하단 탭바 */}
      <nav className="sticky bottom-0 bg-white border-t border-gray-100 z-30"
        style={{ boxShadow: '0 -4px 20px rgba(0,0,0,0.06)' }}>
        <div className="flex">
          {NAV.map((n) => {
            const active = tab === n.id;
            return (
              <button key={n.id} onClick={() => setTab(n.id)}
                className="flex-1 flex flex-col items-center gap-1 py-3 transition-all active:scale-95">
                {n.icon(active)}
                <span className="text-xs font-semibold" style={{ color: active ? '#4B9EFF' : '#9CA3AF' }}>
                  {n.label}
                </span>
                {active && (
                  <div className="absolute bottom-1 w-1 h-1 rounded-full" style={{ background: '#4B9EFF' }} />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* 상세 모달 (바텀시트 스타일) */}
      {selectedDetail && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end"
          style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
          onClick={() => setSelectedDetail(null)}>
          <div className="bg-white rounded-t-3xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}>
            {/* 핸들 */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-gray-200" />
            </div>
            <IngredientCard ingredient={selectedDetail} modal />
            <div className="px-4 pb-8 pt-2 flex gap-2">
              <button
                onClick={() => { handleLabToggle(selectedDetail); setSelectedDetail(null); setTab('lab'); }}
                className="flex-1 py-3.5 rounded-2xl text-white font-bold text-sm transition-all active:scale-95"
                style={{ background: labSelected.includes(selectedDetail.id)
                  ? '#EF4444'
                  : 'linear-gradient(135deg, #4B9EFF 0%, #3B7DD8 100%)',
                  boxShadow: '0 4px 16px rgba(75,158,255,0.35)' }}>
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
