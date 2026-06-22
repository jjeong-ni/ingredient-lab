import { ingredients, synergies, CATEGORIES } from '../data/ingredients';

function findSynergies(selectedIds) {
  if (selectedIds.length < 2) return [];
  return synergies.filter((s) => s.ids.every((id) => selectedIds.includes(id)));
}

function getPainPointsCovered(selectedIds) {
  const set = new Set();
  selectedIds.forEach((id) => {
    ingredients.find((i) => i.id === id)?.painPoints.forEach((p) => set.add(p));
  });
  return [...set];
}

export default function LabPanel({ selectedIds, onAdd }) {
  const matched = findSynergies(selectedIds);
  const painPoints = getPainPointsCovered(selectedIds);

  return (
    <div className="space-y-3">
      {/* 해결 페인포인트 */}
      {painPoints.length > 0 && (
        <div className="bg-white rounded-2xl p-4" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <p className="font-bold text-gray-800 text-sm mb-3 flex items-center gap-1.5">
            <span>🎯</span> 이 조합이 해결할 피부 고민
          </p>
          <div className="flex flex-wrap gap-1.5">
            {painPoints.map((p) => (
              <span key={p} className="text-xs px-2.5 py-1 rounded-full font-medium"
                style={{ background: '#EFF6FF', color: '#3B82F6' }}>
                {p}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 시너지 분석 */}
      <div className="bg-white rounded-2xl p-4" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <p className="font-bold text-gray-800 text-sm mb-3 flex items-center gap-1.5">
          <span>⚗️</span> 조합 시너지 분석
        </p>

        {matched.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-3xl mb-2">🔍</p>
            <p className="text-gray-500 text-sm font-medium">특별한 시너지 없음</p>
            <p className="text-gray-400 text-xs mt-1">각 성분이 독립적으로 작용합니다</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {matched.map((s, i) => {
              const boostItems = (s.boost || [])
                .map((id) => ingredients.find((ing) => ing.id === id))
                .filter(Boolean);
              return (
                <div key={i} className="rounded-xl p-3.5"
                  style={{ background: '#F0FDF4', border: '1.5px solid #BBF7D0' }}>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-sm">⭐</span>
                    <span className="text-xs font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-full">
                      시너지 발견
                    </span>
                  </div>
                  <p className="font-bold text-gray-900 text-sm mb-1">{s.label}</p>
                  <p className="text-xs text-gray-600 leading-relaxed">{s.effect}</p>

                  {boostItems.length > 0 && (
                    <div className="mt-2.5 pt-2.5 border-t border-emerald-100">
                      <p className="text-xs font-bold text-gray-500 mb-1.5">➕ 추가 추천 성분</p>
                      <div className="flex flex-wrap gap-1.5">
                        {boostItems.map((b) => {
                          const isSelected = selectedIds.includes(b.id);
                          const bcat = CATEGORIES[b.category];
                          return (
                            <button key={b.id}
                              onClick={() => !isSelected && onAdd(b.id)}
                              disabled={isSelected}
                              className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold transition-all active:scale-95"
                              style={isSelected
                                ? { background: '#F3F4F6', color: '#9CA3AF', cursor: 'default' }
                                : { background: 'white', color: bcat?.color || '#4B9EFF', border: `1.5px solid ${bcat?.color || '#4B9EFF'}40` }}>
                              <span>{b.emoji}</span>
                              <span>{b.name}</span>
                              {!isSelected && <span style={{ color: '#4B9EFF' }}>+</span>}
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
    </div>
  );
}
