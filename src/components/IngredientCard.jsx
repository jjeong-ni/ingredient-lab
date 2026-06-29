import { CATEGORIES } from '../data/ingredients';
import { getOrigin } from '../utils/origin';

const safetyInfo = (n) => {
  if (n >= 5) return { text: '안전', dot: '#16a34a', bg: '#F0FDF4', color: '#15803D' };
  if (n >= 4) return { text: '양호', dot: '#2563EB', bg: '#EFF6FF', color: '#1D4ED8' };
  if (n >= 3) return { text: '주의', dot: '#D97706', bg: '#FFFBEB', color: '#B45309' };
  return       { text: '경고', dot: '#DC2626', bg: '#FEF2F2', color: '#B91C1C' };
};

const CARD = {
  background: '#FFFFFF',
  border: '1px solid #E5E5E5',
  boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
};

function ModalView({ ingredient, isFavorite, onFavoriteToggle }) {
  const cat = CATEGORIES[ingredient.category] || {};
  const safety = safetyInfo(ingredient.safety);
  const origin = getOrigin(ingredient);

  return (
    <div className="px-4 pb-2">
      <div className="rounded-lg p-4 mb-4 flex items-start gap-3" style={CARD}>
        <div className="w-14 h-14 rounded-lg flex items-center justify-center text-3xl flex-shrink-0"
          style={{ background: '#F4F4F5' }}>
          {ingredient.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
            <span className="text-xs font-semibold px-2 py-0.5 rounded"
              style={{ background: '#F4F4F5', color: '#444444' }}>
              {cat.icon} {cat.label}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded"
              style={{ background: safety.bg, color: safety.color }}>
              {safety.text}
            </span>
            {origin && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded"
                style={{ background: origin.bg, color: origin.color }}>
                {origin.icon} {origin.label}
              </span>
            )}
          </div>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-base leading-tight" style={{ color: '#171717' }}>{ingredient.name}</h2>
              <p className="text-xs mt-0.5 truncate" style={{ color: '#888888' }}>{ingredient.nameEn}</p>
            </div>
            {onFavoriteToggle && (
              <button
                onClick={() => onFavoriteToggle(ingredient)}
                className="flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center"
                style={isFavorite
                  ? { background: '#FFF1F2', color: '#E11D48' }
                  : { background: '#F4F4F5', color: '#888888' }}>
                <span className="text-base leading-none">{isFavorite ? '♥' : '♡'}</span>
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
              <span key={p} className="text-xs px-2 py-1 rounded font-medium"
                style={{ background: '#F4F4F5', color: '#444444', border: '1px solid #E5E5E5' }}>
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
                <span key={t} className="text-xs px-2 py-1 rounded"
                  style={{ background: '#F4F4F5', color: '#888888' }}>
                  #{t}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-md p-3" style={CARD}>
            <p className="text-xs mb-1" style={{ color: '#888888' }}>권장 농도</p>
            <p className="font-bold text-sm" style={{ color: '#171717' }}>{ingredient.concentration}</p>
          </div>
          <div className="rounded-md p-3" style={{ background: safety.bg, border: '1px solid #E5E5E5' }}>
            <p className="text-xs mb-1.5" style={{ color: safety.color }}>안전도</p>
            <div className="flex gap-0.5 mb-1">
              {[1,2,3,4,5].map((i) => (
                <div key={i} className="flex-1 h-1.5 rounded-full"
                  style={{ background: i <= ingredient.safety ? safety.dot : '#E5E5E5' }} />
              ))}
            </div>
            <p className="font-bold text-xs" style={{ color: safety.color }}>{safety.text}</p>
          </div>
        </div>

        {ingredient.tip && (
          <div className="rounded-md p-3.5" style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
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
      className="cursor-pointer rounded-lg overflow-hidden flex flex-col relative"
      style={{ ...CARD, minHeight: 138 }}
    >
      <div className="absolute top-2 right-2 z-10">
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: safety.dot }} />
      </div>

      <div className="flex items-center justify-center pt-4 pb-2.5 flex-shrink-0"
        style={{ background: '#F4F4F5' }}>
        <span className="text-3xl leading-none select-none">{ingredient.emoji}</span>
      </div>

      <div className="flex-1 px-2.5 pt-2 pb-1">
        <p className="font-semibold text-xs leading-tight line-clamp-2 mb-0.5" style={{ color: '#171717' }}>
          {ingredient.name}
        </p>
        <p className="text-[11px] truncate mb-1" style={{ color: '#888888' }}>{ingredient.nameEn}</p>
        <div className="flex items-center gap-1 flex-wrap">
          <span className="inline-block text-[11px] font-medium px-1.5 py-0.5 rounded"
            style={{ background: '#F4F4F5', color: '#444444' }}>
            {cat.icon} {cat.label}
          </span>
          {origin && (
            <span className="inline-block text-[10px] font-medium px-1.5 py-0.5 rounded"
              style={{ background: origin.bg, color: origin.color }}>
              {origin.icon}
            </span>
          )}
        </div>
      </div>

      <div className="px-2.5 pb-2.5 flex justify-end">
        <button
          onClick={(e) => { e.stopPropagation(); onLabToggle?.(ingredient); }}
          className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
          style={inLab
            ? { background: '#0072F5', color: 'white' }
            : { background: '#F4F4F5', color: '#888888', border: '1px solid #E5E5E5' }}>
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
      <p className="text-sm leading-relaxed mt-1" style={{ color: '#444444' }}>{value}</p>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#888888' }}>{children}</p>
  );
}
