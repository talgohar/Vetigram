import { useEffect, useState } from "react";
import { User } from "../services/userService";
import commentService, { Comment } from "../services/commentService";
import Dialog from "./Dialog";
import { z } from "zod";
import imageService from "../services/imageService";
import { FaUserMd } from "react-icons/fa";
import "./CommentsDialog.css";
import "./CommentsDialog.css";

interface CommentsDialogProps {
  show: boolean;
  onClose: () => void;
  comments: Comment[];
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  user: User;
  caption: string;
  postImage: string;
  username: string;
  postId: string;
}

const CommentsDialog: React.FC<CommentsDialogProps> = ({
  show,
  onClose,
  comments,
  user,
  caption,
  postImage,
  postId,
  username,
  setComments,
}) => {
  const [newComment, setNewComment] = useState("");
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    const fetchProfileImage = async () => {
      if (user && user.imageName) {
        const url = await imageService.getProfileImage(user.imageName);
        setProfileImage(url);
      }
    };

    fetchProfileImage();
  }, [user]);
  const handleAddComment = async () => {
    if (newComment.trim()) {
      let comment = {
        username: user.username,
        comment: newComment,
        isOwnerVet: user.isVet,
        postId: postId,
      };
      setComments([...comments, comment]);
      commentService.addComment(comment, user._id);
      setNewComment("");
    }
  };

  return (
    <Dialog
      title="Comments"
      show={show}
      onClose={onClose}
      onSubmit={handleAddComment}
      schema={z.object({})}
      initialValues={{}}
      fields={[]}
    >
      <div className="modal-body">
        <div className="mb-3">
          <img src={postImage} className="card-img-top" alt="Post" />
          <p className="mt-2">
            <strong>{username}</strong> {caption}
          </p>
        </div>
        <div className="mb-3 comments-list">
          {comments.map((comment, index) => (
            <div key={index} className="mb-2">
              <strong>{comment.username}:</strong> {comment.comment}
              {comment.isOwnerVet && <FaUserMd className="ms-2" />}
            </div>
          ))}
        </div>
        <div className="d-flex align-items-center">
          {profileImage && (
            <img
              src={profileImage}
              alt="Profile"
              className="rounded-circle me-2"
              width="40"
              height="40"
            />)}
          <input
            type="text"
            className="form-control"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
        </div>
      </div>
    </Dialog>
  );
};

export default CommentsDialog;
