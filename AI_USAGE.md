# AI 활용 기록

## 사용 여부

- 사용함
- 도구 및 모델: Claude Sonnet 4.6 (Claude Code)

## 활용한 작업

| 작업 | AI에 제공한 맥락과 요청 | 결과를 사용한 방식 |
| :--- | :---------------------- | :----------------- |
| 프로젝트 초기 세팅 | 과제 요구사항 문서(requirement.md, openapi.yaml)를 제공하고 기술 스택 선택과 초기 세팅 요청 | 스택 선택 근거를 검토 후 채택, 패키지 설치 및 폴더 구조 구성에 활용 |
| 기반 구조 구현 | OpenAPI 문서를 기반으로 TypeScript 타입, API 클라이언트, MSW 핸들러, 라우터, 인증 컨텍스트, 레이아웃 초안 요청 | 전체 구조 검토 후 채택, tsc --noEmit으로 타입 오류 없음 확인 |
| 로그인 페이지 및 Modal 컴포넌트 구현 | 과제 요구사항(폼 검증 조건, 에러 모달, 원래 경로 복귀)을 제공하고 구현 요청 | 구현 결과 검토 후 버그 2건 발견 및 수정 요청, 직접 브라우저에서 시나리오 확인 |
| GitHub Actions CI 및 PR 템플릿 구성 | PR마다 타입 체크·린트·빌드 오류를 자동으로 검출하는 CI 요청, PR 템플릿 통일성 필요 언급 | CI 워크플로우 및 PR 템플릿 파일 생성 후 직접 확인. CI 오류(pnpm 버전 충돌, 타입 오류) 3건 발생 → 원인 파악 후 수정 요청 |
| 대시보드 페이지 구현 | API 계약(numOfTask, numOfRestTask, numOfDoneTask) 기반으로 구현 요청 | 결과 검토 후 카드 문구 일부 직접 수정 ("완료한 할 일" → "완료한 일") |
| 할일 목록·상세 페이지 구현 | 페이지네이션(URL page param), 카드 목록, 404 빈 상태 화면, 삭제 확인 모달(ID 입력 일치 시 활성화) 구현 요청 | 코드 품질 직접 검토: 인라인 스타일·핸들러 추출, 중첩 삼항 제거, 공통 CSS 분리, 반복 JSX 배열화 등 여러 수정 요청. 버그 4건 직접 발견 및 수정 요청 |
| 할일 목록·상세 추가 버그 수정 및 UX 개선 | 새로고침 시 401 오류, 전체 페이지 스크롤, 페이지네이션 하단 고정, 화면 깜빡임 현상 직접 발견 후 원인 파악 및 수정 요청 | 각 버그의 원인(race condition, height 기준값, ProtectedRoute null 반환)을 질문하고 근거를 확인한 뒤 수정 적용 |
| 회원정보 페이지 구현 | 요구사항 문서를 직접 확인하고 `GET /api/user` 결과(name, memo) 표시 및 로그아웃 기능 구현 요청 | 로그아웃 버튼 위치(회원정보 페이지 vs 사이드바)를 직접 판단하여 사이드바로 변경 요청. 대시보드 카드 라벨이 요구사항과 다른 것을 직접 발견, 현재 라벨이 UX상 더 명확하다고 판단하여 README에 기록하기로 결정 |

## 주요 판단

### 채택한 제안

