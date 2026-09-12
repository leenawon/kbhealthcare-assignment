# KB헬스케어 프론트엔드 과제

## 실행 방법

```bash
pnpm install
pnpm dev
```

브라우저에서 `http://localhost:5173` 접속 후 아무 이메일/비밀번호 조합으로 로그인합니다.

> MSW(Mock Service Worker)가 API를 intercept하므로 별도 서버 없이 동작합니다.

## 프로젝트 구조

```
src/
├── api/            # 엔드포인트별 API 함수 (auth, dashboard, task, user)
│   └── client.ts   # 공통 fetch 래퍼 (Bearer 토큰 주입, ApiError)
├── components/     # 공통 컴포넌트 (Layout, Modal)
├── hooks/          # useAuth (인증 Context + 세션 복구 로직)
├── mocks/          # MSW 핸들러 (handlers.ts)
├── pages/          # 페이지 컴포넌트 (Dashboard, SignIn, TaskList, TaskDetail, User)
├── router/         # ProtectedRoute (비로그인 접근 차단 + 원래 경로 복귀)
├── styles/         # 전역 CSS 변수, 공통 페이지 레이아웃 클래스
└── types/          # OpenAPI 기반 TypeScript 타입
```

## 주요 기술 선택

| 기술 | 선택 이유 |
| :--- | :-------- |
| Vite + React 19 | 인증 기반 클라이언트 SPA로 SSR 이점 없음. Next.js보다 단순한 구조가 과제 규모에 적합 |
| TanStack Query | API 레이어를 `api/*.ts`에 분리하고 queryFn만 교체하면 실제 API로 전환 가능 |
| MSW | 브라우저 레벨에서 네트워크를 intercept하므로 실제 API 교체 시 `src/mocks/handlers.ts`만 제거하면 됨 |
| CSS Modules + CSS 변수 | 과제 조건인 "색상을 CSS 변수로 관리"를 `src/styles/tokens.css`에서 명시적으로 충족 |
| React Hook Form + Zod | 이메일·비밀번호 유효성 조건을 선언적으로 처리, 제출 버튼 활성화 조건을 `isValid`로 간결하게 표현 |
| accessToken: 메모리 저장 | XSS로 탈취 불가능한 가장 안전한 저장 방식. 새로고침 시 refreshToken 쿠키로 자동 복구 |

## 검증 방법

**자동 검사**

```bash
pnpm tsc --noEmit  # 타입 오류 확인
pnpm lint          # 린트 오류 확인
pnpm build         # 빌드 오류 확인
```

PR마다 GitHub Actions CI가 위 세 단계를 자동 실행합니다.

**직접 확인한 시나리오**

- `/user` 직접 접근 → `/sign-in` 리다이렉트 → 로그인 → `/user` 복귀
- 로그인 후 새로고침 → 세션 유지 (refreshToken 쿠키 기반 자동 복구)
- 존재하지 않는 할 일 ID 접근 → 404 빈 상태 화면 표시
- 삭제 모달에서 ID 불일치 → 삭제 버튼 비활성화
- 비밀번호 24자 초과 입력 → 즉시 에러 표시 + 브라우저 레벨 차단

## 실제 API로 전환하는 방법

mock 환경 제거 후 최소한의 수정만으로 실제 API로 전환할 수 있도록 설계했습니다.

1. `src/mocks/` 폴더 제거
2. `src/main.tsx`에서 `enableMocking()` 래퍼 제거
3. `src/hooks/useAuth.tsx`에서 `refreshCookie` 유틸리티 제거 — 서버가 httpOnly 쿠키로 refreshToken을 직접 관리하므로 `document.cookie` 접근 불필요
4. Vite `server.proxy` 또는 환경 변수로 실제 API base URL 설정

`src/api/*.ts`의 엔드포인트 함수, `Authorization` 헤더 주입, 각 페이지의 `queryFn`은 변경 없이 그대로 사용 가능합니다.

## 요구사항 해석 기록

**할 일 목록 페이지네이션**

요구사항에는 "GET /api/task 결과를 카드 목록으로 표시합니다"로만 명시되어 페이지네이션 언급이 없습니다. 그러나 OpenAPI 문서에는 `page` 쿼리 파라미터와 `hasNext` 응답 필드가 명시되어 있습니다. API 계약(OpenAPI)이 페이지네이션을 의도한 설계임이 명확하므로 OpenAPI를 기준으로 구현했습니다. URL `page` 파라미터로 상태를 관리해 새로고침 시에도 현재 페이지가 유지됩니다.

**대시보드 카드 라벨**

요구사항의 "일", "해야 할 일", "한 일" 대신 "전체 할 일", "남은 할 일", "완료한 일"로 표기했습니다. 단독 표기 시 의미가 불명확하여 각 항목의 의미를 명확히 전달하는 라벨로 변경했습니다.

**로그아웃 버튼**

요구사항에 명시되지 않았으나 인증 흐름의 완결성을 위해 추가했습니다. 사이드바 하단에 배치하여 어느 페이지에서도 접근 가능하도록 했습니다.

## 알려진 한계

- **refreshToken httpOnly 불가**: mock 환경에서 refreshToken은 `document.cookie`로 시뮬레이션하며 `httpOnly` 속성을 부여할 수 없습니다. 실제 API 교체 시 서버가 `Set-Cookie: HttpOnly`로 내려주므로 해소되는 제약입니다.
- **mock 데이터 새로고침 시 초기화**: 할 일 삭제 후 새로고침하면 mock 데이터(25개)가 리셋됩니다. 실제 API는 서버 DB에서 관리하므로 해소됩니다.
- **페이지네이션 전체 페이지 수 미표시**: API가 `hasNext`만 반환하고 전체 항목 수를 내려주지 않아 "N 페이지" 형태로만 표시됩니다. API에 `totalCount`가 추가되면 개선 가능합니다.
- **로그인 자격증명 미검증**: mock 환경이므로 아무 이메일·비밀번호 조합으로 로그인 가능합니다. 실제 API 교체 시 서버에서 검증합니다.
