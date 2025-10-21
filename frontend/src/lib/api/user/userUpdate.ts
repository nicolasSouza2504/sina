"use server";
import getApiBaseUrl from "@/lib/api/api";
import { UserUpdate } from "@/lib/interfaces/userInterfaces";
import { getTokenFromSession } from "@/lib/auth/jwtAuth";

export default async function UpdateUserService(
    userData: UserUpdate,
    id: number,
    image: File | null
) {
    const base = getApiBaseUrl();
    const token = await getTokenFromSession();

    const formData = new FormData();

    formData.append("user", JSON.stringify(userData));

    if (image) formData.append("image", image);
    const response = await fetch(`${base}/user/update/${id}`, {
        method: "PUT",
        headers: {
            Authorization: token,
            Accept: "application/json",
        },
        body: formData,
    });

    if (!response.ok) {
        let msg = "Erro ao Atualizar usuário";
        
        if (response.status === 404) {
            msg = "Usuário não encontrado. Verifique se ele ainda existe.";
        } else {
            try {
                const err = await response.json();
                msg = err?.message ?? msg;
            } catch {}
        }
        
        if (typeof window !== "undefined") {
            const { toast } = await import("sonner");
            toast.error(msg);
        }
        throw new Error(msg);
    }

    return response.json();
}
