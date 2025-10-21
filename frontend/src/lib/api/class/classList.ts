"use server"
import getApiBaseUrl from '@/lib/api/api';
import {getTokenFromSession} from "@/lib/auth/jwtAuth.server";
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

    const data: Class[] = responseData?.data;
    return data;
}