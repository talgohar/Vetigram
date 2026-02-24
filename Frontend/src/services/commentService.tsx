import { apiClient, CanceledError } from "./api-client";
import userService from "./userService";

export { CanceledError };

export interface CommentDTO {
  _id?: string;
  comment: string;
  owner: string;
  isOwnerVet: boolean;
  postId: string;
}

export interface Comment {
  _id?: string;
  postId: string;
  comment: string;
  username: string;
  isOwnerVet: boolean;
  owner?: string;
}

const getPostComments = async (postId: string) => {
  const abortController = new AbortController();
  try {
    const response = await apiClient.get<CommentDTO[]>(`/comments/${postId}`, {
      signal: abortController.signal,
    });
    const comments: Comment[] = [];
    for (const commentDTO of response.data) {
        const username = await userService.getUsername(commentDTO.owner);
        comments.push({
        _id: commentDTO._id,
        postId: commentDTO.postId,
        comment: commentDTO.comment,
        username: username,
        isOwnerVet: commentDTO.isOwnerVet,
        owner: commentDTO.owner,
      });
    }
    return { comments, abort: () => abortController.abort() };
  } catch (error) {
    if (error instanceof CanceledError) {
      console.log("Request canceled");
    } else {
      console.error("Error fetching comments:", error);
    }
    return { comments: [], abort: () => abortController.abort() };
  }
};

const addComment = async (comment: Comment, owner: string ) => {
    const abortController = new AbortController();
    try {
        const response = await apiClient.post<CommentDTO>("/comments", 
            {
            comment: comment.comment,
            isOwnerVet: comment.isOwnerVet,
            owner: owner,
            postId: comment.postId,
            }, {
        signal: abortController.signal,
        headers: {
            "Content-Type": "application/json",
        },
        });
        if (response.status !== 201) {
        console.error("Failed to create comment");
        return { success: false, createdComment: null, abort: () => abortController.abort() };
        }
        const createdComment: Comment = {
            _id: response.data._id,
            postId: response.data.postId,
            comment: response.data.comment,
            username: comment.username,
            isOwnerVet: response.data.isOwnerVet,
            owner: response.data.owner,
        };
        return { success: true, createdComment, abort: () => abortController.abort() };
    } catch (error) {
        if (error instanceof CanceledError) {
        console.log("Request canceled");
        } else {
        console.error("Error creating comment:", error);
        }
        return { success: false, createdComment: null, abort: () => abortController.abort() };
    }
    }

const deleteComment = async (commentId: string) => {
    const abortController = new AbortController();
    try {
        const response = await apiClient.delete(`/comments/${commentId}`, {
            signal: abortController.signal,
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.status !== 200) {
            console.error("Failed to delete comment");
            return { success: false, abort: () => abortController.abort() };
        }
        return { success: true, abort: () => abortController.abort() };
    } catch (error) {
        if (error instanceof CanceledError) {
            console.log("Request canceled");
        } else {
            console.error("Error deleting comment:", error);
        }
        return { success: false, abort: () => abortController.abort() };
    }
}

export default { getPostComments, addComment, deleteComment };
