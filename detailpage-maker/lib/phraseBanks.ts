import type { CategoryId, ToneId } from '@/lib/types';

// 룰 기반 카피 엔진이 사용하는 문구 뱅크 (전부 한국어 이커머스 톤)
// 템플릿 변수: {name} 상품명, {brand} 브랜드, {feature} 특징, {target} 타겟

export const HOOKS: Record<ToneId, string[]> = {
  trust: [
    '{feature}, 이제 데이터로 증명합니다',
    '{name}, 검증된 이유가 있습니다',
    '왜 {name}인가 — {feature}',
    '고민 끝. {feature} 하나로 끝냅니다',
  ],
  friendly: [
    '이거 하나면 {feature} 걱정 끝이에요',
    '{target}이라면 꼭 만나야 할 {name}',
    '써 본 사람만 아는 {feature}의 차이',
    '오늘부터 {feature}, 어렵지 않아요',
  ],
  luxury: [
    '{feature}, 그 이상의 경험',
    '{name} — 완성도를 다시 정의하다',
    '가장 단순하게, 가장 완벽하게',
    '진짜를 아는 당신을 위한 {name}',
  ],
  lively: [
    '{feature}?! 이건 무조건 사야 해 🔥',
    '{name} 만나고 인생템 갱신했어요',
    '지금 난리 난 그 {name}, 바로 이거!',
    '{feature}로 하루가 달라진다구요!',
  ],
};

export const SUBHEADS: Record<ToneId, string[]> = {
  trust: [
    '수많은 후기가 말해주는 확실한 선택',
    '눈으로 확인하는 {feature}',
    '까다로운 {target}도 만족시킨 완성도',
  ],
  friendly: [
    '부담 없이 시작하는 {feature}',
    '{target}을 위해 세심하게 준비했어요',
    '한 번 쓰면 계속 찾게 되는 이유',
  ],
  luxury: [
    '디테일에서 완성되는 품격',
    '타협하지 않은 {feature}',
    '소수를 위한 특별한 기준',
  ],
  lively: [
    '지금 안 사면 나중에 후회각 😆',
    '{feature} 실화냐구요, 실화입니다',
    '리뷰 폭발 중인 요즘 대세템',
  ],
};

export const BADGES: Partial<Record<CategoryId, string[]>> & { _default: string[] } = {
  beauty: ['민감 피부 테스트 완료', '재구매율 TOP', '올리브영 감성'],
  fashion: ['데일리 필수템', '컬러 5종', '핏 보장'],
  food: ['HACCP 인증', '당일 생산', '무방부제'],
  digital: ['A/S 1년 보장', '정품 보증', '빠른 충전'],
  homeliving: ['공간 절약 설계', '조립 5분', '인테리어 완성'],
  health: ['식약처 인증', '무설탕', '데일리 루틴'],
  baby: ['안전 인증 완료', '무자극 테스트', '엄마들 선택'],
  pet: ['수의사 추천', '전연령 급여', '기호성 최고'],
  _default: ['BEST 상품', '한정 수량', '오늘의 특가'],
};

/** 특징 → 혜택 문장 꼬리말 (카테고리별) */
export const BENEFIT_TAILS: Partial<Record<CategoryId, string[]>> & { _default: string[] } = {
  beauty: [
    '피부에 닿는 순간 차이가 느껴져요.',
    '매일 써도 부담 없는 순한 사용감.',
    '메이크업 전후 어디에나 잘 어울려요.',
    '바르고 나면 확실히 결이 정돈돼요.',
  ],
  fashion: [
    '어떤 코디에도 자연스럽게 녹아들어요.',
    '오래 입어도 형태가 그대로예요.',
    '계절 상관없이 활용도가 높아요.',
  ],
  food: [
    '한 입 먹으면 신선함이 그대로 느껴져요.',
    '바쁜 아침에도 간편하게 챙길 수 있어요.',
    '온 가족이 부담 없이 즐길 수 있어요.',
  ],
  digital: [
    '복잡한 설정 없이 바로 사용할 수 있어요.',
    '한 번 쓰면 이전으로 못 돌아가요.',
    '작은 디테일까지 꼼꼼하게 설계됐어요.',
  ],
  homeliving: [
    '공간이 한결 깔끔하게 정리돼요.',
    '매일 쓰는 물건이라 더 만족스러워요.',
    '두면 둘수록 손이 자주 가요.',
  ],
  health: [
    '꾸준히 챙기면 몸이 먼저 알아봐요.',
    '루틴에 자연스럽게 더하기 좋아요.',
    '번거로움 없이 매일 이어갈 수 있어요.',
  ],
  baby: [
    '예민한 아기 피부에도 안심이에요.',
    '초보 부모도 쉽게 사용할 수 있어요.',
    '선물로도 부담 없이 좋아요.',
  ],
  pet: [
    '입 짧은 아이도 반응이 달라요.',
    '매일 챙겨주기 좋은 구성이에요.',
    '보호자도 아이도 만족하는 선택이에요.',
  ],
  _default: [
    '한 번 경험하면 계속 찾게 돼요.',
    '기대 이상의 만족을 드려요.',
    '작은 차이가 큰 만족으로 이어져요.',
  ],
};

