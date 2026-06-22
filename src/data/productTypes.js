export const PRODUCT_TYPES = [
  {
    id: 'cleanser', label: '클렌저', icon: '🫧', color: '#8b5cf6', bg: '#f5f3ff',
    desc: '폼·오일·버블 클렌저',
    defaults: { base:60, surfactant:22, emollient:4, thickener:1, soothing:1.5, moisturizing:2, preservative:0.8, phadjuster:0.3, chelating:0.1 },
  },
  {
    id: 'toner', label: '토너/에센스', icon: '💦', color: '#0ea5e9', bg: '#f0f9ff',
    desc: '스킨 · 에센스 · 미스트',
    defaults: { base:82, moisturizing:6, brightening:3, soothing:3, antioxidant:1, preservative:0.8, phadjuster:0.2, chelating:0.1 },
  },
  {
    id: 'serum', label: '앰플/세럼', icon: '💉', color: '#a78bfa', bg: '#f5f3ff',
    desc: '고농축 기능성 세럼',
    defaults: { base:68, moisturizing:8, brightening:6, antiaging:5, soothing:4, fermented:3, thickener:0.5, preservative:0.8, phadjuster:0.2 },
  },
  {
    id: 'cream', label: '크림', icon: '🍦', color: '#fbbf24', bg: '#fefce8',
    desc: '보습·수분·영양 크림',
    defaults: { base:55, emollient:18, moisturizing:7, surfactant:4, thickener:1.5, antiaging:3, soothing:2, preservative:0.8, phadjuster:0.3, chelating:0.1 },
  },
  {
    id: 'sunscreen', label: '선크림', icon: '☀️', color: '#f59e0b', bg: '#fffbeb',
    desc: 'SPF/PA 자외선 차단제',
    defaults: { base:38, sunscreen:22, emollient:18, surfactant:5, thickener:2, antioxidant:1.5, soothing:1, preservative:0.8, phadjuster:0.3 },
  },
  {
    id: 'lotion', label: '로션', icon: '🧴', color: '#34d399', bg: '#ecfdf5',
    desc: '에멀전 · 밀크 로션',
    defaults: { base:65, emollient:12, moisturizing:5, surfactant:4, thickener:0.8, soothing:2, preservative:0.8, phadjuster:0.3 },
  },
  {
    id: 'eyecream', label: '아이크림', icon: '👁️', color: '#e879f9', bg: '#fdf4ff',
    desc: '눈가 주름·탄력 전용',
    defaults: { base:52, emollient:15, moisturizing:8, antiaging:8, soothing:3, thickener:1.5, filmformer:0.5, preservative:0.8 },
  },
  {
    id: 'mask', label: '마스크팩', icon: '😷', color: '#06b6d4', bg: '#ecfeff',
    desc: '시트 · 워시오프 마스크',
    defaults: { base:73, moisturizing:9, brightening:4, soothing:5, thickener:2, preservative:0.8, phadjuster:0.2 },
  },
  {
    id: 'bodylotion', label: '바디로션', icon: '🛁', color: '#14b8a6', bg: '#f0fdfa',
    desc: '바디로션 · 바디크림',
    defaults: { base:58, emollient:22, moisturizing:6, surfactant:4, thickener:1, fragrance:0.6, preservative:0.8 },
  },
  {
    id: 'lipcare', label: '립케어', icon: '💋', color: '#fb7185', bg: '#fff1f2',
    desc: '립밤 · 립글로스 · 틴트',
    defaults: { emollient:70, base:10, filmformer:5, antioxidant:1, fragrance:0.5 },
  },
  {
    id: 'hair', label: '헤어제품', icon: '💇', color: '#d97706', bg: '#fffbeb',
    desc: '샴푸 · 트리트먼트 · 세럼',
    defaults: { base:60, surfactant:18, haircare:8, emollient:5, thickener:1.5, preservative:0.8, phadjuster:0.3 },
  },
];

/** ingredient.concentration 문자열 → { min, max, mid } */
export function parseConc(str = '') {
  const range = str.match(/([\d.]+)\s*[–\-~]\s*([\d.]+)/);
  if (range) {
    const min = parseFloat(range[1]);
    const max = parseFloat(range[2]);
    return { min, max, mid: (min + max) / 2 };
  }
  const single = str.match(/([\d.]+)\s*%/);
  if (single) {
    const v = parseFloat(single[1]);
    return { min: 0, max: v, mid: v };
  }
  return { min: 0.1, max: 5, mid: 1 };
}

/** 제품 유형 + 성분 → 추천 기본 함량 */
export function suggestPct(ingredient, productType) {
  if (!productType) return Math.min(parseConc(ingredient.concentration).mid, 5);
  const catDefault = productType.defaults[ingredient.category];
  if (catDefault !== undefined) {
    // 카테고리 기본값을 2로 나눠 시작 (여러 성분 추가 가능성)
    return Math.max(catDefault / 2, 0.1);
  }
  // 카테고리 기본값 없으면 농도 미드포인트, max 5%
  return Math.min(parseConc(ingredient.concentration).mid, 5);
}
