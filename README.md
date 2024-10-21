# Hyperlink Generator

A simple Chrome extension that allows you to generate hyperlinks from selected text and copy them to the clipboard.

[Get it on Chrome Web Store](https://chromewebstore.google.com/detail/hyperlink-generator/iglbpaahcocnbekjagmbajlchammcplm)

## Features

- Create a hyperlink from selected text on any webpage.
- Copy the generated hyperlink to the clipboard in both plain text and HTML formats.
- Automatically detects if the content script is loaded, and injects it if necessary.

## Installation

1. Clone this repository or download the ZIP file.
2. Go to `chrome://extensions/` in your Chrome browser.
3. Enable **Developer mode** in the top right corner.
4. Click **Load unpacked** and select the folder where the extension files are located.

## How to Use

1. Select any text on a webpage.
2. Right-click and choose **Create Hyperlink** from the context menu.
3. The selected text will be converted into a hyperlink and copied to your clipboard. If no text is selected, the page title will be used.

## File Structure

- `manifest.json` – Defines the extension's metadata and permissions.
- `service-worker.js` – Manages the context menu and message passing between background and content scripts.
- `content-script.js` – Handles copying the generated hyperlink to the clipboard.