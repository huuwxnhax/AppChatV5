import React, { useEffect, useState } from "react";
import "./NavIcons.css";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../actions/AuthActions";
import { Backdrop, Box, Drawer, Fade, IconButton, Modal } from "@mui/material";

import Groups from "../Groups/Groups";
import LogoutIcon from '@mui/icons-material/Logout';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import FollowersCard from "../FollowersCard/FollowersCard";
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import ProfileModal from "../ProfileModal/ProfileModal";


import Following from "../Following/Following";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const NavIcons = ({ handleSelectUser }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.authReducer.authData);

  const handleLogout = () => {
    dispatch(logout());
    window.location.reload();
  }
  const navigate = useNavigate();

  const [openGroups, setOpenGroups] = useState(false);
  const handleOpenGroups = () => setOpenGroups(true);
  const handleCloseGroups = () => setOpenGroups(false);

  const [openUsers, setOpenUsers] = useState(false);
  const handleOpenUsers = () => setOpenUsers(true);
  const handleCloseUsers = () => setOpenUsers(false);  

  const [openDrawer, setOpenDrawer] = useState(false);
  const tonggleDrawer = () => setOpenDrawer(!openDrawer);

  const [openProfile, setOpenProfile] = useState(false);
  const handleOpenProfile = () => setOpenProfile(true);
  const handleCloseProfile = () => setOpenProfile(false);

  return (
      <div className="navIcons">
          {/*  logout */}
          <IconButton onClick={handleLogout}>
            <LogoutIcon className="icons" />
          </IconButton>
          
          {/*  list of users */}
          <IconButton onClick={handleOpenUsers}>
            <PersonAddAltIcon className="icons"/>
          </IconButton>
          <Modal
            open={openUsers}
            onClose={handleCloseUsers}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            closeAfterTransition
              slots={{backdrop: Backdrop}}
              slotProps={{
                backdrop: {
                  timeout: 500,
              }
            }}
          >
            <Fade in={openUsers}>
              <Box sx={style} className="box-modal">
                  <FollowersCard location='modal'/>
              </Box>
            </Fade>
          </Modal>
  
        {/*  create group */}
          <IconButton onClick={handleOpenGroups}>
            <GroupAddIcon className="icons"/>
          </IconButton>
            
              <Modal
                open={openGroups}
                onClose={handleCloseGroups}
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
                <Fade in={openGroups}>
                  <Box sx={style} className="box-modal">
                    <Groups closeModal={handleCloseGroups}/>
                  </Box>
                </Fade>
              </Modal>
         
          {/*  list of following */}
          <IconButton onClick={tonggleDrawer}>
            <PeopleOutlineIcon className="icons"/>
          </IconButton>
          <Drawer 
            anchor="right" 
            open={openDrawer} 
            onClose={tonggleDrawer}
          >
            <Following 
              handleSelectUser={handleSelectUser} 
              closeModal={tonggleDrawer}
            />
          </Drawer>
  
          {/*  profile */}
          <IconButton onClick={handleOpenProfile}>
            <PermIdentityIcon className="icons"/>
          </IconButton>
          <ProfileModal
            modalOpened={openProfile}
            setModalOpened={setOpenProfile}
            data={user}
          />
      </div>
  );
};

export default NavIcons;
