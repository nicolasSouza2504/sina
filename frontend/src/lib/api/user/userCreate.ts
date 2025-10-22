"use server"
import { UserRegister } from "@/lib/interfaces/userInterfaces"
import getApiBaseUrl from "@/lib/api/api";
import getTokenFromSession from "@/lib/auth/jwtAuth.server";

export default async function createUser(userData: UserRegister, role: string, image: File | null) {
    const base = getApiBaseUrl();
    const token = await getTokenFromSession();

    const formData = new FormData();

    formData.append("user", JSON.stringify(userData));

    if (image) {
        formData.append("image", image);
    }

    const response = await fetch(`${base}/user/add/${role}`, {
        method: "POST",
        headers: {
            Authorization: token
        },
        body: formData,
    });

    if (!response.ok) {
        let msg = "Erro ao Inserir usuário";

        if (response.status === 404) {
            msg = "Endpoint não encontrado. Verifique a configuração da API ou o tipo de usuário.";
        } else {
            try {
                const err = await response.json();
                msg = err?.message ?? msg;
            } catch { }
        }
        
        if (typeof window !== "undefined") {
            const { toast } = await import("sonner");
            toast.error(msg);
        }
        throw new Error(msg);
    }
    return response.json();
}