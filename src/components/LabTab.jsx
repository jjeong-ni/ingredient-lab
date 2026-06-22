import { useState, useMemo } from 'react';
import { ingredients, CATEGORIES, synergies } from '../data/ingredients';
import { PRODUCT_TREE, suggestPct, parseConc } from '../data/productTypes';
import IngredientCard from './IngredientCard';

function findSynergies(ids) {
  return synergies.filter((s) => s.ids.every((id) => ids.includes(id)));
}

/* ─── Step 1: 1차 선택 (페이스/바디/헤어) ─── */
function Step1({ onSelect }) {
  return (
    <div className="px-4 pt-2 pb-6">
      <div className="rounded-2xl p-4 mb-5"
        style={{ background: 'linear-gradient(135deg,#7C3AED 0%,#4B9EFF 100%)' }}>
        <p className="font-extrabold text-white text-base">⚗️ 성분 실험실</p>
        <p className="text-white/70 text-xs mt-1">만들 제품 유형을 선택하면<br/>성분별 권장 함량을 안내해드려요</p>
      </div>

      <p className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-3">카테고리 선택</p>
      <div className="grid grid-cols-3 gap-3">
        {PRODUCT_TREE.map((l1) => (
          <button key={l1.id} onClick={() => onSelect(l1)}
            className="flex flex-col items-center gap-2.5 p-4 rounded-2xl bg-white transition-all active:scale-95"
            style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.08)', border: `2px solid ${l1.color}20` }}>
            <span className="text-4xl">{l1.icon}</span>
            <span className="font-extrabold text-gray-800 text-sm">{l1.label}</span>
            <span className="text-[10px] text-gray-400 text-center leading-snug">{l1.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Step 2: 2차 선택 (클렌저/기초/색조 등) ─── */
function Step2({ l1, onSelect, onBack }) {
  return (
    <div className="px-4 pt-3 pb-6">
      {/* 브레드크럼 헤더 */}
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-gray-500 font-semibold">
          ←
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xl">{l1.icon}</span>
          <span className="font-extrabold text-gray-800 text-base">{l1.label}</span>
        </div>
      </div>

      <p className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-3">제품군 선택</p>
      <div className="space-y-2">
        {l1.children.map((l2) => (
          <button key={l2.id} onClick={() => onSelect(l2)}
            className="w-full flex items-center gap-3 p-4 rounded-2xl bg-white transition-all active:scale-[0.98]"
            style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.07)', border: `1.5px solid ${l2.color}25` }}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: l2.bg }}>
              {l2.icon}
            </div>
            <div className="flex-1 text-left">
              <p className="font-bold text-gray-900 text-sm">{l2.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{l2.desc}</p>
            </div>
            <div className="flex flex-col items-end flex-shrink-0">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full mb-1"
                style={{ background: l2.bg, color: l2.color }}>
                {l2.children.length}종
              </span>
              <span className="text-gray-300 text-sm">→</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Step 3: 3차 선택 (폼/오일/워터 등) ─── */
function Step3({ l1, l2, onSelect, onBack }) {
  return (
    <div className="px-4 pt-3 pb-6">
      {/* 브레드크럼 헤더 */}
      <div className="flex items-center gap-1.5 mb-4 text-sm text-gray-500 font-semibold flex-wrap">
        <button onClick={onBack} className="flex items-center gap-1">← {l1.label}</button>
        <span className="text-gray-300">/</span>
        <span className="font-extrabold text-gray-800">{l2.label}</span>
      </div>

      <p className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-3">제품 유형 선택</p>
      <div className="grid grid-cols-2 gap-2">
        {l2.children.map((l3) => (
          <button key={l3.id} onClick={() => onSelect(l3)}
            className="flex flex-col items-start gap-2 p-3.5 rounded-2xl bg-white transition-all active:scale-95"
            style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.07)', border: `1.5px solid ${l2.color}25` }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl"
              style={{ background: l2.bg }}>
              {l3.icon}
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm leading-tight">{l3.label}</p>
              <p className="text-[10px] text-gray-400 mt-0.5 leading-snug">{l3.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Step 4: 성분 선택 ─── */
function BuildStep({ l1, l2, l3, formula, onAdd, onRemove, onNext, onBack, onIngredientClick }) {
  const [catFilter, setCatFilter] = useState('all');
  const [search, setSearch] = useState('');
  const selectedIds = new Set(formula.map((f) => f.ingredient.id));

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ingredients.filter((i) => {
      if (catFilter !== 'all' && i.category !== catFilter) return false;
      if (q && !i.name.includes(q) && !i.nameEn.toLowerCase().includes(q) && !i.function.includes(q)) return false;
      return true;
    }).sort((a, b) => a.name.localeCompare(b.name, 'ko'));
  }, [catFilter, search]);

  return (
    <div>
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur px-4 pt-3 pb-2"
        style={{ borderBottom: '1px solid #F3F4F6' }}>
        {/* 브레드크럼 */}
        <div className="flex items-center gap-1 text-xs text-gray-400 font-semibold mb-2 flex-wrap">
          <button onClick={onBack} className="flex items-center gap-1 text-[#4B9EFF]">← 변경</button>
          <span className="text-gray-200 mx-1">/</span>
          <span>{l1.label}</span>
          <span className="text-gray-200 mx-1">/</span>
          <span>{l2.label}</span>
          <span className="text-gray-200 mx-1">/</span>
          <span className="font-extrabold text-gray-700">{l3.label}</span>
        </div>

        {/* 검색 */}
        <div className="relative mb-2">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="성분명, 기능 검색..."
            className="w-full pl-9 pr-9 py-2.5 bg-gray-50 rounded-xl text-sm outline-none" />
          {search && (
            <button onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">✕</button>
          )}
        </div>

        {/* 카테고리 칩 */}
        <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          <button onClick={() => setCatFilter('all')}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap"
            style={catFilter === 'all' ? { background: '#4B9EFF', color: 'white' } : { background: '#F3F4F6', color: '#6B7280' }}>
            전체
          </button>
          {Object.entries(CATEGORIES).map(([key, cat]) => (
            <button key={key} onClick={() => setCatFilter(catFilter === key ? 'all' : key)}
              className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap"
              style={catFilter === key
                ? { background: cat.color, color: 'white' }
                : { background: 'white', color: cat.color, border: `1.5px solid ${cat.color}40` }}>
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>
        <p className="text-[10px] text-gray-400 mt-1">{filtered.length}종</p>
      </div>

      <div className="px-4 pt-3 space-y-2 pb-32">
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
            className="w-full py-4 rounded-2xl text-white font-extrabold text-sm flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg,#4B9EFF,#7C3AED)', boxShadow: '0 4px 20px rgba(75,158,255,0.4)' }}>
            ⚗️ {formula.length}개 성분 선택됨 — 배합 확인하기
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── 배합 가이드 드로어 ─── */
function FormulaGuideDrawer({ l3, onClose }) {
  const defaults = l3.defaults || {};
  const entries = Object.entries(defaults).sort((a, b) => b[1] - a[1]);

  // 카테고리별 전형적인 기능 설명
  const roleNote = {
    base: '제형의 기본 베이스 (정제수, 글리콜)',
    emollient: '제형에 유연성·유분감 부여',
    moisturizing: '수분 보유·흡습 역할',
    surfactant: '세정·유화 (세안제에서 핵심)',
    thickener: '점도·텍스처 조절',
    preservative: '미생물 억제, 제품 안정화',
    antioxidant: '산화 방지, 원료 안정화',
    phadjuster: '제품 pH 범위 조절',
    chelating: '금속이온 봉쇄, 방부 보조',
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
      {/* 딤 배경 */}
      <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />

      {/* 드로어 패널 (오른쪽에서 슬라이드인) */}
      <div className="fixed top-0 right-0 h-full z-50 flex flex-col bg-white"
        style={{
          width: 'min(320px, 88vw)',
          boxShadow: '-4px 0 24px rgba(0,0,0,0.15)',
          animation: 'slideInRight 0.22s ease-out',
        }}>
        {/* 헤더 */}
        <div className="flex items-center justify-between px-4 pt-5 pb-3 flex-shrink-0"
          style={{ borderBottom: '1px solid #F3F4F6' }}>
          <div>
            <p className="font-extrabold text-gray-900 text-sm">📋 배합 가이드</p>
            <p className="text-[10px] text-gray-400 mt-0.5">{l3.icon} {l3.label} 보편적 비율</p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-sm">
            ✕
          </button>
        </div>

        {/* 가이드 설명 */}
        <div className="px-4 py-2.5 flex-shrink-0"
          style={{ background: '#FFFBEB', borderBottom: '1px solid #FDE68A' }}>
          <p className="text-[10px] text-amber-700 leading-relaxed">
            💡 아래 비율은 업계 보편 기준입니다.<br/>
            실제 처방은 제형·원료 특성에 따라 조정하세요.
          </p>
        </div>

        {/* 카테고리별 권장 함량 목록 */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
          {entries.map(([catKey, pct]) => {
            const cat = CATEGORIES[catKey] || { label: catKey, icon: '•', color: '#6B7280', bg: '#F3F4F6' };
            const note = roleNote[catKey] || '';
            // 시각적 바 너비: 최대 pct를 기준으로 상대 비율
            const maxPct = entries[0][1];
            const barW = Math.min((pct / maxPct) * 100, 100);
            return (
              <div key={catKey} className="rounded-xl p-3"
                style={{ background: cat.bg, border: `1px solid ${cat.color}20` }}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{cat.icon}</span>
                    <span className="text-xs font-bold" style={{ color: cat.color }}>{cat.label}</span>
                  </div>
                  <span className="text-sm font-extrabold" style={{ color: cat.color }}>
                    ~{pct}%
                  </span>
                </div>
                {/* 비율 바 */}
                <div className="w-full h-1.5 bg-white/60 rounded-full overflow-hidden mb-1.5">
                  <div className="h-full rounded-full"
                    style={{ width: `${barW}%`, background: cat.color, opacity: 0.7 }} />
                </div>
                {note && <p className="text-[10px] text-gray-500 leading-snug">{note}</p>}
              </div>
            );
          })}

          {/* 합계 */}
          <div className="rounded-xl p-3 mt-1" style={{ background: '#F0F9FF', border: '1px solid #BAE6FD' }}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-700">가이드 합계</span>
              <span className="text-sm font-extrabold text-blue-700">
                {entries.reduce((s, [, v]) => s + v, 0).toFixed(1)}%
              </span>
            </div>
            <p className="text-[10px] text-blue-500 mt-1">
              잔여분은 향료·착색제 등 소량 성분으로 채웁니다
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </>
  );
}

/* ─── Step 5: 배합 확인 ─── */
function FormulaStep({ l1, l2, l3, formula, onBack, onPctChange, onRemove }) {
  const [guideOpen, setGuideOpen] = useState(false);
  const total = formula.reduce((sum, f) => sum + f.pct, 0);
  const ids = formula.map((f) => f.ingredient.id);
  const matched = findSynergies(ids);
  const painPoints = [...new Set(formula.flatMap((f) => f.ingredient.painPoints))];
  const pctColor = total > 100 ? '#EF4444' : total > 90 ? '#F59E0B' : '#10B981';

  function adjust(id, delta) {
    const item = formula.find((f) => f.ingredient.id === id);
    if (!item) return;
    const conc = parseConc(item.ingredient.concentration);
    const next = Math.max(0.1, Math.min(conc.max || 100, parseFloat((item.pct + delta).toFixed(1))));
    onPctChange(id, next);
  }

  return (
    <div className="px-4 pt-3 pb-28">
      {/* 브레드크럼 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-500 font-semibold">← 성분 선택</button>
        <div className="flex items-center gap-2">
          {/* 가이드 토글 버튼 */}
          <button onClick={() => setGuideOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95"
            style={guideOpen
              ? { background: '#4B9EFF', color: 'white' }
              : { background: '#EFF6FF', color: '#2563EB', border: '1.5px solid #BFDBFE' }}>
            <span>📋</span>
            <span>배합 가이드</span>
          </button>
          <div className="flex items-center gap-1 text-xs">
            <span className="text-lg">{l3.icon}</span>
            <div className="flex flex-col items-end">
              <span className="font-extrabold text-gray-800 text-xs">{l3.label}</span>
              <span className="text-[10px] text-gray-400">{l1.label} · {l2.label}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 가이드 드로어 */}
      {guideOpen && <FormulaGuideDrawer l3={l3} onClose={() => setGuideOpen(false)} />}

      {/* 총 함량 바 */}
      <div className="bg-white rounded-2xl p-4 mb-4" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <div className="flex items-center justify-between mb-2">
          <p className="font-bold text-gray-800 text-sm">총 배합 함량</p>
          <p className="font-extrabold text-lg" style={{ color: pctColor }}>{total.toFixed(1)}%</p>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all"
            style={{ width: `${Math.min(total, 100)}%`, background: pctColor }} />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-gray-400">0%</span>
          {total > 100
            ? <span className="text-[10px] font-bold text-red-500">100% 초과!</span>
            : <span className="text-[10px] text-gray-400">잔량 {(100 - total).toFixed(1)}%</span>}
          <span className="text-[10px] text-gray-400">100%</span>
        </div>
      </div>

      <p className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-2.5">성분 함량 조절</p>
      <div className="space-y-2 mb-5">
        {formula.map(({ ingredient, pct }) => {
          const cat = CATEGORIES[ingredient.category] || {};
          const conc = parseConc(ingredient.concentration);
          return (
            <div key={ingredient.id} className="bg-white rounded-2xl overflow-hidden"
              style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
              <div className="flex items-center px-4 pt-3 pb-1.5">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-lg mr-2.5 flex-shrink-0"
                  style={{ background: cat.bg }}>
                  {ingredient.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm truncate">{ingredient.name}</p>
                  <p className="text-[10px]" style={{ color: cat.color }}>{cat.icon} {cat.label}</p>
                </div>
                <button onClick={() => onRemove(ingredient.id)}
                  className="w-7 h-7 rounded-lg bg-red-50 text-red-400 flex items-center justify-center ml-2 flex-shrink-0">
                  ×
                </button>
              </div>
              <div className="px-4 pb-3">
                {ingredient.concentration && (
                  <p className="text-[10px] text-gray-400 mb-1.5">권장 농도: {ingredient.concentration}</p>
                )}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all"
                      style={{ width: `${Math.min((pct / (conc.max || Math.max(pct, 5))) * 100, 100)}%`, background: cat.color || '#4B9EFF' }} />
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => adjust(ingredient.id, -0.5)}
                      className="w-7 h-7 rounded-lg bg-gray-100 text-gray-600 font-bold text-sm flex items-center justify-center">−</button>
                    <span className="text-sm font-extrabold text-gray-800 w-14 text-center">{pct.toFixed(1)}%</span>
                    <button onClick={() => adjust(ingredient.id, +0.5)}
                      className="w-7 h-7 rounded-lg font-bold text-sm flex items-center justify-center text-white"
                      style={{ background: cat.color || '#4B9EFF' }}>+</button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {painPoints.length > 0 && (
        <div className="bg-white rounded-2xl p-4 mb-3" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <p className="font-bold text-gray-800 text-sm mb-2.5">🎯 이 배합이 해결하는 피부 고민</p>
          <div className="flex flex-wrap gap-1.5">
            {painPoints.map((p) => (
              <span key={p} className="text-xs px-2.5 py-1 rounded-full font-medium bg-blue-50 text-blue-600">{p}</span>
            ))}
          </div>
        </div>
      )}

      {matched.length > 0 && (
        <div className="bg-white rounded-2xl p-4 mb-3" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <p className="font-bold text-gray-800 text-sm mb-2.5">⭐ 시너지 조합 발견</p>
          <div className="space-y-2">
            {matched.map((s, i) => (
              <div key={i} className="rounded-xl p-3" style={{ background: '#F0FDF4', border: '1.5px solid #BBF7D0' }}>
                <p className="font-bold text-gray-900 text-xs mb-1">{s.label}</p>
                <p className="text-xs text-gray-600 leading-relaxed">{s.effect}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {total > 100 && (
        <div className="rounded-xl p-3.5" style={{ background: '#FEF2F2', border: '1.5px solid #FECACA' }}>
          <p className="text-xs font-bold text-red-600">⚠️ 총 함량이 100%를 초과합니다.</p>
        </div>
      )}
    </div>
  );
}

/* ─── 성분 상세 모달 ─── */
function IngredientModal({ ingredient, onClose, inLab, onToggle }) {
  if (!ingredient) return null;
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end"
      style={{ background: 'rgba(0,0,0,0.4)' }} onClick={onClose}>
      <div className="bg-white rounded-t-3xl max-w-[480px] w-full mx-auto max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex-shrink-0 pt-3 pb-2 px-4">
          <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto" />
        </div>
        <div className="overflow-y-auto flex-1 pb-4">
          <IngredientCard ingredient={ingredient} modal />
        </div>
        <div className="flex-shrink-0 px-4 pb-6 pt-2 border-t border-gray-100 flex gap-2">
          <button onClick={onClose}
            className="flex-1 py-3 rounded-2xl bg-gray-100 text-gray-600 font-bold text-sm">닫기</button>
          <button onClick={() => { onToggle(ingredient); onClose(); }}
            className="flex-1 py-3 rounded-2xl font-bold text-sm text-white"
            style={{ background: inLab ? '#EF4444' : '#4B9EFF' }}>
            {inLab ? '제거' : '배합에 추가 +'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── 메인 LabTab ─── */
export default function LabTab() {
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
    setFormula((prev) => [...prev, { ingredient, pct: parseFloat(pct.toFixed(1)) }]);
  }
  function handleRemove(id) { setFormula((prev) => prev.filter((f) => f.ingredient.id !== id)); }
  function handlePctChange(id, pct) { setFormula((prev) => prev.map((f) => f.ingredient.id === id ? { ...f, pct } : f)); }

  function selectL1(item) { setL1(item); setStep(2); }
  function selectL2(item) { setL2(item); setStep(3); }
  function selectL3(item) { setL3(item); setFormula([]); setStep(4); }
  function reset() { setStep(1); setL1(null); setL2(null); setL3(null); setFormula([]); }

  return (
    <div>
      {step === 1 && <Step1 onSelect={selectL1} />}
      {step === 2 && <Step2 l1={l1} onSelect={selectL2} onBack={reset} />}
      {step === 3 && <Step3 l1={l1} l2={l2} onSelect={selectL3} onBack={() => setStep(2)} />}
      {step === 4 && (
        <BuildStep l1={l1} l2={l2} l3={l3}
          formula={formula} onAdd={handleAdd} onRemove={handleRemove}
          onNext={() => setStep(5)} onBack={() => setStep(3)}
          onIngredientClick={setModal} />
      )}
      {step === 5 && (
        <FormulaStep l1={l1} l2={l2} l3={l3}
          formula={formula} onBack={() => setStep(4)}
          onPctChange={handlePctChange} onRemove={handleRemove} />
      )}

      <IngredientModal ingredient={modal} onClose={() => setModal(null)}
        inLab={modal ? selectedIds.has(modal.id) : false}
        onToggle={(ing) => selectedIds.has(ing.id) ? handleRemove(ing.id) : handleAdd(ing)} />
    </div>
  );
}
