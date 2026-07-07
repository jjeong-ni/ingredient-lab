import { useState, useMemo } from 'react';
import { RESEARCHERS, RESEARCHER_MAP, analyzeFormula } from '../data/researchers';

const TYPE_STYLE = {
  warn:   { border: '#FECACA', bg: '#FEF2F2', chip: '⚠️ 주의' },
  praise: { border: '#BBF7D0', bg: '#F0FDF4', chip: '⭐ 굿' },
  tip:    { border: '#DBEAFE', bg: '#EFF6FF', chip: '💡 제안' },
  info:   { border: '#E5E5E5', bg: '#FAFAFA', chip: 'ℹ️ 정보' },
};

function Avatar({ researcher, size = 36 }) {
  return (
    <div className="rounded-full flex items-center justify-center flex-shrink-0"
      style={{
        width: size, height: size, fontSize: size * 0.55,
        background: '#FFFFFF', border: `2px solid ${researcher.color}`,
      }}>
      {researcher.emoji}
    </div>
  );
}

function Bubble({ msg }) {
  const r = RESEARCHER_MAP[msg.rid];
  const st = TYPE_STYLE[msg.type];
  return (
    <div className="flex items-start gap-2.5">
      <Avatar researcher={r} size={34} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1">
          <span style={{ fontSize: 11, fontWeight: 800, color: r.color }}>{r.name}</span>
          <span style={{ fontSize: 10, color: '#888888', fontWeight: 600 }}>{r.title}</span>
          <span className="px-1.5 py-0.5 rounded-full"
            style={{ fontSize: 9, fontWeight: 700, background: st.bg, border: `1px solid ${st.border}`, color: '#444444' }}>
            {st.chip}
          </span>
        </div>
        <div className="rounded-xl rounded-tl-sm px-3 py-2.5"
          style={{ background: st.bg, border: `1px solid ${st.border}` }}>
          <p className="leading-relaxed" style={{ fontSize: 12, color: '#171717' }}>{msg.text}</p>
        </div>
      </div>
    </div>
  );
}

/** 연구팀 코멘트 전체 다이얼로그 */
function TeamDialog({ messages, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
      <div className="relative rounded-2xl w-full max-w-[400px] max-h-[80vh] flex flex-col overflow-hidden"
        style={{ background: '#FFFFFF', boxShadow: '0 24px 80px rgba(0,0,0,0.18)' }}
        onClick={(e) => e.stopPropagation()}>
        <div className="flex-shrink-0 px-5 pt-5 pb-3 flex items-center justify-between"
          style={{ borderBottom: '1px solid #F0F0F0' }}>
          <div>
            <p style={{ fontSize: 15, fontWeight: 800, color: '#171717' }}>🧑‍🔬 연구팀 분석</p>
            <p style={{ fontSize: 11, color: '#888888' }}>배합이 바뀔 때마다 실시간으로 분석해요</p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: '#F4F4F5', color: '#666666' }}>✕</button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {messages.map((m, i) => <Bubble key={i} msg={m} />)}
          {messages.length === 0 && (
            <p className="text-center py-8" style={{ fontSize: 12, color: '#888888' }}>아직 분석할 내용이 없어요</p>
          )}
        </div>
      </div>
    </div>
  );
}

