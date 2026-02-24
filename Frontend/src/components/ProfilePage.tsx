import React, { useState, useEffect } from "react";
import Post from "./Post";
import ProfileUpdateDialog from "./ProfileUpdateDialog";
import useUser from "../hooks/useUser";
import usePosts from "../hooks/usePosts";
import imageService from "../services/imageService";
import { addProfileImage, isTokenValid } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import userService from "../services/userService";
import "./ProfilePage.css";


const ProfilePage: React.FC = () => {
  const [userId, setUserId] = useState("");
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [profileImage, setProfileImg] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthToken = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token || !(await isTokenValid())) {
        navigate("/login");
      } else {
        const decodedToken: { _id: string; random: string } = jwtDecode(token);
        setUserId(decodedToken._id);
      }
    };
    checkAuthToken();
  }, []);

  let { user } = useUser(userId);
  const { posts, loading, error, deletePost } = usePosts(userId);

  useEffect(() => {
    const fetchProfileImage = async () => {
      if (user) {
        const url = await imageService.getProfileImage(user.imageName);
        setProfileImg(url);
      }
    };
    fetchProfileImage();
  }, [userId, user]);

  const handleProfileSubmit = async (data: any) => {
    if (user?.username !== data.username) {
      user = await userService.updateProfile(data.username);
    }
    if (data.img) {
      const response = await (await addProfileImage(data.img)).request;
      if (response.status === 200) {
        const url = response.data.url;
        setProfileImg(url);
        // setProfileImageUpdate((prev) => !prev);
      }
    }
    if (data.img || user?.username !== data.username) {
      window.location.reload();
    }
    setShowProfileDialog(false);
  };

  return (
    <div className="home-page">
  <div className="home-header">
    <div className="home-logo">🐾</div>
    <h1 className="home-title">Vetigram</h1>
  </div>
    <div className="container d-flex flex-column align-items-center justify-content-center min-vh-100 position-relative">
      <div className="d-flex align-items-center mb-4">
        <img
          src={profileImage ?? "./images/default_avatar.png"}
          alt="Profile"
          className="rounded-circle"
          width="100"
          height="100"
          style={{ cursor: "pointer" }}
          onClick={() => setShowProfileDialog(true)}
        />
        <h2 className="ms-3">{user?.username}</h2>
      </div>
      <button
        className="btn btn-primary mb-4"
        onClick={() => navigate("/")}
      >
        חזרה לעמוד הראשי
      </button>
      <h3>הפוסטים שלי</h3>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
        {posts.map((postItem) => (
          <div key={postItem._id}>
            <Post
              userId={userId}
              owner={postItem.owner}
              postId={postItem._id}
              caption={postItem.content}
              imageName={postItem.imageName}
              title={postItem.title}
              ableToDeletePost={true}
              deletePost={deletePost}
            />
          </div>
        ))}

      <ProfileUpdateDialog
        key={user?._id}
        show={showProfileDialog}
        onClose={() => setShowProfileDialog(false)}
        onSubmit={handleProfileSubmit}
        initialPreview={profileImage ?? "./images/default_avatar.png"}
        initialValues={{ username: user?.username || "", img: null as File | null }}
      />
    </div>
  </div>
  );
};

export default ProfilePage;