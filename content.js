// content.js
// This script runs on the Microsoft Teams page (https://teams.microsoft.com/v2/*)

/**
 *
 * @returns {Array<Object>} An array of objects, each containing 'name' and 'status'.
 */
function scrapeTeamsData() {
    const people = [];
    
    const personElements = document.querySelectorAll('div[data-testid="list-item"]');

    personElements.forEach(personElement => {
       
        const nameElement = personElement.querySelector('span[id^="title-chat-list-item_"]');

        const presenceBadge = personElement.querySelector('div[data-tid="presence-badge"]');

        let name = nameElement ? nameElement.textContent.trim() : 'Unknown Name';

        let status = presenceBadge ? presenceBadge.getAttribute('aria-label') || presenceBadge.getAttribute('title') : 'Unknown Status';

        if (name && name !== 'Unknown Name' && status && status !== 'Unknown Status') {
            people.push({ name, status });
        }
    });
    return people;
}


function logTeamsData() {
    const timestamp = new Date().toISOString(); 
    const data = scrapeTeamsData(); 

    chrome.storage.local.get('teamsLog', (result) => {
        let currentLog = result.teamsLog || []; 

        data.forEach(person => {
            // Add a new entry for each person found
            currentLog.push({
                timestamp: timestamp,
                name: person.name,
                status: person.status
            });
        });

        
        chrome.storage.local.set({ teamsLog: currentLog }, () => {
            if (chrome.runtime.lastError) {
                console.error("Error saving log to storage:", chrome.runtime.lastError);
            } else {
                console.log(`Teams data logged at ${timestamp}`);
            }
        });
    });
}

setInterval(logTeamsData, 10000);

logTeamsData();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getLog") {
        chrome.storage.local.get('teamsLog', (result) => {
            sendResponse({ teamsLog: result.teamsLog || [] });
        });
        return true; 
    }
});
