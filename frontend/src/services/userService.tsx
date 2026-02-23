import {apiClient, CanceledError} from './api-client'

export { CanceledError }

export interface User {
    _id: string
    email: string
    username: string
    isDoctor: boolean
    refreshToken: string[]
    password: string
    imageName: string
}

export interface SendUserDTO {
    email: string
    username: string
    isDoctor: boolean
    password: string
}

const getUser = () => {
    const abortController = new AbortController()
    const request = apiClient.post<User>(`/users/user`
        ,{ signal: abortController.signal })
    return { request, abort: () => abortController.abort() }
}

const updateProfile = async (username: string) : Promise<User> => {
    const abortController = new AbortController()
    const response = await apiClient.post<User>("/users/update_user", {username:username}, {
        signal: abortController.signal,
        headers: {
            "Content-Type": "application/json",
        },
    })
    return response.data
}

const getUsername = async (userId: string) => {
    const abortController = new AbortController()
    const response = await apiClient.post<{username: string}>(`/users/username`, 
        { userId: userId },
        {signal: abortController.signal,
        headers: {
            "Content-Type": "application/json",
        },
    })
    return response.data.username
}


export default { getUser, getUsername, updateProfile }