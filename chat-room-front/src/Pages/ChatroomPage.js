import React from "react";
import { useEffect, useState, useRef } from "react";
import { withRouter } from "react-router";

export default withRouter(function ChatroomPage({ match, socket }) {
  const chatroomId = match.params.id;
  const [messages, setMessages] = useState([]);
  const messageRef = useRef();
  const [userId, setUserId] = useState("");

  const sendMessage = () => {
    if (socket) {
      console.log(messageRef.current.value);
      socket.emit("chatroomMessage", {
        chatroomId,
        message: messageRef.current.value,
      });
      messageRef.current.value = "";
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("CC_Token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserId(payload.id);
    }
    if (socket) {
      socket.on("newMessage", (message) => {
        const newMessages = [...messages, message];
        setMessages(newMessages);
      });
    }
    //eslint-disable-next-line
  }, [messages]);

  useEffect(() => {
    if (socket) {
      socket.emit("joinRoom", {
        chatroomId,
      });

      return () => {
        if (socket) {
          socket.emit("leaveRoom", {
            chatroomId,
          });
        }
      };
    }
    //eslint-disable-next-line
  }, []);
  return (
    <div className="chatroomPage">
      <div className="chatroomSection">
        <div className="cardHeader">Chatroom Name</div>
        <div className="chatroomContent">
          {messages.map((message, i) => (
            <div key={i} className="message">
              <span
                className={
                  userId === message.userId ? "ownMessage" : "otherMessage"
                }
              >
                {message.name}:{" "}
              </span>
              {message.message}
            </div>
          ))}
        </div>
        <div className="chatroomActions">
          <div>
            <input
              type="text"
              name="message"
              placeholder="Type message here"
              ref={messageRef}
            />
          </div>
          <div>
            <button className="join" onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});
