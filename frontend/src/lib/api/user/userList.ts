import getApiBaseUrl from "@/lib/api/api";

export async function listUsers() {
    const base = getApiBaseUrl();
    const response = await fetch(`${base}/users`, {
        method: "GET",
        headers: {"Content-Type": "application/json"},
    });

    if (!response.ok) {
        let msg = "Erro ao buscar usuários";
        try {
            const err = await response.json();
            msg = err?.message ?? msg;
        } catch {
        }
        // toast no CLIENTE somente
        if (typeof window !== "undefined") {
            const {toast} = await import("sonner");
            toast(msg);
        }
        throw new Error(msg);
    }

    return response.json();
}