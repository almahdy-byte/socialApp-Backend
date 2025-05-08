// Helper Functions for Compression
const compressText = (text) => {
    const compressed = pako.gzip(text);
    return btoa(String.fromCharCode(...compressed)); 
};

const dCompressText = (base64Str) => {
    const binaryString = atob(base64Str);
    const byteArray = new Uint8Array([...binaryString].map(char => char.charCodeAt(0)));
    return pako.inflate(byteArray, { to: 'string' });
};

const messageCompression = (text) => {
    const compressed = compressText(text);
    return compressed;
};

const messageDCompression = (compressedText) => dCompressText(compressedText);

let selectedUserId = null;
let profileImg = localStorage.getItem('profileImage');

const socket = io('http://localhost:3000', {
    auth: {
        token: `user ${localStorage.getItem('token')}`
    }
});

socket.on('connect_error', (err) => {
    console.log({ err });
});

// Load users from API or fallback to static users
async function loadUsers() {
    try {
        const response = await fetch("http://localhost:3000/user/get-friends", {
            headers: {
                authorization: `user ${localStorage.getItem('token')}`
            }
        });
        const users = await response.json();
        displayUsers(users.friends);
    } catch (error) {
        console.error("Error loading users, using static users:", error);
        displayUsers([]);
    }
}

// Display users in the sidebar
function displayUsers(users) {
    const usersList = document.getElementById("users");
    usersList.innerHTML = "";

    // Add AI option
    const aiListItem = document.createElement("li");
    aiListItem.innerHTML = `
        <img src="ai_icon.png" alt="AI Image" class="user-image">
        AI Chat
    `;
    aiListItem.onclick = () => selectAIChat();
    usersList.appendChild(aiListItem);

    users.forEach(user => {
        const li = document.createElement("li");
        li.innerHTML = `
            <img src="${user.profilePicture.secure_url}" alt="${user.userName}'s Image" class="user-image">
            ${user.userName}
        `;
        li.onclick = () => selectUser(user._id, user.userName, user.profilePicture.secure_url);
        usersList.appendChild(li);
    });
}

function selectAIChat() {
    selectedUserId = "ai-chat";
    document.getElementById("chatUserImg").style.display = "inline";
    document.getElementById("chatUserImg").src = "ai_icon.png";
    document.getElementById("chatUserName").textContent = "AI Chat";
    loadMessages("ai-chat");
}

function selectUser(userId, userName, profileImage) {
    selectedUserId = userId;
    if (profileImage) {
        document.getElementById("chatUserImg").style.display = "inline";
    }
    document.getElementById("chatUserImg").src = profileImage || "default.png";
    document.getElementById("chatUserName").textContent = userName;
    loadMessages(selectedUserId);
}

// Load messages
async function loadMessages(userId) {
    try {
        const endpoint = userId === "ai-chat" 
            ? `http://localhost:3000/chat/ai-chat`
            : `http://localhost:3000/chat/${userId}`;

        const response = await fetch(endpoint, {
            headers: {
                authorization: `user ${localStorage.getItem('token')}`
            }
        });

        let res = await response.json();
        const messages = userId === "ai-chat" ? res.AIChat.messages : res.messages;

        if (Array.isArray(messages)) {
            displayMessages(messages);
        } else {
            console.error("Received data is not an array:", messages);
            displayMessages([]);
        }
    } catch (error) {
        console.error("Error loading messages:", error);
        displayMessages([]);
    }
}

// Display messages
function displayMessages(messages) {
    const messagesBox = document.getElementById("messages");
    messagesBox.innerHTML = "";

    messages.forEach(msg => {
        const isAI = selectedUserId === "ai-chat";
        let type;

        if (isAI) {
            addAIMessage(msg.message, "sent");
            addAIMessage(msg.AIMessage, "received");
        } else {
            type = msg.senderId?._id?.toString() === selectedUserId.toString() ? "received" : "sent";
            addMessage(msg, type);
        }

    });
}

// Add message to chat box
function addMessage(msg, type) {
    const messagesBox = document.getElementById("messages");
    const div = document.createElement("div");
    div.className = `message ${type}`;

    const imgSrc = msg.senderId?.profilePicture?.secure_url || profileImg || "default.png";
    const senderName = type === "received" ? (msg.senderId?.userName || "AI") : "Me";
    const body = msg.body ? messageDCompression(msg.body) : (msg.message || msg.AIMessage);

    div.innerHTML = `
        <img src="${imgSrc}" alt="User Image">
        <div class="content">
            <strong>${senderName}</strong>
            <p>${body}</p>
        </div>
    `;

    messagesBox.appendChild(div);
    messagesBox.scrollTop = messagesBox.scrollHeight;
}

//add message AI
function addAIMessage(msg, type) {
    const messagesBox = document.getElementById("messages");
    const div = document.createElement("div");
    div.className = `message ${type}`;

    const imgSrc = msg.senderId?.profilePicture?.secure_url || profileImg || "default.png";
    const senderName = type === "received" ? (msg.senderId?.userName || "AI") : "Me";
    const body = msg.body ? messageDCompression(msg.body) : (msg);

    div.innerHTML = `
        <img src="${imgSrc}" alt="User Image">
        <div class="content">
            <strong>${senderName}</strong>
            <p>${body}</p>
        </div>
    `;

    messagesBox.appendChild(div);
    messagesBox.scrollTop = messagesBox.scrollHeight;
}
// Send message
async function sendMessage() {
    const input = document.getElementById("messageInput");
    const message = input.value.trim();

    if (!message || !selectedUserId) return;

    const profileImgNow = localStorage.getItem('profileImage') || 'default.png';
    const compressedMessage = messageCompression(message);

    if (selectedUserId === "ai-chat") {
        try {
            const response = await fetch("http://localhost:3000/chat/ai", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `user ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ message })
            });

            const res = await response.json();
            const aiResponse = res.AIMessage;

            addMessage({
                message,
                senderId: {
                    userName: "Me",
                    profilePicture: { secure_url: profileImgNow }
                }
            }, "sent");

            addMessage({
                AIMessage: aiResponse,
                senderId: {
                    userName: "AI",
                    profilePicture: { secure_url: "ai_icon.png" }
                }
            }, "received");

        } catch (error) {
            console.error("Failed to send message to AI:", error);
        }
    } else {
        socket.emit("private_message", { to: selectedUserId, message: compressedMessage });

        addMessage({
            body: compressedMessage,
            senderId: {
                userName: "Me",
                profilePicture: { secure_url: profileImgNow }
            }
        }, "sent");
    }

    input.value = "";
}

// Receive messages
socket.on("private_message", (msg) => {
    addMessage(msg, "received");
});

// Load users on start
loadUsers();