/** 특징이 부족할 때 채우는 카테고리 기본 특징 */
export const DEFAULT_FEATURES: Partial<Record<CategoryId, string[]>> & { _default: string[] } = {
  beauty: ['저자극 테스트 완료', '끈적임 없는 흡수력', '데일리 사용 설계'],
  fashion: ['탄탄한 원단', '군살 없는 핏', '데일리 활용도'],
  food: ['엄선한 원재료', '간편한 섭취', '신선한 관리'],
  digital: ['직관적인 사용성', '견고한 내구성', '빠른 성능'],
  homeliving: ['공간 절약 설계', '튼튼한 마감', '손쉬운 관리'],
  health: ['꼼꼼한 성분 설계', '간편한 데일리 루틴', '믿을 수 있는 관리'],
  baby: ['안심 소재', '순한 사용감', '세심한 마감'],
  pet: ['높은 기호성', '건강한 구성', '간편 급여'],
  _default: ['꼼꼼한 품질 관리', '실용적인 구성', '만족스러운 사용감'],
};

export const DETAIL_INTRO: Record<ToneId, string[]> = {
  trust: ['왜 많은 분들이 {name}을(를) 선택했을까요?'],
  friendly: ['{name}, 어떤 점이 좋은지 하나씩 알려드릴게요.'],
  luxury: ['{name}이(가) 완성되기까지의 기준을 소개합니다.'],
  lively: ['{name}이 왜 이렇게 난리인지, 지금부터 풀어드릴게요!'],
};

export const CTA: Record<ToneId, { headline: string; subtext: string; button: string }[]> = {
  trust: [
    { headline: '검증된 선택, 지금 시작하세요', subtext: '오늘 주문 시 가장 빠른 배송으로 받아보실 수 있어요.', button: '지금 구매하기' },
  ],
  friendly: [
    { headline: '망설이지 말고, 오늘 함께해요', subtext: '고민될 땐 일단 경험해보는 게 답이에요.', button: '장바구니 담기' },
  ],
  luxury: [
    { headline: '당신의 기준에 맞는 선택', subtext: '한정 수량으로 준비된 특별한 구성입니다.', button: '구매하기' },
  ],
  lively: [
    { headline: '지금 안 사면 진짜 후회각! 🔥', subtext: '재고 소진 임박, 서두르세요!', button: '바로 구매 GO!' },
  ],
};

export const REVIEW_TEMPLATES: Record<ToneId, string[]> = {
  trust: [
    '기대 반 걱정 반으로 샀는데 {feature} 확실하네요. 믿고 재구매합니다.',
    '여러 제품 써봤지만 {name}이 제일 만족스러워요. 괜히 후기 좋은 게 아니었어요.',
    '{feature} 부분이 확실히 다릅니다. 주변에도 추천했어요.',
  ],
  friendly: [
    '와 이거 진짜 물건이에요 ㅠㅠ {feature} 완전 제 취향!',
    '{target}인 저한테 딱이더라구요. 잘 샀어요 정말!',
    '배송도 빠르고 {feature}도 좋고, 만족합니다 :)',
  ],
  luxury: [
    '가격값 하는 완성도예요. {feature}에서 품격이 느껴집니다.',
    '디테일이 남다르네요. {name}은 확실히 다릅니다.',
    '주변 반응이 좋아서 선물용으로 또 주문했어요.',
  ],
  lively: [
    '대박,,, {feature} 실화냐구요 🔥🔥 인생템 등극!',
    '리뷰 보고 샀는데 왜 난리인지 알겠음ㅋㅋ {feature} 최고',
    '벌써 세 번째 재구매요! {name} 없으면 안 돼요 😆',
  ],
};

export const NICKNAMES = [
  '민지****',
  'sunny***',
  '꼼꼼한소비자',
  '리뷰요정',
  'jinnn**',
  '지름신강림',
  '알뜰살뜰',
  'happy_day',
  '무민이맘',
  '한결같이',
];

export const SELLING_ICONS = [
  'checkmark-circle-outline',
  'shield-checkmark-outline',
  'flash-outline',
  'heart-outline',
  'ribbon-outline',
  'leaf-outline',
];
