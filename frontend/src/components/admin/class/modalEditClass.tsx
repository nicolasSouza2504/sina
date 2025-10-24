"use client";
import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {Input} from "@/components/ui/input";
import {Class, ClassFormData} from "@/lib/interfaces/classInterfaces";
import {zodResolver} from "@hookform/resolvers/zod";
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import EditClassService from "@/lib/api/class/classEdit";
import CourseListService from "@/lib/api/course/courseList";

interface ModalEditClassProps {
    isOpen: boolean;
    onClose: () => void;
    classData: Class | null;
    onClassUpdated?: () => void;
    imageNames: string[];
}

const editClassSchema = z
    .object({
        code: z
            .string()
            .min(1, "Code é obrigatório")
            .max(70, "Code deve conter somente 70 caracteres"),
        name: z
            .string()
            .min(1, "Nome é obrigatório")
            .max(80, "Nome deve conter no máximo 80 caracteres"),
        startDate: z
            .string()
            .min(1, "Data de início é obrigatória")
            .refine((date) => !isNaN(Date.parse(date)), "Data inválida"),
        endDate: z
            .string()
            .min(1, "Data de término é obrigatória")
            .refine((date) => !isNaN(Date.parse(date)), "Data inválida"),
        semester: z.number().min(1, "Semestre deve ser preenchido"),
        courseId: z.number().min(1, "Curso deve ser selecionado"),
        imgClass: z.string().nullable().optional(),
    })
    .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
        message: "Data de término deve ser posterior à data de início",
        path: ["endDate"],
    });

export type EditClassSchemaValues = z.infer<typeof editClassSchema>;

