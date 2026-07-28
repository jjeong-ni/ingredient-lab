import type { CategoryId, ToneId } from '@/lib/types';

/** 앱 전역 색상 */
export const colors = {
  bg: '#F4F5F7',
  card: '#FFFFFF',
  text: '#1A1A1E',
  sub: '#6B7280',
  line: '#E5E7EB',
  primary: '#4F46E5',
  primarySoft: '#EEF0FF',
  danger: '#EF4444',
  star: '#F5A623',
};

export interface CategoryMeta {
  id: CategoryId;
  label: string;
  icon: string; // Ionicons
}

export const CATEGORIES: CategoryMeta[] = [
  { id: 'beauty', label: '뷰티/화장품', icon: 'sparkles-outline' },
  { id: 'fashion', label: '패션/잡화', icon: 'shirt-outline' },
  { id: 'food', label: '식품/건강식', icon: 'restaurant-outline' },
  { id: 'digital', label: '디지털/가전', icon: 'hardware-chip-outline' },
  { id: 'homeliving', label: '홈/리빙', icon: 'home-outline' },
  { id: 'health', label: '헬스/피트니스', icon: 'barbell-outline' },
  { id: 'baby', label: '유아/출산', icon: 'happy-outline' },
  { id: 'pet', label: '반려동물', icon: 'paw-outline' },
];

export interface ToneMeta {
  id: ToneId;
  label: string;
  desc: string;
}

export const TONES: ToneMeta[] = [
  { id: 'trust', label: '신뢰형', desc: '검증·팩트 중심의 안정적인 톤' },
  { id: 'friendly', label: '친근형', desc: '말 걸듯 편안하고 다정한 톤' },
  { id: 'luxury', label: '럭셔리형', desc: '절제되고 고급스러운 톤' },
  { id: 'lively', label: '발랄형', desc: '에너지 넘치고 경쾌한 톤' },
];

/** 톤별 히어로/CTA 시각 테마 (그라디언트, 강조색) */
export interface ToneTheme {
  gradient: [string, string];
  accent: string;
  heroText: string;
  heroSub: string;
}

export const TONE_THEME: Record<ToneId, ToneTheme> = {
  trust: {
    gradient: ['#1E3A8A', '#2563EB'],
    accent: '#2563EB',
    heroText: '#FFFFFF',
    heroSub: '#DBEAFE',
  },
  friendly: {
    gradient: ['#FB7185', '#FDA4AF'],
    accent: '#F43F5E',
    heroText: '#FFFFFF',
    heroSub: '#FFE4E6',
  },
  luxury: {
    gradient: ['#111827', '#374151'],
    accent: '#B8963E',
    heroText: '#FFFFFF',
    heroSub: '#D1D5DB',
  },
  lively: {
    gradient: ['#7C3AED', '#EC4899'],
    accent: '#8B5CF6',
    heroText: '#FFFFFF',
    heroSub: '#F3E8FF',
  },
};
