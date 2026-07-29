import { create } from 'zustand';
import { getCopyGenerator } from '@/lib/copyEngine';
import type { CopyResult, ProductInput } from '@/lib/types';

/** 렌더 가능한 섹션 종류 (내보내기 단위) */
export type SectionKey = 'hero' | 'selling' | 'detail' | 'spec' | 'review' | 'cta';

export const SECTION_ORDER: SectionKey[] = ['hero', 'selling', 'detail', 'spec', 'review', 'cta'];

export const SECTION_LABEL: Record<SectionKey, string> = {
  hero: '메인 (Hero)',
  selling: '핵심 셀링포인트',
  detail: '상세 설명',
  spec: '상품 정보 표',
  review: '고객 후기',
  cta: '구매 유도 (CTA)',
};

const emptyInput: ProductInput = {
  productName: '',
  brand: '',
  category: 'beauty',
  features: [],
  target: '',
  price: undefined,
  tone: 'trust',
  images: [],
};

interface MakerState {
  input: ProductInput;
  copy: CopyResult | null;
  seed: number;
  generating: boolean;
  enabled: Record<SectionKey, boolean>;

  setInput: (patch: Partial<ProductInput>) => void;
  reset: () => void;
  toggleSection: (key: SectionKey) => void;
  generate: () => Promise<void>;
  regenerate: () => Promise<void>;
}

const generator = getCopyGenerator();

export const useMaker = create<MakerState>((set, get) => ({
  input: emptyInput,
  copy: null,
  seed: 0,
  generating: false,
  enabled: { hero: true, selling: true, detail: true, spec: true, review: true, cta: true },

  setInput: (patch) => set((s) => ({ input: { ...s.input, ...patch } })),

  reset: () => set({ input: emptyInput, copy: null, seed: 0 }),

  toggleSection: (key) =>
    set((s) => ({ enabled: { ...s.enabled, [key]: !s.enabled[key] } })),

  generate: async () => {
    const { input, seed } = get();
    set({ generating: true });
    try {
      const copy = await generator.generate(input, seed);
      set({ copy, generating: false });
    } catch {
      set({ generating: false });
    }
  },

  regenerate: async () => {
    const nextSeed = get().seed + 1;
    set({ seed: nextSeed, generating: true });
    try {
      const copy = await generator.generate(get().input, nextSeed);
      set({ copy, generating: false });
    } catch {
      set({ generating: false });
    }
  },
}));
