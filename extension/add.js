document.addEventListener('DOMContentLoaded', function() {
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
  
  // Handle form submission
  document.getElementById('add-site-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const domain = document.getElementById('domain').value.trim().toLowerCase();
    
    // Basic validation
    if (!domain) {
      alert('Please enter a domain name.');
      return;
    }
    
    // Create site object
    const site = {
      domain: domain,
      enabled: document.getElementById('enabled').checked
    };
    
    // Add alternate destination if provided
    const alternateDestination = document.getElementById('alternate-destination').value.trim();
    if (alternateDestination) {
      // Ensure URL has proper format
      let formattedUrl = alternateDestination;
      if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
        formattedUrl = 'https://' + formattedUrl;
      }
      site.alternateDestination = formattedUrl;
    }
    
    // Add time range if specified
    if (timeRangeToggle.checked) {
      const startHour = parseInt(startHourSelect.value);
      const endHour = parseInt(endHourSelect.value);
      site.startHour = startHour;
      site.endHour = endHour;
    }
    
    // Save to storage
    chrome.storage.sync.get('blockedSites', function(data) {
      const blockedSites = data.blockedSites || [];
      
      // Check if domain already exists
      const domainExists = blockedSites.some(site => site.domain === domain);
      if (domainExists) {
        alert('This domain is already in your blocklist.');
        return;
      }
      
      blockedSites.push(site);
      chrome.storage.sync.set({ blockedSites: blockedSites }, function() {
        // Close the tab and return to popup
        window.close();
      });
    });
  });
  
  // Handle cancel button
  document.getElementById('cancel-btn').addEventListener('click', function() {
    window.close();
  });
});
