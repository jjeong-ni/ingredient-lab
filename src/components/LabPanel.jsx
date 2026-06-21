import { ingredients, synergies, CATEGORIES } from '../data/ingredients';

const levelConfig = {
  excellent: { label: '탁월한 시너지', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: '⭐' },
  good: { label: '좋은 조합', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', icon: '👍' },
  caution: { label: '주의 조합', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', icon: '⚠️' },
};

function findSynergies(selectedIds) {
  if (selectedIds.length < 2) return [];
  return synergies.filter((s) => s.ids.every((id) => selectedIds.includes(id)));
}

function getBoostIngredients(synergy) {
  return synergy.boostWith
    .map((id) => ingredients.find((i) => i.id === id))
    .filter(Boolean);
}

function getPainPointsCovered(selectedIds) {
  const set = new Set();
  selectedIds.forEach((id) => {
    const ing = ingredients.find((i) => i.id === id);
    ing?.painPoints.forEach((p) => set.add(p));
  });
  return [...set];
}

function getCategories(selectedIds) {
  const set = new Set();
  selectedIds.forEach((id) => {
    const ing = ingredients.find((i) => i.id === id);
    if (ing) set.add(ing.category);
  });
  return [...set];
}

export default function LabPanel({ selectedIds, onAdd, onRemove }) {
  const matched = findSynergies(selectedIds);
  const painPoints = getPainPointsCovered(selectedIds);
  const cats = getCategories(selectedIds);
  const selectedIngredients = selectedIds.map((id) => ingredients.find((i) => i.id === id)).filter(Boolean);

  return (
    <div className="space-y-5">
      {/* Selected ingredients */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
          <span>🧪</span> 선택된 성분
          <span className="text-sm font-normal text-gray-400">({selectedIds.length}개)</span>
        </h3>
        {selectedIngredients.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-4">
            왼쪽에서 성분을 선택하세요 (최대 5개)
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {selectedIngredients.map((ing) => {
              const cat = CATEGORIES[ing.category];
              return (
                <button
                  key={ing.id}
                  onClick={() => onRemove(ing.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all hover:opacity-80"
                  style={{ background: cat.bg, color: cat.color, border: `1.5px solid ${cat.color}30` }}
                >
                  <span>{ing.emoji}</span>
                  <span>{ing.name}</span>
                  <span className="text-xs opacity-60">✕</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Pain points covered */}
      {painPoints.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span>🎯</span> 해결 가능한 피부 고민
          </h3>
          <div className="flex flex-wrap gap-2">
            {painPoints.map((p) => (
              <span key={p} className="text-sm bg-violet-50 text-violet-700 px-3 py-1 rounded-full border border-violet-100">
                {p}
              </span>
            ))}
          </div>
          <div className="mt-3 flex gap-2 flex-wrap">
            {cats.map((c) => {
              const cat = CATEGORIES[c];
              return (
                <span key={c} className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ color: cat.color, background: cat.bg }}>
                  {cat.icon} {cat.label}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Synergies */}
      {selectedIds.length >= 2 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span>⚗️</span> 조합 분석
          </h3>
          {matched.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-4xl mb-2">🔍</p>
              <p className="text-gray-500 text-sm">특별한 시너지 데이터가 없는 조합입니다.</p>
              <p className="text-gray-400 text-xs mt-1">각 성분은 독립적으로 작용합니다.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {matched.map((s, i) => {
                const cfg = levelConfig[s.level];
                const boosts = getBoostIngredients(s);
                return (
                  <div key={i} className={`rounded-xl border p-4 ${cfg.bg} ${cfg.border}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span>{cfg.icon}</span>
                      <span className={`text-sm font-bold ${cfg.color}`}>{cfg.label}</span>
                    </div>
                    <p className="font-semibold text-gray-800 text-sm mb-1">{s.title}</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{s.effect}</p>
                    {boosts.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-white/60">
                        <p className="text-xs font-semibold text-gray-500 mb-2">➕ 추가하면 더 좋은 성분</p>
                        <div className="flex flex-wrap gap-2">
                          {boosts.map((b) => {
                            const isSelected = selectedIds.includes(b.id);
                            return (
                              <button
                                key={b.id}
                                disabled={isSelected || selectedIds.length >= 5}
                                onClick={() => !isSelected && onAdd(b.id)}
                                className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border font-medium transition-all ${
                                  isSelected
                                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-default'
                                    : 'bg-white text-gray-700 border-gray-300 hover:border-violet-400 hover:text-violet-600 cursor-pointer'
                                }`}
                              >
                                <span>{b.emoji}</span>
                                <span>{b.name}</span>
                                {isSelected ? <span>✓</span> : <span className="text-violet-400">+</span>}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {selectedIds.length < 2 && selectedIds.length > 0 && (
        <div className="bg-gray-50 rounded-2xl border border-dashed border-gray-200 p-6 text-center">
          <p className="text-gray-400 text-sm">성분을 1개 더 추가하면<br />조합 분석을 시작합니다</p>
        </div>
      )}
    </div>
  );
}
