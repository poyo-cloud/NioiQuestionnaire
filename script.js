const STORAGE_KEYS = {
  draft: "nioi-questionnaire-only-draft-v2",
  history: "nioi-questionnaire-only-history-v2",
};

const FLOW_STAGES = [
  { key: "intro", title: "基本情報", subtitle: "患者情報" },
  { key: "stai", title: "STAI", subtitle: "状態・特性不安" },
  { key: "neo", title: "NEO-FFI", subtitle: "人格特性" },
  { key: "cdrisc", title: "CD-RISC", subtitle: "レジリエンス" },
];

const QUESTIONNAIRES = {
  staiState: {
    id: "staiState",
    title: "STAI-state",
    stage: "stai",
    pageSizes: [20],
    responseMin: 1,
    responseMax: 4,
    instruction:
      "たった今あなたがどう感じているか、最もよくあてはまる番号を選んでください。\nあまり考え込まず、現在の気持ちに一番近いものを選びます。",
    options: [
      { value: 1, label: "全くあてはまらない" },
      { value: 2, label: "いく分あてはまる" },
      { value: 3, label: "かなりよくあてはまる" },
      { value: 4, label: "非常によくあてはまる" },
    ],
    reverseItems: [1, 2, 5, 8, 10, 11, 15, 16, 19, 20],
    items: [
      { id: 1, text: "穏やかな気持ちだ" },
      { id: 2, text: "安心している" },
      { id: 3, text: "緊張している" },
      { id: 4, text: "ストレスを感じている" },
      { id: 5, text: "気楽である" },
      { id: 6, text: "気が動転している" },
      { id: 7, text: "何か良くないことが起こるのではないかと心配している" },
      { id: 8, text: "満足している" },
      { id: 9, text: "おびえている" },
      { id: 10, text: "快適である" },
      { id: 11, text: "自信がある" },
      { id: 12, text: "神経過敏になっている" },
      { id: 13, text: "いらいらしている" },
      { id: 14, text: "ためらっている" },
      { id: 15, text: "くつろいでいる" },
      { id: 16, text: "満ち足りた気分だ" },
      { id: 17, text: "悩みがある" },
      { id: 18, text: "まごついている" },
      { id: 19, text: "安定した気分だ" },
      { id: 20, text: "楽しい気分だ" },
    ],
  },
  staiTrait: {
    id: "staiTrait",
    title: "STAI-trait",
    stage: "stai",
    pageSizes: [20],
    responseMin: 1,
    responseMax: 4,
    instruction:
      "あなたがふだんどう感じているか、最もよくあてはまる番号を選んでください。\nふだんの感じ方に近いものを直感的に選びます。",
    options: [
      { value: 1, label: "ほとんどない" },
      { value: 2, label: "時々ある" },
      { value: 3, label: "かなりよくあてはまる" },
      { value: 4, label: "ほとんどいつも" },
    ],
    reverseItems: [21, 23, 25, 26, 29, 32, 33, 35, 38, 40],
    items: [
      { id: 21, text: "楽しい気分になる" },
      { id: 22, text: "神経質で落ち着かない" },
      { id: 23, text: "自分に満足している" },
      { id: 24, text: "とりのこされたように感じる" },
      { id: 25, text: "気が休まっている" },
      { id: 26, text: "冷静で落ち着いている" },
      { id: 27, text: "困ったことが次々に起こり克服できないと感じる" },
      { id: 28, text: "本当はそうたいしたことではないのに心配しすぎる" },
      { id: 29, text: "幸せだと感じる" },
      { id: 30, text: "いろいろ頭に浮かんできて仕事や勉強が手につかない" },
      { id: 31, text: "自信がない" },
      { id: 32, text: "安心感がある" },
      { id: 33, text: "すぐにものごとを決めることができる" },
      { id: 34, text: "力不足を感じる" },
      { id: 35, text: "心が満ち足りている" },
      { id: 36, text: "つまらないことが頭に浮かび悩まされる" },
      { id: 37, text: "ひどく失望するとそれが頭から離れない" },
      { id: 38, text: "落ちついた人間だ" },
      { id: 39, text: "気になることを考え出すと緊張したり混乱したりする" },
      { id: 40, text: "うれしい気分になる" },
    ],
  },
  neo: {
    id: "neo",
    title: "NEO-FFI",
    stage: "neo",
    pageSizes: [30, 30],
    responseMin: 0,
    responseMax: 4,
    instruction: "質問文を読んで、自分に一番あてはまるものを選んでください。",
    options: [
      { value: 0, label: "全くそうでない" },
      { value: 1, label: "そうでない" },
      { value: 2, label: "どちらでもない" },
      { value: 3, label: "そうだ" },
      { value: 4, label: "非常にそうだ" },
    ],
    factors: {
      N: {
        label: "神経症傾向",
        items: [1, 6, 11, 16, 21, 26, 31, 36, 41, 46, 51, 56],
        reverseItems: [1, 16, 31, 46],
      },
      E: {
        label: "外向性",
        items: [2, 7, 12, 17, 22, 27, 32, 37, 42, 47, 52, 57],
        reverseItems: [12, 27, 42, 57],
      },
      O: {
        label: "開放性",
        items: [3, 8, 13, 18, 23, 28, 33, 38, 43, 48, 53, 58],
        reverseItems: [3, 8, 18, 23, 33, 38, 48],
      },
      A: {
        label: "調和性",
        items: [4, 9, 14, 19, 24, 29, 34, 39, 44, 49, 54, 59],
        reverseItems: [9, 14, 24, 29, 39, 44, 54, 59],
      },
      C: {
        label: "誠実性",
        items: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60],
        reverseItems: [15, 30, 45, 55],
      },
    },
    items: [
      { id: 1, text: "私は心配性ではない。" },
      { id: 2, text: "大勢の人と一緒にいるのが好きだ。" },
      { id: 3, text: "空想にふけって時間を無駄にするのは好きではない。" },
      { id: 4, text: "私は、誰にでも好意を持って接しようとする。" },
      { id: 5, text: "持ち物をきちんとし、きれいにしている。" },
      { id: 6, text: "劣等感を持つことがよくある。" },
      { id: 7, text: "私はすぐに笑う。" },
      { id: 8, text: "いったんうまくいくと思ったら、あくまでもそのやり方を変えない。" },
      { id: 9, text: "家族や同僚とよく口論をする。" },
      { id: 10, text: "時間どおりに物事をやり終えるよう、自分のペース（歩調）を守るのが得意だ。" },
      { id: 11, text: "ストレスが多いと、自分が「めちゃくちゃ」になるように感じることもある。" },
      { id: 12, text: "特にほがらかな人間ではない。" },
      { id: 13, text: "芸術作品や自然の中で見つけたかたちに興味をひかれる。" },
      { id: 14, text: "私のことを自分勝手で、自分のことしか考えていない人間だと思っている人がいる。" },
      { id: 15, text: "几帳面ではない。" },
      { id: 16, text: "さびしくなったり、憂うつになったりすることはめったにない。" },
      { id: 17, text: "人と話すのがとても楽しい。" },
      { id: 18, text: "学生に対しては、いろいろな意見や考え方があることを教えるのではなく、一つの考え方を教えるだけで十分だ。" },
      { id: 19, text: "人と張りあうよりも、協力しあう方が好きだ。" },
      { id: 20, text: "割り当てられた仕事を、すべてきちんとやるよう努めている。" },
      { id: 21, text: "よく緊張したり、神経過敏になったりする。" },
      { id: 22, text: "活気のある所にいるのが好きだ。" },
      { id: 23, text: "詩を読んでも何も感じない。" },
      { id: 24, text: "人の考えを皮肉っぽく疑いの目で見がちだ。" },
      { id: 25, text: "明確な目標を持っており、それに向かって整然としたやり方で取り組んでいる。" },
      { id: 26, text: "自分はまったく価値がないと感じることが時々ある。" },
      { id: 27, text: "何かする場合は、一人でやる方が好きだ。" },
      { id: 28, text: "新しい、珍しい食べ物を試してみることがよくある。" },
      { id: 29, text: "ほうっておけば、たいていの人は私を出し抜こうとするだろう。" },
      { id: 30, text: "身を入れて仕事を始めるまでに、時間がかかる。" },
      { id: 31, text: "恐ろしいとか不安だとか感じることはめったにない。" },
      { id: 32, text: "元気があふれて、じっとしていられない事がよくある。" },
      { id: 33, text: "場所が変わると、気分や気持ちが変わるものだが、私は気分が変わったとは感じない。" },
      { id: 34, text: "私はほとんどの人から好かれている。" },
      { id: 35, text: "自分の目標を達成するようにがんばる。" },
      { id: 36, text: "人の仕打ちによく腹をたてる。" },
      { id: 37, text: "元気で、はつらつとした人間だ。" },
      { id: 38, text: "道徳的な判断は、昔からある基準に基づくべきだ。" },
      { id: 39, text: "私を冷たく計算高いと見ている人がいる。" },
      { id: 40, text: "必ず最後までやり通せる見通しがたってから仕事を引き受ける。" },
      { id: 41, text: "物事がうまく行かないと、がっかりして、あきらめたくなることが始終ある。" },
      { id: 42, text: "楽天家ではない。" },
      { id: 43, text: "詩を読んだり芸術作品を見ていると、ぞくぞくしたり感情の高まりを感じる。" },
      { id: 44, text: "私は現実的で、情では動かない。" },
      { id: 45, text: "人の期待にそったり、約束を守ったりしなければならないのに、時々そうではない。" },
      { id: 46, text: "悲しくなったり、落ち込んだりすることはほとんどない。" },
      { id: 47, text: "私はいつも何かしている。" },
      { id: 48, text: "宇宙の本質や人類が置かれている状態に思いをめぐらすことにはほとんど興味がない。" },
      { id: 49, text: "私はいつも他の人を思いやる人間であろうとしている。" },
      { id: 50, text: "バリバリと仕事をやって、それをやり遂げる。" },
      { id: 51, text: "どうしようもなくて、その問題を誰かに解決してもらいたいと思うことがよくある。" },
      { id: 52, text: "非常に活動的な人間だ。" },
      { id: 53, text: "知的好奇心が強い。" },
      { id: 54, text: "嫌いな人には、そう知らせてやる。" },
      { id: 55, text: "人は私のことを、きちんとした人間とは思っていない。" },
      { id: 56, text: "穴があったら入りたいと思うほど、恥ずかしいことがたまにある。" },
      { id: 57, text: "人の先頭に立つよりも、むしろ我が道を行く方がよい。" },
      { id: 58, text: "抽象的な考え方や理論を楽しむことがよくある。" },
      { id: 59, text: "自分の望むものを手に入れるためなら、人を操ることもためらわない。" },
      { id: 60, text: "やることすべてにおいて、志を高く持ってがんばる。" },
    ],
  },
  cdrisc: {
    id: "cdrisc",
    title: "CD-RISC",
    stage: "cdrisc",
    pageSizes: [25],
    responseMin: 0,
    responseMax: 4,
    instruction:
      "コナー・デビッドソン回復力尺度です。自分にどの程度当てはまるか、近いものを選んでください。",
    options: [
      { value: 0, label: "まったく当てはまらない" },
      { value: 1, label: "ほとんど当てはまらない" },
      { value: 2, label: "ときどき当てはまる" },
      { value: 3, label: "しばしば当てはまる" },
      { value: 4, label: "ほとんど当てはまる" },
    ],
    items: [
      { id: 1, text: "変化に対応できる" },
      { id: 2, text: "親しくて安心できる人間関係" },
      { id: 3, text: "時には、運命や神様が助けてくれる" },
      { id: 4, text: "どんなことにも対応できる" },
      { id: 5, text: "過去の成功が新しい挑戦への自信を与える" },
      { id: 6, text: "ユーモアを大切にする" },
      { id: 7, text: "ストレスに対処することで強くなれる" },
      { id: 8, text: "病気や困難な体験の後にも元気を取り戻すほうだ" },
      { id: 9, text: "物事は意味があって起こる" },
      { id: 10, text: "結果がなんであれ最善をつくす" },
      { id: 11, text: "目標に到達することができる" },
      { id: 12, text: "絶望的に思えても、あきらめない" },
      { id: 13, text: "どこに助けを求めればよいか知っている" },
      { id: 14, text: "プレッシャーがかかっていても、集中し考える" },
      { id: 15, text: "問題解決は率先して行う" },
      { id: 16, text: "失敗に簡単にはくじけない" },
      { id: 17, text: "強い人間だと思う" },
      { id: 18, text: "嫌がられる、または、厳しい決断をすることができる" },
      { id: 19, text: "不快な感情にも対応できる" },
      { id: 20, text: "直観に頼る" },
      { id: 21, text: "目的意識が強い" },
      { id: 22, text: "自分の人生をコントロールしている" },
      { id: 23, text: "挑戦が好き" },
      { id: 24, text: "努力して目標を達成する" },
      { id: 25, text: "成し遂げたことに誇りを持つ" },
    ],
  },
};

