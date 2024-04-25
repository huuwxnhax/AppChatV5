const io = require("socket.io")(8800, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let activeUsers = [];

io.on("connection", (socket) => {
  // add new User
  socket.on("new-user-add", (newUserId) => {
    // if user is not added previously
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      activeUsers.push({ userId: newUserId, socketId: socket.id });
      console.log("New User Connected", activeUsers);
    }
    // send all active users to new user
    io.emit("get-users", activeUsers);
  });

  socket.on("disconnect", () => {
    // remove user from active users
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    console.log("User Disconnected", activeUsers);
    // send all active users to all users
    io.emit("get-users", activeUsers);
  });

  // send message to a specific user
  // socket.on("send-message", (data) => {
  //   const { receiverId } = data;
  //   console.log("Receiver Id: ", receiverId);
  //   console.log("Active Users: ", activeUsers);
  //   console.log("Data: ", data);
  //   const user = activeUsers.find((user) => user.userId === receiverId);
  //   console.log("Sending from socket to :", receiverId)
  //   if (user) {
  //     io.to(user.socketId).emit("recieve-message", data);
  //   }
  // });

  // send message to a group
  socket.on("send-message", (data) => {
    const { receiverIds } = data;
    // Find all users in the chat
    const chatMembers = activeUsers.filter((user) =>
      receiverIds.includes(user.userId)
    );
    // Emit the message to each member's socket
    chatMembers.forEach((user) => {
      if (user.socketId) {
        io.to(user.socketId).emit("receive-message", data);
        console.log("Sending from socket to :", user.userId);
      }
    });
  });

  // Handle socket event for message deletion
  socket.on("delete-message", ({ messageId, chatId, receiverIds }) => {
    try {
      // Broadcast event to all users in the chat room to inform about message deletion
      const chatMembers = activeUsers.filter((user) =>
        receiverIds.includes(user.userId)
      );
      chatMembers.forEach((user) => {
        if (user.socketId && user.userId !== socket.userId) {
          io.to(user.socketId).emit("message-deleted", {
            messageId,
            chatId,
            receiverIds,
          });
          console.log("Sending from socket to :", user.userId);
        }
      });
    } catch (error) {
      console.log(error);
    }
  });
});
