function copyToClipboard(html, text) {
  navigator.clipboard.write([
    new ClipboardItem({
      "text/html": new Blob([html], { type: "text/html" }),
      "text/plain": new Blob([text || html], { type: "text/plain" })
    })
  ]).then(() => {
    console.log("Link successfully copied to clipboard!");
  }).catch(err => {
    console.error("Failed to copy to clipboard.", err);
  });
}

// メッセージをリスンして、クリップボードにコピーする
chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  if (request.action === "copyToClipboard") {
    const htmlLink = `<a href="${request.hyperLink.url}">${request.hyperLink.text}</a>`;
    const plainText = `${request.hyperLink.text} (${request.hyperLink.url})`;

    copyToClipboard(htmlLink, plainText);
    sendResponse({ status: "success" });
  }

  if (request.action === "checkStatus") {
    sendResponse({ status: "active" });
  }
});