const refs = {
  statusSummary: document.getElementById("statusSummary"),
  flowStrip: document.getElementById("flowStrip"),
  viewPanel: document.getElementById("viewPanel"),
  historyCount: document.getElementById("historyCount"),
  historyList: document.getElementById("historyList"),
  exportAllButton: document.getElementById("exportAllButton"),
  resetDraftButton: document.getElementById("resetDraftButton"),
  clearHistoryButton: document.getElementById("clearHistoryButton"),
};

let state = normalizeState(loadDraft());
let historyEntries = loadHistory();

bindEvents();
render();

function buildScreens() {
  const screens = [
    {
      id: "intro",
      type: "intro",
      stage: "intro",
      title: "参加者情報",
      subtitle: "患者情報を入力してスタートします。",
    },
  ];

  addChoiceScreens(screens, QUESTIONNAIRES.staiState);
  addChoiceScreens(screens, QUESTIONNAIRES.staiTrait);
  addChoiceScreens(screens, QUESTIONNAIRES.neo);
  addChoiceScreens(screens, QUESTIONNAIRES.cdrisc);
  return screens;
}

function addChoiceScreens(screens, questionnaire) {
  let offset = 0;

  questionnaire.pageSizes.forEach((pageSize, pageIndex) => {
    const items = questionnaire.items.slice(offset, offset + pageSize);
    offset += pageSize;
    screens.push({
      id: `${questionnaire.id}-${pageIndex + 1}`,
      type: "choice",
      stage: questionnaire.stage,
      questionnaireId: questionnaire.id,
      pageNumber: pageIndex + 1,
      pageCount: questionnaire.pageSizes.length,
      itemIds: items.map((item) => item.id),
      title: questionnaire.title,
    });
  });
}

