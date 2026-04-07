export type Language = "en" | "ko" | "zh" | "ja";

export interface Translation {
  appEyebrow: string;
  appTitle: string;
  providerLabel: string;
  customProviderLabel: string;
  apiKeyLabel: string;
  baseUrlLabel: string;
  modelLabel: string;
  customModelLabel: string;
  factsLabel: string;
  factsPlaceholder: string;
  parseButton: string;
  parsingButton: string;
  jsonPreviewTitle: string;
  timeStructureEyebrow: string;
  diagramTitle: string;
  currentPhaseOnly: string;
  cumulativeView: string;
  activePhaseTitle: string;
  participantsTitle: string;
  noPhaseSelected: string;
  emptyState: string;
  renderError: string;
  objectLabel: string;
  legalBasisLabel: string;
  languageLabel: string;
  providerSectionTitle: string;
  appearanceSectionTitle: string;
  customOption: string;
  languageEnglish: string;
  languageKorean: string;
  languageChinese: string;
  languageJapanese: string;
  customBaseUrlPlaceholder: string;
  customModelPlaceholder: string;
  defaultPhaseLabel: string;
  providerHelp: string;
  modelHelp: string;
  themeLabel: string;
  lightMode: string;
  darkMode: string;
  languageSettingsLabel: string;
  sampleFacts: string;
}

