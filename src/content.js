console.log("[Drumgod Modtool] Content script loaded.");

const DGMT_STORAGE_POSITION_KEY = "dmsButtonPosition";
const DGMT_STORAGE_DRAG_KEY = "dmsButtonDraggable";
const DGMT_STORAGE_LOGO_VISIBLE_KEY = "dmsLogoVisible";

const DGMT_MAX_MESSAGES = 250;
const DGMT_POLL_INTERVAL_MS = 1500;
const DGMT_STREAM_INFO_INTERVAL_MS = 5000;

const dgmtState = {
  activeChannel: null,
  isModerator: false,
  isModeratorView: false,
  url: window.location.href,
  messages: [],
  messageIds: new Set(),
  observer: null,
  activeAdapter: null,
  streamInfo: {
    title: "",
    game: "",
    isLive: false,
    streamTogetherUsers: []
  },
  adInfo: {
    isAdRunning: false
  },
  button: null,
  buttonVisible: true,
  dragEnabled: true,
  dragState: {
    active: false,
    offsetX: 0,
    offsetY: 0,
    moved: false
  }
};

function dgmtCleanText(value) {
  return String(value || "")
    .replace(/\u034f/g, "")
    .replace(/\u200b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function dgmtGetChannelFromUrl() {
  const path = window.location.pathname || "";
  const parts = path.split("/").filter(Boolean);

  if (parts[0]?.toLowerCase() === "moderator" && parts[1]) {
    return parts[1].toLowerCase();
  }

  const blockedPaths = [
    "directory",
    "settings",
    "subscriptions",
    "inventory",
    "downloads",
    "jobs",
    "p",
    "turbo",
    "wallet",
    "drops",
    "store"
  ];

  const firstPath = parts[0]?.toLowerCase();

  if (!firstPath || blockedPaths.includes(firstPath)) {
    return null;
  }

  return firstPath;
}

function dgmtIsModeratorView() {
  return window.location.pathname.toLowerCase().startsWith("/moderator/");
}

function dgmtDetectModeratorRights() {
  if (dgmtIsModeratorView()) return true;

  const modSignals = [
    "[data-a-target='mod-view-context-bar-open']",
    ".shield-mode-shortcut__btn",
    ".seventv-mod-logs-button",
    "[aria-label*='Shield Mode']",
    "[aria-label*='Mod View']",
    "[aria-label*='Moderator']",
    "a[href*='/moderator/']"
  ];

  const hasDomSignal = modSignals.some((selector) => {
    try {
      return Boolean(document.querySelector(selector));
    } catch {
      return false;
    }
  });

  if (hasDomSignal) return true;

  const bodyText = document.body?.innerText || "";

  return (
    bodyText.includes("Only visible to Moderators") ||
    bodyText.includes("Shield Mode") ||
    bodyText.includes("Mod Actions") ||
    bodyText.includes("Moderator Actions")
  );
}

function dgmtUpdatePageContext() {
  dgmtState.url = window.location.href;
  dgmtState.activeChannel = dgmtGetChannelFromUrl();
  dgmtState.isModeratorView = dgmtIsModeratorView();
  dgmtState.isModerator = dgmtDetectModeratorRights();

  dgmtBroadcastActiveChannel();
}

function dgmtBroadcastActiveChannel() {
  chrome.runtime.sendMessage({
    type: "DGMT_ACTIVE_CHANNEL_UPDATE",
    payload: dgmtGetDashboardSnapshot()
  });
}

function dgmtGetDashboardSnapshot() {
  return {
    activeChannel: dgmtState.activeChannel,
    isModerator: dgmtState.isModerator,
    isModeratorView: dgmtState.isModeratorView,
    url: dgmtState.url,
    messages: dgmtState.messages,
    streamInfo: dgmtState.streamInfo,
    adInfo: dgmtState.adInfo
  };
}

function dgmtGetDisplayedTime() {
  return new Date().toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}

function dgmtBuildMessageId(source, node, username, message, timestampText) {
  const domId =
    node.getAttribute("msg-id") ||
    node.querySelector("[msg-id]")?.getAttribute("msg-id") ||
    node.getAttribute("data-id") ||
    node.getAttribute("id");

  if (domId) return `${source}:${domId}`;

  return `${source}:${dgmtState.activeChannel || "unknown"}:${username}:${timestampText}:${message}`.slice(0, 500);
}

function dgmtExtractBadges(node) {
  const badges = [];

  node.querySelectorAll("img[alt], [aria-label], [title]").forEach((badge) => {
    const value =
      badge.getAttribute("alt") ||
      badge.getAttribute("aria-label") ||
      badge.getAttribute("title") ||
      "";

    const normalized = value.toLowerCase();

    if (normalized.includes("moderator")) badges.push("moderator");
    if (normalized.includes("broadcaster")) badges.push("broadcaster");
    if (normalized.includes("vip")) badges.push("vip");

    if (
      normalized.includes("bot") ||
      normalized.includes("chatbot") ||
      normalized.includes("chat bot") ||
      normalized.includes("verified bot")
    ) {
      badges.push("chatbot");
    }
  });

  return Array.from(new Set(badges));
}

function dgmtCreateMessageObject({ source, node, username, message, timestampText, rawText }) {
  const badges = dgmtExtractBadges(node);
  const now = new Date();

  return {
    id: dgmtBuildMessageId(source, node, username, message, timestampText),
    source,
    channel: dgmtState.activeChannel,
    username,
    message,
    timestamp: now.toISOString(),
    displayedTime: timestampText || dgmtGetDisplayedTime(),
    localTime: dgmtGetDisplayedTime(),
    rawText: rawText || dgmtCleanText(node.innerText),
    url: window.location.href,
    isModerator: badges.includes("moderator"),
    isBroadcaster: badges.includes("broadcaster"),
    isVip: badges.includes("vip"),
    isChatbot: badges.includes("chatbot"),
    badges,
    isFromModeratorView: dgmtState.isModeratorView
  };
}

const DGMT_CHAT_ADAPTERS = [
  {
    name: "7tv",
    containerSelectors: [
      "#seventv-message-container",
      "main.seventv-chat-list",
      ".seventv-chat-list",
      ".seventv-chat-scroller",
      "section[aria-label='Chat']",
      "[aria-label='Chat messages']",
      "[role='log']"
    ],
    messageSelector: ".seventv-message",
    parseMessage(node) {
      const userElement =
        node.querySelector(".seventv-chat-user-username") ||
        node.querySelector(".seventv-chat-user");

      const bodyElement =
        node.querySelector(".seventv-chat-message-body") ||
        node.querySelector(".seventv-user-message");

      const timestampElement = node.querySelector(".seventv-chat-message-timestamp");

      const username = dgmtCleanText(userElement?.innerText);
      let message = dgmtCleanText(bodyElement?.innerText);
      const timestampText = dgmtCleanText(timestampElement?.innerText);

      if (message && timestampText && message.startsWith(timestampText)) {
        message = dgmtCleanText(message.slice(timestampText.length));
      }

      if (message && username && message.startsWith(username)) {
        message = dgmtCleanText(message.slice(username.length));
      }

      if (!username || !message || message === "Welcome to the chat room!") return null;

      return dgmtCreateMessageObject({
        source: "7tv",
        node,
        username,
        message,
        timestampText,
        rawText: dgmtCleanText(node.innerText)
      });
    }
  },
  {
    name: "twitch",
    containerSelectors: [
      "[data-test-selector='chat-scrollable-area__message-container']",
      ".chat-scrollable-area__message-container",
      "[data-a-target='chat-scroller']",
      "[aria-label='Chat messages']",
      ".chat-list--default",
      ".chat-list__lines",
      "section[aria-label='Chat']",
      "[role='log']"
    ],
    messageSelector: "[data-a-target='chat-line-message'], .chat-line__message",
    parseMessage(node) {
      const userElement =
        node.querySelector("[data-a-target='chat-message-username']") ||
        node.querySelector(".chat-author__display-name");

      const fragments = node.querySelectorAll(".text-fragment");
      const bodyElement =
        node.querySelector("[data-a-target='chat-message-text']") ||
        node.querySelector("[data-test-selector='chat-line-message-body']");

      const username = dgmtCleanText(userElement?.innerText);
      const message =
        fragments.length > 0
          ? dgmtCleanText(Array.from(fragments).map((fragment) => fragment.innerText).join(""))
          : dgmtCleanText(bodyElement?.innerText);

      if (!username || !message) return null;

      return dgmtCreateMessageObject({
        source: "twitch",
        node,
        username,
        message,
        timestampText: "",
        rawText: dgmtCleanText(node.innerText)
      });
    }
  },
  {
    name: "bttv-ffz",
    containerSelectors: [
      ".chat-list__lines",
      ".chat-scrollable-area__message-container",
      "[aria-label='Chat messages']",
      "section[aria-label='Chat']",
      ".chat-list--default",
      "[role='log']"
    ],
    messageSelector: ".chat-line__message, .chat-line__message-container, .ffz--chat-line, .bttv-chat-message",
    parseMessage(node) {
      const userElement =
        node.querySelector(".chat-author__display-name") ||
        node.querySelector("[data-a-target='chat-message-username']") ||
        node.querySelector(".username") ||
        node.querySelector(".ffz-chat-line__username");

      const bodyElement =
        node.querySelector("[data-a-target='chat-message-text']") ||
        node.querySelector(".message") ||
        node.querySelector(".chat-line__message-body");

      const fragments = node.querySelectorAll(".text-fragment");

      const username = dgmtCleanText(userElement?.innerText);
      const message =
        fragments.length > 0
          ? dgmtCleanText(Array.from(fragments).map((fragment) => fragment.innerText).join(""))
          : dgmtCleanText(bodyElement?.innerText || node.innerText?.replace(username, ""));

      if (!username || !message) return null;

      return dgmtCreateMessageObject({
        source: "bttv-ffz",
        node,
        username,
        message,
        timestampText: "",
        rawText: dgmtCleanText(node.innerText)
      });
    }
  }
];

function dgmtFindAdapter() {
  for (const adapter of DGMT_CHAT_ADAPTERS) {
    for (const selector of adapter.containerSelectors) {
      const container = document.querySelector(selector);
      if (!container) continue;

      const messages = container.querySelectorAll(adapter.messageSelector);

      if (messages.length > 0 || selector.includes("Chat") || selector.includes("role")) {
        return { adapter, container };
      }
    }
  }

  return null;
}

function dgmtAddMessage(message) {
  if (!message?.id) return;
  if (dgmtState.messageIds.has(message.id)) return;

  dgmtState.messageIds.add(message.id);
  dgmtState.messages.unshift(message);

  if (dgmtState.messages.length > DGMT_MAX_MESSAGES) {
    const removed = dgmtState.messages.pop();
    if (removed?.id) dgmtState.messageIds.delete(removed.id);
  }

  chrome.runtime.sendMessage({
    type: "DGMT_CHAT_MESSAGE",
    payload: message
  });
}

function dgmtHandleMessageNode(adapter, node) {
  if (!(node instanceof HTMLElement)) return;

  const parsed = adapter.parseMessage(node);
  if (!parsed) return;

  dgmtAddMessage(parsed);
}

function dgmtScanExistingMessages(adapter, container) {
  const messages = container.querySelectorAll(adapter.messageSelector);

  messages.forEach((node) => {
    dgmtHandleMessageNode(adapter, node);
  });
}

function dgmtStartChatObserver() {
  const result = dgmtFindAdapter();

  if (!result) {
    setTimeout(dgmtStartChatObserver, DGMT_POLL_INTERVAL_MS);
    return;
  }

  const { adapter, container } = result;

  if (dgmtState.activeAdapter === adapter.name && dgmtState.observer) {
    dgmtScanExistingMessages(adapter, container);
    return;
  }

  if (dgmtState.observer) {
    dgmtState.observer.disconnect();
  }

  dgmtState.activeAdapter = adapter.name;

  dgmtScanExistingMessages(adapter, container);

  dgmtState.observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (!(node instanceof HTMLElement)) continue;

        if (node.matches?.(adapter.messageSelector)) {
          dgmtHandleMessageNode(adapter, node);
        }

        const nestedMessages = node.querySelectorAll?.(adapter.messageSelector);
        nestedMessages?.forEach((nestedNode) => {
          dgmtHandleMessageNode(adapter, nestedNode);
        });
      }
    }
  });

  dgmtState.observer.observe(container, {
    childList: true,
    subtree: true
  });
}

