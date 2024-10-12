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

    const slackRichLink = {
      text: selectedText || pageTitle,
      url: pageUrl
    };

    // まずメッセージを送信して、コンテンツスクリプトが実行されているか確認
    chrome.tabs.sendMessage(tab.id, { action: "checkStatus" }, (response) => {
      if (chrome.runtime.lastError || !response) {
        // コンテンツスクリプトが見つからない場合のみインジェクト
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
      } else {
        // すでに実行されている場合は、すぐにメッセージを送信
        chrome.tabs.sendMessage(tab.id, { action: "copyToClipboard", slackRichLink }, (response) => {
          if (response && response.status === "success") {
            console.log("リンクがクリップボードにコピーされました！");
          } else {
            console.error("クリップボードへのコピーに失敗しました。");
          }
        });
      }
    });
  }
});