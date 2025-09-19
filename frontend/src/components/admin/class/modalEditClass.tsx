"use client";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Class } from "@/lib/interfaces/classInterfaces";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface ClassFormData {
    code: string;
    name: string;
    startDate: string | null;
    endDate: string | null;
    semester: number | null | string;
    courseId: number |null | string;
    imgClass: string | null;
}

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
            .max(70, "Nome deve conter somente 70 caracteres"),
        startDate: z
            .string()
            .min(1, "Data de início é obrigatória")
            .refine((date) => !isNaN(Date.parse(date)), "Data inválida"),
        endDate: z
            .string()
            .min(1, "Data de término é obrigatória")
            .refine((date) => !isNaN(Date.parse(date)), "Data inválida"),
        semester: z.number().min(0, "Semestre deve ser preenchido"),
        courseId: z.number(),
        imgClass: z.string().nullable().optional(),
    })
    .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
        message: "Data de término deve ser posterior à data de início",
        path: ["finalDate"],
    });

export type EditClassSchemaValues = z.infer<typeof editClassSchema>;

export default function ModalEditClass({
                                           isOpen,
                                           onClose,
                                           classData,
                                           onClassUpdated,
                                           imageNames,
                                       }: ModalEditClassProps) {
    const form = useForm<EditClassSchemaValues>({
        resolver: zodResolver(editClassSchema),
        defaultValues: {
            name: "",
            startDate: "",
            endDate: "",
            semester: undefined,
            courseId: undefined,
            imgClass: null,
        },
        mode: "onSubmit",
    });

    // Load class data when modal opens or classData changes
    useEffect(() => {
        if (isOpen && classData) {
            form.reset({
                code:classData.code || "",
                name: classData.name,
                startDate: classData.startDate || "",
                endDate: classData.endDate || "",
                semester: classData.semester || undefined,
                courseId: classData.courseId || undefined,
                imgClass: classData.imgClass || null,
            });
        }
    }, [isOpen, classData, form]);

    // Reset form when modal closes
    useEffect(() => {
        if (!isOpen) {
            resetForm();
        }
    }, [isOpen]);

    const onSubmit = (data: EditClassSchemaValues) => {
        if (!classData) return;

        console.log("Editing class:", classData.id, data);

        // Transform the data to match ClassFormData interface
        const formData: ClassFormData = {
            code: data.code || "",
            name: data.name,
            startDate: data.startDate,
            endDate: data.endDate,
            semester: data.semester || null,
            courseId: data.courseId || "",
            imgClass: data.imgClass || null,
        };

        // Call the callback function if provided
        if (onClassUpdated) {
            onClassUpdated();
        }

        onClose();
    };

    const resetForm = () => {
        form.reset({
            name: "",
            startDate: "",
            endDate: "",
            imgClass: null,
        });
    };

    const handleCancel = () => {
        resetForm();
        onClose();
    };

    const watchedImage = form.watch("imgClass");

    if (!classData) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Editar Turma</DialogTitle>
                    <DialogDescription>
                        Atualize os dados da turma selecionada.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid gap-4 py-4">
                            {/* Name Field */}
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nome da Turma</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Ex: Desenvolvimento Web Full-Stack 2024.1"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Date Fields */}
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="startDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Data de Início</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="endDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Data de Término</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Image Field */}
                            <FormField
                                control={form.control}
                                name="imgClass"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Imagem da Turma</FormLabel>
                                        <FormControl>
                                            <div className="space-y-4">
                                                <Select
                                                    onValueChange={field.onChange}
                                                    value={field.value || ""}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione uma imagem" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="">Nenhuma imagem</SelectItem>
                                                        {imageNames.map((imageName) => (
                                                            <SelectItem key={imageName} value={imageName}>
                                                                {imageName}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>

                                                {/* Image Preview */}
                                                {watchedImage && (
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
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={handleCancel}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
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