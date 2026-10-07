# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

## 경성신문 기사 자동화 (로컬 개발용)

Node 24 환경에서 `npm ci` 후 `npm run newsroom`을 실행합니다.
기존 `npm run dev`는 정적 프런트엔드만 실행하며 자동화 API는 제공하지 않습니다.
자동화 서버는 루프백 인터페이스의 5174 포트에서 Vite와 API를 함께 제공합니다.

- `/admin`: 원문·발행일·신문명 입력, 분석/카드/대본 생성, 편집, 한국어 MP3 생성, 검토 후 발행
- `/news`: 발행된 기사 카드 목록
- `/articles/:id`: 원문·현대어 풀이·분석·대본·음성 상세페이지 (초안은 미리보기)

API 키 입력란에는 본인 또는 사용 허락을 받은 다른 사람의 **OpenAI API 키**를 입력합니다.
키 소유자의 사용량에 과금됩니다. 키는 화면의 메모리에만 보관하며 새로고침 시 지워집니다.
서버는 키를 파일이나 로그에 저장하지 않고 `api.openai.com`으로만 전달합니다.
기사 생성에는 `gpt-4o-mini`, 한국어 음성에는 `gpt-4o-mini-tts`를 사용합니다.
네트워크 정책에서 `api.openai.com` HTTPS 접근이 필요합니다.

생성된 자료는 `.newsroom.local/` 아래 JSON/MP3 파일로 저장됩니다 (Git 제외).
본문과 출처는 그대로 유지하고, 분석·요약·대본은 편집할 수 있습니다.
대본 수정 후 저장하면 기존 음성 연결이 해제되므로 음성을 다시 생성해야 합니다.
발행된 기사는 이 버전에서 수정하지 않습니다. 카드 이미지는 자료 이미지 URL을 사용합니다.
페이지의 카드·대본·음성은 같은 기사 ID로 연결됩니다.
AI 분석은 사실 확인을 대신하지 않으므로 불확실한 해석 및 원문을 검토한 후 발행합니다.

이 서버에는 로그인/사용자별 접근 제어가 없습니다. 개발용 루프백 서버이며 인터넷 공개용이 아닙니다.
공개 배포에는 관리자 인증·권한, HTTPS, 영구 저장소 및 백업을 추가해야 합니다.
`npm run test:newsroom`으로 입력 검증과 API 요청 테스트, `npm run build`로 빌드를 검증합니다.
실제 AI 분석·음성 생성에는 유효한 키와 사용 가능한 결제 한도가 필요합니다.
