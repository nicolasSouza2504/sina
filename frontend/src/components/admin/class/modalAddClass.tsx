"use client";
import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import CreateClassService from "@/lib/api/class/createClass";
import {CreateClass} from "@/lib/interfaces/classInterfaces";
import {zodResolver} from "@hookform/resolvers/zod";
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import CourseListService from "@/lib/api/course/courseList";
import {GraduationCap, Hash, Calendar, Image as ImageIcon} from "lucide-react";

interface ModalAddClassProps {
    isOpen: boolean;
    onClose: () => void;
    onClassCreated?: () => void;
    imageNames: string[];
}

const classSchema = z
    .object({
        code: z
            .string()
            .min(1, "Code é obrigatório")
            .max(70, "Code deve conter somente 70 caracteres"),
        name: z
            .string()
            .min(1, "Nome é obrigatório")
            .max(70, "Nome deve conter somente 70 caracteres"),
        startDate: z
            .string()
            .optional()
            .refine(
                (date) => !date || (date && !isNaN(Date.parse(date))),
                "Data inválida"
            ),
        endDate: z
            .string()
            .optional()
            .refine(
                (date) => !date || (date && !isNaN(Date.parse(date))),
                "Data inválida"
            ),
        semester: z.number().min(1, "Semestre deve ser preenchido").optional(),
        courseId: z.number().min(1, "Curso deve ser selecionado").optional(),
        imgClass: z.string().nullable().optional(),
    })
    .refine(
        (data) => {
            if (data.startDate && data.endDate) {
                return new Date(data.endDate) > new Date(data.startDate);
            }
            return true;
        },
        {
            message: "Data de término deve ser posterior à data de início",
            path: ["endDate"],
        }
    );

export type ClassSchemaValues = z.infer<typeof classSchema>;

