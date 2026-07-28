// 상세페이지 메이커 - 핵심 데이터 모델

/** 상품 카테고리 (카피 톤/문구 뱅크 선택에 사용) */
export type CategoryId =
  | 'beauty'
  | 'fashion'
  | 'food'
  | 'digital'
  | 'homeliving'
  | 'health'
  | 'baby'
  | 'pet';

/** 카피 톤앤매너 */
export type ToneId = 'trust' | 'friendly' | 'luxury' | 'lively';

/** 사용자가 입력하는 상품 정보 */
export interface ProductInput {
  productName: string;
  brand?: string;
  category: CategoryId;
  /** 핵심 특징 태그 (예: "저자극", "72시간 보습") */
  features: string[];
  /** 타겟 고객 (예: "건성 피부 20대") */
  target?: string;
  /** 가격 (원). 비우면 스펙/CTA에서 생략 */
  price?: number;
  tone: ToneId;
  /** 업로드한 상품 사진 uri 목록 (첫 장이 대표 이미지) */
  images: string[];
}

/** 카피 생성 결과 — 섹션 렌더러가 그대로 소비 */
export interface CopyResult {
  hero: {
    badge: string;
    headline: string;
    subheadline: string;
  };
  sellingPoints: Array<{
    icon: string; // @expo/vector-icons Ionicons 이름
    title: string;
    desc: string;
  }>;
  detail: {
    heading: string;
    body: string;
  };
  specs: Array<{ label: string; value: string }>;
  reviews: Array<{
    author: string;
    rating: number; // 1~5
    text: string;
  }>;
  cta: {
    headline: string;
    subtext: string;
    buttonText: string;
  };
}

/** 카피 생성기 인터페이스 (룰 기반 / AI 구현 교체용) */
export interface CopyGenerator {
  readonly kind: 'rule' | 'ai';
  generate(input: ProductInput, seed?: number): Promise<CopyResult>;
}
