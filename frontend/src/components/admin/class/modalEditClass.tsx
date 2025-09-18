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
import { Input } from "@/components/ui/input";
import { Class } from "@/lib/interfaces/classInterfaces";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, X } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface ClassFormData {
  name: string;
  startDate: string | null;
  finalDate: string | null;
  imgClass: File | null;
}

interface ModalEditClassProps {
  isOpen: boolean;
  onClose: () => void;
  classData: Class | null;
  onClassUpdated?: () => void;
}

const editClassSchema = z
  .object({
    name: z
      .string()
      .min(1, "Nome é obrigatório")
      .max(70, "Nome deve conter somente 70 caracteres"),
    startDate: z
      .string()
      .min(1, "Data de início é obrigatória")
      .refine((date) => !isNaN(Date.parse(date)), "Data inválida"),
    finalDate: z
      .string()
      .min(1, "Data de término é obrigatória")
      .refine((date) => !isNaN(Date.parse(date)), "Data inválida"),
    imgClass: z
      .instanceof(File)
      .refine((file) => file.size <= 5000000, "Imagem deve ter no máximo 5MB")
      .refine(
        (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
        "Formato de imagem inválido. Use JPEG, PNG ou WebP"
      )
      .nullable()
      .optional(),
  })
  .refine((data) => new Date(data.finalDate) > new Date(data.startDate), {
    message: "Data de término deve ser posterior à data de início",
    path: ["finalDate"],
  });

export type EditClassSchemaValues = z.infer<typeof editClassSchema>;

export default function ModalEditClass({
  isOpen,
  onClose,
  classData,
  onClassUpdated,
}: ModalEditClassProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<EditClassSchemaValues>({
    resolver: zodResolver(editClassSchema),
    defaultValues: {
      name: "",
      startDate: "",
      finalDate: "",
      imgClass: null,
    },
    mode: "onSubmit",
  });

  // Load class data when modal opens or classData changes
  useEffect(() => {
    if (isOpen && classData) {
      form.reset({
        name: classData.name,
        startDate: classData.startDate || "",
        finalDate: classData.finalDate || "",
        imgClass: null,
      });
      setImagePreview(classData.imgClass);
    }
  }, [isOpen, classData, form]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("imgClass", file);
      form.trigger("imgClass"); // Trigger validation for the image field

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: EditClassSchemaValues) => {
    if (!classData) return;

    console.log("Editing class:", classData.id, data);

    // Transform the data to match ClassFormData interface
    const formData: ClassFormData = {
      name: data.name,
      startDate: data.startDate,
      finalDate: data.finalDate,
      imgClass: data.imgClass || null,
    };

    // Call the callback function if provided
    if (onClassUpdated) {
      onClassUpdated();
    }

    onClose();
  };

  const removeImage = () => {
    form.setValue("imgClass", null);
    form.trigger("imgClass");
    setImagePreview(classData?.imgClass || null); // Reset to original image
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const resetForm = () => {
    form.reset({
      name: "",
      startDate: "",
      finalDate: "",
      imgClass: null,
    });
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
                  name="finalDate"
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
                render={() => (
                  <FormItem>
                    <FormLabel>Imagem da Turma</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-2"
                          >
                            <Upload className="h-4 w-4" />
                            Alterar Imagem
                          </Button>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                          {watchedImage && (
                            <span className="text-sm text-muted-foreground">
                              {watchedImage.name}
                            </span>
                          )}
                        </div>

                        {imagePreview && (
                          <div className="relative w-24 h-24">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-full h-full object-cover rounded-md border"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                              onClick={removeImage}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        )}

                        {/* Show current image info if no preview and no new image */}
                        {!imagePreview &&
                          !watchedImage &&
                          classData?.imgClass && (
                            <div className="text-sm text-muted-foreground">
                              Imagem atual:{" "}
                              {classData.imgClass.split("/").pop()}
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
