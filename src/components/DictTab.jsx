import { useState, useMemo } from 'react';
import { ingredients, CATEGORIES } from '../data/ingredients';
import IngredientCard from './IngredientCard';

const PAGE_SIZE = 60;

function countByCategory() {
  const map = {};
  ingredients.forEach((i) => {
    map[i.category] = (map[i.category] || 0) + 1;
  });
  return map;
}

const categoryCounts = countByCategory();

/* ─── 홈: 카테고리 그리드 ─── */
function DictHome({ onSelectCategory, onAllClick }) {
  return (
    <div className="px-4 pt-2 pb-4">
      {/* 헤더 배너 */}
      <div className="rounded-2xl p-4 mb-4 flex items-center gap-3"
        style={{ background: 'linear-gradient(135deg,#4B9EFF 0%,#7C3AED 100%)' }}>
        <span className="text-3xl">🧪</span>
        <div>
          <p className="font-extrabold text-white text-base leading-tight">성분 사전</p>
          <p className="text-white/70 text-xs mt-0.5">{ingredients.length}종의 화장품 원료 정보</p>
        </div>
      </div>

      {/* 전체 보기 버튼 */}
      <button
        onClick={onAllClick}
        className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl bg-white mb-3 transition-all active:scale-[0.98]"
        style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.08)', border: '1.5px solid #E5E7EB' }}>
        <div className="flex items-center gap-2.5">
          <span className="text-xl">🔍</span>
          <div className="text-left">
            <p className="font-bold text-gray-800 text-sm">전체 성분 보기</p>
            <p className="text-xs text-gray-400">{ingredients.length}종 · ㄱㄴㄷ 순 정렬</p>
          </div>
        </div>
        <span className="text-gray-400 text-sm">→</span>
      </button>

      {/* 카테고리 그리드 */}
      <p className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-2.5">기능별 분류</p>
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(CATEGORIES).map(([key, cat]) => {
          const count = categoryCounts[key] || 0;
          return (
            <button
              key={key}
              onClick={() => onSelectCategory(key)}
              className="flex items-center gap-3 p-3.5 rounded-2xl bg-white text-left transition-all active:scale-[0.97]"
              style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.07)', border: `1.5px solid ${cat.color}25` }}>
              {/* 아이콘 원 */}
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: cat.bg }}>
                {cat.icon}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-gray-900 text-sm leading-tight truncate">{cat.label}</p>
                <p className="text-[10px] font-medium mt-0.5 truncate"
                  style={{ color: cat.color }}>{count}종</p>
                <p className="text-[10px] text-gray-400 leading-snug mt-0.5 line-clamp-1">{cat.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── 카테고리별 목록 ─── */
function DictCategoryView({ categoryKey, onBack, onIngredientClick, labIds, onLabToggle }) {
  const cat = CATEGORIES[categoryKey];
  const list = useMemo(() =>
    ingredients.filter((i) => i.category === categoryKey)
      .sort((a, b) => a.name.localeCompare(b.name, 'ko')),
    [categoryKey]
  );

  return (
    <div>
      {/* 헤더 */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur px-4 pt-3 pb-2"
        style={{ borderBottom: '1px solid #F3F4F6' }}>
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-500 font-semibold mb-2">
          <span>←</span> 카테고리 목록
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl"
            style={{ background: cat.bg }}>
            {cat.icon}
          </div>
          <div>
            <h2 className="font-extrabold text-gray-900 text-base">{cat.label}</h2>
            <p className="text-xs text-gray-400">{list.length}종 · {cat.desc}</p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-3 space-y-2 pb-6">
        {list.map((ing) => (
          <IngredientCard key={ing.id} ingredient={ing}
            onClick={onIngredientClick}
            inLab={labIds.has(ing.id)}
            onLabToggle={onLabToggle} />
        ))}
      </div>
    </div>
  );
}

/* ─── 전체 ㄱㄴㄷ 목록 ─── */
function DictAllView({ onBack, onIngredientClick, labIds, onLabToggle }) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const sorted = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ingredients
      .filter((i) => !q || i.name.includes(q) || i.nameEn.toLowerCase().includes(q) || i.function.includes(q))
      .sort((a, b) => a.name.localeCompare(b.name, 'ko'));
  }, [search]);

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const visible = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      {/* 헤더 */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur px-4 pt-3 pb-2"
        style={{ borderBottom: '1px solid #F3F4F6' }}>
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-500 font-semibold mb-2">
          <span>←</span> 카테고리 목록
        </button>
        {/* 검색 */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="성분명, 기능, INCI 검색..."
            className="w-full pl-9 pr-9 py-2.5 bg-gray-50 rounded-xl text-sm outline-none"
          />
          {search && (
            <button onClick={() => { setSearch(''); setPage(1); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">✕</button>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-1.5">{sorted.length}종 · ㄱㄴㄷ 정렬</p>
      </div>

      <div className="px-4 pt-3 space-y-2">
        {visible.map((ing) => (
          <IngredientCard key={ing.id} ingredient={ing}
            onClick={onIngredientClick}
            inLab={labIds.has(ing.id)}
            onLabToggle={onLabToggle} />
        ))}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 py-6">
          <button disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="w-10 h-10 rounded-xl bg-white font-bold text-gray-600 disabled:opacity-30"
            style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.08)' }}>←</button>
          <span className="text-sm font-bold text-gray-600">{page} / {totalPages}</span>
          <button disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            className="w-10 h-10 rounded-xl bg-white font-bold text-gray-600 disabled:opacity-30"
            style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.08)' }}>→</button>
        </div>
      )}
      <div className="h-6" />
    </div>
  );
}

/* ─── 성분 상세 Bottom Sheet ─── */
function IngredientModal({ ingredient, onClose, inLab, onLabToggle }) {
  if (!ingredient) return null;
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end"
      style={{ background: 'rgba(0,0,0,0.4)' }}
      onClick={onClose}>
      <div className="bg-white rounded-t-3xl max-w-[480px] w-full mx-auto max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}>
        {/* 드래그 핸들 */}
        <div className="flex-shrink-0 pt-3 pb-2 px-4">
          <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto" />
        </div>
        <div className="overflow-y-auto flex-1 pb-4">
          <IngredientCard ingredient={ingredient} modal />
        </div>
        <div className="flex-shrink-0 px-4 pb-6 pt-2 border-t border-gray-100 flex gap-2">
          <button onClick={onClose}
            className="flex-1 py-3 rounded-2xl bg-gray-100 text-gray-600 font-bold text-sm">닫기</button>
          <button
            onClick={() => { onLabToggle(ingredient); onClose(); }}
            className="flex-1 py-3 rounded-2xl font-bold text-sm text-white transition-all"
            style={{ background: inLab ? '#EF4444' : '#4B9EFF' }}>
            {inLab ? '실험실 제거' : '실험실 추가 +'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── 메인 DictTab ─── */
export default function DictTab({ labIds, onLabToggle }) {
  const [view, setView] = useState('home'); // 'home' | 'category' | 'all'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modal, setModal] = useState(null);

  return (
    <div className="relative">
      {view === 'home' && (
        <DictHome
          onSelectCategory={(key) => { setSelectedCategory(key); setView('category'); }}
          onAllClick={() => setView('all')}
        />
      )}
      {view === 'category' && (
        <DictCategoryView
          categoryKey={selectedCategory}
          onBack={() => setView('home')}
          onIngredientClick={setModal}
          labIds={labIds}
          onLabToggle={onLabToggle}
        />
      )}
      {view === 'all' && (
        <DictAllView
          onBack={() => setView('home')}
          onIngredientClick={setModal}
          labIds={labIds}
          onLabToggle={onLabToggle}
        />
      )}

      <IngredientModal
        ingredient={modal}
        onClose={() => setModal(null)}
        inLab={modal ? labIds.has(modal.id) : false}
        onLabToggle={(ing) => { onLabToggle(ing); }}
      />
    </div>
  );
}
