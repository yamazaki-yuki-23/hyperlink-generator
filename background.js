chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "createSlackLink",
      title: "Slack用のリンクを生成",
      contexts: ["selection"]
    });
});