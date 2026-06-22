import { CATEGORIES } from './categories.js';
import { ingredients_1 } from './ingredients_1.js';
import { ingredients_2 } from './ingredients_2.js';
import { ingredients_3 } from './ingredients_3.js';

export { CATEGORIES };
export const ingredients = [...ingredients_1, ...ingredients_2, ...ingredients_3];

export const synergies = [
  { ids: ['hyaluronic-acid', 'glycerin', 'panthenol'], label: '수분 폭탄 트리오', effect: '피부 표면~심층까지 3단계 수분 공급. 당김과 건조함 완전 해소.', boost: ['ceramide', 'squalane'] },
  { ids: ['niacinamide', 'vitamin-c', 'arbutin'], label: '미백 삼총사', effect: '멜라닌 생성·이동·전달 모든 단계 차단. 빠른 피부 톤 개선.', boost: ['ferulic-acid', 'tranexamic'] },
  { ids: ['retinol', 'peptide', 'ceramide'], label: '항노화 최강 조합', effect: '세포 재생 + 콜라겐 합성 + 장벽 강화. 주름 개선의 교과서.', boost: ['panthenol', 'hyaluronic-acid'] },
  { ids: ['aha', 'bha', 'pha'], label: 'AHA+BHA+PHA 올킬', effect: '표면·모공·민감 피부를 동시 케어하는 3중 각질 관리.', boost: ['allantoin', 'centella'] },
  { ids: ['centella', 'bisabolol', 'allantoin'], label: '진정 최고 콤비', effect: '트러블 후 붉음과 자극 즉시 진정. 회복력 극대화.', boost: ['panthenol', 'beta-glucan'] },
  { ids: ['tocopherol', 'vitamin-c', 'ferulic-acid'], label: '항산화 트리플 시너지', effect: '비타민 C+E를 페루라산이 2~8배 강화. 광노화 최강 방어.', boost: ['resveratrol', 'green-tea-extract'] },
  { ids: ['ceramide', 'cholesterol', 'squalane'], label: '피부 장벽 복구 3종세트', effect: '3대 장벽 지질 복원. 아토피·민감성 피부 근본 해결.', boost: ['panthenol', 'beta-glucan-sooth'] },
  { ids: ['niacinamide', 'zinc-pca', 'bha'], label: '지성·여드름 완벽 케어', effect: '피지 조절 + 여드름균 억제 + 모공 각질 제거.', boost: ['azelaic-acid', 'tea-tree-oil'] },
  { ids: ['pitera', 'bifida-filtrate', 'rice-ferment'], label: '발효 미백 트리오', effect: '발효 유래 복합 성분으로 미백·항노화·장벽 강화 동시.', boost: ['niacinamide'] },
  { ids: ['bakuchiol', 'peptide', 'polyglutamic-acid'], label: '자극 없는 항노화', effect: '레티놀 없이 레티놀급 항노화. 민감 피부 야간 루틴 최적.', boost: ['ceramide', 'squalane'] },
  { ids: ['argan-oil', 'squalane', 'jojoba-oil'], label: '오일 황금 비율', effect: '산화 안정성 + 피지 유사 조성. 천연 피부막 완성.', boost: ['tocopherol'] },
  { ids: ['kojic-acid', 'arbutin', 'licorice-extract'], label: '기미 집중 솔루션', effect: '티로시나제를 여러 경로로 동시 억제. 완고한 기미에 최적.', boost: ['tranexamic', 'vitamin-c'] },
  { ids: ['oat-extract', 'allantoin', 'ectoin'], label: '초민감 피부 진정', effect: '가려움·자극·환경 스트레스를 3중으로 케어.', boost: ['centella', 'bisabolol'] },
  { ids: ['glycerin', 'hyaluronic-acid', 'polyglutamic-acid'], label: '수분 레이어링', effect: '단분자·다분자·대분자 3단계 수분 레이어 완성.', boost: ['ceramide', 'panthenol'] },
  { ids: ['coq10', 'astaxanthin', 'resveratrol'], label: '항산화 프리미엄', effect: '미토콘드리아부터 세포막까지 전방위 자유라디칼 차단.', boost: ['tocopherol', 'ferulic-acid'] },
];
