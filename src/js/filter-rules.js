class FilterRules {
    static categories = {
      ADS: 'ads',
      TRACKERS: 'trackers',
      SOCIAL: 'social',
      CUSTOM: 'custom'
    };
  
    static defaultRules = {
      [this.categories.ADS]: [
        "*://*.doubleclick.net/*",
        "*://*.googlesyndication.com/*",
        "*://*.advertising.com/*",
        "*://ads.*.com/*",
        "*://adserver.*.*/*"
      ],
      [this.categories.TRACKERS]: [
        "*://*.google-analytics.com/*",
        "*://*.hotjar.com/*",
        "*://*.analytics.*.*/*",
        "*://pixel.*.*/*"
      ],
      [this.categories.SOCIAL]: [
        "*://*.facebook.com/plugins/*",
        "*://platform.twitter.com/*",
        "*://www.linkedin.com/widgets/*"
      ],
      [this.categories.CUSTOM]: []
    };
  
    static parseRule(rule) {
      const pattern = rule
        .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
        .replace(/\*/g, '.*')
        .replace(/\^/g, '(?:[^\\w\\-.%\\u0080-\\uFFFF]|$)')
        .replace(/\|/g, '^');
      
      return new RegExp(pattern);
    }
  
    static validateRule(rule) {
      try {
        if (!rule.includes('.')) return false;
        if (rule.length < 4) return false;
        
        this.parseRule(rule);
        return true;
      } catch (e) {
        return false;
      }
    }
  
    static categorizeRule(rule) {
      const lowerRule = rule.toLowerCase();
      if (lowerRule.includes('analytics') || lowerRule.includes('tracker')) {
        return this.categories.TRACKERS;
      }
      if (lowerRule.includes('social') || lowerRule.includes('share')) {
        return this.categories.SOCIAL;
      }
      if (lowerRule.includes('ad') || lowerRule.includes('banner')) {
        return this.categories.ADS;
      }
      return this.categories.CUSTOM;
    }
  
    static async addCustomRule(rule) {
      if (!this.validateRule(rule)) {
        throw new Error('Invalid rule format');
      }
  
      const { customRules = [] } = await chrome.storage.local.get('customRules');
      if (!customRules.includes(rule)) {
        customRules.push(rule);
        await chrome.storage.local.set({ customRules });
      }
    }
  
    static async removeCustomRule(rule) {
      const { customRules = [] } = await chrome.storage.local.get('customRules');
      const index = customRules.indexOf(rule);
      if (index > -1) {
        customRules.splice(index, 1);
        await chrome.storage.local.set({ customRules });
      }
    }
  
    static async getAllRules() {
      const { customRules = [] } = await chrome.storage.local.get('customRules');
      return {
        ...this.defaultRules,
        [this.categories.CUSTOM]: customRules
      };
    }
  }
  
  export default FilterRules;