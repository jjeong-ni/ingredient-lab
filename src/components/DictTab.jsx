import { useState, useMemo } from 'react';
import { ingredients, CATEGORIES } from '../data/ingredients';
import IngredientCard from './IngredientCard';

const PAGE_SIZE = 60;

function countByCategory() {
  const map = {};
  ingredients.forEach((i) => { map[i.category] = (map[i.category] || 0) + 1; });
  return map;
}
const categoryCounts = countByCategory();

const GLASS = {
  background: 'rgba(255,255,255,0.50)',
  backdropFilter: 'blur(14px)',
  WebkitBackdropFilter: 'blur(14px)',
  border: '1px solid rgba(255,255,255,0.82)',
  boxShadow: '0 2px 16px rgba(140,140,200,0.10)',
};

const GLASS_HEADER = {
  background: 'rgba(255,255,255,0.70)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  borderBottom: '1px solid rgba(255,255,255,0.90)',
};

function DictHome({ onSelectCategory, onAllClick }) {
  return (
    <div className="px-4 pt-3 pb-4">
      <div className="rounded-2xl p-4 mb-4 flex items-center gap-3"
        style={{
          background: 'linear-gradient(135deg, rgba(123,158,255,0.75) 0%, rgba(192,132,252,0.75) 100%)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          border: '1px solid rgba(255,255,255,0.6)',
        }}>
        <span className="text-3xl">🧪</span>
        <div>
          <p className="font-extrabold text-white text-base leading-tight">성분 사전</p>
          <p className="text-white/75 text-xs mt-0.5">{ingredients.length}종의 화장품 원료 정보</p>
        </div>
      </div>

      <button onClick={onAllClick}
        className="w-full flex items-center justify-between px-4 py-3 rounded-2xl mb-3 transition-all active:scale-[0.98]"
        style={GLASS}>
        <div className="flex items-center gap-2.5">
          <span className="text-xl">🔍</span>
          <div className="text-left">
            <p className="font-bold text-sm" style={{ color: '#2d2d4e' }}>전체 성분 보기</p>
            <p className="text-xs" style={{ color: '#9999bb' }}>{ingredients.length}종 · ㄱㄴㄷ 순 정렬</p>
          </div>
        </div>
        <span style={{ color: '#c0c0d8' }}>→</span>
      </button>

      <p className="text-[10px] font-extrabold uppercase tracking-widest mb-2.5" style={{ color: '#9999bb' }}>기능별 분류</p>
      <div className="grid grid-cols-2 gap-2.5">
        {Object.entries(CATEGORIES).map(([key, cat]) => {
          const count = categoryCounts[key] || 0;
          return (
            <button key={key} onClick={() => onSelectCategory(key)}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl transition-all active:scale-[0.96]"
              style={{ ...GLASS, minHeight: 110 }}>
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl"
                style={{ background: cat.bg || 'rgba(236,232,248,0.5)' }}>
                {cat.icon}
              </div>
              <div className="text-center">
                <p className="font-bold text-sm leading-tight" style={{ color: '#2d2d4e' }}>{cat.label}</p>
                <p className="text-[10px] font-semibold mt-0.5" style={{ color: cat.color }}>{count}종</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DictCategoryView({ categoryKey, onBack, onIngredientClick, labIds, onLabToggle }) {
  const cat = CATEGORIES[categoryKey];
  const list = useMemo(() =>
    ingredients.filter((i) => i.category === categoryKey)
      .sort((a, b) => a.name.localeCompare(b.name, 'ko')),
    [categoryKey]
  );

  return (
    <div>
      <div className="sticky top-0 z-10 px-4 pt-3 pb-2" style={GLASS_HEADER}>
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-semibold mb-2" style={{ color: '#9999bb' }}>
          ← 카테고리 목록
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-2xl"
            style={{ background: cat.bg || 'rgba(236,232,248,0.5)' }}>
            {cat.icon}
          </div>
          <div>
            <h2 className="font-extrabold text-base" style={{ color: '#2d2d4e' }}>{cat.label}</h2>
            <p className="text-xs" style={{ color: '#9999bb' }}>{list.length}종 · {cat.desc}</p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-3 grid grid-cols-2 gap-2 pb-6">
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
      <div className="sticky top-0 z-10 px-4 pt-3 pb-2" style={GLASS_HEADER}>
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-semibold mb-2" style={{ color: '#9999bb' }}>
          ← 카테고리 목록
        </button>
        <div className="relative mb-2">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: '#9999bb' }}>🔍</span>
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="성분명, 기능, INCI 검색..."
            className="w-full pl-9 pr-9 py-2.5 rounded-xl text-sm outline-none"
            style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.85)', color: '#2d2d4e' }} />
          {search && (
            <button onClick={() => { setSearch(''); setPage(1); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: '#9999bb' }}>✕</button>
          )}
        </div>
        <p className="text-xs" style={{ color: '#9999bb' }}>{sorted.length}종 · ㄱㄴㄷ 정렬</p>
      </div>

      <div className="px-4 pt-3 grid grid-cols-2 gap-2">
        {visible.map((ing) => (
          <IngredientCard key={ing.id} ingredient={ing}
            onClick={onIngredientClick}
            inLab={labIds.has(ing.id)}
            onLabToggle={onLabToggle} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 py-6">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
            className="w-10 h-10 rounded-xl font-bold disabled:opacity-30"
            style={{ ...GLASS, color: '#2d2d4e' }}>←</button>
          <span className="text-sm font-bold" style={{ color: '#6d6d90' }}>{page} / {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
            className="w-10 h-10 rounded-xl font-bold disabled:opacity-30"
            style={{ ...GLASS, color: '#2d2d4e' }}>→</button>
        </div>
      )}
      <div className="h-6" />
    </div>
  );
}

function IngredientModal({ ingredient, onClose, inLab, onLabToggle }) {
  if (!ingredient) return null;
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end"
      style={{ background: 'rgba(30,20,60,0.35)' }}
      onClick={onClose}>
      <div className="rounded-t-3xl max-w-[480px] w-full mx-auto max-h-[85vh] flex flex-col"
        style={{
          background: 'rgba(255,255,255,0.88)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.95)',
        }}
        onClick={(e) => e.stopPropagation()}>
        <div className="flex-shrink-0 pt-3 pb-2 px-4">
          <div className="w-10 h-1 rounded-full mx-auto" style={{ background: 'rgba(180,180,210,0.5)' }} />
        </div>
        <div className="overflow-y-auto flex-1 pb-4">
          <IngredientCard ingredient={ingredient} modal />
        </div>
        <div className="flex-shrink-0 px-4 pb-6 pt-2 flex gap-2"
          style={{ borderTop: '1px solid rgba(220,220,240,0.4)' }}>
          <button onClick={onClose}
            className="flex-1 py-3 rounded-2xl font-bold text-sm"
            style={{ background: 'rgba(220,220,240,0.5)', color: '#6d6d90' }}>닫기</button>
          <button onClick={() => { onLabToggle(ingredient); onClose(); }}
            className="flex-1 py-3 rounded-2xl font-bold text-sm text-white"
            style={{ background: inLab ? '#f87171' : 'linear-gradient(135deg,#7B9EFF,#C084FC)' }}>
            {inLab ? '실험실 제거' : '실험실 추가 +'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DictTab({ labIds, onLabToggle }) {
  const [view, setView] = useState('home');
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
