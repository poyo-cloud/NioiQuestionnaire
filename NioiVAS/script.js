const STORAGE_KEYS = {
  draft: "nioi-vas-draft-v1",
  history: "nioi-vas-history-v1",
  calibration: "nioi-vas-calibration-v1",
};

const FLOW_STAGES = [
  { key: "intro", title: "基本情報", subtitle: "患者情報" },
  { key: "calibration", title: "校正", subtitle: "10cm 調整" },
  { key: "vas", title: "VAS", subtitle: "5 項目" },
  { key: "review", title: "保存", subtitle: "Excel 出力" },
];

const VAS_ITEMS = [
  {
    id: "smell",
    number: 1,
    prompt: "香りをどれくらい感じましたか？",
    leftLabel: "何も感じない",
    rightLabel: "最も感じる",
  },
  {
    id: "preference",
    number: 2,
    prompt: "今の香りはどれくらい好きでしたか？",
    leftLabel: "まったく好きではない",
    rightLabel: "最も好きな香り",
  },
  {
    id: "comfort",
    number: 3,
    prompt: "心地良さはどれくらいですか？",
    leftLabel: "まったく心地よくない",
    rightLabel: "最も心地よい",
  },
  {
    id: "fatigue",
    number: 4,
    prompt: "疲れはどれくらい感じますか？",
    leftLabel: "まったく感じない",
    rightLabel: "最も感じる",
  },
  {
    id: "focus",
    number: 5,
    prompt: "集中できていますか？",
    leftLabel: "まったくできない",
    rightLabel: "最も集中できている",
  },
];

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

const basePixelsPerMm = measureCssPixelsPerMm();
let calibration = loadCalibration();
let state = normalizeState(loadDraft());
let historyEntries = loadHistory();
let vasPointerState = null;

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
    {
      id: "calibration",
      type: "calibration",
      stage: "calibration",
      title: "VAS の 10cm 校正",
      subtitle: "定規に合わせて 10cm を調整します。",
    },
  ];

  VAS_ITEMS.forEach((item, index) => {
    screens.push({
      id: `vas-${item.id}`,
      type: "vas",
      stage: "vas",
      pageNumber: index + 1,
      pageCount: VAS_ITEMS.length,
      itemId: item.id,
      title: `VAS ${index + 1} / ${VAS_ITEMS.length}`,
    });
  });

  screens.push({
    id: "review",
    type: "review",
    stage: "review",
    title: "確認と保存",
    subtitle: "この患者さんの回答を確認して保存します。",
  });

  return screens;
}

function getActiveScreens() {
  return buildScreens();
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
    notes: "",
    calibrationDraftPx: Math.round(
      (calibration?.pixelsPerMm || basePixelsPerMm) * 100,
    ),
    answers: {
      vas: {},
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

  next.currentScreenIndex = clamp(
    next.currentScreenIndex,
    0,
    getActiveScreens().length - 1,
  );

  if (!next.calibrationDraftPx || Number.isNaN(next.calibrationDraftPx)) {
    next.calibrationDraftPx = Math.round(
      (calibration?.pixelsPerMm || basePixelsPerMm) * 100,
    );
  }

  next.answers = {
    vas: normalizeAnswerMap(candidate?.answers?.vas),
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

function loadCalibration() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.calibration);
    if (!raw) {
      return {
        pixelsPerMm: basePixelsPerMm,
        savedAt: "",
      };
    }

    return JSON.parse(raw);
  } catch (_error) {
    return {
      pixelsPerMm: basePixelsPerMm,
      savedAt: "",
    };
  }
}

function persistCalibration() {
  localStorage.setItem(STORAGE_KEYS.calibration, JSON.stringify(calibration));
}

function bindEvents() {
  refs.viewPanel.addEventListener("click", handleViewClick);
  refs.viewPanel.addEventListener("input", handleViewInput);
  refs.viewPanel.addEventListener("pointerdown", handlePointerDown);
  refs.viewPanel.addEventListener("pointermove", handlePointerMove);
  refs.viewPanel.addEventListener("pointerup", handlePointerEnd);
  refs.viewPanel.addEventListener("pointercancel", handlePointerEnd);
  refs.exportAllButton.addEventListener("click", exportAllHistory);
  refs.resetDraftButton.addEventListener("click", resetDraftWithConfirm);
  refs.clearHistoryButton.addEventListener("click", clearHistoryWithConfirm);
  refs.historyList.addEventListener("click", handleHistoryClick);
}

