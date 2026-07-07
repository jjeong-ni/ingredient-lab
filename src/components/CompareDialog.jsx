import { useState, useMemo } from 'react';
import { diffFormulas } from '../utils/lineage';

function VersionChips({ lineage, value, onChange, otherValue }) {
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
      {lineage.map((f) => {
        const active = f.id === value.id;
        const disabled = f.id === otherValue.id;
        return (
          <button key={f.id} disabled={disabled} onClick={() => onChange(f)}
            className="flex-shrink-0 px-3.5 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all active:scale-95 disabled:opacity-30"
            style={active
              ? { background: '#16201C', color: 'white' }
              : { background: '#FFFFFF', color: '#445048', border: '1px solid #DCE3DE' }}>
            {f.version || 1}차 · {f.createdAt}
          </button>
        );
      })}
    </div>
  );
}

function PctDelta({ from, to }) {
  const delta = to - from;
  const color = delta > 0 ? '#1B6E63' : delta < 0 ? '#DC2626' : '#5F6B65';
  const sign = delta > 0 ? '+' : '';
  return (
    <span className="flex items-center gap-1 text-xs">
      <span style={{ color: '#5F6B65' }}>{from.toFixed(2)}%</span>
      <span style={{ color: '#93A29A' }}>→</span>
      <span style={{ fontWeight: 800, color: '#16201C' }}>{to.toFixed(2)}%</span>
      <span style={{ fontWeight: 700, color }}>({sign}{delta.toFixed(2)}%p)</span>
    </span>
  );
}

function IngRow({ item, kind }) {
  const badge = {
    added:   { label: '+ 추가', bg: '#F0FDF4', color: '#15803D', border: '#BBF7D0' },
    removed: { label: '− 제거', bg: '#FEF2F2', color: '#DC2626', border: '#FECACA' },
    changed: { label: '± 변경', bg: '#E6F1EC', color: '#1E4D38', border: '#C8E3DA' },
  }[kind];
  return (
    <div className="flex items-center justify-between gap-2 py-1.5">
      <div className="flex items-center gap-1.5 min-w-0">
        <span className="flex-shrink-0">{item.emoji}</span>
        <span className="truncate" style={{ fontSize: 12, fontWeight: 600, color: '#16201C' }}>{item.name}</span>
      </div>
      <div className="flex-shrink-0 flex items-center gap-1.5">
        {kind === 'changed'
          ? <PctDelta from={item.pctFrom} to={item.pctTo} />
          : <span style={{ fontSize: 12, fontWeight: 700, color: badge.color }}>{item.pct.toFixed(2)}%</span>}
        <span className="px-1.5 py-0.5 rounded-full flex-shrink-0"
          style={{ fontSize: 9, fontWeight: 800, background: badge.bg, color: badge.color, border: `1px solid ${badge.border}` }}>
          {badge.label}
        </span>
      </div>
    </div>
  );
}