| 제안 | 채택 이유 | 직접 수정한 내용 |
| :--- | :-------- | :--------------- |
| Vite + React 19 + TypeScript 조합 | 인증 기반 클라이언트 SPA로 SSR 이점이 없어 Next.js보다 단순한 Vite가 적합하다고 판단 | Next.js 사용 여부를 직접 질문하고 과제 요구사항 대비 SSR 필요성 없음을 확인 후 Vite로 확정 |
| MSW를 API mock 도구로 선택 | 브라우저 레벨에서 네트워크를 intercept하므로 실제 API 교체 시 핸들러 파일만 제거하면 되어 코드 변경 최소화 조건에 부합 | 없음 |
| TanStack Query를 서버 상태 관리에 사용 | API 호출 레이어를 분리하고 캐싱·로딩·에러 상태를 일관되게 처리할 수 있어 실제 API 교체 시 queryFn만 수정하면 됨 | 없음 |
| React Hook Form + Zod로 폼 검증 | 이메일 형식, 비밀번호 8~24자 영문+숫자 조건 등 로그인 폼 검증 요구사항을 선언적으로 처리하기에 적합 | 없음 |
| pnpm 패키지 매니저 선택 | npm 대비 설치 속도와 디스크 효율이 높고, lock 파일 가독성이 좋아 과제 제출 시 코드 리뷰에 유리 | 없음 |
| CSS Modules + CSS 변수 조합 선택 | 과제 조건인 "색상을 CSS 변수로 관리"를 코드에서 명확히 드러낼 수 있고, Tailwind 대비 외부 의존성 없이 Vite 기본 지원으로 동작 | Tailwind 사용 여부를 직접 질문하고 과제 조건과의 적합성을 확인 후 CSS Modules로 확정 |
| accessToken을 React state(메모리)에 저장 | XSS로 탈취 불가능한 가장 안전한 저장 방식. 페이지 새로고침 시 accessToken이 사라지지만 refreshToken 쿠키를 통해 자동 복구하도록 설계하여 UX 손실 없음 | 없음 |
| Modal을 createPortal로 body에 렌더링 | 인라인 렌더링·전역 상태 관리 방식과 비교 검토 후 채택. 부모 CSS(overflow:hidden, stacking context)의 영향 없이 z-index가 보장되며, 이 과제 규모에서 전역 상태 방식은 오버스펙이라 판단 | 없음 |
| 이메일 에러는 touchedFields, 비밀번호 에러는 dirtyFields 기준으로 분리 | 이메일은 타이핑 중 에러 노이즈 방지를 위해 blur 후 표시, 비밀번호는 길이·형식 제한을 즉시 피드백해야 하므로 타이핑 시작 즉시 표시 | 초기 구현은 이메일·비밀번호 모두 touchedFields(blur 후)였으나, 빠른 타이핑 시 24자 초과 에러가 표시되지 않는 문제를 직접 발견. 비밀번호는 dirtyFields로 변경하고 maxLength={24} 추가 요청 |
| 로그아웃 버튼을 사이드바에 배치 | 회원정보 페이지에 있으면 `/user`에 들어가야만 로그아웃 가능해 접근성 낮음. 사이드바는 항상 보이는 위치이며 로그인 아이콘과 대칭적으로 자연스러움 | 초기 구현은 회원정보 카드 내부에 버튼 배치였으나 위치 문제를 직접 지적하고 사이드바로 이동 요청 |
| 대시보드 카드 라벨을 "전체 할 일", "남은 할 일", "완료한 일"로 유지 | 요구사항의 "일", "해야 할 일", "한 일"은 단독 표기 시 의미가 불명확함. 과제가 "불완전한 요구사항을 합리적으로 결정하는 방식"을 평가하므로 근거 있는 이탈이 허용됨 | 라벨 불일치를 직접 발견. 현재 라벨이 UX상 더 명확하다고 판단하고 README에 선택 이유 기록하기로 결정 |

### 거절하거나 다시 요청한 제안

