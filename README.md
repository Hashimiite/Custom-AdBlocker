AdBlocker Pro - Chrome Extension

A powerful and efficient Chrome extension designed to block ads, trackers, and enhance your browsing experience.

Features
1)Ad Blocking: Blocks common advertisement elements and domains
2)Tracker Prevention: Blocks tracking scripts and analytics
3)Real-time Statistics: Tracks number of ads blocked daily and in total
4)Whitelist Support: Easily whitelist trusted websites
5)Multiple Blocking Methods such as :
    1)Network-level blocking (using declarativeNetRequest)
    2)OM-based blocking (removes ad elements from page)
    3)Custom filter rules(To be added Soon)



Installation For Development(For Now)
1)Clone this repository:
2)Load the extension in Chrome:
3)Open Chrome and navigate to chrome://extensions/
4)Enable "Developer mode" in the top right
5)Click "Load unpacked"
6)Select the project directory


Project Structure

├── src/
│   ├── html/
│   │   └── popup.html    # Extension popup interface
│   ├── css/
│   │   └── popup.css     # Popup styling
│   ├── js/
│   │   ├── background.js    # Background service worker
│   │   ├── content-script.js # DOM manipulation
│   │   ├── filter-rules.js   # Ad filtering rules
│   │   └── popup.js         # Popup functionality
│   └── icons/
|       └── icon128.png       # Extension icon
├── manifest.json          # Extension configuration

Features in Detail
1)Ad Blocking
    1)Blocks common ad domains using declarativeNetRequest
    2)Removes ad elements from the DOM
    3)Prevents ad-related iframes from loading

Statistics
    1)Tracks number of ads blocked today
    2)Maintains total count of blocked ads
    3)Automatically resets daily counter

Whitelist System
    1)Add/remove sites from whitelist
    2)Persists across browser sessions
    3)Easy toggle through popup interface


This extension:
    1)Does not collect any user data
    2)Does not track browsing history
    3)Operates completely locally on your machine
    4)Requires only necessary permissions for ad blocking functionality

Permissions Used
    1)declarativeNetRequest: For network-level ad blocking
    2)storage: For saving settings and statistics
    3)activeTab: For DOM manipulation
    4)host permissions: For checking URLs against whitelist

Known Issues
    1)Some video ads might not be blocked
    2)Certain dynamic ad insertions might briefly appear
    3)pSites with anti-adblock may detect the extension

Acknowledgments
    1)Icons8 for extension icons
    2)Chrome Extension documentation
    3)Open-source ad blocking community

