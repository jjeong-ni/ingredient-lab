import { GOALS, GOAL_MAP, computeGoalScore, suggestForGoal } from '../data/goals';

/** 실험 목표 선택 칩 (BuildStep 상단) */
export function GoalPicker({ goals, onChange }) {
  function toggle(id) {
    onChange(goals.includes(id) ? goals.filter((g) => g !== id) : [...goals, id]);
  }
  return (
    <div className="px-4 pt-3 pb-1">
      <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#888888' }}>
        🎯 이번 실험 목표 {goals.length > 0 && `(${goals.length}개 선택)`}
      </p>
      <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {GOALS.map((g) => {
          const active = goals.includes(g.id);
          return (
            <button key={g.id} onClick={() => toggle(g.id)}
              className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all active:scale-95"
              style={active
                ? { background: '#171717', color: 'white' }
                : { background: '#FFFFFF', color: '#444444', border: '1px solid #E5E5E5' }}>
              <span>{g.icon}</span><span>{g.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** 목표 달성도 카드 (FormulaStep) */
export function GoalScoreCard({ goals, formula }) {
  if (!goals || goals.length === 0) return null;
  const result = computeGoalScore(goals, formula);
  if (!result) return null;

  const existingIds = new Set(formula.map((f) => f.ingredient.id));
  const scoreColor = result.score === 100 ? '#16a34a' : result.score >= 50 ? '#D97706' : '#DC2626';

  return (
    <div className="rounded-lg p-4 mb-4" style={{ background: '#FFFFFF', border: '1px solid #E5E5E5', boxShadow: '0 1px 3px rgba(0,0,0,0.07)' }}>
      <div className="flex items-center justify-between mb-2">
        <p className="font-semibold text-sm" style={{ color: '#171717' }}>🎯 목표 달성도</p>
        <p className="font-bold text-lg" style={{ color: scoreColor }}>{result.score}%</p>
      </div>
      <div className="w-full h-2 rounded-full overflow-hidden mb-3" style={{ background: '#F4F4F5' }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${result.score}%`, background: scoreColor }} />
      </div>
      <div className="space-y-1.5">
        {result.results.map(({ goal, matched, covered }) => (
          <div key={goal.id} className="flex items-center justify-between">
            <span className="flex items-center gap-1.5" style={{ fontSize: 12, color: '#171717' }}>
              <span>{goal.icon}</span><span style={{ fontWeight: 600 }}>{goal.label}</span>
            </span>
            {covered ? (
              <span style={{ fontSize: 11, color: '#16a34a', fontWeight: 700 }}>
                ✓ {matched.map((m) => m.ingredient.name).join(', ')}
              </span>
            ) : (
              <GoalSuggestion goal={goal} existingIds={existingIds} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function GoalSuggestion({ goal, existingIds }) {
  const s = suggestForGoal(goal, existingIds);
  return (
    <span style={{ fontSize: 11, color: '#DC2626', fontWeight: 600 }}>
      미달성{s ? ` — ${s.emoji} ${s.name} 추천` : ''}
    </span>
  );
}
