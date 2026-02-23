import { useCallback, useEffect, useState } from "react";
import postService from "../services/postService";
import debounce from "lodash.debounce";

const useLike = (postId: string, userId: string) => {
    const [liked, setLiked] = useState<boolean>(false);
    const [likesCount, setLikesConut ] = useState<number>(0);
    const [isUpdating, setIsUpdating] = useState(false);    

    useEffect(() => {
        const fetchLikeStatus = async () => {
            try {
                const response = await postService.getLikeStatus(postId);
                if (response) {
                    setLiked(response.liked);
                    setLikesConut(response.likesCount);
                }
            }catch (error) {
                console.error("Error fetching like status:", error);
              }
            };
            fetchLikeStatus();
          }, [postId, userId]);
    
    const sendLikeRequest = async (newLiked: boolean) => {
        if (isUpdating) return; 
        setIsUpdating(true);
        try{
            const response = await postService.sendLikeRequest(postId, newLiked);
            if (response) {
                setLiked(response.liked);
                setLikesConut(response.likesCount);
            }
        } catch (error) {
            console.error("Error sending like request:", error);
            setLiked(!liked);
            setLikesConut(liked ? likesCount - 1 : likesCount + 1);
        }
        finally {
            setIsUpdating(false);
          }
    };

    const debouncedLike = useCallback(debounce(sendLikeRequest, 500), [liked]);

    const toggleLike = () => {
        if (isUpdating) return; 
        debouncedLike(!liked);
    }

    return { liked, likesCount, toggleLike };
}

export default useLike;

