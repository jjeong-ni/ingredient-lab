import { useState, useMemo } from 'react';
import { ingredients, CATEGORIES, synergies } from '../data/ingredients';
import { PRODUCT_TREE, suggestPct, parseConc } from '../data/productTypes';
import IngredientCard from './IngredientCard';

const SURFACE = {
  background: '#FFFFFF',
  border: '1px solid #E5E5E5',
  boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
};

const STICKY_HEADER = {
  background: '#FFFFFF',
  borderBottom: '1px solid #E5E5E5',
};

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
    ].join(' ').toLowerCase();
    return terms.some((t) => searchStr.includes(t));
  });
}

function findSynergies(ids) {
  return synergies.filter((s) => s.ids.every((id) => ids.includes(id)));
}

function Step1({ onSelect, savedFormulas, onDeleteFormula, labDictIds }) {
  const [copiedId, setCopiedId] = useState(null);
  const dictCount = labDictIds?.size || 0;

  async function handleCopyFormula(f) {
    const total = f.items.reduce((s, i) => s + i.pct, 0);
    const text = [
      `${f.icon} ${f.name} (${f.l1Label} · ${f.l2Label})`,
      `저장일: ${f.createdAt}`,
      '─'.repeat(24),
      ...f.items.map((item) => `${item.emoji} ${item.name}: ${item.pct.toFixed(2)}%`),
      '─'.repeat(24),
      `종 함량: ${total.toFixed(2)}%`,
    ].join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(f.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch(e) {}
  }

  return (
    <div className="px-4 pt-3 pb-6">
      <div className="rounded-lg p-4 mb-5"
        style={{ background: '#171717' }}>
        <p className="font-bold text-white text-base">⚗️ 성분 실험실</p>
        <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.55)' }}>만들 제품 유형을 선택하면<br/>성분별 권장 함량을 안내해드려요</p>
      </div>

      {dictCount > 0 && (
        <div className="rounded-lg p-3 mb-4"
          style={{ background: '#EFF6FF', border: '1px solid #DBEAFE' }}>
          <p className="text-xs font-semibold" style={{ color: '#1D4ED8' }}>📌 성분사전에서 {dictCount}개 성분 선택됨</p>
          <p className="text-[10px] mt-0.5" style={{ color: '#3B82F6' }}>제품 유형을 선택하면 배합에 빠르게 추가할 수 있어요</p>
        </div>
      )}

      {savedFormulas && savedFormulas.length > 0 && (
        <div className="mb-5">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-2.5" style={{ color: '#888888' }}>저장된 배합</p>
          <div className="space-y-2">
            {savedFormulas.map((f) => (
              <div key={f.id} className="rounded-lg p-3.5 flex items-start gap-3" style={SURFACE}>
                <span className="text-2xl flex-shrink-0">{f.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm" style={{ color: '#171717' }}>{f.name}</p>
                  <p className="text-[10px] mb-1.5" style={{ color: '#888888' }}>{f.l1Label} · {f.l2Label} · {f.createdAt}</p>
                  <div className="flex flex-wrap gap-1">
                    {f.items.map((item, i) => (
                      <span key={i} className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                        style={{ background: '#F4F4F5', color: '#444444' }}>
                        {item.emoji} {item.name} {item.pct.toFixed(1)}%
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 flex-shrink-0">
                  <button onClick={() => handleCopyFormula(f)}
                    className="w-7 h-7 rounded-md flex items-center justify-center text-xs transition-all"
                    style={copiedId === f.id
                      ? { background: '#F0FDF4', color: '#15803D', border: '1px solid #BBF7D0' }
                      : { background: '#F4F4F5', color: '#444444', border: '1px solid #E5E5E5' }}>
                    {copiedId === f.id ? '✓' : '📋'}
                  </button>
                  <button onClick={() => onDeleteFormula(f.id)}
                    className="w-7 h-7 rounded-md flex items-center justify-center"
                    style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}>×</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#888888' }}>카테고리 선택</p>
      <div className="grid grid-cols-3 gap-3">
        {PRODUCT_TREE.map((l1) => (
          <button key={l1.id} onClick={() => onSelect(l1)}
            className="flex flex-col items-center gap-2 p-4 rounded-lg transition-all active:scale-95"
            style={{ ...SURFACE, minHeight: 130 }}>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
              style={{ background: '#F4F4F5' }}>
              {l1.icon}
            </div>
            <span className="font-semibold text-sm" style={{ color: '#171717' }}>{l1.label}</span>
            <span className="text-[10px] text-center leading-snug" style={{ color: '#888888' }}>{l1.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Step2({ l1, onSelect, onBack }) {
  return (
    <div className="px-4 pt-3 pb-6">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="text-sm font-semibold" style={{ color: '#888888' }}>←</button>
        <div className="flex items-center gap-2">
          <span className="text-xl">{l1.icon}</span>
          <span className="font-bold text-base" style={{ color: '#171717' }}>{l1.label}</span>
        </div>
      </div>

      <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#888888' }}>제품군 선택</p>
      <div className="grid grid-cols-2 gap-2.5">
        {l1.children.map((l2) => (
          <button key={l2.id} onClick={() => onSelect(l2)}
            className="flex flex-col items-center gap-2 p-4 rounded-lg transition-all active:scale-[0.96]"
            style={{ ...SURFACE, minHeight: 120 }}>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
              style={{ background: '#F4F4F5' }}>
              {l2.icon}
            </div>
            <div className="text-center">
              <p className="font-semibold text-sm" style={{ color: '#171717' }}>{l2.label}</p>
              <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded mt-1"
                style={{ background: '#F4F4F5', color: '#444444' }}>
                {l2.children.length}종
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function Step3({ l1, l2, onSelect, onBack }) {
  return (
    <div className="px-4 pt-3 pb-6">
      <div className="flex items-center gap-1.5 mb-4 text-sm font-semibold flex-wrap" style={{ color: '#888888' }}>
        <button onClick={onBack} style={{ color: '#0072F5' }}>← {l1.label}</button>
        <span style={{ color: '#E5E5E5', margin: '0 2px' }}>/</span>
        <span className="font-bold" style={{ color: '#171717' }}>{l2.label}</span>
      </div>

      <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#888888' }}>제품 유형 선택</p>
      <div className="grid grid-cols-2 gap-2.5">
        {l2.children.map((l3) => (
          <button key={l3.id} onClick={() => onSelect(l3)}
            className="flex flex-col items-start gap-2 p-4 rounded-lg transition-all active:scale-95"
            style={{ ...SURFACE, minHeight: 110 }}>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-2xl"
              style={{ background: '#F4F4F5' }}>
              {l3.icon}
            </div>
            <div>
              <p className="font-semibold text-sm leading-tight" style={{ color: '#171717' }}>{l3.label}</p>
              <p className="text-[10px] mt-0.5 leading-snug" style={{ color: '#888888' }}>{l3.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function BuildStep({ l1, l2, l3, formula, onAdd, onRemove, onNext, onBack, onIngredientClick, labDictIds }) {
  const [catFilter, setCatFilter] = useState('all');
  const [search, setSearch] = useState('');
  const selectedIds = new Set(formula.map((f) => f.ingredient.id));

  const dictIngredients = useMemo(() => {
    if (!labDictIds?.size) return [];
    return ingredients.filter((i) => labDictIds.has(i.id));
  }, [labDictIds]);

  const filtered = useMemo(() => {
    let list = catFilter !== 'all' ? ingredients.filter((i) => i.category === catFilter) : [...ingredients];
    list = filterIngredients(list, search);
    return list.sort((a, b) => a.name.localeCompare(b.name, 'ko'));
  }, [catFilter, search]);

  return (
    <div>
      <div className="sticky top-0 z-10 px-4 pt-3 pb-2" style={STICKY_HEADER}>
        <div className="flex items-center gap-1 text-xs font-semibold mb-2 flex-wrap" style={{ color: '#888888' }}>
          <button onClick={onBack} style={{ color: '#0072F5' }}>← 변경</button>
          <span style={{ color: '#E5E5E5', margin: '0 2px' }}>/</span>
          <span>{l1.label}</span>
          <span style={{ color: '#E5E5E5', margin: '0 2px' }}>/</span>
          <span>{l2.label}</span>
          <span style={{ color: '#E5E5E5', margin: '0 2px' }}>/</span>
          <span className="font-bold" style={{ color: '#171717' }}>{l3.label}</span>
        </div>

        <div className="relative mb-2">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: '#888888' }}>🔍</span>
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="성분명, 기능, 비타민 C 등 검색..."
            className="w-full pl-9 pr-9 py-2.5 rounded-md text-sm outline-none"
            style={{ background: '#FFFFFF', border: '1px solid #E5E5E5', color: '#171717' }} />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: '#888888' }}>✕</button>
          )}
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          <button onClick={() => setCatFilter('all')}
            className="flex-shrink-0 px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap"
            style={catFilter === 'all'
              ? { background: '#171717', color: 'white' }
              : { background: '#FFFFFF', color: '#444444', border: '1px solid #E5E5E5' }}>
            전체
          </button>
          {Object.entries(CATEGORIES).map(([key, cat]) => (
            <button key={key} onClick={() => setCatFilter(catFilter === key ? 'all' : key)}
              className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap"
              style={catFilter === key
                ? { background: cat.color, color: 'white' }
                : { background: '#FFFFFF', color: cat.color, border: `1px solid ${cat.color}40` }}>
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>
        <p className="text-[10px] mt-1" style={{ color: '#888888' }}>{filtered.length}종</p>
      </div>

      {dictIngredients.length > 0 && (
        <div className="px-4 pt-3 pb-2">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#888888' }}>📌 성분사전 선택 항목</p>
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {dictIngredients.map((ing) => {
              const inFormula = selectedIds.has(ing.id);
              return (
                <button key={ing.id}
                  onClick={() => inFormula ? onRemove(ing.id) : onAdd(ing)}
                  className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold transition-all active:scale-95"
                  style={inFormula
                    ? { background: '#0072F5', color: 'white' }
                    : { background: '#FFFFFF', color: '#171717', border: '1px solid #E5E5E5' }}>
                  <span>{ing.emoji}</span>
                  <span>{ing.name}</span>
                  {inFormula && <span className="opacity-80">✓</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="px-4 pt-3 grid grid-cols-2 gap-2 pb-32">
        {filtered.map((ing) => (
          <IngredientCard key={ing.id} ingredient={ing}
            onClick={onIngredientClick}
            inLab={selectedIds.has(ing.id)}
            onLabToggle={(i) => selectedIds.has(i.id) ? onRemove(i.id) : onAdd(i)} />
        ))}
      </div>

      {formula.length > 0 && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-[480px] px-4 z-20">
          <button onClick={onNext}
            className="w-full py-4 rounded-lg text-white font-bold text-sm flex items-center justify-center gap-2"
            style={{ background: '#0072F5', boxShadow: '0 4px 16px rgba(0,114,245,0.35)' }}>
            ⚗️ {formula.length}개 성분 선택됨 — 배합 확인하기
          </button>
        </div>
      )}
    </div>
  );
}

function FormulaGuideDrawer({ l3, onClose }) {
  const defaults = l3.defaults || {};
  const entries = Object.entries(defaults).sort((a, b) => b[1] - a[1]);
  const roleNote = {
    base: '제형의 기본 베이스 (정제수, 글리쾜)',
    emollient: '제형에 유연성·유분감 부여',
    moisturizing: '수분 보유·흥습 역할',
    surfactant: '세정·유화 (세안제에서 핵심)',
    thickener: '점도·텍스처 조절',
    preservative: '미생물 억제, 제품 안정화',
    antioxidant: '산화 방지, 원료 안정화',
    phadjuster: '제품 pH 범위 조절',
    chelating: '금속이온 봉쏄, 방부 보조',
    filmformer: '표면 피막 형성, 지속력',
    sunscreen: '자외선 차단 (화학/물리)',
    brightening: '멜라닌 억제, 미백 기능',
    antiaging: '주름 개선, 탄력 강화',
    exfoliant: '각질 제거, 피부 결 개선',
    soothing: '피부 진정·항염',
    fermented: '발효 유래 생체활성 성분',
    plantextract: '식물 기능성 추출물',
    haircare: '모발·두피 기능 성분',
    fragrance: '향취 부여 (소량 사용)',
    mineral: '색상·미네랄 기능',
  };

  return (
    <>
      <div className="fixed inset-0 z-40" style={{ background: 'rgba(0,0,0,0.3)' }} onClick={onClose} />
      <div className="fixed top-0 right-0 h-full z-50 flex flex-col"
        style={{
          width: 'min(320px, 88vw)',
          background: '#FFFFFF',
          borderLeft: '1px solid #E5E5E5',
          boxShadow: '-4px 0 20px rgba(0,0,0,0.08)',
          animation: 'slideInRight 0.18s ease-out',
        }}>
        <div className="flex items-center justify-between px-4 pt-5 pb-3 flex-shrink-0"
          style={{ borderBottom: '1px solid #E5E5E5' }}>
          <div>
            <p className="font-bold text-sm" style={{ color: '#171717' }}>📋 배합 가이드</p>
            <p className="text-[10px] mt-0.5" style={{ color: '#888888' }}>{l3.icon} {l3.label} 보편적 비율</p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-md flex items-center justify-center font-bold text-sm"
            style={{ background: '#F4F4F5', color: '#444444' }}>✕</button>
        </div>
        <div className="px-4 py-2.5 flex-shrink-0"
          style={{ background: '#FFFBEB', borderBottom: '1px solid #FDE68A' }}>
          <p className="text-[10px] text-amber-700 leading-relaxed">
            💡 아래 비율은 업계 보편 기준입니다.<br/>실제 처방은 제형·원료 특성에 따라 조정하세요.
          </p>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
          {entries.map(([catKey, pct]) => {
            const cat = CATEGORIES[catKey] || { label: catKey, icon: '•', color: '#6B7280', bg: '#F3F4F6' };
            const note = roleNote[catKey] || '';
            const maxPct = entries[0][1];
            const barW = Math.min((pct / maxPct) * 100, 100);
            return (
              <div key={catKey} className="rounded-md p-3"
                style={{ background: '#FFFFFF', border: '1px solid #E5E5E5', borderLeft: `3px solid ${cat.color}` }}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{cat.icon}</span>
                    <span className="text-xs font-semibold" style={{ color: cat.color }}>{cat.label}</span>
                  </div>
                  <span className="text-sm font-bold" style={{ color: '#171717' }}>~{pct}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full overflow-hidden mb-1.5" style={{ background: '#F4F4F5' }}>
                  <div className="h-full rounded-full" style={{ width: `${barW}%`, background: cat.color, opacity: 0.8 }} />
                </div>
                {note && <p className="text-[10px] leading-snug" style={{ color: '#888888' }}>{note}</p>}
              </div>
            );
          })}
          <div className="rounded-md p-3 mt-1"
            style={{ background: '#EFF6FF', border: '1px solid #DBEAFE' }}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-blue-700">가이드 합계</span>
              <span className="text-sm font-bold text-blue-700">{entries.reduce((s, [, v]) => s + v, 0).toFixed(1)}%</span>
            </div>
            <p className="text-[10px] text-blue-500 mt-1">잔여분은 향료·착색제 등 소량 성분으로 채욹니다</p>
          </div>
        </div>
      </div>
      <style>{`@keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
    </>
  );
}

const UNIT_OPTIONS = [
  { label: '0.01%', value: 0.01 },
  { label: '0.1%', value: 0.1 },
  { label: '0.5%', value: 0.5 },
  { label: '1%', value: 1 },
];

function FormulaStep({ l1, l2, l3, formula, onBack, onPctChange, onRemove, onSaveFormula }) {
  const [guideOpen, setGuideOpen] = useState(false);
  const [unit, setUnit] = useState(0.5);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const total = formula.reduce((sum, f) => sum + f.pct, 0);
  const ids = formula.map((f) => f.ingredient.id);
  const matched = findSynergies(ids);
  const painPoints = [...new Set(formula.flatMap((f) => f.ingredient.painPoints))];
  const pctColor = total > 100 ? '#DC2626' : total > 90 ? '#D97706' : '#16a34a';

  function adjust(id, direction) {
    const item = formula.find((f) => f.ingredient.id === id);
    if (!item) return;
    const conc = parseConc(item.ingredient.concentration);
    const delta = direction * unit;
    const next = Math.max(0, Math.min(conc.max || 100, parseFloat((item.pct + delta).toFixed(3))));
    onPctChange(id, next);
  }

  async function handleCopy() {
    const text = [
      `${l3.icon} ${l3.label} (${l1.label} · ${l2.label})`,
      '─'.repeat(24),
      ...formula.map((f) => `${f.ingredient.emoji} ${f.ingredient.name}: ${f.pct.toFixed(2)}%`),
      '─'.repeat(24),
      `종 함량: ${total.toFixed(2)}%`,
    ].join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {}
  }

  function handleSave() {
    if (!onSaveFormula) return;
    const data = {
      id: Date.now(),
      name: l3.label,
      icon: l3.icon,
      l1Label: l1.label,
      l2Label: l2.label,
      createdAt: new Date().toLocaleDateString('ko'),
      items: formula.map((f) => ({ name: f.ingredient.name, emoji: f.ingredient.emoji, pct: f.pct })),
    };
    onSaveFormula(data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="px-4 pt-3 pb-36">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: '#888888' }}>← 성분 선택</button>
        <div className="flex items-center gap-2">
          <button onClick={() => setGuideOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all active:scale-95"
            style={guideOpen
              ? { background: '#0072F5', color: 'white' }
              : { background: '#FFFFFF', color: '#444444', border: '1px solid #E5E5E5' }}>
            <span>📋</span><span>배합 가이드</span>
          </button>
          <div className="flex items-center gap-1">
            <span className="text-lg">{l3.icon}</span>
            <div className="flex flex-col items-end">
              <span className="font-bold text-xs" style={{ color: '#171717' }}>{l3.label}</span>
              <span className="text-[10px]" style={{ color: '#888888' }}>{l1.label} · {l2.label}</span>
            </div>
          </div>
        </div>
      </div>

      {guideOpen && <FormulaGuideDrawer l3={l3} onClose={() => setGuideOpen(false)} />}

      <div className="rounded-lg p-4 mb-4" style={SURFACE}>
        <div className="flex items-center justify-between mb-2">
          <p className="font-semibold text-sm" style={{ color: '#171717' }}>종 배합 함량</p>
          <p className="font-bold text-lg" style={{ color: pctColor }}>{total.toFixed(1)}%</p>
        </div>
        <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: '#F4F4F5' }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(total, 100)}%`, background: pctColor }} />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px]" style={{ color: '#888888' }}>0%</span>
          {total > 100
            ? <span className="text-[10px] font-bold" style={{ color: '#DC2626' }}>100% 초과!</span>
            : <span className="text-[10px]" style={{ color: '#888888' }}>잔량 {(100 - total).toFixed(1)}%</span>}
          <span className="text-[10px]" style={{ color: '#888888' }}>100%</span>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#888888' }}>조절 단위</p>
        <div className="flex gap-1.5">
          {UNIT_OPTIONS.map((opt) => (
            <button key={opt.value} onClick={() => setUnit(opt.value)}
              className="flex-1 py-2 rounded-md text-xs font-semibold transition-all active:scale-95"
              style={unit === opt.value
                ? { background: '#171717', color: 'white' }
                : { background: '#FFFFFF', color: '#444444', border: '1px solid #E5E5E5' }}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <p className="text-[10px] font-bold uppercase tracking-widest mb-2.5" style={{ color: '#888888' }}>성분 함량 조절</p>
      <div className="space-y-2 mb-5">
        {formula.map(({ ingredient, pct }) => {
          const cat = CATEGORIES[ingredient.category] || {};
          const conc = parseConc(ingredient.concentration);
          return (
            <div key={ingredient.id} className="rounded-lg overflow-hidden" style={SURFACE}>
              <div className="flex items-center px-4 pt-3 pb-1.5">
                <div className="w-8 h-8 rounded-md flex items-center justify-center text-lg mr-2.5 flex-shrink-0"
                  style={{ background: '#F4F4F5' }}>
                  {ingredient.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate" style={{ color: '#171717' }}>{ingredient.name}</p>
                  <p className="text-[10px]" style={{ color: cat.color }}>{cat.icon} {cat.label}</p>
                </div>
                <button onClick={() => onRemove(ingredient.id)}
                  className="w-7 h-7 rounded-md flex items-center justify-center ml-2 flex-shrink-0"
                  style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}>×</button>
              </div>
              <div className="px-4 pb-3">
                {ingredient.concentration && (
                  <p className="text-[10px] mb-1.5" style={{ color: '#888888' }}>권장 농도: {ingredient.concentration}</p>
                )}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: '#F4F4F5' }}>
                    <div className="h-full rounded-full transition-all"
                      style={{ width: `${Math.min((pct / (conc.max || Math.max(pct, 5))) * 100, 100)}%`, background: cat.color || '#0072F5' }} />
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => adjust(ingredient.id, -1)}
                      className="w-7 h-7 rounded-md font-bold text-sm flex items-center justify-center"
                      style={{ background: '#F4F4F5', color: '#444444' }}>−</button>
                    <span className="text-sm font-bold w-16 text-center" style={{ color: '#171717' }}>{pct.toFixed(2)}%</span>
                    <button onClick={() => adjust(ingredient.id, +1)}
                      className="w-7 h-7 rounded-md font-bold text-sm flex items-center justify-center text-white"
                      style={{ background: cat.color || '#0072F5' }}>+</button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {painPoints.length > 0 && (
        <div className="rounded-lg p-4 mb-3" style={SURFACE}>
          <p className="font-semibold text-sm mb-2.5" style={{ color: '#171717' }}>🎯 이 배합이 해결하는 피부 고민</p>
          <div className="flex flex-wrap gap-1.5">
            {painPoints.map((p) => (
              <span key={p} className="text-xs px-2.5 py-1 rounded font-medium"
                style={{ background: '#F4F4F5', color: '#444444', border: '1px solid #E5E5E5' }}>
                {p}
              </span>
            ))}
          </div>
        </div>
      )}

      {matched.length > 0 && (
        <div className="rounded-lg p-4 mb-3" style={SURFACE}>
          <p className="font-semibold text-sm mb-2.5" style={{ color: '#171717' }}>⭐ 시너지 조합 발견</p>
          <div className="space-y-2">
            {matched.map((s, i) => (
              <div key={i} className="rounded-md p-3"
                style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                <p className="font-semibold text-xs mb-1" style={{ color: '#171717' }}>{s.label}</p>
                <p className="text-xs leading-relaxed" style={{ color: '#444444' }}>{s.effect}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {total > 100 && (
        <div className="rounded-md p-3.5"
          style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
          <p className="text-xs font-semibold" style={{ color: '#DC2626' }}>⚠️ 종 함량이 100%를 초과합니다.</p>
        </div>
      )}

      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-[480px] px-4 z-20 flex gap-2">
        <button onClick={handleCopy}
          className="flex-1 py-3.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-1.5 transition-all active:scale-[0.97]"
          style={copied
            ? { background: '#F0FDF4', color: '#15803D', border: '1px solid #BBF7D0' }
            : { background: '#FFFFFF', color: '#444444', border: '1px solid #E5E5E5' }}>
          {copied ? '✓ 복사됨!' : '📋 복사'}
        </button>
        <button onClick={handleSave}
          className="flex-1 py-3.5 rounded-lg font-bold text-sm text-white flex items-center justify-center gap-1.5 transition-all active:scale-[0.97]"
          style={saved
            ? { background: '#15803D' }
            : { background: '#0072F5', boxShadow: '0 4px 12px rgba(0,114,245,0.3)' }}>
          {saved ? '✓ 저장됨!' : '💾 저장'}
        </button>
      </div>
    </div>
  );
}

function IngredientModal({ ingredient, onClose, inLab, onToggle }) {
  if (!ingredient) return null;
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end"
      style={{ background: 'rgba(0,0,0,0.4)' }} onClick={onClose}>
      <div className="rounded-t-2xl max-w-[480px] w-full mx-auto max-h-[85vh] flex flex-col"
        style={{ background: '#FFFFFF', border: '1px solid #E5E5E5', borderBottom: 'none' }}
        onClick={(e) => e.stopPropagation()}>
        <div className="flex-shrink-0 pt-3 pb-2 px-4">
          <div className="w-10 h-1 rounded-full mx-auto" style={{ background: '#E5E5E5' }} />
        </div>
        <div className="overflow-y-auto flex-1 pb-4">
          <IngredientCard ingredient={ingredient} modal />
        </div>
        <div className="flex-shrink-0 px-4 pb-6 pt-2 flex gap-2"
          style={{ borderTop: '1px solid #E5E5E5' }}>
          <button onClick={onClose}
            className="flex-1 py-3 rounded-lg font-semibold text-sm"
            style={{ background: '#F4F4F5', color: '#444444' }}>닫기</button>
          <button onClick={() => { onToggle(ingredient); onClose(); }}
            className="flex-1 py-3 rounded-lg font-bold text-sm text-white"
            style={{ background: inLab ? '#DC2626' : '#0072F5' }}>
            {inLab ? '제거' : '배합에 추가 +'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LabTab({ savedFormulas, onSaveFormula, onDeleteFormula, labDictIds }) {
  const [step, setStep] = useState(1);
  const [l1, setL1] = useState(null);
  const [l2, setL2] = useState(null);
  const [l3, setL3] = useState(null);
  const [formula, setFormula] = useState([]);
  const [modal, setModal] = useState(null);

  const selectedIds = new Set(formula.map((f) => f.ingredient.id));

  function handleAdd(ingredient) {
    if (selectedIds.has(ingredient.id)) return;
    const pct = suggestPct(ingredient, l3);
    setFormula((prev) => [...prev, { ingredient, pct: parseFloat(pct.toFixed(2)) }]);
  }
  function handleRemove(id) { setFormula((prev) => prev.filter((f) => f.ingredient.id !== id)); }
  function handlePctChange(id, pct) { setFormula((prev) => prev.map((f) => f.ingredient.id === id ? { ...f, pct } : f)); }

  function selectL1(item) { setL1(item); setStep(2); }
  function selectL2(item) { setL2(item); setStep(3); }
  function selectL3(item) { setL3(item); setFormula([]); setStep(4); }
  function reset() { setStep(1); setL1(null); setL2(null); setL3(null); setFormula([]); }

  return (
    <div>
      {step === 1 && <Step1 onSelect={selectL1} savedFormulas={savedFormulas} onDeleteFormula={onDeleteFormula} labDictIds={labDictIds} />}
      {step === 2 && <Step2 l1={l1} onSelect={selectL2} onBack={reset} />}
      {step === 3 && <Step3 l1={l1} l2={l2} onSelect={selectL3} onBack={() => setStep(2)} />}
      {step === 4 && (
        <BuildStep l1={l1} l2={l2} l3={l3}
          formula={formula} onAdd={handleAdd} onRemove={handleRemove}
          onNext={() => setStep(5)} onBack={() => setStep(3)}
          onIngredientClick={setModal}
          labDictIds={labDictIds} />
      )}
      {step === 5 && (
        <FormulaStep l1={l1} l2={l2} l3={l3}
          formula={formula} onBack={() => setStep(4)}
          onPctChange={handlePctChange} onRemove={handleRemove}
          onSaveFormula={onSaveFormula} />
      )}
      <IngredientModal ingredient={modal} onClose={() => setModal(null)}
        inLab={modal ? selectedIds.has(modal.id) : false}
        onToggle={(ing) => selectedIds.has(ing.id) ? handleRemove(ing.id) : handleAdd(ing)} />
    </div>
  );
}
