"use server";

import {getTokenFromSession} from "@/lib/auth/jwtAuth";
import getApiBaseUrl from "@/lib/api/api";

export default async  function ClassRemoveService(classId: number) {
    const token = await getTokenFromSession();
    const baseURL = getApiBaseUrl();
    try {
        if (!token) {
            throw new Error("No auth token found in session. Please login and try again.");
        }

        const response = await fetch(`${baseURL}/class/delete/${classId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
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
        throw err;
    }
}