window.DrumgodTwitchAuth = {
  mode: "beta_allow_channel_pages",

  config: {
    clientId: "",
    redirectUri: "",
    scopes: [
      "user:read:email",
      "moderator:read:chatters",
      "moderator:manage:banned_users",
      "moderator:manage:chat_messages",
      "channel:manage:broadcast"
    ]
  },

  isConfigured() {
    return Boolean(this.config.clientId && this.config.redirectUri);
  },

  isLoggedIn() {
    return false;
  },

  getAccessToken() {
    return null;
  },

  async canUseTool(channel, context = {}) {
    if (!channel) return false;

    if (this.mode === "safe_mod_view_only") {
      return Boolean(context.isModeratorView);
    }

    if (this.mode === "beta_allow_channel_pages") {
      return Boolean(channel);
    }

    return false;
  },

  async isModeratorInChannel(channel) {
    return false;
  }
};