export default function ModalEditClass({
                                           isOpen,
                                           onClose,
                                           classData,
                                           onClassUpdated,
                                           imageNames,
                                       }: ModalEditClassProps) {
    const [editionError, setEditionError] = useState<string | null>(null);
    const [courses, setCourses] = useState<{ id: number, name: string }[]>([]);
    const [loadingCourses, setLoadingCourses] = useState(false);
    const [generatingCode, setGeneratingCode] = useState(false);

    const form = useForm<EditClassSchemaValues>({
        resolver: zodResolver(editClassSchema),
        defaultValues: {
            code: "",
            name: "",
            startDate: "",
            endDate: "",
            semester: 1,
            courseId: 1,
            imgClass: null,
        },
        mode: "onSubmit",
    });

    useEffect(() => {
        if (isOpen && classData) {
            form.reset({
                code: classData.code || "",
                name: classData.nome,
                startDate: classData.startDate || "",
                endDate: classData.endDate || "",
                semester: classData.semester || 1,
                courseId: classData.course?.id || classData.courseId || 1,
                imgClass: classData.imgClass || null,
            });
        }
    }, [isOpen, classData, form]);

    useEffect(() => {
        getCourses();
    }, []);

    useEffect(() => {
        if (!isOpen) {
            resetForm();
            setEditionError(null);
        }
    }, [isOpen]);

    const getCourses = async () => {
        try {
            setLoadingCourses(true);
            const response = await CourseListService();
            setCourses( response || []);
        } catch (error) {
            console.error("Error fetching courses:", error);
            let errorMessage = "Erro ao carregar cursos";

            if (error instanceof Error) {
                errorMessage = error.message;
            } else if (typeof error === "string") {
                errorMessage = error;
            }
            setEditionError(errorMessage);
        } finally {
            setLoadingCourses(false);
        }
    }

    const onSubmit = async (data: EditClassSchemaValues) => {
        if (!classData) return;


        const formData: ClassFormData = {
            code: data.code || "",
            name: data.name,
            startDate: data.startDate,
            endDate: data.endDate,
            semester: data.semester || null,
            courseId: data.courseId || null,
            imgClass: data.imgClass === "none" ? null : data.imgClass || null,
        };

        try {
            setEditionError(null);
            await EditClassService(formData, classData.id);
            if (onClassUpdated) {
                onClassUpdated();
            }
            onClose();
        } catch (error) {
            console.error("Error Editing class:", error);
            let errorMessage = "Erro durante a Edição de Turma";

            if (error instanceof Error) {
                errorMessage = error.message;
            } else if (typeof error === "string") {
                errorMessage = error;
            }

            form.reset({
                code: classData.code || "",
                name: classData.nome,
                startDate: classData.startDate || "",
                endDate: classData.endDate || "",
                semester: classData.semester || 1,
                courseId: classData.course?.id || classData.courseId || 1,
                imgClass: classData.imgClass || null,
            });

            setEditionError(errorMessage);
        }
    };

    const resetForm = () => {
        form.reset({
            code: "",
            name: "",
            startDate: "",
            endDate: "",
            semester: 1,
            courseId: 1,
            imgClass: null,
        });
    };

    const handleCancel = () => {
        resetForm();
        setEditionError(null);
        onClose();
    };

    const createNewClassCode = () => {
        // Generate random string: 3 uppercase letters + 4 numbers
        const letters = Array.from({ length: 3 }, () =>
            String.fromCharCode(65 + Math.floor(Math.random() * 26))
        ).join('');

        const numbers = Array.from({ length: 4 }, () =>
            Math.floor(Math.random() * 10)
        ).join('');

        const randomCode = `${letters}${numbers}`;

        // Set the generated code in the form
        form.setValue("code", randomCode, { shouldValidate: true });
    }


    const watchedImage = form.watch("imgClass");

    if (!classData) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-[95vw] max-w-[500px] sm:max-w-[600px] lg:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Editar Turma</DialogTitle>
                    <DialogDescription>
                        Atualize os dados da turma selecionada.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid gap-3 py-2">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {/* Code Field */}
                                <FormField
                                    control={form.control}
                                    name="code"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Código da Turma</FormLabel>
                                            <div className="flex gap-2">
                                                <FormControl>
                                                    <Input
                                                        placeholder="Ex: TUR001"
                                                        {...field}
                                                        className="text-sm"
                                                    />
                                                </FormControl>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={createNewClassCode}
                                                    disabled={generatingCode}
                                                    size="sm"
                                                    className="flex-shrink-0"
                                                >
                                                    {generatingCode ? "Gerando..." : "Gerar"}
                                                </Button>
                                            </div>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                               <FormField
                                    control={form.control}
                                    name="semester"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Qtd Semestres</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="Ex: 1"
                                                    {...field}
                                                    value={field.value || ""}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        field.onChange(value ? parseInt(value) : 1);
                                                    }}
                                                    className="text-sm"
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>




                            {/* Date Fields */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <FormField
                                    control={form.control}
                                    name="startDate"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Data de Início</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} className="text-sm" />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="endDate"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Data de Término</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} className="text-sm" />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                            </div>

                            {/* Semester and Course Fields */}
                            <div className="grid grid-cols-1 gap-3">
                                {/* Name Field */}
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Nome da Turma</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Ex: Desenvolvimento Web Full-Stack 2024.1"
                                                    {...field}
                                                    className="text-sm"
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="courseId"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Curso</FormLabel>
                                            <FormControl>
                                                <Select
                                                    onValueChange={(value) => {
                                                        field.onChange(parseInt(value));
                                                    }}
                                                    value={field.value?.toString() || ""}
                                                    disabled={loadingCourses}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={
                                                            loadingCourses
                                                                ? "Carregando cursos..."
                                                                : "Selecione um curso"
                                                        } />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {courses.map((course) => (
                                                            <SelectItem
                                                                key={course.id}
                                                                value={course.id.toString()}
                                                            >
                                                                {course.name}
                                                            </SelectItem>
                                                        ))}
                                                        {courses.length === 0 && !loadingCourses && (
                                                            <SelectItem value="no-courses" disabled>
                                                                Nenhum curso encontrado
                                                            </SelectItem>
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                /> 
                            </div>

                            {/* Image Field */}
                            <FormField
                                control={form.control}
                                name="imgClass"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Imagem da Turma</FormLabel>
                                        <FormControl>
                                            <div className="space-y-4">
                                                <Select
                                                    onValueChange={(value) => {
                                                        field.onChange(value === "none" ? null : value);
                                                    }}
                                                    value={field.value || "none"}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione uma imagem"/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="none">Nenhuma imagem</SelectItem>
                                                        {imageNames.map((imageName) => (
                                                            <SelectItem key={imageName} value={imageName}>
                                                                {imageName}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>

                                                {/* Image Preview */}
                                                {watchedImage && watchedImage !== "none" && (
                                                    <div className="w-20 h-20 sm:w-24 sm:h-24">
                                                        <img
                                                            src={`/img/${watchedImage}`}
                                                            alt="Preview"
                                                            className="w-full h-full object-cover rounded-md border"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>

                        {editionError && (
                            <div className="text-red-500 text-xs sm:text-sm p-2 sm:p-3 bg-red-50 rounded-md border border-red-200">
                                {editionError}
                            </div>
                        )}

                        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={handleCancel}
                                className="w-full sm:w-auto order-2 sm:order-1"
                                size="sm"
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={form.formState.isSubmitting || loadingCourses}
                                className="w-full sm:w-auto order-1 sm:order-2"
                                size="sm"
                            >
                                {form.formState.isSubmitting
                                    ? "Salvando..."
                                    : "Salvar Alterações"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}