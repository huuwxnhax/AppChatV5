import React, { useEffect, useState } from 'react'
import { Modal, useMantineTheme } from "@mantine/core";
import './Modal.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { changePassword } from '../../api/UserRequests';
import { logout } from '../../actions/AuthActions';
import { Button } from '@mui/material';


const ChangePasswordModal = ({ modalOpened, setModalOpened }) => {
    const { user } = useSelector((state) => state.authReducer.authData);
    const initialState = {
        username: user.username,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    }
    const dispatch = useDispatch();
    const [data, setData] = useState(initialState);
    const [isError, setIsError] = useState(true);
    const [successModalOpened, setSuccessModalOpened] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const theme = useMantineTheme();

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsError(true);
        if (data.newPassword === data.confirmPassword) {
            setIsError(true);
            try {
                await changePassword(data);
                // dispatch(logout());
                setModalOpened(false);
                setSuccessModalOpened(true);
            } catch (error) {
                setIsError(false);
                setErrorMessage("Invalid Password");
            }
        } else {
            setIsError(false);
            setErrorMessage("New password and confirm password do not match");
        }
    }

    const handleSuccessModalClose = () => {
        setSuccessModalOpened(false); // Đóng modal thông báo thành công
        dispatch(logout()); // Đăng xuất người dùng
    }

  return (
    <>
        <Modal
            overlayColor={
            theme.colorScheme === "dark"
              ? theme.colors.dark[9]
              : theme.colors.gray[2]
          }
          overlayOpacity={0.55}
          overlayBlur={3}
          size="40%"
            opened={modalOpened}
            onClose={() => setModalOpened(false)}
        >
            <div className="modal">
                <div className="modal__header">
                <h2>Change Password</h2>
                </div>
                <div className="modal__body">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="currentPassword">Current Password</label>
                        <input onChange={handleChange} type="password" id="currentPassword" name='currentPassword'/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="newPassword">New Password</label>
                        <input onChange={handleChange} type="password" id="newPassword" name='newPassword'/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input onChange={handleChange} type="password" id="confirmPassword" name='confirmPassword'/>
                    </div>
                    <div className="form-group">
                        <button type="submit">Change Password</button>
                    </div>
                    {!isError && (
                        <div className="error-message">{errorMessage}</div>
                    )}
                </form>
                </div>
            </div>
        </Modal>
        <Modal
            opened={successModalOpened} // Hiển thị modal thông báo thành công
            onClose={handleSuccessModalClose} // Xử lý khi đóng modal
        >
            <div className="success-modal">
                <h2>Password Changed Successfully</h2>
                <Button
                    variant="contained"
                    color="primary"  
                    onClick={handleSuccessModalClose}
                >
                    Login Again
                </Button>
            </div>
        </Modal>
                
    </>
  )
}

export default ChangePasswordModal