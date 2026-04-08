# Legal Node

Legal Node is a lightweight React + Vite app that turns legal fact patterns into a structured relationship map with timeline-based visualization.

Legal Node is designed for quick experimentation:
- Paste legal facts
- Choose an LLM provider and model
- Generate structured JSON
- Review the relationship map by phase

## English

### What It Does

Legal Node takes a legal fact pattern written in natural language and asks an LLM to convert it into a strict structured JSON format. That output is then rendered as a timeline-aware relationship map so you can review:

- who the actors are
- how they are related
- what happened in each phase
- which legal basis or transaction type is associated with each interaction

This makes the app useful for early case review, legal-tech prototyping, internal demos, and structured fact analysis.

### Features

- Provider presets for OpenAI, Gemini, and FactChat Gateway
- Custom base URL and custom model fallback
- Multilingual UI: English, Korean, Chinese, and Japanese
- Korean is the default UI language
- Light and dark mode support
- Phase-based Mermaid relationship map
- Entity shape varies by type
- Entity color varies by id for easier visual tracking
- Expanded map view with zoom controls from 0% to 200%
- Print support for the current relationship map
- JSON preview for the parsed result

### How It Works

1. Enter the legal facts in the input area.
2. Select an LLM provider, endpoint, and model.
3. Provide your API key.
4. The app sends the facts to the selected model and asks for strict JSON only.
5. The returned JSON is validated against the app schema.
6. The result is displayed as:
   - structured JSON
   - a phase-by-phase relationship map
   - an entity summary

### FactChat Notes

- FactChat is configured to use the documented chat-completions endpoint.
- The supported preset models are limited to the working documented model ids:
  - `gemini-3.1-pro-preview`
  - `claude-sonnet-4.6`
  - `gpt-5.2`
- FactChat defaults to Gemini in the preset selection.

### Local development

```bash
npm ci
npm run dev
```

Then open the local Vite URL, usually `http://localhost:5173`.

### Production build

```bash
npm run build
```

The deployable output is generated in `dist/`.

### Notes

- This project is currently a frontend-only app.
- API requests are sent directly from the browser to the configured LLM endpoint.
- For private testing, users can enter their own API key in the UI.
- For public deployment, a server-side proxy is recommended so API keys are not exposed in the client.

## 한국어

### 소개

Legal Node는 법률 사실관계를 구조화된 관계도로 변환하고, 시간 흐름에 따라 시각화하는 가벼운 React + Vite 앱입니다.

빠르게 테스트할 수 있도록 다음 흐름에 맞춰 구성되어 있습니다.
- 사실관계 입력
- LLM 제공자와 모델 선택
- 구조화된 JSON 생성
- 단계별 관계도 확인

### 무엇을 하는 앱인가

Legal Node는 자연어로 작성된 법률 사실관계를 LLM에 보내 strict JSON으로 구조화한 뒤, 이를 시간 흐름이 보이는 관계도로 시각화합니다. 이를 통해 다음을 빠르게 파악할 수 있습니다.

- 누가 등장하는지
- 각 주체가 어떻게 연결되는지
- 단계별로 어떤 사건이 발생했는지
- 각 상호작용에 어떤 법적 근거나 거래 유형이 붙는지

초기 사건 검토, 법률 테크 데모, 내부 도구 실험, 사실관계 구조화 작업에 적합합니다.

### 주요 기능

- OpenAI, Gemini, FactChat Gateway 프리셋 제공
- 사용자 지정 Base URL 및 사용자 지정 모델 입력 지원
- 다국어 UI 지원: 영어, 한국어, 중국어, 일본어
- 기본 UI 언어는 한국어
- 라이트 모드 및 다크 모드 지원
- 단계별 Mermaid 관계도 시각화
- 엔티티 타입에 따라 다른 도형 사용
- 엔티티 id에 따라 다른 색상 적용
- 관계도 확대 보기 및 0%~200% 확대 비율 조절 지원
- 현재 관계도 인쇄 지원
- 파싱 결과 JSON 미리보기 제공

### 동작 방식

1. 사실관계를 입력합니다.
2. LLM 제공자, 엔드포인트, 모델을 선택합니다.
3. API 키를 입력합니다.
4. 앱은 선택한 모델에 사실관계를 보내고 strict JSON만 반환하도록 요청합니다.
5. 반환된 JSON은 앱 스키마에 맞는지 검증됩니다.
6. 결과는 다음 형태로 표시됩니다.
   - 구조화된 JSON
   - 단계별 관계도
   - 등장 주체 요약

### FactChat 관련 메모

- FactChat은 문서 기준 chat completions 엔드포인트를 사용하도록 설정되어 있습니다.
- 프리셋 모델은 실제 동작이 확인된 문서 기준 모델 id만 제공합니다.
  - `gemini-3.1-pro-preview`
  - `claude-sonnet-4.6`
  - `gpt-5.2`
- FactChat 프리셋의 기본 모델은 Gemini입니다.

### 로컬 실행

```bash
npm ci
npm run dev
```

그 후 브라우저에서 Vite 로컬 주소(보통 `http://localhost:5173`)를 열면 됩니다.

### 프로덕션 빌드

```bash
npm run build
```

배포용 산출물은 `dist/` 디렉터리에 생성됩니다.

### 참고 사항

- 현재 프로젝트는 프론트엔드 전용 앱입니다.
- API 요청은 브라우저에서 직접 설정된 LLM 엔드포인트로 전송됩니다.
- 개인 테스트 용도라면 사용자가 UI에서 자신의 API 키를 직접 입력해 사용할 수 있습니다.
- 공개 서비스로 배포할 경우에는 클라이언트에 API 키가 노출되지 않도록 서버 사이드 프록시를 두는 편이 안전합니다.
