"use server";

import { cookies } from "next/headers";

export default async function signOut() {
    try {
        const cookiesBody = await cookies();
        cookiesBody.delete("token");
        cookiesBody.delete("userId");
        return true;

    } catch (error) {
        console.error("Error signing out:", error);
    }
}