function getActiveScreens() {
  return buildScreens();
}

function bindEvents() {
  refs.viewPanel.addEventListener("click", handleViewClick);
  refs.viewPanel.addEventListener("input", handleViewInput);
  refs.exportAllButton.addEventListener("click", exportAllHistory);
  refs.resetDraftButton.addEventListener("click", resetDraftWithConfirm);
  refs.clearHistoryButton.addEventListener("click", clearHistoryWithConfirm);
  refs.historyList.addEventListener("click", handleHistoryClick);
}

function createInitialState() {
  return {
    sessionId: createSessionId(),
    currentScreenIndex: 0,
    participantId: "",
    participantName: "",
    sessionDate: todayInputValue(),
    sex: "",
    age: "",
    educationYears: "",
    medicalHistory: "",
    pollenAllergy: "なし",
    olfactoryDisease: "なし",
    answers: {
      staiState: {},
      staiTrait: {},
      neo: {},
      cdrisc: {},
    },
    savedRecordId: "",
  };
}

function normalizeState(candidate) {
  const next = {
    ...createInitialState(),
    ...candidate,
  };

  if (!Number.isInteger(next.currentScreenIndex)) {
    next.currentScreenIndex = 0;
  }

  if (!next.sessionId) {
    next.sessionId = createSessionId();
  }

  if (!next.sessionDate) {
    next.sessionDate = todayInputValue();
  }

  if (!next.pollenAllergy) {
    next.pollenAllergy = "なし";
  }

  if (!next.olfactoryDisease) {
    next.olfactoryDisease = "なし";
  }

  next.currentScreenIndex = clamp(
    next.currentScreenIndex,
    0,
    getActiveScreens().length - 1,
  );

  next.answers = {
    staiState: normalizeAnswerMap(candidate?.answers?.staiState),
    staiTrait: normalizeAnswerMap(candidate?.answers?.staiTrait),
    neo: normalizeAnswerMap(candidate?.answers?.neo),
    cdrisc: normalizeAnswerMap(candidate?.answers?.cdrisc),
  };

  return next;
}

