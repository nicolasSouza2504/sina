export interface Class {
    id: number
    code: string | null
    name: string
    startDate: string | null
    endDate: string | null
    semester: number | null
    courseId: number |null
    imgClass: string | null
}

export interface CreateClass {
    code: string | null
    name: string
    startDate: string | null
    endDate: string | null
    semester: number | null | string
    courseId: number |null | string
    imgClass: string | null
}

export interface ClassFormData {
    code: string | null ;
    name: string;
    startDate: string | null;
    endDate: string | null;
    semester: number | null | string;
    courseId: number | null | string;
    imgClass: string | null;
}