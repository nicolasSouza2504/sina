'use server'

import {cookies} from "next/headers";
import {decodeJwt} from "@/lib/auth/jwtAuth";

export default async function getUserFromToken() {

    const cookiesStore = await cookies();
    const token = cookiesStore.get('token')?.value;
    const decoded = decodeJwt(token);
    return decoded?.user;
}