function normalizeAnswerMap(value) {
  if (!value || typeof value !== "object") {
    return {};
  }

  return { ...value };
}

function loadDraft() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.draft);
    return raw ? JSON.parse(raw) : createInitialState();
  } catch (_error) {
    return createInitialState();
  }
}

function persistDraft() {
  localStorage.setItem(STORAGE_KEYS.draft, JSON.stringify(state));
}

function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.history);
    return raw ? JSON.parse(raw) : [];
  } catch (_error) {
    return [];
  }
}

function persistHistory() {
  localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(historyEntries));
}

function render() {
  renderStatus();
  renderCurrentScreen();
  renderHistory();
}

function renderStatus() {
  const currentScreen = getCurrentScreen();
  const currentStage = FLOW_STAGES.find((stage) => stage.key === currentScreen.stage);

  refs.historyCount.textContent = `${historyEntries.length} 件`;
  refs.statusSummary.innerHTML = [
    renderSummaryCard("患者ID", state.participantId || "未入力"),
    renderSummaryCard("現在", currentStage ? currentStage.title : "未開始"),
    renderSummaryCard("回答済み", `${countAnsweredItems()} / ${getTotalQuestionCount()}`),
    renderSummaryCard("検査実施日", formatDateValue(state.sessionDate)),
    renderSummaryCard("保存履歴", `${historyEntries.length} 件`),
  ].join("");

  const currentStageIndex = FLOW_STAGES.findIndex(
    (stage) => stage.key === currentScreen.stage,
  );
  refs.flowStrip.innerHTML = FLOW_STAGES.map((stage, index) => {
    const statusClass =
      index < currentStageIndex ? "done" : index === currentStageIndex ? "current" : "";

    return `
      <div class="flow-chip ${statusClass}">
        <span class="flow-chip-title">${escapeHtml(stage.title)}</span>
        <span class="flow-chip-sub">${escapeHtml(stage.subtitle)}</span>
      </div>
    `;
  }).join("");
}

function renderSummaryCard(label, value) {
  return `
    <div class="summary-card">
      <div class="summary-card-label">${escapeHtml(label)}</div>
      <div class="summary-card-value">${escapeHtml(value)}</div>
    </div>
  `;
}

function renderCurrentScreen() {
  const screen = getCurrentScreen();

  if (screen.type === "intro") {
    refs.viewPanel.innerHTML = renderIntroScreen();
    return;
  }

  if (screen.type === "choice") {
    refs.viewPanel.innerHTML = renderChoiceScreen(screen);
    return;
  }

  refs.viewPanel.innerHTML = "";
}

