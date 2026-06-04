console.log("[Drumgod Modtool] Dashboard loaded.");

const STORAGE_LANGUAGE_KEY = "dmsLanguage";
const STORAGE_DRAG_KEY = "dmsButtonDraggable";
const STORAGE_LOGO_VISIBLE_KEY = "dmsLogoVisible";
const STORAGE_CONTENT_MODE_KEY = "dmsContentMode";
const STORAGE_USER_NOTES_KEY = "dmsUserNotes";
const STORAGE_ACTION_LOG_KEY = "dmsActionLog";
const STORAGE_COLLAPSE_KEY = "dmsCollapsedPanels";
const STORAGE_CHAT_LOG_KEY = "dmsChatLog";
const STORAGE_CHAT_LOG_SETTINGS_KEY = "dmsChatLogSettings";
const STORAGE_CUSTOM_LISTS_KEY = "dmsCustomLists";
const STORAGE_STREAM_ACTIVITIES_KEY = "dmsStreamActivities";
const STORAGE_APPEARANCE_KEY = "dmsAppearance";
const STORAGE_ACTIVITY_COMMANDS_KEY = "dmsActivityCommands";

const MAX_TIMEOUT_SECONDS = 14 * 24 * 60 * 60;

const urlParams = new URLSearchParams(window.location.search);
const TARGET_TAB_ID = Number(urlParams.get("tabId"));

const translations = {
  en: {
    subtitle: "Chat chaos, but make it draggable.",
    dashboardTab: "Dashboard",
    streamTab: "Stream Info",
    activitiesTab: "Stream Activities",
    settingsTab: "Settings",
    settingsTitle: "Settings",

    languageLabel: "Language",
    languageDescription: "Choose the dashboard language.",
    contentModeTitle: "Content Mode",
    contentModeDescription: "Choose how strict the message analysis should be.",
    safeMode: "18- / Family Safe",
    matureMode: "18+ / Mature Stream",
    dragLabel: "Logo dragging",
    dragDescription: "Allow the floating logo to be moved.",
    dragCheckbox: "Enable dragging",
    logoVisibleTitle: "Floating logo",
    logoVisibleDescription: "Hide the floating logo and open the tool from the pinned extension icon instead.",
    logoVisibleCheckbox: "Show floating logo",
    resetPosition: "Reset position",

    activeChatTitle: "Active Chat",
    statusTitle: "Status",
    liveChatTitle: "Live Chat Data",
    noMessages: "No chat data detected yet.",
    noFilteredMessages: "No flagged messages yet.",
    filteredChatTitle: "Filtered Chat",

    raidDashboardTitle: "Raid",
    raidChannelLabel: "Raid channel",
    raidTextCommandLabel: "Raid text command",
    copyRaidCommand: "Copy /raid",
    copyRaidTextCommand: "Copy !raid",

    automodQueueTitle: "AutoMod Queue",
    automodQueueEmpty: "No flagged messages in queue.",
    automodQueuePosition: "Queue Position",
    automodQueueScore: "Score",
    automodQueueWipNote: "WIP · AutoMod approve/deny requires Twitch API. The queue already helps you jump through flagged messages.",
    queuePrevious: "Previous",
    queueNext: "Next",
    selectQueuedMessage: "Select message",

    selectedMessageTitle: "Selected Message",
    selectedMessageEmpty: "Select a chat message to moderate that exact message.",
    selectedMessageShort: "Selected Message",
    messageLabel: "Message",
    copySelectedMessage: "Copy selected message",

    userAnalysisTitle: "User Analysis",
    userAnalysisDescription: "Select a user to view local stats.",
    userAnalysisMuted: "Recent messages, flags, history and statistics.",
    selectedUserLabel: "Selected User",
    clearSelection: "Clear",
    userMessages: "Messages",
    userFlagged: "Flagged",
    userHighestScore: "Highest Score",
    userAverageScore: "Average Score",
    userFlagsTitle: "Detected Flags",
    userNotesTitle: "Local Moderator Note",
    userRecentMessagesTitle: "Recent Messages",
    noFlags: "No flags",
    saveNote: "Save note",

    actionsTitle: "Moderation Actions",
    selectMessageForActions: "Select a message to prepare moderation actions.",
    timeoutBuilderTitle: "Timeout Builder",
    timeoutCommandType: "Command type",
    timeoutCommandOption: "Timeout",
    untimeoutCommandOption: "Untimeout",
    unbanCommandOption: "Unban",
    commandPreview: "Command Preview",
    copyTimeoutCommand: "Copy command",
    sendTimeout: "Send command",
    timeoutMaxNote: "Twitch allows a maximum timeout duration of 14 days.",
    timeoutTotal: "Total",
    reasonLabel: "Reason / note",

    weeks: "Weeks",
    days: "Days",
    hours: "Hours",
    minutes: "Minutes",
    seconds: "Seconds",

    reasonSpam: "Spam",
    reasonHarassment: "Harassment",
    reasonExtremism: "Hate / Extremism",
    reasonSelfPromo: "Self-promo",
    reasonSpoiler: "Spoiler",
    reasonBackseat: "Backseat",

    actionLogTitle: "Action Log",
    clearLog: "Clear log",
    noActionsYet: "No actions prepared yet.",

    chatLogTitle: "Chatlog",
    chatLogDescription: "Stores detected chat locally and exports it as a text file.",
    chatLogCurrentChannel: "Current channel",
    chatLogRecordState: "Recording",
    chatLogRecordingOn: "Enabled",
    chatLogRecordingOff: "Disabled",
    chatLogPreviewTitle: "Live log preview",
    chatLogPreviewEmpty: "No logged messages yet.",
    exportChatLog: "Export chat log",
    clearChatLog: "Clear chat log",

    chatLogEnabledTitle: "Save stream chat locally",
    chatLogEnabledDescription: "Stores detected messages locally in the browser until you export or clear them.",
    chatLogEnabledCheckbox: "Enable chat log",
    chatLogModeTitle: "Chat log mode",
    chatLogModeDescription: "Choose whether the log stores all messages or only flagged content.",
    chatLogModeAll: "Full chat",
    chatLogModeFlagged: "Only flagged content",

    appearanceTitle: "Appearance",
    appearanceDescription: "Upload a custom background and choose custom tool colors.",
    customBackgroundLabel: "Custom background",
    accentColorLabel: "Accent color",
    secondaryColorLabel: "Second color",
    gradientEnabledLabel: "Use color gradient",
    saveAppearance: "Save appearance",
    resetAppearance: "Reset appearance",

    customWordListsTitle: "Custom Word Lists",
    customWordListsDescription: "Add one word or phrase per line. Whitelist prevents flags. Blacklist forces a flag.",
    customListModeLabel: "Edit lists for",
    whitelistLabel: "Whitelist",
    blacklistLabel: "Blacklist",
    saveCustomLists: "Save word lists",
    clearCustomLists: "Clear current lists",

    streamActivitySettingsTitle: "Stream Activity Tools",
    streamActivitySettingsDescription: "Choose which activity tools should appear in the Stream Activities tab.",
    streamActivitySelectLabel: "Enabled activities",
    saveStreamActivities: "Save activity selection",
    streamActivitiesEmpty: "Select activities under Stream Info to show tools here.",
    commandTemplateLabel: "Command template",

    copyCommand: "Copy command",
    sendCommand: "Send command",
    questionLabel: "Question",
    diceAmountLabel: "Amount",
    diceSidesLabel: "Sides",
    keywordLabel: "Keyword",
    winnerCountLabel: "Winners",

    apiWipBadge: "WIP · API required",
    apiWipNote: "WIP · Twitch API required for direct actions.",
    sendTimeoutWipNote: "WIP · Direct moderation action requires Twitch API. For now this prepares/copies the command.",

    automodTitle: "AutoMod",
    automodDescription: "Flagged messages are automatically added to the AutoMod queue.",
    automodApprove: "Approve",
    automodDeny: "Deny",

    shoutoutTitle: "Shoutout",
    copyShoutout: "Copy shoutout",
    shoutoutSelectedUser: "Shoutout selected user",

    ban: "Ban",
    unban: "Unban",
    timeout: "Timeout",
    untimeout: "Untimeout",
    deleteSelectedMessage: "Delete message",
    report: "Report",
    pinSelectedMessage: "Pin message",
    warn: "Warn",

    noActiveChat: "No Twitch chat detected.",
    activeIn: "Active in:",
    statusReady: "Ready. Waiting for chat data.",
    statusLoaded: "Existing chat data loaded.",
    statusLive: "Live connected. Receiving chat data.",
    statusWaiting: "Dashboard loaded. Waiting for chat data.",
    statusCommandCopied: "Command copied to clipboard.",
    statusMessageCopied: "Selected message copied.",
    statusActionPrepared: "Action prepared.",
    statusUserWarned: "Warning command prepared.",
    statusChatLogExported: "Chat log exported.",
    statusChatLogCleared: "Chat log cleared.",
    statusContentModeUpdated: "Content mode updated. Messages re-analyzed.",
    statusChatLogSettingsSaved: "Chat log settings saved.",
    statusCustomListsSaved: "Custom word lists saved. Messages re-analyzed.",
    statusCustomListsCleared: "Current word lists cleared. Messages re-analyzed.",
    statusStreamActivitiesSaved: "Stream activity selection saved.",
    statusAppearanceSaved: "Appearance saved.",
    statusAppearanceReset: "Appearance reset.",
    statusAutomodQueued: "Flagged message added to AutoMod queue.",
    statusAutomodSelected: "AutoMod queue message selected.",
    statusAutomodQueueEmpty: "AutoMod queue is empty.",
    statusSendFailed: "Send failed. Chat input was not found.",

    confirmSaveLogs: "You have unsaved chat logs for {channel}. Do you want to save them?",
    confirmCloseLogs: "You have unsaved chat logs. Closing will discard them.",

    streamInfoTitle: "Stream Info",
    streamTitleLabel: "Title",
    streamGameLabel: "Game / Category",
    streamTogetherLabel: "Streaming Together",
    streamTogetherInactive: "Not active / not detected",
    adStatusLabel: "Ad Status",
    postponeAd: "Postpone ad",
    adRunning: "Ad running",
    noAd: "No ad signal detected",
    streamEditNote: "Editing and ad controls will come later with Twitch API connection.",
    saveStreamInfo: "Save changes"
  },

  de: {
    subtitle: "Chat-Chaos, aber wenigstens verschiebbar.",
    dashboardTab: "Dashboard",
    streamTab: "Streaminfos",
    activitiesTab: "Stream Aktivitäten",
    settingsTab: "Einstellungen",
    settingsTitle: "Einstellungen",

    languageLabel: "Sprache",
    languageDescription: "Wähle die Sprache des Dashboards.",
    contentModeTitle: "Content-Modus",
    contentModeDescription: "Wähle, wie streng Nachrichten bewertet werden.",
    safeMode: "18- / Family Safe",
    matureMode: "18+ / Mature Stream",
    dragLabel: "Logo verschieben",
    dragDescription: "Erlaubt das Verschieben des schwebenden Logos.",
    dragCheckbox: "Verschieben aktivieren",
    logoVisibleTitle: "Schwebendes Logo",
    logoVisibleDescription: "Blende das schwebende Logo aus und öffne das Tool stattdessen über das angepinnte Erweiterungsicon.",
    logoVisibleCheckbox: "Schwebendes Logo anzeigen",
    resetPosition: "Position zurücksetzen",

    activeChatTitle: "Aktiver Chat",
    statusTitle: "Status",
    liveChatTitle: "Live Chatdaten",
    noMessages: "Noch keine Chatdaten erkannt.",
    noFilteredMessages: "Noch keine markierten Nachrichten.",
    filteredChatTitle: "Gefilterter Chat",

    raidDashboardTitle: "Raid",
    raidChannelLabel: "Raid-Channel",
    raidTextCommandLabel: "Raidtext-Befehl",
    copyRaidCommand: "Copy /raid",
    copyRaidTextCommand: "Copy !raid",

    automodQueueTitle: "AutoMod Queue",
    automodQueueEmpty: "Keine markierten Nachrichten in der Queue.",
    automodQueuePosition: "Queue Position",
    automodQueueScore: "Score",
    automodQueueWipNote: "WIP · AutoMod freigeben/ablehnen benötigt die Twitch API. Die Queue hilft dir jetzt schon, markierte Nachrichten der Reihe nach durchzugehen.",
    queuePrevious: "Vorherige",
    queueNext: "Nächste",
    selectQueuedMessage: "Nachricht auswählen",

    selectedMessageTitle: "Ausgewählte Nachricht",
    selectedMessageEmpty: "Wähle eine Chatnachricht aus, um genau diese Nachricht zu moderieren.",
    selectedMessageShort: "Ausgewählte Nachricht",
    messageLabel: "Nachricht",
    copySelectedMessage: "Ausgewählte Nachricht kopieren",

    userAnalysisTitle: "User Analyse",
    userAnalysisDescription: "Wähle einen User aus, um lokale Statistiken zu sehen.",
    userAnalysisMuted: "Letzte Nachrichten, Auffälligkeiten, Historie und Statistiken.",
    selectedUserLabel: "Ausgewählter User",
    clearSelection: "Lösen",
    userMessages: "Nachrichten",
    userFlagged: "Markiert",
    userHighestScore: "Höchster Score",
    userAverageScore: "Ø Score",
    userFlagsTitle: "Erkannte Flags",
    userNotesTitle: "Lokale Mod-Notiz",
    userRecentMessagesTitle: "Letzte Nachrichten",
    noFlags: "Keine Flags",
    saveNote: "Notiz speichern",

    actionsTitle: "Moderationsaktionen",
    selectMessageForActions: "Wähle eine Nachricht aus, um Moderationsaktionen vorzubereiten.",
    timeoutBuilderTitle: "Timeout Builder",
    timeoutCommandType: "Befehlstyp",
    timeoutCommandOption: "Timeout",
    untimeoutCommandOption: "Untimeout",
    unbanCommandOption: "Unban",
    commandPreview: "Command-Vorschau",
    copyTimeoutCommand: "Befehl kopieren",
    sendTimeout: "Befehl abschicken",
    timeoutMaxNote: "Twitch erlaubt maximal 14 Tage Timeout.",
    timeoutTotal: "Gesamt",
    reasonLabel: "Grund / Notiz",

    weeks: "Wochen",
    days: "Tage",
    hours: "Stunden",
    minutes: "Minuten",
    seconds: "Sekunden",

    reasonSpam: "Spam",
    reasonHarassment: "Belästigung",
    reasonExtremism: "Hass / Extremismus",
    reasonSelfPromo: "Eigenwerbung",
    reasonSpoiler: "Spoiler",
    reasonBackseat: "Backseat",

    actionLogTitle: "Action Log",
    clearLog: "Log leeren",
    noActionsYet: "Noch keine Aktionen vorbereitet.",

    chatLogTitle: "Chatlog",
    chatLogDescription: "Speichert erkannte Chatnachrichten lokal und exportiert sie als Textdatei.",
    chatLogCurrentChannel: "Aktueller Channel",
    chatLogRecordState: "Aufzeichnung",
    chatLogRecordingOn: "Aktiv",
    chatLogRecordingOff: "Aus",
    chatLogPreviewTitle: "Live-Log Vorschau",
    chatLogPreviewEmpty: "Noch keine geloggten Nachrichten.",
    exportChatLog: "Chatlog exportieren",
    clearChatLog: "Chatlog leeren",

    chatLogEnabledTitle: "Streamchat lokal speichern",
    chatLogEnabledDescription: "Speichert erkannte Nachrichten lokal im Browser, bis du sie exportierst oder leerst.",
    chatLogEnabledCheckbox: "Chatlog aktivieren",
    chatLogModeTitle: "Chatlog-Modus",
    chatLogModeDescription: "Wähle, ob der vollständige Chat oder nur markierter Content gespeichert wird.",
    chatLogModeAll: "Vollständiger Chat",
    chatLogModeFlagged: "Nur markierter Content",

    appearanceTitle: "Darstellung",
    appearanceDescription: "Lade einen eigenen Hintergrund hoch und wähle eigene Tool-Farben.",
    customBackgroundLabel: "Eigener Hintergrund",
    accentColorLabel: "Akzentfarbe",
    secondaryColorLabel: "Zweite Farbe",
    gradientEnabledLabel: "Farbverlauf nutzen",
    saveAppearance: "Darstellung speichern",
    resetAppearance: "Darstellung zurücksetzen",

    customWordListsTitle: "Eigene Wortlisten",
    customWordListsDescription: "Ein Wort oder eine Phrase pro Zeile. Whitelist verhindert Flags. Blacklist erzwingt ein Flag.",
    customListModeLabel: "Listen bearbeiten für",
    whitelistLabel: "Whitelist",
    blacklistLabel: "Blacklist",
    saveCustomLists: "Wortlisten speichern",
    clearCustomLists: "Aktuelle Listen leeren",

    streamActivitySettingsTitle: "Stream-Aktivitätstools",
    streamActivitySettingsDescription: "Wähle, welche Aktivitätstools im Reiter Stream Aktivitäten angezeigt werden sollen.",
    streamActivitySelectLabel: "Aktive Aktivitäten",
    saveStreamActivities: "Aktivitäten speichern",
    streamActivitiesEmpty: "Wähle unter Streaminfos Aktivitäten aus, damit hier Tools angezeigt werden.",
    commandTemplateLabel: "Befehlsvorlage",

    copyCommand: "Befehl kopieren",
    sendCommand: "Befehl senden",
    questionLabel: "Frage",
    diceAmountLabel: "Anzahl",
    diceSidesLabel: "Seiten",
    keywordLabel: "Keyword",
    winnerCountLabel: "Gewinner",

    apiWipBadge: "WIP · API benötigt",
    apiWipNote: "WIP · Twitch API für direkte Aktionen benötigt.",
    sendTimeoutWipNote: "WIP · Direkte Moderationsaktion benötigt die Twitch API. Aktuell wird der Befehl vorbereitet/kopiert.",

    automodTitle: "AutoMod",
    automodDescription: "Markierte Nachrichten werden automatisch in die AutoMod Queue gelegt.",
    automodApprove: "Freigeben",
    automodDeny: "Ablehnen",

    shoutoutTitle: "Shoutout",
    copyShoutout: "Shoutout kopieren",
    shoutoutSelectedUser: "Ausgewählten User shoutouten",

    ban: "Ban",
    unban: "Unban",
    timeout: "Timeout",
    untimeout: "Untimeout",
    deleteSelectedMessage: "Nachricht löschen",
    report: "Melden",
    pinSelectedMessage: "Nachricht pinnen",
    warn: "Verwarnen",

    noActiveChat: "Kein Twitch-Chat erkannt.",
    activeIn: "Aktiv in:",
    statusReady: "Bereit. Warte auf Chatdaten.",
    statusLoaded: "Bestehende Chatdaten geladen.",
    statusLive: "Live verbunden. Chatdaten werden empfangen.",
    statusWaiting: "Dashboard geladen. Warte auf Chatdaten.",
    statusCommandCopied: "Command in Zwischenablage kopiert.",
    statusMessageCopied: "Ausgewählte Nachricht kopiert.",
    statusActionPrepared: "Aktion vorbereitet.",
    statusUserWarned: "Verwarnung vorbereitet.",
    statusChatLogExported: "Chatlog exportiert.",
    statusChatLogCleared: "Chatlog geleert.",
    statusContentModeUpdated: "Content-Modus aktualisiert. Nachrichten neu bewertet.",
    statusChatLogSettingsSaved: "Chatlog-Einstellungen gespeichert.",
    statusCustomListsSaved: "Eigene Wortlisten gespeichert. Nachrichten neu bewertet.",
    statusCustomListsCleared: "Aktuelle Wortlisten geleert. Nachrichten neu bewertet.",
    statusStreamActivitiesSaved: "Stream-Aktivitäten gespeichert.",
    statusAppearanceSaved: "Darstellung gespeichert.",
    statusAppearanceReset: "Darstellung zurückgesetzt.",
    statusAutomodQueued: "Markierte Nachricht zur AutoMod Queue hinzugefügt.",
    statusAutomodSelected: "AutoMod Queue Nachricht ausgewählt.",
    statusAutomodQueueEmpty: "AutoMod Queue ist leer.",
    statusSendFailed: "Senden fehlgeschlagen. Chatfeld wurde nicht gefunden.",

    confirmSaveLogs: "Du hast ungespeicherte Chatlogs für {channel}. Möchtest du sie speichern?",
    confirmCloseLogs: "Du hast ungespeicherte Chatlogs. Beim Schließen werden sie verworfen.",

    streamInfoTitle: "Streaminfos",
    streamTitleLabel: "Titel",
    streamGameLabel: "Spiel / Kategorie",
    streamTogetherLabel: "Streaming Together",
    streamTogetherInactive: "Nicht aktiv / nicht erkannt",
    adStatusLabel: "Werbung",
    postponeAd: "Werbung verschieben",
    adRunning: "Werbung läuft",
    noAd: "Kein Werbesignal erkannt",
    streamEditNote: "Bearbeiten und Werbesteuerung kommen später mit Twitch-API-Verbindung.",
    saveStreamInfo: "Änderungen speichern"
  }
};

