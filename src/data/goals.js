import { ingredients } from './ingredients';

export const GOALS = [
  { id: 'hydration',  label: '수분/보습', icon: '💧', match: ['수분', '보습', '건조', '당김'] },
  { id: 'brightening',label: '미백',      icon: '✨', match: ['미백', '색소침착', '기미', '칙칙'] },
  { id: 'soothing',   label: '진정',      icon: '🌿', match: ['진정', '자극', '민감', '홍조'] },
  { id: 'antiaging',  label: '탄력/주름', icon: '🔆', match: ['탄력', '주름', '노화'] },
  { id: 'pore',       label: '모공',      icon: '🪷', match: ['모공', '피지'] },
  { id: 'exfoliate',  label: '각질',      icon: '🔬', match: ['각질'] },
  { id: 'sun',        label: '자외선',    icon: '🛡', match: ['자외선', '광노화'] },
  { id: 'acne',       label: '트러블',    icon: '🌸', match: ['여드름', '트러블'] },
];

export const GOAL_MAP = Object.fromEntries(GOALS.map((g) => [g.id, g]));

function matchesGoal(ingredient, goal) {
  const points = ingredient.painPoints || [];
  return points.some((p) => goal.match.some((m) => p.includes(m)));
}

/** 선택한 목표 대비 현재 배합의 달성도 */
export function computeGoalScore(goalIds, items) {
  const goals = GOALS.filter((g) => goalIds.includes(g.id));
  if (goals.length === 0) return null;

  const results = goals.map((g) => {
    const matched = items.filter((it) => matchesGoal(it.ingredient, g));
    return { goal: g, matched, covered: matched.length > 0 };
  });

  const coveredCount = results.filter((r) => r.covered).length;
  const score = Math.round((coveredCount / goals.length) * 100);
  return { results, score, total: goals.length, covered: coveredCount };
}

/** 아직 달성 못한 목표에 도움될 성분 추천 (배합에 없는 것 중 안전성 좋은 것) */
export function suggestForGoal(goal, existingIds) {
  const candidates = ingredients
    .filter((i) => !existingIds.has(i.id) && i.safety >= 4 && matchesGoal(i, goal))
    .sort((a, b) => b.safety - a.safety);
  return candidates[0] || null;
}
