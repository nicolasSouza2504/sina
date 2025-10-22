import {Class} from "@/lib/interfaces/classInterfaces";
import {Section} from "@/lib/interfaces/sectionInterfaces";


export interface Course {
    name: string;
    quantitySemester: number;
    id: number;
    classes: Class[];
    sections: Section[];
}

export interface CreateCourse {
    name: string;
    quantitySemester: number;
    classesId: number[];
}