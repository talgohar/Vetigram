import { apiClient, CanceledError } from "./api-client";
import userService from "./userService";

export { CanceledError };

export interface CommentDTO {
  comment: string;
  owner: string;
  isOwnerVet: boolean;
  postId: string;
}

export interface Comment {
  postId: string;
  comment: string;
  username: string;
  isOwnerVet: boolean;
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
        postId: commentDTO.postId,
        comment: commentDTO.comment,
        username: username,
        isOwnerVet: commentDTO.isOwnerVet,
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
        }
    } catch (error) {
        if (error instanceof CanceledError) {
        console.log("Request canceled");
        } else {
        console.error("Error creating comment:", error);
        }
    }
    return { abort: () => abortController.abort() };
    }

export default { getPostComments, addComment };