function render() {
  renderStatus();
  renderCurrentScreen();
  renderHistory();
}

function renderStatus() {
  const currentScreen = getCurrentScreen();
  const currentStage = FLOW_STAGES.find((stage) => stage.key === currentScreen.stage);
  const calibrationText = calibration?.savedAt
    ? `校正済み (${formatDateTime(calibration.savedAt)})`
    : "未校正";

  refs.historyCount.textContent = `${historyEntries.length} 件`;
  refs.statusSummary.innerHTML = [
    renderSummaryCard("参加者ID", state.participantId || "未入力"),
    renderSummaryCard("現在", currentStage ? currentStage.title : "未開始"),
    renderSummaryCard("回答済み", `${countAnsweredItems()} / ${VAS_ITEMS.length}`),
    renderSummaryCard("実施日", formatDateValue(state.sessionDate)),
    renderSummaryCard("校正", calibrationText),
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

  if (screen.type === "calibration") {
    refs.viewPanel.innerHTML = renderCalibrationScreen();
    return;
  }

  if (screen.type === "vas") {
    refs.viewPanel.innerHTML = renderVasScreen(screen);
    return;
  }

  refs.viewPanel.innerHTML = renderReviewScreen();
}

function renderIntroScreen() {
  return `
    <div class="screen-shell">
      <div class="screen-head">
        <div>
          <p class="eyebrow">Patient Entry</p>
          <h2>参加者情報を入力</h2>
          <p class="screen-copy helper-text">
            VAS 専用アプリです。参加者IDを入力してから開始します。
          </p>
        </div>
        <span class="badge-pill">1 / ${getActiveScreens().length}</span>
      </div>

      <div class="screen-subgrid">
        <label class="field-stack">
          <span class="field-label">参加者ID / 氏名</span>
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
          <span class="field-label">任意の表示名</span>
          <input
            class="text-input"
            type="text"
            maxlength="80"
            data-field="participantName"
            placeholder="例: 午前セッション"
            value="${escapeAttribute(state.participantName)}"
          />
        </label>

        <label class="field-stack">
          <span class="field-label">実施日</span>
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
            placeholder="任意"
            value="${escapeAttribute(state.age)}"
          />
        </label>

        <label class="field-stack">
          <span class="field-label">性別</span>
          <select class="select-input" data-field="sex">
            ${renderSelectOption("", "未選択", state.sex)}
            ${renderSelectOption("女性", "女性", state.sex)}
            ${renderSelectOption("男性", "男性", state.sex)}
            ${renderSelectOption("その他", "その他", state.sex)}
          </select>
        </label>
      </div>

      <div class="summary-callout">
        <p class="helper-text">
          香り・好み・心地良さ・疲れ・集中の 5 項目を、1 本ずつ 10cm の VAS で入力します。
        </p>
      </div>

      <div class="nav-row nav-row-end">
        <button
          class="button-primary"
          type="button"
          data-action="start"
          ${isIntroComplete() ? "" : "disabled"}
        >
          VAS を開始
        </button>
      </div>
    </div>
  `;
}

function renderCalibrationScreen() {
  const savedAtText = calibration?.savedAt
    ? `前回の校正: ${formatDateTime(calibration.savedAt)}`
    : "まだ校正されていません。";

  return `
    <div class="screen-shell">
      <div class="screen-head">
        <div>
          <p class="eyebrow">VAS Calibration</p>
          <h2>10cm に合わせる</h2>
          <p class="screen-copy helper-text">
            お手元の定規と見比べながら、下の青い線がちょうど 10cm になるよう調整してください。保存した長さで VAS を表示します。
          </p>
        </div>
        <span class="badge-soft">${escapeHtml(savedAtText)}</span>
      </div>

      <div class="calibration-card">
        <div class="calibration-bar-wrap">
          <div class="calibration-bar-shell">
            <div
              class="calibration-bar"
              style="width: ${state.calibrationDraftPx}px"
            >
              ${renderCalibrationTicks(state.calibrationDraftPx)}
              <div class="calibration-marker" style="left: calc(100% - 16px)"></div>
            </div>
            <div class="calibration-readout">この線が 10cm になるよう合わせます。</div>
          </div>
        </div>

        <label class="field-stack">
          <span class="field-label">長さを微調整</span>
          <input
            class="text-input"
            type="range"
            min="${Math.round(basePixelsPerMm * 80)}"
            max="${Math.round(basePixelsPerMm * 130)}"
            step="1"
            data-field="calibrationDraftPx"
            value="${escapeAttribute(String(state.calibrationDraftPx))}"
          />
        </label>

        <div class="calibration-button-row">
          <button class="mini-button" type="button" data-action="calibrate-adjust" data-delta="-8">短く</button>
          <button class="mini-button" type="button" data-action="calibrate-adjust" data-delta="-2">少し短く</button>
          <button class="mini-button" type="button" data-action="calibrate-adjust" data-delta="2">少し長く</button>
          <button class="mini-button" type="button" data-action="calibrate-adjust" data-delta="8">長く</button>
          <button class="mini-button" type="button" data-action="calibrate-reset">初期値に戻す</button>
        </div>

        <p class="field-note">
          校正値はこの iPad のブラウザに保存されます。必要な時だけ再調整してください。
        </p>
      </div>

      <div class="nav-row">
        <button class="button-ghost" type="button" data-action="prev">
          前へ戻る
        </button>
        <button class="button-primary" type="button" data-action="save-calibration">
          校正を保存して次へ
        </button>
      </div>
    </div>
  `;
}

function renderCalibrationTicks(widthPx) {
  return Array.from({ length: 11 }, (_item, index) => {
    const left = (widthPx / 10) * index;
    return `<span class="calibration-tick" style="left: ${left}px"></span>`;
  }).join("");
}

function renderVasScreen(screen) {
  const item = VAS_ITEMS.find((entry) => entry.id === screen.itemId);
  const value = getStoredAnswer(item.id);
  const widthPx = getVasTrackWidthPx();
  const labelOffsetPx = 84;
  const markerLeft = value == null ? 0 : value;
  const opacity = value == null ? 0 : 1;

  return `
    <div class="screen-shell">
      <div class="screen-head">
        <div>
          <p class="eyebrow">VAS</p>
          <h2>${escapeHtml(item.prompt)}</h2>
          <p class="screen-copy helper-text">
            線上をタップまたはドラッグして位置を決めます。患者さんには数値は表示されません。
          </p>
        </div>
        <div class="status-tags">
          <span class="badge-soft">${screen.pageNumber} / ${screen.pageCount}</span>
          <span class="badge-soft">校正済み 10cm</span>
        </div>
      </div>

      <div class="vas-card">
        <div class="vas-track-wrap">
          <div
            class="vas-track-shell"
            style="--vas-width: ${widthPx}px; --vas-label-offset: ${labelOffsetPx}px"
          >
            <div class="vas-track" data-item-id="${escapeAttribute(item.id)}">
              ${renderVasTicks(widthPx)}
              <div
                class="vas-marker"
                data-vas-marker="${escapeAttribute(item.id)}"
                style="left: ${markerLeft}%; opacity: ${opacity}"
              ></div>
            </div>
            <div class="vas-readout" data-vas-readout="${escapeAttribute(item.id)}">
              ${value == null ? "まだ位置が選ばれていません。" : "位置を選択しました。"}
            </div>
            <div class="vas-label-row">
              <span>${escapeHtml(item.leftLabel)}</span>
              <span>${escapeHtml(item.rightLabel)}</span>
            </div>
          </div>
        </div>

        <button class="button-ghost vas-clear" type="button" data-action="clear-vas" data-item-id="${escapeAttribute(item.id)}">
          この線をクリア
        </button>
      </div>

      <div class="nav-row">
        <button class="button-ghost" type="button" data-action="prev">
          前へ戻る
        </button>
        <button
          class="button-primary"
          type="button"
          data-action="next"
          ${value == null ? "disabled" : ""}
        >
          次へ進む
        </button>
      </div>
    </div>
  `;
}

function renderVasTicks(widthPx) {
  return Array.from({ length: 11 }, (_item, index) => {
    const left = (widthPx / 10) * index;
    return `<span class="vas-tick" style="left: ${left}px"></span>`;
  }).join("");
}

function renderReviewScreen() {
  const currentRecordSaved = Boolean(findHistoryEntry(state.savedRecordId));

  return `
    <div class="screen-shell">
      <div class="screen-head">
        <div>
          <p class="eyebrow">Review</p>
          <h2>確認して保存</h2>
          <p class="screen-copy helper-text">
            今回の VAS を履歴に保存し、Excel 互換ファイルをダウンロードできます。
          </p>
        </div>
        <span class="badge-pill">${currentRecordSaved ? "保存済み" : "未保存"}</span>
      </div>

      <div class="summary-callout">
        <div class="result-grid">
          <div class="result-card">
            <div class="result-card-label">参加者ID</div>
            <div class="result-card-value">${escapeHtml(state.participantId || "未入力")}</div>
          </div>
          ${VAS_ITEMS.map((item) => {
            const value = getStoredAnswer(item.id);
            return `
              <div class="result-card">
                <div class="result-card-label">VAS ${item.number}</div>
                <div class="result-card-value">${value == null ? "未回答" : "回答済み"}</div>
              </div>
            `;
          }).join("")}
        </div>

        <label class="field-stack">
          <span class="field-label">メモ（任意）</span>
          <textarea
            class="text-area"
            rows="3"
            maxlength="400"
            data-field="notes"
            placeholder="例: 途中で休憩あり、患者の反応メモ など"
          >${escapeHtml(state.notes)}</textarea>
        </label>
      </div>

      <div class="nav-row">
        <button class="button-ghost" type="button" data-action="prev">
          回答を修正する
        </button>
        <div class="history-actions">
          <button class="button-secondary" type="button" data-action="save-current">
            今回を履歴に保存
          </button>
          <button class="button-primary" type="button" data-action="export-current">
            今回を保存してExcel出力
          </button>
          <button class="button-ghost" type="button" data-action="new-session">
            新しい参加者を開始
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderHistory() {
  if (!historyEntries.length) {
    refs.historyList.innerHTML = `
      <div class="empty-state history-empty">
        まだ保存済みセッションはありません。今回の VAS を最後まで入力すると、ここからまとめて Excel 出力できます。
      </div>
    `;
    return;
  }

  refs.historyList.innerHTML = historyEntries
    .map((entry) => {
      const scoreMarkup = VAS_ITEMS.map((item) => {
        const value = entry.answers.vas[item.id];
        return renderHistoryScoreChip(
          `VAS${item.number}`,
          value == null ? "未回答" : "回答済み",
        );
      }).join("");

      return `
        <article class="history-item">
          <div class="history-topline">
            <div>
              <div class="history-title">${escapeHtml(entry.participantId || "参加者ID未設定")}</div>
              <div class="history-meta">
                ${escapeHtml(formatDateValue(entry.sessionDate))} / 保存 ${escapeHtml(formatDateTime(entry.savedAt))}
              </div>
            </div>
            <div class="history-actions">
              <button class="button-secondary" type="button" data-action="history-export" data-record-id="${escapeAttribute(entry.id)}">
                この回をExcel出力
              </button>
              <button class="button-ghost danger" type="button" data-action="history-delete" data-record-id="${escapeAttribute(entry.id)}">
                削除
              </button>
            </div>
          </div>

          <div class="history-scores">
            ${scoreMarkup}
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

  if (action === "calibrate-adjust") {
    const delta = Number(button.dataset.delta);
    state.calibrationDraftPx = clamp(
      state.calibrationDraftPx + delta,
      Math.round(basePixelsPerMm * 80),
      Math.round(basePixelsPerMm * 130),
    );
    persistDraft();
    render();
    return;
  }

  if (action === "calibrate-reset") {
    state.calibrationDraftPx = Math.round(basePixelsPerMm * 100);
    persistDraft();
    render();
    return;
  }

  if (action === "save-calibration") {
    calibration = {
      pixelsPerMm: state.calibrationDraftPx / 100,
      savedAt: new Date().toISOString(),
    };
    persistCalibration();
    persistDraft();
    goToNextScreen();
    return;
  }

  if (action === "clear-vas") {
    delete state.answers.vas[button.dataset.itemId];
    persistDraft();
    render();
    return;
  }

  if (action === "save-current") {
    upsertCurrentRecord();
    render();
    return;
  }

  if (action === "export-current") {
    const record = upsertCurrentRecord();
    exportRecordsAsExcel(
      [record],
      `nioi-vas-${sanitizeFileName(record.participantId || record.id)}`,
    );
    render();
    return;
  }

  if (action === "new-session") {
    startNewSessionWithConfirm();
  }
}

function handleViewInput(event) {
  const target = event.target;
  const field = target.dataset.field;
  if (!field) {
    return;
  }

  if (field === "calibrationDraftPx") {
    state.calibrationDraftPx = Number(target.value);
    persistDraft();
    render();
    return;
  }

  state[field] = target.value;
  persistDraft();

  if (field === "notes" && state.savedRecordId) {
    upsertCurrentRecord();
  }

  renderStatus();

  if (getCurrentScreen().type === "intro") {
    const startButton = refs.viewPanel.querySelector('[data-action="start"]');
    if (startButton) {
      startButton.disabled = !isIntroComplete();
    }
  }
}

function handlePointerDown(event) {
  const track = event.target.closest(".vas-track");
  if (!track) {
    return;
  }

  event.preventDefault();
  vasPointerState = {
    pointerId: event.pointerId,
    track,
  };

  if (track.setPointerCapture) {
    track.setPointerCapture(event.pointerId);
  }

  updateVasAnswerFromPointer(track, event);
}

function handlePointerMove(event) {
  if (!vasPointerState || vasPointerState.pointerId !== event.pointerId) {
    return;
  }

  updateVasAnswerFromPointer(vasPointerState.track, event, false);
}

function handlePointerEnd(event) {
  if (!vasPointerState || vasPointerState.pointerId !== event.pointerId) {
    return;
  }

  updateVasAnswerFromPointer(vasPointerState.track, event);
  if (vasPointerState.track.releasePointerCapture) {
    vasPointerState.track.releasePointerCapture(event.pointerId);
  }
  vasPointerState = null;
}

function updateVasAnswerFromPointer(track, event, persist = true) {
  const rect = track.getBoundingClientRect();
  const ratio = clamp((event.clientX - rect.left) / rect.width, 0, 1);
  const value = Number((ratio * 100).toFixed(1));
  const itemId = track.dataset.itemId;

  state.answers.vas[itemId] = value;
  updateVasMarker(track, value);

  if (persist) {
    persistDraft();
    renderStatus();
  }

  const nextButton = refs.viewPanel.querySelector('[data-action="next"]');
  if (nextButton) {
    nextButton.disabled = false;
  }
}

function updateVasMarker(track, value) {
  const marker = track.querySelector(".vas-marker");
  const readout = refs.viewPanel.querySelector(
    `[data-vas-readout="${track.dataset.itemId}"]`,
  );

  if (marker) {
    marker.style.left = `${value}%`;
    marker.style.opacity = "1";
  }

  if (readout) {
    readout.textContent = "位置を選択しました。";
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
        `nioi-vas-${sanitizeFileName(record.participantId || record.id)}`,
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
  if (!isCurrentScreenComplete()) {
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

  if (screen.type === "vas") {
    return getStoredAnswer(screen.itemId) != null;
  }

  return true;
}

function isIntroComplete() {
  return Boolean(state.participantId.trim());
}

function getStoredAnswer(itemId) {
  const value = state.answers.vas[itemId];
  return value == null ? null : Number(value);
}

function getCurrentScreen() {
  return getActiveScreens()[state.currentScreenIndex];
}

function countAnsweredItems() {
  return Object.keys(state.answers.vas).length;
}

function buildScores() {
  const values = {};
  VAS_ITEMS.forEach((item) => {
    values[item.id] = getStoredAnswer(item.id);
  });
  return values;
}

function upsertCurrentRecord() {
  const record = buildRecord();
  historyEntries = [record, ...historyEntries.filter((entry) => entry.id !== record.id)];
  state.savedRecordId = record.id;
  persistDraft();
  persistHistory();
  return record;
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
    notes: state.notes.trim(),
    calibrationPixelsPerMm: calibration?.pixelsPerMm || basePixelsPerMm,
    answers: JSON.parse(JSON.stringify(state.answers)),
    scores: {
      vas: buildScores(),
    },
  };
}

function exportAllHistory() {
  if (!historyEntries.length) {
    window.alert("保存済み履歴がまだありません。");
    return;
  }

  exportRecordsAsExcel(historyEntries, "nioi-vas-history");
}

function exportRecordsAsExcel(records, filenameStem) {
  const content = buildExcelHtml(records);
  downloadTextFile(
    `${filenameStem}-${timestampFilePart(new Date().toISOString())}.xls`,
    content,
    "application/vnd.ms-excel;charset=utf-8",
  );
}

function buildExcelHtml(records) {
  const summaryRows = records
    .map((record) => [
      record.id,
      record.participantId,
      record.participantName,
      formatDateValue(record.sessionDate),
      record.sex,
      record.age,
      formatDateTime(record.savedAt),
      record.notes,
      record.calibrationPixelsPerMm,
      record.scores.vas.smell,
      record.scores.vas.preference,
      record.scores.vas.comfort,
      record.scores.vas.fatigue,
      record.scores.vas.focus,
    ])
    .map((columns) => renderTableRow(columns))
    .join("");

  const responseRows = records
    .flatMap((record) => flattenResponseRows(record))
    .map((columns) => renderTableRow(columns))
    .join("");

  return `<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <style>
      body { font-family: "Yu Gothic", "Hiragino Sans", sans-serif; color: #222; }
      h1, h2 { margin: 0 0 8px; }
      p { margin: 0 0 12px; color: #555; }
      table { border-collapse: collapse; margin-bottom: 28px; width: 100%; }
      th, td { border: 1px solid #b8c2cc; padding: 6px 8px; font-size: 12px; vertical-align: top; }
      th { background: #eef5f7; text-align: left; }
      .section-title { margin-top: 24px; }
    </style>
  </head>
  <body>
    <h1>匂い研究 VAS エクスポート</h1>
    <p>生成日時: ${escapeHtml(formatDateTime(new Date().toISOString()))}</p>
    <h2 class="section-title">概要集計</h2>
    <table>
      <thead>
        <tr>
          ${[
            "record_id",
            "participant_id",
            "participant_name",
            "session_date",
            "sex",
            "age",
            "saved_at",
            "notes",
            "calibration_pixels_per_mm",
            "vas_smell_mm",
            "vas_preference_mm",
            "vas_comfort_mm",
            "vas_fatigue_mm",
            "vas_focus_mm",
          ]
            .map((label) => `<th>${escapeHtml(label)}</th>`)
            .join("")}
        </tr>
      </thead>
      <tbody>${summaryRows}</tbody>
    </table>
    <h2 class="section-title">設問ごとの生データ</h2>
    <table>
      <thead>
        <tr>
          ${[
            "record_id",
            "participant_id",
            "instrument",
            "item_no",
            "prompt",
            "left_label",
            "right_label",
            "raw_value_mm",
          ]
            .map((label) => `<th>${escapeHtml(label)}</th>`)
            .join("")}
        </tr>
      </thead>
      <tbody>${responseRows}</tbody>
    </table>
  </body>
</html>`;
}

function renderTableRow(columns) {
  return `<tr>${columns
    .map((column) => `<td>${escapeHtml(column == null ? "" : String(column))}</td>`)
    .join("")}</tr>`;
}

function flattenResponseRows(record) {
  return VAS_ITEMS.map((item) => [
    record.id,
    record.participantId,
    "VAS",
    item.number,
    item.prompt,
    item.leftLabel,
    item.rightLabel,
    record.answers.vas[item.id],
  ]);
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

function measureCssPixelsPerMm() {
  const probe = document.createElement("div");
  probe.style.position = "absolute";
  probe.style.left = "-9999px";
  probe.style.top = "-9999px";
  probe.style.width = "100mm";
  probe.style.height = "1px";
  document.body.appendChild(probe);
  const pixels = probe.getBoundingClientRect().width / 100;
  probe.remove();
  return pixels || 3.78;
}

function getVasTrackWidthPx() {
  const pixelsPerMm = calibration?.pixelsPerMm || basePixelsPerMm;
  return Math.round(pixelsPerMm * 100);
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

function renderSelectOption(value, label, currentValue) {
  const selected = value === currentValue ? "selected" : "";
  return `<option value="${escapeAttribute(value)}" ${selected}>${escapeHtml(label)}</option>`;
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