export default function ModalAddClass({
                                          isOpen,
                                          onClose,
                                          onClassCreated,
                                          imageNames,
                                      }: ModalAddClassProps) {
    const [creationError, setCreationError] = useState<string | null>(null);
    const [loadingCourses, setLoadingCourses] = useState(false);
    const [courses, setCourses] = useState<{ id: number, name: string }[]>([]);
    const [generatingCode, setGeneratingCode] = useState(false);


    useEffect(() => {
        getCourses();
    }, []);

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
            setCreationError(errorMessage);
        } finally {
            setLoadingCourses(false);
        }
    }

    const form = useForm<ClassSchemaValues>({
        resolver: zodResolver(classSchema),
        defaultValues: {
            code: "",
            name: "",
            startDate: "",
            endDate: "",
            semester: undefined,
            courseId: undefined,
            imgClass: null,
        },
        mode: "onSubmit",
    });

    useEffect(() => {
        if (!isOpen) {
            resetForm();
        }
    }, [isOpen]);

    const onSubmit = async (data: ClassSchemaValues) => {
        setCreationError(null); // Clear previous errors

        const classData: CreateClass = {
            code: data.code,
            name: data.name,
            nome: data.name,
            startDate: data.startDate || null,
            endDate: data.endDate || null,
            semester: data.semester || null,
            courseId: data.courseId || null,
            imgClass: data.imgClass === "none" ? null : data.imgClass || null,
        };

        try {
            await createClassOnSubmit(classData);
            if (onClassCreated) {
                onClassCreated();
            }
            onClose();
        } catch (err) {
            console.error("Error creating class:", err);
            let errorMessage = "Erro durante a Criação de Turma";

            if (err instanceof Error) {
                errorMessage = err.message;
            } else if (typeof err === "string") {
                errorMessage = err;
            }

            setCreationError(errorMessage);
        }
    };

    const createClassOnSubmit = async (CreateClassForm: CreateClass) => {
        return await CreateClassService(CreateClassForm);
    };

    const resetForm = () => {
        form.reset({
            code: "",
            name: "",
            startDate: "",
            endDate: "",
            semester: undefined,
            courseId: undefined,
            imgClass: null,
        });
        setCreationError(null);
    };

    const handleCancel = () => {
        resetForm();
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

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-[95vw] max-w-[500px] sm:max-w-[600px] lg:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader className="pb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-blue-600 rounded-xl">
                            <GraduationCap className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-bold text-gray-900">
                                Cadastrar Nova Turma
                            </DialogTitle>
                            <p className="text-sm text-gray-500 mt-1">
                                Preencha os dados da nova turma
                            </p>
                        </div>
                    </div>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
                        <div className="grid gap-6">
                            {/* Code Field */}
                            <FormField
                                control={form.control}
                                name="code"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-semibold text-gray-700">
                                            Código da Turma <span className="text-red-500">*</span>
                                        </FormLabel>
                                        <div className="flex gap-2">
                                            <FormControl>
                                                <Input
                                                    placeholder="Ex: TUR001"
                                                    {...field}
                                                    className="h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors rounded-xl"
                                                />
                                            </FormControl>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={createNewClassCode}
                                                disabled={generatingCode}
                                                className="h-12 px-4 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 rounded-xl flex-shrink-0"
                                            >
                                                <Hash className="h-4 w-4 mr-2" />
                                                {generatingCode ? "Gerando..." : "Gerar"}
                                            </Button>
                                        </div>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            {/* Name Field */}
                            <FormField
                                control={form.control}
                                name="name"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-semibold text-gray-700">
                                            Nome da Turma <span className="text-red-500">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Ex: Desenvolvimento Web Full-Stack 2024.1"
                                                {...field}
                                                className="h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors rounded-xl"
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            {/* Semester Field */}
                            <FormField
                                control={form.control}
                                name="semester"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-semibold text-gray-700">
                                            Quantidade de Semestres
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Ex: 8"
                                                min={1}
                                                value={field.value || ""}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    field.onChange(value ? parseInt(value, 10) : undefined);
                                                }}
                                                className="h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors rounded-xl"
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            {/* Course ID Field */}
                            <FormField
                                control={form.control}
                                name="courseId"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-semibold text-gray-700">
                                            Curso Vinculado
                                        </FormLabel>
                                        <FormControl>
                                            <Select
                                                onValueChange={(value) => {
                                                    field.onChange(parseInt(value));
                                                }}
                                                value={field.value?.toString() || ""}
                                                disabled={loadingCourses}
                                            >
                                                <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors rounded-xl">
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
                                                            className="py-3"
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

                            {/* Date Fields */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="startDate"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-semibold text-gray-700">
                                                Data de Início
                                            </FormLabel>
                                            <FormControl>
                                                <Input 
                                                    type="date" 
                                                    {...field} 
                                                    className="h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors rounded-xl" 
                                                />
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
                                            <FormLabel className="text-sm font-semibold text-gray-700">
                                                Data de Término
                                            </FormLabel>
                                            <FormControl>
                                                <Input 
                                                    type="date" 
                                                    {...field} 
                                                    className="h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors rounded-xl" 
                                                />
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
                                        <FormLabel className="text-sm font-semibold text-gray-700">
                                            Imagem da Turma
                                        </FormLabel>
                                        <FormControl>
                                            <div className="space-y-4">
                                                <Select
                                                    onValueChange={(value) => {
                                                        field.onChange(value === "none" ? null : value);
                                                    }}
                                                    value={field.value || "none"}
                                                >
                                                    <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors rounded-xl">
                                                        <SelectValue placeholder="Selecione uma imagem"/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="none" className="py-3">Nenhuma imagem</SelectItem>
                                                        {imageNames.map((imageName) => (
                                                            <SelectItem key={imageName} value={imageName} className="py-3">
                                                                {imageName}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>

                                                {/* Image Preview */}
                                                {watchedImage && watchedImage !== "none" && (
                                                    <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                                                        <ImageIcon className="h-5 w-5 text-blue-600" />
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium text-blue-900">Preview da Imagem</p>
                                                            <p className="text-xs text-blue-700">{watchedImage}</p>
                                                        </div>
                                                        <img
                                                            src={`/img/${watchedImage}`}
                                                            alt="Preview"
                                                            className="w-16 h-16 object-cover rounded-lg border-2 border-blue-300"
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

                        {creationError && (
                            <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                                <p className="text-sm font-medium text-red-900">{creationError}</p>
                            </div>
                        )}

                        <DialogFooter className="flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={handleCancel}
                                className="w-full sm:w-auto order-2 sm:order-1 h-11 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-xl font-semibold"
                            >
                                Cancelar
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={form.formState.isSubmitting}
                                className="w-full sm:w-auto order-1 sm:order-2 h-11 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                            >
                                {form.formState.isSubmitting
                                    ? "Cadastrando..."
                                    : "Cadastrar Turma"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}