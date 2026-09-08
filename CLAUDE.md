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

| 타입 | 사용 상황 |
| :--- | :-------- |
| `feat` | 새로운 기능 추가 |
| `fix` | 버그 수정 |
| `chore` | 빌드, 패키지, 설정 변경 |
| `docs` | 문서 작성 및 수정 |
| `style` | CSS, 스타일 관련 작업 |
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

## PR 규칙

- feature 브랜치 작업 완료 후 PR 생성
- PR 제목: 커밋 메시지와 동일한 형식 (`feat: 대시보드 페이지 구현`)
- PR description: `.github/pull_request_template.md` 형식을 따름
- main에 **Squash merge** 후 브랜치 삭제
