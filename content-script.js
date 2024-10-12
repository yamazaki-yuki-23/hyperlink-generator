function copyToClipboard(html, text) {
  navigator.clipboard.write([
    new ClipboardItem({
      "text/html": new Blob([html], { type: "text/html" }),
      "text/plain": new Blob([text || html], { type: "text/plain" })
    })
  ]).then(() => {
    console.log("リンクがクリップボードにコピーされました！");
  }).catch(err => {
    console.error("コピーに失敗しました。", err);
  });
}

// メッセージをリスンして、クリップボードにコピーする
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "copyToClipboard") {
    const htmlLink = `<a href="${request.slackRichLink.url}">${request.slackRichLink.text}</a>`;
    const plainText = `${request.slackRichLink.text} (${request.slackRichLink.url})`;

    copyToClipboard(htmlLink, plainText);
    sendResponse({ status: "success" });
  }

  if (request.action === "checkStatus") {
    sendResponse({ status: "active" });
  }
});