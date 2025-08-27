"use client"
import {useState} from "react"
import {AuthCard} from "@/components/auth/auth-card"
import {LoginForm, LoginFormValues} from "@/components/auth/login-form"
import {useRouter} from "next/navigation"
import {Facebook, Instagram, Linkedin, Twitter, Youtube} from "lucide-react";
import login from "@/lib/api/auth/login";
import {UserLoginData} from "@/lib/interfaces/userInterfaces";

export default function LoginPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const handleLogin = async (data: LoginFormValues) => {
        setIsLoading(true)
        const userLoginData: UserLoginData = {
            email: data.email,
            password: data.password
        }
        try{
        const response = await login(userLoginData)
        console.log(response)
        } catch (e) {
            console.error('login server action error:', e)
        }

        console.log("Login data:", data)
        setIsLoading(false)
    }
    return (<div className="h-screen flex overflow-hidden">
        <div
            className="hidden lg:flex w-3/5 items-center justify-center bg-gradient-to-br from-sky-500 to-sky-900 relative">
            <div className="max-w-5xl max-h-full"><h1
                className="text-4xl font-bold text-white mb-4 drop-shadow-lg text-center pb-5 stroke-3 "> Ambiente
                Virtual de aprendizagem </h1> <img src="/img/Alunos-senai.png" alt="Unisenai Logo"
                                                   className="w-full h-full object-contain drop-shadow-2xl"/>
                <div className="flex gap-20 mt-10 justify-center">
                    <div className="flex flex-col items-center justify-center mt-5 ">
                        <div className="w-48 h-16 ">
                            <img src="/img/sesi-branca.png" alt="Unisenai Logo"
                                 className="w-full h-full drop-shadow-2xl "/>
                        </div>
                        <div className="flex gap-3 items-center justify-center mt-5 text-white "><Instagram
                            className="hover:cursor-pointer size-7"/>
                            <Facebook className="hover:cursor-pointer size-7"/>
                            <Twitter className="hover:cursor-pointer size-7"/>
                            <Youtube className="hover:cursor-pointer size-7"/>
                            <Linkedin className="hover:cursor-pointer size-7"/></div>
                    </div>
                    <div className="flex flex-col items-center justify-center mt-5">
                        <div className="w-58 h-16 justify-center "><img src="/img/senai-branca.png" alt="Unisenai Logo"
                                                                        className="w-full h-full drop-shadow-2xl "/>
                        </div>
                        <div className="flex gap-3 items-center justify-center mt-5 text-white ">
                            <Instagram className="hover:cursor-pointer size-7"/>
                            <Facebook className="hover:cursor-pointer size-7"/>
                            <Twitter className="hover:cursor-pointer size-7"/>
                            <Youtube className="hover:cursor-pointer size-7"/>
                            <Linkedin className="hover:cursor-pointer size-7"/></div>
                    </div>
                </div>
            </div>
            <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200/30 rounded-full blur-xl"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-indigo-200/20 rounded-full blur-2xl"></div>
        </div>
        <div className="w-full lg:w-2/5 flex items-center justify-center bg-white relative">
            <AuthCard>
                <LoginForm onSubmit={handleLogin} isLoading={isLoading}/>
            </AuthCard>
        </div>
    </div>)
}