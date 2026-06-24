import { CATEGORIES } from '../data/ingredients';
import { getOrigin } from '../utils/origin';

const safetyInfo = (n) => {
  if (n >= 5) return { text: '안전', dot: '#34d399', bg: 'rgba(209,250,229,0.65)', color: '#059669' };
  if (n >= 4) return { text: '양호', dot: '#60a5fa', bg: 'rgba(219,234,254,0.65)', color: '#2563EB' };
  if (n >= 3) return { text: '주의', dot: '#fbbf24', bg: 'rgba(254,243,199,0.65)', color: '#D97706' };
  return       { text: '경고', dot: '#f87171', bg: 'rgba(254,226,226,0.65)', color: '#DC2626' };
};

function ModalView({ ingredient, isFavorite, onFavoriteToggle }) {
  const cat = CATEGORIES[ingredient.category] || {};
  const safety = safetyInfo(ingredient.safety);
  const origin = getOrigin(ingredient);

  return (
    <div className="px-4 pb-2">
      <div className="rounded-2xl p-4 mb-4 flex items-start gap-3"
        style={{
          background: cat.bg || '#ede8f8',
          border: '1.5px solid rgba(255,255,255,0.85)',
          boxShadow: `0 4px 20px ${cat.color}18, inset 0 1px 0 rgba(255,255,255,0.9)`,
        }}>
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
          style={{ background: `${cat.color}22` }}>
          {ingredient.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.85)', color: cat.color }}>
              {cat.icon} {cat.label}
            </span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-xl"
              style={{ background: safety.bg, color: safety.color }}>
              {safety.text}
            </span>
            {origin && (
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-xl"
                style={{ background: origin.bg, color: origin.color }}>
                {origin.icon} {origin.label}
              </span>
            )}
          </div>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h2 className="font-extrabold text-base leading-tight" style={{ color: '#2d2d4e' }}>{ingredient.name}</h2>
              <p className="text-xs mt-0.5 truncate" style={{ color: '#9999bb' }}>{ingredient.nameEn}</p>
            </div>
            {onFavoriteToggle && (
              <button
                onClick={() => onFavoriteToggle(ingredient)}
                className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-90"
                style={isFavorite
                  ? { background: 'rgba(251,113,133,0.15)', color: '#fb7185' }
                  : { background: 'rgba(220,220,240,0.4)', color: '#c0c0d8' }}>
                <span className="text-lg leading-none">{isFavorite ? '♥' : '♡'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3.5">
        <InfoRow label="기능" value={ingredient.function} />
        <InfoRow label="추출원" value={ingredient.extraction} />

        <div>
          <SectionLabel>해결 피부 고민</SectionLabel>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {ingredient.painPoints.map((p) => (
              <span key={p} className="text-xs px-2.5 py-1 rounded-xl font-semibold"
                style={{ background: cat.bg || 'rgba(240,240,255,0.5)', color: cat.color || '#6B7280', border: '1px solid rgba(255,255,255,0.8)' }}>
                {p}
              </span>
            ))}
          </div>
        </div>

        {ingredient.tags?.length > 0 && (
          <div>
            <SectionLabel>키워드</SectionLabel>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {ingredient.tags.map((t) => (
                <span key={t} className="text-xs px-2.5 py-1 rounded-xl font-medium"
                  style={{ background: 'rgba(220,220,240,0.4)', color: '#9999bb', border: '1px solid rgba(255,255,255,0.8)' }}>
                  #{t}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-2xl p-3"
            style={{ background: cat.bg || '#ede8f8', border: '1.5px solid rgba(255,255,255,0.85)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9)' }}>
            <p className="text-xs mb-1" style={{ color: '#9999bb' }}>권장 농도</p>
            <p className="font-bold text-sm" style={{ color: '#2d2d4e' }}>{ingredient.concentration}</p>
          </div>
          <div className="rounded-2xl p-3" style={{ background: safety.bg, border: '1px solid rgba(255,255,255,0.8)' }}>
            <p className="text-xs mb-1.5" style={{ color: safety.color, opacity: 0.8 }}>안전도</p>
            <div className="flex gap-0.5 mb-1">
              {[1,2,3,4,5].map((i) => (
                <div key={i} className="flex-1 h-1.5 rounded-full"
                  style={{ background: i <= ingredient.safety ? safety.dot : 'rgba(200,200,220,0.4)' }} />
              ))}
            </div>
            <p className="font-bold text-xs" style={{ color: safety.color }}>{safety.text}</p>
          </div>
        </div>

        {ingredient.tip && (
          <div className="rounded-2xl p-3.5"
            style={{ background: 'rgba(255,251,235,0.7)', border: '1px solid rgba(253,230,138,0.5)' }}>
            <p className="text-xs text-amber-700 leading-relaxed">
              <span className="font-bold">💡 </span>{ingredient.tip}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function IngredientCard({ ingredient, onClick, inLab, onLabToggle, modal, isFavorite, onFavoriteToggle }) {
  const cat = CATEGORIES[ingredient.category] || {};
  const safety = safetyInfo(ingredient.safety);
  const origin = getOrigin(ingredient);

  if (modal) return <ModalView ingredient={ingredient} isFavorite={isFavorite} onFavoriteToggle={onFavoriteToggle} />;

  return (
    <div
      onClick={() => onClick?.(ingredient)}
      className="cursor-pointer transition-all active:scale-[0.95] rounded-2xl overflow-hidden flex flex-col relative"
      style={{
        background: cat.bg || '#ede8f8',
        border: '1.5px solid rgba(255,255,255,0.85)',
        boxShadow: `0 4px 20px ${cat.color}18, inset 0 1px 0 rgba(255,255,255,0.9)`,
        minHeight: 138,
      }}
    >
      <div className="absolute top-2.5 right-2.5 z-10">
        <div className="w-2 h-2 rounded-full" style={{ background: safety.dot }} />
      </div>

      <div className="flex items-center justify-center pt-4 pb-2.5 flex-shrink-0"
        style={{ background: `${cat.color}20` }}>
        <span className="text-3xl leading-none select-none">{ingredient.emoji}</span>
      </div>

      <div className="flex-1 px-2.5 pt-2 pb-1">
        <p className="font-bold text-xs leading-tight line-clamp-2 mb-0.5" style={{ color: '#2d2d4e' }}>
          {ingredient.name}
        </p>
        <p className="text-[11px] truncate mb-1" style={{ color: '#9999bb' }}>{ingredient.nameEn}</p>
        <div className="flex items-center gap-1 flex-wrap">
          <span className="inline-block text-[11px] font-bold px-1.5 py-0.5 rounded-lg"
            style={{ background: 'rgba(255,255,255,0.75)', color: cat.color, border: `1px solid ${cat.color}25` }}>
            {cat.icon} {cat.label}
          </span>
          {origin && (
            <span className="inline-block text-[10px] font-bold px-1.5 py-0.5 rounded-lg"
              style={{ background: origin.bg, color: origin.color }}>
              {origin.icon}
            </span>
          )}
        </div>
      </div>

      <div className="px-2.5 pb-2.5 flex justify-end">
        <button
          onClick={(e) => { e.stopPropagation(); onLabToggle?.(ingredient); }}
          className="w-7 h-7 rounded-xl flex items-center justify-center transition-all active:scale-90 flex-shrink-0"
          style={inLab
            ? { background: 'linear-gradient(135deg,#7B9EFF,#C084FC)', color: 'white', boxShadow: '0 2px 8px rgba(123,158,255,0.35)' }
            : { background: 'rgba(255,255,255,0.65)', color: '#9999bb', border: '1px solid rgba(255,255,255,0.85)' }}>
          <span className="text-xs font-bold leading-none">{inLab ? '✓' : '+'}</span>
        </button>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div>
      <SectionLabel>{label}</SectionLabel>
      <p className="text-sm leading-relaxed mt-1" style={{ color: '#4d4d70' }}>{value}</p>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <p className="text-[10px] font-extrabold uppercase tracking-widest" style={{ color: '#9999bb' }}>{children}</p>
  );
}