function dgmtRestartChatObserver() {
  if (dgmtState.observer) {
    dgmtState.observer.disconnect();
    dgmtState.observer = null;
    dgmtState.activeAdapter = null;
  }

  dgmtStartChatObserver();
}

function dgmtDetectStreamTogetherUsers() {
  const users = new Set();

  const selectors = [
    "[data-a-target*='stream-together']",
    "[aria-label*='Stream Together']",
    "[aria-label*='Streaming Together']",
    "[class*='stream-together']",
    "[class*='streamTogether']"
  ];

  for (const selector of selectors) {
    document.querySelectorAll(selector).forEach((element) => {
      const text = dgmtCleanText(element.innerText || element.getAttribute("aria-label") || "");

      text
        .split(/,|·|\n|with|mit/i)
        .map((part) => dgmtCleanText(part).replace("@", ""))
        .filter((part) => /^[a-zA-Z0-9_]{3,25}$/.test(part))
        .filter((part) => !["stream", "together", "streaming", "mit", "with"].includes(part.toLowerCase()))
        .forEach((name) => users.add(name));
    });
  }

  return Array.from(users);
}

function dgmtParseGameAndStreamTogether(rawGameText) {
  const raw = dgmtCleanText(rawGameText);

  if (!raw) {
    return {
      game: "",
      streamTogetherUsers: []
    };
  }

  const normalized = raw.toLowerCase();
  const marker = "streaming together";

  if (!normalized.includes(marker)) {
    return {
      game: raw,
      streamTogetherUsers: []
    };
  }

  const afterMarker = dgmtCleanText(raw.split(/streaming together/i)[1] || "");

  const cleaned = afterMarker
    .replace(/^·+/, "")
    .replace(/^[\s·|,-]+/, "")
    .trim();

  const tokens = cleaned
    .split(/·|\||,/)
    .map((item) => dgmtCleanText(item))
    .filter(Boolean);

  const users = [];
  const gameParts = [];

  for (const token of tokens) {
    const withoutAt = token.replace("@", "").trim();

    if (/^\d+$/.test(withoutAt) && users.length < 6) {
      users.push(withoutAt);
      continue;
    }

    if (/^[a-zA-Z0-9_]{3,25}$/.test(withoutAt) && users.length < 6 && gameParts.length === 0) {
      users.push(withoutAt);
      continue;
    }

    gameParts.push(token);
  }

  return {
    game: gameParts.join(" · ") || raw,
    streamTogetherUsers: users
  };
}