| 제안 | 문제점 | 최종 결정 |
| :--- | :----- | :-------- |
| accessToken을 localStorage에 저장 | XSS 공격으로 탈취 가능, OpenAPI 스펙도 refreshToken을 쿠키로 처리하도록 설계되어 있어 보안 설계와 불일치 | accessToken은 React state(메모리)로 변경, refreshToken은 document.cookie로 시뮬레이션 |
| 로그인 성공 후 navigate(from) 직접 호출 | auth 상태 업데이트(setAccessToken)와 router 이동(navigate)이 동시에 일어나 race condition 발생. ProtectedRoute가 isAuthenticated가 아직 false인 상태에서 재실행되어 /sign-in으로 다시 튕기고 원래 경로가 소실됨 | auth.signIn() 후 isAuthenticated guard가 from으로 이동하도록 변경. 직접 브라우저에서 /user 접근 → 로그인 → /user 복귀 시나리오 확인 |
| 계정 메뉴(로그인/회원정보)를 콘텐츠 메뉴와 동일선상에 나열 | 일반적인 사이드바 UX에서 계정 관련 항목은 콘텐츠 nav와 성격이 달라 동등하게 나열하면 어색함 | 사이드바 하단에 분리 배치하도록 수정 요청 |
| PR 템플릿을 CLAUDE.md에 작성 | CLAUDE.md는 AI 참조용 문서이며 PR 템플릿은 `.github/pull_request_template.md`가 GitHub 표준 (UI에서 PR 생성 시 자동 적용) | `.github/pull_request_template.md` 생성, CLAUDE.md에는 참조만 남기도록 수정 요청 |
| MSW refresh 핸들러에 `isLoggedIn` 모듈 변수 사용 | MSW v2는 Service Worker가 아닌 메인 스레드에서 실행되므로 모듈 변수는 페이지 새로고침 시 초기화됨. 쿠키는 유지되는데 변수는 사라져 세션 복구 실패 | `document.cookie`에 직접 접근하도록 변경. 메인 스레드에서는 `document` 접근 가능하며 쿠키는 새로고침 후에도 유지됨 |
| 삭제 확인 모달 버튼을 children 내부에 직접 구현 | Modal 컴포넌트 footer에 이미 "확인" 버튼이 렌더링되므로 버튼 중복 발생 | Modal에 `footer?: React.ReactNode` prop 추가. 기본값은 "확인" 버튼, 삭제 모달은 취소/삭제 버튼으로 오버라이드 |
| `retry: false` 전역 설정 | 네트워크 오류·5xx 서버 오류까지 재시도를 막아버려 복구 가능한 오류도 즉시 실패 처리됨 | 4xx 클라이언트 오류는 즉시 실패, 그 외는 3회 재시도하는 함수로 변경 |
| `useEffect`로 `setAccessTokenGetter` 동기화 | React는 useEffect를 자식 컴포넌트 먼저 실행하므로, TanStack Query의 쿼리 발사(자식 useEffect)가 AuthProvider의 토큰 getter 업데이트(부모 useEffect)보다 먼저 실행되어 새로고침 시 401 발생 | `useLayoutEffect`로 변경. 레이아웃 이펙트는 모든 패시브 이펙트(useEffect)보다 먼저 실행되므로 race condition 해소 |
| `ProtectedRoute`에서 인증 로딩 중 `return null` | 새로고침 시 인증 확인 동안 main 영역이 비어 흰 화면 깜빡임 발생 | CSS border-spin 스피너로 대체 |
| Layout root에 `min-height: 100vh` 사용 | `min-height`는 flex 자식의 `height: 100%` 기준값이 되지 않아 TaskList의 flex 레이아웃(목록 스크롤, 페이지네이션 고정)이 동작하지 않음 | `height: 100vh`로 변경. 명시적 높이를 지정해야 자식이 `height: 100%`를 올바르게 참조함 |

## 검증

- 실행한 자동 검사: `pnpm tsc --noEmit` 으로 타입 오류 없음 확인 (각 작업 완료 시점마다 실행)
- 직접 확인한 사용자 시나리오: `/user` 직접 접근 → `/sign-in` 리다이렉트 → 로그인 → `/user` 복귀 확인 / 비밀번호 24자 초과 입력 제한 확인 / 로그아웃 후 보호된 페이지 접근 → 로그인 페이지 리다이렉트 확인
- 명세와 대조한 내용: 로그인 폼 검증 조건(이메일 형식, 비밀번호 8~24자 영문+숫자) OpenAPI 및 requirement.md와 대조 확인
- CI를 통해 발견 및 수정한 오류: pnpm v10/v12 빌드 스크립트 정책 차이(`ERR_PNPM_IGNORED_BUILDS`), `ApiError` parameter property 문법 오류(`erasableSyntaxOnly` 위반, TS1294) — 로컬 캐시로 통과했으나 CI 전체 검사에서 발견
- 직접 발견 및 수정 요청한 버그: 삭제 모달 내 "확인" 버튼 중복 노출 / MSW 세션 새로고침 시 소실(isLoggedIn 변수 접근법 → document.cookie 직접 접근으로 재수정) / 존재하지 않는 ID 접근 시 404 화면 미표시 / 삭제 모달 버튼 gap 누락 / 새로고침 시 401 race condition / 전체 페이지 스크롤 및 페이지네이션 미고정 / 화면 깜빡임

## 남은 한계

- **refreshToken httpOnly 불가**: mock 환경에서 refreshToken은 `document.cookie`로 시뮬레이션하며 httpOnly 속성을 부여할 수 없음. 실제 API 교체 시 서버가 `Set-Cookie: HttpOnly`로 내려주므로 해소되는 제약임.
- **mock 데이터 새로고침 시 초기화**: 할 일 삭제 후 새로고침하면 mock 데이터(25개)가 리셋됨. 실제 API는 서버 DB에서 관리하므로 해소됨.
- **페이지네이션 전체 페이지 수 미표시**: API가 `hasNext`만 반환하고 전체 항목 수를 내려주지 않아 "N 페이지" 형태로만 표시됨. API에 `totalCount`가 추가되면 개선 가능.
- **로그인 자격증명 미검증**: mock 환경이므로 아무 이메일·비밀번호 조합으로 로그인 가능. 실제 API 교체 시 서버에서 검증함.
