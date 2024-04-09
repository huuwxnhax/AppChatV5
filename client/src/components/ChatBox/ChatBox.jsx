import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { addMessage, getMessages } from "../../api/MessageRequests";
import { getUser } from "../../api/UserRequests";
import "./ChatBox.css";
import { format } from "timeago.js";
import InputEmoji from 'react-input-emoji'
import UserMessage from "./UserMessage";
import Logo from "../../img/logo.png";



const ChatBox = ({ chat, currentUser, setSendMessage,  receivedMessage }) => {
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectFile, setSelectFile] = useState(null);


  // Handle image selection
  const handleFileChange = (event, senderId, chatId) => {
    const file = event.target.files[0];
    setSelectFile(file);
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
          // console.log(chat);
          return;
        }
        const { data } = await getUser(userId);
        setUserData(data);
        // console.log(data);
      } catch (error) {
        console.log(error);
      }
    };

    if (chat !== null) getUserData();
  }, [chat, currentUser]);

  // fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await getMessages(chat._id);
        console.log("Messages: ", data);
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
    formData.append("image", selectFile);

    e.preventDefault();

    const message = {
      senderId: currentUser,
      text: newMessage,
      chatId: chat._id,
      imageUrl: selectFile,
      // pdfUrl: selectFile,
      // docxUrl: selectFile,
      // videoUrl: selectFile,
    };
    
      // send message to database
      try {
        const { data } = await addMessage(formData);
        setMessages([...messages, data]);
        // Send message to all members
        const messageData = {
          ...message,
          receiverIds: chat.members.filter(memberId => memberId !== currentUser),
        };
        console.log("messageData: ", messageData)
        setSendMessage(messageData);

        setNewMessage("");
        setSelectFile(null);
        console.log("Message Sent to database: ", data);
      } catch {
        console.log("error");
      }
  };

// Receive Message from parent component
useEffect(()=> {
  if (receivedMessage !== null && receivedMessage.chatId === chat._id) {
    setMessages(prevMessages => [...prevMessages, receivedMessage]);
    console.log("Message Received: ", receivedMessage);
  }
},[receivedMessage])

  const scroll = useRef();
  const fileRef = useRef();

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
                }
                >
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
                    ) : message.pdfUrl ? (
                      <a href={`https://appchatn6iuh.s3.amazonaws.com/${message.pdfUrl}`} target="_blank" rel="noopener noreferrer">
                        Download PDF
                      </a>
                    ) : message.docxUrl ? (
                      <a href={`https://appchatn6iuh.s3.amazonaws.com/${message.docxUrl}`} target="_blank" rel="noopener noreferrer">
                        Download DOCX
                      </a>
                    ) : message.videoUrl ? (
                      <video width="320" height="240" controls>
                        <source src={`https://appchatn6iuh.s3.amazonaws.com/${message.videoUrl}`} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
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

              {/* Open file Upload Dialog */}
              <div onClick={() => fileRef.current.click()}>+</div>
              <input
                type="file"
                name="image"
                id=""
                style={{ display: "none" }}
                ref={fileRef}
                onChange={(e) => handleFileChange(e, currentUser, chat._id)}
              />

              <InputEmoji
                value={newMessage}
                onChange={handleChange}
              />
              
              <div className="send-button button" onClick = {(e) => handleSend(e, currentUser, chat._id)}>Send</div>
              
            </div>{" "}
          </>
        ) : (
          <div className="chatbox-empty-section">
            <span className="chatbox-empty-message">
            {/* add logo here */}
              Tap on a chat to start conversation...
            </span>
            <img src={Logo}/>
          </div>
        )}
      </div>
    </>
  );
};

export default ChatBox;