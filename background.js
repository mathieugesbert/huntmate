// Importer le module LinkedInScraper ici
const LinkedInScraper = require('linkedin-profile-scraper');

let linkedIn;
let tabId;
let scraper;

// Attacher un listener pour "onConnect"
chrome.runtime.onConnect.addListener(function(port) {
  console.assert(port.name == "linkedin");

  port.onMessage.addListener(function(msg) {
    if (msg.command == "scrape") {
      if (!scraper) {
        scraper = new LinkedInScraper();
      }

      scraper.getProfile(msg.link).then(profile => {
        port.postMessage({profile: profile});
      }).catch(err => {
        console.error(err);
        port.postMessage({error: err.message});
      });
    }
  });
});

chrome.browserAction.onClicked.addListener(function(tab) {
  tabId = tab.id;
  chrome.tabs.executeScript(tabId, {file: "content.js"});
});
