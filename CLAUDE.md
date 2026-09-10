# CLAUDE.md

Claude Code가 이 프로젝트에서 참고해야 할 규칙과 컨벤션입니다.

## 패키지 매니저

- **pnpm** 사용

## 브랜치 전략

- `main`: 최종 제출 브랜치
- `feat/<기능명>`: 기능 단위 개발 브랜치 (예: `feat/sign-in`, `feat/dashboard`)
- 기능 완성 후 PR 생성 → main에 **Squash merge** → 브랜치 삭제

## 커밋 메시지

Conventional Commits 형식을 따르되 **한국어**로 작성합니다.

```
<type>: <설명>
```

### 타입 목록

| 타입       | 사용 상황                |
| :--------- | :----------------------- |
| `feat`     | 새로운 기능 추가         |
| `fix`      | 버그 수정                |
| `chore`    | 빌드, 패키지, 설정 변경  |
| `docs`     | 문서 작성 및 수정        |
| `style`    | CSS, 스타일 관련 작업    |
| `refactor` | 기능 변경 없는 코드 개선 |

### 예시

```
feat: 로그인 페이지 및 폼 유효성 검증 구현
fix: 비밀번호 정규식 패턴 수정
chore: Vite 프로젝트 초기 세팅 및 의존성 설치
docs: AI_USAGE.md 작성
style: 전역 CSS 변수 및 Pretendard 폰트 설정
refactor: 인증 로직 커스텀 훅으로 분리
```

## 커밋 단위

- 커밋은 작업 항목별로 세분화하여 진행 (한 번에 몰아서 커밋 금지)
- 예: 스타일 → 타입 → API 클라이언트 → MSW → 인증 → 레이아웃 → 페이지 → 문서 순으로 각각 커밋

## 작업 완료 순서 (필수)

1. 구현 내용 설명
2. 사용자 확인
3. AI_USAGE.md 업데이트
4. 항목별 세분화 커밋
5. PR 생성 (머지는 사용자가 직접)

## 코드 스타일 규칙

### 스타일

- 인라인 스타일(`style={{ }}`) 사용 금지 — 반드시 CSS 모듈 클래스로 작성
- 페이지 간 공통 스타일(`.container`, `.heading`, `.skeleton` 등)은 `src/styles/page.module.css`에서 `composes`로 참조
- 스켈레톤 애니메이션은 `page.module.css`의 `.skeleton`을 compose하여 일관성 유지

### JSX 가독성

- JSX 내부에서 중첩 삼항 연산자(`? ? :`) 사용 금지
- 조건부 렌더링이 3가지 이상이면 `renderXxx()` 함수로 분리하여 JSX에서 호출
- 동일한 JSX 패턴이 3회 이상 반복되면 배열 + `map`으로 추출

### 이벤트 핸들러

- 재사용되거나 로직이 2줄 이상인 이벤트 핸들러는 인라인 익명 함수 대신 named 함수로 추출
- 단순 상태 변경 1줄(`onClick={() => setState(true)}`)은 인라인 허용

### TanStack Query

- 로딩 상태 확인은 `isPending` 사용 (`isLoading` 사용 금지)
  - `isLoading = isPending && isFetching`이므로 캐시 데이터 없을 때 스켈레톤을 보여주는 조건으로는 `isPending`이 정확함
- `useQuery`는 컴포넌트에 직접 작성 — 각 쿼리가 단일 컴포넌트에서만 사용되므로 커스텀 훅으로 분리하면 파일만 늘고 이점 없음
- retry 설정은 `App.tsx`의 `QueryClient`에서 전역으로 관리: 4xx 클라이언트 오류는 즉시 실패, 그 외(네트워크 오류·5xx)는 3회 재시도

## PR 규칙

- feature 브랜치 작업 완료 후 PR 생성
- PR 제목: 커밋 메시지와 동일한 형식 (`feat: 대시보드 페이지 구현`)
- PR description: `.github/pull_request_template.md` 형식을 따름
- main에 **Squash merge** 후 브랜치 삭제
