import { useState, useMemo } from 'react';
import { estimateFormulaCost, formatKRW } from '../data/costs';

/** 예상 원가 카드 (100g 기준) — FormulaStep용 */
export default function CostPanel({ formula }) {
  const [expanded, setExpanded] = useState(false);
  const { breakdown, total } = useMemo(() => estimateFormulaCost(formula), [formula]);
  if (formula.length === 0) return null;

  const top = breakdown[0];
  const topShare = total > 0 ? Math.round((top.cost / total) * 100) : 0;
  const shown = expanded ? breakdown : breakdown.slice(0, 3);

  return (
    <div className="rounded-lg p-4 mb-4" style={{ background: '#FFFFFF', border: '1px solid #DCE3DE', boxShadow: '0 1px 3px rgba(0,0,0,0.07)' }}>
      <div className="flex items-center justify-between mb-1">
        <p className="font-semibold text-sm" style={{ color: '#16201C' }}>💰 예상 원가 (100g 기준)</p>
        <p className="font-bold text-lg" style={{ color: '#16a34a' }}>{formatKRW(total)}</p>
      </div>
      <p className="text-[10px] mb-3" style={{ color: '#93A29A' }}>원료 시세 추정치 · 실제 구매 단가와 다를 수 있어요</p>

      <div className="space-y-1.5">
        {shown.map((b, i) => {
          const share = total > 0 ? Math.round((b.cost / total) * 100) : 0;
          return (
            <div key={i} className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 min-w-0" style={{ fontSize: 12, color: '#16201C' }}>
                <span className="flex-shrink-0">{b.ingredient.emoji}</span>
                <span className="truncate" style={{ fontWeight: 600 }}>{b.ingredient.name}</span>
              </span>
              <span className="flex-shrink-0 flex items-center gap-1.5" style={{ fontSize: 11 }}>
                <span style={{ color: '#5F6B65' }}>{share}%</span>
                <span style={{ fontWeight: 700, color: '#16201C' }}>{formatKRW(b.cost)}</span>
              </span>
            </div>
          );
        })}
      </div>

      {breakdown.length > 3 && (
        <button onClick={() => setExpanded(!expanded)}
          className="w-full mt-2.5 py-1.5 rounded-md text-xs font-bold"
          style={{ background: '#E6EEE9', color: '#445048' }}>
          {expanded ? '접기 ▲' : `전체 ${breakdown.length}개 성분 보기 ▼`}
        </button>
      )}

      {topShare >= 50 && (
        <div className="rounded-md p-2.5 mt-3" style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
          <p style={{ fontSize: 11, color: '#B45309' }}>
            🤝 {top.ingredient.emoji} {top.ingredient.name}이 원가의 {topShare}%를 차지해요. 대체 원료나 등급 조정으로 원가를 낮출 수 있어요.
          </p>
        </div>
      )}
    </div>
  );
}
