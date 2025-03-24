# Site Blocker Chrome Extension

A Chrome extension that blocks users from navigating to sites they've added to their personal block list.

## Features

- Block specific domains from being accessed
- Set optional time ranges for when sites should be blocked
- Enable/disable blocking for specific sites
- User-friendly interface for managing blocked sites
- Customizable blocking page with visual feedback

## Installation

### Development Mode

1. Clone or download this repository to your local machine
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" using the toggle in the top-right corner
4. Click "Load unpacked" and select the directory containing this extension
5. Generate the icon files using the included icon generator (see below)

### Icon Generation

Before using the extension, you need to generate the icon files:

1. Open the `icon-generator.html` file in a web browser
2. Click the "Download Icon" button for each icon size (16x16, 48x48, and 128x128)
3. Save the downloaded icons to the `images` folder in the extension directory

## Usage

### Adding Sites to Block

1. Click on the Site Blocker extension icon in your browser toolbar
2. Click the "Add Site" button
3. Enter the domain name you want to block (e.g., facebook.com)
4. Optionally set a specific time range when the site should be blocked
5. Make sure the "Enabled" checkbox is checked
6. Click "Save"

### Editing or Removing Blocked Sites

1. Click on the Site Blocker extension icon in your browser toolbar
2. Find the site you want to edit in the list
3. Click the "Edit" button
4. Modify the domain, time range, or enabled status as needed
5. Click "Save" to update, or "Delete" to remove the site from your blocklist

### How Blocking Works

When you attempt to navigate to a blocked site:
- The extension checks if the site is on your blocklist
- If the site is enabled and the current time is within the specified time range (if any)
- If both conditions are met, you'll be redirected to a block page showing a "no" message

## Structure

- `manifest.json`: Extension configuration
- `popup.html/js`: Main popup UI and functionality
- `add.html/js`: UI for adding new sites
- `edit.html/js`: UI for editing existing sites
- `background.js`: Background script for blocking functionality
- `styles.css`: Styling for the extension UI
- `images/`: Directory containing extension icons
- `icon-generator.html`: Tool to generate extension icons

## License

This project is open source and available for personal use.
