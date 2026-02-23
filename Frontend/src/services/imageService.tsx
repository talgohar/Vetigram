import {imagesClient, baseImagesUrl} from "./api-client"

const getPostImage = async (post_name: string, owner: string): Promise<string> => {
  const abortController = new AbortController();
  const url = `/posts/${owner}/${post_name}`;
  try {
    const response = await imagesClient.get(url, { signal: abortController.signal });
    if (response.status === 200 && response.config.url) {
        return baseImagesUrl + response.config.url;
    } else {
      return "./images/default_post.png";
    }
  } catch (error) {
    console.error("Error loading post image:", error);
    return "./images/default_post.png";
  }
};

const getProfileImage = async (profileImageName: string | undefined) => {
  if (!profileImageName || profileImageName.trim().length === 0) {
    return "./images/default_avatar.png";
  }

  const abortController = new AbortController();
  const url = `/profile/${profileImageName}`;

  try {
    const response = await imagesClient.get(url, { signal: abortController.signal });
    if (response.status === 200 && response.config.url) {
      return baseImagesUrl + response.config.url;
    }
    return "./images/default_avatar.png";
  } catch (error) {
    console.error("Error loading profile image:", error);
    return "./images/default_avatar.png";
  }
};

export default { getPostImage, getProfileImage }