import { nestApi } from "@/config/axios.config";
import { Login, Register } from "@/models/auth/auth.model";

export const register = async (data: Register) => { 
    try {
        const response = await nestApi.post('/auth/register', data);
        console.log(response.data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const login = async (data: Login) => {
    try {
        const response = await nestApi.post('/auth/login', data);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log(error);
        

    }
}
