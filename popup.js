// popup.js

document.addEventListener('DOMContentLoaded', () => {
    const openLogBtn = document.getElementById('openLogBtn');
    const clearLogBtn = document.getElementById('clearLogBtn');

    openLogBtn.addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true, url: "https://teams.microsoft.com/v2/*" }, (tabs) => {
            if (tabs.length > 0) {
                chrome.tabs.create({ url: chrome.runtime.getURL("log.html") });
            } else {
                chrome.tabs.create({ url: chrome.runtime.getURL("log.html") });
            }
        });
    });

    clearLogBtn.addEventListener('click', () => {
        chrome.storage.local.remove('teamsLog', () => {
            if (chrome.runtime.lastError) {
                console.error("Error clearing log from storage:", chrome.runtime.lastError);
            } else {
                console.log("Teams log cleared from storage.");
                alert("Log has been cleared!");
            }
        });
    });
});
