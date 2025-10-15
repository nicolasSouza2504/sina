'use server';
import getApiBaseUrl from "@/lib/api/api";

export default async function UserUpdateStatusService(status:string, userId:number) {
    const base = getApiBaseUrl();

    const url = `${base}/user/update-status`;

}