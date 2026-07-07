/** parentId 체인을 따라가 저장된 실험들을 "같은 배합" 계보로 묶는다 */
export function buildLineages(savedFormulas) {
  const list = savedFormulas || [];
  const byId = new Map(list.map((f) => [f.id, f]));

  function findRoot(f) {
    let cur = f;
    let guard = 0;
    while (cur.parentId && byId.has(cur.parentId) && guard++ < 50) {
      cur = byId.get(cur.parentId);
    }
    return cur.id;
  }

  const groups = new Map();
  list.forEach((f) => {
    const root = findRoot(f);
    if (!groups.has(root)) groups.set(root, []);
    groups.get(root).push(f);
  });
  groups.forEach((arr) => arr.sort((a, b) => (a.version || 1) - (b.version || 1)));
  return groups;
}

/** formula.id → 같은 계보의 실험 배열 (버전 오름차순, 자기 자신 포함) */
export function lineageMapByFormulaId(savedFormulas) {
  const groups = buildLineages(savedFormulas);
  const map = new Map();
  groups.forEach((arr) => {
    arr.forEach((f) => map.set(f.id, arr));
  });
  return map;
}

const EPS = 0.005;

/** 두 실험(A→B) 사이 성분 함량 diff */
export function diffFormulas(a, b) {
  const mapA = new Map(a.items.map((it) => [it.ingId || it.name, it]));
  const mapB = new Map(b.items.map((it) => [it.ingId || it.name, it]));
  const allKeys = new Set([...mapA.keys(), ...mapB.keys()]);

  const added = [];
  const removed = [];
  const changed = [];
  const unchanged = [];

  allKeys.forEach((key) => {
    const itA = mapA.get(key);
    const itB = mapB.get(key);
    if (itA && !itB) removed.push(itA);
    else if (!itA && itB) added.push(itB);
    else if (Math.abs(itA.pct - itB.pct) > EPS) changed.push({ ...itB, pctFrom: itA.pct, pctTo: itB.pct });
    else unchanged.push(itB);
  });

  const totalA = a.items.reduce((s, i) => s + i.pct, 0);
  const totalB = b.items.reduce((s, i) => s + i.pct, 0);

  return { added, removed, changed, unchanged, totalA, totalB };
}
