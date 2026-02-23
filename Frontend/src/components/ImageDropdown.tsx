import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ImageDropdown.css";
import LogoutConfirmationDialog from "./LogoutConfirmationDialog";
import { logout } from "../services/authService";
import useUser from "../hooks/useUser";
import imageService from "../services/imageService";
import { useNavigate } from "react-router-dom";

interface ImageDropdownProps {
  userId: string;
  setRenderOnLogout: (value: boolean) => void;
}

const ImageDropdown: React.FC<ImageDropdownProps> = ({ userId, setRenderOnLogout }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [profileImage, setProfileImg] = useState<string | null>(null);
  const { user } = useUser(userId);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const nevigate = useNavigate();

  useEffect(() => {
    const fetchProfileImage = async () => {
      if (user && user.imageName) {
        console.log("imageName", user.imageName);  
        const url = await imageService.getProfileImage(user.imageName);
        setProfileImg(url);
      }
    };
    console.log("user", user);
    if(user){
      fetchProfileImage();
    }

  }, [user]);

  const toggleMenu = () => {
    setShowMenu((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setShowMenu(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setShowLogoutDialog(true);
  };

  const handleProfile = () => {
    nevigate('/profile', { state: { userId: userId } });
  };

  const handleLogoutConfirm = async () => {
    if (user) {
      await logout(user?.refreshToken[user.refreshToken.length - 1]);
      setRenderOnLogout(true);
    }
    setShowLogoutDialog(false);
  };

  return (
    <div className="position-fixed d-inline-block image-dropdown-container" ref={menuRef}>
      <img
        src={profileImage ?? "./images/default_avatar.png"}
        alt="Profile"
        className="profile-avatar-img"
        onClick={toggleMenu}
      />

      {showMenu && (
        <div className="d-flex flex-column bg-white border rounded shadow dropdown-menu">
          <button className="btn dropdown-item" onClick={() => handleProfile()}>Profile</button>
          <button className="btn dropdown-item" onClick={() => handleLogout()}>Logout</button>
        </div>
      )}

      <LogoutConfirmationDialog
        show={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        onConfirm={handleLogoutConfirm}
      />

    </div>
  );
};

export default ImageDropdown;