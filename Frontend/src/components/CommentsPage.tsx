import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaUserMd } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import useComments from "../hooks/useComments";
import imageService from "../services/imageService";
import useUser from "../hooks/useUser";
import commentService from "../services/commentService";
import "./CommentsPage.css";

interface LocationState {
  postId: string;
  postImage: string;
  postCaption: string;
  postTitle: string;
  ownerId: string;
  ownerUsername: string;
}

const CommentsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;

  const { comments, setComments } = useComments(state?.postId || "");
  const [newComment, setNewComment] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [postImg, setPostImg] = useState(state?.postImage || "./images/default_post.png");
  const [currentUserId, setCurrentUserId] = useState("");
  const { user: currentUser } = useUser(currentUserId);

  useEffect(() => {
    // Get current user ID from JWT token
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decodedToken: { _id: string; random: string } = jwtDecode(token);
        setCurrentUserId(decodedToken._id);
      } catch (e) {
        console.error("Error decoding token:", e);
      }
    }
  }, []);

  useEffect(() => {
    const fetchProfileImage = async () => {
      if (currentUser && currentUser.imageName) {
        const url = await imageService.getProfileImage(currentUser.imageName);
        setProfileImage(url);
      }
    };

    fetchProfileImage();
  }, [currentUser]);

  const handleAddComment = async () => {
    if (newComment.trim() && currentUser) {
      const comment = {
        username: currentUser.username,
        comment: newComment,
        isOwnerVet: currentUser.isVet || false,
        postId: state.postId,
      };
      setComments([...comments, comment]);
      await commentService.addComment(comment, currentUser._id || "");
      setNewComment("");
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (!state) {
    return (
      <div className="comments-page">
        <div className="comments-header">
          <button className="back-button" onClick={handleGoBack}>
            <FaArrowLeft size={20} />
            Back
          </button>
        </div>
        <div className="comments-container">
          <p>Error: Post information not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="comments-page">
      {/* Header */}
      <div className="comments-header">
        <button className="back-button" onClick={handleGoBack}>
          <FaArrowLeft size={20} />
          Back
        </button>
        <h1>Comments</h1>
        <div style={{ width: "40px" }}></div>
      </div>

      {/* Post preview */}
      <div className="comments-container">
        <div className="post-preview">
          <img src={postImg} alt="Post" className="preview-image" />
          <div className="preview-caption">
            <p className="mb-1">
              <strong>{state.ownerUsername}</strong> {state.postCaption}
            </p>
            {state.postTitle && (
              <p className="mb-1">
                <strong>{state.postTitle}</strong>
              </p>
            )}
          </div>
        </div>

        {/* Comments count */}
        <div className="comments-count">
          <p>{comments.length} comment{comments.length !== 1 ? "s" : ""}</p>
        </div>

        {/* Comments list */}
        <div className="comments-list">
          {comments.map((comment, index) => (
            <div key={index} className="comment-item">
              <strong>{comment.username}:</strong> {comment.comment}
              {comment.isOwnerVet && <FaUserMd className="ms-2" title="Veterinarian" />}
            </div>
          ))}
          {comments.length === 0 && (
            <p className="no-comments">No comments yet. Be the first to comment!</p>
          )}
        </div>

        {/* Add comment */}
        {currentUser && (
          <div className="add-comment-section">
            <div className="comment-input-wrapper">
              {profileImage && (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="rounded-circle me-2"
                  width="40"
                  height="40"
                />
              )}
              <input
                type="text"
                className="form-control comment-input"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleAddComment();
                  }
                }}
              />
              <button
                className="btn btn-primary btn-sm comment-button"
                onClick={handleAddComment}
                disabled={!newComment.trim()}
              >
                Post
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentsPage;