/** 연구팀 소개 카드 행 (Step1용) */
export function ResearcherIntro() {
  const [selected, setSelected] = useState(null);
  return (
    <div className="mb-5">
      <p className="text-[10px] font-bold uppercase tracking-widest mb-2.5" style={{ color: '#888888' }}>함께하는 연구팀</p>
      <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
        {RESEARCHERS.map((r) => (
          <button key={r.id} onClick={() => setSelected(r)}
            className="flex-shrink-0 flex flex-col items-center gap-1.5 px-3.5 py-3 rounded-xl transition-all active:scale-95"
            style={{ background: '#FFFFFF', border: '1px solid #E5E5E5', boxShadow: '0 1px 3px rgba(0,0,0,0.07)', minWidth: 86 }}>
            <Avatar researcher={r} size={40} />
            <div className="text-center">
              <p style={{ fontSize: 11, fontWeight: 800, color: '#171717' }}>{r.name}</p>
              <p style={{ fontSize: 9, fontWeight: 600, color: r.color }}>{r.title}</p>
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: 'rgba(0,0,0,0.5)' }} onClick={() => setSelected(null)}>
          <div className="relative rounded-2xl w-full max-w-[340px] overflow-hidden"
            style={{ background: '#FFFFFF', boxShadow: '0 24px 80px rgba(0,0,0,0.18)' }}
            onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col items-center pt-7 pb-3 px-6">
              <Avatar researcher={selected} size={64} />
              <p className="mt-3" style={{ fontSize: 17, fontWeight: 800, color: '#171717' }}>{selected.name}</p>
              <p style={{ fontSize: 12, fontWeight: 700, color: selected.color }}>{selected.title}</p>
              <span className="mt-2 px-3 py-1 rounded-full"
                style={{ fontSize: 10, fontWeight: 700, background: '#F4F4F5', color: '#444444' }}>
                🎖 {selected.ability}
              </span>
              <p className="mt-3 text-center leading-relaxed" style={{ fontSize: 12, color: '#444444' }}>{selected.desc}</p>
            </div>
            <div className="px-5 pb-5 pt-2">
              <button onClick={() => setSelected(null)}
                className="w-full py-3 rounded-xl font-bold text-sm"
                style={{ background: '#F4F4F5', color: '#444444' }}>닫기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * 연구팀 패널
 * variant="floating": 플로팅 말풍선 버튼 (BuildStep) — 탭하면 전체 코멘트 다이얼로그
 * variant="inline": 카드형 코멘트 리스트 (FormulaStep)
 */
export default function ResearcherPanel({ formula, l3, variant = 'inline' }) {
  const [open, setOpen] = useState(false);
  const messages = useMemo(() => analyzeFormula(formula, l3), [formula, l3]);
  if (messages.length === 0) return null;

  const top = messages[0];
  const topR = RESEARCHER_MAP[top.rid];
  const warnCount = messages.filter((m) => m.type === 'warn').length;

  if (variant === 'floating') {
    return (
      <>
        <button onClick={() => setOpen(true)}
          className="fixed left-4 z-20 flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full transition-all active:scale-95"
          style={{
            bottom: formula.length > 0 ? '8.7rem' : '4.8rem',
            maxWidth: 'calc(100% - 32px)',
            background: '#FFFFFF',
            border: '1px solid #E5E5E5',
            boxShadow: '0 6px 24px rgba(0,0,0,0.14)',
          }}>
          <div className="relative flex-shrink-0">
            <Avatar researcher={topR} size={30} />
            {warnCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-white"
                style={{ background: '#DC2626', fontSize: 9, fontWeight: 800 }}>{warnCount}</span>
            )}
          </div>
          <span className="truncate" style={{ fontSize: 11, fontWeight: 600, color: '#171717', maxWidth: 220 }}>
            {top.text}
          </span>
        </button>
        {open && <TeamDialog messages={messages} onClose={() => setOpen(false)} />}
      </>
    );
  }

  // inline
  const shown = open ? messages : messages.slice(0, 3);
  return (
    <div className="rounded-lg p-4 mb-4"
      style={{ background: '#FFFFFF', border: '1px solid #E5E5E5', boxShadow: '0 1px 3px rgba(0,0,0,0.07)' }}>
      <div className="flex items-center justify-between mb-3">
        <p className="font-semibold text-sm" style={{ color: '#171717' }}>🧑‍🔬 연구팀 분석</p>
        <div className="flex -space-x-1.5">
          {RESEARCHERS.map((r) => <Avatar key={r.id} researcher={r} size={22} />)}
        </div>
      </div>
      <div className="space-y-3">
        {shown.map((m, i) => <Bubble key={i} msg={m} />)}
      </div>
      {messages.length > 3 && (
        <button onClick={() => setOpen(!open)}
          className="w-full mt-3 py-2 rounded-lg text-xs font-bold"
          style={{ background: '#F4F4F5', color: '#444444' }}>
          {open ? '접기 ▲' : `코멘트 ${messages.length - 3}개 더보기 ▼`}
        </button>
      )}
    </div>
  );
}
