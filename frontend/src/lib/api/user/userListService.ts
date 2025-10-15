import getApiBaseUrl from "@/lib/api/api";
import {UserData} from "@/lib/interfaces/userInterfaces";
import {DataResponse} from "@/lib/interfaces/apiInterface";

export async function UserListService(
    nameFilter: string | null = null,
    roleFilter: number | null = null,
    courseIdFilter: number | null = null,
    classIdFilter: number | null = null
) {
    const base = getApiBaseUrl();

    const params = new URLSearchParams();

    if (nameFilter !== null && nameFilter !== "") {
        params.append("name", nameFilter);
    }

    if (roleFilter !== null) {
        params.append("role", roleFilter.toString());
    }

    if (courseIdFilter !== null) {
        params.append("courseId", courseIdFilter.toString());
    }

    if (classIdFilter !== null) {
        params.append("classId", classIdFilter.toString());
    }

    const queryString = params.toString();
    const url = queryString ? `${base}/user/list-all?${queryString}` : `${base}/user/list-all`;


    const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });


    if (!response.ok) {
        let msg = "Erro ao buscar usuários";
        try {
            const err = await response.json();
            msg = err?.message ?? msg;
        } catch {
        }
        if (typeof window !== "undefined") {
            const { toast } = await import("sonner");
            toast(msg);
        }
        throw new Error(msg);
    }

    const data:DataResponse<UserData[]> = await response.json();

    return data;
}