class AdBlocker {
  constructor() {
    this.enabled = true;
    this.stats = {
      todayCount: 0,
      totalCount: 0,
      lastReset: new Date().toDateString()
    };
    
    this.initializeListeners();
    this.loadSettings();
  }

  async initializeListeners() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      switch (message.type) {
        case 'getStats':
          sendResponse(this.stats);
          break;
        case 'toggleEnabled':
          this.toggleBlocking(message.value);
          sendResponse({ success: true });
          break;
        case 'toggleWhitelist':
          this.handleWhitelist(message.domain);
          sendResponse({ success: true });
          break;
      }
    });

    chrome.declarativeNetRequest.onRuleMatchedDebug?.addListener(
      (info) => {
        this.updateStats();
      }
    );
  }

  async loadSettings() {
    const data = await chrome.storage.local.get(['enabled', 'stats', 'whitelist']);
    this.enabled = data.enabled !== undefined ? data.enabled : true;
    this.stats = data.stats || this.stats;
    
    if (new Date().toDateString() !== this.stats.lastReset) {
      this.stats.todayCount = 0;
      this.stats.lastReset = new Date().toDateString();
      this.saveSettings();
    }

    await this.updateRules();
  }

  async updateRules() {
    const rules = await this.generateRules();
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: await this.getExistingRuleIds(),
      addRules: rules
    });
  }

  async getExistingRuleIds() {
    const rules = await chrome.declarativeNetRequest.getDynamicRules();
    return rules.map(rule => rule.id);
  }

  async generateRules() {
    const adDomains = [
      "*doubleclick.net",
      "*google-analytics.com",
      "*facebook.com/plugins",
      "*creative.ak.fbcdn.net",
      "*adbrite.com",
      "*exponential.com",
      "*quantserve.com",
      "*scorecardresearch.com",
      "*zedo.com",
      "*ads.*",
      "*adserver.*",
      "*analytics.*",
      "*banner.*",
      "*ad.*"
    ];

    return adDomains.map((domain, index) => ({
      id: index + 1,
      priority: 1,
      action: {
        type: "block"
      },
      condition: {
        urlFilter: domain,
        resourceTypes: [
          "main_frame",
          "sub_frame",
          "stylesheet",
          "script",
          "image",
          "font",
          "object",
          "xmlhttprequest",
          "ping",
          "media",
          "websocket"
        ]
      }
    }));
  }

  async toggleBlocking(enabled) {
    this.enabled = enabled;
    await chrome.declarativeNetRequest.updateEnabledRulesets({
      enableRulesetIds: enabled ? ["default"] : [],
      disableRulesetIds: enabled ? [] : ["default"]
    });
    await this.saveSettings();
  }

  async handleWhitelist(domain) {
    const { whitelist = [] } = await chrome.storage.local.get('whitelist');
    const updatedWhitelist = whitelist.includes(domain)
      ? whitelist.filter(d => d !== domain)
      : [...whitelist, domain];
    
    await chrome.storage.local.set({ whitelist: updatedWhitelist });
    await this.updateRules();
  }

  async saveSettings() {
    await chrome.storage.local.set({
      enabled: this.enabled,
      stats: this.stats
    });
  }

  async updateStats() {
    this.stats.todayCount++;
    this.stats.totalCount++;
    await this.saveSettings();
  }
}

const adBlocker = new AdBlocker();