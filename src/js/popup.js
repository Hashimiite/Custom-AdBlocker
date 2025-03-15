document.addEventListener('DOMContentLoaded', async () => {
    const enableToggle = document.getElementById('enableToggle');
    const statusText = document.getElementById('statusText');
    const todayCount = document.getElementById('todayCount');
    const totalCount = document.getElementById('totalCount');
    const whitelistBtn = document.getElementById('whitelistBtn');
    const settingsBtn = document.getElementById('settingsBtn');
  
    let currentTab = await getCurrentTab();
    let isWhitelisted = await checkWhitelist(currentTab.hostname);
  
    async function init() {
      const { enabled, stats } = await getState();
      
      enableToggle.checked = enabled;
      statusText.textContent = enabled ? 'Enabled' : 'Disabled';
      todayCount.textContent = stats.todayCount.toLocaleString();
      totalCount.textContent = stats.totalCount.toLocaleString();
      updateWhitelistButton();
    }
  
    async function getCurrentTab() {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      const url = new URL(tabs[0].url);
      return { url: url, hostname: url.hostname };
    }
  
    async function getState() {
      return new Promise((resolve) => {
        chrome.runtime.sendMessage({ type: 'getStats' }, (stats) => {
          chrome.storage.local.get(['enabled'], (data) => {
            resolve({
              enabled: data.enabled !== undefined ? data.enabled : true,
              stats
            });
          });
        });
      });
    }
  
    async function checkWhitelist(domain) {
      return new Promise((resolve) => {
        chrome.storage.local.get(['whitelist'], (data) => {
          const whitelist = new Set(data.whitelist || []);
          resolve(whitelist.has(domain));
        });
      });
    }
  
    function updateWhitelistButton() {
      whitelistBtn.textContent = isWhitelisted ? 
        'Remove from Whitelist' : 
        'Add to Whitelist';
    }
  
    enableToggle.addEventListener('change', async (e) => {
      const enabled = e.target.checked;
      await chrome.runtime.sendMessage({ 
        type: 'toggleEnabled',
        value: enabled
      });
      statusText.textContent = enabled ? 'Enabled' : 'Disabled';
    });
  
    whitelistBtn.addEventListener('click', async () => {
      await chrome.runtime.sendMessage({ 
        type: 'toggleWhitelist',
        domain: currentTab.hostname
      });
      isWhitelisted = !isWhitelisted;
      updateWhitelistButton();
    });
  
    settingsBtn.addEventListener('click', () => {
      chrome.runtime.openOptionsPage();
    });
  
    init();
  });
