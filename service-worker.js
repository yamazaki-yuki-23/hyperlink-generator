// コンテキストメニューの作成
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "createLink",
      title: "Create Hyperlink",
      contexts: ["selection"]
    });
});

// クリップボードにリンクをコピーする処理
const sendMessageToCopyLink = (tabId, hyperLink) => {
  chrome.tabs.sendMessage(tabId, { action: "copyToClipboard", hyperLink }, (response) => {
    if (response && response.status === "success") {
      console.log("Link copied to clipboard!");
    } else {
      console.error("Failed to copy link to clipboard.");
    }
  })
}

// コンテキストメニューがクリックされたときの処理
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "createLink") {
    const selectedText = info.selectionText;
    const pageUrl = tab.url;
    const pageTitle = tab.title;

    const hyperLink = {
      text: selectedText || pageTitle,
      url: pageUrl
    };

    // まずメッセージを送信して、コンテンツスクリプトが実行されているか確認
    chrome.tabs.sendMessage(tab.id, { action: "checkStatus" }, (response) => {
      if (chrome.runtime.lastError || !response) {
        // コンテンツスクリプトが見つからない場合はインジェクト
        chrome.scripting.executeScript({
          target: {tabId: tab.id},
          files: ['content-script.js']
        }, () => {
          sendMessageToCopyLink(tab.id, hyperLink);
        });
      } else {
        // すでに実行されている場合はメッセージを送信
        sendMessageToCopyLink(tab.id, hyperLink);
      }
    });
  }
});