const dashboardState = {
  messages: [],
  maxMessages: 250,
  language: "en",
  contentMode: "safe",
  statusKey: "statusReady",
  activeChannelData: null,
  streamInfo: null,
  adInfo: null,
  selectedUser: null,
  selectedMessageId: null,
  userNotes: {},
  actionLog: [],
  chatLog: [],
  chatLogsByChannel: {},
  unsavedChatLogChannels: new Set(),
  lastLogChannel: null,
  chatLogSettings: {
    enabled: false,
    mode: "all"
  },
  customLists: {
    safe: { whitelist: "", blacklist: "" },
    mature: { whitelist: "", blacklist: "" }
  },
  streamActivities: [],
  appearance: {
    accentColor: "#9147ff",
    secondaryColor: "#bf94ff",
    gradientEnabled: false,
	gradientAngle: 135,
	gradientStyle: "linear",
	backgroundImage: ""
  },
  activityCommands: {},
  automodQueue: [],
  automodQueueIndex: 0,
  automodHandledIds: new Set(),
  isLoadingActivityCommands: false
};

const statusElement = document.getElementById("dashboard-status");
const activeChatElement = document.getElementById("active-chat");
const chatFeedElement = document.getElementById("chat-feed");
const filteredFeedElement = document.getElementById("filtered-feed");
const messageCountElement = document.getElementById("message-count");

const automodQueuePanel = document.getElementById("automod-queue-panel");
const automodQueueCount = document.getElementById("automod-queue-count");
const automodQueueEmpty = document.getElementById("automod-queue-empty");
const automodQueueContent = document.getElementById("automod-queue-content");
const automodQueuePosition = document.getElementById("automod-queue-position");
const automodQueueScore = document.getElementById("automod-queue-score");
const automodQueueUser = document.getElementById("automod-queue-user");
const automodQueueMessageText = document.getElementById("automod-queue-message-text");
const automodQueueFlags = document.getElementById("automod-queue-flags");
const automodQueuePrevButton = document.getElementById("automod-queue-prev");
const automodQueueNextButton = document.getElementById("automod-queue-next");
const automodQueueSelectButton = document.getElementById("automod-queue-select");
const automodQueueApproveButton = document.getElementById("automod-queue-approve");
const automodQueueDenyButton = document.getElementById("automod-queue-deny");

const selectedMessageEmpty = document.getElementById("selected-message-empty");
const selectedMessageContent = document.getElementById("selected-message-content");
const selectedMessageUser = document.getElementById("selected-message-user");
const selectedMessageText = document.getElementById("selected-message-text");
const clearSelectedMessageButton = document.getElementById("clear-selected-message");
const copySelectedMessageButton = document.getElementById("copy-selected-message");

const languageSelect = document.getElementById("language-select");
const contentModeSelect = document.getElementById("content-mode-select");
const dragCheckbox = document.getElementById("drag-checkbox");
const logoVisibleCheckbox = document.getElementById("logo-visible-checkbox");
const resetPositionButton = document.getElementById("reset-position-button");

const streamTitleInput = document.getElementById("stream-title-input");
const streamGameInput = document.getElementById("stream-game-input");
const streamTogetherInput = document.getElementById("stream-together-input");
const streamAdInput = document.getElementById("stream-ad-input");

const chatLogEnabledInput = document.getElementById("chat-log-enabled");
const chatLogModeSelect = document.getElementById("chat-log-mode");
const chatLogCountElement = document.getElementById("chat-log-count");
const chatLogCurrentChannelElement = document.getElementById("chat-log-current-channel");
const chatLogRecordStateElement = document.getElementById("chat-log-record-state");
const chatLogPreviewElement = document.getElementById("chat-log-preview");
const exportChatLogButton = document.getElementById("export-chat-log");
const clearChatLogButton = document.getElementById("clear-chat-log");

