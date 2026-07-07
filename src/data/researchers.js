import { ingredients, synergies, CATEGORIES } from './ingredients';
import { parseConc } from './productTypes';
import { getOrigin } from '../utils/origin';
import { computeGoalScore, suggestForGoal } from './goals';
import { estimateFormulaCost, formatKRW } from './costs';
import { computeStability } from './stability';

/** 실험을 도와주는 연구팀 5인 */
export const RESEARCHERS = [
  {
    id: 'cha', name: '차보라', title: '수석연구원', emoji: '👩‍🔬', color: '#7C3AED',
    ability: '성분 궁합 아카이브',
    desc: '15년차 처방 전문가. 업계에서 가장 방대한 시너지·충돌 조합 데이터를 보유하고 있어요.',
  },
  {
    id: 'nam', name: '남정균', title: '연구과장', emoji: '🧑‍💼', color: '#4C7A9E',
    ability: '배합 밸런스 관리',
    desc: '제형 안정화 담당. 총 함량과 필수 카테고리, 가이드 대비 밸런스를 꼼꼼히 챙겨요.',
  },
  {
    id: 'oh', name: '오세이프', title: '안전성 박사', emoji: '🥼', color: '#DC2626',
    ability: '안전성·규제 검토',
    desc: '피부과 자문 출신. 권장 농도 초과와 자극 위험 조합을 놓치지 않아요.',
  },
  {
    id: 'geum', name: '금아리', title: '주임연구원', emoji: '💡', color: '#D97706',
    ability: '창의 아이디어 뱅크',
    desc: '트렌드에 밝은 팀 막내. 지금 배합에 딱 어울리는 다음 성분을 제안해요.',
  },
  {
    id: 'pyo', name: '표소싱', title: '소싱 매니저', emoji: '🤝', color: '#9C6B30',
    ability: '원료 소싱·제조사 연결',
    desc: '원료사 인맥왕. 성분 유래 정보와 비건 대체 원료, 수급처를 연결해줘요.',
  },
];

export const RESEARCHER_MAP = Object.fromEntries(RESEARCHERS.map((r) => [r.id, r]));

/** 함께 배합하면 주의가 필요한 조합 (id 기준) */
const CONFLICTS = [
  { pair: ['retinol', 'aha'], text: '레티놀과 AHA를 한 제품에 넣으면 자극이 크게 증가해요. 둘 중 하나만 선택하는 걸 권해요.' },
  { pair: ['retinol', 'bha'], text: '레티놀과 BHA 조합은 각질 제거가 겹쳐 피부 장벽을 해칠 수 있어요.' },
  { pair: ['retinol', 'pha'], text: '레티놀과 PHA도 저자극이라지만 한 제형에서는 자극이 누적돼요.' },
  { pair: ['retinol', 'vitamin-c'], text: '레티놀과 순수 비타민 C는 안정 pH가 달라서 한 제형에 넣으면 서로 효능이 떨어져요.' },
  { pair: ['aha', 'vitamin-c'], text: '저pH 산 성분이 중복돼요. pH 안정성과 자극 모두 주의가 필요해요.' },
  { pair: ['bha', 'vitamin-c'], text: 'BHA와 순수 비타민 C를 같이 쓰면 산도가 과해져 민감 피부엔 부담이에요.' },
];

/** 역할이 겹치면 비효율적인 액티브 카테고리 (이 개수 이상이면 경고) */
const OVERLAP_RULES = [
  { category: 'brightening', limit: 3 },
  { category: 'antiaging', limit: 3 },
  { category: 'exfoliant', limit: 2 },
  { category: 'sunscreen', limit: 3 },
  { category: 'preservative', limit: 3 },
];

/** 금아리 주임의 트렌드 코멘트 (성분 id → 한마디) */
const TREND_NOTES = {
  bakuchiol: '바쿠치올은 요즘 "비건 레티놀"로 완전 핫해요! 마케팅 포인트로 딱이에요.',
  ectoin: '엑토인은 요즘 더마 브랜드들이 앞다퉈 넣는 성분이에요. 좋은 선택!',
  pdrn: 'PDRN은 지금 K-뷰티 최고 트렌드 성분이에요. 재생 라인 콘셉트 어때요?',
  'polyglutamic-acid': '폴리글루탐산은 히알루론산보다 4배 보습력으로 요즘 주목받고 있어요.',
  'bifida-filtrate': '비피다 발효물은 럭셔리 에센스 콘셉트의 시그니처 성분이죠.',
};

const pick = (arr, n) => arr.slice(0, n);

/**
 * 배합 분석 → 연구팀 코멘트 생성
 * @returns [{ rid, type: 'warn'|'praise'|'tip'|'info', text }]
 */
