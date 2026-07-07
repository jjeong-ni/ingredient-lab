import { useState, useMemo } from 'react';
import { ingredients, CATEGORIES } from '../data/ingredients';
import IngredientCard from './IngredientCard';
import { getOrigin } from '../utils/origin';
import CategoryIcon from './CategoryIcon';

const PAGE_SIZE = 60;

function countByCategory() {
  const map = {};
  ingredients.forEach((i) => { map[i.category] = (map[i.category] || 0) + 1; });
  return map;
}
const categoryCounts = countByCategory();

const SURFACE = {
  background: '#FFFFFF',
  border: '1px solid #DCE3DE',
  boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
};

const STICKY_HEADER = {
  background: '#FFFFFF',
  borderBottom: '1px solid #DCE3DE',
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
  { icon: '🪷', label: '모공', query: '모공' },
  { icon: '🔴', label: '민감성', query: '민감' },
];

const SEARCH_ALIASES = {
  '비타민 c': ['아스코르브', '아스코르빈', 'ascorbic'],
  '비타민 e': ['토코페롤', 'tocopherol'],
  '비타민 a': ['레티롬', '레티닐', 'retinol', 'retinyl'],
  '레티롬': ['retinol', '비타민 a', '레티노'],
  '히알루론산': ['히아루론', 'hyaluronic', '하이알루로닉'],
  '나이아신아마이드': ['나이아신아미드', 'niacinamide', '비타민 b3'],
  '판테놀': ['panthenol', '프로비타민 b5'],
  '세라마이드': ['ceramide'],
  '콜라겐': ['collagen'],
  '펝타이드': ['peptide'],
  '알부팀': ['arbutin'],
  'aha': ['글리쾜릭', '낙틱', 'glycolic', 'lactic'],
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

const ORIGIN_FILTER_OPTIONS = [
  { val: 'all', label: '전체' },
  { val: 'vegan', label: '🌱 비건' },
  { val: 'animal', label: '🐾 동물유래' },
];

function OriginFilterChips({ value, onChange }) {
  return (
    <div className="flex gap-1.5">
      {ORIGIN_FILTER_OPTIONS.map(({ val, label }) => {
        const active = value === val;
        const activeBg = val === 'animal' ? '#EA580C' : val === 'vegan' ? '#16a34a' : '#16201C';
        return (
          <button key={val} onClick={() => onChange(val)}
            className="px-2.5 py-1 rounded text-xs font-semibold transition-all active:scale-95"
            style={active
              ? { background: activeBg, color: 'white' }
              : { background: '#FFFFFF', color: '#445048', border: '1px solid #DCE3DE' }}>
            {label}
          </button>
        );
      })}
    </div>
  );
}

function applyOriginFilter(list, originFilter) {
  if (originFilter === 'vegan') return list.filter((i) => getOrigin(i)?.label === '비건');
  if (originFilter === 'animal') return list.filter((i) => getOrigin(i)?.label === '동물유래');
  return list;
}

function DictHome({ onSelectCategory, onAllClick, onFavoritesClick, onAnalyzeClick, onSkinConcernClick }) {
  return (
    <div className="px-4 pt-3 pb-4">
      <div className="hero-glass rounded-2xl p-5 mb-4 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.7 }}>INGREDIENT ARCHIVE</p>
          <p className="font-bold text-white text-lg mt-1 leading-tight">성분 사전</p>
          <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.8)' }}>화장품 원료 정보를 한눈에</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="font-bold text-white" style={{ fontSize: 19, fontFamily: 'ui-monospace, monospace', lineHeight: 1 }}>{ingredients.length}</p>
          <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.03em', marginTop: 3 }}>종 수록</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 mb-4" style={{ gridTemplateRows: 'auto auto' }}>
        <button onClick={onAllClick}
          className="col-span-2 flex items-center gap-3 p-4 rounded-2xl transition-all active:scale-[0.98]"
          style={SURFACE}>
          <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: '#E6EEE9', color: '#1B6E63' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>
            </svg>
          </div>
          <div className="text-left flex-1">
            <p className="font-bold text-sm" style={{ color: '#16201C' }}>전체보기</p>
            <p className="text-[10px]" style={{ color: '#5F6B65' }}>모든 성분을 검색하고 둘러보세요</p>
          </div>
          <p style={{ fontFamily: 'ui-monospace, monospace', fontSize: 13, fontWeight: 800, color: '#1B6E63' }}>{ingredients.length}</p>
        </button>
        <button onClick={onFavoritesClick}
          className="flex flex-col items-start gap-2 p-3.5 rounded-2xl transition-all active:scale-[0.96]"
          style={SURFACE}>
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: '#FDE9EC', color: '#E11D48' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20s-7-4.5-9.5-9C.8 7.3 3 4 6.3 4 8.6 4 10.7 5.4 12 7c1.3-1.6 3.4-3 5.7-3 3.3 0 5.5 3.3 3.8 7-2.5 4.5-9.5 9-9.5 9z"/>
            </svg>
          </div>
          <span className="text-xs font-bold" style={{ color: '#16201C' }}>즐겨찾기</span>
        </button>
        <button onClick={onAnalyzeClick}
          className="flex flex-col items-start gap-2 p-3.5 rounded-2xl transition-all active:scale-[0.96]"
          style={SURFACE}>
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: '#E6F1EC', color: '#1B6E63' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 3h6M10 3v6l-4 8a2 2 0 0 0 1.8 2.9h8.4A2 2 0 0 0 18 17l-4-8V3"/>
            </svg>
          </div>
          <span className="text-xs font-bold" style={{ color: '#16201C' }}>성분표분석</span>
        </button>
      </div>

      <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#5F6B65' }}>피부 고민별 검색</p>
      <div className="flex gap-2 overflow-x-auto pb-2.5 mb-3" style={{ scrollbarWidth: 'none' }}>
        {SKIN_CONCERNS.map((c) => (
          <button key={c.query} onClick={() => onSkinConcernClick(c.query)}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all active:scale-95"
            style={SURFACE}>
            <span className="text-sm leading-none">{c.icon}</span>
            <span className="text-xs font-semibold whitespace-nowrap" style={{ color: '#445048' }}>{c.label}</span>
          </button>
        ))}
      </div>

      <p className="text-[10px] font-bold uppercase tracking-widest mb-2.5" style={{ color: '#5F6B65' }}>기능별 분류</p>
      <div className="grid grid-cols-2 gap-2.5">
        {Object.entries(CATEGORIES).map(([key, cat]) => {
          const count = categoryCounts[key] || 0;
          return (
            <button key={key} onClick={() => onSelectCategory(key)}
              className="flex items-start gap-2.5 p-3.5 rounded-2xl transition-all active:scale-[0.96]"
              style={{ ...SURFACE, minHeight: 96 }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${cat.color}1A`, color: cat.color }}>
                <CategoryIcon category={key} fallbackEmoji={cat.icon} size={20} />
              </div>
              <div className="text-left min-w-0">
                <p className="font-semibold text-sm leading-tight truncate" style={{ color: '#16201C' }}>{cat.label}</p>
                <p className="text-[10px] font-semibold mt-1" style={{ color: cat.color, fontFamily: 'ui-monospace, monospace' }}>{count}종</p>
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
  const [search, setSearch] = useState('');
  const [originFilter, setOriginFilter] = useState('all');

  const list = useMemo(() => {
    let result = ingredients.filter((i) => i.category === categoryKey);
    result = filterIngredients(result, search);
    result = applyOriginFilter(result, originFilter);
    return result.sort((a, b) => a.name.localeCompare(b.name, 'ko'));
  }, [categoryKey, search, originFilter]);

  return (
    <div>
      <div className="sticky top-0 z-10 px-4 pt-3 pb-2" style={STICKY_HEADER}>
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-semibold mb-2" style={{ color: '#5F6B65' }}>
          ← 카테고리 목록
        </button>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${cat.color}1A`, color: cat.color }}>
            <CategoryIcon category={categoryKey} fallbackEmoji={cat.icon} size={20} />
          </div>
          <div>
            <h2 className="font-bold text-base" style={{ color: '#16201C' }}>{cat.label}</h2>
            <p className="text-xs" style={{ color: '#5F6B65' }}>{list.length}종 · {cat.desc}</p>
          </div>
        </div>
        <div className="relative mb-1.5">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: '#5F6B65' }}>🔍</span>
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder={`${cat.label} 내 검색...`}
            className="w-full pl-9 pr-9 py-2 rounded-md text-sm outline-none"
            style={{ background: '#FFFFFF', border: '1px solid #DCE3DE', color: '#16201C' }} />
          {search && (
            <button onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: '#5F6B65' }}>✕</button>
          )}
        </div>
        <OriginFilterChips value={originFilter} onChange={setOriginFilter} />
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
        {list.length === 0 && (
          <div className="col-span-2 flex flex-col items-center py-12 text-center">
            <p className="font-bold text-sm mb-1" style={{ color: '#16201C' }}>검색 결과가 없어요</p>
            <p className="text-xs" style={{ color: '#5F6B65' }}>다른 조건으로 검색해보세요</p>
          </div>
        )}
      </div>
    </div>
  );
}

