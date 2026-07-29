# 상세페이지 메이커 (detailpage-maker)

상품 정보를 입력하면 **카피 + 레이아웃**이 완성된 쇼핑몰 상세페이지를
자동으로 만들어 주고, **섹션별 이미지로 내보내기** 할 수 있는 Expo 앱입니다.

> higgsfield의 `detailpage-maker` 컨셉을 앱으로 옮긴 프로토타입.
> 현재는 별도 API 키 없이 동작하는 **룰 기반 카피 엔진**을 사용하며,
> 환경변수만 넣으면 실제 AI 생성으로 교체됩니다.

## 배포 (Live)

- **웹 데모:** https://detailpage-maker.vercel.app
- Vercel(Expo Web export) 배포. `master` push 시 자동 재배포.

## 기능

- 상품명 · 브랜드 · 카테고리 · 핵심 특징 · 톤앤매너 · 타겟 · 가격 · 사진 입력
- 6개 섹션 자동 생성: **Hero / 셀링포인트 / 상세설명 / 상품정보표 / 후기 / CTA**
- 톤앤매너 4종(신뢰·친근·럭셔리·발랄)에 따라 문구와 색감이 달라짐
- 섹션 on/off, "다시 생성"으로 다른 카피 조합 뽑기
- **이미지로 내보내기**
  - iOS/Android: 사진 앱(카메라 롤)에 섹션별 PNG 저장
  - Web: 섹션별 PNG 다운로드

## 실행

```bash
cd detailpage-maker
npm install
npx expo start        # 그다음 i(iOS) / a(Android) / w(Web)
```

## 폴더 구조

```
app/
  _layout.tsx      Stack 네비게이션
  index.tsx        입력 화면
  preview.tsx      미리보기 + 이미지 내보내기
components/
  Sections.tsx     6개 섹션 렌더러 (Hero/셀링/상세/스펙/후기/CTA)
  ui.tsx           버튼·칩·인풋 등 공용 UI
constants/
  theme.ts         색상, 카테고리/톤 메타, 톤별 시각 테마
lib/
  types.ts         데이터 모델 + CopyGenerator 인터페이스
  phraseBanks.ts   카테고리·톤별 한국어 문구 뱅크
  copyEngine.ts    룰 기반 생성기 + AI 생성기(선택) + 팩토리
  store.ts         zustand 전역 상태
  capture.ts       섹션 → 이미지 캡처/저장/공유
```

## AI 생성으로 교체하기

카피 엔진은 인터페이스(`CopyGenerator`)로 분리돼 있어, 아래 환경변수만
설정하면 룰 기반 → 실제 AI(OpenAI 호환)로 자동 전환됩니다.
API 호출에 실패하면 자동으로 룰 기반 결과로 폴백합니다.

`.env` 예시:

```
EXPO_PUBLIC_AI_API_KEY=sk-...        # 있으면 AI 모드 활성화
EXPO_PUBLIC_AI_BASE_URL=https://api.openai.com/v1   # 선택
EXPO_PUBLIC_AI_MODEL=gpt-4o-mini                     # 선택
```

> 주의: `EXPO_PUBLIC_` 변수는 클라이언트 번들에 포함됩니다. 실제 서비스에서는
> 키를 서버(또는 Edge Function) 뒤에 두고 프록시하는 구성을 권장합니다.

## 확장 아이디어

- 템플릿/색상 테마 추가, 섹션 순서 드래그 정렬
- 배경 제거·AI 이미지 생성(연출 컷) 연동
- 생성 결과를 하나의 긴 이미지로 합쳐 내보내기
- 스마트스토어/쿠팡 규격에 맞춘 폭·여백 프리셋
