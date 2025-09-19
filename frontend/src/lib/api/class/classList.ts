"use server"
import getApiBaseUrl from '@/lib/api/api';
import {getTokenFromSession} from "@/lib/auth/jwtAuth";
import {Class} from '@/lib/interfaces/classInterfaces';

export default async function ClassList() {
    // const token = await getTokenFromSession();
    // const baseURL = getApiBaseUrl();
    //
    // console.log(baseURL)
    //
    // const response = await fetch(`${baseURL}/class/all`, {
    //     method: "GET",
    //     cache: "no-store",
    //     headers: {
    //         Accept: "application/json",
    //         Authorization: token,
    //     },
    // });
    //
    // if (!response.ok) {
    //     const errorData = await response.json().catch(() => null);
    //     const message = errorData?.message || `Request failed: ${response.status}`;
    //     throw new Error(message);
    // }
    //
    // const responseData = await response.json();
    //
    // const data: Class[] = responseData?.data;

    const data: Class[] = mockListOfClasses();
    return data;
}



const mockListOfClasses = () =>{
    return [
        {
            "id": 1,
            "code": "02A",
            "name": "Arquitetura de Software",
            "startDate": "2006-01-04T00:00:00Z",
            "endDate": "2006-01-07T00:00:00Z",
            "semester": "6",
            "courseId": 1,
            "imgClass": "TurmaIMG1.png"
        },
        {
            "id": 2,
            "code": "02B",
            "name": "Segurança da Informação",
            "startDate": "2006-01-04T00:00:00Z",
            "endDate": "2006-01-07T00:00:00Z",
            "semester": "6",
            "courseId": 1,
            "imgClass": "TurmaIMG2.png"
        },
        {
            "id": 3,
            "code": "02C",
            "name": "Integração Contínua e Entrega Contínua (CI/CD)",
            "startDate": "2006-01-04T00:00:00Z",
            "endDate": "2006-01-07T00:00:00Z",
            "semester": "6",
            "courseId": 1,
            "imgClass": "TurmaIMG3.png"
        },
        {
            "id": 4,
            "code": "02D",
            "name": "Desenvolvimento Web Avançado",
            "startDate": "2006-01-04T00:00:00Z",
            "endDate": "2006-01-07T00:00:00Z",
            "semester": "6",
            "courseId": 1,
            "imgClass": "TurmaIMG4.png"
        }
    ]
}