const customListModeSelect = document.getElementById("custom-list-mode-select");
const customWhitelistInput = document.getElementById("custom-whitelist");
const customBlacklistInput = document.getElementById("custom-blacklist");
const saveCustomListsButton = document.getElementById("save-custom-lists");
const clearCustomListsButton = document.getElementById("clear-custom-lists");

const customBackgroundInput = document.getElementById("custom-background-input");
const accentColorInput = document.getElementById("accent-color-input");
const secondaryColorInput = document.getElementById("secondary-color-input");
const gradientEnabledCheckbox = document.getElementById("gradient-enabled-checkbox");
const gradientAngleInput = document.getElementById("gradient-angle-input");
const gradientStyleSelect = document.getElementById("gradient-style-select");
const saveAppearanceButton = document.getElementById("save-appearance");
const resetAppearanceButton = document.getElementById("reset-appearance");

const streamActivityDropdown = document.getElementById("stream-activity-dropdown");
const streamActivityDropdownToggle = document.getElementById("stream-activity-dropdown-toggle");
const streamActivityDropdownMenu = document.getElementById("stream-activity-dropdown-menu");
const streamActivityOptions = document.querySelectorAll("[data-stream-activity-option]");
const saveStreamActivitiesButton = document.getElementById("save-stream-activities");
const clearStreamActivitiesButton = document.getElementById("clear-stream-activities");
const streamActivitiesTabButton = document.getElementById("stream-activities-tab-button");
const streamActivitiesEmpty = document.getElementById("stream-activities-empty");

const userAnalysisEmpty = document.getElementById("user-analysis-empty");
const userAnalysisContent = document.getElementById("user-analysis-content");
const selectedUsernameElement = document.getElementById("selected-username");
const userMessageCountElement = document.getElementById("user-message-count");
const userFlaggedCountElement = document.getElementById("user-flagged-count");
const userHighestScoreElement = document.getElementById("user-highest-score");
const userAverageScoreElement = document.getElementById("user-average-score");
const userFlagsElement = document.getElementById("user-flags");
const userNoteInput = document.getElementById("user-note-input");
const saveUserNoteButton = document.getElementById("save-user-note");
const userRecentMessagesElement = document.getElementById("user-recent-messages");

const actionEmpty = document.getElementById("action-empty");
const actionContent = document.getElementById("action-content");
const actionSelectedUsernameElement = document.getElementById("action-selected-username");
const actionSelectedMessageState = document.getElementById("action-selected-message-state");
const actionReasonInput = document.getElementById("action-reason");
const actionLogElement = document.getElementById("action-log");
const clearActionLogButton = document.getElementById("clear-action-log");
const copyTimeoutCommandButton = document.getElementById("copy-timeout-command");
const sendTimeoutActionButton = document.getElementById("send-timeout-action");
const commandPreviewOutput = document.getElementById("command-preview-output");

const timeoutCommandTypeSelect = document.getElementById("timeout-command-type");
const timeoutDurationSection = document.getElementById("timeout-duration-section");
const timeoutReasonSection = document.getElementById("timeout-reason-section");

const shoutoutUsernameInput = document.getElementById("shoutout-username");
const copyShoutoutCommandButton = document.getElementById("copy-shoutout-command");
const useSelectedUserShoutoutButton = document.getElementById("use-selected-user-shoutout");

const dashboardRaidChannelInput = document.getElementById("dashboard-raid-channel");
const raidTextCommandTemplateInput = document.getElementById("raid-text-command-template");
const dashboardRaidCommandOutput = document.getElementById("dashboard-raid-command-output");

const timeoutInputs = {
  weeks: document.getElementById("timeout-weeks"),
  days: document.getElementById("timeout-days"),
  hours: document.getElementById("timeout-hours"),
  minutes: document.getElementById("timeout-minutes"),
  seconds: document.getElementById("timeout-seconds"),
  total: document.getElementById("timeout-total")
};

const activityInputs = {
  flipcoinTemplate: document.getElementById("flipcoin-command-template"),
  eightballTemplate: document.getElementById("eightball-command-template"),
  eightballQuestion: document.getElementById("eightball-question"),
  diceTemplate: document.getElementById("dice-command-template"),
  diceAmount: document.getElementById("dice-amount"),
  diceSides: document.getElementById("dice-sides"),
  giveawayTemplate: document.getElementById("giveaway-command-template"),
  giveawayKeyword: document.getElementById("giveaway-keyword"),
  giveawayDurationMinutes: document.getElementById("giveaway-duration-minutes"),
  giveawayWinners: document.getElementById("giveaway-winners"),
  queueTemplate: document.getElementById("queue-command-template"),
  queueAction: document.getElementById("queue-action"),
  quoteTemplate: document.getElementById("quote-command-template"),
  quoteAction: document.getElementById("quote-action"),
  quoteText: document.getElementById("quote-text"),
  songrequestTemplate: document.getElementById("songrequest-command-template"),
  songrequestAction: document.getElementById("songrequest-action")
};

const activityOutputs = {
  flipcoin: document.getElementById("flipcoin-command-output"),
  "8ball": document.getElementById("eightball-command-output"),
  dice: document.getElementById("dice-command-output"),
  giveaway: document.getElementById("giveaway-command-output"),
  queue: document.getElementById("queue-command-output"),
  quote: document.getElementById("quote-command-output"),
  songrequest: document.getElementById("songrequest-command-output")
};

const tabButtons = document.querySelectorAll(".tab-button");
const tabContents = document.querySelectorAll(".tab-content");

function t(key) {
  return translations[dashboardState.language]?.[key] || translations.en[key] || key;
}

