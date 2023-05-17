let cookieValue = '';
chrome.cookies.get({ url: 'https://www.linkedin.com', name: 'cookieName' }, function(cookie) {
    cookieValue = cookie.value;
});

let sidebarOpen = false;

function openSidebar() {
    if(!sidebarOpen) {
        const sidebar = document.createElement('div');
        sidebar.id = 'mySidebar';
        document.body.appendChild(sidebar);
        sidebarOpen = true;
    }
}

function closeSidebar() {
    if(sidebarOpen) {
        const sidebar = document.getElementById('mySidebar');
        document.body.removeChild(sidebar);
        sidebarOpen = false;
    }
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if(request.action === "openSidebar") {
        openSidebar();
        scrapePosts();
    } else if(request.action === "closeSidebar") {
        closeSidebar();
    }
});

function scrapePosts() {
    const urn = 'URN_A_REMPLACER';
    const url = `https://www.linkedin.com/voyager/api/identity/profileUpdatesV2`;
    const params = {
        count: 100,
        start: 0,
        q: "memberShareFeed",
        moduleKey: "member-shares:phone",
        includeLongTermHistory: true,
        profileUrn: `urn:li:fsd_profile:${urn}`
    };

    fetch(url, {
        method: 'GET',
        headers: {
            'csrf-token': cookieValue,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(posts => {
        chrome.runtime.sendMessage({action: 'gotPosts', posts: posts});
    })
    .catch(error => console.error('Error:', error));
}
