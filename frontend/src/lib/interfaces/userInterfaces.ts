import { Role } from "@/lib/interfaces/roleInterfaces";

export interface UserRegister {
    name: string;
    email: string;
    password: string;
    cpf: number|string
    idInstitution: number
    classesId?: number[]
}

export interface UserRegisterForm {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    acceptTerms: boolean;
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: Role;
    institutionName: string
    cpf: string
}

export interface UserData {
    id: number;
    nome: string;
    email: string;
    role: Role;
    institutionName: string;
    cpf: string
    status?: string
    classes?: Array<{
        Id: number;        // ✅ CORRIGIDO: Backend retorna "Id" com I maiúsculo
        id?: number;       // ✅ Mantém compatibilidade se vier minúsculo
        nome: string;
        startDate: string;
        finalDate: string; // ✅ CORRIGIDO: Backend retorna "finalDate"
        endDate?: string;  // ✅ Mantém compatibilidade
        imgClass: string;
        semester: number;
        code: string;
        courseId?: number;
        course: {
            id: number;
            name: string;
        };
    }>
}

export interface UserLoginData {
    email: string;
    password: string;
}


export interface UserFromToken {
    id: number,
    email: string,
    nome: string,
    role: Role
    institutionName: string
    cpf: string
}

export interface UserUpdate {
    name?: string;
    email?: string;
    password?: string;
    cpf?: string;
    roleId?: number;
    classesId?: number[];
}