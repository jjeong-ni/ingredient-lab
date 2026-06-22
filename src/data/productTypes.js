/** 3단계 제품 유형 트리
 *  level1 → level2 → level3(leaf)
 *  leaf에만 defaults(카테고리별 권장 함량%) 있음
 */

export const PRODUCT_TREE = [
  {
    id: 'face', label: '페이스', icon: '👤', color: '#e879f9', bg: '#fdf4ff',
    desc: '얼굴 전용 스킨케어·색조',
    children: [
      {
        id: 'face-cleanser', label: '클렌저', icon: '🫧', color: '#8b5cf6', bg: '#f5f3ff',
        desc: '세안·클렌징 제품',
        children: [
          { id: 'foam-cleanser',    label: '폼 클렌저',    icon: '🫧', desc: '풍성한 거품 세안제',
            defaults: { base:60, surfactant:22, thickener:1.5, emollient:4, soothing:2, moisturizing:1, preservative:0.8, phadjuster:0.3 } },
          { id: 'oil-cleanser',     label: '오일 클렌저',  icon: '🫙', desc: '오일 기반 메이크업 제거',
            defaults: { emollient:75, surfactant:12, base:5, antioxidant:1, fragrance:0.5, preservative:0.5 } },
          { id: 'water-cleanser',   label: '워터 클렌저',  icon: '💦', desc: '미셀라 워터·워터 타입',
            defaults: { base:85, surfactant:8, moisturizing:2, soothing:1.5, chelating:0.1, preservative:0.8 } },
          { id: 'oil-in-foam',      label: '오일인폼',     icon: '✨', desc: '오일+거품 복합 클렌저',
            defaults: { base:50, surfactant:20, emollient:15, thickener:1, soothing:2, preservative:0.8, phadjuster:0.3 } },
          { id: 'gel-cleanser',     label: '겔 클렌저',    icon: '🧊', desc: '투명 겔 타입 세안제',
            defaults: { base:65, surfactant:18, thickener:2, moisturizing:3, soothing:2, preservative:0.8, phadjuster:0.3 } },
          { id: 'powder-cleanser',  label: '파우더 클렌저',icon: '✴️', desc: '효소·분말 타입',
            defaults: { base:10, exfoliant:30, surfactant:20, thickener:5, antioxidant:2 } },
          { id: 'peeling-gel',      label: '필링 겔',      icon: '🔄', desc: '각질 제거 겔 클렌저',
            defaults: { base:60, exfoliant:10, thickener:5, soothing:5, moisturizing:3, preservative:0.8 } },
        ],
      },
      {
        id: 'face-basic', label: '기초', icon: '💧', color: '#0ea5e9', bg: '#f0f9ff',
        desc: '스킨케어 기초 라인',
        children: [
          { id: 'toner',       label: '토너/스킨',   icon: '💧', desc: '수분 공급·각질 정돈',
            defaults: { base:82, moisturizing:6, brightening:3, soothing:3, antioxidant:1, phadjuster:0.3, preservative:0.8 } },
          { id: 'essence',     label: '에센스',      icon: '🌊', desc: '고보습 에센스·부스터',
            defaults: { base:78, moisturizing:8, soothing:4, fermented:4, antioxidant:1, thickener:0.3, preservative:0.8 } },
          { id: 'serum',       label: '세럼/앰플',   icon: '💉', desc: '고농축 기능성 세럼',
            defaults: { base:68, moisturizing:8, brightening:6, antiaging:5, soothing:4, thickener:0.5, preservative:0.8 } },
          { id: 'cream',       label: '크림',        icon: '🍦', desc: '보습·영양 크림',
            defaults: { base:55, emollient:18, moisturizing:7, surfactant:4, thickener:1.5, antiaging:3, soothing:2, preservative:0.8 } },
          { id: 'lotion',      label: '로션',        icon: '🧴', desc: '에멀전·밀크 타입',
            defaults: { base:65, emollient:12, moisturizing:5, surfactant:4, thickener:0.8, soothing:2, preservative:0.8 } },
          { id: 'eye-cream',   label: '아이크림',    icon: '👁️', desc: '눈가 전용 크림',
            defaults: { base:52, emollient:15, moisturizing:8, antiaging:8, soothing:3, filmformer:0.5, thickener:1.5, preservative:0.8 } },
          { id: 'face-oil',    label: '페이스 오일', icon: '✨', desc: '드라이 오일·페이스 오일',
            defaults: { emollient:85, antioxidant:3, soothing:2, fragrance:0.5, antiaging:2 } },
          { id: 'sunscreen',   label: '선크림',      icon: '☀️', desc: 'SPF/PA 자외선 차단',
            defaults: { base:38, sunscreen:22, emollient:18, surfactant:5, thickener:2, antioxidant:1.5, soothing:1, preservative:0.8 } },
          { id: 'sleeping-pack', label: '슬리핑팩', icon: '🌙', desc: '수면 팩·나이트 마스크',
            defaults: { base:58, moisturizing:10, emollient:8, antiaging:5, soothing:4, filmformer:2, thickener:1, preservative:0.8 } },
          { id: 'sheet-mask',  label: '시트마스크',  icon: '😷', desc: '시트 타입 마스크팩',
            defaults: { base:73, moisturizing:9, brightening:4, soothing:5, thickener:2, preservative:0.8 } },
          { id: 'wash-off-mask', label: '워시오프 마스크', icon: '🌿', desc: '클레이·워시오프 팩',
            defaults: { base:50, mineral:20, emollient:8, soothing:5, exfoliant:3, thickener:3, preservative:0.8 } },
        ],
      },
      {
        id: 'face-color', label: '색조', icon: '💄', color: '#f43f5e', bg: '#fff1f2',
        desc: '메이크업·색조 화장품',
        children: [
          { id: 'foundation',   label: '파운데이션', icon: '🎨', desc: '커버·피부 표현',
            defaults: { base:40, emollient:20, mineral:15, surfactant:5, thickener:2, filmformer:3, preservative:0.8 } },
          { id: 'bb-cream',     label: 'BB크림',     icon: '🌸', desc: 'BB·CC 멀티 크림',
            defaults: { base:42, emollient:18, mineral:12, sunscreen:8, soothing:3, thickener:2, preservative:0.8 } },
          { id: 'cushion',      label: '쿠션',       icon: '🪆', desc: '쿠션 파운데이션',
            defaults: { base:40, emollient:18, mineral:12, sunscreen:10, filmformer:3, thickener:1.5, preservative:0.8 } },
          { id: 'lip-color',    label: '립 메이크업',icon: '💋', desc: '립스틱·립글로스·틴트',
            defaults: { emollient:65, mineral:15, filmformer:8, antioxidant:1, fragrance:0.5 } },
          { id: 'eyeshadow',    label: '아이섀도',   icon: '👁️', desc: '아이 색조',
            defaults: { emollient:30, mineral:40, filmformer:8, thickener:5 } },
          { id: 'blush',        label: '블러셔',     icon: '🌷', desc: '볼터치·블러셔',
            defaults: { mineral:60, emollient:20, filmformer:5, thickener:3 } },
        ],
      },
    ],
  },

  {
    id: 'body', label: '바디', icon: '🧴', color: '#14b8a6', bg: '#f0fdfa',
    desc: '전신 바디케어',
    children: [
      {
        id: 'body-cleanser', label: '바디 세정', icon: '🚿', color: '#0ea5e9', bg: '#f0f9ff',
        desc: '샤워·입욕 세정 제품',
        children: [
          { id: 'body-wash',    label: '바디워시',    icon: '🚿', desc: '펌프형 바디 세정제',
            defaults: { base:65, surfactant:20, emollient:5, thickener:1, moisturizing:2, fragrance:0.8, preservative:0.8 } },
          { id: 'bar-soap',     label: '바디 비누',   icon: '🧼', desc: '고체 비누·솝 바',
            defaults: { surfactant:60, emollient:20, base:10, antioxidant:1, fragrance:1 } },
          { id: 'bubble-bath',  label: '버블 배스',   icon: '🛁', desc: '거품 목욕제',
            defaults: { base:55, surfactant:25, emollient:5, fragrance:1, moisturizing:2, preservative:0.8 } },
          { id: 'body-scrub',   label: '바디 스크럽', icon: '🔄', desc: '각질 제거 스크럽',
            defaults: { emollient:35, exfoliant:30, surfactant:10, thickener:3, fragrance:0.8, preservative:0.5 } },
        ],
      },
      {
        id: 'body-moisture', label: '바디 보습', icon: '💆', color: '#34d399', bg: '#ecfdf5',
        desc: '바디 수분·영양 관리',
        children: [
          { id: 'body-lotion',  label: '바디 로션',   icon: '🧴', desc: '가벼운 수분 로션',
            defaults: { base:60, emollient:18, moisturizing:7, surfactant:4, thickener:1, fragrance:0.6, preservative:0.8 } },
          { id: 'body-cream',   label: '바디 크림',   icon: '🍦', desc: '진한 영양 크림',
            defaults: { base:50, emollient:25, moisturizing:8, surfactant:4, thickener:1.5, fragrance:0.6, preservative:0.8 } },
          { id: 'body-oil',     label: '바디 오일',   icon: '✨', desc: '마사지·드라이 오일',
            defaults: { emollient:88, antioxidant:3, fragrance:1.5, soothing:2 } },
          { id: 'body-butter',  label: '바디 버터',   icon: '🧈', desc: '고체형 농축 보습 버터',
            defaults: { emollient:80, thickener:8, antioxidant:2, fragrance:1 } },
          { id: 'hand-cream',   label: '핸드크림',    icon: '🤲', desc: '손 전용 보습 크림',
            defaults: { base:45, emollient:22, moisturizing:10, filmformer:3, thickener:2, fragrance:0.5, preservative:0.8 } },
        ],
      },
      {
        id: 'body-special', label: '바디 기능성', icon: '🌟', color: '#f59e0b', bg: '#fffbeb',
        desc: '선케어·바디 기능성',
        children: [
          { id: 'body-sunscreen', label: '선케어',       icon: '☀️', desc: '바디 자외선 차단',
            defaults: { base:40, sunscreen:22, emollient:18, surfactant:5, thickener:2, preservative:0.8 } },
          { id: 'body-slimming',  label: '슬리밍/셀룰라이트', icon: '💪', desc: '탄력·셀룰라이트 관리',
            defaults: { base:60, emollient:12, soothing:5, antioxidant:3, plantextract:5, caffeine:3, thickener:1.5, preservative:0.8 } },
          { id: 'foot-cream',     label: '풋크림',       icon: '🦶', desc: '발 전용 집중 케어',
            defaults: { base:45, emollient:22, moisturizing:10, exfoliant:3, soothing:3, thickener:2, preservative:0.8 } },
          { id: 'deodorant',      label: '데오도란트',   icon: '💨', desc: '체취 억제·항균',
            defaults: { base:50, antioxidant:5, preservative:2, thickener:5, fragrance:2, phadjuster:1 } },
        ],
      },
    ],
  },

  {
    id: 'hair', label: '헤어', icon: '💇', color: '#d97706', bg: '#fffbeb',
    desc: '두피·모발 케어',
    children: [
      {
        id: 'hair-cleanser', label: '헤어 세정', icon: '🚿', color: '#8b5cf6', bg: '#f5f3ff',
        desc: '두피·모발 세정 제품',
        children: [
          { id: 'shampoo',         label: '샴푸',          icon: '🫧', desc: '일반 세정 샴푸',
            defaults: { base:60, surfactant:18, haircare:8, emollient:4, thickener:1.5, soothing:2, preservative:0.8, phadjuster:0.3 } },
          { id: 'scalp-shampoo',   label: '두피케어 샴푸',  icon: '🌿', desc: '두피 트러블·지성 두피',
            defaults: { base:62, surfactant:16, haircare:6, soothing:5, antioxidant:2, thickener:1, preservative:0.8, phadjuster:0.3 } },
          { id: 'dry-shampoo',     label: '드라이샴푸',    icon: '💨', desc: '물 없이 쓰는 분말 샴푸',
            defaults: { mineral:50, thickener:20, antioxidant:3, fragrance:2, haircare:5 } },
          { id: 'scalp-scaler',    label: '두피 스케일러',  icon: '🔄', desc: '각질·피지 제거 트리트먼트',
            defaults: { base:60, exfoliant:12, surfactant:10, soothing:6, antioxidant:2, preservative:0.8, phadjuster:1 } },
        ],
      },
      {
        id: 'hair-treatment', label: '트리트먼트', icon: '💆', color: '#e879f9', bg: '#fdf4ff',
        desc: '모발 집중 케어',
        children: [
          { id: 'conditioner',     label: '컨디셔너',      icon: '🧴', desc: '사용 후 헹굼 컨디셔너',
            defaults: { base:70, emollient:10, haircare:8, filmformer:3, thickener:2, surfactant:2, preservative:0.8 } },
          { id: 'hair-mask',       label: '헤어마스크',    icon: '😷', desc: '집중 영양 마스크',
            defaults: { base:55, emollient:18, haircare:12, filmformer:4, thickener:3, antioxidant:2, preservative:0.8 } },
          { id: 'leave-in',        label: '리브인 트리트먼트', icon: '🌊', desc: '씻어내지 않는 트리트먼트',
            defaults: { base:65, emollient:12, haircare:8, filmformer:3, moisturizing:3, antioxidant:2, preservative:0.8 } },
          { id: 'hair-serum',      label: '헤어 세럼/앰플', icon: '💉', desc: '고농축 모발 기능성',
            defaults: { base:55, haircare:15, emollient:12, filmformer:5, antioxidant:3, preservative:0.8 } },
        ],
      },
      {
        id: 'hair-styling', label: '스타일링', icon: '✂️', color: '#f59e0b', bg: '#fffbeb',
        desc: '모발 스타일링 제품',
        children: [
          { id: 'hair-oil',        label: '헤어 오일',     icon: '✨', desc: '광택·매끄러움 오일',
            defaults: { emollient:82, antioxidant:3, fragrance:1.5, haircare:5 } },
          { id: 'hair-wax',        label: '헤어 왁스',     icon: '🪨', desc: '홀드·질감 왁스',
            defaults: { emollient:40, thickener:20, filmformer:15, base:10, fragrance:1 } },
          { id: 'hair-gel',        label: '헤어 겔',       icon: '🫙', desc: '강한 고정력 겔',
            defaults: { base:70, thickener:5, filmformer:12, phadjuster:1, preservative:0.8, fragrance:0.5 } },
          { id: 'hair-spray',      label: '헤어 스프레이', icon: '💨', desc: '고정·마무리 스프레이',
            defaults: { base:60, filmformer:15, antioxidant:1, fragrance:0.5, phadjuster:0.5 } },
          { id: 'hair-mist',       label: '헤어 미스트',   icon: '🌬️', desc: '수분 공급 미스트',
            defaults: { base:80, moisturizing:5, haircare:5, fragrance:1, preservative:0.8 } },
        ],
      },
      {
        id: 'scalp-care', label: '두피 케어', icon: '🌱', color: '#16a34a', bg: '#f0fdf4',
        desc: '두피 전용 기능성',
        children: [
          { id: 'scalp-tonic',     label: '두피 토닉',     icon: '💧', desc: '두피 수분·혈행 촉진',
            defaults: { base:75, haircare:8, soothing:5, antioxidant:3, plantextract:3, preservative:0.8 } },
          { id: 'scalp-serum',     label: '두피 세럼',     icon: '💉', desc: '탈모·모발 성장 세럼',
            defaults: { base:65, haircare:12, soothing:6, antioxidant:4, plantextract:4, thickener:1, preservative:0.8 } },
          { id: 'scalp-mask',      label: '두피 마스크',   icon: '🌿', desc: '두피 팩·집중 트리트먼트',
            defaults: { base:60, soothing:8, haircare:8, antioxidant:4, plantextract:5, thickener:3, preservative:0.8 } },
        ],
      },
    ],
  },
];

/** 전체 leaf 목록 (3단계) */
export function getAllLeafs() {
  const result = [];
  PRODUCT_TREE.forEach((l1) =>
    l1.children.forEach((l2) =>
      l2.children.forEach((l3) => result.push({ ...l3, l1, l2 }))
    )
  );
  return result;
}

/** id로 leaf 찾기 */
export function findLeaf(id) {
  return getAllLeafs().find((l) => l.id === id) || null;
}

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
export function suggestPct(ingredient, leaf) {
  if (!leaf) return Math.min(parseConc(ingredient.concentration).mid, 5);
  const catDefault = leaf.defaults?.[ingredient.category];
  if (catDefault !== undefined) return Math.max(catDefault / 2, 0.1);
  return Math.min(parseConc(ingredient.concentration).mid, 5);
}
