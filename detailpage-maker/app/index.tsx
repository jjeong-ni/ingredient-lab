import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { CATEGORIES, TONES, colors } from '@/constants/theme';
import { useMaker } from '@/lib/store';
import { Button, Chip, Field, SectionLabel } from '@/components/ui';

export default function InputScreen() {
  const router = useRouter();
  const { input, setInput, generate, generating } = useMaker();
  const [featureText, setFeatureText] = useState('');

  const addFeature = () => {
    const v = featureText.trim();
    if (!v) return;
    if (input.features.includes(v)) {
      setFeatureText('');
      return;
    }
    setInput({ features: [...input.features, v] });
    setFeatureText('');
  };

  const removeFeature = (f: string) =>
    setInput({ features: input.features.filter((x) => x !== f) });

  const pickImages = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'] as any,
      allowsMultipleSelection: true,
      selectionLimit: 6,
      quality: 0.85,
    });
    if (result.canceled) return;
    const uris = result.assets.map((a) => a.uri);
    setInput({ images: [...input.images, ...uris].slice(0, 6) });
  };

  const removeImage = (uri: string) =>
    setInput({ images: input.images.filter((x) => x !== uri) });

  const canSubmit = input.productName.trim().length > 0;

  const onGenerate = async () => {
    await generate();
    router.push('/preview');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.intro}>
          상품 정보를 입력하면 카피와 레이아웃이 완성된{'\n'}상세페이지를 자동으로 만들어드려요.
        </Text>

        <SectionLabel>기본 정보</SectionLabel>
        <Field
          label="상품명 *"
          placeholder="예: 촉촉 수분 세럼 50ml"
          value={input.productName}
          onChangeText={(t) => setInput({ productName: t })}
        />
        <Field
          label="브랜드 (선택)"
          placeholder="예: 글로우랩"
          value={input.brand}
          onChangeText={(t) => setInput({ brand: t })}
        />

        <SectionLabel>카테고리</SectionLabel>
        <View style={styles.wrap}>
          {CATEGORIES.map((c) => (
            <Chip
              key={c.id}
              label={c.label}
              icon={c.icon as any}
              active={input.category === c.id}
              onPress={() => setInput({ category: c.id })}
            />
          ))}
        </View>

        <SectionLabel>핵심 특징</SectionLabel>
        <View style={styles.featureInputRow}>
          <TextInput
            style={styles.featureInput}
            placeholder="예: 72시간 보습 (입력 후 추가)"
            placeholderTextColor="#9CA3AF"
            value={featureText}
            onChangeText={setFeatureText}
            onSubmitEditing={addFeature}
            returnKeyType="done"
          />
          <Pressable style={styles.addBtn} onPress={addFeature}>
            <Ionicons name="add" size={24} color="#fff" />
          </Pressable>
        </View>
        {input.features.length > 0 && (
          <View style={[styles.wrap, { marginTop: 4 }]}>
            {input.features.map((f) => (
              <Pressable key={f} style={styles.featureTag} onPress={() => removeFeature(f)}>
                <Text style={styles.featureTagText}>{f}</Text>
                <Ionicons name="close" size={15} color={colors.primary} />
              </Pressable>
            ))}
          </View>
        )}
        <Text style={styles.featureHint}>
          특징이 2개 이하면 카테고리에 맞는 기본 문구로 자동 보완돼요.
        </Text>

        <SectionLabel>톤앤매너</SectionLabel>
        <View style={styles.wrap}>
          {TONES.map((t) => (
            <Chip
              key={t.id}
              label={t.label}
              active={input.tone === t.id}
              onPress={() => setInput({ tone: t.id })}
            />
          ))}
        </View>
        <Text style={styles.featureHint}>
          {TONES.find((t) => t.id === input.tone)?.desc}
        </Text>

        <SectionLabel>추가 정보 (선택)</SectionLabel>
        <Field
          label="타겟 고객"
          placeholder="예: 건성 피부 20~30대"
          value={input.target}
          onChangeText={(t) => setInput({ target: t })}
        />
        <Field
          label="가격 (원)"
          placeholder="예: 29000"
          keyboardType="number-pad"
          value={input.price ? String(input.price) : ''}
          onChangeText={(t) => {
            const n = parseInt(t.replace(/[^0-9]/g, ''), 10);
            setInput({ price: isNaN(n) ? undefined : n });
          }}
        />

        <SectionLabel>상품 사진 (선택, 최대 6장)</SectionLabel>
        <View style={styles.wrap}>
          {input.images.map((uri) => (
            <Pressable key={uri} onPress={() => removeImage(uri)} style={styles.thumbWrap}>
              <Image source={{ uri }} style={styles.thumb} />
              <View style={styles.thumbRemove}>
                <Ionicons name="close" size={14} color="#fff" />
              </View>
            </Pressable>
          ))}
          {input.images.length < 6 && (
            <Pressable style={styles.addImage} onPress={pickImages}>
              <Ionicons name="camera-outline" size={26} color={colors.sub} />
              <Text style={styles.addImageText}>추가</Text>
            </Pressable>
          )}
        </View>
        <Text style={styles.featureHint}>
          첫 번째 사진이 메인 이미지로 사용돼요. 없어도 생성은 가능해요.
        </Text>

        <View style={{ height: 24 }} />
        <Button
          title="상세페이지 생성하기"
          icon="sparkles"
          onPress={onGenerate}
          loading={generating}
          disabled={!canSubmit}
        />
        {!canSubmit && (
          <Text style={styles.warnText}>상품명을 입력하면 생성할 수 있어요.</Text>
        )}
        <View style={{ height: Platform.OS === 'web' ? 40 : 12 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, maxWidth: 560, width: '100%', alignSelf: 'center' },
  intro: { fontSize: 14, color: colors.sub, lineHeight: 21, marginBottom: 20 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap' },
  featureInputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  featureInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    color: colors.text,
    marginRight: 8,
  },
  addBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: 999,
    paddingLeft: 14,
    paddingRight: 10,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  featureTagText: { color: colors.primary, fontWeight: '700', fontSize: 14, marginRight: 4 },
  featureHint: { fontSize: 12, color: colors.sub, marginTop: 4, marginBottom: 8, lineHeight: 18 },
  thumbWrap: { marginRight: 10, marginBottom: 10 },
  thumb: { width: 72, height: 72, borderRadius: 12, backgroundColor: '#eee' },
  thumbRemove: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: colors.danger,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addImage: {
    width: 72,
    height: 72,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.line,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  addImageText: { fontSize: 12, color: colors.sub, marginTop: 2 },
  warnText: { fontSize: 13, color: colors.danger, textAlign: 'center', marginTop: 10 },
});