export default function CompareDialog({ lineage, initialA, initialB, onClose }) {
  const [a, setA] = useState(initialA);
  const [b, setB] = useState(initialB);
  const diff = useMemo(() => diffFormulas(a, b), [a, b]);
  const ratingA = a.note?.rating || 0;
  const ratingB = b.note?.rating || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
      <div className="relative rounded-2xl w-full max-w-[400px] max-h-[88vh] flex flex-col overflow-hidden"
        style={{ background: '#FFFFFF', boxShadow: '0 24px 80px rgba(0,0,0,0.18)' }}
        onClick={(e) => e.stopPropagation()}>
        <div className="flex-shrink-0 px-5 pt-5 pb-3" style={{ borderBottom: '1px solid #F0F0F0' }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p style={{ fontSize: 15, fontWeight: 800, color: '#16201C' }}>🆚 실험 비교</p>
              <p style={{ fontSize: 11, color: '#5F6B65' }}>{a.icon} {a.name}</p>
            </div>
            <button onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: '#E6EEE9', color: '#666666' }}>✕</button>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#5F6B65' }}>이전 (A)</p>
          <VersionChips lineage={lineage} value={a} onChange={setA} otherValue={b} />
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1 mt-2" style={{ color: '#5F6B65' }}>이후 (B)</p>
          <VersionChips lineage={lineage} value={b} onChange={setB} otherValue={a} />
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          <div className="rounded-lg p-3 flex items-center justify-between" style={{ background: '#EFF3F1', border: '1px solid #F0F0F0' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#445048' }}>총 함량</span>
            <PctDelta from={diff.totalA} to={diff.totalB} />
          </div>

          {(ratingA > 0 || ratingB > 0) && (
            <div className="rounded-lg p-3 flex items-center justify-between" style={{ background: '#EFF3F1', border: '1px solid #F0F0F0' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#445048' }}>만족도</span>
              <div className="flex items-center gap-2" style={{ fontSize: 12 }}>
                <span style={{ color: '#F59E0B' }}>{'★'.repeat(ratingA)}{'☆'.repeat(5 - ratingA)}</span>
                <span style={{ color: '#93A29A' }}>→</span>
                <span style={{ color: '#F59E0B' }}>{'★'.repeat(ratingB)}{'☆'.repeat(5 - ratingB)}</span>
              </div>
            </div>
          )}

          {diff.added.length === 0 && diff.removed.length === 0 && diff.changed.length === 0 && (
            <p className="text-center py-2" style={{ fontSize: 12, color: '#5F6B65' }}>성분 구성 변화가 없어요</p>
          )}

          {diff.added.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#15803D' }}>추가된 성분 {diff.added.length}개</p>
              <div className="rounded-lg px-3" style={{ background: '#FFFFFF', border: '1px solid #DCE3DE' }}>
                {diff.added.map((it, i) => <IngRow key={i} item={it} kind="added" />)}
              </div>
            </div>
          )}
          {diff.removed.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#DC2626' }}>제거된 성분 {diff.removed.length}개</p>
              <div className="rounded-lg px-3" style={{ background: '#FFFFFF', border: '1px solid #DCE3DE' }}>
                {diff.removed.map((it, i) => <IngRow key={i} item={it} kind="removed" />)}
              </div>
            </div>
          )}
          {diff.changed.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#1E4D38' }}>함량 변경 {diff.changed.length}개</p>
              <div className="rounded-lg px-3" style={{ background: '#FFFFFF', border: '1px solid #DCE3DE' }}>
                {diff.changed.map((it, i) => <IngRow key={i} item={it} kind="changed" />)}
              </div>
            </div>
          )}

          {(a.note?.result || a.note?.improve || b.note?.result || b.note?.improve) && (
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg p-3" style={{ background: '#EFF3F1', border: '1px solid #F0F0F0' }}>
                <p className="text-[10px] font-bold mb-1" style={{ color: '#5F6B65' }}>{a.version || 1}차 노트</p>
                {a.note?.result && <p style={{ fontSize: 11, color: '#16201C' }} className="mb-1">📋 {a.note.result}</p>}
                {a.note?.improve && <p style={{ fontSize: 11, color: '#16201C' }}>🔧 {a.note.improve}</p>}
                {!a.note?.result && !a.note?.improve && <p style={{ fontSize: 11, color: '#93A29A' }}>기록 없음</p>}
              </div>
              <div className="rounded-lg p-3" style={{ background: '#EFF3F1', border: '1px solid #F0F0F0' }}>
                <p className="text-[10px] font-bold mb-1" style={{ color: '#5F6B65' }}>{b.version || 1}차 노트</p>
                {b.note?.result && <p style={{ fontSize: 11, color: '#16201C' }} className="mb-1">📋 {b.note.result}</p>}
                {b.note?.improve && <p style={{ fontSize: 11, color: '#16201C' }}>🔧 {b.note.improve}</p>}
                {!b.note?.result && !b.note?.improve && <p style={{ fontSize: 11, color: '#93A29A' }}>기록 없음</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
