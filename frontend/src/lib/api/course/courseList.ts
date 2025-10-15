"use server";
import {getTokenFromSession} from "@/lib/auth/jwtAuth";
import getApiBaseUrl from "@/lib/api/api";
import {Course} from "@/lib/interfaces/courseInterfaces";

export default async function CourseListService(){
    const token = await getTokenFromSession();
    const baseURL = getApiBaseUrl();

    const response = await fetch(`${baseURL}/course`, {
        method: "GET",
        cache: "reload",
        headers: {
            Accept: "application/json",
            Authorization: token,
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const message = errorData?.message || `Request failed: ${response.status}`;
        throw new Error(message);
    }

    const responseData = await response.json();

    const data: Course[] = responseData?.data;
    return data;
}