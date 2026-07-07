import { computeStability } from '../data/stability';

export default function StabilityPanel({ formula }) {
  if (formula.length === 0) return null;
  const { phContributors, phRange, phConflict, oxidationProne, hasAntioxidant, oxidationRisk } = computeStability(formula);

  if (phContributors.length === 0 && oxidationProne.length === 0) return null;

  return (
    <div className="rounded-lg p-4 mb-4" style={{ background: '#FFFFFF', border: '1px solid #E5E5E5', boxShadow: '0 1px 3px rgba(0,0,0,0.07)' }}>
      <p className="font-semibold text-sm mb-3" style={{ color: '#171717' }}>🧪 안정성 시뮬레이션</p>

      {phContributors.length > 0 && (
        <div className="mb-3">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: '#888888' }}>pH 궁합</p>
          {phConflict ? (
            <div className="rounded-md p-2.5" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
              <p style={{ fontSize: 12, color: '#DC2626', fontWeight: 700 }}>⚠️ pH 요구 범위가 서로 충돌해요</p>
              <p className="mt-1" style={{ fontSize: 11, color: '#DC2626' }}>
                {phContributors.map((it) => it.ingredient.name).join(', ')} — 한 제형에서 모두 안정적인 pH를 만들 수 없어요.
              </p>
            </div>
          ) : (
            <div className="rounded-md p-2.5" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
              <p style={{ fontSize: 12, color: '#15803D', fontWeight: 700 }}>✓ 권장 pH {phRange[0]} ~ {phRange[1]}</p>
              <p className="mt-1 flex flex-wrap gap-1">
                {phContributors.map((it, i) => (
                  <span key={i} className="px-1.5 py-0.5 rounded-full" style={{ fontSize: 10, background: '#FFFFFF', color: '#15803D', border: '1px solid #BBF7D0' }}>
                    {it.ingredient.emoji} {it.ingredient.name}
                  </span>
                ))}
              </p>
            </div>
          )}
        </div>
      )}

      {oxidationProne.length > 0 && (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: '#888888' }}>산화 안정성</p>
          {oxidationRisk ? (
            <div className="rounded-md p-2.5" style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
              <p style={{ fontSize: 12, color: '#B45309', fontWeight: 700 }}>⚠️ 산화 취약 성분에 항산화제가 없어요</p>
              <p className="mt-1 flex flex-wrap gap-1">
                {oxidationProne.map((it, i) => (
                  <span key={i} className="px-1.5 py-0.5 rounded-full" style={{ fontSize: 10, background: '#FFFFFF', color: '#B45309', border: '1px solid #FDE68A' }}>
                    {it.ingredient.emoji} {it.ingredient.name}
                  </span>
                ))}
              </p>
              <p className="mt-1.5" style={{ fontSize: 11, color: '#B45309' }}>토코페롤·페룰산 같은 항산화제를 추가해 안정화하세요.</p>
            </div>
          ) : (
            <div className="rounded-md p-2.5" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
              <p style={{ fontSize: 12, color: '#15803D', fontWeight: 700 }}>
                {hasAntioxidant ? '✓ 항산화제가 포함돼 산화 안정성이 확보됐어요' : '✓ 산화에 취약한 성분이 없어요'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
