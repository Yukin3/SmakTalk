const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", //call URL, react server from local host
    methods: ["GET", "POST"], //accepted messages
  },
}); //established connection

io.on("connection", (socket) => {
  //detect if user connects to server
  console.log(`The  user id, ${socket.id} has CONNECTED..📲`);

  socket.on("join_room", (data) => {
    //event checker for a chatroo join request
    socket.join(data);
    console.log(`User, ${socket.id} has joined the room "${data}"..👋🏾`);
  });

  socket.on("deliver_message", (data) => {
    socket.to(data.chatroom).emit("receive_message", data);
    console.log(data);
  });

  socket.on("disconnect", () => {
    //event checker for disconnected user
    console.log(`User ${socket.id} has DISCONNECTED..🏃🏾💨`);
  });
});

server.listen(3001, () => {
  //socket io server is running
  console.log(`The server is running.✅`);
});
