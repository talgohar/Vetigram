import React, { useState, useEffect } from "react";
import { FaHeart, FaRegHeart, FaRegComment, FaUserMd, FaTrash } from "react-icons/fa";
import useComments from "../hooks/useComments";
import imageService from "../services/imageService";
import useUser from "../hooks/useUser";
import useLike from "../hooks/useLike";
import CommentsDialog from "./CommentsDialog";
import { User } from "../services/userService";

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
    <div className="card mx-auto my-3" style={{ maxWidth: "50vw" }}>
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
        {owner && owner.isDoctor && <FaUserMd className="ms-2" />}
        {ableToDeletePost && deletePost && <FaTrash
          size={24}
          className="ms-auto text-danger"
          onClick={() => deletePost(postId)} // Add delete button
          style={{ cursor: "pointer" }}
        />}
      </div>

      {/* Post Image */}
      <img src={postImg} className="card-img-top" style={{height: '60vh',width: '40vw' }} alt="Post" />

      {/* Post Actions */}
      <div className="card-body">
        <div className="d-flex justify-content-between mb-2">
          <div>
            {/* Toggle Like Icon */}
            <span className="m-3">{likesCount}</span>
            {liked ? (
              <FaHeart size={24} className="me-2 text-danger" onClick={toggleLike} style={{ cursor: "pointer" }} />
            ) : (
              <FaRegHeart size={24} className="me-2" onClick={toggleLike} style={{ cursor: "pointer" }} />
            )}
            <FaRegComment onClick={() => setShowComments(true)} size={24} className="me-2" />
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
                {comment.isOwnerDoctor  && <FaUserMd className="ms-2" />} 
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
