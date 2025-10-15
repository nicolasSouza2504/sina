'use server'
import { cookies } from 'next/headers'
import {AuthLoginResponse, loginError} from "@/lib/interfaces/authInterfaces";
import {UserLoginData} from "@/lib/interfaces/userInterfaces";
import getApiBaseUrl from "@/lib/api/api";

export default async function login(userLoginData: UserLoginData): Promise<AuthLoginResponse> {

    try{
        const baseApiUrl = getApiBaseUrl()
        const response = await fetch(`${baseApiUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userLoginData),
        })
        if (!response.ok) {
            const errorResponse:string = await response.text();
            const errorData: loginError = JSON.parse(errorResponse);
            throw new Error(errorData.message);
        }
        const authLoginResponse: AuthLoginResponse = await response.json()

        const jar = await cookies()
        jar.set('token', JSON.stringify(authLoginResponse.data?.token), {
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 60 * 60 * 24,
        })
        jar.set('userId', JSON.stringify(authLoginResponse.data.id), {
            path: '/',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24,
        })

        return authLoginResponse
    }catch (error) {
        throw error;
    }
}
