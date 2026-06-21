import { CATEGORIES } from '../data/ingredients';

const safetyLabel = (n) => {
  if (n >= 5) return { text: '매우 안전', color: '#10B981', bg: '#ECFDF5' };
  if (n >= 4) return { text: '안전', color: '#3B82F6', bg: '#EFF6FF' };
  if (n >= 3) return { text: '주의', color: '#F59E0B', bg: '#FFFBEB' };
  return { text: '전문가 권장', color: '#EF4444', bg: '#FEF2F2' };
};

export default function IngredientCard({ ingredient, onClick, inLab, onLabToggle, modal }) {
  const cat = CATEGORIES[ingredient.category];
  const safety = safetyLabel(ingredient.safety);

  if (modal) {
    return (
      <div className="px-4 pb-2">
        {/* 헤더 영역 */}
        <div className="rounded-3xl p-5 mb-4" style={{ background: cat.bg }}>
          <div className="flex items-start justify-between mb-3">
            <span className="text-5xl">{ingredient.emoji}</span>
            <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-white"
              style={{ color: cat.color }}>
              {cat.icon} {cat.label}
            </span>
          </div>
          <h2 className="text-xl font-bold text-gray-900">{ingredient.name}</h2>
          <p className="text-sm text-gray-500 mt-0.5">{ingredient.nameEn}</p>
        </div>

        <div className="space-y-3">
          <InfoBlock label="기능" value={ingredient.function} />
          <InfoBlock label="추출원" value={ingredient.extraction} />

          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">해결 페인포인트</p>
            <div className="flex flex-wrap gap-1.5">
              {ingredient.painPoints.map((p) => (
                <span key={p} className="text-xs px-3 py-1 rounded-full font-medium"
                  style={{ background: cat.bg, color: cat.color }}>
                  {p}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1 bg-gray-50 rounded-2xl p-3">
              <p className="text-xs text-gray-400 mb-1">권장 농도</p>
              <p className="font-bold text-gray-800 text-sm">{ingredient.concentration}</p>
            </div>
            <div className="flex-1 rounded-2xl p-3" style={{ background: safety.bg }}>
              <p className="text-xs mb-1" style={{ color: safety.color, opacity: 0.7 }}>안전도</p>
              <p className="font-bold text-sm" style={{ color: safety.color }}>{safety.text}</p>
            </div>
          </div>

          {ingredient.tip && (
            <div className="rounded-2xl p-4" style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
              <p className="text-sm text-amber-700 leading-relaxed">
                <span className="font-bold">💡 </span>{ingredient.tip}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 리스트 카드 (가로형)
  return (
    <div
      onClick={() => onClick?.(ingredient)}
      className="bg-white rounded-3xl p-4 cursor-pointer transition-all active:scale-98"
      style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}
    >
      <div className="flex items-center gap-3">
        {/* 이모지 배경 */}
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: cat.bg }}>
          {ingredient.emoji}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="font-bold text-gray-900 text-sm">{ingredient.name}</h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
              style={{ color: cat.color, background: cat.bg }}>
              {cat.label}
            </span>
          </div>
          <p className="text-xs text-gray-500 line-clamp-1">{ingredient.function}</p>
          <div className="flex gap-1 mt-1.5 flex-wrap">
            {ingredient.painPoints.slice(0, 3).map((p) => (
              <span key={p} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                {p}
              </span>
            ))}
          </div>
        </div>

        {/* 실험실 추가 버튼 */}
        <button
          onClick={(e) => { e.stopPropagation(); onLabToggle?.(ingredient); }}
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all active:scale-90"
          style={inLab
            ? { background: '#4B9EFF', color: 'white' }
            : { background: '#F3F4F6', color: '#9CA3AF' }}>
          <span className="text-lg font-bold leading-none">{inLab ? '✓' : '+'}</span>
        </button>
      </div>
    </div>
  );
}

function InfoBlock({ label, value }) {
  return (
    <div>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-sm text-gray-700 leading-relaxed">{value}</p>
    </div>
  );
}
