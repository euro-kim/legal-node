# Legal Node

Legal Node is a lightweight React + Vite app that turns legal fact patterns into a structured relationship map with timeline-based visualization.

Legal Node is designed for quick experimentation:
- Paste legal facts
- Choose an LLM provider and model
- Generate structured JSON
- Review the relationship map by phase

## English

### Features

- Provider presets for OpenAI, Gemini, and FactChat Gateway
- Custom base URL and custom model fallback
- Multilingual UI: English, Korean, Chinese, and Japanese
- Phase-based Mermaid relationship map
- Entity shape varies by type
- Entity color varies by id for easier visual tracking
- JSON preview for the parsed result

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

### 주요 기능

- OpenAI, Gemini, FactChat Gateway 프리셋 제공
- 사용자 지정 Base URL 및 사용자 지정 모델 입력 지원
- 다국어 UI 지원: 영어, 한국어, 중국어, 일본어
- 단계별 Mermaid 관계도 시각화
- 엔티티 타입에 따라 다른 도형 사용
- 엔티티 id에 따라 다른 색상 적용
- 파싱 결과 JSON 미리보기 제공

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
