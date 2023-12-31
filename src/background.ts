// on startup, check if user has already clicked the checkbox
chrome.runtime.onStartup.addListener(function(){
    chrome.storage.sync.get("active", function (result) {
      if (result.active === true) {
        checkLastOpened();
      }
    });
    });


//listen for messages from popup.ts
chrome.runtime.onMessage.addListener(function(request){
  if (request.action === "popup"){
    popupBg();
  }
  else if (request.action === "check"){
    checkLastOpened();
  }

});


//opens 10 tabs with bing search
function popupBg(): void {
  let format: string = "https://www.bing.com/search?q=";
  let searches: string[] = ["weather", "sport", "news", "stocks", "movies", "music", "games", "maps", "travel", "restaurants"];
  for (let i: number = 0; i < searches.length; i++) {
    let url: string = format + searches[i];
    setTimeout(function(){
      chrome.tabs.create({
        url: url, active: false
      },
        function (tab: any) {
          let idCurr: number = tab.id;
          //wait for tab to load before closing
          chrome.tabs.onUpdated.addListener(function listener(tabId: number, changeInfo: chrome.tabs.TabChangeInfo) {
            if (tabId === idCurr &&  changeInfo.status === "complete") {
              chrome.tabs.onUpdated.removeListener(listener);
              waitAndClose(idCurr);
            }
  
          });
  
        });
    }, 200);

  }

}

//check if user has already opened tabs today
function checkLastOpened(): void {
  const today = new Date().toLocaleDateString();
  chrome.storage.sync.get("lastOpened", function (result) {
    if (result.lastOpened === today) {
    }
    else {
      popupBg();
      chrome.storage.sync.set({ "lastOpened": today });
    }
  });
}

//wait 0.3 second before closing tab
function waitAndClose(id: number): void {
  setTimeout(function () {
    chrome.tabs.remove(id);
  }, 300);
}


