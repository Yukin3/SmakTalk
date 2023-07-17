import { useState } from "react";
import "./App.css";
import io from "socket.io-client";
import Chat from "./Chat.js";

const socket = io.connect("http://localhost:3001");

function App() {
  const [displayName, setDisplayname] = useState("");
  const [chatroom, setChatroomID] = useState("");
  const [showChatLog, setShowChatLog] = useState(false);

  const joinRoom = () => {
    if (displayName !== "" && chatroom !== "") {
      //ignored join room request if room and display name fields are left blank
      socket.emit("join_room", chatroom);
      setShowChatLog(true);
    }
  };

  return (
    <div className="App">
      {!showChatLog ? (
        <div className="joinChatContainer">
          <h3>SmakTalk</h3>
          <p>Enter a Room ID</p>
          <input
            type="text"
            placeholder="Enter Display Name"
            onChange={(event) => {
              setDisplayname(event.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Enter Room ID"
            onChange={(event) => {
              setChatroomID(event.target.value);
            }}
          />
          <button onClick={joinRoom}>Join Chatroom</button>
        </div>
      ) : (
        <Chat socket={socket} displayName={displayName} chatroom={chatroom} />
      )}
    </div>
  );
}

export default App;
