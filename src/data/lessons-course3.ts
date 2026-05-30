import type { Lesson } from "./lessons-course1";

export const lessonsCourse3: Record<string, Lesson> = {
  "3-1": {
    id: "3-1",
    phase: "3과",
    datePublished: "2026-04-02",
    title: "하네스엔지니어링이란",
    summary: "AI를 도구로서 제어하는 개념, CLAUDE.md와 설정 파일의 역할을 배웁니다",
    prev: "2-5",
    next: "3-2",
    sections: [
      {
        heading: "하네스(Harness)의 의미",
        content:
          "하네스(harness)는 원래 말(馬)에 씌우는 마구(馬具)를 뜻합니다. 강한 말의 힘을 안전하고 원하는 방향으로 이끄는 도구입니다. 하네스엔지니어링은 이 비유에서 출발합니다. AI라는 강력하지만 통제되지 않으면 예측 불가능한 도구에 '고삐'를 달아 원하는 방향으로 작동하게 하는 기술입니다.\n\n컨텍스트엔지니어링이 '무엇을 말할지'에 집중한다면, 하네스엔지니어링은 '어떻게 작동할지 시스템을 설계하는 것'에 집중합니다. 프로젝트 전반에 걸쳐 AI의 행동, 규칙, 도구 접근권을 설정하는 것입니다.",
      },
      {
        heading: "CLAUDE.md — AI의 행동 지침서",
        content:
          "Claude Code를 쓰다 보면 CLAUDE.md라는 파일을 접하게 됩니다. 이 파일은 Claude Code가 프로젝트를 시작할 때 가장 먼저 읽는 설정 파일입니다. 마치 신입 직원에게 주는 '업무 매뉴얼'과 같습니다.\n\nCLAUDE.md에 담을 수 있는 내용:\n- 프로젝트 개요와 구조 설명\n- 코딩 규칙과 스타일 가이드\n- 절대 수정하면 안 되는 파일 목록\n- 자주 쓰는 명령어와 절차\n- 협업 규칙 (커밋 메시지 형식 등)\n\nCLAUDE.md를 잘 작성하면 매 대화마다 배경을 다시 설명할 필요 없이 AI가 프로젝트의 맥락을 바로 파악합니다.",
        code: "# CLAUDE.md 예시\n\n## 프로젝트 개요\n이 프로젝트는 노무사 업무 자동화 도구입니다.\n주요 기능: 취업규칙 검토, 임금 계산, 신고서 작성\n\n## 코딩 규칙\n- TypeScript 사용, any 타입 금지\n- 함수명은 영어 camelCase\n- 주석은 한국어로 작성\n\n## 절대 수정 금지\n- src/data/법령/*.ts (법령 데이터)\n- .env (환경변수)\n\n## 자주 쓰는 명령어\n- npm run dev: 개발 서버 시작\n- npm run build: 빌드 검증",
        tip: "CLAUDE.md는 프로젝트 루트에 두면 Claude Code가 자동으로 읽습니다. 처음에는 간단하게 시작하고 작업하면서 필요한 규칙을 추가해 나가세요.",
      },
      {
        heading: "설정 파일로 AI 행동 제어하기",
        content:
          "CLAUDE.md 외에도 `.claude/settings.json`으로 Claude Code의 세부 동작을 설정할 수 있습니다. 어떤 파일에 접근할 수 있는지, 어떤 명령어를 실행할 수 있는지, 자동화 훅을 어떻게 설정할지 등을 제어합니다.\n\n하네스엔지니어링의 핵심은 AI에게 모든 자유를 주지 않는 것입니다. '이 프로젝트에서 너는 이것만 할 수 있어'라는 경계를 설정하면 예상치 못한 사고를 방지하고 일관된 작업 결과를 얻을 수 있습니다.",
      },
    ],
    keyTakeaways: [
      "하네스엔지니어링은 AI에게 경계와 규칙을 설정해 원하는 방향으로 제어하는 기술입니다.",
      "CLAUDE.md는 Claude Code가 프로젝트 시작 시 읽는 행동 지침서입니다.",
      "설정 파일로 AI의 접근 권한과 자동화 동작을 제어할 수 있습니다.",
    ],
    faq: [
      {
        question: "CLAUDE.md는 모든 AI에서 쓸 수 있나요?",
        answer:
          "CLAUDE.md는 Claude Code에 특화된 파일 형식입니다. 하지만 같은 개념으로 ChatGPT의 Custom Instructions, GitHub Copilot의 .github/copilot-instructions.md 등 각 도구별로 유사한 설정 파일이 있습니다.",
      },
      {
        question: "하네스엔지니어링을 배우면 어떤 업무에 적용할 수 있나요?",
        answer:
          "반복적인 문서 작업 자동화, 코드 품질 관리, 팀 협업 규칙 적용 등에 활용됩니다. 특히 여러 사람이 같은 AI 도구를 쓰는 환경에서 일관성을 유지하는 데 큰 도움이 됩니다.",
      },
    ],
  },
  "3-2": {
    id: "3-2",
    phase: "3과",
    datePublished: "2026-04-02",
    title: "터미널과 친해지기",
    summary: "터미널 기초, 핵심 명령어 10개를 배워 두려움을 극복합니다",
    prev: "3-1",
    next: "3-3",
    sections: [
      {
        heading: "터미널이란 무엇인가요?",
        content:
          "터미널(Terminal)은 컴퓨터와 텍스트로 대화하는 창입니다. 마우스로 클릭하는 대신 명령어를 타이핑해서 컴퓨터를 제어합니다. macOS에서는 '터미널(Terminal)' 앱, Windows에서는 'PowerShell' 또는 'Command Prompt'가 터미널입니다.\n\n처음에는 검은 화면에 흰 글자가 무섭게 느껴집니다. 하지만 원리는 간단합니다. 컴퓨터에게 '이 폴더로 이동해', '이 파일 만들어', '이 프로그램 실행해'라고 텍스트로 지시하는 것입니다.\n\nClaude Code는 터미널에서 실행됩니다. 터미널을 두려워하지 않는 것이 바이브코딩의 첫 번째 단계입니다.",
      },
      {
        heading: "꼭 알아야 할 터미널 명령어 10가지",
        content:
          "실무에서 자주 쓰는 핵심 명령어만 외우면 됩니다. 10개면 충분합니다.",
        code: "# 위치 확인\npwd                    # 현재 내가 어느 폴더에 있는지 확인\n\n# 폴더 이동\nls                     # 현재 폴더의 파일 목록 보기\ncd 폴더이름             # 해당 폴더로 이동\ncd ..                  # 상위 폴더로 이동\ncd ~                   # 홈 디렉터리로 이동\n\n# 파일/폴더 만들기\nmkdir 폴더이름          # 새 폴더 만들기\ntouch 파일이름.txt      # 새 빈 파일 만들기\n\n# 복사/이동/삭제\ncp 원본 복사본          # 파일 복사\nmv 원본 새이름          # 파일 이름 바꾸기 또는 이동\nrm 파일이름            # 파일 삭제 (주의: 휴지통 없이 바로 삭제)\n\n# 프로그램 실행\nnpm run dev            # Node.js 프로젝트 개발 서버 시작",
        tip: "명령어를 외울 필요 없습니다. Claude Code에게 '이 파일을 저 폴더로 이동시켜줘'라고 말하면 알아서 명령어를 실행합니다. 단, 명령어 결과를 이해할 수 있어야 AI가 뭘 하는지 파악할 수 있습니다.",
      },
      {
        heading: "터미널 공포증 극복하는 연습법",
        content:
          "터미널 연습은 아주 간단하게 시작할 수 있습니다. 터미널을 열고 다음 순서로 해보세요.\n\n1. `pwd` 입력 → 내 위치 확인\n2. `ls` 입력 → 파일 목록 확인\n3. `mkdir test-folder` → 'test-folder' 폴더 만들기\n4. `cd test-folder` → 방금 만든 폴더로 이동\n5. `touch hello.txt` → 빈 파일 만들기\n6. `ls` → 파일이 생겼는지 확인\n7. `cd ..` → 상위 폴더로 돌아가기\n\n이 7단계를 5번 반복하면 터미널이 친숙해집니다. 가장 중요한 것은 '잘못 입력해도 터미널이 폭발하지 않는다'는 사실을 몸으로 느끼는 것입니다.",
      },
    ],
    keyTakeaways: [
      "터미널은 텍스트로 컴퓨터에 명령하는 도구이며, Claude Code를 사용하려면 기본기가 필요합니다.",
      "pwd, ls, cd, mkdir, touch, rm 10가지 명령어만 알면 일상 작업의 80%를 처리할 수 있습니다.",
      "명령어를 외우기보다 의미를 이해하고, 나머지는 AI에게 맡기면 됩니다.",
    ],
    faq: [
      {
        question: "Windows에서도 같은 명령어를 쓸 수 있나요?",
        answer:
          "Windows의 기본 Command Prompt는 다른 명령어를 씁니다(예: dir 대신 ls). 하지만 Windows에서도 Git Bash나 WSL(Windows Subsystem for Linux)을 설치하면 동일한 리눅스 명령어를 사용할 수 있습니다. Claude Code를 사용하려면 WSL 환경을 권장합니다.",
      },
      {
        question: "터미널에서 실수로 잘못된 명령어를 입력하면 어떻게 되나요?",
        answer:
          "대부분은 '명령어를 찾을 수 없습니다'라는 오류 메시지만 뜨고 아무 일도 일어나지 않습니다. 단, rm 명령어는 파일을 즉시 삭제하므로 주의가 필요합니다. 처음에는 rm 전에 항상 ls로 삭제 대상을 확인하는 습관을 들이세요.",
      },
    ],
  },
  "3-3": {
    id: "3-3",
    phase: "3과",
    datePublished: "2026-04-02",
    title: "Git과 GitHub 기초",
    summary: "버전관리의 개념, 레포/커밋/푸시/풀을 실생활 비유로 이해합니다",
    prev: "3-2",
    next: "3-4",
    sections: [
      {
        heading: "Git이란? — 문서 버전 관리의 천재",
        content:
          "보고서를 작성하다 '보고서_최종.docx', '보고서_최종2.docx', '보고서_진짜최종.docx'처럼 파일이 늘어난 경험 있으신가요? Git은 이 문제를 해결합니다.\n\nGit은 파일의 변경 이력을 추적하는 버전관리 시스템입니다. '언제, 누가, 무엇을 변경했는지' 모든 기록이 남습니다. 언제든지 과거 버전으로 되돌아갈 수 있고, 여러 사람이 동시에 작업해도 충돌 없이 합칠 수 있습니다.\n\n코드뿐만 아니라 텍스트 기반 파일(마크다운, CSV, 설정 파일 등) 모두 버전 관리가 가능합니다.",
      },
      {
        heading: "핵심 용어 5개만 알면 됩니다",
        content:
          "Git 용어는 처음에 생소하지만 비유로 이해하면 쉽습니다.\n\n**레포지토리(Repository, 레포)**: 프로젝트 전체를 담는 폴더. 모든 파일과 변경 이력이 저장됩니다. 비유: 프로젝트 전용 금고.\n\n**커밋(Commit)**: 변경 내용을 저장하는 행위. 게임의 '저장하기'와 같습니다. 각 커밋에 메시지를 남겨 무엇을 바꿨는지 기록합니다.\n\n**브랜치(Branch)**: 원본을 건드리지 않고 새 기능을 실험하는 별도 공간. 비유: 원본 문서 복사본에서 작업하기.\n\n**푸시(Push)**: 내 컴퓨터의 변경 내용을 GitHub(원격 서버)에 올리기. 비유: 작업한 파일을 구글 드라이브에 동기화.\n\n**풀(Pull)**: GitHub에서 최신 내용을 내 컴퓨터로 가져오기. 비유: 다른 사람이 수정한 파일을 내 컴퓨터에 동기화.",
        code: "# 기본 Git 워크플로우\n\n# 1. 레포 새로 만들기 (처음 한 번만)\ngit init\n\n# 2. GitHub에서 내려받기\ngit clone https://github.com/사용자명/레포이름\n\n# 3. 변경 내용 확인\ngit status\n\n# 4. 변경 파일 스테이징 (커밋 준비)\ngit add .                 # 모든 변경 파일 추가\ngit add 파일이름          # 특정 파일만 추가\n\n# 5. 커밋 (저장)\ngit commit -m \"변경 내용 설명\"\n\n# 6. GitHub에 올리기\ngit push\n\n# 7. GitHub에서 내려받기\ngit pull",
        tip: "커밋 메시지는 미래의 나와 팀원을 위해 씁니다. '수정'이 아니라 '연차 계산 버그 수정'처럼 무엇을 왜 바꿨는지 명확히 써주세요.",
      },
      {
        heading: "GitHub — Git의 클라우드 버전",
        content:
          "Git이 내 컴퓨터의 버전 관리 도구라면, GitHub(github.com)는 그 레포지토리를 인터넷에 저장하고 공유하는 플랫폼입니다. 구글 드라이브가 파일을 클라우드에 저장하듯, GitHub는 코드를 클라우드에 저장합니다.\n\nGitHub의 장점:\n- 백업: 컴퓨터가 망가져도 코드가 사라지지 않습니다.\n- 협업: 팀원이 같은 코드베이스에서 동시에 작업할 수 있습니다.\n- 배포 연동: Vercel 같은 서비스와 연결해 코드를 자동으로 배포할 수 있습니다.\n\nClaude Code와 GitHub는 찰떡궁합입니다. Claude Code로 코드를 작성하고 → git commit → git push → Vercel이 자동 배포하는 흐름이 기본입니다.",
      },
    ],
    keyTakeaways: [
      "Git은 파일의 변경 이력을 추적하는 버전관리 시스템으로 '언제, 누가, 무엇을 바꿨는지' 기록합니다.",
      "레포, 커밋, 브랜치, 푸시, 풀 다섯 가지 용어만 알면 기본 워크플로우를 사용할 수 있습니다.",
      "GitHub는 Git 레포지토리를 클라우드에 저장하고 팀과 공유하며 자동 배포를 연결하는 플랫폼입니다.",
    ],
    faq: [
      {
        question: "Git을 배우지 않고 Claude Code를 쓸 수 있나요?",
        answer:
          "기술적으로는 가능하지만, 매우 위험합니다. Git 없이 작업하면 AI가 파일을 잘못 수정했을 때 이전 상태로 되돌릴 방법이 없습니다. Claude Code를 쓰기 전에 git init과 git commit 습관을 꼭 들이세요.",
      },
      {
        question: "GitHub 계정은 어떻게 만드나요?",
        answer:
          "github.com에서 무료로 가입할 수 있습니다. 이메일 주소와 사용자명만 있으면 됩니다. 공개 레포지토리는 무제한 무료이며, 팀 협업을 위한 비공개 레포지토리도 무료 플랜에서 3인까지 지원합니다.",
      },
    ],
  },
  "3-4": {
    id: "3-4",
    phase: "3과",
    datePublished: "2026-04-02",
    title: "Claude Code 설치하기",
    summary: "Node.js와 Claude Code를 설치하고 첫 실행을 해봅니다",
    prev: "3-3",
    next: "3-5",
    sections: [
      {
        heading: "설치 전 준비물",
        content:
          "Claude Code를 사용하려면 두 가지가 필요합니다.\n\n1. Node.js: Claude Code가 실행되는 환경입니다. Node.js는 자바스크립트를 서버에서 실행하게 해주는 런타임입니다. 프로그래밍을 몰라도 됩니다. 설치 파일을 실행하는 수준입니다.\n\n2. Anthropic 계정: Claude Code는 Claude API를 사용하므로 Anthropic 계정이 필요합니다. 사용량에 따라 요금이 부과되지만 처음에는 $5 크레딧이 제공됩니다.\n\n설치는 macOS와 Windows 모두 지원하며, 약 10분이면 완료됩니다.",
        tip: "Node.js는 LTS(Long Term Support) 버전을 설치하세요. 홈페이지(nodejs.org)에서 다운로드하면 됩니다. LTS 버전이 가장 안정적입니다.",
      },
      {
        heading: "Claude Code 설치 단계별 가이드",
        content:
          "Node.js 설치 후 터미널을 열고 아래 명령어를 실행합니다.",
        code: "# 1. Node.js 설치 확인\nnode --version      # v20.x.x 이상이면 OK\nnpm --version       # 10.x.x 이상이면 OK\n\n# 2. Claude Code 설치\nnpm install -g @anthropic-ai/claude-code\n\n# 3. 설치 확인\nclaude --version\n\n# 4. 로그인 (브라우저가 열립니다)\nclaude\n\n# 처음 실행 시 Anthropic 계정으로 로그인하는 화면이 뜹니다.\n# 로그인 후 터미널로 돌아오면 설치 완료!",
      },
      {
        heading: "첫 실행 — Hello, Claude Code!",
        content:
          "설치 후 아무 폴더에서 `claude` 명령어를 입력하면 Claude Code가 시작됩니다. 터미널에 프롬프트가 나타나면 자연어로 대화할 수 있습니다.\n\n첫 번째로 해볼 것: 빈 폴더를 하나 만들고 그 안에서 claude를 실행한 뒤 '안녕하세요. 이 폴더에 index.html 파일을 만들고 Hello World를 출력하는 간단한 웹페이지를 만들어줘'라고 입력해보세요.\n\nClaude Code가 파일을 생성하고, 코드를 설명하며, 브라우저에서 확인하는 방법까지 안내해줄 것입니다. 코드를 한 줄도 모르는 분도 첫 웹페이지를 만들 수 있습니다.",
      },
    ],
    keyTakeaways: [
      "Claude Code 설치는 Node.js 설치 후 npm install -g @anthropic-ai/claude-code 명령어 하나로 완료됩니다.",
      "Anthropic 계정과 로그인이 필요하며, 처음 $5 크레딧이 제공됩니다.",
      "설치 후 첫 실행에서 자연어로 웹페이지를 만들어보며 바이브코딩의 감각을 익히세요.",
    ],
    faq: [
      {
        question: "Claude Code 사용 요금은 얼마인가요?",
        answer:
          "Claude Code는 Anthropic API를 사용하므로 토큰 기반 요금이 부과됩니다. 일반적인 개인 업무용으로는 월 $10~30 수준입니다. Claude Pro($20/월) 구독자는 Claude Code를 포함한 혜택을 받을 수 있습니다.",
      },
      {
        question: "설치 중 오류가 나면 어떻게 하나요?",
        answer:
          "오류 메시지를 그대로 복사해서 Claude에게 물어보세요. 'Claude Code 설치 중 이런 오류가 났어: [오류 메시지]'라고 하면 해결 방법을 안내해줍니다. 또는 관련 강의 페이지에서 설치 가이드를 확인하세요.",
      },
    ],
    relatedLinks: [
      {
        label: "클로드 코드 강의 — Claude Code 설치 & 로그인",
        url: "https://edu.silronomu.com/lessons/2-4",
      },
    ],
  },
  "3-5": {
    id: "3-5",
    phase: "3과",
    datePublished: "2026-04-02",
    title: "바이브코딩으로 웹사이트 만들기",
    summary: "Claude Code와 대화하며 코딩하는 바이브코딩으로 첫 웹사이트를 만듭니다",
    prev: "3-4",
    next: "3-6",
    sections: [
      {
        heading: "바이브코딩이란?",
        content:
          "바이브코딩(Vibe Coding)은 2025년 Andrej Karpathy가 만든 용어입니다. 코드의 세부 사항을 외우고 직접 타이핑하는 대신, AI에게 원하는 것을 자연어로 설명하며 빠르게 결과물을 만들어가는 개발 방식입니다.\n\n'느낌(vibe)으로 코딩한다'는 뜻입니다. 어떤 화면이 나와야 하는지, 어떻게 작동해야 하는지를 말로 설명하고, AI가 코드를 짜면 결과를 보고 피드백하며 발전시켜 나갑니다.\n\n문과 출신도, 코드를 모르는 사람도 바이브코딩으로 실제 작동하는 웹사이트와 앱을 만들 수 있습니다.",
      },
      {
        heading: "첫 웹사이트 만들기 — 단계별 실습",
        content:
          "빈 폴더에서 Claude Code를 시작해 간단한 소개 페이지를 만들어봅니다. Claude Code와의 대화 예시를 따라해보세요.",
        code: "# 실습 대화 예시\n\n사용자: 내 이름과 직업을 소개하는 간단한 웹페이지를 만들어줘.\n배경색은 하늘색 계열, 이름은 크게, 중앙 정렬로 해줘.\n이름: 김직원, 직업: 인사팀 대리\n\nClaude Code: (index.html 파일 생성)\n\n사용자: 괜찮은데, 이름 아래에 간단한 자기소개 문장도 추가해줘.\n그리고 연락처 이메일 버튼도 넣어줘.\n\nClaude Code: (파일 수정)\n\n사용자: 이메일 버튼 색이 너무 밝아. 진한 파란색으로 바꿔줘.\n마우스를 올리면 색이 살짝 어두워지는 효과도 넣어줘.\n\n# 이렇게 대화하면서 점점 완성도 높은 페이지를 만들어갑니다!",
        tip: "처음에는 '이 코드가 뭔지' 이해하려 하지 마세요. 결과를 브라우저에서 보고 마음에 안 드는 부분을 말로 설명하면 됩니다. 이해는 나중에 자연스럽게 따라옵니다.",
      },
      {
        heading: "바이브코딩 성공의 3가지 원칙",
        content:
          "첫째, 작게 시작하세요. 한 번에 완벽한 것을 요구하면 오히려 어렵습니다. '버튼 하나 추가', '색 바꾸기', '텍스트 수정'처럼 작은 단위로 요청하세요.\n\n둘째, 자주 저장(커밋)하세요. 잘 작동하는 상태가 됐을 때 git commit으로 저장해두세요. 나중에 뭔가 잘못돼도 돌아갈 수 있습니다.\n\n셋째, 결과 화면을 AI에게 보여주세요. '지금 이렇게 보이는데 이 부분이 이상해'라고 하면 AI가 문제를 파악하고 수정합니다. 스크린샷을 첨부하거나 오류 메시지를 복사해서 알려주세요.",
      },
    ],
    keyTakeaways: [
      "바이브코딩은 AI에게 자연어로 설명하며 결과를 보고 피드백하는 개발 방식입니다.",
      "코드를 모르는 사람도 원하는 결과가 뭔지 말로 설명할 수 있으면 충분합니다.",
      "작은 단위 요청, 자주 커밋, 결과 화면 공유가 바이브코딩 성공의 핵심입니다.",
    ],
    faq: [
      {
        question: "바이브코딩으로 만든 결과물은 실제로 쓸 수 있는 수준인가요?",
        answer:
          "간단한 소개 페이지, 계산기, 폼 등은 충분히 실용적인 수준으로 만들 수 있습니다. 복잡한 기업용 시스템은 전문 개발자가 필요하지만, 개인 업무 도구나 간단한 웹사이트는 바이브코딩만으로도 충분합니다.",
      },
      {
        question: "Claude Code 대신 다른 AI 코딩 도구를 써도 되나요?",
        answer:
          "GitHub Copilot, Cursor, Windsurf 등 다양한 AI 코딩 도구가 있습니다. 이 과정에서는 Claude Code를 중심으로 배우지만, 원리는 모두 같습니다. 한 도구에 익숙해지면 다른 도구로 전환하는 것도 어렵지 않습니다.",
      },
    ],
  },
  "3-6": {
    id: "3-6",
    phase: "3과",
    datePublished: "2026-04-02",
    title: "Vercel로 세상에 공개하기",
    summary: "만든 웹사이트를 Vercel에 배포하고 도메인을 설정하는 방법을 배웁니다",
    prev: "3-5",
    next: "4-1",
    sections: [
      {
        heading: "배포란 무엇인가요?",
        content:
          "내 컴퓨터에서만 보이는 웹사이트는 아직 완성이 아닙니다. 인터넷 어디서든 접속할 수 있게 서버에 올리는 과정을 '배포(Deploy)'라고 합니다.\n\n예전에는 서버를 직접 임대하고 설정하는 복잡한 과정이 필요했습니다. 지금은 Vercel, Netlify, GitHub Pages 같은 서비스 덕분에 클릭 몇 번으로 전 세계에 공개할 수 있습니다.\n\nVercel은 Next.js를 만든 회사가 운영하는 배포 플랫폼입니다. 개인 프로젝트는 무료로 사용할 수 있으며, GitHub 레포지토리와 연결하면 코드를 push할 때마다 자동으로 배포됩니다.",
      },
      {
        heading: "Vercel 배포 단계별 가이드",
        content:
          "GitHub에 코드가 올라가 있다면 Vercel 배포는 5분이면 됩니다.",
        code: "# 방법 1: Vercel 웹사이트에서 (추천)\n\n1. vercel.com 접속 → GitHub로 로그인\n2. 'Add New Project' 클릭\n3. 배포할 GitHub 레포지토리 선택\n4. 기본 설정 그대로 'Deploy' 클릭\n5. 1-2분 기다리면 배포 완료!\n   → yourusername.vercel.app 주소로 접속 가능\n\n# 방법 2: Vercel CLI (터미널에서)\nnpm install -g vercel   # Vercel CLI 설치\nvercel                  # 현재 폴더 배포\nvercel --prod           # 프로덕션 배포",
        tip: "Vercel은 GitHub push 후 약 30초~1분 만에 자동으로 재배포됩니다. 코드를 수정하고 push만 하면 되니, 따로 배포 명령을 칠 필요가 없습니다.",
      },
      {
        heading: "커스텀 도메인 연결하기",
        content:
          "처음 배포하면 `프로젝트명.vercel.app` 주소가 생깁니다. 자신만의 도메인(예: mysite.com)을 연결하려면 도메인을 먼저 구매해야 합니다.\n\n도메인 구매처: 가비아(kr), 네임칩(Namecheap), 클라우드플레어(Cloudflare) 등에서 .com 도메인은 연간 약 1~2만원에 구매할 수 있습니다.\n\n연결 방법: Vercel 프로젝트 → Settings → Domains → 구매한 도메인 입력 → DNS 설정 안내에 따라 도메인 업체에서 설정\n\n설정 후 10분~24시간 내에 커스텀 도메인으로 접속이 가능합니다. 무료 SSL 인증서도 자동으로 적용됩니다.",
      },
    ],
    keyTakeaways: [
      "배포는 내 컴퓨터의 웹사이트를 인터넷 어디서든 접속 가능하게 서버에 올리는 과정입니다.",
      "Vercel은 GitHub와 연동해 push만 하면 자동 배포되는 무료 플랫폼입니다.",
      "커스텀 도메인 연결은 도메인 구매 후 Vercel DNS 설정으로 쉽게 할 수 있습니다.",
    ],
    faq: [
      {
        question: "Vercel 무료 플랜으로 실제 서비스를 운영할 수 있나요?",
        answer:
          "개인 포트폴리오, 소규모 블로그, 업무용 내부 도구 수준에서는 무료 플랜으로 충분합니다. 월 방문자가 많아지거나 팀 협업 기능이 필요해지면 유료 플랜($20/월~)으로 업그레이드하면 됩니다.",
      },
      {
        question: "Vercel 외에 다른 무료 배포 서비스가 있나요?",
        answer:
          "Netlify, GitHub Pages, Cloudflare Pages 등이 있습니다. 정적 웹사이트는 GitHub Pages가 가장 간단합니다. 서버사이드 기능(API 라우트, 데이터베이스)이 필요한 경우 Vercel이나 Netlify가 적합합니다.",
      },
    ],
  },
};
