import { CATEGORIES } from '../data/ingredients';
import { getOrigin } from '../utils/origin';

const safetyInfo = (n) => {
  if (n >= 5) return { text: '안전', dot: '#16a34a', bg: '#F0FDF4', color: '#15803D' };
  if (n >= 4) return { text: '양호', dot: '#2563EB', bg: '#E6F1EC', color: '#1E4D38' };
  if (n >= 3) return { text: '주의', dot: '#D97706', bg: '#FFFBEB', color: '#B45309' };
  return       { text: '경고', dot: '#DC2626', bg: '#FEF2F2', color: '#B91C1C' };
};

const CARD = {
  background: '#FFFFFF',
  border: '1px solid #EBEBEB',
  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
};

function ModalView({ ingredient, isFavorite, onFavoriteToggle }) {
  const cat = CATEGORIES[ingredient.category] || {};
  const safety = safetyInfo(ingredient.safety);
  const origin = getOrigin(ingredient);

  return (
    <div>
      {/* Hero */}
      <div className="flex flex-col items-center pt-8 pb-7 px-6 relative"
        style={{ background: '#F8F8F8' }}>
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-3xl flex items-center justify-center"
            style={{ background: '#FFFFFF', boxShadow: '0 4px 24px rgba(0,0,0,0.09)', fontSize: 48 }}>
            {ingredient.emoji}
          </div>
          {onFavoriteToggle && (
            <button onClick={() => onFavoriteToggle(ingredient)}
              className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center"
              style={isFavorite
                ? { background: '#FFF1F2', color: '#E11D48', boxShadow: '0 0 0 2px #FFFFFF' }
                : { background: '#E6EEE9', color: '#CCCCCC', boxShadow: '0 0 0 2px #FFFFFF' }}>
              <span style={{ fontSize: 14 }}>{isFavorite ? '♥' : '♡'}</span>
            </button>
          )}
        </div>

        <h2 style={{ fontWeight: 800, fontSize: 20, color: '#16201C', textAlign: 'center', lineHeight: 1.3, marginBottom: 4 }}>
          {ingredient.name}
        </h2>
        <p style={{ fontSize: 13, color: '#999999', textAlign: 'center', marginBottom: 16 }}>{ingredient.nameEn}</p>

        <div className="flex items-center gap-2 flex-wrap justify-center">
          <span style={{ fontSize: 12, fontWeight: 700, padding: '6px 14px', borderRadius: 99, background: '#EBEBEB', color: '#555555' }}>
            {cat.icon} {cat.label}
          </span>
          <span style={{ fontSize: 12, fontWeight: 700, padding: '6px 14px', borderRadius: 99, background: safety.bg, color: safety.color }}>
            {safety.text}
          </span>
          {origin && (
            <span style={{ fontSize: 12, fontWeight: 700, padding: '6px 14px', borderRadius: 99, background: origin.bg, color: origin.color }}>
              {origin.icon} {origin.label}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '24px 24px 8px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <Section label="기능">
          <p style={{ fontSize: 14, lineHeight: 1.7, color: '#333333' }}>{ingredient.function}</p>
        </Section>

        {ingredient.extraction && (
          <Section label="추출원">
            <p style={{ fontSize: 14, lineHeight: 1.7, color: '#333333' }}>{ingredient.extraction}</p>
          </Section>
        )}

        <Section label="해결 피부 고민">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
            {ingredient.painPoints.map((p) => (
              <span key={p} style={{ fontSize: 12, fontWeight: 600, padding: '6px 14px', borderRadius: 99, background: '#F2F2F2', color: '#445048' }}>
                {p}
              </span>
            ))}
          </div>
        </Section>

        {ingredient.tags?.length > 0 && (
          <Section label="키워드">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
              {ingredient.tags.map((t) => (
                <span key={t} style={{ fontSize: 12, padding: '5px 12px', borderRadius: 99, background: '#EFF3F1', color: '#5F6B65', border: '1px solid #EBEBEB' }}>
                  #{t}
                </span>
              ))}
            </div>
          </Section>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{ borderRadius: 16, padding: '16px 16px', background: '#F8F8F8' }}>
            <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8B968F', marginBottom: 10 }}>권장 농도</p>
            <p style={{ fontWeight: 800, fontSize: 15, color: '#16201C' }}>{ingredient.concentration}</p>
          </div>
          <div style={{ borderRadius: 16, padding: '16px 16px', background: safety.bg }}>
            <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: safety.color, marginBottom: 10 }}>안전도</p>
            <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
              {[1,2,3,4,5].map((i) => (
                <div key={i} style={{ flex: 1, height: 8, borderRadius: 99, background: i <= ingredient.safety ? safety.dot : 'rgba(0,0,0,0.08)' }} />
              ))}
            </div>
            <p style={{ fontWeight: 800, fontSize: 14, color: safety.color }}>{safety.text}</p>
          </div>
        </div>

        {ingredient.tip && (
          <div style={{ borderRadius: 16, padding: '16px 18px', background: '#FFFBEB', border: '1px solid #FDE68A' }}>
            <p style={{ fontSize: 13, color: '#92400E', lineHeight: 1.7 }}>
              <span style={{ fontWeight: 800 }}>💡 </span>{ingredient.tip}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ label, children }) {
  return (
    <div>
      <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8B968F', marginBottom: 10 }}>{label}</p>
      {children}
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
      className="cursor-pointer rounded-xl overflow-hidden flex flex-col relative"
      style={{ ...CARD, minHeight: 148 }}
    >
      <div className="absolute top-2 right-2 z-10">
        <div className="w-2 h-2 rounded-full" style={{ background: safety.dot }} />
      </div>

      <div className="flex items-center justify-center pt-5 pb-3 flex-shrink-0"
        style={{ background: '#F6F6F6' }}>
        <span style={{ fontSize: 36, lineHeight: 1 }}>{ingredient.emoji}</span>
      </div>

      <div className="flex-1 px-3 pt-2.5 pb-1">
        <p style={{ fontWeight: 700, fontSize: 12, lineHeight: 1.35, marginBottom: 2, color: '#16201C' }}
          className="line-clamp-2">
          {ingredient.name}
        </p>
        <p style={{ fontSize: 11, color: '#8B968F', marginBottom: 6 }} className="truncate">{ingredient.nameEn}</p>
        <div className="flex items-center gap-1 flex-wrap">
          <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 7px', borderRadius: 99, background: '#F2F2F2', color: '#555555' }}>
            {cat.icon} {cat.label}
          </span>
          {origin && (
            <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 99, background: origin.bg, color: origin.color }}>
              {origin.icon}
            </span>
          )}
        </div>
      </div>

      <div className="px-3 pb-3 flex justify-end">
        <button
          onClick={(e) => { e.stopPropagation(); onLabToggle?.(ingredient); }}
          style={inLab
            ? { width: 26, height: 26, borderRadius: 8, background: '#1B6E63', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }
            : { width: 26, height: 26, borderRadius: 8, background: '#F2F2F2', color: '#999999', border: '1px solid #DCE3DE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
          {inLab ? '✓' : '+'}
        </button>
      </div>
    </div>
  );
}