export function analyzeFormula(formula, l3, goals) {
  const msgs = [];
  const items = formula || [];
  const ids = items.map((f) => f.ingredient.id);
  const idSet = new Set(ids);
  const total = items.reduce((s, f) => s + f.pct, 0);

  if (items.length === 0) {
    msgs.push({ rid: 'nam', type: 'tip', text: l3 ? `${l3.label} 실험을 시작해볼까요? 성분을 고르면 저희 연구팀이 실시간으로 분석해드릴게요.` : '성분을 골라보세요. 연구팀이 실시간으로 분석해드릴게요.' });
    return msgs;
  }

  /* ── 남정균 과장: 목표 달성도 ───────────────────────── */
  if (goals && goals.length > 0) {
    const goalResult = computeGoalScore(goals, items);
    if (goalResult) {
      if (goalResult.score === 100) {
        msgs.push({ rid: 'nam', type: 'praise', text: `설정한 목표 ${goalResult.total}개를 모두 달성했어요! 🎯 지금 배합으로 실험을 진행해도 좋을 것 같아요.` });
      } else {
        msgs.push({ rid: 'nam', type: 'info', text: `목표 달성도 ${goalResult.score}% (${goalResult.covered}/${goalResult.total}). 아직 부족한 부분이 있어요.` });
        const existingIds = new Set(ids);
        goalResult.results.filter((r) => !r.covered).forEach((r) => {
          const s = suggestForGoal(r.goal, existingIds);
          if (s) msgs.push({ rid: 'geum', type: 'tip', text: `"${r.goal.icon} ${r.goal.label}" 목표가 비어있어요. ${s.emoji} ${s.name}을 넣어보는 건 어때요?` });
        });
      }
    }
  }

  /* ── 차보라 수석: 시너지 & 충돌 & 역할 겹침 ───────────── */
  const fullMatches = [];
  synergies.forEach((s) => {
    const have = s.ids.filter((id) => idSet.has(id));
    if (have.length === s.ids.length) {
      fullMatches.push(s);
      msgs.push({ rid: 'cha', type: 'praise', text: `"${s.label}" 조합 완성! ${s.effect}` });
    } else if (have.length === s.ids.length - 1) {
      const missing = s.ids.find((id) => !idSet.has(id));
      const ing = ingredients.find((i) => i.id === missing);
      if (ing) msgs.push({ rid: 'cha', type: 'tip', text: `${ing.emoji} ${ing.name}만 더 넣으면 "${s.label}" 시너지가 완성돼요!` });
    }
  });

  CONFLICTS.forEach((c) => {
    if (c.pair.every((id) => idSet.has(id))) {
      msgs.push({ rid: 'cha', type: 'warn', text: c.text });
    }
  });

  if (idSet.has('niacinamide') && idSet.has('vitamin-c')) {
    msgs.push({ rid: 'cha', type: 'info', text: '나이아신아마이드+비타민C는 예전엔 금기로 알려졌지만, 최신 연구상 저농도에선 함께 써도 괜찮아요.' });
  }

  OVERLAP_RULES.forEach(({ category, limit }) => {
    const inCat = items.filter((f) => f.ingredient.category === category);
    if (inCat.length >= limit) {
      const cat = CATEGORIES[category];
      msgs.push({
        rid: 'cha', type: 'warn',
        text: `${cat?.icon || ''} ${cat?.label || category} 성분이 ${inCat.length}개예요 (${inCat.map((f) => f.ingredient.name).join(', ')}). 역할이 겹치면 효율은 안 오르고 자극만 늘어요. 대표 성분만 남기는 걸 추천해요.`,
      });
    }
  });

  /* ── 남정균 과장: 배합 밸런스 ───────────────────────── */
  if (total > 100) {
    msgs.push({ rid: 'nam', type: 'warn', text: `총 함량이 ${total.toFixed(1)}%로 100%를 초과했어요! 함량을 줄여야 제형이 성립합니다.` });
  }

  if (l3?.defaults) {
    const catTotals = {};
    items.forEach((f) => { catTotals[f.ingredient.category] = (catTotals[f.ingredient.category] || 0) + f.pct; });

    if (l3.defaults.base >= 30 && !catTotals.base) {
      msgs.push({ rid: 'nam', type: 'tip', text: `${l3.label}은 기제(정제수 등)가 ${l3.defaults.base}% 정도 필요한 제형이에요. 💧 정제수부터 채워볼까요?` });
    }
    if (l3.defaults.preservative && !catTotals.preservative && items.length >= 3) {
      msgs.push({ rid: 'nam', type: 'tip', text: '보존제가 빠졌어요. 수분이 있는 제형은 방부 시스템 없이는 유통이 불가능해요. 🔒' });
    }
    Object.entries(catTotals).forEach(([cat, pct]) => {
      const guide = l3.defaults[cat];
      if (guide && pct > guide * 2 && pct - guide > 3) {
        const c = CATEGORIES[cat];
        msgs.push({ rid: 'nam', type: 'info', text: `${c?.label || cat} 함량(${pct.toFixed(1)}%)이 가이드(${guide}%)의 2배를 넘었어요. 텍스처가 무거워질 수 있어요.` });
      }
    });
  }

  /* ── 오세이프 박사: 안전성 ─────────────────────────── */
  items.forEach((f) => {
    const conc = parseConc(f.ingredient.concentration);
    if (f.ingredient.concentration && f.pct > conc.max) {
      msgs.push({ rid: 'oh', type: 'warn', text: `${f.ingredient.emoji} ${f.ingredient.name} ${f.pct.toFixed(1)}%는 권장 상한(${conc.max}%)을 초과해요. 자극·규제 리스크가 있어요.` });
    }
  });
  pick(items.filter((f) => f.ingredient.safety <= 2), 2).forEach((f) => {
    msgs.push({ rid: 'oh', type: 'warn', text: `${f.ingredient.emoji} ${f.ingredient.name}은 안전성 등급이 낮은 성분이에요. ${f.ingredient.tip || '민감성 피부 대상 테스트를 꼭 거치세요.'}` });
  });
  const lowSafeCount = items.filter((f) => f.ingredient.safety <= 3).length;
  if (items.length >= 4 && lowSafeCount === 0) {
    msgs.push({ rid: 'oh', type: 'praise', text: '전 성분이 안전성 우수 등급이에요. 민감성 피부 라인으로도 손색없어요! ✅' });
  }

  const stability = computeStability(items);
  if (stability.phConflict) {
    msgs.push({
      rid: 'oh', type: 'warn',
      text: `${stability.phContributors.map((it) => it.ingredient.name).join(', ')}는 안정적인 pH 요구 범위가 서로 겹치지 않아요. 한 제형에 넣으면 효능이 깨질 수 있어요.`,
    });
  } else if (stability.phRange) {
    msgs.push({ rid: 'oh', type: 'info', text: `이 배합은 pH ${stability.phRange[0]}~${stability.phRange[1]}로 조정해야 활성 성분들이 안정적으로 작동해요.` });
  }
  if (stability.oxidationRisk) {
    msgs.push({
      rid: 'oh', type: 'warn',
      text: `${stability.oxidationProne.map((it) => it.ingredient.name).join(', ')}는 산화되기 쉬운데 항산화제가 없어요. 토코페롤이나 페룰산 추가를 권장해요.`,
    });
  }

  /* ── 금아리 주임: 창의 제안 ─────────────────────────── */
  const boostSuggestions = new Set();
  fullMatches.forEach((s) => {
    (s.boost || []).forEach((bid) => { if (!idSet.has(bid)) boostSuggestions.add(bid); });
  });
  pick([...boostSuggestions], 2).forEach((bid) => {
    const ing = ingredients.find((i) => i.id === bid);
    if (ing) msgs.push({ rid: 'geum', type: 'tip', text: `${ing.emoji} ${ing.name}을 추가하면 지금 시너지가 한층 부스트돼요! 저라면 꼭 넣을 것 같아요.` });
  });
  pick(ids.filter((id) => TREND_NOTES[id]), 2).forEach((id) => {
    msgs.push({ rid: 'geum', type: 'info', text: TREND_NOTES[id] });
  });

  /* ── 표소싱 매니저: 원료 소싱 ───────────────────────── */
  const animal = items.filter((f) => getOrigin(f.ingredient)?.label === '동물유래');
  if (animal.length > 0) {
    const a = animal[0];
    const alt = ingredients.find((i) =>
      i.category === a.ingredient.category && !idSet.has(i.id) &&
      getOrigin(i)?.label === '비건'
    );
    msgs.push({
      rid: 'pyo', type: 'info',
      text: `${a.ingredient.emoji} ${a.ingredient.name}은 동물유래 원료예요.${alt ? ` 비건 콘셉트를 원하시면 ${alt.emoji} ${alt.name}으로 대체 가능한 거래처가 있어요.` : ''}`,
    });
  } else if (items.length >= 3) {
    msgs.push({ rid: 'pyo', type: 'praise', text: '전 성분 비건 배합이에요! 🌱 비건 인증 획득이 가능한 조합이라 인증 대행사도 연결해드릴 수 있어요.' });
  }
  const fermented = items.find((f) => f.ingredient.category === 'fermented');
  if (fermented) {
    msgs.push({ rid: 'pyo', type: 'info', text: `${fermented.ingredient.emoji} 발효 원료는 로트별 품질 편차가 커요. 검증된 발효 전문 제조사를 소개해드릴게요.` });
  }

  if (items.length >= 2) {
    const { breakdown, total } = estimateFormulaCost(items);
    const top = breakdown[0];
    const topShare = total > 0 ? Math.round((top.cost / total) * 100) : 0;
    if (topShare >= 60) {
      msgs.push({
        rid: 'pyo', type: 'tip',
        text: `100g 기준 예상 원가는 ${formatKRW(total)}인데, ${top.ingredient.emoji} ${top.ingredient.name} 하나가 ${topShare}%를 차지해요. 등급을 낮추거나 대체 원료로 바꾸면 원가를 확 줄일 수 있어요. 거래처 연결해드릴까요?`,
      });
    } else {
      msgs.push({ rid: 'pyo', type: 'info', text: `100g 기준 예상 원가는 ${formatKRW(total)}예요. (원료 시세 추정치)` });
    }
  }

  /* 정렬: 경고 > 칭찬 > 제안 > 정보 */
  const order = { warn: 0, praise: 1, tip: 2, info: 3 };
  return msgs.sort((a, b) => order[a.type] - order[b.type]);
}