function DictAllView({ onBack, onIngredientClick, labIds, onLabToggle, favorites, onFavoriteToggle, initialSearch }) {
  const [search, setSearch] = useState(initialSearch || '');
  const [page, setPage] = useState(1);
  const [originFilter, setOriginFilter] = useState('all');

  const sorted = useMemo(() => {
    let list = filterIngredients(ingredients, search);
    list = applyOriginFilter(list, originFilter);
    return list.sort((a, b) => a.name.localeCompare(b.name, 'ko'));
  }, [search, originFilter]);

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const visible = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <div className="sticky top-0 z-10 px-4 pt-3 pb-2" style={STICKY_HEADER}>
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-semibold mb-2" style={{ color: '#5F6B65' }}>
          ← 카테고리 목록
        </button>
        <div className="relative mb-2">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: '#5F6B65' }}>🔍</span>
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="성분명, 피부고민, 비타민 C 등 검색..."
            className="w-full pl-9 pr-9 py-2.5 rounded-md text-sm outline-none"
            style={{ background: '#FFFFFF', border: '1px solid #DCE3DE', color: '#16201C' }} />
          {search && (
            <button onClick={() => { setSearch(''); setPage(1); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: '#5F6B65' }}>✕</button>
          )}
        </div>
        <div className="mb-1.5">
          <OriginFilterChips value={originFilter} onChange={(v) => { setOriginFilter(v); setPage(1); }} />
        </div>
        <p className="text-xs" style={{ color: '#5F6B65' }}>{sorted.length}종 · ㄱㄴㄷ 정렬</p>
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
        {visible.length === 0 && (
          <div className="col-span-2 flex flex-col items-center py-12 text-center">
            <p className="font-bold text-sm mb-1" style={{ color: '#16201C' }}>검색 결과가 없어요</p>
            <p className="text-xs" style={{ color: '#5F6B65' }}>다른 조건으로 검색해보세요</p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 py-6">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
            className="w-10 h-10 rounded-md font-bold disabled:opacity-30"
            style={{ ...SURFACE, color: '#16201C' }}>←</button>
          <span className="text-sm font-bold" style={{ color: '#445048' }}>{page} / {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
            className="w-10 h-10 rounded-md font-bold disabled:opacity-30"
            style={{ ...SURFACE, color: '#16201C' }}>→</button>
        </div>
      )}
      <div className="h-6" />
    </div>
  );
}

