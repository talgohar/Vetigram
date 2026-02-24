import { apiClient, CanceledError } from "./api-client";
import { User } from "./userService";

export { CanceledError };

export interface SendPostDTO {
  title: string;
  content: string;
}

export interface PostModel {
  _id: string;
  title: string;
  content: string;
  owner: User;
  imageName: string;
}

const getAllPosts = () => {
  const abortController = new AbortController();
  const request = apiClient.get<PostModel[]>("/posts", {
    signal: abortController.signal,
  });
  return { request, abort: () => abortController.abort() };
};

const getUserPosts = (ownerId: string) => {
  console.log(ownerId);
  const abortController = new AbortController();
  const request = apiClient.get<PostModel[]>(`/posts?owner=${ownerId}`,{
    signal: abortController.signal,
  });
  return { request, abort: () => abortController.abort() };
};

const addPost = async (newPost: SendPostDTO, image: File | null) => {
  const abortController = new AbortController();
  let post;
  try {
    const response = await apiClient.post<PostModel>("/posts", newPost, {
      signal: abortController.signal,
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 201) {
      post = response.data as PostModel;
      const { imageName } = await addPostImage(image, response.data._id);
      if (imageName) {
        post.imageName = imageName;
      }
    } else {
      console.error("Failed to create post");
    }
  } catch (error) {
    if (error instanceof CanceledError) {
      console.log("Request canceled");
    } else {
      console.error("Error creating post:", error);
    }
  }

  return { post, abort: () => abortController.abort() };
};

const getLikeStatus = async (postId: string) => {
  const abortController = new AbortController();
  try {
    const response = await apiClient.post<{
      liked: boolean;
      likesCount: number;
    }>(
      `/posts/likes/status`,
      { postId },
      {
        signal: abortController.signal,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return { liked: response.data.liked, likesCount: response.data.likesCount };
  } catch (error) {
    if (error instanceof CanceledError) {
      console.log("Request canceled");
    } else {
      console.error("Error fetching like status:", error);
    }
    return false;
  }
};

const sendLikeRequest = async (
  postId: string,
  newLikeStatus: boolean
) => {
  const abortController = new AbortController();
  try {
    const response = await apiClient.post<{
      liked: boolean;
      likesCount: number;
    }>(
      `/posts/likes/likeUpdate`,
      { postId, newLikeStatus },
      {
        signal: abortController.signal,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return { liked: response.data.liked, likesCount: response.data.likesCount };
  } catch (error) {
    if (error instanceof CanceledError) {
      console.log("Request canceled");
    } else {
      console.error("Error sending like request:", error);
    }
  }
};

const addPostImage = async (image: File | null, postId: string) => {
  const abortController = new AbortController();
  const formData = new FormData();
  formData.append("file", image as Blob);
  formData.append("postId", postId);

  try {
    const response = await apiClient.post<{ url: string }>(
      "/files/posts",
      formData,
      {
        signal: abortController.signal,
      }
    );

    if (response.status === 200) {
      const imageUrl = response.data.url;
      const imageName = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
      return { imageName, abort: () => abortController.abort() };
    } else {
      console.error("Failed to upload image");
      return { imageName: null, abort: () => abortController.abort() };
    }
  } catch (error) {
    if (error instanceof CanceledError) {
      console.log("Request canceled");
    } else {
      console.error("Error uploading image:", error);
    }
    return { imageName: null, abort: () => abortController.abort() };
  }
};

const deletePost = async (postId: string) => {
  const abortController = new AbortController();
  const response = await apiClient.delete<PostModel[]>(`/posts/${postId}`, {
    signal: abortController.signal,
  });
  return { posts: response.data, abort: () => abortController.abort() };
}

const editPost = async (postId: string, title: string, content: string, newImage: File | null) => {
  const abortController = new AbortController();
  try {
    // First, update the post title and content
    const response = await apiClient.put<PostModel>(
      `/posts/${postId}`,
      { title, content },
      {
        signal: abortController.signal,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    let updatedPost = response.data;

    // If a new image is provided, upload it
    if (newImage) {
      const imageResponse = await apiClient.post<{ url: string }>(
        "/files/posts",
        (() => {
          const formData = new FormData();
          formData.append("file", newImage as Blob);
          formData.append("postId", postId);
          return formData;
        })(),
        {
          signal: abortController.signal,
        }
      );

      if (imageResponse.status === 200) {
        const imageUrl = imageResponse.data.url;
        const imageName = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
        updatedPost.imageName = imageName;
      }
    }

    return { post: updatedPost, abort: () => abortController.abort() };
  } catch (error) {
    if (error instanceof CanceledError) {
      console.log("Request canceled");
    } else {
      console.error("Error editing post:", error);
    }
    return { post: null, abort: () => abortController.abort() };
  }
};

export default { getAllPosts, addPost, getLikeStatus, deletePost, editPost, sendLikeRequest, getUserPosts};
