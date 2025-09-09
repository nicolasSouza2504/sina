'use server'

import { cookies } from "next/headers";
import { decodeJwt } from "@/lib/auth/jwtAuth";
import { UserFromToken } from "../interfaces/userInterfaces";

export default async function getUserFromToken() {

    const cookiesStore = await cookies();
    const token = cookiesStore.get('token')?.value;
    const decoded = decodeJwt(token);
    const user: UserFromToken | undefined = decoded?.user;
    return user;
}
