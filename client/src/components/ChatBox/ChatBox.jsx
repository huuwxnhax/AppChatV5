import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { addMessage, getMessages } from "../../api/MessageRequests";
import { getUser } from "../../api/UserRequests";
import "./ChatBox.css";
import { format } from "timeago.js";
import InputEmoji from 'react-input-emoji'
import UserMessage from "./UserMessage";
import Logo from "../../img/logo.png";
import MenuIcon from '@mui/icons-material/Menu';
import { IconButton, Menu, MenuItem, Modal, Backdrop, Fade, Box } from '@mui/material';
import MembersModal from "../Modal/MembersModal";
import FollowModal from "../Modal/FollowModal";
import { deleteGroup, leaveGroup } from "../../api/GroupRequests";



const ChatBox = ({ chat, currentUser, setSendMessage,  receivedMessage, groupChats, updateGroupChatList }) => {
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectFile, setSelectFile] = useState(null);


  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [openMembersModal, setOpenMembersModal] = useState(false);
  const [openFollowModal, setOpenFollowModal] = useState(false);


  // Handle image selection
  const handleFileChange = (event, senderId, chatId) => {
    const file = event.target.files[0];
    setSelectFile(file);
  };

  const handleChange = (newMessage)=> {
    setNewMessage(newMessage)
  }

  const handleOpenMembersModal = () => {
    setOpenMembersModal(true);
  };

  const handleCloseMembersModal = () => {
    setOpenMembersModal(false);
  };

  const handleOpenFollowModal = () => {
    setOpenFollowModal(true);
  };

  const handleCloseFollowModal = () => {
    setOpenFollowModal(false);
  };

  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleLeaveGroup = async () => {
    try {
      // Leave group
      const { data } = await leaveGroup({ groupId: chat._id, memberIdToLeave: currentUser, requestingUserId: currentUser});
      updateGroupChatList(chat._id);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteGroup = async () => {
    try {
      // Delete group
      const { data } = await deleteGroup({ groupId: chat._id, requestingUserId: currentUser });
      updateGroupChatList(chat._id);
    } catch (error) {
      console.log(error);
    }
  };

  const handleMenuItemClick = (action) => {
    switch (action) {
      case 'viewMembers':
        handleOpenMembersModal();
        break;
      case 'addMember':
        handleOpenFollowModal();
        break;
      case 'leaveGroup':
        handleLeaveGroup();
        break;
      case 'deleteGroup':
        handleDeleteGroup();
        break;
      default:
        break;
    }
    setMenuAnchorEl(null); // Đóng menu dropdown sau khi thực hiện hành động
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };

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
  // const handleSend = async (e, senderId, chatId) => {
  //   // Create form data
  //   const formData = new FormData();
  //   formData.append("senderId", senderId);
  //   formData.append("text", newMessage);
  //   formData.append("chatId", chatId);
  //   formData.append("image", selectFile);

  //   e.preventDefault();

  //   const message = {
  //     senderId: currentUser,
  //     text: newMessage,
  //     chatId: chat._id,
  //     imageUrl: selectFile,
  //     // pdfUrl: selectFile,
  //     // docxUrl: selectFile,
  //     // videoUrl: selectFile,
  //   };
    
  //     // send message to database
  //     try {
  //       const { data } = await addMessage(formData);
  //       setMessages([...messages, data]);
  //       // Send message to all members
  //       const messageData = {
  //         ...message,
  //         receiverIds: chat.members.filter(memberId => memberId !== currentUser),
  //       };
  //       console.log("messageData: ", messageData)
  //       setSendMessage(messageData);

  //       setNewMessage("");
  //       setSelectFile(null);
  //       console.log("Message Sent to database: ", data);
  //     } catch {
  //       console.log("error");
  //     }
  // };

  // Gửi tin nhắn và sau đó gửi tin nhắn đến tất cả các thành viên của cuộc trò chuyện
const handleSend = async (e, senderId, chatId) => {
    e.preventDefault();

  if (newMessage.trim() !== '' || selectFile !== null) {
    try {
      // Tạo form data để gửi tin nhắn xuống cơ sở dữ liệu
      const formData = new FormData();
      formData.append("senderId", senderId);
      formData.append("text", newMessage);
      formData.append("chatId", chatId);
      formData.append("image", selectFile);

      // Gửi tin nhắn xuống cơ sở dữ liệu
      const { data: newMessageData } = await addMessage(formData);
      setMessages([...messages, newMessageData]);

      // Lấy tin nhắn từ cơ sở dữ liệu
      // (Nếu cần, bạn có thể sử dụng một hàm hoặc phương thức khác để lấy tin nhắn từ cơ sở dữ liệu)
      // Ở đây, tôi giả sử rằng bạn đã nhận được tin nhắn mới từ cơ sở dữ liệu và đặt tên là newMessageData

      // Gửi tin nhắn đến tất cả các thành viên của cuộc trò chuyện
      const messageData = {
        senderId: currentUser,
        text: newMessageData.text,
        chatId: newMessageData.chatId,
        imageUrl: newMessageData.imageUrl,
        pdfUrl: newMessageData.pdfUrl,
        docxUrl: newMessageData.docxUrl,
        videoUrl: newMessageData.videoUrl,
        receiverIds: chat.members.filter(memberId => memberId !== currentUser),
      };

      // Gửi tin nhắn đến tất cả các thành viên của cuộc trò chuyện thông qua máy chủ socket
      setSendMessage(messageData);

      // Xóa tin nhắn mới và file đã chọn sau khi gửi
      setNewMessage("");
      setSelectFile(null);

      console.log("Message Sent to database: ", newMessageData);
    } catch (error) {
      console.log("Error sending message: ", error);
    }
  } else {
    console.log("Please enter a message or select a file to send.");
  }
};


// Receive Message from parent component
// useEffect(()=> {
//   if (receivedMessage !== null && receivedMessage.chatId === chat._id) {
//     setMessages(prevMessages => [...prevMessages, receivedMessage]);
//     console.log("Message Received: ", receivedMessage);
//   }
// },[receivedMessage, chat])

useEffect(() => {
  if (receivedMessage !== null && receivedMessage.chatId) {
    if (!chat || receivedMessage.chatId !== chat._id) {
      // Nếu tin nhắn nhận được không thuộc chat hiện tại, không cập nhật messages
      return;
    }
    setMessages(prevMessages => [...prevMessages, receivedMessage]);
    console.log("Message Received: ", receivedMessage);
  }
}, [receivedMessage, chat]);



  const scroll = useRef();
  const fileRef = useRef();


return (
    <>
      <div className="ChatBox-container">
        {chat ? (
          <>
            {/* chat-header */}
            <div className="chat-header">
              <div className="header-content">
                <div>
                  {chat.name ? (
                    <div className="heading-group">
                      <div className="name"><span>{chat.name}</span></div>
                      <IconButton className="" onClick={handleMenuOpen}>
                        <MenuIcon />
                      </IconButton>
                      <Menu
                        anchorEl={menuAnchorEl}
                        open={Boolean(menuAnchorEl)}
                        onClose={() => setMenuAnchorEl(null)}
                      >
                        <MenuItem onClick={() => handleMenuItemClick('viewMembers')}>
                          List Members
                        </MenuItem>
                        <MenuItem onClick={() => handleMenuItemClick('addMember')}>
                          Add Members
                        </MenuItem>
                        <MenuItem onClick={() => handleMenuItemClick('leaveGroup')}>
                          Leave Group
                        </MenuItem>
                        {currentUser === chat.creator && (
                          <MenuItem onClick={() => handleMenuItemClick('deleteGroup')}>
                            Delete Group
                          </MenuItem>
                        )}
                      </Menu>
                      
                    </div>
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
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSend(e, currentUser, chat._id);
                  }
                }}
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
      {/* Modal for viewing members */}
      <Modal
        open={openMembersModal}
                        onClose={handleCloseMembersModal}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                        anima="true"
                        closeAfterTransition
                        slots={{backdrop: Backdrop}}
                        slotProps={{
                          backdrop: {
                            timeout: 500,
                          }
                        }}
                      >
                        <Fade in={openMembersModal}>
                          <Box sx={style} className="box-modal">
                            <MembersModal closeModal={handleCloseMembersModal} groupChats={chat}/>
                          </Box>
                        </Fade>
                      </Modal>

                      {/* Modal for adding members */}
                      <Modal
                        open={openFollowModal}
                        onClose={handleCloseFollowModal}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                        anima="true"
                        closeAfterTransition
                        slots={{backdrop: Backdrop}}
                        slotProps={{
                          backdrop: {
                            timeout: 500,
                          }
                        }}
                      >
                        <Fade in={openFollowModal}>
                          <Box sx={style} className="box-modal">
                            <FollowModal closeModal={handleCloseFollowModal} groupChats={chat}/>
                          </Box>
                        </Fade>
                      </Modal>
    </>
  );
};

export default ChatBox;