function dgmtExtractStreamInfo() {
  const title =
    document.querySelector("[data-a-target='player-info-title']")?.textContent ||
    document.querySelector("[data-a-target='stream-title']")?.textContent ||
    document.querySelector("h1")?.textContent ||
    "";

  const rawGame =
    document.querySelector("[data-a-target='player-info-game-name']")?.textContent ||
    document.querySelector("[data-a-target='stream-game-link']")?.textContent ||
    document.querySelector("a[href^='/directory/category/']")?.textContent ||
    "";

  const parsedGame = dgmtParseGameAndStreamTogether(rawGame);
  const detectedStreamTogetherUsers = dgmtDetectStreamTogetherUsers();

  const streamTogetherUsers = Array.from(
    new Set([
      ...parsedGame.streamTogetherUsers,
      ...detectedStreamTogetherUsers
    ])
  );

  const bodyText = document.body?.innerText || "";

  const isLive =
    !bodyText.includes("OFFLINE") &&
    !bodyText.includes("is currently offline") &&
    !bodyText.includes("currently offline") &&
    !bodyText.includes("ist derzeit offline") &&
    !bodyText.includes("ist aktuell offline");

  dgmtState.streamInfo = {
    title: dgmtCleanText(title),
    game: parsedGame.game,
    isLive,
    streamTogetherUsers
  };

  chrome.runtime.sendMessage({
    type: "DGMT_STREAM_INFO_UPDATE",
    payload: dgmtState.streamInfo
  });
}

