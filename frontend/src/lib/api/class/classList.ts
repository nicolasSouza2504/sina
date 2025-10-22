"use server"
import getApiBaseUrl from '@/lib/api/api';
import getTokenFromSession from "@/lib/auth/jwtAuth.server";
import {Class} from '@/lib/interfaces/classInterfaces';

export default async function ClassList() {
    const token = await getTokenFromSession();
    const baseURL = getApiBaseUrl();

    const response = await fetch(`${baseURL}/class/all`, {
        method: "GET",
        cache: "reload",
        headers: {
            Accept: "application/json",
            Authorization: token,
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        
        if (response.status === 404) {
            return [];
        }
        
        const message = errorData?.message || `Request failed: ${response.status}`;
        throw new Error(message);
    }

    const responseData = await response.json();

    const classData = responseData?.data;
    
    // Mapeia os dados da API para a interface Class
    const mappedClasses = classData?.map((cls: any) => ({
        id: cls.Id || cls.id,
        code: cls.code || null,
        nome: cls.nome || cls.name,
        startDate: cls.startDate,
        endDate: cls.finalDate || cls.endDate,
        semester: cls.semester || null,
        courseId: cls.courseId || null,
        imgClass: cls.imgClass
    })) || [];
    
    return mappedClasses;
}