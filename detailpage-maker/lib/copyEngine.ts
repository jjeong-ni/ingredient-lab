import { CATEGORIES } from '@/constants/theme';
import type { CopyGenerator, CopyResult, ProductInput } from '@/lib/types';
import {
  BADGES,
  BENEFIT_TAILS,
  CTA,
  DEFAULT_FEATURES,
  DETAIL_INTRO,
  HOOKS,
  NICKNAMES,
  REVIEW_TEMPLATES,
  SELLING_ICONS,
  SUBHEADS,
} from '@/lib/phraseBanks';

/* ------------------------------------------------------------------ *
 * 시드 기반 유틸 — 상품명이 같으면 결과가 안정적으로 유지되고,
 * "다시 생성"으로 seed 를 바꾸면 다른 조합이 나온다.
 * ------------------------------------------------------------------ */

function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

class Picker {
  private rnd: () => number;
  constructor(seedText: string, seed: number) {
    this.rnd = mulberry32(hashString(seedText) + seed * 2654435761);
  }
  pick<T>(arr: readonly T[]): T {
    return arr[Math.floor(this.rnd() * arr.length)];
  }
  /** 배열에서 중복 없이 n개 (부족하면 있는 만큼) */
  pickN<T>(arr: readonly T[], n: number): T[] {
    const pool = [...arr];
    const out: T[] = [];
    while (pool.length && out.length < n) {
      out.push(pool.splice(Math.floor(this.rnd() * pool.length), 1)[0]);
    }
    return out;
  }
  int(min: number, max: number): number {
    return min + Math.floor(this.rnd() * (max - min + 1));
  }
}

function fill(
  template: string,
  vars: { name: string; brand: string; feature: string; target: string },
): string {
  return template
    .replace(/\{name\}/g, vars.name)
    .replace(/\{brand\}/g, vars.brand)
    .replace(/\{feature\}/g, vars.feature)
    .replace(/\{target\}/g, vars.target);
}

function categoryLabel(id: ProductInput['category']): string {
  return CATEGORIES.find((c) => c.id === id)?.label ?? '상품';
}

function bankFor<T>(
  bank: Partial<Record<ProductInput['category'], T>> & { _default: T },
  cat: ProductInput['category'],
): T {
  return bank[cat] ?? bank._default;
}

/* ------------------------------------------------------------------ *
 * 룰 기반 생성기 (기본값). AI 키가 없어도 항상 동작한다.
 * ------------------------------------------------------------------ */

export class RuleBasedGenerator implements CopyGenerator {
  readonly kind = 'rule' as const;

  async generate(input: ProductInput, seed = 0): Promise<CopyResult> {
    const p = new Picker(input.productName || 'product', seed);

    const name = input.productName.trim() || '이 상품';
    const brand = (input.brand ?? '').trim();
    const target = (input.target ?? '').trim() || '당신';

    // 특징 정리: 사용자 입력 우선, 3개 미만이면 카테고리 기본 특징으로 보강
    const cleanFeatures = input.features.map((f) => f.trim()).filter(Boolean);
    const filled = [...cleanFeatures];
    const defaults = bankFor(DEFAULT_FEATURES, input.category);
    for (const d of defaults) {
      if (filled.length >= 3) break;
      if (!filled.includes(d)) filled.push(d);
    }
    const primary = filled[0];
    const vars = { name, brand, feature: primary, target };

    // Hero
    const hero = {
      badge: p.pick(bankFor(BADGES, input.category)),
      headline: fill(p.pick(HOOKS[input.tone]), vars),
      subheadline: fill(p.pick(SUBHEADS[input.tone]), vars),
    };

    // Selling points (특징 → 혜택 문장)
    const tails = bankFor(BENEFIT_TAILS, input.category);
    const chosenTails = p.pickN(tails, Math.min(filled.length, 4));
    const sellingPoints = filled.slice(0, 4).map((feature, i) => ({
      icon: SELLING_ICONS[i % SELLING_ICONS.length],
      title: feature,
      desc: chosenTails[i % chosenTails.length] ?? bankFor(BENEFIT_TAILS, input.category)[0],
    }));

    // Detail 본문
    const detailIntro = fill(p.pick(DETAIL_INTRO[input.tone]), vars);
    const featureLines = filled
      .slice(0, 3)
      .map((f, i) => `${i + 1}. ${f}`)
      .join('\n');
    const detailBody =
      `${brand ? `${brand}의 ` : ''}${name}은(는) 아래 세 가지에 집중했습니다.\n\n` +
      `${featureLines}\n\n` +
      `${target}의 입장에서 꼭 필요한 부분만 담아, 사용하는 순간 차이를 느낄 수 있도록 설계했어요.`;
    const detail = { heading: detailIntro, body: detailBody };

    // Spec 표
    const specs: CopyResult['specs'] = [];
    if (brand) specs.push({ label: '브랜드', value: brand });
    specs.push({ label: '카테고리', value: categoryLabel(input.category) });
    filled.slice(0, 3).forEach((f, i) => specs.push({ label: `핵심 특징 ${i + 1}`, value: f }));
    if (typeof input.price === 'number' && input.price > 0) {
      specs.push({ label: '판매가', value: `${input.price.toLocaleString('ko-KR')}원` });
    }
    specs.push({ label: '구성', value: '단품 1개' });
    specs.push({ label: '배송', value: '택배 배송 (평균 1~2일)' });

    // Review 예시 (사용자가 편집하는 초안)
    const nicks = p.pickN(NICKNAMES, 3);
    const reviewTexts = p.pickN(REVIEW_TEMPLATES[input.tone], 3);
    const featureCycle = filled.length ? filled : [primary];
    const reviews = nicks.map((author, i) => ({
      author,
      rating: p.int(4, 5),
      text: fill(reviewTexts[i % reviewTexts.length], {
        ...vars,
        feature: featureCycle[i % featureCycle.length],
      }),
    }));

    // CTA
    const ctaBank = p.pick(CTA[input.tone]);
    const cta = {
      headline: ctaBank.headline,
      subtext: ctaBank.subtext,
      buttonText: ctaBank.button,
    };

    return { hero, sellingPoints, detail, specs, reviews, cta };
  }
}

