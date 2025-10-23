'use server'

import {cookies} from "next/headers";
import {decodeJwt} from "@/lib/auth/jwtAuth";

export default async function getUserFromToken() {

    const cookiesStore = await cookies();
    const token = cookiesStore.get('token')?.value;
    console.log("Token from cookies:", token);
    const decoded = decodeJwt(token);
    console.log("Decoded JWT payload:", decoded);
    console.log("User from payload:", decoded?.user);
    return decoded?.user;
}
