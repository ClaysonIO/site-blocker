document.addEventListener('DOMContentLoaded', function() {
  // Load and display blocked sites
  loadBlockedSites();
  
  // Add event listener for the "Add Site" button
  document.getElementById('add-site-btn').addEventListener('click', function() {
    chrome.tabs.create({ url: 'add.html' });
  });
});

// Function to load blocked sites from storage
function loadBlockedSites() {
  chrome.storage.sync.get('blockedSites', function(data) {
    const blockedSites = data.blockedSites || [];
    const sitesBody = document.getElementById('sites-body');
    sitesBody.innerHTML = '';
    
    if (blockedSites.length === 0) {
      const row = document.createElement('tr');
      row.innerHTML = '<td colspan="4" class="empty-message">No sites added to blocklist yet.</td>';
      sitesBody.appendChild(row);
      return;
    }
    
    blockedSites.forEach(function(site, index) {
      const row = document.createElement('tr');
      
      // Domain column
      const domainCell = document.createElement('td');
      domainCell.textContent = site.domain;
      row.appendChild(domainCell);
      
      // Time range column
      const timeCell = document.createElement('td');
      if (site.startHour !== undefined && site.endHour !== undefined) {
        timeCell.textContent = `${formatHour(site.startHour)} - ${formatHour(site.endHour)}`;
      } else {
        timeCell.textContent = 'All day';
      }
      row.appendChild(timeCell);
      
      // Enabled column
      const enabledCell = document.createElement('td');
      const enabledCheckbox = document.createElement('input');
      enabledCheckbox.type = 'checkbox';
      enabledCheckbox.checked = site.enabled;
      enabledCheckbox.addEventListener('change', function() {
        updateSiteEnabled(index, this.checked);
      });
      enabledCell.appendChild(enabledCheckbox);
      row.appendChild(enabledCell);
      
      // Actions column
      const actionsCell = document.createElement('td');
      const editButton = document.createElement('button');
      editButton.textContent = 'Edit';
      editButton.className = 'edit-btn';
      editButton.addEventListener('click', function() {
        chrome.tabs.create({ url: `edit.html?index=${index}` });
      });
      actionsCell.appendChild(editButton);
      row.appendChild(actionsCell);
      
      sitesBody.appendChild(row);
    });
  });
}

// Function to update a site's enabled status
function updateSiteEnabled(index, enabled) {
  chrome.storage.sync.get('blockedSites', function(data) {
    const blockedSites = data.blockedSites || [];
    if (index >= 0 && index < blockedSites.length) {
      blockedSites[index].enabled = enabled;
      chrome.storage.sync.set({ blockedSites: blockedSites });
    }
  });
}

// Helper function to format hour in 12-hour format
function formatHour(hour) {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:00 ${period}`;
}