function updateStatus(text) {
  if (statusElement) {
    statusElement.textContent = text;
  }
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function isOpenedFromModeratorView() {
  const data = dashboardState.activeChannelData || {};
  const url = String(data.url || "").toLowerCase();

  return Boolean(
    data.isModeratorView ||
      data.isModerator ||
      url.includes("/moderator/") ||
      url.includes("twitch.tv/moderator")
  );
}

function isModAllowed() {
  return isOpenedFromModeratorView();
}

function getActiveChannelName() {
  return dashboardState.activeChannelData?.activeChannel || "";
}

function getCurrentLogChannel() {
  return getActiveChannelName() || "unknown";
}

function ensureChannelLog(channel = getCurrentLogChannel()) {
  if (!dashboardState.chatLogsByChannel[channel]) {
    dashboardState.chatLogsByChannel[channel] = [];
  }

  return dashboardState.chatLogsByChannel[channel];
}

function setCurrentChannelLog(channel = getCurrentLogChannel()) {
  dashboardState.chatLog = ensureChannelLog(channel);
  dashboardState.lastLogChannel = channel;
}

function markChatLogUnsaved(channel = getCurrentLogChannel()) {
  dashboardState.unsavedChatLogChannels.add(channel);
}

function hasUnsavedChatLogs() {
  return dashboardState.unsavedChatLogChannels.size > 0;
}

function formatTime(message) {
  if (message?.displayedTime) return message.displayedTime;
  if (message?.localTime) return message.localTime;

  try {
    return new Date(message?.timestamp || Date.now()).toLocaleTimeString(
      dashboardState.language === "de" ? "de-DE" : "en-US",
      { hour: "2-digit", minute: "2-digit", second: "2-digit" }
    );
  } catch {
    return "";
  }
}

function formatFullTimestamp(timestamp) {
  try {
    return new Date(timestamp || Date.now()).toLocaleString(
      dashboardState.language === "de" ? "de-DE" : "en-US",
      {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      }
    );
  } catch {
    return String(timestamp || "");
  }
}

function getStreamDurationText(channel = getCurrentLogChannel()) {
  const channelLog = ensureChannelLog(channel);
  const firstMessage = channelLog[0];

  if (!firstMessage?.timestamp) {
    return "00:00:00";
  }

  const start = new Date(firstMessage.timestamp).getTime();
  const now = Date.now();
  const diff = Math.max(0, Math.floor((now - start) / 1000));

  const hours = String(Math.floor(diff / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((diff % 3600) / 60)).padStart(2, "0");
  const seconds = String(diff % 60).padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}

function getMessageLogLine(entry) {
  const dateText = formatFullTimestamp(entry.timestamp);
  const streamDuration = entry.streamDuration || "00:00:00";

  return `[${dateText} | ${streamDuration}] ${entry.username}: ${entry.message}`;
}

function getSelectedMessage() {
  return dashboardState.messages.find((message) => message.id === dashboardState.selectedMessageId) || null;
}

function getActiveAutomodMessage() {
  if (!dashboardState.automodQueue.length) return null;

  const safeIndex = Math.max(0, Math.min(dashboardState.automodQueueIndex, dashboardState.automodQueue.length - 1));
  dashboardState.automodQueueIndex = safeIndex;

  const id = dashboardState.automodQueue[safeIndex];
  return dashboardState.messages.find((message) => message.id === id) || null;
}

function getUserKey(username) {
  const channel = getActiveChannelName() || "unknown";
  return `${channel}:${String(username || "").toLowerCase()}`;
}

function getSelectedTimeoutCommandType() {
  return timeoutCommandTypeSelect?.value || "timeout";
}

function getSelectedCustomListMode() {
  return customListModeSelect?.value || dashboardState.contentMode || "safe";
}

function setStatusKey(key) {
  dashboardState.statusKey = key || "statusReady";
  updateStatus(t(dashboardState.statusKey));
}

function getContentMode() {
  return isModAllowed() ? dashboardState.contentMode || "safe" : "safe";
}

function isMessageFlagged(message) {
  const level = message?.analysis?.level || "normal";
  return level !== "normal";
}

function analyzeMessage(message) {
  if (!message) return message;

  if (!window.DrumgodMessageAnalyzer?.analyze) {
    return {
      ...message,
      analysis: message.analysis || {
        score: 0,
        level: "normal",
        flags: [],
        contentMode: getContentMode(),
        reviewed: false,
        autoAction: false
      }
    };
  }

  return {
    ...message,
    analysis: window.DrumgodMessageAnalyzer.analyze(message, {
      contentMode: getContentMode(),
      customLists: isModAllowed() ? dashboardState.customLists : {},
      channel: message.channel || getActiveChannelName(),
      activeChannel: message.channel || getActiveChannelName()
    })
  };
}

function applyTemplate(template, replacements) {
  let output = String(template || "");

  Object.entries(replacements || {}).forEach(([key, value]) => {
    output = output.replaceAll(`{${key}}`, String(value ?? ""));
  });

  return output.replace(/\s+/g, " ").trim();
}

function clampNumber(value, min, max, fallback) {
  const number = Number(value);

  if (!Number.isFinite(number)) return fallback;
  return Math.max(min, Math.min(max, number));
}

function updateDashboardRaidPreview() {
  if (!dashboardRaidCommandOutput) return;

  const channel = String(dashboardRaidChannelInput?.value || "channel").replace("@", "").trim() || "channel";
  dashboardRaidCommandOutput.textContent = `/raid ${channel}`;
}

function getDashboardRaidCommand() {
  const channel = String(dashboardRaidChannelInput?.value || "channel").replace("@", "").trim() || "channel";
  return `/raid ${channel}`;
}

function getRaidTextCommand() {
  return String(raidTextCommandTemplateInput?.value || "!raid").trim() || "!raid";
}

function getActivityTemplate(key, fallback) {
  const inputMap = {
    flipcoin: activityInputs.flipcoinTemplate,
    "8ball": activityInputs.eightballTemplate,
    dice: activityInputs.diceTemplate,
    giveaway: activityInputs.giveawayTemplate,
    queue: activityInputs.queueTemplate,
    quote: activityInputs.quoteTemplate,
    songrequest: activityInputs.songrequestTemplate
  };

  return inputMap[key]?.value || dashboardState.activityCommands[key] || fallback;
}

function saveActivityCommands() {
  if (dashboardState.isLoadingActivityCommands) return;

  dashboardState.activityCommands = {
    flipcoin: activityInputs.flipcoinTemplate?.value || "!flipcoin",
    "8ball": activityInputs.eightballTemplate?.value || "!8ball {question}",
    dice: activityInputs.diceTemplate?.value || "!dice {amount}d{sides}",
    giveaway: activityInputs.giveawayTemplate?.value || "!raffle {keyword} {minutes}m {winners}",
    queue: activityInputs.queueTemplate?.value || "!queue {action}",
    quote: activityInputs.quoteTemplate?.value || "!quote",
    songrequest: activityInputs.songrequestTemplate?.value || "!songrequest {action}",
    raidText: raidTextCommandTemplateInput?.value || "!raid"
  };

  chrome.storage.local.set({
    [STORAGE_ACTIVITY_COMMANDS_KEY]: dashboardState.activityCommands
  });
}

function loadActivityCommands() {
  dashboardState.isLoadingActivityCommands = true;

  chrome.storage.local.get(STORAGE_ACTIVITY_COMMANDS_KEY, (result) => {
    dashboardState.activityCommands = result[STORAGE_ACTIVITY_COMMANDS_KEY] || {};

    if (activityInputs.flipcoinTemplate) activityInputs.flipcoinTemplate.value = dashboardState.activityCommands.flipcoin || "!flipcoin";
    if (activityInputs.eightballTemplate) activityInputs.eightballTemplate.value = dashboardState.activityCommands["8ball"] || "!8ball {question}";
    if (activityInputs.diceTemplate) activityInputs.diceTemplate.value = dashboardState.activityCommands.dice || "!dice {amount}d{sides}";
    if (activityInputs.giveawayTemplate) activityInputs.giveawayTemplate.value = dashboardState.activityCommands.giveaway || "!raffle {keyword} {minutes}m {winners}";
    if (activityInputs.queueTemplate) activityInputs.queueTemplate.value = dashboardState.activityCommands.queue || "!queue {action}";
    if (activityInputs.quoteTemplate) activityInputs.quoteTemplate.value = dashboardState.activityCommands.quote || "!quote";
    if (activityInputs.songrequestTemplate) activityInputs.songrequestTemplate.value = dashboardState.activityCommands.songrequest || "!songrequest {action}";
    if (raidTextCommandTemplateInput) raidTextCommandTemplateInput.value = dashboardState.activityCommands.raidText || "!raid";

    dashboardState.isLoadingActivityCommands = false;

    updateAllActivityPreviews(false);
    updateDashboardRaidPreview();
  });
}

function getActivityCommand(activity) {
  if (activity === "dashboard-raid") return getDashboardRaidCommand();
  if (activity === "raid-text") return getRaidTextCommand();

  if (activity === "flipcoin") {
    return getActivityTemplate("flipcoin", "!flipcoin");
  }

  if (activity === "8ball") {
    const question = activityInputs.eightballQuestion?.value?.trim() || "";
    return applyTemplate(getActivityTemplate("8ball", "!8ball {question}"), { question });
  }

  if (activity === "dice") {
    const amount = clampNumber(activityInputs.diceAmount?.value, 1, 20, 1);
    const sides = clampNumber(activityInputs.diceSides?.value, 2, 1000, 6);

    if (activityInputs.diceAmount) activityInputs.diceAmount.value = amount;
    if (activityInputs.diceSides) activityInputs.diceSides.value = sides;

    return applyTemplate(getActivityTemplate("dice", "!dice {amount}d{sides}"), {
      amount,
      sides
    });
  }

  if (activity === "giveaway") {
    const keyword = activityInputs.giveawayKeyword?.value?.trim() || "!join";
    const minutes = clampNumber(activityInputs.giveawayDurationMinutes?.value, 1, 180, 10);
    const winners = clampNumber(activityInputs.giveawayWinners?.value, 1, 100, 1);

    if (activityInputs.giveawayDurationMinutes) activityInputs.giveawayDurationMinutes.value = minutes;
    if (activityInputs.giveawayWinners) activityInputs.giveawayWinners.value = winners;

    return applyTemplate(getActivityTemplate("giveaway", "!raffle {keyword} {minutes}m {winners}"), {
      keyword,
      minutes,
      winners
    });
  }

  if (activity === "queue") {
    const action = activityInputs.queueAction?.value || "open";

    if (action === "next") {
      return applyTemplate(getActivityTemplate("queue", "!queue {action}"), {
        action: "next"
      }).replace("!queue next", "!next");
    }

    return applyTemplate(getActivityTemplate("queue", "!queue {action}"), { action });
  }

  if (activity === "quote") {
    const action = activityInputs.quoteAction?.value || "show";
    const quoteText = activityInputs.quoteText?.value?.trim() || "";
    const template = getActivityTemplate("quote", "!quote");

    if (action === "add") {
      return quoteText ? `!addquote ${quoteText}` : "!addquote";
    }

    return template;
  }

  if (activity === "songrequest") {
    const action = activityInputs.songrequestAction?.value || "open";
    const template = getActivityTemplate("songrequest", "!songrequest {action}");

    if (action === "skip") return "!skip";
    if (action === "song") return "!song";

    return applyTemplate(template, { action });
  }

  return "";
}

function updateAllActivityPreviews(shouldSave = true) {
  Object.entries(activityOutputs).forEach(([activity, output]) => {
    if (!output) return;
    output.textContent = getActivityCommand(activity);
  });

  updateDashboardRaidPreview();

  if (shouldSave) {
    saveActivityCommands();
  }
}

async function copyActivityCommand(activity) {
  const command = getActivityCommand(activity);

  if (!command) return;

  await copyText(command);
  addActionLog(activity, command);
}

async function sendActivityCommandToChat(activity) {
  const command = getActivityCommand(activity);

  if (!command) return;

  chrome.runtime.sendMessage(
    {
      type: "DGMT_SEND_CHAT_COMMAND",
      tabId: TARGET_TAB_ID,
      payload: { command }
    },
    (response) => {
      if (response?.ok) {
        addActionLog(`send-${activity}`, command);
        setStatusKey("statusActionPrepared");
        return;
      }

      setStatusKey("statusSendFailed");
    }
  );
}

function prepareActivityCommand(activity) {
  const command = getActivityCommand(activity);

  if (!command) return;

  addActionLog(activity, command);
  setStatusKey("statusActionPrepared");
}

function rebuildAutomodQueue() {
  const existingActiveId = getActiveAutomodMessage()?.id || null;

  dashboardState.automodQueue = dashboardState.messages
    .filter((message) => isMessageFlagged(message))
    .map((message) => message.id);

  if (existingActiveId) {
    const nextIndex = dashboardState.automodQueue.indexOf(existingActiveId);
    dashboardState.automodQueueIndex = nextIndex >= 0 ? nextIndex : 0;
  } else {
    dashboardState.automodQueueIndex = 0;
  }

  renderAutomodQueue();
}

function addToAutomodQueue(message) {
  if (!message?.id) return;
  if (!isMessageFlagged(message)) return;

  const wasEmpty = dashboardState.automodQueue.length === 0;

  if (!dashboardState.automodQueue.includes(message.id)) {
    dashboardState.automodQueue.push(message.id);
  }

  if (wasEmpty) {
    dashboardState.automodQueueIndex = 0;
  }

  renderAutomodQueue();

  if (!dashboardState.automodHandledIds.has(message.id)) {
    dashboardState.automodHandledIds.add(message.id);
    setStatusKey("statusAutomodQueued");
  }
}

function removeFromAutomodQueue(messageId) {
  const index = dashboardState.automodQueue.indexOf(messageId);
  if (index < 0) return;

  dashboardState.automodQueue.splice(index, 1);

  if (dashboardState.automodQueueIndex >= dashboardState.automodQueue.length) {
    dashboardState.automodQueueIndex = Math.max(0, dashboardState.automodQueue.length - 1);
  }

  renderAutomodQueue();
  renderMessages();
}

function jumpAutomodQueue(direction) {
  if (!dashboardState.automodQueue.length) {
    setStatusKey("statusAutomodQueueEmpty");
    return;
  }

  dashboardState.automodQueueIndex += direction;

  if (dashboardState.automodQueueIndex < 0) {
    dashboardState.automodQueueIndex = dashboardState.automodQueue.length - 1;
  }

  if (dashboardState.automodQueueIndex >= dashboardState.automodQueue.length) {
    dashboardState.automodQueueIndex = 0;
  }

  renderAutomodQueue();
  scrollActiveAutomodMessageIntoView();
}

function selectActiveAutomodMessage() {
  const message = getActiveAutomodMessage();

  if (!message) {
    setStatusKey("statusAutomodQueueEmpty");
    return;
  }

  selectMessage(message.id);
  setStatusKey("statusAutomodSelected");
  scrollActiveAutomodMessageIntoView();
}

function handleAutomodQueueAction(action) {
  const message = getActiveAutomodMessage();

  if (!message) {
    setStatusKey("statusAutomodQueueEmpty");
    return;
  }

  dashboardState.selectedMessageId = message.id;
  dashboardState.selectedUser = message.username;

  prepareAction(action);
  removeFromAutomodQueue(message.id);
}

function scrollActiveAutomodMessageIntoView() {
  const message = getActiveAutomodMessage();
  if (!message) return;

  setTimeout(() => {
    const element = document.querySelector(`.chat-message[data-message-id="${CSS.escape(message.id)}"]`);
    element?.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }, 50);
}

function renderAutomodQueue() {
  const queueLength = dashboardState.automodQueue.length;
  const activeMessage = getActiveAutomodMessage();
  const allowed = isModAllowed();

  if (automodQueueCount) automodQueueCount.textContent = String(queueLength);

  if (automodQueuePanel) {
    automodQueuePanel.classList.toggle("hidden", !allowed || queueLength === 0);
  }

  if (automodQueueEmpty) {
    automodQueueEmpty.classList.toggle("hidden", queueLength > 0);
  }

  if (automodQueueContent) {
    automodQueueContent.classList.toggle("hidden", queueLength === 0);
  }

  if (!activeMessage) {
    if (automodQueuePosition) automodQueuePosition.textContent = "0 / 0";
    if (automodQueueScore) automodQueueScore.textContent = "0";
    if (automodQueueUser) automodQueueUser.textContent = "-";
    if (automodQueueMessageText) automodQueueMessageText.textContent = "-";
    if (automodQueueFlags) automodQueueFlags.innerHTML = "";
    return;
  }

  if (automodQueuePosition) {
    automodQueuePosition.textContent = `${dashboardState.automodQueueIndex + 1} / ${queueLength}`;
  }

  if (automodQueueScore) {
    automodQueueScore.textContent = String(activeMessage.analysis?.score || 0);
  }

  if (automodQueueUser) {
    automodQueueUser.textContent = activeMessage.username || "-";
  }

  if (automodQueueMessageText) {
    automodQueueMessageText.textContent = activeMessage.message || "-";
  }

  if (automodQueueFlags) {
    const flags = Array.isArray(activeMessage.analysis?.flags) ? activeMessage.analysis.flags : [];

    automodQueueFlags.innerHTML = flags.length
      ? flags.map((flag) => `<span class="analysis-flag">${escapeHtml(flag)}</span>`).join("")
      : `<span class="analysis-flag">${escapeHtml(t("noFlags"))}</span>`;
  }
}

function reanalyzeMessages() {
  dashboardState.messages = dashboardState.messages.map((message) => analyzeMessage(message));
  rebuildAutomodQueue();
}

function applyLanguage(language) {
  dashboardState.language = language;
  document.documentElement.lang = language;

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    element.textContent = t(key);
  });

  if (languageSelect) languageSelect.value = language;

  renderMessages();
  renderSelectedMessagePanel();
  renderUserAnalysis();
  renderActionPanel();
  renderActionLog();
  renderAutomodQueue();
  updateChatLogCount();
  updateChatLogSettingsUi();
  updateCustomListUi();
  updateStreamActivitiesUi();
  updateTimeoutCommandUi();
  updateAllActivityPreviews(false);
  updateCommandPreview();
  updateModOnlyVisibility();
  updateStatus(t(dashboardState.statusKey || "statusReady"));
}

function loadLanguage() {
  chrome.storage.local.get(STORAGE_LANGUAGE_KEY, (result) => {
    applyLanguage(result[STORAGE_LANGUAGE_KEY] || "en");
  });
}

function saveLanguage(language) {
  chrome.storage.local.set({ [STORAGE_LANGUAGE_KEY]: language });
  applyLanguage(language);
}

function loadContentMode() {
  chrome.storage.local.get(STORAGE_CONTENT_MODE_KEY, (result) => {
    dashboardState.contentMode = result[STORAGE_CONTENT_MODE_KEY] || "safe";

    if (contentModeSelect) contentModeSelect.value = dashboardState.contentMode;
    if (customListModeSelect) customListModeSelect.value = dashboardState.contentMode;

    reanalyzeMessages();
    renderMessages();
    renderUserAnalysis();
    renderActionPanel();
  });
}