export const translations: Record<Language, Translation> = {
  en: {
    appEyebrow: "Legal Fact Parser",
    appTitle: "Legal Relationship Map Builder",
    providerLabel: "LLM provider",
    customProviderLabel: "Custom provider",
    apiKeyLabel: "API key",
    baseUrlLabel: "Base URL",
    modelLabel: "Model",
    customModelLabel: "Custom model",
    factsLabel: "Facts",
    factsPlaceholder: "Enter the facts in chronological order.",
    parseButton: "Structure with LLM",
    parsingButton: "Analyzing...",
    jsonPreviewTitle: "JSON Preview",
    timeStructureEyebrow: "Time Structure",
    diagramTitle: "Phase Relationship Map",
    currentPhaseOnly: "Current phase",
    cumulativeView: "Cumulative",
    activePhaseTitle: "Active phase",
    participantsTitle: "Entities",
    noPhaseSelected: "No phase selected",
    emptyState: "The parsed LLM result will render here.",
    renderError: "Failed to render Mermaid diagram.",
    objectLabel: "Object",
    legalBasisLabel: "Legal basis",
    languageLabel: "Language",
    providerSectionTitle: "Model Setup",
    appearanceSectionTitle: "Diagram View",
    customOption: "Custom",
    languageEnglish: "English",
    languageKorean: "Korean",
    languageChinese: "Chinese",
    languageJapanese: "Japanese",
    customBaseUrlPlaceholder: "Enter the full chat completions endpoint",
    customModelPlaceholder: "Enter the exact model id",
    defaultPhaseLabel: "Phase",
    providerHelp: "Pick a preset provider or enter a custom endpoint.",
    modelHelp: "Choose a preset model or type the exact model id.",
    themeLabel: "Theme",
    lightMode: "Light",
    darkMode: "Dark",
    languageSettingsLabel: "Language",
    sampleFacts:
      "On March 1, 2024, A lent KRW 100 million to B as business funds.\nOn the same day, B gave A a promissory note promising repayment by June 30, 2024.\nLater, on March 20, 2024, B gifted KRW 50 million from that money to B's sibling C.\nOn July 5, 2024, after B failed to repay, A began reviewing whether an action to revoke a fraudulent transfer against C was possible."
  },
  ko: {
    appEyebrow: "Legal Fact Parser",
    appTitle: "법적 관계도 생성기",
    providerLabel: "LLM 제공자",
    customProviderLabel: "사용자 지정 제공자",
    apiKeyLabel: "API_KEY",
    baseUrlLabel: "BASE_URL",
    modelLabel: "MODEL",
    customModelLabel: "사용자 지정 모델",
    factsLabel: "사실관계 입력",
    factsPlaceholder: "사실관계를 시간 순서가 드러나도록 입력하세요.",
    parseButton: "LLM으로 구조화",
    parsingButton: "분석 중...",
    jsonPreviewTitle: "JSON 미리보기",
    timeStructureEyebrow: "Time Structure",
    diagramTitle: "단계별 관계도",
    currentPhaseOnly: "현재 단계만",
    cumulativeView: "누적 보기",
    activePhaseTitle: "활성 단계",
    participantsTitle: "등장 주체",
    noPhaseSelected: "선택된 단계 없음",
    emptyState: "LLM 파싱 결과가 여기에 렌더링됩니다.",
    renderError: "Mermaid 렌더링에 실패했습니다.",
    objectLabel: "목적물",
    legalBasisLabel: "법적근거",
    languageLabel: "언어",
    providerSectionTitle: "모델 설정",
    appearanceSectionTitle: "관계도 보기",
    customOption: "직접 입력",
    languageEnglish: "영어",
    languageKorean: "한국어",
    languageChinese: "중국어",
    languageJapanese: "일본어",
    customBaseUrlPlaceholder: "전체 chat completions 엔드포인트를 입력하세요",
    customModelPlaceholder: "정확한 모델 id를 입력하세요",
    defaultPhaseLabel: "단계",
    providerHelp: "프리셋 제공자를 선택하거나 사용자 지정 엔드포인트를 입력하세요.",
    modelHelp: "프리셋 모델을 선택하거나 정확한 모델 id를 입력하세요.",
    themeLabel: "테마",
    lightMode: "라이트",
    darkMode: "다크",
    languageSettingsLabel: "언어",
    sampleFacts:
      "2024년 3월 1일 A는 B에게 사업자금 명목으로 1억 원을 빌려주었다.\n같은 날 B는 A에게 2024년 6월 30일까지 변제하겠다는 차용증을 작성해 주었다.\n이후 2024년 3월 20일 B는 위 금원 중 5천만 원을 자신의 동생 C에게 증여하였다.\n2024년 7월 5일 B가 변제를 하지 않자, A는 C를 상대로 사해행위 취소 가능성을 검토하게 되었다."
  },
  zh: {
    appEyebrow: "Legal Fact Parser",
    appTitle: "法律关系图生成器",
    providerLabel: "LLM 提供方",
    customProviderLabel: "自定义提供方",
    apiKeyLabel: "API Key",
    baseUrlLabel: "Base URL",
    modelLabel: "模型",
    customModelLabel: "自定义模型",
    factsLabel: "事实输入",
    factsPlaceholder: "请按时间顺序输入案件事实。",
    parseButton: "用 LLM 结构化",
    parsingButton: "分析中...",
    jsonPreviewTitle: "JSON 预览",
    timeStructureEyebrow: "Time Structure",
    diagramTitle: "分阶段关系图",
    currentPhaseOnly: "仅当前阶段",
    cumulativeView: "累计查看",
    activePhaseTitle: "当前阶段",
    participantsTitle: "主体",
    noPhaseSelected: "未选择阶段",
    emptyState: "LLM 解析结果会显示在这里。",
    renderError: "Mermaid 渲染失败。",
    objectLabel: "标的",
    legalBasisLabel: "法律依据",
    languageLabel: "语言",
    providerSectionTitle: "模型设置",
    appearanceSectionTitle: "关系图视图",
    customOption: "自定义",
    languageEnglish: "英语",
    languageKorean: "韩语",
    languageChinese: "中文",
    languageJapanese: "日语",
    customBaseUrlPlaceholder: "请输入完整的 chat completions 端点",
    customModelPlaceholder: "请输入准确的模型 id",
    defaultPhaseLabel: "阶段",
    providerHelp: "可选择预设提供方，或输入自定义端点。",
    modelHelp: "可选择预设模型，或输入准确的模型 id。",
    themeLabel: "主题",
    lightMode: "浅色",
    darkMode: "深色",
    languageSettingsLabel: "语言",
    sampleFacts:
      "2024年3月1日，A以经营资金名义借给B一亿韩元。\n同日，B向A出具借据，承诺于2024年6月30日前偿还。\n此后在2024年3月20日，B将其中五千万韩元赠与其弟弟C。\n2024年7月5日，B未按期偿还，A开始审查是否可以对C提起撤销诈害行为之诉。"
  },
  ja: {
    appEyebrow: "Legal Fact Parser",
    appTitle: "法律関係図ジェネレーター",
    providerLabel: "LLM プロバイダー",
    customProviderLabel: "カスタムプロバイダー",
    apiKeyLabel: "API Key",
    baseUrlLabel: "Base URL",
    modelLabel: "モデル",
    customModelLabel: "カスタムモデル",
    factsLabel: "事実関係",
    factsPlaceholder: "事実関係を時系列で入力してください。",
    parseButton: "LLM で構造化",
    parsingButton: "解析中...",
    jsonPreviewTitle: "JSON プレビュー",
    timeStructureEyebrow: "Time Structure",
    diagramTitle: "段階別関係図",
    currentPhaseOnly: "現在の段階のみ",
    cumulativeView: "累積表示",
    activePhaseTitle: "選択中の段階",
    participantsTitle: "登場主体",
    noPhaseSelected: "選択された段階はありません",
    emptyState: "LLM の解析結果がここに表示されます。",
    renderError: "Mermaid のレンダリングに失敗しました。",
    objectLabel: "対象物",
    legalBasisLabel: "法的根拠",
    languageLabel: "言語",
    providerSectionTitle: "モデル設定",
    appearanceSectionTitle: "関係図表示",
    customOption: "カスタム",
    languageEnglish: "英語",
    languageKorean: "韓国語",
    languageChinese: "中国語",
    languageJapanese: "日本語",
    customBaseUrlPlaceholder: "完全な chat completions エンドポイントを入力してください",
    customModelPlaceholder: "正確なモデル id を入力してください",
    defaultPhaseLabel: "フェーズ",
    providerHelp: "プリセットのプロバイダーを選ぶか、独自エンドポイントを入力してください。",
    modelHelp: "プリセットのモデルを選ぶか、正確なモデル id を入力してください。",
    themeLabel: "テーマ",
    lightMode: "ライト",
    darkMode: "ダーク",
    languageSettingsLabel: "言語",
    sampleFacts:
      "2024年3月1日、Aは事業資金名目でBに1億ウォンを貸し付けた。\n同日、BはAに対し、2024年6月30日までに返済する旨の借用証を書いた。\nその後、2024年3月20日にBはそのうち5千万ウォンを弟Cに贈与した。\n2024年7月5日、Bが返済しなかったため、AはCに対する詐害行為取消しの可能性を検討することになった。"
  }
};

