'use server'

import {cookies} from "next/headers";
import {decodeJwtServer} from "@/lib/auth/jwtAuth.middleware";

export default async function getUserFromToken() {

    const cookiesStore = await cookies();
    const token = cookiesStore.get('token')?.value;
    console.log("Token from cookies:", token);
    const decoded = decodeJwtServer(token);
    console.log("Decoded JWT payload:", decoded);
    console.log("User from payload:", decoded?.user);
    return decoded?.user;
}
