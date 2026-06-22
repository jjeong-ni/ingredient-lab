import { CATEGORIES } from '../data/ingredients';

const safetyInfo = (n) => {
  if (n >= 5) return { text: '안전', dot: '#059669', bg: '#D1FAE5', color: '#059669' };
  if (n >= 4) return { text: '양호', dot: '#2563EB', bg: '#DBEAFE', color: '#2563EB' };
  if (n >= 3) return { text: '주의', dot: '#D97706', bg: '#FEF3C7', color: '#D97706' };
  return       { text: '경고', dot: '#DC2626', bg: '#FEE2E2', color: '#DC2626' };
};

/* ─── 상세 모달 뷰 ─────────────────────────────────────────────── */
function ModalView({ ingredient }) {
  const cat = CATEGORIES[ingredient.category] || {};
  const safety = safetyInfo(ingredient.safety);
  return (
    <div className="px-4 pb-2">
      {/* 헤더 카드 */}
      <div className="rounded-2xl p-4 mb-4 flex items-start gap-3"
        style={{ background: cat.bg || '#F8FAFC' }}>
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
          style={{ background: 'rgba(255,255,255,0.7)' }}>
          {ingredient.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full"
              style={{ background: 'rgba(255,255,255,0.8)', color: cat.color }}>
              {cat.icon} {cat.label}
            </span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full"
              style={{ background: safety.bg, color: safety.color }}>
              {safety.text}
            </span>
          </div>
          <h2 className="font-extrabold text-gray-900 text-base leading-tight">{ingredient.name}</h2>
          <p className="text-xs text-gray-400 mt-0.5 truncate">{ingredient.nameEn}</p>
        </div>
      </div>

      <div className="space-y-3.5">
        <InfoRow label="기능" value={ingredient.function} />
        <InfoRow label="추출원" value={ingredient.extraction} />

        <div>
          <SectionLabel>해결 피부 고민</SectionLabel>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {ingredient.painPoints.map((p) => (
              <span key={p} className="text-xs px-2.5 py-1 rounded-full font-semibold"
                style={{ background: cat.bg || '#F3F4F6', color: cat.color || '#6B7280' }}>
                {p}
              </span>
            ))}
          </div>
        </div>

        {ingredient.tags?.length > 0 && (
          <div>
            <SectionLabel>키워드</SectionLabel>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {ingredient.tags.map((t) => (
                <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 font-medium">
                  #{t}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-400 mb-1">권장 농도</p>
            <p className="font-bold text-gray-800 text-sm">{ingredient.concentration}</p>
          </div>
          <div className="rounded-xl p-3" style={{ background: safety.bg }}>
            <p className="text-xs mb-1.5" style={{ color: safety.color, opacity: 0.7 }}>안전도</p>
            <div className="flex gap-0.5 mb-1">
              {[1,2,3,4,5].map((i) => (
                <div key={i} className="flex-1 h-1.5 rounded-full"
                  style={{ background: i <= ingredient.safety ? safety.dot : '#E5E7EB' }} />
              ))}
            </div>
            <p className="font-bold text-xs" style={{ color: safety.color }}>{safety.text}</p>
          </div>
        </div>

        {ingredient.tip && (
          <div className="rounded-xl p-3.5" style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
            <p className="text-xs text-amber-700 leading-relaxed">
              <span className="font-bold">💡 </span>{ingredient.tip}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── 리스트 카드 ─────────────────────────────────────────────── */
export default function IngredientCard({ ingredient, onClick, inLab, onLabToggle, modal }) {
  const cat = CATEGORIES[ingredient.category] || {};
  const safety = safetyInfo(ingredient.safety);

  if (modal) return <ModalView ingredient={ingredient} />;

  return (
    <div
      onClick={() => onClick?.(ingredient)}
      className="bg-white rounded-2xl cursor-pointer transition-all active:scale-[0.98] overflow-hidden"
      style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.07)' }}
    >
      <div className="flex items-stretch">
        {/* 왼쪽 컬러 영역 */}
        <div className="flex flex-col items-center justify-center gap-1 py-3 flex-shrink-0"
          style={{ background: cat.bg || '#F8FAFC', width: 58 }}>
          <span className="text-2xl leading-none">{ingredient.emoji}</span>
          <span className="text-[9px] font-bold"
            style={{ color: cat.color }}>{cat.icon}</span>
        </div>

        {/* 중간 본문 */}
        <div className="flex-1 py-3 pl-3 pr-2 min-w-0">
          {/* 이름 + 카테고리 */}
          <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
            <h3 className="font-bold text-gray-900 text-sm leading-tight">{ingredient.name}</h3>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
              style={{ color: cat.color, background: cat.bg || '#F3F4F6' }}>
              {cat.label}
            </span>
          </div>

          {/* INCI */}
          <p className="text-[11px] text-gray-400 truncate mb-1.5">{ingredient.nameEn}</p>

          {/* 기능 */}
          <p className="text-xs text-gray-600 leading-snug line-clamp-2 mb-2">{ingredient.function}</p>

          {/* 페인포인트 태그 — 항상 gray 배경으로 가독성 확보 */}
          <div className="flex gap-1 flex-wrap">
            {ingredient.painPoints.slice(0, 3).map((p) => (
              <span key={p} className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-gray-100 text-gray-500">
                {p}
              </span>
            ))}
            {ingredient.painPoints.length > 3 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-400 font-medium">
                +{ingredient.painPoints.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* 오른쪽: 안전도 점 + 버튼 */}
        <div className="flex flex-col items-center justify-between py-3 pr-3 pl-1 gap-2 flex-shrink-0">
          {/* 안전도 — 점 + 짧은 텍스트 */}
          <div className="flex flex-col items-center gap-0.5">
            <div className="w-2 h-2 rounded-full" style={{ background: safety.dot }} />
            <span className="text-[10px] font-bold" style={{ color: safety.color }}>
              {safety.text}
            </span>
          </div>

          {/* 실험실 버튼 */}
          <button
            onClick={(e) => { e.stopPropagation(); onLabToggle?.(ingredient); }}
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all active:scale-90"
            style={inLab
              ? { background: '#4B9EFF', color: 'white', boxShadow: '0 2px 8px rgba(75,158,255,0.4)' }
              : { background: '#F3F4F6', color: '#9CA3AF' }}>
            <span className="text-sm font-bold leading-none">{inLab ? '✓' : '+'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div>
      <SectionLabel>{label}</SectionLabel>
      <p className="text-sm text-gray-700 leading-relaxed mt-1">{value}</p>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">{children}</p>
  );
}