const entityTypeLabels: Record<Language, Record<string, string>> = {
  en: { Person: "Person", Company: "Company", Object: "Property", Organization: "Organization", Other: "Other", RealEstate: "Real Estate" },
  ko: { Person: "자연인", Company: "회사", Object: "재산", Organization: "단체", Other: "기타", RealEstate: "부동산" },
  zh: { Person: "自然人", Company: "公司", Object: "财产", Organization: "组织", Other: "其他", RealEstate: "不动产" },
  ja: { Person: "自然人", Company: "会社", Object: "財産", Organization: "団体", Other: "その他", RealEstate: "不動産" }
};

const legalBasisLabels: Record<Language, Record<string, string>> = {
  en: { Contract: "Contract", Tort: "Tort", Property: "Property", RealEstate: "Real Estate", Loan: "Loan", Gift: "Gift", Trust: "Trust", Employment: "Employment", Corporate: "Corporate", Family: "Family", Inheritance: "Inheritance", FraudulentTransfer: "Fraudulent Transfer" },
  ko: { Contract: "계약", Tort: "불법행위", Property: "물권", RealEstate: "부동산", Loan: "대여금", Gift: "증여", Trust: "신탁", Employment: "고용", Corporate: "회사법", Family: "가사", Inheritance: "상속", FraudulentTransfer: "사해행위" },
  zh: { Contract: "合同", Tort: "侵权", Property: "物权", RealEstate: "不动产", Loan: "借贷", Gift: "赠与", Trust: "信托", Employment: "劳动", Corporate: "公司法", Family: "家事", Inheritance: "继承", FraudulentTransfer: "诈害转让撤销" },
  ja: { Contract: "契約", Tort: "不法行為", Property: "物権", RealEstate: "不動産", Loan: "貸金", Gift: "贈与", Trust: "信託", Employment: "雇用", Corporate: "会社法", Family: "家事", Inheritance: "相続", FraudulentTransfer: "詐害行為" }
};

function humanizeUnknownTerm(value: string) {
  return value.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[_-]/g, " ");
}

export function localizeEntityType(value: string, language: Language) {
  return entityTypeLabels[language][value] ?? humanizeUnknownTerm(value);
}

export function localizeLegalBasis(value: string, language: Language) {
  return legalBasisLabels[language][value] ?? humanizeUnknownTerm(value);
}
