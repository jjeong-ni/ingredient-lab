import { useState, useMemo } from 'react';
import { lineageMapByFormulaId } from '../utils/lineage';
import CompareDialog from './CompareDialog';
import { ingredients } from '../data/ingredients';
import { GOAL_MAP, computeGoalScore } from '../data/goals';

const SURFACE = {
  background: '#FFFFFF',
  border: '1px solid #E5E5E5',
  boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
};

function Stars({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} onClick={() => onChange(n === value ? 0 : n)}
          className="transition-all active:scale-90"
          style={{ fontSize: 20, color: n <= value ? '#F59E0B' : '#E5E5E5', lineHeight: 1 }}>
          ★
        </button>
      ))}
    </div>
  );
}

function NoteEditor({ formula, onUpdateFormula }) {
  const note = formula.note || {};
  const [result, setResult] = useState(note.result || '');
  const [improve, setImprove] = useState(note.improve || '');
  const [rating, setRating] = useState(note.rating || 0);
  const [saved, setSaved] = useState(false);

  function save() {
    onUpdateFormula(formula.id, { note: { result, improve, rating } });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <div className="pt-3 space-y-3" style={{ borderTop: '1px dashed #E5E5E5' }}>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: '#888888' }}>만족도</p>
        <Stars value={rating} onChange={setRating} />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: '#888888' }}>실험 결과</p>
        <textarea value={result} onChange={(e) => setResult(e.target.value)}
          placeholder="사용감, 텍스처, 효과 등 실험에서 확인한 것들을 기록하세요"
          rows={2}
          className="w-full p-3 rounded-lg text-xs outline-none resize-none"
          style={{ background: '#FAFAFA', border: '1px solid #E5E5E5', color: '#171717', lineHeight: 1.6 }} />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: '#888888' }}>보완할 점</p>
        <textarea value={improve} onChange={(e) => setImprove(e.target.value)}
          placeholder="다음 실험에서 바꿔볼 것들 — 함량 조절, 성분 교체 등"
          rows={2}
          className="w-full p-3 rounded-lg text-xs outline-none resize-none"
          style={{ background: '#FAFAFA', border: '1px solid #E5E5E5', color: '#171717', lineHeight: 1.6 }} />
      </div>
      <button onClick={save}
        className="w-full py-2.5 rounded-lg text-xs font-bold text-white transition-all active:scale-[0.97]"
        style={{ background: saved ? '#15803D' : '#171717' }}>
        {saved ? '✓ 노트 저장됨!' : '📝 노트 저장'}
      </button>
    </div>
  );
}

