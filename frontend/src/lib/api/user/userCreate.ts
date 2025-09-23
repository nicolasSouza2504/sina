import { UserRegister } from "@/lib/interfaces/userInterfaces"
import getApiBaseUrl from "@/lib/api/api";

export default async function createUser(userData: UserRegister, role: string | null) {
    const base = getApiBaseUrl()
    if (role == null || role === "") {
        role = "user"
    }
    const res = await fetch(`${base}/users/${role}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json", },
        body: JSON.stringify(userData),
    })

    let payload: any = null
    const text = await res.text()
    try { payload = text ? JSON.parse(text) : null } catch { payload = { raw: text } }

    if (!res.ok) {
        throw new Error(payload?.message || "Erro ao criar usuário")
    }

    return payload
}