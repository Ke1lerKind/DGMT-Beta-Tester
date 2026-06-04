console.log("[Drumgod Modtool] Background loaded.");

const DASHBOARD_PATH = "dashboard/dashboard.html";

chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setTitle({ title: "Drumgod Modtool" });
  chrome.action.setBadgeText({ text: "" });
});

chrome.action.onClicked.addListener((tab) => {
  if (!tab?.id) return;
  openDashboardPopup(tab.id);
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message?.type) return;

  if (message.type === "DGMT_OPEN_DASHBOARD") {
    const tabId = message.tabId || sender?.tab?.id;

    if (tabId) {
      openDashboardPopup(tabId);
      sendResponse?.({ ok: true });
      return true;
    }
  }

  if (message.type === "GET_DASHBOARD_STATE") {
    const tabId = Number(message.tabId);

    if (!Number.isFinite(tabId)) {
      sendResponse?.(null);
      return true;
    }

    chrome.tabs.sendMessage(tabId, { type: "GET_DASHBOARD_STATE" }, (response) => {
      if (chrome.runtime.lastError) {
        sendResponse?.(null);
        return;
      }

      sendResponse?.(response || null);
    });

    return true;
  }

  if (message.type === "DGMT_SEND_CHAT_COMMAND") {
    const tabId = Number(message.tabId);
    const command = message.payload?.command || "";

    if (!Number.isFinite(tabId) || !command) {
      sendResponse?.({ ok: false });
      return true;
    }

    chrome.tabs.sendMessage(
      tabId,
      {
        type: "DGMT_SEND_CHAT_COMMAND",
        payload: { command }
      },
      (response) => {
        if (chrome.runtime.lastError) {
          sendResponse?.({ ok: false, error: chrome.runtime.lastError.message });
          return;
        }

        sendResponse?.(response || { ok: false });
      }
    );

    return true;
  }

  if (
    message.type === "DGMT_ACTIVE_CHANNEL_UPDATE" ||
    message.type === "DGMT_STREAM_INFO_UPDATE" ||
    message.type === "DGMT_AD_INFO_UPDATE" ||
    message.type === "DGMT_CHAT_MESSAGE"
  ) {
    const tabId = sender?.tab?.id;

    if (!tabId) return;

    const dashboardTypeMap = {
      DGMT_ACTIVE_CHANNEL_UPDATE: "DASHBOARD_ACTIVE_CHANNEL_UPDATE",
      DGMT_STREAM_INFO_UPDATE: "DASHBOARD_STREAM_INFO_UPDATE",
      DGMT_AD_INFO_UPDATE: "DASHBOARD_AD_INFO_UPDATE",
      DGMT_CHAT_MESSAGE: "DASHBOARD_CHAT_MESSAGE"
    };

    chrome.runtime.sendMessage({
      type: dashboardTypeMap[message.type],
      tabId,
      payload: message.payload
    });

    return;
  }
});

function openDashboardPopup(tabId) {
  const dashboardUrl = chrome.runtime.getURL(`${DASHBOARD_PATH}?tabId=${tabId}`);

  chrome.windows.create({
    url: dashboardUrl,
    type: "popup",
    width: 1280,
    height: 900,
    focused: true
  });
}