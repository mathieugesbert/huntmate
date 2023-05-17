function openSidebar() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "openSidebar"});
    });
}

function closeSidebar() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "closeSidebar"});
    });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if(request.action === "displayPosts") {
        const postContainer = document.getElementById('postContainer');
        postContainer.innerHTML = request.data.map(post => `
            <div>
                <h3>${post.date}</h3>
                <p>${post.content}</p>
                <p>Likes: ${post.likes}</p>
                <p>Comments: ${post.comments}</p>
                <a href="${post.url}">View Post</a>
            </div>
        `).join('');
    }
});
