import { parseConc } from './productTypes';

/** 카테고리별 기준 단가 (KRW/kg, 대량 구매 원료 기준 추정치) */
const CATEGORY_BASE_COST = {
  base: 1500,
  preservative: 12000,
  moisturizing: 15000,
  emollient: 12000,
  surfactant: 10000,
  thickener: 9000,
  antioxidant: 25000,
  phadjuster: 7000,
  chelating: 9000,
  filmformer: 18000,
  sunscreen: 22000,
  brightening: 50000,
  antiaging: 120000,
  exfoliant: 18000,
  soothing: 22000,
  fermented: 70000,
  plantextract: 28000,
  haircare: 18000,
  fragrance: 15000,
  mineral: 9000,
};
const DEFAULT_BASE_COST = 20000;

/**
 * 원료 단가 추정 (KRW/kg)
 * 사용 권장 농도가 낮을수록(고농축 활성 성분) 단가가 비싸지는 경향을 반영한 근사 모델.
 * 실제 시세와는 다를 수 있는 추정치입니다.
 */
export function estimateCostPerKg(ingredient) {
  const base = CATEGORY_BASE_COST[ingredient.category] ?? DEFAULT_BASE_COST;
  const mid = parseConc(ingredient.concentration).mid || 1;
  const multiplier = Math.min(Math.max(3 / mid, 0.3), 40);
  return Math.round((base * multiplier) / 100) * 100;
}

/** 배합(100g 기준) 예상 원가 계산 */
export function estimateFormulaCost(items) {
  const breakdown = items.map((it) => {
    const costPerKg = estimateCostPerKg(it.ingredient);
    const cost = (it.pct * costPerKg) / 1000; // pct = g/100g 배치, costPerKg/1000 = KRW/g
    return { ingredient: it.ingredient, pct: it.pct, costPerKg, cost };
  });
  const total = breakdown.reduce((s, b) => s + b.cost, 0);
  breakdown.sort((a, b) => b.cost - a.cost);
  return { breakdown, total };
}

export function formatKRW(n) {
  return `₩${Math.round(n).toLocaleString('ko-KR')}`;
}
