"use server";
import getTokenFromSession from "@/lib/auth/jwtAuth.server";
import getApiBaseUrl from "@/lib/api/api";
import {Course} from "@/lib/interfaces/courseInterfaces";

export default async function CourseListService(){
    const token = await getTokenFromSession();
    const baseURL = getApiBaseUrl();

    const response = await fetch(`${baseURL}/course`, {
        method: "GET",
        cache: "reload",
        headers: {
            Accept: "application/json",
            Authorization: token,
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        
        if (response.status === 404) {
            // Retorna array vazio para lista vazia - a UI já trata isso
            return [];
        }
        
        const message = errorData?.message || `Request failed: ${response.status}`;
        throw new Error(message);
    }

    const responseData = await response.json();
    const rawData = responseData?.data;

    // Map the API response to match our interface structure
    const mappedCourses: Course[] = rawData?.map((course: any) => ({
        id: course.id,
        name: course.name,
        quantitySemester: course.quantitySemester,
        classes: course.classes?.map((cls: any) => ({
            id: cls.Id || cls.id, // Map Id to id
            code: cls.code || null,
            nome: cls.nome || cls.name,
            startDate: cls.startDate || null,
            endDate: cls.finalDate || cls.endDate || null,
            semester: cls.semester || null,
            courseId: cls.course?.id || cls.courseId || null,
            imgClass: cls.imgClass || null,
            course: cls.course ? {
                id: cls.course.id,
                name: cls.course.name
            } : null
        })) || [],
        sections: course.sections?.map((section: any) => ({
            id: section.id,
            name: section.name,
            semester: section.semester || null,
            courseId: section.courseId
        })) || []
    })) || [];

    return mappedCourses;
}