function renderIntroScreen() {
  return `
    <div class="screen-shell">
      <div class="screen-head">
        <div>
          <p class="eyebrow">Patient Entry</p>
          <h2>参加者情報を入力</h2>
        </div>
        <span class="badge-pill">1 / ${getActiveScreens().length}</span>
      </div>

      <div class="screen-subgrid">
        <label class="field-stack">
          <span class="field-label">患者ID（自由入力）</span>
          <input
            class="text-input"
            type="text"
            maxlength="80"
            data-field="participantId"
            placeholder="例: P-001"
            value="${escapeAttribute(state.participantId)}"
          />
        </label>

        <label class="field-stack">
          <span class="field-label">名前</span>
          <input
            class="text-input"
            type="text"
            maxlength="80"
            data-field="participantName"
            placeholder="必須"
            value="${escapeAttribute(state.participantName)}"
          />
        </label>

        <label class="field-stack">
          <span class="field-label">検査実施日</span>
          <input
            class="text-input"
            type="date"
            data-field="sessionDate"
            value="${escapeAttribute(state.sessionDate)}"
          />
        </label>

        <label class="field-stack">
          <span class="field-label">年齢</span>
          <input
            class="number-input"
            type="number"
            min="0"
            max="120"
            data-field="age"
            placeholder="必須"
            value="${escapeAttribute(state.age)}"
          />
        </label>

        <label class="field-stack">
          <span class="field-label">性別</span>
          <select class="select-input" data-field="sex">
            ${renderSelectOption("", "選択してください", state.sex)}
            ${renderSelectOption("男", "男", state.sex)}
            ${renderSelectOption("女", "女", state.sex)}
          </select>
        </label>

        <label class="field-stack">
          <span class="field-label">教育歴（年単位）</span>
          <input
            class="number-input"
            type="number"
            min="0"
            max="40"
            data-field="educationYears"
            placeholder="必須"
            value="${escapeAttribute(state.educationYears)}"
          />
        </label>

        <label class="field-stack field-span-full">
          <span class="field-label">既往歴（自由入力）</span>
          <textarea
            class="text-area"
            rows="3"
            maxlength="400"
            data-field="medicalHistory"
            placeholder="任意"
          >${escapeHtml(state.medicalHistory)}</textarea>
        </label>

        <label class="field-stack">
          <span class="field-label field-label-equal">花粉症</span>
          <select class="select-input" data-field="pollenAllergy">
            ${renderSelectOption("あり", "あり", state.pollenAllergy)}
            ${renderSelectOption("なし", "なし", state.pollenAllergy)}
          </select>
        </label>

        <label class="field-stack">
          <span class="field-label field-label-equal">脳梗塞、脳腫瘍などの嗅覚障害を呈する疾患</span>
          <select class="select-input" data-field="olfactoryDisease">
            ${renderSelectOption("あり", "あり", state.olfactoryDisease)}
            ${renderSelectOption("なし", "なし", state.olfactoryDisease)}
          </select>
        </label>
      </div>

      <div class="nav-row nav-row-end">
        <button
          class="button-primary"
          type="button"
          data-action="start"
          ${isIntroComplete() ? "" : "disabled"}
        >
          質問票を開始
        </button>
      </div>
    </div>
  `;
}

function renderChoiceScreen(screen) {
  const questionnaire = QUESTIONNAIRES[screen.questionnaireId];
  const items = questionnaire.items.filter((item) => screen.itemIds.includes(item.id));
  const pageBadge = screen.pageCount > 1
    ? `<span class="badge-soft">ページ ${screen.pageNumber} / ${screen.pageCount}</span>`
    : "";

  return `
    <div class="screen-shell">
      <div class="screen-head">
        <div>
          <h2>${escapeHtml(screen.title)}</h2>
          <p class="screen-copy helper-text">${renderMultilineText(questionnaire.instruction)}</p>
        </div>
        <div class="status-tags">
          ${pageBadge}
          <span class="badge-soft">${questionnaire.items.length} 問</span>
        </div>
      </div>

      <p class="section-progress">${escapeHtml(getScreenRangeLabel(items))}</p>

      <div class="question-grid">
        ${items.map((item) => renderChoiceCard(questionnaire, item)).join("")}
      </div>

      <div class="nav-row">
        <button class="button-ghost" type="button" data-action="prev">
          前へ戻る
        </button>
        <button
          class="button-primary"
          type="button"
          data-action="next"
        >
          ${isLastScreen(screen) ? "回答を終了する" : "次へ進む"}
        </button>
      </div>
    </div>
  `;
}

function renderChoiceCard(questionnaire, item) {
  const value = getStoredAnswer(questionnaire.id, item.id);

  return `
    <section class="question-card">
      <h3 class="question-title">
        <span class="question-number">${escapeHtml(String(item.id))}.</span>
        <span>${escapeHtml(item.text)}</span>
      </h3>

      <div class="choice-grid" style="--choice-count: ${questionnaire.options.length}">
        ${questionnaire.options
          .map((option) => {
            const isSelected = value === option.value;
            return `
              <button
                class="choice-button ${isSelected ? "selected" : ""}"
                type="button"
                data-action="answer"
                data-questionnaire="${escapeAttribute(questionnaire.id)}"
                data-item-id="${escapeAttribute(String(item.id))}"
                data-value="${escapeAttribute(String(option.value))}"
              >
                <span class="choice-value">${escapeHtml(String(option.value))}</span>
                ${escapeHtml(option.label)}
              </button>
            `;
          })
          .join("")}
      </div>
    </section>
  `;
}

