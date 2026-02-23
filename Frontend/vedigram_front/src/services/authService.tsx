import {apiClient, CanceledError } from "./api-client";
import { AxiosError } from "axios";
import { SendUserDTO } from "./userService";
import { CredentialResponse } from "@react-oauth/google";

export { CanceledError }

const isTokenValid = async () => {
    const abortController = new AbortController();
    try{
        const response =  await apiClient.get<boolean>("/auth/verify-token", {
            signal: abortController.signal,
          });
          return response.status === 200 && response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response && error.response.status === 401) {
          console.log("Token is invalid or expired");
        } else {
          console.error("Error verifying token:", error);
        }
        return false;

    }
}

const login = async (identifier: string, password: string) => {
    const abortController = new AbortController();
    try {
        const response = await apiClient.post<{ 
            accessToken: string;  
            refreshToken: string;
            _id: string; }>("/auth/login", {
            identifier,
            password,
        }, {
            signal: abortController.signal,
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.status === 200) {
            localStorage.setItem("accessToken", response.data.accessToken);
            localStorage.setItem("refreshToken", response.data.refreshToken);
            return true;
        } else {
            console.error("Failed to login");
            return false;
        }
    }
    catch (error) {
        if (error instanceof CanceledError) {
            console.log("Request canceled");
        } else {
            console.error("Error logging in:", error);
        }
        return false;
    }
}

const register = async (user: SendUserDTO,  img: File | null) => {
    const abortController = new AbortController();
    try{
        const response = await apiClient.post("/auth/register", {
            ...user,
        }, {
            signal: abortController.signal,
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.status === 200) {
            await login(user.username || user.email, user.password);
            if (img) {
                await addProfileImage(img);
            }
        } else {
            console.error("Failed to register");
        }
        
        return { abort: () => abortController.abort() };

    } catch (error) {
        if (error instanceof CanceledError) {
            console.log("Request canceled");
        } else {
            console.error("Error register:", error);
        }
    }
}

const logout = async (refreshToken: string) => {
    const abortController = new AbortController();
    try {
        const response = await apiClient.post("/auth/logout", {
            refreshToken: refreshToken,
        }, {
            signal: abortController.signal,
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.status === 200) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
        } else {
            console.error("Failed to logout");
        }
    } catch (error) {
        if (error instanceof CanceledError) {
            console.log("Request canceled");
        } else {
            console.error("Error logging out:", error);
        }
    }

}

const addProfileImage = async (image: File) => {
    const abortController = new AbortController();
    const formData = new FormData();
    formData.append("file", image as Blob);
    const request = await apiClient.post<{url:string}>("/files/profile", formData, {
      signal: abortController.signal,
    });
    return { request, abort: () => abortController.abort };
}

const googleSignIn = async (response: CredentialResponse) => {
  const abortController = new AbortController();
  try {
    const res = await apiClient.post<{
      accessToken: string;
      refreshToken?: string;
      _id?: string;
    }>(
      "/auth/google-login",
      { credential: response.credential },
      { signal: abortController.signal, headers: { "Content-Type": "application/json" } }
    );

    if (res.status === 200) {
      localStorage.setItem("accessToken", res.data.accessToken);
      if (res.data.refreshToken) {
        localStorage.setItem("refreshToken", res.data.refreshToken);
      }
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error logging in:", error);
    return false;
  }
};

    

export {isTokenValid, login, register, logout, addProfileImage, googleSignIn};