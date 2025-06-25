// log.js

document.addEventListener('DOMContentLoaded', () => {
    const logDisplay = document.getElementById('logDisplay');


    function renderLog() {
        
        chrome.storage.local.get('teamsLog', (result) => {
            const teamsLog = result.teamsLog || []; 

            
            if (teamsLog.length === 0) {
                logDisplay.textContent = "No log data available yet. Please ensure the Teams page is open and the extension is active.";
                return;
            }

            
            const filteredLog = teamsLog.filter(entry => !entry.name.includes("(You)"));

            
            let formattedLog = filteredLog.map(entry => {
                
                const statusClass = entry.status.replace(/\s/g, '');
                return `[${entry.timestamp}] <span class="font-semibold">${entry.name}</span> <span class="status-dot ${statusClass}"></span>${entry.status}`;
            }).join('\n'); 

           
            if (formattedLog.trim() === "") {
                logDisplay.textContent = "No log data to display after filtering yourself out.";
            } else {
                logDisplay.innerHTML = formattedLog; 
            }

            
            logDisplay.scrollTop = logDisplay.scrollHeight;
        });
    }

    
    renderLog();

    chrome.storage.onChanged.addListener((changes, namespace) => {
        
        if (namespace === 'local' && changes.teamsLog) {
            console.log("Log data changed, refreshing display on log page.");
            renderLog(); 
        }
    });
});
