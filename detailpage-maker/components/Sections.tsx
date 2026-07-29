import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, StyleSheet, Text, View } from 'react-native';
import { colors, TONE_THEME } from '@/constants/theme';
import type { SectionKey } from '@/lib/store';
import type { CopyResult, ProductInput } from '@/lib/types';

interface SectionProps {
  input: ProductInput;
  copy: CopyResult;
}

function theme(input: ProductInput) {
  return TONE_THEME[input.tone];
}

/* ----------------------------- Hero ----------------------------- */
function HeroSection({ input, copy }: SectionProps) {
  const t = theme(input);
  return (
    <LinearGradient colors={t.gradient} style={styles.hero}>
      <View style={[styles.badge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
        <Text style={styles.badgeText}>{copy.hero.badge}</Text>
      </View>
      <Text style={[styles.heroHeadline, { color: t.heroText }]}>{copy.hero.headline}</Text>
      <Text style={[styles.heroSub, { color: t.heroSub }]}>{copy.hero.subheadline}</Text>
      {input.images[0] ? (
        <Image source={{ uri: input.images[0] }} style={styles.heroImage} resizeMode="cover" />
      ) : (
        <View style={[styles.heroImage, styles.imagePlaceholder]}>
          <Ionicons name="image-outline" size={40} color="rgba(255,255,255,0.7)" />
          <Text style={styles.placeholderText}>대표 이미지</Text>
        </View>
      )}
    </LinearGradient>
  );
}

/* -------------------------- Selling points -------------------------- */
function SellingSection({ input, copy }: SectionProps) {
  const t = theme(input);
  return (
    <View style={styles.card}>
      <Text style={styles.eyebrow}>WHY THIS</Text>
      <Text style={styles.cardTitle}>이런 점이 특별해요</Text>
      {copy.sellingPoints.map((sp, i) => (
        <View key={i} style={styles.pointRow}>
          <View style={[styles.pointIcon, { backgroundColor: t.accent + '18' }]}>
            <Ionicons name={sp.icon as any} size={22} color={t.accent} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.pointTitle}>{sp.title}</Text>
            <Text style={styles.pointDesc}>{sp.desc}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

/* ----------------------------- Detail ----------------------------- */
function DetailSection({ input, copy }: SectionProps) {
  const extra = input.images.slice(1);
  return (
    <View style={styles.card}>
      <Text style={styles.eyebrow}>DETAIL</Text>
      <Text style={styles.cardTitle}>{copy.detail.heading}</Text>
      <Text style={styles.detailBody}>{copy.detail.body}</Text>
      {extra.map((uri, i) => (
        <Image key={i} source={{ uri }} style={styles.detailImage} resizeMode="cover" />
      ))}
    </View>
  );
}

/* ------------------------------ Spec ------------------------------ */
function SpecSection({ input, copy }: SectionProps) {
  const t = theme(input);
  return (
    <View style={styles.card}>
      <Text style={styles.eyebrow}>INFO</Text>
      <Text style={styles.cardTitle}>상품 정보</Text>
      <View style={styles.specTable}>
        {copy.specs.map((row, i) => (
          <View
            key={i}
            style={[styles.specRow, i === copy.specs.length - 1 && { borderBottomWidth: 0 }]}
          >
            <Text style={[styles.specLabel, { color: t.accent }]}>{row.label}</Text>
            <Text style={styles.specValue}>{row.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

/* ----------------------------- Review ----------------------------- */
function Stars({ rating, color }: { rating: number; color: string }) {
  return (
    <View style={{ flexDirection: 'row' }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Ionicons
          key={n}
          name={n <= rating ? 'star' : 'star-outline'}
          size={14}
          color={color}
          style={{ marginRight: 1 }}
        />
      ))}
    </View>
  );
}

function ReviewSection({ input, copy }: SectionProps) {
  return (
    <View style={[styles.card, { backgroundColor: '#FAFAFB' }]}>
      <Text style={styles.eyebrow}>REVIEW</Text>
      <Text style={styles.cardTitle}>고객들의 생생 후기</Text>
      {copy.reviews.map((r, i) => (
        <View key={i} style={styles.reviewCard}>
          <View style={styles.reviewHead}>
            <Text style={styles.reviewAuthor}>{r.author}</Text>
            <Stars rating={r.rating} color={colors.star} />
          </View>
          <Text style={styles.reviewText}>{r.text}</Text>
        </View>
      ))}
    </View>
  );
}

/* ------------------------------ CTA ------------------------------ */
function CtaSection({ input, copy }: SectionProps) {
  const t = theme(input);
  return (
    <LinearGradient colors={t.gradient} style={styles.cta}>
      <Text style={[styles.ctaHeadline, { color: t.heroText }]}>{copy.cta.headline}</Text>
      <Text style={[styles.ctaSub, { color: t.heroSub }]}>{copy.cta.subtext}</Text>
      {typeof input.price === 'number' && input.price > 0 ? (
        <Text style={[styles.ctaPrice, { color: t.heroText }]}>
          {input.price.toLocaleString('ko-KR')}원
        </Text>
      ) : null}
      <View style={styles.ctaButton}>
        <Text style={[styles.ctaButtonText, { color: t.accent }]}>{copy.cta.buttonText}</Text>
      </View>
    </LinearGradient>
  );
}

/* --------------------------- Renderer --------------------------- */
export function SectionRenderer({
  section,
  input,
  copy,
}: {
  section: SectionKey;
  input: ProductInput;
  copy: CopyResult;
}) {
  switch (section) {
    case 'hero':
      return <HeroSection input={input} copy={copy} />;
    case 'selling':
      return <SellingSection input={input} copy={copy} />;
    case 'detail':
      return <DetailSection input={input} copy={copy} />;
    case 'spec':
      return <SpecSection input={input} copy={copy} />;
    case 'review':
      return <ReviewSection input={input} copy={copy} />;
    case 'cta':
      return <CtaSection input={input} copy={copy} />;
  }
}

const styles = StyleSheet.create({
  hero: { padding: 28, alignItems: 'center' },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 16,
  },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '700', letterSpacing: 0.3 },
  heroHeadline: {
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 34,
  },
  heroSub: { fontSize: 15, textAlign: 'center', marginTop: 12, lineHeight: 22 },
  heroImage: {
    width: '100%',
    height: 260,
    borderRadius: 18,
    marginTop: 24,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  imagePlaceholder: { alignItems: 'center', justifyContent: 'center' },
  placeholderText: { color: 'rgba(255,255,255,0.75)', marginTop: 8, fontSize: 13 },
  card: { backgroundColor: '#fff', padding: 24 },
  eyebrow: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  cardTitle: { fontSize: 21, fontWeight: '800', color: colors.text, marginBottom: 18 },
  pointRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 18 },
  pointIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  pointTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 3 },
  pointDesc: { fontSize: 14, color: colors.sub, lineHeight: 20 },
  detailBody: { fontSize: 15, color: colors.text, lineHeight: 25 },
  detailImage: { width: '100%', height: 220, borderRadius: 14, marginTop: 16 },
  specTable: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    overflow: 'hidden',
  },
  specRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  specLabel: {
    width: 120,
    paddingVertical: 13,
    paddingHorizontal: 14,
    fontSize: 13,
    fontWeight: '700',
    backgroundColor: '#FAFAFB',
  },
  specValue: {
    flex: 1,
    paddingVertical: 13,
    paddingHorizontal: 14,
    fontSize: 14,
    color: colors.text,
  },
  reviewCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.line,
  },
  reviewHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewAuthor: { fontSize: 14, fontWeight: '700', color: colors.text },
  reviewText: { fontSize: 14, color: colors.sub, lineHeight: 21 },
  cta: { padding: 32, alignItems: 'center' },
  ctaHeadline: { fontSize: 22, fontWeight: '800', textAlign: 'center', lineHeight: 30 },
  ctaSub: { fontSize: 14, textAlign: 'center', marginTop: 10, lineHeight: 20 },
  ctaPrice: { fontSize: 28, fontWeight: '900', marginTop: 18 },
  ctaButton: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 14,
    marginTop: 20,
  },
  ctaButtonText: { fontSize: 16, fontWeight: '800' },
});
