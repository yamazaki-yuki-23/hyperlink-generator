// コンテキストメニューの作成
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "createLink",
      title: "Create Hyperlink",
      contexts: ["selection"]
    });
});

// 共通関数: ハイパーリンク生成とクリップボードへのコピー処理
const handleHyperlinkCreation = (tab, selectedText) => {
  const pageUrl = tab.url;
  const pageTitle = tab.title;

  const hyperLink = {
    text: selectedText || pageTitle,
    url: pageUrl
  };

  // コンテンツスクリプトが実行されているか確認し、必要ならインジェクト
  chrome.tabs.sendMessage(tab.id, { action: "checkStatus" }, (response) => {
    if (chrome.runtime.lastError || !response) {
      // コンテンツスクリプトをインジェクト
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content-script.js']
      }, () => {
        sendMessageToCopyLink(tab.id, hyperLink);
      });
    } else {
      // すでにコンテンツスクリプトが実行されている場合
      sendMessageToCopyLink(tab.id, hyperLink);
    }
  });
};

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
    handleHyperlinkCreation(tab, info.selectionText);
  }
});

// ショートカットキーが押されたときの処理
chrome.commands.onCommand.addListener((command) => {
  if (command === "create-link-shortcut") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (!tab) {
        console.error("No active tab found");
        return;
      }
      
      // 現在の選択テキストを取得
      chrome.scripting.executeScript(
        {
          target: { tabId: tab.id },
          func: () => window.getSelection().toString()
        },
        (results) => {
          const selectedText = results[0]?.result || "";
          handleHyperlinkCreation(tab, selectedText);
        }
      );
    });
  }
});