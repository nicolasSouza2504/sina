export interface ClassCourse {
    id: number
    name: string
}

export interface ClassSection {
    id: number
    name: string
    semester: number | null
    courseId: number
}

export interface Class {
    id: number
    code: string | null
    nome: string
    startDate: string | null
    endDate: string | null
    semester: number | null
    courseId: number | null
    imgClass: string | null
    course: ClassCourse | null
    sections?: ClassSection[]
}

export interface CreateClass {
    code: string | null
    name: string
    nome: string
    startDate: string | null
    endDate: string | null
    semester: number | null | string
    courseId: number | null | string
    imgClass: string | null
    sections: number[]
}

export interface ClassFormData {
    code: string | null;
    name: string;
    nome: string;
    startDate: string | null;
    endDate: string | null;
    semester: number | null | string;
    courseId: number | null | string;
    imgClass: string | null;
    sections?: number[];
}