function dgmtExtractAdInfo() {
  const bodyText = (document.body?.innerText || "").toLowerCase();

  const adSelectors = [
    "[data-a-target='video-ad-label']",
    "[data-a-target='player-overlay-ad']",
    "[data-a-target='player-ad-overlay']",
    "[class*='video-ad']",
    "[class*='player-ad']",
    "[class*='commercial']"
  ];

  const hasAdElement = adSelectors.some((selector) => {
    try {
      return Boolean(document.querySelector(selector));
    } catch {
      return false;
    }
  });

  dgmtState.adInfo = {
    isAdRunning:
      hasAdElement ||
      bodyText.includes("ad break") ||
      bodyText.includes("commercial break") ||
      bodyText.includes("advertisement") ||
      bodyText.includes("werbung") ||
      bodyText.includes("anzeige") ||
      bodyText.includes("ad 1 of") ||
      bodyText.includes("ad 2 of")
  };

  chrome.runtime.sendMessage({
    type: "DGMT_AD_INFO_UPDATE",
    payload: dgmtState.adInfo
  });
}

function dgmtStartStreamInfoPolling() {
  dgmtExtractStreamInfo();
  dgmtExtractAdInfo();

  setInterval(() => {
    dgmtUpdatePageContext();
    dgmtExtractStreamInfo();
    dgmtExtractAdInfo();
  }, DGMT_STREAM_INFO_INTERVAL_MS);
}

