import {cookies} from "next/headers"
import {UserFromToken} from "../interfaces/userInterfaces"

export type AuthPayload = {
    sub: string
    id?: string
    role?: string[]
    user: UserFromToken
    exp?: number
    iat?: number
    [k: string]: unknown
}

function b64urlToString(input: string) {
    const b64 = input.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(input.length / 4) * 4, "=")
    return decodeURIComponent(
        Array.prototype.map
            .call(atob(b64), (c: string) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
            .join("")
    )
}

export function decodeJwt(token: string | undefined | null): AuthPayload | null {
    if (!token) return null
    const parts = token.split(".")
    if (parts.length < 2) return null
    try {
        const json = b64urlToString(parts[1])
        const payload = JSON.parse(json) as AuthPayload
        if (payload.exp && Date.now() >= payload.exp * 1000) return null
        return payload
    } catch {
        return null
    }
}

export function hasAnyRole(payload: AuthPayload | null, required: string | string[]): boolean {
    if (!payload?.role?.length) return false
    const req = Array.isArray(required) ? required : [required]
    return req.some(r => payload.role!.includes(r))
}


export async function getTokenFromSession() {
    const cookiesStore = await cookies();
    let token = normalizeToken(cookiesStore.get('token')?.value);
    return token?.startsWith("Bearer ") ? token : `Bearer ${token}`;
}

function normalizeToken(raw?: string | null): string | null {
    if (!raw) return null;
    let t = raw.trim();

    // remove aspas acidentais no cookie (ex: token salvo como string JSON)
    if (t.startsWith('"') && t.endsWith('"')) {
        t = t.slice(1, -1);
    }

    // remove prefixo Bearer duplicado se houver
    if (t.toLowerCase().startsWith('bearer ')) {
        t = t.slice(7).trim();
    }

    return t;
}

