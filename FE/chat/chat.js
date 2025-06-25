

const encrypt = (text) => 
        CryptoJS.AES.encrypt(text, 'encrypt-message-secret-key').toString();
    

const decrypt = (text) => 
     CryptoJS.AES.decrypt(text,'encrypt-message-secret-key').toString(CryptoJS.enc.Utf8);
    

class Node {
    constructor(char, freq, left = null, right = null) {
      this.char = char;
      this.freq = freq;
      this.left = left;
      this.right = right;
    }
  }
  
  function buildHuffmanTree(text) {

    const freqMap = new Map();
    for (let char of text) {
      freqMap.set(char, (freqMap.get(char) || 0) + 1);
    }
  
    console.log({freqMap : freqMap.get('l')});
    
    let nodes = Array.from(freqMap, ([char, freq]) => new Node(char, freq));
    let x = Array.from(freqMap, ([char, freq]) => new Node(char, freq));
    console.log(x);
    
    
  // desc asc
    while (nodes.length > 1) {
      nodes.sort((a, b) => a.freq - b.freq);
  
      const left = nodes.shift();
      const right = nodes.shift();
        // a b ab
      const merged = new Node(null, left.freq + right.freq, left, right);
      nodes.push(merged);
    }
    
    return nodes[0]; 
  }

  function buildCodes(node, path = "", map = {}) {

    if (!node.left && !node.right) {
      map[node.char] = path;

    }
    //recursion
    // a 0
    if (node.left) buildCodes(node.left, path + "0", map);
    if (node.right) buildCodes(node.right, path + "1", map);
    console.log({map});
    
    return map;
  }
  
function huffmanEncode(text) {
    const tree = buildHuffmanTree(text);
    
    const codes = buildCodes(tree);
    console.log({codes});
    
  
    let encodedText = "";
    for (let char of text) {
        encodedText += codes[char];
    }
  
    return { encodedText, tree };
  }
  
  function huffmanDecode(encodedText, tree) {
    let result = "";
    let node = tree;
    for (let bit of encodedText) {
      node = bit === "0" ? node.left : node.right;
    
      if (!node.left && !node.right) {
        result += node.char;
        node = tree; 
      }
    }
  
    return result;
  }
  



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
    const senderName = type === "received" ? (msg.senderId?.userName) : "Me";
    const body = decrypt(huffmanDecode(msg.body ,msg.tree)) 

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
    const senderName = type === "received" ? "AI" : "Me";
    const body =  huffmanDecode(msg.body , msg.tree)

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
    
    if (selectedUserId === "ai-chat") {
        
        
        const compressedMessage = huffmanEncode(message);

        addAIMessage({
            body: compressedMessage.encodedText,
            tree: compressedMessage.tree,
            senderId: {
                userName: "Me",
                profilePicture: { secure_url: profileImgNow }
            }
        }, "sent");


        try {
            const response = await fetch("http://localhost:3000/chat/ai", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `user ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({body :compressedMessage.encodedText , tree : compressedMessage.tree}),
            });

            const res = await response.json();

            const {AIMessage} = res;

            addAIMessage({
                ...AIMessage,
                senderId: {
                    userName: "AI",
                    profilePicture: { secure_url: profileImgNow }
                }
            }, "received");

        } catch (error) {
            console.error("Failed to send message to AI:", error);
        }
    } 
    else {
        
        const compressedMessage = huffmanEncode(encrypt(message));
        socket.emit("private_message", { to: selectedUserId, message: compressedMessage });
        
        addMessage({
            body: compressedMessage.encodedText,
            tree: compressedMessage.tree,
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
