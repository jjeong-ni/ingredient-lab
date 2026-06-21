import { useState, useMemo } from 'react';
import { ingredients, CATEGORIES } from './data/ingredients';
import IngredientCard from './components/IngredientCard';
import LabPanel from './components/LabPanel';

const TABS = [
  { id: 'dictionary', label: '성분 사전', icon: '📖' },
  { id: 'lab', label: '성분 실험실', icon: '⚗️' },
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
      const matchSearch =
        !search ||
        ing.name.includes(search) ||
        ing.nameEn.toLowerCase().includes(search.toLowerCase()) ||
        ing.painPoints.some((p) => p.includes(search)) ||
        ing.tags.some((t) => t.includes(search));
      const matchCat = categoryFilter === 'all' || ing.category === categoryFilter;
      return matchSearch && matchCat;
    });
  }, [search, categoryFilter]);

  const handleLabToggle = (ing) => {
    setLabSelected((prev) => {
      if (prev.includes(ing.id)) return prev.filter((i) => i !== ing.id);
      if (prev.length >= 5) return prev;
      return [...prev, ing.id];
    });
  };

  const handleLabAdd = (id) => {
    setLabSelected((prev) => {
      if (prev.includes(id) || prev.length >= 5) return prev;
      return [...prev, id];
    });
  };

  const handleLabRemove = (id) => {
    setLabSelected((prev) => prev.filter((i) => i !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#faf8f5] to-[#f0ede8]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-pink-400 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow">
              🧬
            </div>
            <div>
              <h1 className="font-bold text-gray-900 text-lg leading-none">성분 LAB</h1>
              <p className="text-xs text-gray-400">화장품 성분 사전 · 실험실</p>
            </div>
          </div>
          <nav className="flex gap-1 bg-gray-100 rounded-xl p-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  tab === t.id
                    ? 'bg-white text-violet-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* DICTIONARY TAB */}
        {tab === 'dictionary' && (
          <div>
            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="성분명, 영문명, 페인포인트 검색..."
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                <button
                  onClick={() => setCategoryFilter('all')}
                  className={`px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                    categoryFilter === 'all'
                      ? 'bg-violet-600 text-white shadow'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-violet-300'
                  }`}
                >
                  전체
                </button>
                {Object.entries(CATEGORIES).map(([key, cat]) => (
                  <button
                    key={key}
                    onClick={() => setCategoryFilter(key)}
                    className={`px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                      categoryFilter === key
                        ? 'shadow-sm'
                        : 'bg-white border border-gray-200 hover:border-gray-300'
                    }`}
                    style={
                      categoryFilter === key
                        ? { background: cat.color, color: 'white' }
                        : { color: cat.color }
                    }
                  >
                    {cat.icon} {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-sm text-gray-400 mb-4">{filtered.length}개 성분</p>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((ing) => (
                <IngredientCard
                  key={ing.id}
                  ingredient={ing}
                  onClick={setSelectedDetail}
                />
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-16">
                <p className="text-4xl mb-3">🔬</p>
                <p className="text-gray-500">검색 결과가 없습니다.</p>
              </div>
            )}
          </div>
        )}

        {/* LAB TAB */}
        {tab === 'lab' && (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left: ingredient picker */}
            <div className="lg:w-80 xl:w-96 flex-shrink-0">
              <div className="bg-white rounded-2xl border border-gray-100 p-4 sticky top-20">
                <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span>📦</span> 성분 선택
                  <span className="ml-auto text-xs text-gray-400 font-normal">최대 5개</span>
                </h2>
                <div className="relative mb-3">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
                  <input
                    type="text"
                    value={labSearch}
                    onChange={(e) => setLabSearch(e.target.value)}
                    placeholder="성분 검색..."
                    className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-violet-400"
                  />
                </div>
                <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
                  {ingredients
                    .filter((ing) =>
                      !labSearch ||
                      ing.name.includes(labSearch) ||
                      ing.nameEn.toLowerCase().includes(labSearch.toLowerCase())
                    )
                    .map((ing) => (
                      <IngredientCard
                        key={ing.id}
                        ingredient={ing}
                        compact
                        selected={labSelected.includes(ing.id)}
                        onClick={handleLabToggle}
                      />
                    ))}
                </div>
              </div>
            </div>

            {/* Right: lab results */}
            <div className="flex-1">
              <LabPanel
                selectedIds={labSelected}
                onAdd={handleLabAdd}
                onRemove={handleLabRemove}
              />
            </div>
          </div>
        )}
      </main>

      {/* Detail Modal */}
      {selectedDetail && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedDetail(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-1">
              <IngredientCard ingredient={selectedDetail} />
            </div>
            <div className="px-5 pb-5 flex gap-2">
              <button
                onClick={() => {
                  setTab('lab');
                  handleLabToggle(selectedDetail);
                  setSelectedDetail(null);
                }}
                disabled={labSelected.length >= 5 && !labSelected.includes(selectedDetail.id)}
                className="flex-1 bg-violet-600 text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-violet-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {labSelected.includes(selectedDetail.id) ? '실험실에서 제거' : '⚗️ 실험실에 추가'}
              </button>
              <button
                onClick={() => setSelectedDetail(null)}
                className="px-4 bg-gray-100 text-gray-600 rounded-xl py-2.5 text-sm font-semibold hover:bg-gray-200 transition"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