function dgmtCreateButton() {
  if (document.getElementById("dgmt-floating-button")) return;

  const button = document.createElement("button");
  button.id = "dgmt-floating-button";
  button.type = "button";
  button.title = "Drumgod Modtool";
  button.setAttribute("aria-label", "Drumgod Modtool");

  const img = document.createElement("img");
  img.src = chrome.runtime.getURL("bilder/Browserlogo.png");
  img.alt = "Drumgod Modtool";

  button.appendChild(img);
  document.body.appendChild(button);

  dgmtState.button = button;

  dgmtApplyButtonStyles();
  dgmtLoadButtonSettings();
  dgmtSetupButtonEvents();
}

function dgmtApplyButtonStyles() {
  document.getElementById("dgmt-floating-button-style")?.remove();

  const style = document.createElement("style");
  style.id = "dgmt-floating-button-style";
  style.textContent = `
    #dgmt-floating-button {
      position: fixed;
      right: 18px;
      bottom: 90px;
      z-index: 999999;
      width: 58px;
      height: 58px;
      border: 2px solid #9147ff;
      border-radius: 16px;
      background: rgba(14, 14, 16, 0.92);
      box-shadow: 0 8px 24px rgba(0,0,0,0.45);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 7px;
      transition: transform 0.15s ease, filter 0.15s ease;
    }

    #dgmt-floating-button:hover {
      transform: scale(1.05);
      filter: brightness(1.15);
    }

    #dgmt-floating-button img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      pointer-events: none;
    }

    #dgmt-floating-button.dgmt-hidden {
      display: none !important;
    }
  `;

  document.head.appendChild(style);
}

