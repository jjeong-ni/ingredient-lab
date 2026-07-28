import type { RefObject } from 'react';
import { Platform } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';

export interface CaptureTarget {
  key: string;
  label: string;
  ref: RefObject<any>;
}

export interface ExportResult {
  saved: number;
  total: number;
  message: string;
}

async function captureOne(target: CaptureTarget): Promise<string | null> {
  if (!target.ref.current) return null;
  try {
    return await captureRef(target.ref, {
      format: 'png',
      quality: 1,
      result: Platform.OS === 'web' ? 'data-uri' : 'tmpfile',
    });
  } catch (e) {
    console.warn(`capture failed: ${target.key}`, e);
    return null;
  }
}

function webDownload(dataUri: string, filename: string) {
  const a = document.createElement('a');
  a.href = dataUri;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * 활성화된 섹션들을 각각 이미지로 캡처해서 내보낸다.
 * - 웹: 파일 다운로드
 * - iOS/Android: 카메라 롤(사진 앱)에 저장
 */
export async function exportSections(
  targets: CaptureTarget[],
  slug: string,
): Promise<ExportResult> {
  const total = targets.length;
  if (total === 0) {
    return { saved: 0, total: 0, message: '내보낼 섹션이 없어요.' };
  }

  // 네이티브: 사진 저장 권한 요청
  if (Platform.OS !== 'web') {
    const perm = await MediaLibrary.requestPermissionsAsync();
    if (!perm.granted) {
      return { saved: 0, total, message: '사진 저장 권한이 필요해요.' };
    }
  }

  let saved = 0;
  for (let i = 0; i < targets.length; i++) {
    const uri = await captureOne(targets[i]);
    if (!uri) continue;
    const filename = `${slug}-${String(i + 1).padStart(2, '0')}-${targets[i].key}.png`;
    if (Platform.OS === 'web') {
      webDownload(uri, filename);
      saved++;
    } else {
      try {
        await MediaLibrary.saveToLibraryAsync(uri);
        saved++;
      } catch (e) {
        console.warn('save failed', e);
      }
    }
  }

  const message =
    Platform.OS === 'web'
      ? `${saved}장을 다운로드했어요.`
      : `${saved}장을 사진 앱에 저장했어요.`;
  return { saved, total, message };
}

/** 단일 섹션 공유 (네이티브 전용). 웹에서는 다운로드로 대체. */
export async function shareSection(target: CaptureTarget, slug: string): Promise<void> {
  const uri = await captureOne(target);
  if (!uri) return;
  if (Platform.OS === 'web') {
    webDownload(uri, `${slug}-${target.key}.png`);
    return;
  }
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri);
  }
}