function saveContentMode(mode) {
  if (!isModAllowed()) return;

  dashboardState.contentMode = mode || "safe";

  chrome.storage.local.set({
    [STORAGE_CONTENT_MODE_KEY]: dashboardState.contentMode
  });

  if (customListModeSelect) customListModeSelect.value = dashboardState.contentMode;

  reanalyzeMessages();
  renderMessages();
  renderSelectedMessagePanel();
  renderUserAnalysis();
  renderActionPanel();
  updateCustomListUi();
  setStatusKey("statusContentModeUpdated");
}

function loadChatLogSettings() {
  chrome.storage.local.get(STORAGE_CHAT_LOG_SETTINGS_KEY, (result) => {
    const settings = result[STORAGE_CHAT_LOG_SETTINGS_KEY] || {};

    dashboardState.chatLogSettings = {
      enabled: Boolean(settings.enabled),
      mode: settings.mode === "flagged" ? "flagged" : "all"
    };

    if (!isModAllowed()) {
      dashboardState.chatLogSettings.enabled = false;
    }

    updateChatLogSettingsUi();
    updateChatLogCount();
  });
}

function updateChatLogSettingsUi() {
  if (chatLogEnabledInput) chatLogEnabledInput.checked = Boolean(dashboardState.chatLogSettings.enabled);
  if (chatLogModeSelect) chatLogModeSelect.value = dashboardState.chatLogSettings.mode || "all";
}

function saveChatLogSettings() {
  if (!isModAllowed()) {
    dashboardState.chatLogSettings.enabled = false;
    updateChatLogSettingsUi();
    updateChatLogCount();
    return;
  }

  dashboardState.chatLogSettings = {
    enabled: Boolean(chatLogEnabledInput?.checked),
    mode: chatLogModeSelect?.value === "flagged" ? "flagged" : "all"
  };

  chrome.storage.local.set({
    [STORAGE_CHAT_LOG_SETTINGS_KEY]: dashboardState.chatLogSettings
  });

  updateChatLogCount();
  setStatusKey("statusChatLogSettingsSaved");
}

function loadCustomLists() {
  chrome.storage.local.get(STORAGE_CUSTOM_LISTS_KEY, (result) => {
    const saved = result[STORAGE_CUSTOM_LISTS_KEY] || {};

    dashboardState.customLists = {
      safe: {
        whitelist: saved.safe?.whitelist || "",
        blacklist: saved.safe?.blacklist || ""
      },
      mature: {
        whitelist: saved.mature?.whitelist || "",
        blacklist: saved.mature?.blacklist || ""
      }
    };

    updateCustomListUi();
    reanalyzeMessages();
    renderMessages();
    renderUserAnalysis();
    renderActionPanel();
  });
}

function updateCustomListUi() {
  const mode = getSelectedCustomListMode();
  const lists = dashboardState.customLists[mode] || { whitelist: "", blacklist: "" };

  if (customWhitelistInput) customWhitelistInput.value = lists.whitelist || "";
  if (customBlacklistInput) customBlacklistInput.value = lists.blacklist || "";
}

function saveCustomLists() {
  if (!isModAllowed()) return;

  const mode = getSelectedCustomListMode();

  dashboardState.customLists[mode] = {
    whitelist: customWhitelistInput?.value || "",
    blacklist: customBlacklistInput?.value || ""
  };

  chrome.storage.local.set({
    [STORAGE_CUSTOM_LISTS_KEY]: dashboardState.customLists
  });

  reanalyzeMessages();
  renderMessages();
  renderSelectedMessagePanel();
  renderUserAnalysis();
  renderActionPanel();

  setStatusKey("statusCustomListsSaved");
}

function clearCustomLists() {
  if (!isModAllowed()) return;

  const mode = getSelectedCustomListMode();

  dashboardState.customLists[mode] = {
    whitelist: "",
    blacklist: ""
  };

  chrome.storage.local.set({
    [STORAGE_CUSTOM_LISTS_KEY]: dashboardState.customLists
  });

  updateCustomListUi();
  reanalyzeMessages();
  renderMessages();
  renderSelectedMessagePanel();
  renderUserAnalysis();
  renderActionPanel();

  setStatusKey("statusCustomListsCleared");
}

function loadAppearance() {
  chrome.storage.local.get(STORAGE_APPEARANCE_KEY, (result) => {
    const saved = result[STORAGE_APPEARANCE_KEY] || {};

    dashboardState.appearance = {
	  accentColor: saved.accentColor || "#9147ff",
	  secondaryColor: saved.secondaryColor || "#bf94ff",
	  gradientEnabled: Boolean(saved.gradientEnabled),
	  gradientAngle: Number.isFinite(Number(saved.gradientAngle)) ? Number(saved.gradientAngle) : 135,
	  gradientStyle: saved.gradientStyle === "radial" ? "radial" : "linear",
	  backgroundImage: saved.backgroundImage || ""
	};

    applyAppearance();
	
	if (gradientAngleInput) gradientAngleInput.value = dashboardState.appearance.gradientAngle;
	if (gradientStyleSelect) gradientStyleSelect.value = dashboardState.appearance.gradientStyle;	
    if (accentColorInput) accentColorInput.value = dashboardState.appearance.accentColor;
    if (secondaryColorInput) secondaryColorInput.value = dashboardState.appearance.secondaryColor;
    if (gradientEnabledCheckbox) gradientEnabledCheckbox.checked = dashboardState.appearance.gradientEnabled;
  });
}

function applyAppearance() {
  const accentColor = dashboardState.appearance.accentColor || "#9147ff";
  const secondaryColor = dashboardState.appearance.secondaryColor || "#bf94ff";
  const gradientEnabled = Boolean(dashboardState.appearance.gradientEnabled);
  const gradientAngle = Number.isFinite(Number(dashboardState.appearance.gradientAngle))
    ? Number(dashboardState.appearance.gradientAngle)
    : 135;
  const gradientStyle = dashboardState.appearance.gradientStyle === "radial" ? "radial" : "linear";

  const gradientValue =
    gradientStyle === "radial"
      ? `radial-gradient(circle, ${accentColor}, ${secondaryColor})`
      : `linear-gradient(${gradientAngle}deg, ${accentColor}, ${secondaryColor})`;

  document.documentElement.style.setProperty("--dms-accent", accentColor);
  document.documentElement.style.setProperty("--dms-accent-strong", accentColor);
  document.documentElement.style.setProperty("--dms-accent-soft", secondaryColor);
  document.documentElement.style.setProperty("--dms-accent-gradient", gradientValue);

  if (gradientEnabled) {
    document.body.classList.add("has-accent-gradient");
  } else {
    document.body.classList.remove("has-accent-gradient");
  }

  if (dashboardState.appearance.backgroundImage) {
    document.body.classList.add("has-custom-background");
    document.body.style.backgroundImage = `url("${dashboardState.appearance.backgroundImage}")`;
  } else {
    document.body.classList.remove("has-custom-background");
    document.body.style.backgroundImage = "";
  }
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
}

async function saveAppearance() {
  const nextAppearance = {
    accentColor: accentColorInput?.value || "#9147ff",
    secondaryColor: secondaryColorInput?.value || "#bf94ff",
    gradientEnabled: Boolean(gradientEnabledCheckbox?.checked),
	gradientAngle: Number(gradientAngleInput?.value || 135),
	gradientStyle: gradientStyleSelect?.value === "radial" ? "radial" : "linear",
    backgroundImage: dashboardState.appearance.backgroundImage || ""
  };

  const file = customBackgroundInput?.files?.[0];

  if (file) {
    nextAppearance.backgroundImage = await readFileAsDataUrl(file);
  }

  dashboardState.appearance = nextAppearance;

  chrome.storage.local.set({
    [STORAGE_APPEARANCE_KEY]: dashboardState.appearance
  });

  applyAppearance();
  setStatusKey("statusAppearanceSaved");
}

function resetAppearance() {
	dashboardState.appearance = {
	  accentColor: "#9147ff",
	  secondaryColor: "#bf94ff",
	  gradientEnabled: false,
	  gradientAngle: 135,
	  gradientStyle: "linear",
	  backgroundImage: ""
};

  chrome.storage.local.set({
    [STORAGE_APPEARANCE_KEY]: dashboardState.appearance
  });

  if (accentColorInput) accentColorInput.value = "#9147ff";
  if (secondaryColorInput) secondaryColorInput.value = "#bf94ff";
  if (gradientEnabledCheckbox) gradientEnabledCheckbox.checked = false;

  if (customBackgroundInput) {
    customBackgroundInput.value = "";
  }

  applyAppearance();
  setStatusKey("statusAppearanceReset");
}

function loadStreamActivities() {
  chrome.storage.local.get(STORAGE_STREAM_ACTIVITIES_KEY, (result) => {
    const saved = result[STORAGE_STREAM_ACTIVITIES_KEY] || [];

    const allowedActivities = new Set([
      "flipcoin",
      "8ball",
      "dice",
      "giveaway",
      "queue",
      "quote",
      "songrequest"
    ]);

    dashboardState.streamActivities = saved.filter((activity) => allowedActivities.has(activity));

    chrome.storage.local.set({
      [STORAGE_STREAM_ACTIVITIES_KEY]: dashboardState.streamActivities
    });

    updateStreamActivitiesUi();
  });
}

function getSelectedStreamActivitiesFromInput() {
  return Array.from(streamActivityOptions)
    .filter((option) => option.checked)
    .map((option) => option.value);
}

function updateStreamActivityDropdownLabel() {
  if (!streamActivityDropdownToggle) return;

  const selected = getSelectedStreamActivitiesFromInput();

  if (!selected.length) {
    streamActivityDropdownToggle.textContent =
      dashboardState.language === "de"
        ? "Aktivitäten auswählen"
        : "Select activities";
    return;
  }

  streamActivityDropdownToggle.textContent =
    dashboardState.language === "de"
      ? `${selected.length} ausgewählt`
      : `${selected.length} selected`;
}

function saveStreamActivities() {
  if (!isModAllowed()) return;

  dashboardState.streamActivities = getSelectedStreamActivitiesFromInput();

  chrome.storage.local.set({
    [STORAGE_STREAM_ACTIVITIES_KEY]: dashboardState.streamActivities
  });

  updateStreamActivitiesUi();
  setStatusKey("statusStreamActivitiesSaved");
}

function clearStreamActivities() {
  dashboardState.streamActivities = [];

  streamActivityOptions.forEach((option) => {
    option.checked = false;
  });

  chrome.storage.local.set({
    [STORAGE_STREAM_ACTIVITIES_KEY]: []
  });

  updateStreamActivitiesUi();
  setStatusKey("statusStreamActivitiesSaved");
}

function updateStreamActivitiesUi() {
  const enabled = new Set(dashboardState.streamActivities || []);
  const allowed = isModAllowed();

  streamActivityOptions.forEach((option) => {
    option.checked = enabled.has(option.value);
  });

  updateStreamActivityDropdownLabel();

  const hasSelectedActivities = enabled.size > 0;

  const hasVisibleActivities =
    allowed &&
    hasSelectedActivities &&
    Array.from(document.querySelectorAll("[data-activity-card]")).some((card) => {
      const key = card.getAttribute("data-activity-card");
      return enabled.has(key);
    });

  if (streamActivitiesTabButton) {
    streamActivitiesTabButton.classList.toggle("hidden", !hasVisibleActivities);
  }

  if (streamActivitiesEmpty) {
    streamActivitiesEmpty.classList.toggle("hidden", hasVisibleActivities);
  }

  document.querySelectorAll("[data-activity-card]").forEach((card) => {
    const key = card.getAttribute("data-activity-card");
    const shouldShow = allowed && enabled.has(key);

    card.classList.toggle("hidden", !shouldShow);
  });

  if (!hasVisibleActivities && document.getElementById("tab-activities")?.classList.contains("active")) {
    switchToTab("dashboard");
  }
}

function loadDragSetting() {
  chrome.storage.local.get(STORAGE_DRAG_KEY, (result) => {
    if (dragCheckbox) {
      dragCheckbox.checked = result[STORAGE_DRAG_KEY] !== false;
    }
  });
}

function saveDragSetting(enabled) {
  chrome.storage.local.set({
    [STORAGE_DRAG_KEY]: enabled
  });

  sendToTargetTab({
    type: "DMS_SET_DRAG_ENABLED",
    payload: { enabled }
  });
}

