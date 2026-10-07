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

### 스토리 기반 헤더 일러스트 2장

기사 자동 생성 시 기본 선택된 옵션으로 헤더 이미지 2장도 생성합니다.
기사 분석 결과에서 주요 장소 전경과 사건의 다른 시점을 구성하고,
어두운 세피아·목판화/에칭·크로스해칭·거친 신문 종이 질감으로 통일합니다.
이미지에는 문자를 넣지 않고 페이지에서 기사 제목과 발행일을 겹쳐 표시합니다.
`gpt-image-1`으로 1536×1024 PNG 두 장을 각각 생성합니다 (quality: low).
API 키 소유자에게 추가 이미지 생성 요금이 발생하며 해당 모델 사용 권한이 필요합니다.

초안 저장 후 이미지 생성이 실패해도 기사는 남습니다. 관리자에서 재시도할 수 있습니다.
두 장 모두 성공한 경우에만 새 이미지 세트를 연결합니다.
관리자 미리보기와 상세페이지에서 6초 자동 전환, 이전/다음, 일시정지 버튼을 제공합니다.
카드는 첫 번째 헤더 이미지를 사용합니다. 원문 자료 이미지 URL은 별도로 유지됩니다.
생성 일러스트에는 기록 사진과 구분하는 표시가 붙습니다.
제목·본문·요약·현대어 풀이·장소 변경 후 저장하면 이미지 연결이 해제되어 재생성이 필요합니다.
새 기사는 헤더 두 장과 음성이 모두 있어야 발행할 수 있습니다.
기존 발행 기사와 기존 사건 상세페이지는 그대로 유지됩니다.
PNG는 `.newsroom.local/`에 저장되며 API 키나 생성 파일은 Git에 올리지 않습니다.

### 기존 라디오 보이스 연결

관리자에서 죽첨정·마리아·손기정·백백교의 기존 MP3를 미리 들을 수 있습니다.
원래 음성을 생성한 서비스와 보이스 이름/ID를 지정하면 해당 보이스로 음성을 생성합니다.
OpenAI는 기본 보이스 이름 또는 이미 등록된 커스텀 `voice_` ID를 지원합니다.
ElevenLabs는 기존 보이스 ID와 별도 API 키를 입력하며 `eleven_multilingual_v2`를 사용합니다.
ElevenLabs 이용 시 네트워크에 `api.elevenlabs.io`를 추가해야 합니다.
API 키는 사용 권한이 있는 키만 입력하며 보이스 설정과 달리 저장하지 않습니다.
보이스 서비스/ID와 OpenAI 톤 지시는 기사에 저장되어 재생성 시 재사용됩니다.
설정 변경 후 저장하면 이전 음성 연결이 해제됩니다.

기존 MP3에는 서비스·보이스 ID 정보가 없어 같은 음색인지 자동 확인할 수 없습니다.
기본 alloy 설정은 기존 목소리와 동일하다고 보증하지 않습니다.
기존 음성과 생성 결과를 비교해 말투·속도·분위기 지시를 조정할 수 있으나,
정확히 같은 음색을 사용하려면 원래 보이스 또는 사용 허가를 받은 등록 보이스 ID가 필요합니다.
이 기능은 MP3를 업로드하여 목소리를 복제하거나 커스텀 보이스를 등록하지 않습니다.
