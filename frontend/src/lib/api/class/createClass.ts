"use server"
import getApiBaseUrl from '@/lib/api/api';
import { getTokenFromSession } from "@/lib/auth/jwtAuth";
import type { CreateClass } from "@/lib/interfaces/classInterfaces";


export default async function CreateClassService(classForm: CreateClass) {
    const token = await getTokenFromSession();
    const baseURL = getApiBaseUrl();

    const response = await fetch(`${baseURL}/class/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json", "Authorization": `${token}`, },
        body: JSON.stringify(classForm),
    });

    if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
    }

    return await response.json()

}