function loadLogoVisibleSetting() {
  chrome.storage.local.get(STORAGE_LOGO_VISIBLE_KEY, (result) => {
    const visible = result[STORAGE_LOGO_VISIBLE_KEY] !== false;

    if (logoVisibleCheckbox) {
      logoVisibleCheckbox.checked = visible;
    }

    sendToTargetTab({
      type: "DMS_SET_LOGO_VISIBLE",
      payload: { visible }
    });
  });
}

function saveLogoVisibleSetting(visible) {
  chrome.storage.local.set({
    [STORAGE_LOGO_VISIBLE_KEY]: visible
  });

  sendToTargetTab({
    type: "DMS_SET_LOGO_VISIBLE",
    payload: { visible }
  });
}

function loadUserNotes() {
  chrome.storage.local.get(STORAGE_USER_NOTES_KEY, (result) => {
    dashboardState.userNotes = result[STORAGE_USER_NOTES_KEY] || {};
    renderUserAnalysis();
  });
}

function saveUserNote() {
  if (!isModAllowed()) return;
  if (!dashboardState.selectedUser) return;

  const key = getUserKey(dashboardState.selectedUser);
  dashboardState.userNotes[key] = userNoteInput?.value || "";

  chrome.storage.local.set({
    [STORAGE_USER_NOTES_KEY]: dashboardState.userNotes
  });
}

function loadActionLog() {
  chrome.storage.local.get(STORAGE_ACTION_LOG_KEY, (result) => {
    dashboardState.actionLog = result[STORAGE_ACTION_LOG_KEY] || [];
    renderActionLog();
  });
}

function saveActionLog() {
  chrome.storage.local.set({
    [STORAGE_ACTION_LOG_KEY]: dashboardState.actionLog
  });
}

function loadChatLog() {
  chrome.storage.local.get(STORAGE_CHAT_LOG_KEY, (result) => {
    const saved = result[STORAGE_CHAT_LOG_KEY] || {};

    dashboardState.chatLogsByChannel = Array.isArray(saved)
      ? { unknown: saved }
      : saved;

    setCurrentChannelLog(getCurrentLogChannel());
    updateChatLogCount();
  });
}

function saveChatLog() {
  if (!isModAllowed()) return;

  const channel = getCurrentLogChannel();

  dashboardState.chatLogsByChannel[channel] = dashboardState.chatLog;

  chrome.storage.local.set({
    [STORAGE_CHAT_LOG_KEY]: dashboardState.chatLogsByChannel
  });

  dashboardState.unsavedChatLogChannels.delete(channel);
  updateChatLogCount();
}

function updateChatLogCount() {
  const channel = getCurrentLogChannel();
  dashboardState.chatLog = ensureChannelLog(channel);

  if (chatLogCountElement) {
    chatLogCountElement.textContent = String(dashboardState.chatLog.length);
  }

  if (chatLogCurrentChannelElement) {
    chatLogCurrentChannelElement.textContent = channel;
  }

  if (chatLogRecordStateElement) {
    chatLogRecordStateElement.textContent = dashboardState.chatLogSettings.enabled
      ? t("chatLogRecordingOn")
      : t("chatLogRecordingOff");
  }

  renderChatLogPreview();
}

function renderChatLogPreview() {
  if (!chatLogPreviewElement) return;

  const channelLog = ensureChannelLog(getCurrentLogChannel());

  if (!channelLog.length) {
    chatLogPreviewElement.innerHTML = `<div class="empty-state">${escapeHtml(t("chatLogPreviewEmpty"))}</div>`;
    return;
  }

  const previewEntries = channelLog.slice(-80).reverse();

  chatLogPreviewElement.innerHTML = previewEntries
    .map((entry) => `<div class="chatlog-line">${escapeHtml(getMessageLogLine(entry))}</div>`)
    .join("");
}

function shouldLogMessage(message) {
  if (!isModAllowed()) return false;
  if (!dashboardState.chatLogSettings.enabled) return false;

  if (dashboardState.chatLogSettings.mode === "flagged") {
    return isMessageFlagged(message);
  }

  return true;
}

function addChatLogEntry(message) {
  if (!isModAllowed()) return;
  if (!message?.id) return;
  if (!shouldLogMessage(message)) return;

  const channel = message.channel || getCurrentLogChannel();
  const channelLog = ensureChannelLog(channel);

  if (channelLog.some((entry) => entry.id === message.id)) return;

  const entry = {
    id: message.id,
    timestamp: message.timestamp || new Date().toISOString(),
    displayedTime: message.displayedTime || message.localTime || formatTime(message),
    streamDuration: getStreamDurationText(channel),
    channel,
    username: message.username || "",
    message: message.message || "",
    flagged: isMessageFlagged(message),
    score: message.analysis?.score || 0,
    flags: Array.isArray(message.analysis?.flags) ? message.analysis.flags : []
  };

  channelLog.push(entry);

  if (channelLog.length > 5000) {
    channelLog.shift();
  }

  dashboardState.chatLogsByChannel[channel] = channelLog;

  if (channel === getCurrentLogChannel()) {
    dashboardState.chatLog = channelLog;
  }

  markChatLogUnsaved(channel);

  chrome.storage.local.set({
    [STORAGE_CHAT_LOG_KEY]: dashboardState.chatLogsByChannel
  });

  updateChatLogCount();
}

function exportChatLog() {
  if (!isModAllowed()) return;

  const channel = getCurrentLogChannel();
  const channelLog = ensureChannelLog(channel);

  if (!channelLog.length) {
    setStatusKey("statusChatLogExported");
    return;
  }

  const lines = channelLog.map((entry) => {
    const baseLine = getMessageLogLine(entry);

    if (!entry.flagged) return baseLine;

    return `${baseLine} [FLAGGED score=${entry.score} flags=${(entry.flags || []).join(", ")}]`;
  });

  const text = [
    "DGMT Chat Log",
    `Channel: ${channel}`,
    `Mode: ${dashboardState.chatLogSettings.mode}`,
    `Exported: ${formatFullTimestamp(new Date().toISOString())}`,
    "",
    ...lines
  ].join("\n");

  const blob = new Blob([text], {
    type: "text/plain;charset=utf-8"
  });

  const url = URL.createObjectURL(blob);
  const safeChannel = String(channel).replace(/[^a-z0-9_-]/gi, "_");
  const fileName = `DGMT_chatlog_${safeChannel}_${new Date().toISOString().slice(0, 10)}.txt`;

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);

  saveChatLog();
  setStatusKey("statusChatLogExported");
}

function clearChatLog() {
  if (!isModAllowed()) return;

  const channel = getCurrentLogChannel();

  dashboardState.chatLogsByChannel[channel] = [];
  dashboardState.chatLog = [];
  dashboardState.unsavedChatLogChannels.delete(channel);

  chrome.storage.local.set({
    [STORAGE_CHAT_LOG_KEY]: dashboardState.chatLogsByChannel
  });

  updateChatLogCount();
  setStatusKey("statusChatLogCleared");
}

function sendToTargetTab(message) {
  if (!Number.isFinite(TARGET_TAB_ID)) return;

  chrome.tabs.sendMessage(TARGET_TAB_ID, message);
}

function resetLogoPosition() {
  sendToTargetTab({
    type: "DMS_RESET_BUTTON_POSITION"
  });
}

function handleChannelChangeForLogs(nextChannel) {
  const previousChannel = dashboardState.lastLogChannel;

  if (
    previousChannel &&
    previousChannel !== nextChannel &&
    dashboardState.unsavedChatLogChannels.has(previousChannel)
  ) {
    const shouldSave = window.confirm(t("confirmSaveLogs").replace("{channel}", previousChannel));

    if (shouldSave) {
      chrome.storage.local.set({
        [STORAGE_CHAT_LOG_KEY]: dashboardState.chatLogsByChannel
      });

      dashboardState.unsavedChatLogChannels.delete(previousChannel);
    } else {
      delete dashboardState.chatLogsByChannel[previousChannel];
      dashboardState.unsavedChatLogChannels.delete(previousChannel);
    }
  }

  setCurrentChannelLog(nextChannel);
  updateChatLogCount();
}

function updateActiveChat(data) {
  dashboardState.activeChannelData = data || null;

  const nextChannel = data?.activeChannel || "unknown";
  handleChannelChangeForLogs(nextChannel);

  if (activeChatElement) {
    activeChatElement.textContent = data?.activeChannel
      ? `${t("activeIn")} twitch.tv/${data.activeChannel}`
      : t("noActiveChat");
  }

  updateModOnlyVisibility();
  updateStreamActivitiesUi();
  updateChatLogCount();
}

function updateStreamInfo(streamInfo) {
  dashboardState.streamInfo = streamInfo;

  if (streamTitleInput) {
    streamTitleInput.value = streamInfo?.title || "";
  }

  if (streamGameInput) {
    streamGameInput.value = streamInfo?.game || "";
  }

  if (streamTogetherInput) {
    const users = Array.isArray(streamInfo?.streamTogetherUsers)
      ? streamInfo.streamTogetherUsers.filter(Boolean)
      : [];

    streamTogetherInput.value = users.length ? users.join(", ") : t("streamTogetherInactive");
  }
}

function updateAdInfo(adInfo) {
  dashboardState.adInfo = adInfo;

  if (streamAdInput) {
    streamAdInput.value = adInfo?.isAdRunning ? t("adRunning") : t("noAd");
  }
}

function updateMessageCount() {
  if (messageCountElement) {
    messageCountElement.textContent = String(dashboardState.messages.length);
  }
}

function getFilteredMessages() {
  return dashboardState.messages.filter((message) => isMessageFlagged(message));
}

function getUserMessages(username) {
  const target = String(username || "").toLowerCase();

  return dashboardState.messages.filter((message) => {
    return String(message.username || "").toLowerCase() === target;
  });
}

function getUserStats(username) {
  const messages = getUserMessages(username);
  const flaggedMessages = messages.filter((message) => isMessageFlagged(message));
  const scores = messages.map((message) => Number(message.analysis?.score || 0));

  const highestScore = scores.length ? Math.max(...scores) : 0;
  const averageScore = scores.length
    ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
    : 0;

  const flagCounts = {};

  for (const message of messages) {
    const flags = Array.isArray(message.analysis?.flags) ? message.analysis.flags : [];

    for (const flag of flags) {
      flagCounts[flag] = (flagCounts[flag] || 0) + 1;
    }
  }

  return {
    messages,
    flaggedMessages,
    highestScore,
    averageScore,
    flagCounts
  };
}

function selectMessage(messageId) {
  const message = dashboardState.messages.find((item) => item.id === messageId);
  if (!message) return;

  dashboardState.selectedMessageId = message.id;
  dashboardState.selectedUser = message.username;

  if (shoutoutUsernameInput) {
    shoutoutUsernameInput.value = message.username || "";
  }

  renderMessages();
  renderSelectedMessagePanel();
  renderUserAnalysis();
  renderActionPanel();
  updateCommandPreview();
  updateModOnlyVisibility();
}

function clearSelectedMessage() {
  dashboardState.selectedMessageId = null;
  dashboardState.selectedUser = null;

  renderMessages();
  renderSelectedMessagePanel();
  renderUserAnalysis();
  renderActionPanel();
  updateCommandPreview();
}

function renderMessageCard(message) {
  const analysis = message.analysis || {};
  const level = analysis.level || "normal";
  const flags = Array.isArray(analysis.flags) ? analysis.flags : [];
  const activeAutomod = getActiveAutomodMessage()?.id === message.id;

  const selectedUserClass =
    dashboardState.selectedUser &&
    String(message.username || "").toLowerCase() === String(dashboardState.selectedUser).toLowerCase()
      ? "selected"
      : "";

  const selectedMessageClass = dashboardState.selectedMessageId === message.id ? "message-selected" : "";
  const automodActiveClass = activeAutomod ? "automod-active" : "";

  const roleFlags = [];

  if (message.isBroadcaster) roleFlags.push("broadcaster");
  if (message.isModerator) roleFlags.push("moderator");
  if (message.isVip) roleFlags.push("vip");
  if (message.isChatbot) roleFlags.push("chatbot");

  const flagHtml = flags
    .map((flag) => `<span class="analysis-flag">${escapeHtml(flag)}</span>`)
    .join("");

  const roleHtml = roleFlags
    .map((role) => `<span class="analysis-flag">${escapeHtml(role)}</span>`)
    .join("");

  const analysisHtml =
    level !== "normal"
      ? `<div class="analysis-flags"><span class="analysis-score">Score ${escapeHtml(analysis.score ?? 0)}</span>${flagHtml}</div>`
      : roleHtml
        ? `<div class="analysis-flags">${roleHtml}</div>`
        : "";

  return `
    <article class="chat-message ${escapeHtml(level)} ${selectedUserClass} ${selectedMessageClass} ${automodActiveClass}" data-message-id="${escapeHtml(message.id)}">
      <div class="chat-message-header">
        <span class="chat-username">${escapeHtml(message.username)}</span>
        <span class="chat-time">${escapeHtml(formatTime(message))}</span>
      </div>

      <div class="chat-text">${escapeHtml(message.message)}</div>

      <div class="chat-meta">
        <span class="chat-source">${escapeHtml(message.source || "unknown")}</span>
        <span class="chat-source">${escapeHtml(formatFullTimestamp(message.timestamp))}</span>
      </div>

      ${analysisHtml}
    </article>
  `;
}

