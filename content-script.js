function copyToClipboard(slackRichLink) {
  navigator.clipboard.writeText(slackRichLink).then(() => {
    console.log("リンクがクリップボードにコピーされました！");
  }).catch(err => {
    console.error("コピーに失敗しました。", err);
  });
}

// メッセージをリスンして、クリップボードにコピーする
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(`Received message: ${request.action}`);
  if (request.action === "copyToClipboard") {
    copyToClipboard(request.slackRichLink);
    sendResponse({ status: "success" });
  }
});