function dgmtLoadButtonSettings() {
  chrome.storage.local.get(
    [DGMT_STORAGE_POSITION_KEY, DGMT_STORAGE_DRAG_KEY, DGMT_STORAGE_LOGO_VISIBLE_KEY],
    (result) => {
      const position = result[DGMT_STORAGE_POSITION_KEY];
      dgmtState.dragEnabled = result[DGMT_STORAGE_DRAG_KEY] !== false;
      dgmtState.buttonVisible = result[DGMT_STORAGE_LOGO_VISIBLE_KEY] !== false;

      if (position && dgmtState.button) {
        dgmtState.button.style.left = `${position.left}px`;
        dgmtState.button.style.top = `${position.top}px`;
        dgmtState.button.style.right = "auto";
        dgmtState.button.style.bottom = "auto";
      }

      dgmtUpdateButtonVisibility();
    }
  );
}

function dgmtUpdateButtonVisibility() {
  if (!dgmtState.button) return;
  dgmtState.button.classList.toggle("dgmt-hidden", !dgmtState.buttonVisible);
}

function dgmtSaveButtonPosition() {
  if (!dgmtState.button) return;

  const rect = dgmtState.button.getBoundingClientRect();

  chrome.storage.local.set({
    [DGMT_STORAGE_POSITION_KEY]: {
      left: Math.round(rect.left),
      top: Math.round(rect.top)
    }
  });
}

function dgmtSetupButtonEvents() {
  const button = dgmtState.button;
  if (!button) return;

  button.addEventListener("mousedown", (event) => {
    if (!dgmtState.dragEnabled) return;

    const rect = button.getBoundingClientRect();

    dgmtState.dragState.active = true;
    dgmtState.dragState.moved = false;
    dgmtState.dragState.offsetX = event.clientX - rect.left;
    dgmtState.dragState.offsetY = event.clientY - rect.top;

    event.preventDefault();
  });

  window.addEventListener("mousemove", (event) => {
    if (!dgmtState.dragState.active || !button) return;

    const nextLeft = Math.max(
      0,
      Math.min(window.innerWidth - button.offsetWidth, event.clientX - dgmtState.dragState.offsetX)
    );

    const nextTop = Math.max(
      0,
      Math.min(window.innerHeight - button.offsetHeight, event.clientY - dgmtState.dragState.offsetY)
    );

    button.style.left = `${nextLeft}px`;
    button.style.top = `${nextTop}px`;
    button.style.right = "auto";
    button.style.bottom = "auto";

    dgmtState.dragState.moved = true;
  });

  window.addEventListener("mouseup", () => {
    if (!dgmtState.dragState.active) return;

    dgmtState.dragState.active = false;

    if (dgmtState.dragState.moved) {
      dgmtSaveButtonPosition();
    }
  });

  button.addEventListener("click", () => {
    if (dgmtState.dragState.moved) {
      dgmtState.dragState.moved = false;
      return;
    }

    chrome.runtime.sendMessage({
      type: "DGMT_OPEN_DASHBOARD"
    });
  });
}

function dgmtResetButtonPosition() {
  chrome.storage.local.remove(DGMT_STORAGE_POSITION_KEY);

  if (!dgmtState.button) return;

  dgmtState.button.style.left = "";
  dgmtState.button.style.top = "";
  dgmtState.button.style.right = "18px";
  dgmtState.button.style.bottom = "90px";
}

function dgmtSetButtonVisible(visible) {
  dgmtState.buttonVisible = Boolean(visible);

  chrome.storage.local.set({
    [DGMT_STORAGE_LOGO_VISIBLE_KEY]: dgmtState.buttonVisible
  });

  dgmtUpdateButtonVisibility();
}

function dgmtFindChatInput() {
  return (
    document.querySelector("[data-a-target='chat-input']") ||
    document.querySelector("[data-test-selector='chat-input']") ||
    document.querySelector("[contenteditable='true'][role='textbox']") ||
    document.querySelector(".chat-input__textarea textarea") ||
    document.querySelector("textarea")
  );
}

function dgmtFindSendButton() {
  return (
    document.querySelector("[data-a-target='chat-send-button']") ||
    Array.from(document.querySelectorAll("button")).find((button) => {
      const text = dgmtCleanText(button.innerText).toLowerCase();
      const label = String(button.getAttribute("aria-label") || "").toLowerCase();

      return (
        text === "chat" ||
        text === "send" ||
        text === "senden" ||
        label.includes("send") ||
        label.includes("senden")
      );
    })
  );
}

