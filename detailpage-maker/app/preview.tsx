import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useRef, useState, type RefObject } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors } from '@/constants/theme';
import { SectionRenderer } from '@/components/Sections';
import { Button } from '@/components/ui';
import { exportSections, type CaptureTarget } from '@/lib/capture';
import {
  SECTION_LABEL,
  SECTION_ORDER,
  useMaker,
  type SectionKey,
} from '@/lib/store';

function slugify(name: string): string {
  const base = name.trim().toLowerCase().replace(/[^a-z0-9가-힣]+/g, '-').replace(/^-+|-+$/g, '');
  return base || 'detailpage';
}

export default function PreviewScreen() {
  const router = useRouter();
  const { input, copy, enabled, toggleSection, regenerate, generating } = useMaker();
  const [exporting, setExporting] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  // 섹션별 캡처 ref (고정 순서로 생성 — 조건부 호출 아님)
  const refs: Record<SectionKey, RefObject<View | null>> = {
    hero: useRef<View | null>(null),
    selling: useRef<View | null>(null),
    detail: useRef<View | null>(null),
    spec: useRef<View | null>(null),
    review: useRef<View | null>(null),
    cta: useRef<View | null>(null),
  };

  const activeSections = useMemo(
    () => SECTION_ORDER.filter((k) => enabled[k]),
    [enabled],
  );

  if (!copy) {
    return (
      <View style={styles.empty}>
        <Ionicons name="document-outline" size={48} color={colors.sub} />
        <Text style={styles.emptyText}>먼저 상품 정보를 입력해 주세요.</Text>
        <View style={{ height: 16 }} />
        <Button title="입력 화면으로" icon="arrow-back" variant="outline" onPress={() => router.replace('/')} />
      </View>
    );
  }

  const onExport = async () => {
    setExporting(true);
    setStatus(null);
    const targets: CaptureTarget[] = activeSections.map((k) => ({
      key: k,
      label: SECTION_LABEL[k],
      ref: refs[k],
    }));
    try {
      const res = await exportSections(targets, slugify(input.productName));
      setStatus(res.message);
    } catch {
      setStatus('내보내기 중 문제가 발생했어요. 다시 시도해 주세요.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* 섹션 on/off 툴바 */}
      <View style={styles.toolbar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.toolbarInner}>
          {SECTION_ORDER.map((k) => (
            <Pressable
              key={k}
              onPress={() => toggleSection(k)}
              style={[styles.toggle, enabled[k] && styles.toggleOn]}
            >
              <Ionicons
                name={enabled[k] ? 'checkmark-circle' : 'ellipse-outline'}
                size={15}
                color={enabled[k] ? '#fff' : colors.sub}
                style={{ marginRight: 4 }}
              />
              <Text style={[styles.toggleText, enabled[k] && { color: '#fff' }]}>
                {SECTION_LABEL[k]}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.page}>
          {activeSections.map((k) => (
            <View
              key={k}
              ref={refs[k]}
              collapsable={false}
              style={{ backgroundColor: '#fff' }}
            >
              <SectionRenderer section={k} input={input} copy={copy} />
            </View>
          ))}
        </View>

        {status && (
          <View style={styles.statusBanner}>
            <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
            <Text style={styles.statusText}>{status}</Text>
          </View>
        )}
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* 하단 액션 바 */}
      <View style={styles.actionBar}>
        <Pressable style={styles.secondaryBtn} onPress={() => router.back()}>
          <Ionicons name="create-outline" size={20} color={colors.text} />
          <Text style={styles.secondaryText}>수정</Text>
        </Pressable>
        <Pressable style={styles.secondaryBtn} onPress={regenerate} disabled={generating}>
          <Ionicons name="refresh" size={20} color={colors.text} />
          <Text style={styles.secondaryText}>{generating ? '생성 중' : '다시 생성'}</Text>
        </Pressable>
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Button
            title={Platform.OS === 'web' ? '이미지 다운로드' : '이미지로 저장'}
            icon="download-outline"
            onPress={onExport}
            loading={exporting}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  toolbar: { backgroundColor: colors.bg, borderBottomWidth: 1, borderBottomColor: colors.line },
  toolbarInner: { paddingHorizontal: 12, paddingVertical: 10 },
  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.line,
    marginRight: 8,
  },
  toggleOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  toggleText: { fontSize: 13, color: colors.sub, fontWeight: '600' },
  scroll: { padding: 16, alignItems: 'center' },
  page: {
    width: '100%',
    maxWidth: 480,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#fff',
    ...Platform.select({
      web: { boxShadow: '0 8px 30px rgba(0,0,0,0.08)' } as any,
      default: {
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 8 },
        elevation: 3,
      },
    }),
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: 12,
    padding: 14,
    marginTop: 16,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  statusText: { color: colors.primary, fontWeight: '700', marginLeft: 8, flex: 1 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg, padding: 24 },
  emptyText: { fontSize: 15, color: colors.sub, marginTop: 12 },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  secondaryBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  secondaryText: { fontSize: 11, color: colors.text, marginTop: 2, fontWeight: '600' },
});
