chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "createSlackLink",
      title: "Slack用のリンクを生成",
      contexts: ["selection"]
    });
});


chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "createSlackLink") {
    const selectedText = info.selectionText;
    const pageUrl = tab.url;
    const pageTitle = tab.title;

    const slackRichLink = `<${pageUrl}|${selectedText || pageTitle}>`;

    chrome.scripting.executeScript({
      target: {tabId: tab.id},
      files: ['content-script.js']
    }, () => {
      // インジェクト後にメッセージを送信
      chrome.tabs.sendMessage(tab.id, { action: "copyToClipboard", slackRichLink }, (response) => {
        if (response && response.status === "success") {
          console.log("リンクがクリップボードにコピーされました！");
        } else {
          console.error("クリップボードへのコピーに失敗しました。");
        }
      });
    });
  }
});