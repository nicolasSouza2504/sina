export interface Class {
    id: number,
    name: string
    startDate: string | null
    finalDate: string | null
    imgClass: string | null | File
}


export interface CreateClass {
    name: string
    startDate: string | null
    finalDate: string | null
    imgClass: string | null | File
}