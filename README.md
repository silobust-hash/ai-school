# AI업무학교

## 환경 변수

.env.local 또는 배포 환경변수에 아래 키를 설정하세요.

- `ADMIN_PASSWORD`
  - 관리자 로그인 비밀번호
  - 최소 16자 이상 권장
  - `.env`에 빈 값/기본값을 그대로 두지 마세요.
- `ADMIN_SESSION_SECRET`
  - 관리자 세션 HMAC 서명 키
  - 운영에서는 랜덤 문자열(최소 32자 이상)
- `LESSON_ACCESS_SECRET`
  - 수강생 접근 코드/쿠키 서명 키
  - 운영에서는 랜덤 문자열(최소 32자 이상)
- `BLOB_READ_WRITE_TOKEN`
  - 관리자 강의 본문 영구 저장에 사용되는 Blob 쓰기 토큰(운영 필수)
  - 실서버에서는 반드시 설정해야 하며, 미설정 시 저장/삭제가 실패 처리됩니다.
- `AI_SCHOOL_BLOB_PREFIX`
  - 기존 Blob 저장소를 함께 사용할 때 AI업무학교 강의 JSON을 격리하는 전용 prefix
  - 권장값: `ai-school/production/lessons/`
- `BLOB_ACCESS`
  - Blob 저장소 생성 시 선택한 접근 모드
  - 기본값은 `public`, private Blob 저장소를 재사용하면 `private`
- `ALLOW_IN_MEMORY_LESSON_STORAGE`
  - 기본적으로 `false`로 두고 테스트 또는 명시적으로 로컬 개발에서만 `true` 허용
  - 운영/일반 개발 환경에서는 사용하지 마세요
- `NEXT_PUBLIC_SITE_URL`
  - 사이트 공개 기본 URL

> 비밀값은 저장소에 절대 커밋하지 마세요.