function dgmtSetNativeValue(element, value) {
  const prototype = Object.getPrototypeOf(element);
  const descriptor = Object.getOwnPropertyDescriptor(prototype, "value");

  if (descriptor?.set) {
    descriptor.set.call(element, value);
  } else {
    element.value = value;
  }

  element.dispatchEvent(new Event("input", { bubbles: true }));
  element.dispatchEvent(new Event("change", { bubbles: true }));
}

async function dgmtSendChatCommand(command) {
  const input = dgmtFindChatInput();

  if (!input) {
    return { ok: false, error: "chat-input-not-found" };
  }

  input.focus();

  if (input.isContentEditable) {
    input.textContent = command;
    input.dispatchEvent(
      new InputEvent("input", {
        bubbles: true,
        inputType: "insertText",
        data: command
      })
    );
  } else {
    dgmtSetNativeValue(input, command);
  }

  await new Promise((resolve) => setTimeout(resolve, 120));

  const sendButton = dgmtFindSendButton();

  if (sendButton) {
    sendButton.click();
    return { ok: true };
  }

  input.dispatchEvent(
    new KeyboardEvent("keydown", {
      bubbles: true,
      cancelable: true,
      key: "Enter",
      code: "Enter"
    })
  );

  return { ok: true };
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message?.type) return;

  if (message.type === "GET_DASHBOARD_STATE") {
    dgmtUpdatePageContext();

    sendResponse({
      ...dgmtGetDashboardSnapshot()
    });

    return true;
  }

  if (message.type === "DMS_RESET_BUTTON_POSITION") {
    dgmtResetButtonPosition();
    sendResponse?.({ ok: true });
    return true;
  }

  if (message.type === "DMS_SET_DRAG_ENABLED") {
    dgmtState.dragEnabled = Boolean(message.payload?.enabled);

    chrome.storage.local.set({
      [DGMT_STORAGE_DRAG_KEY]: dgmtState.dragEnabled
    });

    sendResponse?.({ ok: true });
    return true;
  }

  if (message.type === "DMS_SET_LOGO_VISIBLE") {
    dgmtSetButtonVisible(Boolean(message.payload?.visible));
    sendResponse?.({ ok: true });
    return true;
  }

  if (message.type === "DGMT_SEND_CHAT_COMMAND") {
    dgmtSendChatCommand(message.payload?.command || "").then((result) => {
      sendResponse?.(result);
    });

    return true;
  }
});

function dgmtPatchHistory() {
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function patchedPushState(...args) {
    const result = originalPushState.apply(this, args);
    setTimeout(dgmtHandleUrlChange, 100);
    return result;
  };

  history.replaceState = function patchedReplaceState(...args) {
    const result = originalReplaceState.apply(this, args);
    setTimeout(dgmtHandleUrlChange, 100);
    return result;
  };

  window.addEventListener("popstate", () => {
    setTimeout(dgmtHandleUrlChange, 100);
  });
}

function dgmtHandleUrlChange() {
  const oldChannel = dgmtState.activeChannel;
  const oldUrl = dgmtState.url;

  dgmtUpdatePageContext();

  if (oldChannel !== dgmtState.activeChannel || oldUrl !== dgmtState.url) {
    dgmtState.messages = [];
    dgmtState.messageIds.clear();

    setTimeout(() => {
      dgmtRestartChatObserver();
      dgmtExtractStreamInfo();
      dgmtExtractAdInfo();
    }, 800);
  }
}

function dgmtInit() {
  dgmtUpdatePageContext();
  dgmtCreateButton();
  dgmtStartChatObserver();
  dgmtStartStreamInfoPolling();
  dgmtPatchHistory();

  setInterval(() => {
    dgmtStartChatObserver();
  }, DGMT_POLL_INTERVAL_MS);
}

dgmtInit();