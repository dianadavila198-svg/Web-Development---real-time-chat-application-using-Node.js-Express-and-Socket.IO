//---SERVER ---//

//------IMPORTS------//
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const fs = require('fs');

// --- MIDDLEWARE---//
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //Translates incoming form data into a JavaScript object (req.body)

// --- Server and socket initialization---//
const server = http.createServer(app);
const io = socketIo(server);

// Store conversations per chat
const DATA_FILE = 'messages.json';

//----ERROR HANDLING---//

//load history error handling
let chatmsg = {};
if (fs.existsSync(DATA_FILE)) {
    try { const fileData = fs.readFileSync(DATA_FILE, 'utf8');
        chatmsg = JSON.parse (fileData)
        console.log ("here your chat history!")
    } catch (error) {
        console.error("Error loading your chat history, starting refresh", error);
        chatmsg = {};
        }
    }
    
//---SERVER SIDE EVENT LISTENERS & MESSAGE HANDLING---//

//save chat history error handling
const saveMessages = () => {
    try {
        // Convert the object to a string 
        const data = JSON.stringify(chatmsg, null, 2); //(the '2' makes it indented/readable)
        // Write it to the path defined in DATA_FILE
        fs.writeFileSync(DATA_FILE, data);
    } catch (error) {
        console.error("Could not save messages:", error);
    }
};

// Store user data
const users = {};

//----EVENT LISTENERS---//
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  socket.on('join chat', (data) => {
    const { username, chat, seed } = data; // Receive the seed

    // Store user info with socket ID as unique key
    users[socket.id] = { username, chat, seed };

    // Join the chat
    socket.join(chat);
    console.log(`${username} joined chat: ${chat}`);

    // Initialize chat conversation if doesn't exist
    if (!chatmsg[chat]) {
      chatmsg[chat] = [];
    }

    // Send existing messages for this chat to the new user
    // This creates an array where each user object NOW includes their unique ID
    const userList = Object.keys(users).map(id => ({
    id: id,
    ...users[id]
    }));

    // broadcast updated user list to all clientes
    io.emit('user list', userList);

    //show this detailed list to everyone
    socket.emit('load chat', chatmsg[chat]);

    // Tell everyone else in THIS ROOM that someone joined
    socket.to(chat).emit('notification', `${username} has joined the chat`);
  });

  socket.on('add message', (data) => {
    const user = users[socket.id];
    if (!user) return;// check if the user exists in the users object
    
    //Basic error handling: check if data exists and message has content
    if (!data || !data.message || data.message.trim().length === 0) {
        console.warn(`Invalid message attempt by ${user.username}`);

        //message for the user
        socket.emit('error notification', 'Message cannot be empty!');
        return; 
        }

    const messageData = {
        username: user.username,
        message: data.message.trim(),
        timestamp: new Date().toLocaleTimeString(),
        id: user.username + Date.now()
    };

    if (!chatmsg[user.chat]) {
        chatmsg[user.chat] = [];
    }
    
    chatmsg[user.chat].push(messageData);
    saveMessages();
    io.to(user.chat).emit('new message', messageData);
    console.log(`[${user.chat}] ${user.username}: ${data.message}`);
    });

  //Update side bar with users that leave/disconnect
  socket.on('disconnect', () => {
    const user = users[socket.id];// Find the user before deleting them
    if (user) {
      console.log(`${user.username} left chat: ${user.chat}`);

      //Remove user from memory
      delete users[socket.id];

      //Map the IDs for the remaining users so no refresh needed
      const updatedUserList = Object.keys(users).map(id => ({
          id: id,
          ...users[id]
      }));

      //Update user list to everyone, the name dissapear from everyone´s sidebar.
      io.emit('user list', updatedUserList);

      // Notify others in the specific room
      socket.to(user.chat).emit('notification', `${user.username} has left`);
    }
  });

  // Handle Private Messaging
socket.on('private message', (data) => {
    const sender = users[socket.id];
    
    // Check if the sender exists. have a target ID
    if (sender && data.to) {
        const messageData = {
            username: `(Private from ${sender.username})`,
            message: data.message,
            timestamp: new Date().toLocaleTimeString()
        };

        // Emit to the specific target socket ID
        io.to(data.to).emit('new message', messageData);

        // emit back to the sender so they users see their own sent message
        socket.emit('new message', {
            ...messageData,
            username: `(Private to ${users[data.to]?.username || 'User'})`
        });
    }
  });

  //Handle typing indicator
  socket.on('typing', (isTyping) => {
    const user = users[socket.id];
    if (user) {
      // Broadcast to others in the same chat
      socket.to(user.chat).emit('user typing', { 
        username: user.username, 
        isTyping 
      });
    }
  });

  
});

//Error handling for GET/POST requests that don't exist
app.use((req, res) => {
    res.status(404).send("Sorry, that page doesn't exist!");
});

//Start the server. Port listener //
     const PORT = 3000;
     server.listen(PORT, () => {
       console.log(`Server is running on port ${PORT}`);
     });



