// Funções síncronas para uso no middleware (sem "use server")
import {AuthPayload} from "./jwtAuth"

function b64urlToString(input: string) {
    const b64 = input.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(input.length / 4) * 4, "=")
    return decodeURIComponent(
        Array.prototype.map
            .call(atob(b64), (c: string) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
            .join("")
    )
}

export function decodeJwtServer(token: string | undefined | null): AuthPayload | null {
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

export function hasAnyRoleServer(payload: AuthPayload | null, required: string | string[]): boolean {
    if (!payload?.role) return false
    
    const userRoles = Array.isArray(payload.role) ? payload.role : [payload.role]
    const req = Array.isArray(required) ? required : [required]
    
    return req.some(r => userRoles.includes(r))
}

export type { AuthPayload } from "./jwtAuth"