function renderHistory() {
  if (!historyEntries.length) {
    refs.historyList.innerHTML = `
      <div class="empty-state history-empty">
        まだ保存済みセッションはありません。今回の患者さんを最後まで入力すると、ここからまとめて CSV 出力できます。
      </div>
    `;
    return;
  }

  refs.historyList.innerHTML = historyEntries
    .map((entry) => {
      const scores = entry.scores;
      return `
        <article class="history-item">
          <div class="history-topline">
            <div>
              <div class="history-title">${escapeHtml(entry.participantId || "患者ID未設定")}</div>
              <div class="history-meta">
                ${escapeHtml(formatDateValue(entry.sessionDate))} / 保存 ${escapeHtml(formatDateTime(entry.savedAt))}
              </div>
            </div>
            <div class="history-actions">
              <button class="button-secondary" type="button" data-action="history-export" data-record-id="${escapeAttribute(entry.id)}">
                この回をCSV出力
              </button>
              <button class="button-ghost danger" type="button" data-action="history-delete" data-record-id="${escapeAttribute(entry.id)}">
                削除
              </button>
            </div>
          </div>

          <div class="history-scores">
            ${[
              renderHistoryScoreChip("STAI-state", `${scores.staiState}/80`),
              renderHistoryScoreChip("STAI-trait", `${scores.staiTrait}/80`),
              renderHistoryScoreChip("CD-RISC", `${scores.cdrisc}/100`),
              renderHistoryScoreChip("NEO-N", `${scores.neo.N}/48`),
              renderHistoryScoreChip("NEO-E", `${scores.neo.E}/48`),
              renderHistoryScoreChip("NEO-O", `${scores.neo.O}/48`),
              renderHistoryScoreChip("NEO-A", `${scores.neo.A}/48`),
              renderHistoryScoreChip("NEO-C", `${scores.neo.C}/48`),
            ].join("")}
          </div>
        </article>
      `;
    })
    .join("");
}

function renderHistoryScoreChip(label, value) {
  return `<span class="mini-badge">${escapeHtml(label)} ${escapeHtml(value)}</span>`;
}

function handleViewClick(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) {
    return;
  }

  const action = button.dataset.action;

  if (action === "answer") {
    storeAnswer(
      button.dataset.questionnaire,
      button.dataset.itemId,
      Number(button.dataset.value),
    );
    render();
    return;
  }

  if (action === "start") {
    state.currentScreenIndex = 1;
    state.savedRecordId = "";
    persistDraft();
    render();
    scrollToTop();
    return;
  }

  if (action === "prev") {
    goToPreviousScreen();
    return;
  }

  if (action === "next") {
    goToNextScreen();
    return;
  }
}

function handleViewInput(event) {
  const target = event.target;
  const field = target.dataset.field;
  if (!field) {
    return;
  }

  state[field] = target.value;
  persistDraft();

  renderStatus();

  if (getCurrentScreen().type === "intro") {
    const startButton = refs.viewPanel.querySelector('[data-action="start"]');
    if (startButton) {
      startButton.disabled = !isIntroComplete();
    }
  }
}

function handleHistoryClick(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) {
    return;
  }

  const action = button.dataset.action;
  const recordId = button.dataset.recordId;
  if (!recordId) {
    return;
  }

  if (action === "history-export") {
    const record = findHistoryEntry(recordId);
    if (record) {
      exportRecordsAsExcel(
        [record],
        `Q_${sanitizeFileName(record.participantId || record.id)}.csv`,
      );
    }
    return;
  }

  if (action === "history-delete") {
    const record = findHistoryEntry(recordId);
    if (!record) {
      return;
    }

    const confirmed = window.confirm(
      `「${record.participantId || "この記録"}」を削除しますか？`,
    );
    if (!confirmed) {
      return;
    }

    historyEntries = historyEntries.filter((entry) => entry.id !== recordId);
    persistHistory();

    if (state.savedRecordId === recordId) {
      state.savedRecordId = "";
      persistDraft();
    }

    render();
  }
}

function goToNextScreen() {
  const currentScreen = getCurrentScreen();
  if (currentScreen.type === "choice") {
    const missingItemIds = getMissingItemIds(currentScreen);
    if (missingItemIds.length) {
      showMissingItemsAlert(missingItemIds);
      return;
    }
  } else if (!isCurrentScreenComplete()) {
    return;
  }

  if (isLastScreen(currentScreen)) {
    finishQuestionnaire();
    return;
  }

  state.currentScreenIndex = clamp(
    state.currentScreenIndex + 1,
    0,
    getActiveScreens().length - 1,
  );
  persistDraft();
  render();
  scrollToTop();
}