function DictFavoritesView({ onBack, onIngredientClick, labIds, onLabToggle, favorites, onFavoriteToggle }) {
  const [copied, setCopied] = useState(false);
  const list = useMemo(() =>
    ingredients.filter((i) => favorites.has(i.id))
      .sort((a, b) => a.name.localeCompare(b.name, 'ko')),
    [favorites]
  );

  async function handleExport() {
    const text = [
      '⭐ 즐겨찾기 성분 목록',
      '─'.repeat(24),
      ...list.map((i) => `${i.emoji} ${i.name} (${i.nameEn})\n   ${i.function}`),
    ].join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch(e) {}
  }

  return (
    <div>
      <div className="sticky top-0 z-10 px-4 pt-3 pb-2" style={STICKY_HEADER}>
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-semibold mb-2" style={{ color: '#5F6B65' }}>← 홈</button>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl" style={{ color: '#E11D48' }}>♥</span>
            <div>
              <h2 className="font-bold text-base" style={{ color: '#16201C' }}>즐겨찾기</h2>
              <p className="text-xs" style={{ color: '#5F6B65' }}>{list.length}개 저장됨</p>
            </div>
          </div>
          {list.length > 0 && (
            <button onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all active:scale-95"
              style={copied
                ? { background: '#F0FDF4', color: '#15803D', border: '1px solid #BBF7D0' }
                : { background: '#FFFFFF', color: '#445048', border: '1px solid #DCE3DE' }}>
              {copied ? '✓ 복사됨' : '📋 목록 복사'}
            </button>
          )}
        </div>
      </div>

      {list.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
          <span className="text-5xl mb-4" style={{ color: '#DCE3DE' }}>♡</span>
          <p className="font-bold text-base mb-1" style={{ color: '#16201C' }}>즐겨찾기가 없어요</p>
          <p className="text-sm" style={{ color: '#5F6B65' }}>성분 상세에서 ♡를 눌러 저장하세요</p>
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
      <div className="sticky top-0 z-10 px-4 pt-3 pb-2" style={STICKY_HEADER}>
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-semibold mb-2" style={{ color: '#5F6B65' }}>← 홈</button>
        <div className="flex items-center gap-2">
          <span className="text-xl">🔬</span>
          <div>
            <h2 className="font-bold text-base" style={{ color: '#16201C' }}>성분표 분석</h2>
            <p className="text-xs" style={{ color: '#5F6B65' }}>성분표를 붙여넣으면 성분을 찾아드려요</p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-3 pb-6">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={"성분표를 붙여넣으세요\n예) Water, Glycerin, Niacinamide..."}
          rows={6}
          className="w-full p-3.5 rounded-lg text-sm outline-none resize-none"
          style={{
            background: '#FFFFFF',
            border: '1px solid #DCE3DE',
            color: '#16201C',
            lineHeight: 1.6,
          }}
        />
        <button
          onClick={analyze}
          className="w-full mt-3 py-3.5 rounded-lg font-bold text-sm text-white transition-all active:scale-[0.97]"
          style={{ background: '#1B6E63', boxShadow: '0 4px 14px rgba(27,110,99,0.28)' }}>
          🔬 성분 분석하기
        </button>

        {results && (
          <div className="mt-5 space-y-4">
            {results.found.length > 0 && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-2.5" style={{ color: '#15803D' }}>
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
                <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#5F6B65' }}>
                  미매칭 성분 ({results.notFound.length}개)
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {results.notFound.map((t, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded"
                      style={{ background: '#E6EEE9', color: '#5F6B65', border: '1px solid #DCE3DE' }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {results.found.length === 0 && results.notFound.length === 0 && (
              <p className="text-sm text-center" style={{ color: '#5F6B65' }}>성분을 인식하지 못했어요. 쉼표나 줄바꿈으로 구분해주세요.</p>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}>
      <div className="relative rounded-2xl w-full max-w-[400px] max-h-[88vh] flex flex-col overflow-hidden"
        style={{ background: '#FFFFFF', boxShadow: '0 24px 80px rgba(0,0,0,0.18)' }}
        onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: '#FFFFFF', color: '#666666', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}>✕</button>
        <div className="overflow-y-auto flex-1">
          <IngredientCard ingredient={ingredient} modal isFavorite={isFavorite} onFavoriteToggle={onFavoriteToggle} />
        </div>
        <div className="flex-shrink-0 px-5 pb-5 pt-3"
          style={{ borderTop: '1px solid #F0F0F0' }}>
          <button onClick={() => { onLabToggle(ingredient); onClose(); }}
            className="w-full py-3.5 rounded-xl font-bold text-sm text-white"
            style={{ background: inLab ? '#DC2626' : '#1B6E63' }}>
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
