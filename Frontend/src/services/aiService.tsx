import { apiClient, CanceledError } from "./api-client";

export { CanceledError };

interface PostSuggestion {
  title: string;
  content: string;
}

const suggestPostContent = async (
  imageBase64: string,
  imageMediaType: string = "image/jpeg"
): Promise<PostSuggestion> => {
  const abortController = new AbortController();
  try {
    const response = await apiClient.post<PostSuggestion>(
      "/ai_data/suggest-post-content",
      {
        imageBase64,
        imageMediaType,
      },
      {
        signal: abortController.signal,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status !== 200) {
      throw new Error("Failed to get AI suggestions");
    }

    return response.data;
  } catch (error) {
    if (error instanceof CanceledError) {
      console.log("Request canceled");
      throw error;
    } else {
      console.error("Error getting AI suggestions:", error);
      throw error;
    }
  }
};

export default { suggestPostContent };
