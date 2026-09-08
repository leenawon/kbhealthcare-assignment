# AI 활용 기록

## 사용 여부

- 사용함
- 도구 및 모델: Claude Sonnet 4.6 (Claude Code)

## 활용한 작업

| 작업 | AI에 제공한 맥락과 요청 | 결과를 사용한 방식 |
| :--- | :---------------------- | :----------------- |
| 프로젝트 초기 세팅 | 과제 요구사항 문서(requirement.md, openapi.yaml)를 제공하고 기술 스택 선택과 초기 세팅 요청 | 스택 선택 근거를 검토 후 채택, 패키지 설치 및 폴더 구조 구성에 활용 |
| 기반 구조 구현 | OpenAPI 문서를 기반으로 TypeScript 타입, API 클라이언트, MSW 핸들러, 라우터, 인증 컨텍스트, 레이아웃 초안 요청 | 전체 구조 검토 후 채택, tsc --noEmit으로 타입 오류 없음 확인 |

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

### 거절하거나 다시 요청한 제안

| 제안 | 문제점 | 최종 결정 |
| :--- | :----- | :-------- |
| accessToken을 localStorage에 저장 | XSS 공격으로 탈취 가능, OpenAPI 스펙도 refreshToken을 쿠키로 처리하도록 설계되어 있어 보안 설계와 불일치 | accessToken은 React state(메모리)로 변경, refreshToken은 document.cookie로 시뮬레이션 |

## 검증

- 실행한 자동 검사: `pnpm tsc --noEmit` 으로 타입 오류 없음 확인 (기반 구조 구현 완료 시점)
- 직접 확인한 사용자 시나리오:
- 명세와 대조한 내용:

## 남은 한계

- mock 환경에서 refreshToken은 `document.cookie`로 시뮬레이션하며 httpOnly 속성을 부여할 수 없음. 실제 API 교체 시 서버가 `Set-Cookie: HttpOnly`로 내려주므로 해소되는 제약임.
