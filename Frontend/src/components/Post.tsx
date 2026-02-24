import React, { useState, useEffect } from "react";
import { FaHeart, FaRegHeart, FaRegComment, FaUserMd, FaTrash, FaEdit } from "react-icons/fa";
import useComments from "../hooks/useComments";
import imageService from "../services/imageService";
import useUser from "../hooks/useUser";
import useLike from "../hooks/useLike";
import CommentsDialog from "./CommentsDialog";
import EditPostDialog from "./EditPostDialog";
import postService from "../services/postService";
import { User } from "../services/userService";
import "./Post.css";

interface PostProps {
  userId: string;
  owner: User;
  caption: string;
  postId: string;
  imageName: string;
  title?: string;
  ableToDeletePost?: boolean;
  deletePost?: (postId: string) => void;
  onPostEdited?: (updatedPost: any) => void;
}

const Post: React.FC<PostProps> = ({ owner, userId, caption, postId, imageName, title, ableToDeletePost, deletePost, onPostEdited }) => {
  const { comments, setComments } = useComments(postId);
  const { user } = useUser(userId);
  const [postImg, setPostImg] = useState("./images/default_post.png");
  const [profileImg, setProfileImg] = useState("./images/default_avatar.png");
  const [showComments, setShowComments] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [postData, setPostData] = useState({ title: title || "", content: caption || "" });
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

  const handleEditSubmit = async (data: { title: string; content: string; img: File | null }) => {
    try {
      const result = await postService.editPost(postId, data.title, data.content, data.img);
      if (result.post) {
        setPostData({ title: data.title, content: data.content });
        if (data.img) {
          setPostImg(URL.createObjectURL(data.img));
        }
        if (onPostEdited) {
          onPostEdited(result.post);
        }
      }
    } catch (error) {
      console.error("Error editing post:", error);
    }
  };

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
        <div className="ms-auto">
          {ableToDeletePost && (
            <>
              <FaEdit
                size={20}
                className="me-3 text-primary post-edit-icon"
                onClick={() => setShowEditDialog(true)}
                title="Edit post"
              />
              {deletePost && (
                <FaTrash
                  size={24}
                  className="ms-2 text-danger post-delete-icon"
                  onClick={() => deletePost(postId)}
                  title="Delete post"
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Post Image */}
      <img src={postImg} className="card-img-top post-image" alt="Post" />

      {/* Post Actions */}
      <div className="card-body">
        <div className="d-flex justify-content-between mb-2">
          <div>
            {/* Toggle Like Icon */}
            {liked ? (
              <FaHeart size={24} className="me-2 text-danger post-action-icon" onClick={toggleLike} />
            ) : (
              <FaRegHeart size={24} className="me-2 post-action-icon" onClick={toggleLike} />
            )}
            <span className="ms-1 me-3">{likesCount}</span>
            <FaRegComment onClick={() => setShowComments(true)} size={24} className="me-2 post-action-icon" />
          </div>
        </div>

        {/* Post Title */}
        {postData.title && (
          <p className="mb-1">
            <strong>{postData.title}</strong>
          </p>
        )}

        {/* Post Caption */}
        <p className="mb-1">
          <strong>{owner?.username}</strong> {postData.content}
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
          caption={postData.content}
          postId={postId}
        />
      )}

      <EditPostDialog
        show={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        onSubmit={handleEditSubmit}
        initialValues={{ title: postData.title, content: postData.content, img: null }}
        initialPreview={postImg}
      />
    </div>
  );
};

export default Post;
