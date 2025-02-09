class DomBlocker {
  constructor() {
    this.adSelectors = [
      '.advertisement',
      '.advert',
      '.ad-container',
      '.ad-wrapper',
      '[class*="ad-container"]',
      '[class*="ad-wrapper"]',
      '[id*="google_ads"]',
      '[id*="banner-ad"]',
      'ins.adsbygoogle',
      'iframe[src*="doubleclick.net"]',
      'iframe[src*="ads"]',
      'div[aria-label*="advertisement"]'
    ];

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.init());
    } else {
      this.init();
    }
  }

  init() {
    if (document.body) {
      this.removeAds();
      this.observeDOM();
      this.handleIframes();
    } else {
      // If body doesn't exist yet, wait
      const observer = new MutationObserver((mutations, obs) => {
        if (document.body) {
          obs.disconnect();
          this.removeAds();
          this.observeDOM();
          this.handleIframes();
        }
      });

      observer.observe(document.documentElement, {
        childList: true,
        subtree: true
      });
    }
  }

  removeAds() {
    try {
      const adElements = document.querySelectorAll(this.adSelectors.join(','));
      adElements.forEach(element => {
        if (element && element.parentNode) {
          element.remove();
        }
      });
    } catch (error) {
      console.debug('Error removing ads:', error);
    }
  }

  observeDOM() {
    try {
      const observer = new MutationObserver((mutations) => {
        if (mutations.some(mutation => mutation.addedNodes.length > 0)) {
          this.removeAds();
          this.handleIframes();
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['src', 'class', 'id']
      });
    } catch (error) {
      console.debug('Error observing DOM:', error);
    }
  }

  handleIframes() {
    try {
      const iframes = document.getElementsByTagName('iframe');
      Array.from(iframes).forEach(iframe => {
        const src = (iframe.src || '').toLowerCase();
        if (src.includes('ad') || src.includes('banner') || src.includes('sponsor')) {
          if (iframe && iframe.parentNode) {
            iframe.remove();
          }
        }
      });
    } catch (error) {
      console.debug('Error handling iframes:', error);
    }
  }
}

new DomBlocker();