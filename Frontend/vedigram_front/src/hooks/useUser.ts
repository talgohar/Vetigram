import { useEffect, useState } from "react";
import userService, { CanceledError, User } from "../services/userService";

const useUserInfo = (userId: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    setLoading(true);

    const { request: userRequest, abort: abortName } = userService.getUser();
    userRequest.then((response) => {
      setUser(response.data);
     })
    .catch((error) => {
      if (error instanceof CanceledError) {
        console.log("Request canceled");
      } else {
        console.error("Error getting user:", error);
        setError("Error getting user");
      }
    }).finally(() => {
      setLoading(false);
    });

    return () => abortName();
  }, [userId]);

  return { user, loading, error};
};

export default useUserInfo;
