import { useEffect, useState } from "react";
import commentService, { CanceledError, Comment } from "../services/commentService";

const useComments = (postId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const requestPromise = commentService.getPostComments(postId);
    let abort: () => void;

    requestPromise
      .then(({ comments, abort: abortFn }) => {
        setComments(comments);
        abort = abortFn;
      })
      .catch((error) => {
        if (!(error instanceof CanceledError)) { // Ignore cancel error
          console.error("Comment request failed", error);
          setError(error.message);
        }
      });
  
    return () => abort && abort(); // Abort request on unmount
  }, [postId]);

  return { comments, error, setComments };
};

export default useComments;
