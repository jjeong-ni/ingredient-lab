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
  background: 'rgba(255,255,255,0.55)',
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

const SKIN_CONCERNS = [
  { icon: '💧', label: '수분', query: '수분' },
  { icon: '✨', label: '미백', query: '미백' },
  { icon: '🌿', label: '진정', query: '진정' },
  { icon: '⏰', label: '노화', query: '주름' },
  { icon: '🔆', label: '탄력', query: '탄력' },
  { icon: '🛡', label: '자외선', query: '자외선' },
  { icon: '🌸', label: '여드름', query: '여드름' },
  { icon: '🔬', label: '각질', query: '각질' },
  { icon: '🫧', label: '모공', query: '모공' },
  { icon: '🔴', label: '민감성', query: '민감' },
];

const SEARCH_ALIASES = {
  '비타민c': ['아스코르브', '아스코르빈', 'ascorbic'],
  '비타민e': ['토코페롤', 'tocopherol'],
  '비타민a': ['레티놀', '레티닐', 'retinol', 'retinyl'],
  '레티놀': ['retinol', '비타민a', '레티노'],
  '히알루론산': ['히아루론', 'hyaluronic', '하이알루로닉'],
  '나이아신아마이드': ['나이아신아미드', 'niacinamide', '비타민b3'],
  '판테놀': ['panthenol', '프로비타민b5'],
  '세라마이드': ['ceramide'],
  '콜라겐': ['collagen'],
  '펩타이드': ['peptide'],
  '알부틴': ['arbutin'],
  'aha': ['글리콜릭', '락틱', 'glycolic', 'lactic'],
  'bha': ['살리실릭', 'salicylic'],
  '녹차': ['그린티', 'green tea', '카테킨'],
  '마데카소사이드': ['센텔라', 'centella', '시카'],
  '시카': ['센텔라', 'centella', '마데카소사이드'],
  '트러블': ['여드름', '피지', '항균'],
  '건성': ['수분', '보습', '히알루론'],
  '지성': ['피지', '모공', '세정'],
};

function expandQuery(q) {
  const lower = q.toLowerCase();
  const terms = new Set([lower]);
  for (const [key, aliases] of Object.entries(SEARCH_ALIASES)) {
    if (lower.includes(key) || key.includes(lower)) {
      aliases.forEach((a) => terms.add(a));
    }
    if (aliases.some((a) => lower.includes(a) || a.includes(lower))) {
      terms.add(key);
      aliases.forEach((a) => terms.add(a));
    }
  }
  return [...terms];
}

function filterIngredients(list, query) {
  if (!query.trim()) return list;
  const terms = expandQuery(query.trim());
  return list.filter((i) => {
    const searchStr = [
      i.name, i.nameEn, i.function,
      ...(i.painPoints || []),
      ...(i.tags || []),
      i.extraction || '',
    ].join(' ').toLowerCase();
    return terms.some((t) => searchStr.includes(t));
  });
}

