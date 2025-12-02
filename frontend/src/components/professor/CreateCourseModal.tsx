"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import { Input } from "@/components/ui/input";
import CreateCourseService from "@/lib/api/course/createCourse";
import { CreateCourse } from "@/lib/interfaces/courseInterfaces";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { BookOpen, Calendar } from "lucide-react";
import { toast } from "sonner";

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCourseCreated?: () => void;
}

const courseSchema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(100, "Nome deve conter no máximo 100 caracteres"),
  quantitySemester: z
    .number()
    .min(1, "Quantidade de semestres deve ser no mínimo 1")
    .max(12, "Quantidade de semestres deve ser no máximo 12"),
});

export type CourseSchemaValues = z.infer<typeof courseSchema>;

export default function CreateCourseModal({
  isOpen,
  onClose,
  onCourseCreated,
}: CreateCourseModalProps) {
  const [creationError, setCreationError] = useState<string | null>(null);

  const form = useForm<CourseSchemaValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      name: "",
      quantitySemester: 6,
    },
    mode: "onSubmit",
  });

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const onSubmit = async (data: CourseSchemaValues) => {
    setCreationError(null);

    const courseData: CreateCourse = {
      name: data.name,
      quantitySemester: data.quantitySemester,
    };

    try {
      await createCourseOnSubmit(courseData);
      toast.success("Curso criado com sucesso!");
      if (onCourseCreated) {
        onCourseCreated();
      }
      onClose();
    } catch (err) {
      console.error("Error creating course:", err);
      let errorMessage = "Erro durante a criação do curso";

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      }

      setCreationError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const createCourseOnSubmit = async (createCourseForm: CreateCourse) => {
    return await CreateCourseService(createCourseForm);
  };

  const resetForm = () => {
    form.reset({
      name: "",
      quantitySemester: 6,
    });
    setCreationError(null);
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-[500px] sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-600 rounded-xl">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-gray-900">
                Cadastrar Novo Curso
              </DialogTitle>
              <p className="text-sm text-gray-500 mt-1">
                Preencha os dados do novo curso
              </p>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
            <div className="grid gap-6">
              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700">
                      Nome do Curso <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Desenvolvimento de Sistemas"
                        {...field}
                        className="h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors rounded-xl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Quantity Semester Field */}
              <FormField
                control={form.control}
                name="quantitySemester"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700">
                      Quantidade de Semestres <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="number"
                          min={1}
                          max={12}
                          placeholder="Ex: 6"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                          className="h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors rounded-xl pl-10"
                        />
                        <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                      </div>
                    </FormControl>
                    <p className="text-xs text-gray-500 mt-1">
                      Informe a quantidade total de semestres do curso (1 a 12)
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Preview Card */}
              <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl space-y-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <h4 className="text-sm font-semibold text-blue-900">
                    Resumo do Curso
                  </h4>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                    <span className="text-xs font-medium text-gray-600">Nome:</span>
                    <span className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">
                      {form.watch("name") || "Não informado"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                    <span className="text-xs font-medium text-gray-600">Semestres:</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {form.watch("quantitySemester")}
                    </span>
                  </div>
                </div>
              </div>
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
                  : "Cadastrar Curso"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
