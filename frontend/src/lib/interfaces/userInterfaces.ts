import {Role} from "@/lib/interfaces/roleInterfaces";

export interface UserRegister {
    name: string;
    email: string;
    password: string;
}

export interface UserRegisterForm {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    acceptTerms: boolean;
}

export interface User{
    id: Number;
    name: string;
    email: string;
    role: Role;
}

export interface UserLoginData {
    email: string;
    password: string;
}