function DictHome({ onSelectCategory, onAllClick, onFavoritesClick, onAnalyzeClick, onSkinConcernClick }) {
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

      <div className="flex gap-2 mb-4">
        <button onClick={onAllClick}
          className="flex-1 flex flex-col items-center gap-1.5 py-3 rounded-2xl transition-all active:scale-[0.96]"
          style={{ background: 'rgba(123,158,255,0.12)', border: '1.5px solid rgba(123,158,255,0.25)' }}>
          <span className="text-xl">🔍</span>
          <span className="text-xs font-bold" style={{ color: '#7B9EFF' }}>전체보기</span>
        </button>
        <button onClick={onFavoritesClick}
          className="flex-1 flex flex-col items-center gap-1.5 py-3 rounded-2xl transition-all active:scale-[0.96]"
          style={{ background: 'rgba(251,113,133,0.12)', border: '1.5px solid rgba(251,113,133,0.25)' }}>
          <span className="text-xl">♥</span>
          <span className="text-xs font-bold" style={{ color: '#fb7185' }}>즐겨찾기</span>
        </button>
        <button onClick={onAnalyzeClick}
          className="flex-1 flex flex-col items-center gap-1.5 py-3 rounded-2xl transition-all active:scale-[0.96]"
          style={{ background: 'rgba(52,211,153,0.12)', border: '1.5px solid rgba(52,211,153,0.25)' }}>
          <span className="text-xl">🔬</span>
          <span className="text-xs font-bold" style={{ color: '#34d399' }}>성분표분석</span>
        </button>
      </div>

      <p className="text-[10px] font-extrabold uppercase tracking-widest mb-2" style={{ color: '#9999bb' }}>피부 고민별 검색</p>
      <div className="flex gap-2 overflow-x-auto pb-2.5 mb-3" style={{ scrollbarWidth: 'none' }}>
        {SKIN_CONCERNS.map((c) => (
          <button key={c.query} onClick={() => onSkinConcernClick(c.query)}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-2xl transition-all active:scale-95"
            style={{
              background: 'rgba(255,255,255,0.7)',
              border: '1.5px solid rgba(255,255,255,0.9)',
              boxShadow: '0 2px 10px rgba(140,140,200,0.08)',
            }}>
            <span className="text-base leading-none">{c.icon}</span>
            <span className="text-xs font-bold whitespace-nowrap" style={{ color: '#4d4d70' }}>{c.label}</span>
          </button>
        ))}
      </div>

      <p className="text-[10px] font-extrabold uppercase tracking-widest mb-2.5" style={{ color: '#9999bb' }}>기능별 분류</p>
      <div className="grid grid-cols-2 gap-2.5">
        {Object.entries(CATEGORIES).map(([key, cat]) => {
          const count = categoryCounts[key] || 0;
          return (
            <button key={key} onClick={() => onSelectCategory(key)}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl transition-all active:scale-[0.96]"
              style={{
                background: cat.bg || '#ede8f8',
                border: '1.5px solid rgba(255,255,255,0.85)',
                boxShadow: `0 4px 16px ${cat.color}18, inset 0 1px 0 rgba(255,255,255,0.9)`,
                minHeight: 110
              }}>
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl"
                style={{ background: `${cat.color}22` }}>
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

function DictCategoryView({ categoryKey, onBack, onIngredientClick, labIds, onLabToggle, favorites, onFavoriteToggle }) {
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
            onLabToggle={onLabToggle}
            isFavorite={favorites.has(ing.id)}
            onFavoriteToggle={onFavoriteToggle} />
        ))}
      </div>
    </div>
  );
}

function DictAllView({ onBack, onIngredientClick, labIds, onLabToggle, favorites, onFavoriteToggle, initialSearch }) {
  const [search, setSearch] = useState(initialSearch || '');
  const [page, setPage] = useState(1);

  const sorted = useMemo(() => {
    return filterIngredients(ingredients, search)
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
            placeholder="성분명, 피부고민, 비타민C 등 검색..."
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
            onLabToggle={onLabToggle}
            isFavorite={favorites.has(ing.id)}
            onFavoriteToggle={onFavoriteToggle} />
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

function DictFavoritesView({ onBack, onIngredientClick, labIds, onLabToggle, favorites, onFavoriteToggle }) {
  const list = useMemo(() =>
    ingredients.filter((i) => favorites.has(i.id))
      .sort((a, b) => a.name.localeCompare(b.name, 'ko')),
    [favorites]
  );

  return (
    <div>
      <div className="sticky top-0 z-10 px-4 pt-3 pb-2" style={GLASS_HEADER}>
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-semibold mb-2" style={{ color: '#9999bb' }}>← 홈</button>
        <div className="flex items-center gap-2">
          <span className="text-xl" style={{ color: '#fb7185' }}>♥</span>
          <div>
            <h2 className="font-extrabold text-base" style={{ color: '#2d2d4e' }}>즐겨찾기</h2>
            <p className="text-xs" style={{ color: '#9999bb' }}>{list.length}개 저장됨</p>
          </div>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
          <span className="text-5xl mb-4" style={{ color: '#e0dff0' }}>♡</span>
          <p className="font-bold text-base mb-1" style={{ color: '#2d2d4e' }}>즐겨찾기가 없어요</p>
          <p className="text-sm" style={{ color: '#9999bb' }}>성분 상세에서 ♡를 눌러 저장하세요</p>
        </div>
      ) : (
        <div className="px-4 pt-3 grid grid-cols-2 gap-2 pb-6">
          {list.map((ing) => (
            <IngredientCard key={ing.id} ingredient={ing}
              onClick={onIngredientClick}
              inLab={labIds.has(ing.id)}
              onLabToggle={onLabToggle}
              isFavorite={favorites.has(ing.id)}
              onFavoriteToggle={onFavoriteToggle} />
          ))}
        </div>
      )}
    </div>
  );
}

function DictAnalyzeView({ onBack, onIngredientClick, labIds, onLabToggle, favorites, onFavoriteToggle }) {
  const [inputText, setInputText] = useState('');
  const [results, setResults] = useState(null);

  function analyze() {
    if (!inputText.trim()) return;
    const tokens = inputText
      .split(/[,\/\n、·]+/)
      .map((t) => t.trim())
      .filter((t) => t.length > 1);

    const found = [];
    const notFound = [];

    tokens.forEach((token) => {
      const lower = token.toLowerCase();
      const match = ingredients.find((i) =>
        i.name.toLowerCase().includes(lower) ||
        i.nameEn.toLowerCase().includes(lower) ||
        lower.includes(i.name.toLowerCase()) ||
        lower.includes(i.nameEn.toLowerCase().split(' ').slice(0, 2).join(' '))
      );
      if (match) found.push(match);
      else notFound.push(token);
    });

    const unique = [...new Map(found.map((i) => [i.id, i])).values()];
    setResults({ found: unique, notFound });
  }

  return (
    <div>
      <div className="sticky top-0 z-10 px-4 pt-3 pb-2" style={GLASS_HEADER}>
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-semibold mb-2" style={{ color: '#9999bb' }}>← 홈</button>
        <div className="flex items-center gap-2">
          <span className="text-xl">🔬</span>
          <div>
            <h2 className="font-extrabold text-base" style={{ color: '#2d2d4e' }}>성분표 분석</h2>
            <p className="text-xs" style={{ color: '#9999bb' }}>성분표를 붙여넣으면 성분을 찾아드려요</p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-3 pb-6">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={"성분표를 붙여넣으세요\n예) Water, Glycerin, Niacinamide..."}
          rows={6}
          className="w-full p-3.5 rounded-2xl text-sm outline-none resize-none"
          style={{
            background: 'rgba(255,255,255,0.6)',
            border: '1.5px solid rgba(255,255,255,0.85)',
            color: '#2d2d4e',
            lineHeight: 1.6,
          }}
        />
        <button
          onClick={analyze}
          className="w-full mt-3 py-3.5 rounded-2xl font-extrabold text-sm text-white transition-all active:scale-[0.97]"
          style={{ background: 'linear-gradient(135deg,#34d399,#059669)', boxShadow: '0 4px 16px rgba(52,211,153,0.35)' }}>
          🔬 성분 분석하기
        </button>

        {results && (
          <div className="mt-5 space-y-4">
            {results.found.length > 0 && (
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-widest mb-2.5" style={{ color: '#34d399' }}>
                  ✓ 데이터베이스에서 {results.found.length}개 발견
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {results.found.map((ing) => (
                    <IngredientCard key={ing.id} ingredient={ing}
                      onClick={onIngredientClick}
                      inLab={labIds.has(ing.id)}
                      onLabToggle={onLabToggle}
                      isFavorite={favorites.has(ing.id)}
                      onFavoriteToggle={onFavoriteToggle} />
                  ))}
                </div>
              </div>
            )}
            {results.notFound.length > 0 && (
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-widest mb-2" style={{ color: '#9999bb' }}>
                  미매칭 성분 ({results.notFound.length}개)
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {results.notFound.map((t, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded-xl"
                      style={{ background: 'rgba(220,220,240,0.4)', color: '#9999bb', border: '1px solid rgba(255,255,255,0.8)' }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {results.found.length === 0 && results.notFound.length === 0 && (
              <p className="text-sm text-center" style={{ color: '#9999bb' }}>성분을 인식하지 못했어요. 쉼표나 줄바꿈으로 구분해주세요.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function IngredientModal({ ingredient, onClose, inLab, onLabToggle, isFavorite, onFavoriteToggle }) {
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
          <IngredientCard ingredient={ingredient} modal isFavorite={isFavorite} onFavoriteToggle={onFavoriteToggle} />
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

export default function DictTab({ labIds, onLabToggle, favorites, onFavoriteToggle }) {
  const [view, setView] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modal, setModal] = useState(null);
  const [initialSearch, setInitialSearch] = useState('');

  function goAll(search) {
    setInitialSearch(search || '');
    setView('all');
  }

  return (
    <div className="relative">
      {view === 'home' && (
        <DictHome
          onSelectCategory={(key) => { setSelectedCategory(key); setView('category'); }}
          onAllClick={() => goAll('')}
          onFavoritesClick={() => setView('favorites')}
          onAnalyzeClick={() => setView('analyze')}
          onSkinConcernClick={(q) => goAll(q)}
        />
      )}
      {view === 'category' && (
        <DictCategoryView
          categoryKey={selectedCategory}
          onBack={() => setView('home')}
          onIngredientClick={setModal}
          labIds={labIds}
          onLabToggle={onLabToggle}
          favorites={favorites}
          onFavoriteToggle={onFavoriteToggle}
        />
      )}
      {view === 'all' && (
        <DictAllView
          onBack={() => setView('home')}
          onIngredientClick={setModal}
          labIds={labIds}
          onLabToggle={onLabToggle}
          favorites={favorites}
          onFavoriteToggle={onFavoriteToggle}
          initialSearch={initialSearch}
        />
      )}
      {view === 'favorites' && (
        <DictFavoritesView
          onBack={() => setView('home')}
          onIngredientClick={setModal}
          labIds={labIds}
          onLabToggle={onLabToggle}
          favorites={favorites}
          onFavoriteToggle={onFavoriteToggle}
        />
      )}
      {view === 'analyze' && (
        <DictAnalyzeView
          onBack={() => setView('home')}
          onIngredientClick={setModal}
          labIds={labIds}
          onLabToggle={onLabToggle}
          favorites={favorites}
          onFavoriteToggle={onFavoriteToggle}
        />
      )}
      <IngredientModal
        ingredient={modal}
        onClose={() => setModal(null)}
        inLab={modal ? labIds.has(modal.id) : false}
        onLabToggle={(ing) => { onLabToggle(ing); }}
        isFavorite={modal ? favorites.has(modal.id) : false}
        onFavoriteToggle={onFavoriteToggle}
      />
    </div>
  );
}
