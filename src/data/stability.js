/** 성분별 안정적인 pH 범위 (알려진 대표 활성 성분만) */
const PH_REQUIREMENTS = {
  'vitamin-c': [2.5, 3.5],
  'ethyl-ascorbic-acid': [3, 5],
  'magnesium-ascorbyl-phosphate': [6, 7],
  'sodium-ascorbyl-phosphate': [6, 7],
  aha: [3, 4],
  bha: [3, 4],
  pha: [3.5, 5],
  retinol: [5, 6],
  'retinol-exf': [5, 6],
  'retinol-propionate': [5, 6],
  niacinamide: [5, 7],
  'niacinamide-hair': [5, 7],
};

/** pH 요구 없이도 산화에 취약한 활성 성분 (오일류는 id가 -oil로 끝나는 것으로 자동 판별) */
const OXIDATION_PRONE_IDS = new Set([
  'vitamin-c', 'ethyl-ascorbic-acid', 'retinol', 'retinol-exf', 'retinol-propionate',
  'resveratrol', 'coq10', 'astaxanthin',
]);

function isOil(ingredient) {
  return ingredient.id.endsWith('-oil');
}

/** 배합의 pH 궁합·산화 안정성 시뮬레이션 */
export function computeStability(items) {
  const phContributors = items.filter((it) => PH_REQUIREMENTS[it.ingredient.id]);
  const ranges = phContributors.map((it) => PH_REQUIREMENTS[it.ingredient.id]);

  let phRange = null;
  let phConflict = false;
  if (ranges.length > 0) {
    const lo = Math.max(...ranges.map((r) => r[0]));
    const hi = Math.min(...ranges.map((r) => r[1]));
    if (lo <= hi) phRange = [Math.round(lo * 10) / 10, Math.round(hi * 10) / 10];
    else phConflict = true;
  }

  const oxidationProne = items.filter((it) => OXIDATION_PRONE_IDS.has(it.ingredient.id) || isOil(it.ingredient));
  const hasAntioxidant = items.some((it) => it.ingredient.category === 'antioxidant');
  const oxidationRisk = oxidationProne.length > 0 && !hasAntioxidant;

  return { phContributors, phRange, phConflict, oxidationProne, hasAntioxidant, oxidationRisk };
}