function bindMessageClicks(rootElement) {
  rootElement.querySelectorAll(".chat-message[data-message-id]").forEach((messageElement) => {
    messageElement.addEventListener("click", () => {
      selectMessage(messageElement.getAttribute("data-message-id"));
    });
  });
}

function renderFilteredMessages() {
  if (!filteredFeedElement) return;

  const filteredMessages = getFilteredMessages();

  if (filteredMessages.length === 0) {
    filteredFeedElement.innerHTML = `<div class="empty-state">${escapeHtml(t("noFilteredMessages"))}</div>`;
    return;
  }

  filteredFeedElement.innerHTML = filteredMessages.map((message) => renderMessageCard(message)).join("");
  bindMessageClicks(filteredFeedElement);
}

function renderMessages() {
  if (!chatFeedElement) return;

  if (dashboardState.messages.length === 0) {
    chatFeedElement.innerHTML = `<div class="empty-state">${escapeHtml(t("noMessages"))}</div>`;
    updateMessageCount();
    renderFilteredMessages();
    return;
  }

  chatFeedElement.innerHTML = dashboardState.messages.map((message) => renderMessageCard(message)).join("");

  bindMessageClicks(chatFeedElement);
  updateMessageCount();
  renderFilteredMessages();
}

function renderSelectedMessagePanel() {
  if (!selectedMessageEmpty || !selectedMessageContent) return;

  const message = getSelectedMessage();

  if (!message) {
    selectedMessageEmpty.classList.remove("hidden");
    selectedMessageContent.classList.add("hidden");
    return;
  }

  selectedMessageEmpty.classList.add("hidden");
  selectedMessageContent.classList.remove("hidden");

  selectedMessageUser.textContent = message.username || "-";
  selectedMessageText.textContent = message.message || "-";
}

function renderUserAnalysis() {
  if (!userAnalysisEmpty || !userAnalysisContent) return;

  const username = dashboardState.selectedUser;

  if (!username) {
    userAnalysisEmpty.classList.remove("hidden");
    userAnalysisContent.classList.add("hidden");
    return;
  }

  const stats = getUserStats(username);
  const userKey = getUserKey(username);

  userAnalysisEmpty.classList.add("hidden");
  userAnalysisContent.classList.remove("hidden");

  selectedUsernameElement.textContent = username;
  userMessageCountElement.textContent = String(stats.messages.length);
  userFlaggedCountElement.textContent = String(stats.flaggedMessages.length);
  userHighestScoreElement.textContent = String(stats.highestScore);
  userAverageScoreElement.textContent = String(stats.averageScore);

  const flagEntries = Object.entries(stats.flagCounts).sort((a, b) => b[1] - a[1]);

  userFlagsElement.innerHTML =
    flagEntries.length === 0
      ? `<span class="analysis-flag">${escapeHtml(t("noFlags"))}</span>`
      : flagEntries
          .map(([flag, count]) => `<span class="analysis-flag">${escapeHtml(flag)} ×${count}</span>`)
          .join("");

  if (userNoteInput) {
    userNoteInput.value = isModAllowed() ? dashboardState.userNotes[userKey] || "" : "";
  }

  const recentMessages = stats.messages.slice(0, 8);

  userRecentMessagesElement.innerHTML =
    recentMessages.length === 0
      ? `<div class="empty-state">${escapeHtml(t("noMessages"))}</div>`
      : recentMessages.map((message) => renderMessageCard(message)).join("");

  bindMessageClicks(userRecentMessagesElement);
}

function getTimeoutSeconds() {
  const weeks = Number(timeoutInputs.weeks?.value || 0);
  const days = Number(timeoutInputs.days?.value || 0);
  const hours = Number(timeoutInputs.hours?.value || 0);
  const minutes = Number(timeoutInputs.minutes?.value || 0);
  const seconds = Number(timeoutInputs.seconds?.value || 0);

  const total = Math.floor(
    weeks * 7 * 24 * 60 * 60 +
      days * 24 * 60 * 60 +
      hours * 60 * 60 +
      minutes * 60 +
      seconds
  );

  return Math.max(1, Math.min(MAX_TIMEOUT_SECONDS, total));
}

function setTimeoutFromSeconds(totalSeconds) {
  let remaining = Math.max(1, Math.min(MAX_TIMEOUT_SECONDS, Number(totalSeconds || 0)));

  const weeks = Math.floor(remaining / (7 * 24 * 60 * 60));
  remaining -= weeks * 7 * 24 * 60 * 60;

  const days = Math.floor(remaining / (24 * 60 * 60));
  remaining -= days * 24 * 60 * 60;

  const hours = Math.floor(remaining / (60 * 60));
  remaining -= hours * 60 * 60;

  const minutes = Math.floor(remaining / 60);
  remaining -= minutes * 60;

  if (timeoutInputs.weeks) timeoutInputs.weeks.value = weeks;
  if (timeoutInputs.days) timeoutInputs.days.value = days;
  if (timeoutInputs.hours) timeoutInputs.hours.value = hours;
  if (timeoutInputs.minutes) timeoutInputs.minutes.value = minutes;
  if (timeoutInputs.seconds) timeoutInputs.seconds.value = remaining;

  updateCommandPreview();
}

function addTimeoutSeconds(secondsToAdd) {
  const currentSeconds = getTimeoutSeconds();
  const nextSeconds = Math.min(MAX_TIMEOUT_SECONDS, currentSeconds + Number(secondsToAdd || 0));
  setTimeoutFromSeconds(nextSeconds);
}

function formatDuration(seconds) {
  let remaining = Math.max(1, Math.min(MAX_TIMEOUT_SECONDS, Number(seconds || 0)));

  const weeks = Math.floor(remaining / (7 * 24 * 60 * 60));
  remaining -= weeks * 7 * 24 * 60 * 60;

  const days = Math.floor(remaining / (24 * 60 * 60));
  remaining -= days * 24 * 60 * 60;

  const hours = Math.floor(remaining / (60 * 60));
  remaining -= hours * 60 * 60;

  const minutes = Math.floor(remaining / 60);
  remaining -= minutes * 60;

  const parts = [];

  if (weeks) parts.push(`${weeks}w`);
  if (days) parts.push(`${days}d`);
  if (hours) parts.push(`${hours}h`);
  if (minutes) parts.push(`${minutes}m`);
  if (remaining) parts.push(`${remaining}s`);

  return parts.join(" ") || "1s";
}

function buildCommand(action) {
  const username = dashboardState.selectedUser;
  const selectedMessage = getSelectedMessage();
  const reason = actionReasonInput?.value?.trim() || "";

  if (!username) return "";

  if (action === "ban") return `/ban ${username}${reason ? ` ${reason}` : ""}`;
  if (action === "unban") return `/unban ${username}`;
  if (action === "timeout") return `/timeout ${username} ${getTimeoutSeconds()}${reason ? ` ${reason}` : ""}`;
  if (action === "untimeout") return `/untimeout ${username}`;
  if (action === "warn") return `/warn ${username}${reason ? ` ${reason}` : ""}`;

  if (action === "delete") {
    return selectedMessage
      ? `Delete selected message from ${username}: "${selectedMessage.message}"`
      : "Select a message first";
  }

  if (action === "report") {
    return selectedMessage
      ? `Report ${username} for selected message: "${selectedMessage.message}"`
      : `Report ${username} manually via Twitch user card`;
  }

  if (action === "pin") {
    return selectedMessage
      ? `Pin selected message from ${username}: "${selectedMessage.message}"`
      : "Select a message first";
  }

  if (action === "automod-approve") {
    return selectedMessage
      ? `Approve AutoMod message from ${username}: "${selectedMessage.message}"`
      : "Approve selected AutoMod message later via Twitch API";
  }

  if (action === "automod-deny") {
    return selectedMessage
      ? `Deny AutoMod message from ${username}: "${selectedMessage.message}"`
      : "Deny selected AutoMod message later via Twitch API";
  }

  return "";
}

function updateTimeoutCommandUi() {
  const commandType = getSelectedTimeoutCommandType();
  const showTimeoutOptions = commandType === "timeout";

  if (timeoutDurationSection) {
    timeoutDurationSection.classList.toggle("hidden", !showTimeoutOptions);
  }

  if (timeoutReasonSection) {
    timeoutReasonSection.classList.toggle("hidden", commandType === "untimeout" || commandType === "unban");
  }

  updateCommandPreview();
}

function updateCommandPreview() {
  const commandType = getSelectedTimeoutCommandType();
  const seconds = getTimeoutSeconds();

  if (timeoutInputs.total) {
    timeoutInputs.total.value = `${seconds}s · ${formatDuration(seconds)}`;
  }

  if (!commandPreviewOutput) return;
  commandPreviewOutput.textContent = buildCommand(commandType) || `/${commandType} username`;
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    setStatusKey("statusCommandCopied");
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
    setStatusKey("statusCommandCopied");
  }
}

function addActionLog(action, command) {
  const selectedMessage = getSelectedMessage();

  const entry = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    action,
    command,
    username: dashboardState.selectedUser,
    selectedMessageId: selectedMessage?.id || null,
    selectedMessageText: selectedMessage?.message || "",
    channel: getActiveChannelName(),
    timestamp: new Date().toISOString()
  };

  dashboardState.actionLog.unshift(entry);

  if (dashboardState.actionLog.length > 100) {
    dashboardState.actionLog.pop();
  }

  saveActionLog();
  renderActionLog();
}

function renderActionLog() {
  if (!actionLogElement) return;

  if (dashboardState.actionLog.length === 0) {
    actionLogElement.innerHTML = `<div class="empty-state">${escapeHtml(t("noActionsYet"))}</div>`;
    return;
  }

  actionLogElement.innerHTML = dashboardState.actionLog
    .map((entry) => {
      const time = formatFullTimestamp(entry.timestamp);
      const messageHtml = entry.selectedMessageText
        ? `<code>${escapeHtml(entry.selectedMessageText)}</code>`
        : "";

      return `
        <div class="action-log-entry">
          <strong>${escapeHtml(time)} · ${escapeHtml(entry.action)} · ${escapeHtml(entry.username || "")}</strong>
          <code>${escapeHtml(entry.command)}</code>
          ${messageHtml}
        </div>
      `;
    })
    .join("");
}

function renderActionPanel() {
  if (!actionEmpty || !actionContent) return;

  if (!dashboardState.selectedUser) {
    actionEmpty.classList.remove("hidden");
    actionContent.classList.add("hidden");
    return;
  }

  actionEmpty.classList.add("hidden");
  actionContent.classList.remove("hidden");

  actionSelectedUsernameElement.textContent = dashboardState.selectedUser;

  const selectedMessage = getSelectedMessage();
  actionSelectedMessageState.textContent = selectedMessage ? selectedMessage.message.slice(0, 40) : "-";

  updateCommandPreview();
}

async function prepareAction(action) {
  if (!isModAllowed()) return;
  if (!dashboardState.selectedUser) return;

  const command = buildCommand(action);
  const needsMessage = action === "delete" || action === "pin";

  if (needsMessage && !getSelectedMessage()) {
    updateStatus(t("selectedMessageEmpty"));
    return;
  }

  if (
    action === "delete" ||
    action === "report" ||
    action === "pin" ||
    action === "automod-approve" ||
    action === "automod-deny"
  ) {
    addActionLog(action, command);
    setStatusKey("statusActionPrepared");
    return;
  }

  if (action === "warn") {
    await copyText(command);
    addActionLog("warn", command);
    setStatusKey("statusUserWarned");
    return;
  }

  await copyText(command);
  addActionLog(action, command);
}

