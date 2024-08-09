console.log("history-by-date's background.js loaded")

function openHistoryTab() {
  var indexUrl = chrome.runtime.getURL('/index-production.html');

  chrome.tabs.query({url: indexUrl}, function(tabs) {
    if (tabs.length) {
      var tab = tabs[0];
      chrome.windows.update(tab.windowId, {focused: true});
      chrome.tabs.update(tab.id, {active: true});
    } else {
      console.log("No tab found:", indexUrl);
      chrome.tabs.create({url: indexUrl});
    }
  })
}


chrome.action.onClicked.addListener(function(activeTab)
{
  openHistoryTab()
});




chrome.commands.onCommand.addListener(function(command) {
  /**
   * You need to uninstall and reinstall your local extension to see the default keyboard command appear in
   *
   * chrome://extensions/configureCommands
   *
   * Even then, you might have to manually set it
   *
   */
  console.log('Command:', command);
  if (command == 'open-history-tab')
    openHistoryTab()
});
