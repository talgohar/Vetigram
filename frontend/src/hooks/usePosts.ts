import { useEffect, useState } from "react";
import postService, { CanceledError, PostModel, SendPostDTO } from "../services/postService";

const usePosts = (userId?: string) => {
  const [posts, setPosts] = useState<PostModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    let userPostsAbort: () => void;
    let aiPostsAbort: () => void;
    const fetchPosts = async () => {
      try {
        const { request: userPostsRequest, abort: userPostsAbortFn } = userId ? postService.getUserPosts(userId) : postService.getAllPosts();
        userPostsAbort = userPostsAbortFn;

        const userPostsResponse = await userPostsRequest;
        const transformedUserPosts = userPostsResponse.data.map((post: PostModel) => ({
          _id: post._id,
          title: post.title,
          content: post.content,
          owner: post.owner,
          imageName: post.imageName,
        }));

        let transformedAiPosts: PostModel[] = [];
        if (!userId) {
          const { request: aiPostsRequest, abort: aiPostsAbortFn } = postService.getAiPosts();
          aiPostsAbort = aiPostsAbortFn;
          const aiPostsResponse = await aiPostsRequest;
          transformedAiPosts = aiPostsResponse.data.map((post: PostModel) => ({
            _id: post._id,
            title: post.title,
            content: post.content,
            owner: post.owner,
            imageName: post.imageName,
          }));
        }

        setPosts([...transformedUserPosts, ...transformedAiPosts]);
      } catch (error) {
        if (!(error instanceof CanceledError)) {
          if (error instanceof Error) {
            setError(error.message);
          } else {
            setError("An unknown error occurred");
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();

    return () => {
      userPostsAbort && userPostsAbort();
      aiPostsAbort && aiPostsAbort();
    };
  }, [userId]);

  const addPost = async (newPost: SendPostDTO, image: File | null) => {
    const { post } = await postService.addPost(newPost, image);
    console.log(post);
    if (!post) {
      throw new Error("Post creation failed");
    }
    setPosts([...posts, post]);
  };

  const deletePost = async (postId: string) => {
    await postService.deletePost(postId);
    setPosts(posts.filter((post) => post._id !== postId));
  };

  return { posts, loading, error, addPost, deletePost };
};

export default usePosts;
