import RankList from "@/components/RankList.vue";
import CadastroAdmin from "@/views/CadastroAdmin.vue";
import CadastroAluno from "@/views/CadastroAluno.vue";
import CadastroProfessor from "@/views/CadastroProfessor.vue";
import HomePage from "@/views/HomePage.vue";
import LoginPage from "@/views/LoginPage.vue";
import GestaoTurmas from "@/views/painel-gestao/GestaoTurmas.vue";
import PainelDeGestao from "@/views/PainelDeGestao.vue";
//import TheAlunos from "@/views/TheAlunos.vue";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
    {
        path: "/home",
        name: "home",
        component: HomePage
    },
    {
        path: "/login",
        name: "login",
        component: LoginPage
    },
    {
        path: "/agendamentos",
        name: "agendamentos",
        component: RankList
    },
    {
        path: "/painel-gestao",
        name: "gestao",
        component: PainelDeGestao
    },
    {
        path: "/aluno/register",
        name: "registerAluno",
        component: CadastroAluno
    },
    {
        path: "/professor/register",
        name: "registerProfessor",
        component: CadastroProfessor
    },
    {
        path: "/admin/register",
        name: "registerAdmin",
        component: CadastroAdmin
    },
    {
        path: "/painel-gestao/turmas",
        name: "managmentTurmas",
        component: GestaoTurmas
    },

    {
        path: "/:pathMatch(.*)*",
        redirect: "/login"  // or any other route, like "/404" if you have a custom 404 page
    }
];


const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;