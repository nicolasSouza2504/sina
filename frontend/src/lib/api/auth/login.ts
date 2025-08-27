'use server'
import { cookies } from 'next/headers'
import {AuthLoginResponse} from "@/lib/interfaces/authInterfaces";
import {UserLoginData} from "@/lib/interfaces/userInterfaces";

export default async function login(userLoginData: UserLoginData): Promise<AuthLoginResponse> {
        const response = await fetch(`http://localhost:9501/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userLoginData),
        })

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message)
        }

        const data: AuthLoginResponse = await response.json()

        const jar = await cookies()
        jar.set('token', JSON.stringify(data.token), {
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 60 * 60 * 24,
        })
        jar.set('user', JSON.stringify(data.user), {
            path: '/',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24,
        })

        return data
}
