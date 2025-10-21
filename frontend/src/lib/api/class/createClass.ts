"use server"
import getApiBaseUrl from '@/lib/api/api';
import {getTokenFromSession} from "@/lib/auth/jwtAuth";
import type {CreateClass} from "@/lib/interfaces/classInterfaces";

export default async function CreateClassService(classForm: CreateClass) {
    const token = await getTokenFromSession();
    const baseURL = getApiBaseUrl();
    try {
        if (!token) {
            throw new Error("No auth token found in session. Please login and try again.");
        }

        const response = await fetch(`${baseURL}/class/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: token,
            },
            body: JSON.stringify(classForm),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            
            if (response.status === 404) {
                const msg = "Endpoint não encontrado. Verifique a configuração da API.";
                if (typeof window !== "undefined") {
                    const { toast } = await import("sonner");
                    toast.error(msg);
                }
                throw new Error(msg);
            }
            
            console.error("API Error:", {
                status: response.status,
                statusText: response.statusText,
                body: errorData,
            });
            throw new Error(
                `Request failed with status ${response.status}: ${JSON.stringify(errorData)}`
            );
        }

        return await response.json();
    } catch (err) {
        console.error("Network or unexpected error:", err);
        throw err; // rethrow so the caller can handle it
    }
}