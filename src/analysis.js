window.DrumgodMessageAnalyzer = {
  modes: {
    SAFE: "safe",
    MATURE: "mature"
  },

  severeTerms: [
    "kill yourself",
    "kys",
    "hang yourself",
    "end yourself",
    "go die",
    "bring dich um",
    "geh sterben",
    "verreck",
    "stirb",
    "rape",
    "vergewaltigung"
  ],

  extremistTerms: [
    "heil hitler",
    "sieg heil",
    "hitlergruß",
    "hitlergruss",
    "hakenkreuz",
    "ss rune",
    "nazi propaganda",
    "nsdap",
    "white power",
    "1488",
    "14 words"
  ],

  harassmentTerms: [
    "hurensohn",
    "hurentochter",
    "huso",
    "hs",
    "wichser",
    "pisser",
    "spast",
    "spasti",
    "bastard",
    "opfer",
    "idiot",
    "trottel",
    "vollidiot",
    "missgeburt",
    "abschaum",
    "versager",
    "drecksau",
    "arschloch",
    "fotze",
    "nutte",
    "lappen",
    "clown",
    "kek",
    "noob",
    "bot",
    "müll",
    "dreck",

    "moron",
    "trash",
    "loser",
    "worthless",
    "retard",
    "scumbag",
    "dumbass",
    "asshole",
    "clown",
    "garbage",
    "bot",
    "noob",

    "pendejo",
    "gilipollas",
    "puto",
    "puta",
    "cabrón",
    "cabron",

    "babaca",
    "otario",

    "stronzo",
    "coglione",

    "connard",
    "conasse",
    "salope",

    "salak",
    "aptal",
    "orospu",
    "piç",
    "pic",

    "debil",
    "kurwa",
    "klootzak",
    "sukkel",
    "blyat",
    "suka"
  ],

  matureLanguageTerms: [
    "fuck",
    "shit",
    "damn",
    "bitch",
    "wtf",
    "scheiße",
    "scheisse",
    "ficken",
    "gefickt",
    "arsch",
    "kacke",
    "mist",
    "mierda",
    "merda",
    "merde",
    "kurwa",
    "blyat"
  ],

  protectedClassHints: [
    "jude",
    "jew",
    "muslim",
    "christ",
    "black",
    "white",
    "asian",
    "schwul",
    "gay",
    "trans",
    "lesbian",
    "behindert",
    "disabled"
  ],

  promoTerms: [
    "schau",
    "schaut",
    "guck",
    "guckt",
    "zieh dir",
    "clip",
    "stream",
    "follow",
    "folgt",
    "subscribe",
    "sub",
    "check",
    "watch",
    "join",
    "kommt rüber",
    "come over",
    "my channel",
    "mein kanal",
    "mein stream"
  ],

  twitchSafeLinkPatterns: [
    /^https?:\/\/(www\.)?twitch\.tv\/[a-z0-9_]{3,25}\/clip\/[^\s]+$/i,
    /^https?:\/\/clips\.twitch\.tv\/[^\s]+$/i
  ],

  shortenerPatterns: [
    /bit\.ly/i,
    /tinyurl\.com/i,
    /t\.co/i,
    /goo\.gl/i,
    /is\.gd/i,
    /cutt\.ly/i,
    /rb\.gy/i,
    /shorturl\.at/i
  ],

  normalize(text) {
    return String(text || "")
      .toLowerCase()
      .replace(/[!?.,"'`´:;()[\]{}<>|/\\_-]/g, " ")
      .replace(/[@#$%^&*+=~]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  },

  escapeRegex(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  },

  addFlag(flags, flag) {
    if (!flags.includes(flag)) {
      flags.push(flag);
    }
  },

  normalizeList(list) {
    if (Array.isArray(list)) {
      return list
        .map((item) => String(item || "").trim())
        .filter(Boolean);
    }

    if (typeof list === "string") {
      return list
        .split(/\n|,/)
        .map((item) => item.trim())
        .filter(Boolean);
    }

    return [];
  },

  containsAny(text, list) {
    const normalized = this.normalize(text);

    return list.some((term) => {
      const normalizedTerm = this.normalize(term);
      if (!normalizedTerm) return false;

      const pattern = new RegExp(`(^|\\s)${this.escapeRegex(normalizedTerm)}($|\\s)`, "i");
      return pattern.test(normalized);
    });
  },

  includesAnyLoose(text, list) {
    const normalized = this.normalize(text);

    return list.some((term) => {
      const normalizedTerm = this.normalize(term);
      return normalizedTerm && normalized.includes(normalizedTerm);
    });
  },

  getUrls(text) {
    return String(text || "").match(/https?:\/\/[^\s]+|www\.[^\s]+/gi) || [];
  },

  isSafeTwitchLink(url, context = {}) {
    const rawUrl = String(url || "").trim();

    if (!rawUrl) return false;

    const normalizedUrl = rawUrl.startsWith("www.")
      ? `https://${rawUrl}`
      : rawUrl;

    const isKnownTwitchClip = this.twitchSafeLinkPatterns.some((pattern) => {
      return pattern.test(normalizedUrl);
    });

    if (!isKnownTwitchClip) return false;

    const currentChannel = String(context.channel || context.activeChannel || "")
      .replace("@", "")
      .toLowerCase()
      .trim();

    if (!currentChannel) return true;

    const match = normalizedUrl.match(/twitch\.tv\/([a-z0-9_]{3,25})\/clip\//i);

    if (!match) return true;

    const linkChannel = String(match[1] || "").toLowerCase();

    return linkChannel === currentChannel;
  },

  getNonSafeUrls(text, context = {}) {
    return this.getUrls(text).filter((url) => !this.isSafeTwitchLink(url, context));
  },

  hasLink(text, context = {}) {
    return this.getNonSafeUrls(text, context).length > 0;
  },

  hasSafeTwitchClipLink(text, context = {}) {
    return this.getUrls(text).some((url) => this.isSafeTwitchLink(url, context));
  },

  hasSuspiciousUrl(text, context = {}) {
    const urls = this.getNonSafeUrls(text, context);

    if (!urls.length) return false;

    return urls.some((url) => {
      return (
        /https?:\/\/\S{35,}/i.test(url) ||
        /[a-z0-9]{20,}/i.test(url) ||
        this.shortenerPatterns.some((pattern) => pattern.test(url))
      );
    });
  },

  hasManyLinks(text, context = {}) {
    return this.getNonSafeUrls(text, context).length >= 3;
  },

  getCapsRatio(text) {
    const letters = String(text || "").replace(/[^a-zA-ZÄÖÜäöüß]/g, "");

    if (letters.length < 8) return 0;

    const caps = letters.replace(/[^A-ZÄÖÜ]/g, "");
    return caps.length / letters.length;
  },

  hasRepeatedChars(text) {
    return /(.)\1{5,}/i.test(text);
  },

  getRepeatedWordScore(text) {
    const words = this.normalize(text).split(" ").filter(Boolean);

    if (words.length < 4) return 0;

    const counts = {};

    for (const word of words) {
      counts[word] = (counts[word] || 0) + 1;
    }

    const maxCount = Math.max(...Object.values(counts));

    if (maxCount >= 5) return 45;
    if (maxCount >= 4) return 35;
    if (maxCount >= 3) return 20;

    return 0;
  },

  isLikelyQuoteOrDiscussion(text) {
    const normalized = this.normalize(text);

    const hints = [
      "zitat",
      "quote",
      "hat gesagt",
      "sagte",
      "he said",
      "she said",
      "someone said",
      "das wort",
      "word means",
      "bedeutet",
      "nicht sagen",
      "sag nicht",
      "dont say",
      "don't say",
      "historisch",
      "geschichte",
      "history",
      "documentary",
      "dokumentation"
    ];

    return hints.some((hint) => normalized.includes(hint));
  },

  isDirectAttack(text) {
    const normalized = this.normalize(text);

    const directHints = [
      "du bist",
      "du kleiner",
      "du drecks",
      "du hurensohn",
      "du idiot",
      "du opfer",
      "du lappen",
      "deine mutter",
      "you are",
      "you're",
      "u are",
      "youre",
      "your mom",
      "@"
    ];

    return directHints.some((hint) => normalized.includes(hint));
  },

  isNegatedWarning(text) {
    const normalized = this.normalize(text);

    const hints = [
      "nicht",
      "kein",
      "keine",
      "dont",
      "don't",
      "do not",
      "stop saying",
      "hör auf",
      "hoer auf",
      "sag nicht",
      "nicht beleidigen"
    ];

    return hints.some((hint) => normalized.includes(hint));
  },

  isPrivilegedUser(chatMessage = {}) {
    const badges = Array.isArray(chatMessage.badges)
      ? chatMessage.badges.map((badge) => String(badge).toLowerCase())
      : [];

    const roles = Array.isArray(chatMessage.roles)
      ? chatMessage.roles.map((role) => String(role).toLowerCase())
      : [];

    return Boolean(
      chatMessage.isModerator ||
        chatMessage.isBroadcaster ||
        chatMessage.isStreamer ||
        chatMessage.isVip ||
        chatMessage.isChatbot ||
        roles.includes("moderator") ||
        roles.includes("broadcaster") ||
        roles.includes("vip") ||
        roles.includes("chatbot") ||
        roles.includes("bot") ||
        badges.includes("moderator") ||
        badges.includes("broadcaster") ||
        badges.includes("vip") ||
        badges.includes("chatbot") ||
        badges.includes("bot")
    );
  },

  getModeCustomLists(context = {}) {
    const mode = context.contentMode || this.modes.SAFE;
    const customLists = context.customLists || {};

    const safeLists = customLists.safe || {};
    const matureLists = customLists.mature || {};
    const modeLists = mode === this.modes.MATURE ? matureLists : safeLists;

    return {
      whitelist: this.normalizeList(modeLists.whitelist),
      blacklist: this.normalizeList(modeLists.blacklist)
    };
  },

  getContextMultiplier(text) {
    let multiplier = 1;

    if (this.isLikelyQuoteOrDiscussion(text)) {
      multiplier -= 0.45;
    }

    if (this.isNegatedWarning(text)) {
      multiplier -= 0.25;
    }

    if (this.isDirectAttack(text)) {
      multiplier += 0.45;
    }

    return Math.max(0.25, Math.min(1.6, multiplier));
  },

  getCleanResult(mode, extra = {}) {
    return {
      score: 0,
      level: "normal",
      flags: [],
      contextMultiplier: 1,
      contentMode: mode,
      reviewed: false,
      autoAction: false,
      ...extra
    };
  },

  analyze(chatMessage, context = {}) {
    const text = String(chatMessage?.message || "");
    const normalized = this.normalize(text);
    const mode = context.contentMode || this.modes.SAFE;

    if (this.isPrivilegedUser(chatMessage)) {
      return this.getCleanResult(mode, {
        ignoredReason: "privileged-user"
      });
    }

    const customLists = this.getModeCustomLists(context);

    if (this.containsAny(normalized, customLists.whitelist)) {
      return this.getCleanResult(mode, {
        ignoredReason: "custom-whitelist"
      });
    }

    let score = 0;
    const flags = [];

    const capsRatio = this.getCapsRatio(text);

    if (capsRatio > 0.75 && text.length >= 12) {
      score += mode === this.modes.MATURE ? 10 : 25;
      this.addFlag(flags, "caps");
    }

    if (this.hasRepeatedChars(text)) {
      score += 20;
      this.addFlag(flags, "repeated-chars");
    }

    const repeatedWordScore = this.getRepeatedWordScore(text);

    if (repeatedWordScore > 0) {
      score += repeatedWordScore;
      this.addFlag(flags, "repeated-words");
    }

    if (this.hasSafeTwitchClipLink(text, context)) {
      this.addFlag(flags, "twitch-clip-safe");
    }

    if (this.hasLink(text, context)) {
      score += 25;
      this.addFlag(flags, "link");
    }

    if (this.hasManyLinks(text, context)) {
      score += 25;
      this.addFlag(flags, "multi-link-spam");
    }

    if (this.hasSuspiciousUrl(text, context)) {
      score += 15;
      this.addFlag(flags, "suspicious-url");
    }

    if (this.hasLink(text, context) && this.includesAnyLoose(normalized, this.promoTerms)) {
      score += 20;
      this.addFlag(flags, "self-promo");
    }

    if (
      this.hasLink(text, context) &&
      /(^|\s)(schau|schaut|guck|guckt|watch|check|join|follow|folgt)(\s|$)/i.test(normalized)
    ) {
      score += 10;
      this.addFlag(flags, "promo-call");
    }

    if (this.containsAny(normalized, this.severeTerms)) {
      score += 85;
      this.addFlag(flags, "severe");
    }

    if (this.containsAny(normalized, this.extremistTerms)) {
      score += 90;
      this.addFlag(flags, "extremism");
    }

    if (this.containsAny(normalized, this.harassmentTerms)) {
      score += this.isDirectAttack(text)
        ? mode === this.modes.MATURE
          ? 65
          : 75
        : mode === this.modes.MATURE
          ? 35
          : 50;

      this.addFlag(flags, "harassment");
    }

    if (this.containsAny(normalized, this.protectedClassHints)) {
      score += 20;
      this.addFlag(flags, "protected-class-context");
    }

    if (this.containsAny(normalized, this.matureLanguageTerms)) {
      if (mode === this.modes.SAFE) {
        score += 20;
        this.addFlag(flags, "mature-language");
      }

      if (mode === this.modes.MATURE && this.isDirectAttack(text)) {
        score += 20;
        this.addFlag(flags, "directed-mature-language");
      }
    }

    if (this.containsAny(normalized, customLists.blacklist)) {
      score += 70;
      this.addFlag(flags, "custom-blacklist");
    }

    const contextMultiplier = this.getContextMultiplier(text);

    score = Math.round(score * contextMultiplier);
    score = Math.min(100, Math.max(0, score));

    const visibleFlags = flags.filter((flag) => flag !== "twitch-clip-safe");

    let level = "normal";

    if (score >= 70) {
      level = "danger";
    } else if (score >= 40) {
      level = "warning";
    } else if (score >= 20) {
      level = "notice";
    }

    return {
      score,
      level,
      flags: visibleFlags,
      contextMultiplier,
      contentMode: mode,
      reviewed: false,
      autoAction: false
    };
  }
};