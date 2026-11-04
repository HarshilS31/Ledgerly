import { api } from "./axios";

interface RegisterCredentials {
    username:String,
    email:String,
    password:String,
}
 interface LoginCredentials {
    email: string;
    password: string;
}
export const registerUser = async(credentials:RegisterCredentials) => {
    const resp = await api.post('/auth/register',credentials);
    return resp.data;
}
export const loginUser = async(credentials:LoginCredentials) => {
    const resp = await api.post('/auth/login',credentials);
    return resp.data;
}
export const logoutUser = async() => {
    const resp = await api.post('/auth/logout')
    return resp.data
}