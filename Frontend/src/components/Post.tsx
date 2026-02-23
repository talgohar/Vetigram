import React, { useState, useEffect } from "react";
import { FaHeart, FaRegHeart, FaRegComment, FaUserMd, FaTrash } from "react-icons/fa";
import useComments from "../hooks/useComments";
import imageService from "../services/imageService";
import useUser from "../hooks/useUser";
import useLike from "../hooks/useLike";
import CommentsDialog from "./CommentsDialog";
import { User } from "../services/userService";
import "./Post.css";

interface PostProps {
  userId: string;
  owner: User;
  caption: string;
  postId: string;
  imageName: string;
  ableToDeletePost?: boolean;
  deletePost?: (postId: string) => void;
}

const Post: React.FC<PostProps> = ({ owner, userId, caption, postId, imageName, ableToDeletePost, deletePost}) => {
  const { comments, setComments } = useComments(postId);
  const { user } = useUser(userId);
  const [postImg, setPostImg] = useState("./images/default_post.png");
  const [profileImg, setProfileImg] = useState("./images/default_avatar.png");
  const [showComments, setShowComments] = useState(false);
  const { liked, likesCount, toggleLike } = useLike(postId, user?._id || "");

  useEffect(() => {
    const fetchPostImage = async () => {
      if (imageName && owner) {
        const url = await imageService.getPostImage(imageName, owner._id);
        setPostImg(url);
      }
    };

    const fetchProfileImage = async () => {      
      if (owner) {
        const url = await imageService.getProfileImage(owner.imageName);
        setProfileImg(url);
      }
    };
    fetchPostImage();
    fetchProfileImage();
  }, [postId, imageName, owner, owner?.imageName]);

  return (
    <div className="card my-3 post-card">
      {/* Post Header */}
      <div className="card-header d-flex align-items-center">
        <img
          src={profileImg}
          alt="Profile"
          className="rounded-circle me-2"
          width="40"
          height="40"
        />
        <strong>{owner?.username}</strong>
        {owner && owner.isVet && <FaUserMd className="ms-2" />}
        {ableToDeletePost && deletePost && <FaTrash
          size={24}
          className="ms-auto text-danger post-delete-icon"
          onClick={() => deletePost(postId)}
        />}
      </div>

      {/* Post Image */}
      <img src={postImg} className="card-img-top post-image" alt="Post" />

      {/* Post Actions */}
      <div className="card-body">
        <div className="d-flex justify-content-between mb-2">
          <div>
            {/* Toggle Like Icon */}
            <span className="m-3">{likesCount}</span>
            {liked ? (
              <FaHeart size={24} className="me-2 text-danger post-action-icon" onClick={toggleLike} />
            ) : (
              <FaRegHeart size={24} className="me-2 post-action-icon" onClick={toggleLike} />
            )}
            <FaRegComment onClick={() => setShowComments(true)} size={24} className="me-2 post-action-icon" />
          </div>
        </div>

        {/* Post Caption */}
        <p className="mb-1">
          <strong>{owner?.username}</strong> {caption}
        </p>

        {/* Display First 3 Comments (if any exist) */}
        {comments.length > 0 && (
          <div className="mt-2">
            {comments.slice(0, 3).map((comment, index) => (
              <p key={index} className="mb-1">
                <strong>{comment.username}:</strong> {comment.comment}
                {comment.isOwnerVet  && <FaUserMd className="ms-2" />} 
              </p>
            ))}
          </div>
        )}
      </div>

      {user && (
        <CommentsDialog
          username={owner && owner.username}
          show={showComments}
          comments={comments}
          onClose={() => setShowComments(false)}
          setComments={setComments}
          user={user}
          postImage={postImg}
          caption={caption}
          postId={postId}
        />
      )}
    </div>
  );
};

export default Post;
