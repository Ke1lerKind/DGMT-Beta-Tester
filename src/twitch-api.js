window.DrumgodTwitchApi = {
  async getStreamInfo(channel) {
    return null;
  },

  async updateStreamInfo(channel, data) {
    return {
      ok: false,
      reason: "Twitch API is not configured yet.",
      channel,
      data
    };
  },

  async getAdInfo(channel) {
    return null;
  },

  async timeoutUser(channel, username, seconds, reason = "") {
    return {
      ok: false,
      reason: "Twitch API is not configured yet.",
      channel,
      username,
      seconds,
      reasonText: reason
    };
  },

  async banUser(channel, username, reason = "") {
    return {
      ok: false,
      reason: "Twitch API is not configured yet.",
      channel,
      username,
      reasonText: reason
    };
  },

  async unbanUser(channel, username) {
    return {
      ok: false,
      reason: "Twitch API is not configured yet.",
      channel,
      username
    };
  },

  async untimeoutUser(channel, username) {
    return {
      ok: false,
      reason: "Twitch API is not configured yet.",
      channel,
      username
    };
  },

  async deleteMessage(channel, messageId) {
    return {
      ok: false,
      reason: "Twitch API is not configured yet.",
      channel,
      messageId
    };
  },

  async pinMessage(channel, messageId) {
    return {
      ok: false,
      reason: "Twitch API is not configured yet.",
      channel,
      messageId
    };
  },

  async sendShoutout(channel, username) {
    return {
      ok: false,
      reason: "Twitch API is not configured yet.",
      channel,
      username
    };
  },

  async approveAutoMod(channel, messageId) {
    return {
      ok: false,
      reason: "Twitch API is not configured yet.",
      channel,
      messageId
    };
  },

  async denyAutoMod(channel, messageId) {
    return {
      ok: false,
      reason: "Twitch API is not configured yet.",
      channel,
      messageId
    };
  }
};