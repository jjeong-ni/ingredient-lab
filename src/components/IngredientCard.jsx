import { CATEGORIES } from '../data/ingredients';

const safetyLabel = (n) => {
  if (n >= 5) return { text: '매우 안전', color: 'text-emerald-600', bg: 'bg-emerald-50' };
  if (n >= 4) return { text: '안전', color: 'text-blue-600', bg: 'bg-blue-50' };
  if (n >= 3) return { text: '주의 필요', color: 'text-amber-600', bg: 'bg-amber-50' };
  return { text: '전문가 상담', color: 'text-red-600', bg: 'bg-red-50' };
};

export default function IngredientCard({ ingredient, selected, onClick, compact }) {
  const cat = CATEGORIES[ingredient.category];
  const safety = safetyLabel(ingredient.safety);

  if (compact) {
    return (
      <button
        onClick={() => onClick?.(ingredient)}
        className={`w-full text-left p-3 rounded-xl border-2 transition-all cursor-pointer ${
          selected
            ? 'border-violet-500 bg-violet-50 shadow-md'
            : 'border-gray-200 bg-white hover:border-violet-300 hover:shadow'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">{ingredient.emoji}</span>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-gray-800 truncate">{ingredient.name}</p>
            <span
              className="inline-block text-xs px-1.5 py-0.5 rounded-full font-medium"
              style={{ color: cat.color, background: cat.bg }}
            >
              {cat.icon} {cat.label}
            </span>
          </div>
          {selected && <span className="text-violet-500 text-lg">✓</span>}
        </div>
      </button>
    );
  }

  return (
    <div
      onClick={() => onClick?.(ingredient)}
      className={`bg-white rounded-2xl border-2 transition-all cursor-pointer overflow-hidden ${
        selected
          ? 'border-violet-500 shadow-lg shadow-violet-100'
          : 'border-gray-100 hover:border-gray-300 hover:shadow-md'
      }`}
    >
      {/* Header */}
      <div
        className="p-4 pb-3"
        style={{ background: cat.bg }}
      >
        <div className="flex items-start justify-between mb-2">
          <span className="text-4xl">{ingredient.emoji}</span>
          <span
            className="text-xs font-semibold px-2 py-1 rounded-full"
            style={{ color: cat.color, background: 'white' }}
          >
            {cat.icon} {cat.label}
          </span>
        </div>
        <h3 className="font-bold text-gray-900 text-base leading-tight">{ingredient.name}</h3>
        <p className="text-xs text-gray-500 mt-0.5">{ingredient.nameEn}</p>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">기능</p>
          <p className="text-sm text-gray-700 leading-relaxed">{ingredient.function}</p>
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">추출원</p>
          <p className="text-sm text-gray-600">{ingredient.extraction}</p>
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">해결 페인포인트</p>
          <div className="flex flex-wrap gap-1">
            {ingredient.painPoints.map((p) => (
              <span key={p} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                {p}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-gray-50">
          <div>
            <p className="text-xs text-gray-400">권장 농도</p>
            <p className="text-sm font-semibold text-gray-700">{ingredient.concentration}</p>
          </div>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${safety.color} ${safety.bg}`}>
            {safety.text}
          </span>
        </div>

        {ingredient.tip && (
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
            <p className="text-xs text-amber-700">
              <span className="font-bold">💡 팁 </span>{ingredient.tip}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
