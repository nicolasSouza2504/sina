import {cookies} from "next/headers"
import {AuthPayload} from "./jwtAuth"

export default async function getTokenFromSession() {
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
