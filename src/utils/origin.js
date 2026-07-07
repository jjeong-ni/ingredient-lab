export const ANIMAL_KW = ['동물', '닭', '돼지', '양모', '어류', '오리', '계란', '우유', '콜라겐', '케라틴', '라놀린', '벌레', '꿀벌', '누에', '젤라틴'];

export const VEGAN_AUTO_CATEGORIES = new Set([
  'plantextract', 'fermented', 'mineral', 'sunscreen',
  'moisturizing', 'emollient', 'soothing', 'brightening',
  'antioxidant', 'antiaging', 'exfoliant', 'surfactant',
  'thickener', 'filmformer', 'haircare',
  'phadjuster', 'chelating', 'fragrance',
]);

export function getOrigin(ingredient) {
  if (ingredient.tags?.includes('비건')) return { label: '비건', icon: '🌱', color: '#16a34a', bg: '#f0fdf4' };
  if (ANIMAL_KW.some((k) => (ingredient.extraction || '').includes(k)))
    return { label: '동물유래', icon: '🐾', color: '#f97316', bg: '#fff7ed' };
  if (VEGAN_AUTO_CATEGORIES.has(ingredient.category))
    return { label: '비건', icon: '🌱', color: '#16a34a', bg: '#f0fdf4' };
  return null;
}
