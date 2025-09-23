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
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {Input} from "@/components/ui/input";
import CreateClassService from "@/lib/api/class/createClass";
import {CreateClass} from "@/lib/interfaces/classInterfaces";
import {zodResolver} from "@hookform/resolvers/zod";
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";

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
        console.log("Creating class:", data);
        setCreationError(null); // Clear previous errors

        const classData: CreateClass = {
            code: data.code,
            name: data.name,
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

    const watchedImage = form.watch("imgClass");

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Cadastrar Nova Turma</DialogTitle>
                    <DialogDescription>
                        Preencha os dados da nova turma. O nome e código são obrigatórios,
                        as demais informações são opcionais.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid gap-4 py-4">
                            {/* Code Field */}
                            <FormField
                                control={form.control}
                                name="code"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Código da Turma</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Ex: TUR001"
                                                {...field}
                                            />
                                        </FormControl>
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
                                        <FormLabel>Nome da Turma</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Ex: Desenvolvimento Web Full-Stack 2024.1"
                                                {...field}
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
                                        <FormLabel>Semestre (opcional)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Ex: 1"
                                                min={1}
                                                value={field.value || ""}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    field.onChange(value ? parseInt(value, 10) : undefined);
                                                }}
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
                                        <FormLabel>ID do Curso (opcional)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Ex: 1"
                                                min={1}
                                                value={field.value || ""}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    field.onChange(value ? parseInt(value, 10) : undefined);
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            {/* Date Fields */}
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="startDate"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Data de Início (opcional)</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
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
                                            <FormLabel>Data de Término (opcional)</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
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
                                        <FormLabel>Imagem da Turma (opcional)</FormLabel>
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
                                                    <div className="w-24 h-24">
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

                        {creationError && (
                            <div className="text-red-500 text-sm p-3 bg-red-50 rounded-md border border-red-200">
                                {creationError}
                            </div>
                        )}

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={handleCancel}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
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