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
export const getCurrentUser = async () => {
    const resp = await api.get('/me');
    return resp.data;
}
export const change_Password = async (currentPassword:string,newPassword:string) : Promise<void> => {
    await api.put("/auth/change-password", { currentPassword, newPassword })
}
export const forgotPassword = async (email: string): Promise<void> => {
    await api.post("/auth/forgot-password", { email });
};
export const resetPasswordRequest = async (token:string,newPassword:string) : Promise<void> => {
    await api.post("/auth/reset-password",{token,newPassword});
}