function addMessage(message) {
  if (!message?.id) return;
  if (dashboardState.messages.some((item) => item.id === message.id)) return;

  const analyzedMessage = analyzeMessage(message);

  dashboardState.messages.unshift(analyzedMessage);

  if (dashboardState.messages.length > dashboardState.maxMessages) {
    dashboardState.messages.pop();
  }

  addChatLogEntry(analyzedMessage);

  if (isModAllowed()) {
    addToAutomodQueue(analyzedMessage);
  }

  renderMessages();
  renderSelectedMessagePanel();
  renderUserAnalysis();
  renderActionPanel();
  renderAutomodQueue();
  setStatusKey("statusLive");
}

function loadDashboardState() {
  chrome.runtime.sendMessage({ type: "GET_DASHBOARD_STATE", tabId: TARGET_TAB_ID }, (response) => {
    if (!response) {
      setStatusKey("statusWaiting");
      updateModOnlyVisibility();
      return;
    }

    updateActiveChat(response);
    updateStreamInfo(response.streamInfo);
    updateAdInfo(response.adInfo);

    dashboardState.messages = (response.messages || []).map((message) => analyzeMessage(message));

    rebuildAutomodQueue();
    renderMessages();
    renderSelectedMessagePanel();
    renderUserAnalysis();
    renderActionPanel();
    updateModOnlyVisibility();

    setStatusKey(dashboardState.messages.length > 0 ? "statusLoaded" : "statusReady");
  });
}

function updateModOnlyVisibility() {
  const allowed = isModAllowed();

  document.querySelectorAll("[data-mod-view-only]").forEach((element) => {
    element.classList.toggle("hidden", !allowed);
  });

  if (!allowed && document.getElementById("tab-activities")?.classList.contains("active")) {
    switchToTab("dashboard");
  }

  renderAutomodQueue();
  updateStreamActivitiesUi();
  updateChatLogCount();
}

function switchToTab(target) {
  tabButtons.forEach((tabButton) => tabButton.classList.remove("active"));
  tabContents.forEach((content) => content.classList.remove("active"));

  const targetButton = document.querySelector(`.tab-button[data-tab="${target}"]`);
  const targetContent = document.getElementById(`tab-${target}`);

  if (targetButton) targetButton.classList.add("active");
  if (targetContent) targetContent.classList.add("active");
}

function setupTabs() {
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.getAttribute("data-tab");
      switchToTab(target);
    });
  });
}

function setupCollapsiblePanels() {
  chrome.storage.local.get(STORAGE_COLLAPSE_KEY, (result) => {
    const collapsedPanels = result[STORAGE_COLLAPSE_KEY] || {};

    document.querySelectorAll(".panel[data-collapse-key]").forEach((panel) => {
      const key = panel.getAttribute("data-collapse-key");
      const titleRow = panel.querySelector(".panel-title-row");

      if (!key || !titleRow || titleRow.querySelector(".collapse-button")) return;

      const button = document.createElement("button");
      button.className = "collapse-button";
      button.type = "button";

      if (collapsedPanels[key]) {
        panel.classList.add("collapsed");
        button.textContent = "+";
      } else {
        button.textContent = "−";
      }

      button.addEventListener("click", () => {
        panel.classList.toggle("collapsed");

        const isCollapsed = panel.classList.contains("collapsed");
        button.textContent = isCollapsed ? "+" : "−";

        collapsedPanels[key] = isCollapsed;

        chrome.storage.local.set({
          [STORAGE_COLLAPSE_KEY]: collapsedPanels
        });
      });

      titleRow.appendChild(button);
    });
  });
}

window.addEventListener("beforeunload", (event) => {
  if (!isModAllowed()) return;
  if (!hasUnsavedChatLogs()) return;

  event.preventDefault();
  event.returnValue = t("confirmCloseLogs");

  return event.returnValue;
});

setupTabs();

if (languageSelect) languageSelect.addEventListener("change", (event) => saveLanguage(event.target.value));
if (contentModeSelect) contentModeSelect.addEventListener("change", (event) => saveContentMode(event.target.value));
if (chatLogEnabledInput) chatLogEnabledInput.addEventListener("change", saveChatLogSettings);
if (chatLogModeSelect) chatLogModeSelect.addEventListener("change", saveChatLogSettings);
if (customListModeSelect) customListModeSelect.addEventListener("change", updateCustomListUi);
if (saveCustomListsButton) saveCustomListsButton.addEventListener("click", saveCustomLists);
if (clearCustomListsButton) clearCustomListsButton.addEventListener("click", clearCustomLists);
if (saveAppearanceButton) saveAppearanceButton.addEventListener("click", saveAppearance);
if (resetAppearanceButton) resetAppearanceButton.addEventListener("click", resetAppearance);

if (accentColorInput) {
  accentColorInput.addEventListener("input", () => {
    dashboardState.appearance.accentColor = accentColorInput.value || "#9147ff";
    applyAppearance();
  });
}

if (secondaryColorInput) {
  secondaryColorInput.addEventListener("input", () => {
    dashboardState.appearance.secondaryColor = secondaryColorInput.value || "#bf94ff";
    applyAppearance();
  });
}

if (gradientEnabledCheckbox) {
  gradientEnabledCheckbox.addEventListener("change", () => {
    dashboardState.appearance.gradientEnabled = Boolean(gradientEnabledCheckbox.checked);
    applyAppearance();
  });
}

if (gradientAngleInput) {
  gradientAngleInput.addEventListener("input", () => {
    dashboardState.appearance.gradientAngle = Number(gradientAngleInput.value || 135);
    applyAppearance();
  });
}

if (gradientStyleSelect) {
  gradientStyleSelect.addEventListener("change", () => {
    dashboardState.appearance.gradientStyle = gradientStyleSelect.value === "radial" ? "radial" : "linear";
    applyAppearance();
  });
}

if (streamActivityDropdownToggle) {
  streamActivityDropdownToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    streamActivityDropdownMenu?.classList.toggle("hidden");
  });
}

streamActivityOptions.forEach((option) => {
  option.addEventListener("change", saveStreamActivities);
});

document.addEventListener("click", (event) => {
  if (!streamActivityDropdown || streamActivityDropdown.contains(event.target)) return;
  streamActivityDropdownMenu?.classList.add("hidden");
});

if (saveStreamActivitiesButton) saveStreamActivitiesButton.addEventListener("click", saveStreamActivities);
if (clearStreamActivitiesButton) clearStreamActivitiesButton.addEventListener("click", clearStreamActivities);

if (dragCheckbox) dragCheckbox.addEventListener("change", (event) => saveDragSetting(event.target.checked));
if (logoVisibleCheckbox) logoVisibleCheckbox.addEventListener("change", (event) => saveLogoVisibleSetting(event.target.checked));
if (resetPositionButton) resetPositionButton.addEventListener("click", resetLogoPosition);
if (clearSelectedMessageButton) clearSelectedMessageButton.addEventListener("click", clearSelectedMessage);
if (saveUserNoteButton) saveUserNoteButton.addEventListener("click", saveUserNote);

if (copySelectedMessageButton) {
  copySelectedMessageButton.addEventListener("click", async () => {
    const selectedMessage = getSelectedMessage();
    if (!selectedMessage) return;

    await copyText(selectedMessage.message);
    setStatusKey("statusMessageCopied");
  });
}

if (automodQueuePrevButton) automodQueuePrevButton.addEventListener("click", () => jumpAutomodQueue(-1));
if (automodQueueNextButton) automodQueueNextButton.addEventListener("click", () => jumpAutomodQueue(1));
if (automodQueueSelectButton) automodQueueSelectButton.addEventListener("click", selectActiveAutomodMessage);
if (automodQueueApproveButton) automodQueueApproveButton.addEventListener("click", () => handleAutomodQueueAction("automod-approve"));
if (automodQueueDenyButton) automodQueueDenyButton.addEventListener("click", () => handleAutomodQueueAction("automod-deny"));

document.querySelectorAll(".action-button[data-action]").forEach((button) => {
  button.addEventListener("click", () => prepareAction(button.getAttribute("data-action")));
});

document.querySelectorAll(".preset-button[data-timeout-add]").forEach((button) => {
  button.addEventListener("click", () => {
    addTimeoutSeconds(Number(button.getAttribute("data-timeout-add")));
  });
});

document.querySelectorAll(".reason-preset-button[data-reason]").forEach((button) => {
  button.addEventListener("click", () => {
    if (!actionReasonInput) return;

    actionReasonInput.value = button.getAttribute("data-reason") || "";
    updateCommandPreview();
  });
});

Object.entries(timeoutInputs).forEach(([key, input]) => {
  if (!input || key === "total") return;

  input.addEventListener("input", () => {
    const seconds = getTimeoutSeconds();
    setTimeoutFromSeconds(seconds);
  });
});

if (timeoutCommandTypeSelect) timeoutCommandTypeSelect.addEventListener("change", updateTimeoutCommandUi);
if (actionReasonInput) actionReasonInput.addEventListener("input", updateCommandPreview);
if (copyTimeoutCommandButton) copyTimeoutCommandButton.addEventListener("click", () => prepareAction(getSelectedTimeoutCommandType()));
if (sendTimeoutActionButton) sendTimeoutActionButton.addEventListener("click", () => prepareAction(getSelectedTimeoutCommandType()));

if (clearActionLogButton) {
  clearActionLogButton.addEventListener("click", () => {
    dashboardState.actionLog = [];
    saveActionLog();
    renderActionLog();
  });
}

if (exportChatLogButton) exportChatLogButton.addEventListener("click", exportChatLog);
if (clearChatLogButton) clearChatLogButton.addEventListener("click", clearChatLog);

if (useSelectedUserShoutoutButton) {
  useSelectedUserShoutoutButton.addEventListener("click", async () => {
    if (!isModAllowed()) return;
    if (!dashboardState.selectedUser) return;

    const username = String(dashboardState.selectedUser).replace("@", "").trim();
    if (!username) return;

    if (shoutoutUsernameInput) {
      shoutoutUsernameInput.value = username;
    }

    const command = `/shoutout ${username}`;

    await copyText(command);
    addActionLog("shoutout", command);
  });
}

if (copyShoutoutCommandButton) {
  copyShoutoutCommandButton.addEventListener("click", async () => {
    if (!isModAllowed()) return;

    const username = String(shoutoutUsernameInput?.value || "").replace("@", "").trim();
    if (!username) return;

    const command = `/shoutout ${username}`;

    await copyText(command);
    addActionLog("shoutout", command);
  });
}

document.querySelectorAll(".activity-copy[data-activity-command]").forEach((button) => {
  button.addEventListener("click", () => copyActivityCommand(button.getAttribute("data-activity-command")));
});

document.querySelectorAll(".activity-send[data-activity-command]").forEach((button) => {
  button.addEventListener("click", () => prepareActivityCommand(button.getAttribute("data-activity-command")));
});

document.querySelectorAll(".activity-send-real[data-activity-command]").forEach((button) => {
  button.addEventListener("click", () => {
    sendActivityCommandToChat(button.getAttribute("data-activity-command"));
  });
});

Object.values(activityInputs).forEach((inputOrList) => {
  if (!inputOrList) return;

  inputOrList.addEventListener("input", () => updateAllActivityPreviews(true));
  inputOrList.addEventListener("change", () => updateAllActivityPreviews(true));
});

if (dashboardRaidChannelInput) {
  dashboardRaidChannelInput.addEventListener("input", () => updateAllActivityPreviews(true));
}

if (raidTextCommandTemplateInput) {
  raidTextCommandTemplateInput.addEventListener("input", () => updateAllActivityPreviews(true));
}

chrome.runtime.onMessage.addListener((message) => {
  if (!message?.type) return;
  if (message.tabId !== TARGET_TAB_ID && message.tabId !== null && message.tabId !== undefined) return;

  if (message.type === "DASHBOARD_ACTIVE_CHANNEL_UPDATE") updateActiveChat(message.payload);
  if (message.type === "DASHBOARD_STREAM_INFO_UPDATE") updateStreamInfo(message.payload);
  if (message.type === "DASHBOARD_AD_INFO_UPDATE") updateAdInfo(message.payload);
  if (message.type === "DASHBOARD_CHAT_MESSAGE") addMessage(message.payload);
});

loadAppearance();
loadLanguage();
loadActivityCommands();
loadCustomLists();
loadContentMode();
loadChatLogSettings();
loadStreamActivities();
loadDragSetting();
loadLogoVisibleSetting();
loadUserNotes();
loadActionLog();
loadChatLog();
loadDashboardState();
setupCollapsiblePanels();
updateTimeoutCommandUi();
updateAllActivityPreviews(false);
renderAutomodQueue();