function goToPreviousScreen() {
  state.currentScreenIndex = clamp(
    state.currentScreenIndex - 1,
    0,
    getActiveScreens().length - 1,
  );
  persistDraft();
  render();
  scrollToTop();
}

function isCurrentScreenComplete() {
  const screen = getCurrentScreen();

  if (screen.type === "intro") {
    return isIntroComplete();
  }

  if (screen.type === "choice") {
    return isChoiceScreenComplete(screen);
  }

  return true;
}

function isIntroComplete() {
  return Boolean(
    state.participantId.trim() &&
      state.participantName.trim() &&
      state.sessionDate &&
      `${state.age}` !== "" &&
      `${state.educationYears}` !== "" &&
      state.sex &&
      state.pollenAllergy &&
      state.olfactoryDisease,
  );
}

function isChoiceScreenComplete(screen) {
  return getMissingItemIds(screen).length === 0;
}

function getMissingItemIds(screen) {
  return screen.itemIds.filter(
    (itemId) => getStoredAnswer(screen.questionnaireId, itemId) == null,
  );
}

function showMissingItemsAlert(itemIds) {
  window.alert(`未回答の設問番号: ${itemIds.join("、")}`);
}

function storeAnswer(questionnaireId, itemId, value) {
  state.answers[questionnaireId][itemId] = value;
  persistDraft();
}

function getStoredAnswer(questionnaireId, itemId) {
  const value = state.answers[questionnaireId]?.[itemId];
  return value == null ? null : Number(value);
}

function getCurrentScreen() {
  return getActiveScreens()[state.currentScreenIndex];
}

function countAnsweredItems() {
  return (
    Object.keys(state.answers.staiState).length +
    Object.keys(state.answers.staiTrait).length +
    Object.keys(state.answers.neo).length +
    Object.keys(state.answers.cdrisc).length
  );
}

function getTotalQuestionCount() {
  return (
    QUESTIONNAIRES.staiState.items.length +
    QUESTIONNAIRES.staiTrait.items.length +
    QUESTIONNAIRES.neo.items.length +
    QUESTIONNAIRES.cdrisc.items.length
  );
}

function getScreenRangeLabel(items) {
  return `設問 ${items[0].id} 〜 ${items[items.length - 1].id}`;
}

function isLastScreen(screen) {
  const screens = getActiveScreens();
  return screens[screens.length - 1]?.id === screen.id;
}

function renderSelectOption(value, label, currentValue) {
  const selected = value === currentValue ? "selected" : "";
  return `<option value="${escapeAttribute(value)}" ${selected}>${escapeHtml(label)}</option>`;
}

function buildScores() {
  return {
    staiState: scoreStai(QUESTIONNAIRES.staiState),
    staiTrait: scoreStai(QUESTIONNAIRES.staiTrait),
    neo: scoreNeo(),
    cdrisc: scoreCdrisc(),
  };
}

function scoreStai(questionnaire) {
  const reverseSet = new Set(questionnaire.reverseItems);
  return questionnaire.items.reduce((total, item) => {
    const raw = getStoredAnswer(questionnaire.id, item.id);
    if (raw == null) {
      return total;
    }

    const scored = reverseSet.has(item.id)
      ? questionnaire.responseMax + questionnaire.responseMin - raw
      : raw;
    return total + scored;
  }, 0);
}

function scoreNeo() {
  const factors = {};

  Object.entries(QUESTIONNAIRES.neo.factors).forEach(([key, config]) => {
    const reverseSet = new Set(config.reverseItems);
    factors[key] = config.items.reduce((total, itemId) => {
      const raw = getStoredAnswer("neo", itemId);
      if (raw == null) {
        return total;
      }

      const scored = reverseSet.has(itemId)
        ? QUESTIONNAIRES.neo.responseMax - raw
        : raw;
      return total + scored;
    }, 0);
  });

  return factors;
}

function scoreCdrisc() {
  return QUESTIONNAIRES.cdrisc.items.reduce((total, item) => {
    const raw = getStoredAnswer("cdrisc", item.id);
    return raw == null ? total : total + raw;
  }, 0);
}

function upsertCurrentRecord() {
  const record = buildRecord();
  historyEntries = [record, ...historyEntries.filter((entry) => entry.id !== record.id)];
  state.savedRecordId = record.id;
  persistDraft();
  persistHistory();
  return record;
}

function finishQuestionnaire() {
  const confirmed = window.confirm("回答を確定しますか？");
  if (!confirmed) {
    return;
  }

  upsertCurrentRecord();
  state = createInitialState();
  persistDraft();
  render();
  scrollToTop();
  window.alert("回答を履歴に保存しました。");
}

