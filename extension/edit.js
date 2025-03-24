document.addEventListener('DOMContentLoaded', function() {
  // Get site index from URL
  const urlParams = new URLSearchParams(window.location.search);
  const siteIndex = parseInt(urlParams.get('index'));
  
  if (isNaN(siteIndex)) {
    alert('Invalid site index.');
    window.close();
    return;
  }
  
  // Handle time range toggle
  const timeRangeToggle = document.getElementById('time-range-toggle');
  const timeRangeInputs = document.getElementById('time-range-inputs');
  const startHourSelect = document.getElementById('start-hour');
  const endHourSelect = document.getElementById('end-hour');
  
  timeRangeToggle.addEventListener('change', function() {
    if (this.checked) {
      timeRangeInputs.classList.remove('hidden');
      startHourSelect.disabled = false;
      endHourSelect.disabled = false;
    } else {
      timeRangeInputs.classList.add('hidden');
      startHourSelect.disabled = true;
      endHourSelect.disabled = true;
    }
  });
  
  // Load site data
  chrome.storage.sync.get('blockedSites', function(data) {
    const blockedSites = data.blockedSites || [];
    
    if (siteIndex < 0 || siteIndex >= blockedSites.length) {
      alert('Site not found.');
      window.close();
      return;
    }
    
    const site = blockedSites[siteIndex];
    
    // Populate form
    document.getElementById('domain').value = site.domain;
    document.getElementById('enabled').checked = site.enabled;
    
    // Set time range if available
    if (site.startHour !== undefined && site.endHour !== undefined) {
      timeRangeToggle.checked = true;
      timeRangeInputs.classList.remove('hidden');
      startHourSelect.disabled = false;
      endHourSelect.disabled = false;
      startHourSelect.value = site.startHour;
      endHourSelect.value = site.endHour;
    }
    
    // Handle form submission
    document.getElementById('edit-site-form').addEventListener('submit', function(e) {
      e.preventDefault();
      
      const domain = document.getElementById('domain').value.trim().toLowerCase();
      
      // Basic validation
      if (!domain) {
        alert('Please enter a domain name.');
        return;
      }
      
      // Update site object
      site.domain = domain;
      site.enabled = document.getElementById('enabled').checked;
      
      // Update time range
      if (timeRangeToggle.checked) {
        site.startHour = parseInt(startHourSelect.value);
        site.endHour = parseInt(endHourSelect.value);
      } else {
        delete site.startHour;
        delete site.endHour;
      }
      
      // Save to storage
      chrome.storage.sync.get('blockedSites', function(data) {
        const currentBlockedSites = data.blockedSites || [];
        
        // Check if domain already exists (excluding the current site)
        const domainExists = currentBlockedSites.some((s, i) => i !== siteIndex && s.domain === domain);
        if (domainExists) {
          alert('This domain is already in your blocklist.');
          return;
        }
        
        currentBlockedSites[siteIndex] = site;
        chrome.storage.sync.set({ blockedSites: currentBlockedSites }, function() {
          window.close();
        });
      });
    });
    
    // Handle delete button
    document.getElementById('delete-btn').addEventListener('click', function() {
      if (confirm('Are you sure you want to delete this site from your blocklist?')) {
        chrome.storage.sync.get('blockedSites', function(data) {
          const currentBlockedSites = data.blockedSites || [];
          currentBlockedSites.splice(siteIndex, 1);
          chrome.storage.sync.set({ blockedSites: currentBlockedSites }, function() {
            window.close();
          });
        });
      }
    });
    
    // Handle cancel button
    document.getElementById('cancel-btn').addEventListener('click', function() {
      window.close();
    });
  });
});
