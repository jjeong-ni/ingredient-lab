import { useState, useEffect } from 'react';

const SLIDES = [
  {
    emoji: '🧬',
    tag: '성분 LAB',
    title: '화장품 성분,\n이제 제대로 알아요',
    desc: '정제수부터 레티놀까지\n모든 성분의 기능·추출원·페인포인트를\n한눈에 확인하세요.',
    preview: (
      <div className="space-y-2">
        {[
          { emoji: '🫧', name: '히알루론산', tag: '보습', color: '#60a5fa', bg: '#eff6ff' },
          { emoji: '⚡', name: '나이아신아마이드', tag: '미백', color: '#f59e0b', bg: '#fffbeb' },
          { emoji: '🧱', name: '세라마이드', tag: '보습', color: '#60a5fa', bg: '#eff6ff' },
        ].map((item) => (
          <div key={item.name} className="flex items-center gap-3 rounded-2xl p-3"
            style={{ background: 'rgba(255,255,255,0.07)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ background: item.bg + '30' }}>
              {item.emoji}
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-semibold">{item.name}</p>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{ background: item.bg + '25', color: item.color }}>
                {item.tag}
              </span>
            </div>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.1)' }}>
              <span className="text-white text-sm">›</span>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    emoji: '📖',
    tag: '성분 사전',
    title: '22가지 핵심 성분을\n카드로 한눈에',
    desc: '카테고리별 필터와 검색으로\n원하는 성분을 바로 찾고\n페인포인트·농도·안전도까지 확인해요.',
    preview: (
      <div className="space-y-2.5">
        <div className="flex gap-2 flex-wrap">
          {['💧 보습', '✨ 미백', '⏳ 항노화', '🌿 진정', '🔄 각질제거'].map((cat) => (
            <span key={cat} className="text-xs px-3 py-1.5 rounded-full font-semibold"
              style={{ background: 'rgba(75,158,255,0.2)', color: '#93c5fd' }}>
              {cat}
            </span>
          ))}
        </div>
        <div className="rounded-2xl p-3" style={{ background: 'rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🍊</span>
            <div>
              <p className="text-white text-sm font-bold">비타민C (아스코르브산)</p>
              <p className="text-xs" style={{ color: '#f59e0b' }}>✨ 미백</p>
            </div>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
            강력한 항산화 + 미백. 멜라닌 합성 억제,<br />콜라겐 생성 보조.
          </p>
          <div className="mt-2 flex gap-1.5 flex-wrap">
            {['자외선 손상', '색소침착', '피부 톤'].map((p) => (
              <span key={p} className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}>
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    emoji: '⚗️',
    tag: '성분 실험실',
    title: '성분을 조합하면\n어떤 효과가 날까?',
    desc: '여러 성분을 선택하고\n시너지 효과를 분석해보세요.\n추가하면 더 좋은 성분도 추천해드려요.',
    preview: (
      <div className="space-y-2.5">
        <div className="flex gap-2 flex-wrap mb-1">
          {[
            { emoji: '🫧', name: '히알루론산', color: '#60a5fa', bg: '#eff6ff' },
            { emoji: '🧱', name: '세라마이드', color: '#60a5fa', bg: '#eff6ff' },
          ].map((item) => (
            <span key={item.name} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-semibold"
              style={{ background: 'rgba(96,165,250,0.2)', color: '#93c5fd', border: '1.5px solid rgba(96,165,250,0.3)' }}>
              {item.emoji} {item.name} ✕
            </span>
          ))}
        </div>
        <div className="rounded-2xl p-3" style={{ background: 'rgba(16,185,129,0.12)', border: '1.5px solid rgba(16,185,129,0.25)' }}>
          <div className="flex items-center gap-2 mb-1.5">
            <span>⭐</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(16,185,129,0.2)', color: '#6ee7b7' }}>
              탁월한 시너지
            </span>
          </div>
          <p className="text-white text-sm font-bold mb-1">수분 + 잠금</p>
          <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
            히알루론산이 수분을 흡수하면,<br />세라마이드가 장벽을 형성해 봉인.
          </p>
        </div>
        <div style={{ color: 'rgba(255,255,255,0.5)' }} className="text-xs text-center">
          ➕ 추가하면 더 좋은 성분 → <span style={{ color: '#93c5fd' }}>스쿠알란 · 글리세린</span>
        </div>
      </div>
    ),
  },
  {
    emoji: '🔍',
    tag: '스마트 검색',
    title: '피부 고민으로\n바로 찾아요',
    desc: '"모공", "주름", "여드름" 같은\n피부 고민 키워드로 검색하면\n관련 성분을 모두 찾아줘요.',
    preview: (
      <div className="space-y-2.5">
        <div className="flex items-center gap-2 rounded-2xl px-4 py-3"
          style={{ background: 'rgba(255,255,255,0.07)' }}>
          <span className="text-base">🔍</span>
          <span className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>어떤 피부 고민이 있으신가요?</span>
        </div>
        <p className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.4)' }}>🔥 인기 검색어</p>
        <div className="flex flex-wrap gap-2">
          {['보습', '미백', '주름', '여드름', '모공', '진정', '각질', '탄력'].map((kw) => (
            <span key={kw} className="text-xs px-3 py-1.5 rounded-full font-semibold"
              style={{ background: 'rgba(75,158,255,0.2)', color: '#93c5fd' }}>
              {kw}
            </span>
          ))}
        </div>
      </div>
    ),
  },
];

export default function OnboardingModal({ onClose }) {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const isLast = current === SLIDES.length - 1;

  const goNext = () => {
    if (animating) return;
    if (isLast) { onClose(); return; }
    setAnimating(true);
    setTimeout(() => {
      setCurrent((c) => c + 1);
      setAnimating(false);
    }, 150);
  };

  const slide = SLIDES[current];

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' }}>
      {/* 상단 여백 클릭 시 닫기 */}
      <div className="flex-1" onClick={onClose} />

      {/* 모달 */}
      <div className="rounded-t-3xl overflow-hidden flex flex-col"
        style={{ background: '#1C1C1E', maxHeight: '88vh' }}>

        {/* 핸들 */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.2)' }} />
        </div>

        <div className="px-6 pt-4 pb-2 flex-1 overflow-y-auto">
          {/* 태그 */}
          <div className="flex justify-center mb-4">
            <span className="text-xs font-bold px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(75,158,255,0.2)', color: '#60a5fa' }}>
              {slide.emoji} {slide.tag}
            </span>
          </div>

          {/* 제목 */}
          <h2 className="text-white text-2xl font-bold text-center leading-tight mb-2"
            style={{ whiteSpace: 'pre-line' }}>
            {slide.title}
          </h2>

          {/* 설명 */}
          <p className="text-center text-sm leading-relaxed mb-6"
            style={{ color: 'rgba(255,255,255,0.5)', whiteSpace: 'pre-line' }}>
            {slide.desc}
          </p>

          {/* 프리뷰 */}
          <div className="rounded-3xl p-4 mb-6"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            {slide.preview}
          </div>

          {/* 페이지 인디케이터 */}
          <div className="flex justify-center gap-1.5 mb-6">
            {SLIDES.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className="rounded-full transition-all"
                style={{
                  width: i === current ? 20 : 6,
                  height: 6,
                  background: i === current ? '#4B9EFF' : 'rgba(255,255,255,0.2)',
                }} />
            ))}
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="px-6 pb-10 pt-2 flex flex-col gap-3"
          style={{ background: '#1C1C1E' }}>
          <button onClick={goNext}
            className="w-full py-4 rounded-2xl text-white font-bold text-base transition-all active:scale-95"
            style={{ background: isLast
              ? 'linear-gradient(135deg, #4B9EFF 0%, #3B7DD8 100%)'
              : '#2C2C2E',
              boxShadow: isLast ? '0 4px 20px rgba(75,158,255,0.4)' : 'none',
            }}>
            {isLast ? '🚀 시작하기' : '다음'}
          </button>
          {!isLast && (
            <button onClick={onClose}
              className="w-full py-3 text-sm font-medium"
              style={{ color: 'rgba(255,255,255,0.35)' }}>
              건너뛰기
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