function buildRecord() {
  return {
    id: state.savedRecordId || state.sessionId,
    savedAt: new Date().toISOString(),
    participantId: state.participantId.trim(),
    participantName: state.participantName.trim(),
    sessionDate: state.sessionDate,
    sex: state.sex,
    age: state.age,
    educationYears: state.educationYears,
    medicalHistory: state.medicalHistory.trim(),
    pollenAllergy: state.pollenAllergy,
    olfactoryDisease: state.olfactoryDisease,
    answers: JSON.parse(JSON.stringify(state.answers)),
    scores: buildScores(),
  };
}

function exportAllHistory() {
  if (!historyEntries.length) {
    window.alert("保存済み履歴がまだありません。");
    return;
  }

  exportRecordsAsExcel(
    historyEntries,
    `Q_history-${timestampFilePart(new Date().toISOString())}.csv`,
  );
}

function exportRecordsAsExcel(records, filename) {
  const content = `\uFEFF${buildCsv(records)}`;
  downloadTextFile(
    filename,
    content,
    "text/csv;charset=utf-8",
  );
}

function buildCsv(records) {
  const columns = buildExportColumns();
  const rows = [
    columns,
    ...records.map((record) => buildExportRow(record)),
  ];

  return rows
    .map((row) => row.map(csvEscape).join(","))
    .join("\r\n");
}

function buildExportColumns() {
  return [
    "SubjectNo",
    "Name",
    "Pattern",
    "Age",
    "Sex(M/F)",
    "Year of education",
    "StateAnx",
    "TraitAnx",
    "CDR",
    "NEO-FFI_N",
    "NEO-FFI_E",
    "NEO-FFI_O",
    "NEO-FFI_A",
    "NEO-FFI_C",
    ...buildSummaryVasHeaders(),
  ];
}

function buildExportRow(record) {
  const { scores } = record;

  return [
    record.participantId,
    record.participantName,
    "",
    record.age,
    formatSummarySex(record.sex),
    record.educationYears,
    scores.staiState,
    scores.staiTrait,
    scores.cdrisc,
    scores.neo.N,
    scores.neo.E,
    scores.neo.O,
    scores.neo.A,
    scores.neo.C,
    ...buildEmptySummaryVasValues(),
  ];
}

function buildSummaryVasHeaders() {
  return [
    "B_Olf_threshold",
    "B_Olf_favo",
    "B_comfort",
    "B_tiredness",
    "B_concentrate",
    ...Array.from({ length: 7 }, (_item, index) => {
      const prefix = `C${index + 1}`;
      return [
        `${prefix}_Olf_threshold`,
        `${prefix}_Olf_favo`,
        `${prefix}_comfort`,
        `${prefix}_tiredness`,
        `${prefix}_concentrate`,
      ];
    }).flat(),
  ];
}

function buildEmptySummaryVasValues() {
  return Array.from({ length: buildSummaryVasHeaders().length }, () => "");
}

function formatSummarySex(value) {
  if (value === "男") {
    return "M";
  }
  if (value === "女") {
    return "F";
  }
  return value || "";
}

function csvEscape(value) {
  const text = value == null ? "" : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

function findHistoryEntry(recordId) {
  return historyEntries.find((entry) => entry.id === recordId);
}

function resetDraftWithConfirm() {
  const confirmed = window.confirm(
    "現在の下書きを破棄して最初からやり直しますか？ 保存済み履歴は消えません。",
  );
  if (!confirmed) {
    return;
  }

  state = createInitialState();
  localStorage.removeItem(STORAGE_KEYS.draft);
  persistDraft();
  render();
  scrollToTop();
}

function clearHistoryWithConfirm() {
  if (!historyEntries.length) {
    return;
  }

  const confirmed = window.confirm(
    "保存済み履歴をすべて削除しますか？ この操作は元に戻せません。",
  );
  if (!confirmed) {
    return;
  }

  historyEntries = [];
  localStorage.removeItem(STORAGE_KEYS.history);
  if (state.savedRecordId) {
    state.savedRecordId = "";
    persistDraft();
  }
  render();
}

function startNewSessionWithConfirm() {
  const confirmed = window.confirm(
    "新しい参加者の入力を始めますか？ 現在の回答は下書きから消えますが、保存済み履歴は残ります。",
  );
  if (!confirmed) {
    return;
  }

  state = createInitialState();
  persistDraft();
  render();
  scrollToTop();
}

function downloadTextFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "auto" });
}

function createSessionId() {
  return `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function todayInputValue() {
  const date = new Date();
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function timestampFilePart(isoString) {
  const date = new Date(isoString);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${yyyy}${mm}${dd}-${hh}${min}`;
}

function formatDateValue(value) {
  if (!value) {
    return "";
  }

  return value.replaceAll("-", "/");
}

function formatDateTime(isoString) {
  if (!isoString) {
    return "";
  }

  try {
    return new Intl.DateTimeFormat("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(isoString));
  } catch (_error) {
    return isoString;
  }
}

function renderMultilineText(value) {
  return escapeHtml(value).replaceAll("\n", "<br />");
}

function sanitizeFileName(value) {
  return String(value).replace(/[^\p{L}\p{N}_-]+/gu, "-");
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttribute(value) {
  return escapeHtml(value);
}
