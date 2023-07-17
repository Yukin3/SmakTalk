import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import { createContext } from "react";

import ReactSwitch from "react-switch";

export const ThemeContext = React.createContext(null);

function Chat({ socket, displayName, chatroom }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const [theme, setTheme] = useState("dark");
  const toggleTheme = () => {
    setTheme((curr) => (curr === "light" ? "dark" : "light"));
  };

  const deliverMessage = async () => {
    if (currentMessage !== "") {
      const messageInfo = {
        //contains info of the message contents
        chatroom: chatroom,
        sender: displayName,
        message: currentMessage,
        time: new Date(Date.now()).toLocaleTimeString(), //functions for converting locale time to string!!!
      };
      await socket.emit("deliver_message", messageInfo);
      setMessageList((list) => [...list, messageInfo]); //include sent message to chatlog list
      setCurrentMessage(""); //after delivering message reset the current message to empty string
    }
  };

  useEffect(
    //listen for changes to the socket server
    () => {
      socket.on("receive_message", (data) => {
        setMessageList((list) => [...list, data]); //include received message in chatlog list
        console.log(data);
      });
    },
    [socket]
  );

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="App" id={theme}>
        <div className="chat-window">
          <button
            className="leave-button"
            style={{ fontSize: "1.6rem" }}
            id={theme}
            onClick={() => window.location.reload(true)}
          >
            X
          </button>
          <div className="chat-header" id={theme}>
            <p className="chatroom-name"> {chatroom} </p>
          </div>
          <div className="chat-body" id={theme}>
            <ScrollToBottom className="message-container">
              {messageList.map((messageInfo) => {
                return (
                  <div
                    className="message"
                    id={displayName === messageInfo.sender ? "you" : "other"}
                  >
                    <div>
                      <div className="message-content">
                        <p>{messageInfo.message}</p>
                      </div>
                      <div className="message-meta">
                        <p id="author" style={{ color: "#111" }}>
                          {messageInfo.sender}
                        </p>
                        <p id="time" style={{ color: "#111" }}>
                          {messageInfo.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ); // RETURNS TWICE ???!!! //for each element in message list return the message
              })}
            </ScrollToBottom>
          </div>
          <div className="chat-footer">
            <input
              type="text"
              value={currentMessage} //value of textbox is set to current state of message i.e. typed message or empty string
              placeholder="Start Typing"
              onChange={(event) => {
                setCurrentMessage(event.target.value);
              }}
              id={theme}
              onKeyPress={(event) => {
                event.key === "Enter" && deliverMessage();
              }}
              required
            />
            <button onClick={deliverMessage}>&#10146;</button>
          </div>
        </div>
        <div className="color-mode-toggle">
          <ReactSwitch
            onChange={toggleTheme}
            checked={theme === "dark"} /* FIX BUTTON TOGGLE NOT A FUNCTION ???*/
          />
          <label id={theme}>
            {theme === "light" ? "Light mode" : "Dark mode"}
          </label>
        </div>
      </div>
    </ThemeContext.Provider>
  );
}

export default Chat;
