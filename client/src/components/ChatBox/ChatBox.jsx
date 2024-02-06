import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { addMessage, getMessages } from "../../api/MessageRequests";
import { getUser } from "../../api/UserRequests";
import "./ChatBox.css";
import { format } from "timeago.js";
import InputEmoji from 'react-input-emoji'
import UserMessage from "./UserMessage";

const ChatBox = ({ chat, currentUser, setSendMessage,  receivedMessage }) => {
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  // Handle image selection
  const handleImageChange = (event, senderId, chatId) => {
    const file = event.target.files[0];
    setSelectedImage(file);
  };

  const handleChange = (newMessage)=> {
    setNewMessage(newMessage)
  }

  // fetching data for header
  useEffect(() => {
    const userId = chat?.members?.find((id) => id !== currentUser);
    const getUserData = async () => {
      try {
        if(chat.name) {
          setUserData(chat);
          console.log(chat);
          return;
        }
        const { data } = await getUser(userId);
        setUserData(data);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };

    if (chat !== null) getUserData();
  }, [chat, currentUser]);

  useEffect(() => {
    console.log(userData);
  }, [userData]);

  // fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await getMessages(chat._id);
        setMessages(data);
      } catch (error) {
        console.log(error);
      }
    };
    if (chat !== null) fetchMessages();
  }, [chat]);

  // Always scroll to last Message
  useEffect(()=> {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  },[messages])

  
  // Send Message
  const handleSend = async (e, senderId, chatId) => {
    // Create form data
    const formData = new FormData();
    formData.append("senderId", senderId);
    formData.append("text", newMessage);
    formData.append("chatId", chatId);
    formData.append("image", selectedImage);

    e.preventDefault();
    const message = {
      senderId: currentUser,
      text: newMessage,
      chatId: chat._id,
      imageUrl: selectedImage,
    };
    // const receiverId = chat.members.find((id) => id !== currentUser);

    const messageData = {
      ...message,
      receiverIds: chat.members.filter(memberId => memberId !== currentUser),
    };
    setSendMessage(messageData);
    console.log("Sending from chatbox to :", chat.members.filter(memberId => memberId !== currentUser));
    console.log("Data: ", messageData);

    // Send message to all members
    // chat.members.forEach(async (memberId) => {
    //   if (memberId !== currentUser) {
    //     const receiverId = memberId;
    //     const messageData = {
    //       ...message,
    //       receiverId,
    //     };
    //     console.log("Sending from chatbox to :", receiverId);
    //     setSendMessage(messageData);
    //   }});

    // send message to socket server
      // setSendMessage({ ...message, receiverId });
    
      // send message to database
      try {
        const { data } = await addMessage(formData);
        setMessages([...messages, data]);
        setNewMessage("");
        setSelectedImage(null);
        console.log("Message Sent: ", data);
      } catch {
        console.log("error");
      }
  };

// Receive Message from parent component
useEffect(()=> {
  console.log("Message Arrived: ", receivedMessage)
  if (receivedMessage !== null && receivedMessage.chatId === chat._id) {
    setMessages([...messages, receivedMessage]);
  }

},[receivedMessage])

  const scroll = useRef();
  const imageRef = useRef();



return (
    <>
      <div className="ChatBox-container">
        {chat ? (
          <>
            {/* chat-header */}
            <div className="chat-header">
              <div className="follower">
                <div>
                  {chat.name ? (
                    <div className="name"><span>{chat.name}</span></div>
        ): (
          <>
            <img
                      src={
                        userData?.profilePicture
                          ? process.env.REACT_APP_PUBLIC_FOLDER +
                            userData.profilePicture
                          : process.env.REACT_APP_PUBLIC_FOLDER +
                            "defaultProfile.png"
                      }
                      alt="Profile"
                      className="followerImage"
                      style={{ width: "50px", height: "50px" }}
                    />
                    <div className="name" style={{ fontSize: "0.9rem" }}>
                      <span>
                        {userData?.firstname} {userData?.lastname}
                      </span>
                    </div>
          </>
        )}
                </div>
              </div>
              <hr
                style={{
                  width: "95%",
                  border: "0.1px solid #ececec",
                  marginTop: "20px",
                }}
              />
            </div>
            {/* chat-body */}
            <div className="chat-body" >
              {messages.map((message) => (
                <div key={message._id} ref={scroll} className={
                  message.senderId === currentUser
                  ? "message-item own-item"
                  : "message-item"
                }>
                  <UserMessage userId={message.senderId} currentUser={currentUser}/>
                  <div 
                    className={
                      message.senderId === currentUser
                        ? "message own"
                        : "message"
                    }
                  >
                    {message.imageUrl ? (
                      <img
                        src={`https://appchatn6iuh.s3.amazonaws.com/${message.imageUrl}`}
                        alt=""
                        style={{ maxWidth: "200px", maxHeight: "200px" }}
                      />
                    ) : (
                        <span>{message.text}</span>
                    )}
                    <span className="createAt">{format(message.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
            {/* chat-sender */}
            <div className="chat-sender">

              {/* Open Image Upload Dialog */}
              <div onClick={() => imageRef.current.click()}>+</div>
              <input
                type="file"
                name="image"
                id=""
                style={{ display: "none" }}
                ref={imageRef}
                onChange={(e) => handleImageChange(e, currentUser, chat._id)}
              />

              <InputEmoji
                value={newMessage}
                onChange={handleChange}
              />
              
              <div className="send-button button" onClick = {(e) => handleSend(e, currentUser, chat._id)}>Send</div>
              
            </div>{" "}
          </>
        ) : (
          <span className="chatbox-empty-message">
            Tap on a chat to start conversation...
          </span>
        )}
      </div>
    </>
  );
};

export default ChatBox;