import { ingredients, synergies, CATEGORIES } from '../data/ingredients';

const levelConfig = {
  excellent: { label: '탁월한 시너지', color: '#10B981', bg: '#ECFDF5', border: '#A7F3D0', icon: '⭐' },
  good: { label: '좋은 조합', color: '#3B82F6', bg: '#EFF6FF', border: '#BFDBFE', icon: '👍' },
  caution: { label: '주의 조합', color: '#F59E0B', bg: '#FFFBEB', border: '#FDE68A', icon: '⚠️' },
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
    ingredients.find((i) => i.id === id)?.painPoints.forEach((p) => set.add(p));
  });
  return [...set];
}

export default function LabPanel({ selectedIds, onAdd, onRemove }) {
  const matched = findSynergies(selectedIds);
  const painPoints = getPainPointsCovered(selectedIds);

  return (
    <div className="space-y-3">
      {/* 해결 페인포인트 */}
      {painPoints.length > 0 && (
        <div className="bg-white rounded-3xl p-4" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
          <p className="font-bold text-gray-800 text-sm mb-3 flex items-center gap-2">
            <span>🎯</span> 이 조합이 해결해줄 피부 고민
          </p>
          <div className="flex flex-wrap gap-2">
            {painPoints.map((p) => (
              <span key={p} className="text-xs px-3 py-1.5 rounded-full font-semibold"
                style={{ background: '#EFF6FF', color: '#3B82F6' }}>
                {p}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 시너지 분석 */}
      <div className="bg-white rounded-3xl p-4" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
        <p className="font-bold text-gray-800 text-sm mb-3 flex items-center gap-2">
          <span>⚗️</span> 조합 시너지 분석
        </p>

        {matched.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-4xl mb-2">🔍</p>
            <p className="text-gray-500 text-sm font-medium">특별한 시너지 데이터가 없는 조합이에요</p>
            <p className="text-gray-400 text-xs mt-1">각 성분이 독립적으로 작용합니다</p>
          </div>
        ) : (
          <div className="space-y-3">
            {matched.map((s, i) => {
              const cfg = levelConfig[s.level];
              const boosts = getBoostIngredients(s);
              return (
                <div key={i} className="rounded-2xl p-4"
                  style={{ background: cfg.bg, border: `1.5px solid ${cfg.border}` }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-base">{cfg.icon}</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white"
                      style={{ color: cfg.color }}>
                      {cfg.label}
                    </span>
                  </div>
                  <p className="font-bold text-gray-900 text-sm mb-1">{s.title}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{s.effect}</p>

                  {boosts.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-white/80">
                      <p className="text-xs font-bold text-gray-500 mb-2">➕ 추가하면 더 좋은 성분</p>
                      <div className="flex flex-wrap gap-2">
                        {boosts.map((b) => {
                          const isSelected = selectedIds.includes(b.id);
                          const bcat = CATEGORIES[b.category];
                          return (
                            <button key={b.id}
                              onClick={() => !isSelected && onAdd(b.id)}
                              disabled={isSelected}
                              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-semibold transition-all active:scale-95"
                              style={isSelected
                                ? { background: '#F3F4F6', color: '#9CA3AF', cursor: 'default' }
                                : { background: 'white', color: bcat.color, border: `1.5px solid ${bcat.color}40` }}>
                              <span>{b.emoji}</span>
                              <span>{b.name}</span>
                              {isSelected ? <span>✓</span> : <span style={{ color: '#4B9EFF' }}>+</span>}
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
