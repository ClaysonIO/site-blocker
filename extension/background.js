// Listen for web navigation events
chrome.webNavigation.onBeforeNavigate.addListener(function(details) {
  // Only check main frame navigations (not iframes, etc.)
  if (details.frameId !== 0) return;
  
  const url = new URL(details.url);
  const domain = url.hostname.replace(/^www\./, '');
  
  // Skip non-http(s) URLs and extension pages
  if (!url.protocol.startsWith('http') || domain.includes('chrome-extension')) return;
  
  // Check if the site should be blocked
  checkIfShouldBlock(domain, details.tabId);
});

// Function to check if a site should be blocked
function checkIfShouldBlock(domain, tabId) {
  chrome.storage.sync.get('blockedSites', function(data) {
    const blockedSites = data.blockedSites || [];
    
    // Find matching site in blocklist
    const site = blockedSites.find(site => {
      // Check if domain matches or is a subdomain
      return domain === site.domain || domain.endsWith('.' + site.domain);
    });
    
    // If site is not in blocklist, do nothing
    if (!site) return;
    
    // If site is disabled, do nothing
    if (!site.enabled) return;
    
    // Check time range if specified
    if (site.startHour !== undefined && site.endHour !== undefined) {
      const now = new Date();
      const currentHour = now.getHours();
      
      // If current time is outside the blocked range, do nothing
      if (site.startHour <= site.endHour) {
        // Simple range (e.g., 9 AM to 5 PM)
        if (currentHour < site.startHour || currentHour >= site.endHour) return;
      } else {
        // Overnight range (e.g., 10 PM to 6 AM)
        if (currentHour < site.startHour && currentHour >= site.endHour) return;
      }
    }
    
    // If we get here, the site should be blocked
    blockSite(tabId, site.domain);
  });
}

// Function to block a site by redirecting to a block page
function blockSite(tabId, domain) {
  // Redirect to the local block page
  chrome.tabs.update(tabId, {
    url: chrome.runtime.getURL('not-allowed.html')
  });
}