function ExperimentCard({ formula, onUpdateFormula, onDeleteFormula, onReExperiment, canReExperiment, lineage, onCompare }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const note = formula.note || {};
  const hasNote = !!(note.result || note.improve || note.rating);
  const total = formula.items.reduce((s, i) => s + i.pct, 0);
  const version = formula.version || 1;
  const canCompare = lineage && lineage.length >= 2;

  const goalScore = useMemo(() => {
    if (!formula.goals || formula.goals.length === 0) return null;
    const fullItems = formula.items
      .map((it) => {
        const ing = ingredients.find((i) => i.id === it.ingId) || ingredients.find((i) => i.name === it.name);
        return ing ? { ingredient: ing, pct: it.pct } : null;
      })
      .filter(Boolean);
    return computeGoalScore(formula.goals, fullItems);
  }, [formula]);

  async function handleCopy() {
    const lines = [
      `${formula.icon} ${formula.name} (${formula.l1Label} · ${formula.l2Label})`,
      `실험일: ${formula.createdAt}${version > 1 ? ` · ${version}차 실험` : ''}`,
      '─'.repeat(24),
      ...formula.items.map((it) => `${it.emoji} ${it.name}: ${it.pct.toFixed(2)}%`),
      '─'.repeat(24),
      `총 함량: ${total.toFixed(2)}%`,
    ];
    if (note.result) lines.push('', `📋 결과: ${note.result}`);
    if (note.improve) lines.push(`🔧 보완: ${note.improve}`);
    if (note.rating) lines.push(`⭐ 만족도: ${'★'.repeat(note.rating)}`);
    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {}
  }

  return (
    <div className="rounded-xl overflow-hidden" style={SURFACE}>
      <button onClick={() => setExpanded(!expanded)} className="w-full flex items-start gap-3 p-4 text-left">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: '#F4F4F5' }}>
          {formula.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className="font-bold text-sm" style={{ color: '#171717' }}>{formula.name}</p>
            {version > 1 && (
              <span className="px-1.5 py-0.5 rounded-full text-white"
                style={{ fontSize: 9, fontWeight: 800, background: '#7C3AED' }}>{version}차</span>
            )}
            {canCompare && (
              <button onClick={(e) => { e.stopPropagation(); onCompare(formula, lineage); }}
                className="px-1.5 py-0.5 rounded-full transition-all active:scale-95"
                style={{ fontSize: 9, fontWeight: 800, background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #DBEAFE' }}>
                🆚 비교
              </button>
            )}
            {hasNote
              ? <span className="px-1.5 py-0.5 rounded-full" style={{ fontSize: 9, fontWeight: 700, background: '#F0FDF4', color: '#15803D', border: '1px solid #BBF7D0' }}>📝 기록됨</span>
              : <span className="px-1.5 py-0.5 rounded-full" style={{ fontSize: 9, fontWeight: 700, background: '#FFFBEB', color: '#B45309', border: '1px solid #FDE68A' }}>노트 미작성</span>}
            {goalScore && (
              <span className="px-1.5 py-0.5 rounded-full"
                style={{ fontSize: 9, fontWeight: 800, background: '#FAFAFA', color: goalScore.score === 100 ? '#16a34a' : '#D97706', border: '1px solid #E5E5E5' }}>
                🎯 {goalScore.score}%
              </span>
            )}
          </div>
          {formula.goals?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {formula.goals.map((gid) => {
                const g = GOAL_MAP[gid];
                if (!g) return null;
                return (
                  <span key={gid} className="px-1.5 py-0.5 rounded-full" style={{ fontSize: 9, fontWeight: 600, background: '#F4F4F5', color: '#666666' }}>
                    {g.icon} {g.label}
                  </span>
                );
              })}
            </div>
          )}
          <p className="text-[10px] mt-0.5" style={{ color: '#888888' }}>
            {formula.l1Label} · {formula.l2Label} · {formula.createdAt} · 성분 {formula.items.length}개 · {total.toFixed(1)}%
          </p>
          {note.rating > 0 && (
            <p className="mt-0.5" style={{ fontSize: 11, color: '#F59E0B' }}>{'★'.repeat(note.rating)}{'☆'.repeat(5 - note.rating)}</p>
          )}
        </div>
        <span className="flex-shrink-0 mt-1" style={{ fontSize: 11, color: '#BBBBBB' }}>{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3">
          <div className="flex flex-wrap gap-1">
            {formula.items.map((it, i) => (
              <span key={i} className="text-[10px] px-2 py-1 rounded-full font-medium"
                style={{ background: '#F4F4F5', color: '#444444' }}>
                {it.emoji} {it.name} {it.pct.toFixed(1)}%
              </span>
            ))}
          </div>

          {(note.result || note.improve) && (
            <div className="rounded-lg p-3 space-y-1.5" style={{ background: '#FAFAFA', border: '1px solid #F0F0F0' }}>
              {note.result && <p style={{ fontSize: 11, color: '#171717' }}><b>📋 결과</b> — {note.result}</p>}
              {note.improve && <p style={{ fontSize: 11, color: '#171717' }}><b>🔧 보완</b> — {note.improve}</p>}
            </div>
          )}

          <NoteEditor formula={formula} onUpdateFormula={onUpdateFormula} />

          <div className="flex gap-2">
            <button onClick={handleCopy}
              className="flex-1 py-2.5 rounded-lg text-xs font-bold transition-all active:scale-[0.97]"
              style={copied
                ? { background: '#F0FDF4', color: '#15803D', border: '1px solid #BBF7D0' }
                : { background: '#FFFFFF', color: '#444444', border: '1px solid #E5E5E5' }}>
              {copied ? '✓ 복사됨' : '📋 복사'}
            </button>
            <button onClick={() => onReExperiment(formula)}
              disabled={!canReExperiment(formula)}
              className="flex-1 py-2.5 rounded-lg text-xs font-bold text-white transition-all active:scale-[0.97] disabled:opacity-40"
              style={{ background: '#0072F5' }}>
              🔄 재실험
            </button>
            <button onClick={() => onDeleteFormula(formula.id)}
              className="w-10 py-2.5 rounded-lg text-xs font-bold"
              style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}>×</button>
          </div>
          {!canReExperiment(formula) && (
            <p style={{ fontSize: 10, color: '#888888' }}>이전 버전에서 저장된 실험이라 재실험 정보가 없어요.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function LabNotebook({ savedFormulas, onUpdateFormula, onDeleteFormula, onReExperiment, canReExperiment, onBack }) {
  const list = [...(savedFormulas || [])].reverse();
  const noteCount = list.filter((f) => f.note && (f.note.result || f.note.improve || f.note.rating)).length;
  const lineageMap = useMemo(() => lineageMapByFormulaId(savedFormulas), [savedFormulas]);
  const [compareState, setCompareState] = useState(null);

  function handleCompare(formula, lineage) {
    const idx = lineage.findIndex((f) => f.id === formula.id);
    // 기본: 현재 실험과 바로 이전 버전 비교 (최초 버전이면 바로 다음 버전과 비교)
    const [aIdx, bIdx] = idx > 0 ? [idx - 1, idx] : [idx, Math.min(1, lineage.length - 1)];
    setCompareState({ lineage, initialA: lineage[aIdx], initialB: lineage[bIdx] });
  }

  return (
    <div className="px-4 pt-3 pb-6">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-semibold mb-3" style={{ color: '#888888' }}>
        ← 실험실 홈
      </button>

      <div className="rounded-lg p-4 mb-4 flex items-center gap-3" style={{ background: '#171717' }}>
        <span className="text-3xl">📓</span>
        <div>
          <p className="font-bold text-white text-base leading-tight">실험노트</p>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.55)' }}>
            실험 {list.length}건 · 노트 작성 {noteCount}건
          </p>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
          <span className="text-5xl mb-4">🧫</span>
          <p className="font-bold text-base mb-1" style={{ color: '#171717' }}>아직 실험 기록이 없어요</p>
          <p className="text-sm" style={{ color: '#888888' }}>배합을 만들어 저장하면 여기에 쌓여요</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {list.map((f) => (
            <ExperimentCard key={f.id} formula={f}
              onUpdateFormula={onUpdateFormula}
              onDeleteFormula={onDeleteFormula}
              onReExperiment={onReExperiment}
              canReExperiment={canReExperiment}
              lineage={lineageMap.get(f.id)}
              onCompare={handleCompare} />
          ))}
        </div>
      )}

      {compareState && (
        <CompareDialog lineage={compareState.lineage}
          initialA={compareState.initialA} initialB={compareState.initialB}
          onClose={() => setCompareState(null)} />
      )}
    </div>
  );
}
