# CS551S: Web Development

## Assignment 3 

## Code overview
Builded a real time chat application using Node.js, Express, and Socket.IO. The app support live public chat, multiple rooms, and private messaging. 

## Features
-Real time communication: Utilizes Socket.io for instantaneous event communication between the client and server.
-Dynamic rooms and data segregation:Users can join the default 'General' room or create/join custom isolated rooms. This ensures Logical Isolation of data in each of the rooms. 
-Session Identity: Each user is assigned a unique Socket ID and a persistent profile "seed." This maintains a consistent visual identity and session identification, allowing users to reliably distinguish between participants.
-Private messaging
-Data persistence:All chat history is preserved in a structured messages.json file. This ensures that historical data remains available even after a server restart or client disconnection.
-Responsive User Interface: UI uses a fluid grid system (col-12 and col-md) to remain functional on mobile devices and desktop browsers.
Live indicators: such as user is typing to visualize the in real time chat. 
-Live notifications: status updates for the user about join/leave notifications.

## PROJECT ARCHITECTURE

```text
.
├── public/                  # Frontend Static Assets
│   ├── css/
│   │   └── style.css        # Responsive UI & custom chat styling (Bootstrap 5 overrides)
│   ├── js/
│   │   ├── chat.js          # Client-side Socket.IO events, DOM manipulation & typing indicators
│   │   └── lib/             # Third-party client scripts (jQuery, Socket.IO client SDK)
│   └── index.html           # Main SPA layout (Bootstrap grid: col-12 / col-md dynamic views)
├── data/
│   └── messages.json        # Persistent file-based chat history storage
├── server.js                # Express app server & Socket.IO real-time event router
├── package.json             # Node.js project manifest and dependency definitions
├── package-lock.json        # Pinned dependency lockfile
├── .gitignore               # Excludes node_modules and runtime configuration files
└── README.md                # Project documentation & operational guidelines
```

## Instalation and Set up 
To run this application locally, ensure you have Node.js installed.

-Extract the project files to your desired directory.

-Open your terminal and navigate to the project folder.

-Install dependencies running the below prompt within the terminal:

  npm install

-Start the server running the below prompt within the terminal:

node server.js

-Access the application: Open your browser and navigate to http://localhost:3000.

## How to operate the app
To experience the full functionality, please follow these steps:

1. Initial Authentication & Profile Setup
User Identity: Upon launching the application, enter a unique username.

Session Initialization: The system automatically assigns a persistent session ID and a unique profile to ensure visual identity and profile picture across the app.

2. Global Communication (General Room)
Default Connectivity: Users are automatically joined to the 'General' room upon sign in.

Historical Data: All existing messages within this room are retrieved from the server side JSON store, providing immediate access to previous context.

3. Isolated Room Creation & Management
Segmented Channels: To create a new private environment, type a unique name into the 'Join/Create' field in the sidebar.

4. Private Messaging
Recipient Selection: Click on any user within the sidebar active directory, then you would see a prompt to send a private message, click yes.

Af ther the message is sent you will identify it labeled as "(Private)" in the chat room window.

5. Multi Session Testing 
To fully visualize the real time capabilities, it is recommended to open multiple browser tabs or windows as different users.

You can observe how the User List and Typing Indicators update instantaneously across all sessions as users interact with different rooms or send private messages.

6. Session Termination & Persistence
Live Disconnection: When a user closes their browser window, the server broadcasts a "Leave" event, and the user's entry is removed from all active sidebars in real time.

Data Integrity: While the active session terminates, all sent messages remain Persistent in the server database for future retrieval.

## Backend and Frontend layers. 
-Frontend: HTML5, CSS3, JavaScript, Bootstrap 5, jQuery.

-Backend: Node.js, Express.js.

-Real Time communication: Socket.io.

-Storage: JSON-based persistent file storage.

## Additional information
I used a bootstrap for the UI of the front end, and focus my time on the back end.
While also I needed to update a lof on the boostrap as there was some content which as hard coded and I made work for by dinamic, however I used this bootstrap as a base. 
