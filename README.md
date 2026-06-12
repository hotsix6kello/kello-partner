# Partner Wekello

Partner Wekello는 파트너 매장이 사진, 메뉴/가격, 예약 가능 시간을 직접 관리할 수 있도록 정리한 홈페이지형 운영 스캐폴드입니다.

- 운영 도메인 가정: `partner.wekello.com`
- 현재 범위: UI/플로우 스캐폴드만 포함
- 제외 범위: Supabase, Auth, 업로드, CRUD 구현

## 주요 화면

- `/login`
- `/dashboard`
- `/photos`
- `/menus`
- `/availability`

## 개발 명령어

```bash
npm run dev
npm run lint
npm run build
```

## 환경 변수

실제 비밀값은 `.env.local` 에만 두고, 예시는 `.env.example` 로 관리합니다.

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SITE_NAME`

## 비고

- 현재 폴더는 파트너 앱 UI를 다시 구성하는 작업용 로컬 상태입니다.
- Git remote 정리는 별도 확인 후 진행하는 편이 안전합니다.
