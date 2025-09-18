"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {useState} from "react"
import * as z from "zod"
import {Eye, EyeOff, Mail, Lock, User, CheckCircle, XCircle} from "lucide-react"

import {Button} from "@/components/ui/button"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {Checkbox} from "@/components/ui/checkbox"
import {UserRegisterForm} from "@/lib/interfaces/userInterfaces";

const registerSchema = z
    .object({
        name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
        email: z.string().email("Email inválido").min(1, "Email é obrigatório"),
        password: z
            .string()
            .min(8, "Senha deve ter pelo menos 8 caracteres")
            .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
            .regex(/[a-z]/, "Senha deve conter pelo menos uma letra minúscula")
            .regex(/[0-9]/, "Senha deve conter pelo menos um número"),
        confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
        acceptTerms: z.boolean().refine((val) => val === true, {
            message: "Você deve aceitar os termos de uso",
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Senhas não coincidem",
        path: ["confirmPassword"],
    })


interface RegisterFormProps {
    onSubmit: (data: UserRegisterForm) => Promise<void>
    isLoading?: boolean
}

export function RegisterForm({onSubmit, isLoading = false}: RegisterFormProps) {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const form = useForm<UserRegisterForm>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            acceptTerms: false,
        },
    })

    const password = form.watch("password")
    const confirmPassword = form.watch("confirmPassword")

    const validatePassword = (password: string) => {
        return {
            minLength: password.length >= 8,
            hasUpperCase: /[A-Z]/.test(password),
            hasLowerCase: /[a-z]/.test(password),
            hasNumbers: /[0-9]/.test(password),
        }
    }

    const passwordValidation = validatePassword(password)
    const passwordsMatch = password === confirmPassword && confirmPassword !== ""

    const PasswordCriteria = ({met, text}: { met: boolean; text: string }) => (
        <span className="inline-flex items-center gap-2 align-middle">
    {met ? <CheckCircle className="h-3 w-3 text-green-500"/> : <XCircle className="h-3 w-3 text-red-500"/>}
            <span className={`text-xs ${met ? "text-green-600" : "text-red-600"}`}>{text}</span>
  </span>
    )


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Nome Completo</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/>
                                    <Input placeholder="Seu nome completo" className="pl-10" {...field} />
                                </div>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/>
                                    <Input placeholder="seu@email.com" className="pl-10" {...field} />
                                </div>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Senha</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/>
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Digite sua senha"
                                        className="pl-10 pr-10"
                                        {...field}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4 text-muted-foreground"/>
                                        ) : (
                                            <Eye className="h-4 w-4 text-muted-foreground"/>
                                        )}
                                    </Button>
                                </div>
                            </FormControl>
                            {password && (
                                <FormDescription>
                                    <span className="text-xs text-muted-foreground">Critérios da senha:</span><br/>
                                    <PasswordCriteria met={passwordValidation.minLength}
                                                      text="Mínimo 8 caracteres"/><br/>
                                    <PasswordCriteria met={passwordValidation.hasUpperCase} text="Uma letra maiúscula"/><br/>
                                    <PasswordCriteria met={passwordValidation.hasLowerCase} text="Uma letra minúscula"/><br/>
                                    <PasswordCriteria met={passwordValidation.hasNumbers} text="Um número"/>
                                </FormDescription>
                            )}
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Confirmar Senha</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/>
                                    <Input
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirme sua senha"
                                        className="pl-10 pr-10"
                                        {...field}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-4 w-4 text-muted-foreground"/>
                                        ) : (
                                            <Eye className="h-4 w-4 text-muted-foreground"/>
                                        )}
                                    </Button>
                                </div>
                            </FormControl>
                            {passwordsMatch && (
                                <FormDescription>
                                    <span className="inline-flex items-center gap-2 align-middle">
                                      <CheckCircle className="h-3 w-3 text-green-500"/>
                                      <span className="text-xs text-green-600">Senhas coincidem</span>
                                    </span>
                                </FormDescription>
                            )}

                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="acceptTerms"
                    render={({field}) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange}/>
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel className="text-sm font-normal">
                                    Aceito os{" "}
                                    <Button variant="link" className="p-0 h-auto font-normal text-primary">
                                        termos de uso
                                    </Button>{" "}
                                    e{" "}
                                    <Button variant="link" className="p-0 h-auto font-normal text-primary">
                                        política de privacidade
                                    </Button>
                                </FormLabel>
                                <FormMessage/>
                            </div>
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full hover:cursor-pointer" disabled={isLoading}>
                    {isLoading ? "Criando conta..." : "Criar Conta"}
                </Button>
            </form>
        </Form>
    )
}