/* ------------------------------------------------------------------ *
 * AI 생성기 (선택). EXPO_PUBLIC_AI_API_KEY 가 설정되면 활성화되며,
 * 실패 시 자동으로 룰 기반 결과로 폴백한다. (OpenAI 호환 엔드포인트)
 * ------------------------------------------------------------------ */

export class AiCopyGenerator implements CopyGenerator {
  readonly kind = 'ai' as const;
  constructor(private fallback: CopyGenerator) {}

  async generate(input: ProductInput, seed = 0): Promise<CopyResult> {
    const apiKey = process.env.EXPO_PUBLIC_AI_API_KEY;
    if (!apiKey) return this.fallback.generate(input, seed);

    const baseUrl = process.env.EXPO_PUBLIC_AI_BASE_URL ?? 'https://api.openai.com/v1';
    const model = process.env.EXPO_PUBLIC_AI_MODEL ?? 'gpt-4o-mini';

    const system =
      '너는 한국 이커머스 상세페이지 카피라이터다. ' +
      '입력된 상품 정보로 매력적인 상세페이지 카피를 만든다. ' +
      '반드시 지정된 JSON 스키마에 맞는 JSON 객체만 출력한다. 설명 문장은 넣지 않는다.';

    const schema =
      '{"hero":{"badge":string,"headline":string,"subheadline":string},' +
      '"sellingPoints":[{"icon":"checkmark-circle-outline","title":string,"desc":string}],' +
      '"detail":{"heading":string,"body":string},' +
      '"specs":[{"label":string,"value":string}],' +
      '"reviews":[{"author":string,"rating":5,"text":string}],' +
      '"cta":{"headline":string,"subtext":string,"buttonText":string}}';

    const user =
      `상품명: ${input.productName}\n브랜드: ${input.brand ?? '-'}\n` +
      `카테고리: ${categoryLabel(input.category)}\n특징: ${input.features.join(', ')}\n` +
      `타겟: ${input.target ?? '-'}\n가격: ${input.price ?? '-'}\n톤: ${input.tone}\n\n` +
      `아래 JSON 스키마로만 응답:\n${schema}`;

    try {
      const res = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          temperature: 0.8,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: system },
            { role: 'user', content: user },
          ],
        }),
      });
      if (!res.ok) throw new Error(`AI ${res.status}`);
      const json = await res.json();
      const content = json?.choices?.[0]?.message?.content;
      const parsed = JSON.parse(content) as Partial<CopyResult>;
      // 최소 검증 후 부족한 필드는 룰 기반으로 보완
      const base = await this.fallback.generate(input, seed);
      return {
        hero: parsed.hero ?? base.hero,
        sellingPoints: parsed.sellingPoints?.length ? parsed.sellingPoints : base.sellingPoints,
        detail: parsed.detail ?? base.detail,
        specs: parsed.specs?.length ? parsed.specs : base.specs,
        reviews: parsed.reviews?.length ? parsed.reviews : base.reviews,
        cta: parsed.cta ?? base.cta,
      };
    } catch {
      return this.fallback.generate(input, seed);
    }
  }
}

/** 환경변수에 따라 적절한 생성기를 반환 (기본: 룰 기반) */
export function getCopyGenerator(): CopyGenerator {
  const rule = new RuleBasedGenerator();
  if (process.env.EXPO_PUBLIC_AI_API_KEY) {
    return new AiCopyGenerator(rule);
  }
  return rule;
}
