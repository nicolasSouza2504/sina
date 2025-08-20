<template>
  <RankingNavbar @SEARCH_ALUNO="changeSearch"></RankingNavbar>

  <section>
    <article>
      <!-- This header row is only shown on larger screens -->
      <div
        class="ps-4 d-none d-md-flex flex-wrap bg-light fw-bold justify-content-center border-1 rounded"
      >
        <div class="col-md-2 text-start ps-2 header-table-title">Aluno</div>
        <div class="col-md-2 text-center header-table-title">Pontos</div>
        <div class="col-md-2 text-center header-table-title">Atividades</div>
        <div class="col-md-2 text-center header-table-title">Porcentagem</div>
        <div class="col-md-4 text-center header-table-title">Ultimas 5</div>
      </div>
      <!-- Data rows -->
      <div class="row-container">
        <RankListComponent :arrayAlunos="filteredAlunos"></RankListComponent>
      </div>
    </article>
  </section>
</template>

<script setup>
import { ref, computed } from "vue";
import RankingNavbar from "./RankingNavbar.vue";
import RankListComponent from "./RankListComponent.vue";

let alunos = ref([
  {
    id: 1,
    Aluno: "Gustavo.luis",
    Atividades: 30,
    UltimasAtividades: [4, 5, 2, 3, 4],
    Pontos: 112,
    Porcentagem: 74.67,
    hasImagem: true,
    Imagem: "Screenshot%20from%202024-08-12%2015-32-48.png",
  },
  {
    id: 2,
    Aluno: "Luis.souza",
    Atividades: 30,
    UltimasAtividades: [3, 5, 4, 4, 2],
    Pontos: 121,
    Porcentagem: 80.67,
    hasImagem: true,
    Imagem: "Screenshot from 2024-09-26 16-11-00.png",
  },
  {
    id: 3,
    Aluno: "Mariana.pereira",
    Atividades: 30,
    UltimasAtividades: [4, 3, 5, 4, 5],
    Pontos: 125,
    Porcentagem: 83.33,
    hasImagem: true,
    Imagem: "Screenshot from 2024-09-26 16-11-00.png",
  },
  {
    id: 4,
    Aluno: "Julia.silva",
    Atividades: 30,
    UltimasAtividades: [5, 4, 3, 4, 2],
    Pontos: 102,
    Porcentagem: 68.0,
    hasImagem: true,
    Imagem: "Screenshot from 2024-09-26 16-11-00.png",
  },
  {
    id: 5,
    Aluno: "Paulo.santos",
    Atividades: 30,
    UltimasAtividades: [2, 2, 3, 4, 2],
    Pontos: 78,
    Porcentagem: 52.0,
    hasImagem: true,
    Imagem: "Screenshot from 2024-09-26 16-11-00.png",
  },
  {
    id: 6,
    Aluno: "Ana.martins",
    Atividades: 30,
    UltimasAtividades: [5, 5, 5, 5, 5],
    Pontos: 150,
    Porcentagem: 100.0,
    hasImagem: true,
    Imagem: "Screenshot from 2024-09-26 16-11-00.png",
  },
  {
    id: 7,
    Aluno: "Carlos.almeida",
    Atividades: 30,
    UltimasAtividades: [1, 2, 1, 3, 2],
    Pontos: 35,
    Porcentagem: 23.33,
    hasImagem: true,
    Imagem: "Screenshot from 2024-09-26 16-11-00.png",
  },
  {
    id: 8,
    Aluno: "Bianca.oliveira",
    Atividades: 30,
    UltimasAtividades: [3, 3, 4, 2, 5],
    Pontos: 75,
    Porcentagem: 50.0,
    hasImagem: true,
    Imagem: "Screenshot from 2024-09-26 16-11-00.png",
  },
  {
    id: 9,
    Aluno: "Fernando.rodrigues",
    Atividades: 30,
    UltimasAtividades: [2, 2, 2, 2, 4],
    Pontos: 50,
    Porcentagem: 33.33,
    hasImagem: true,
    Imagem: "Screenshot from 2024-09-26 16-11-00.png",
  },
  {
    id: 10,
    Aluno: "Livia.costa",
    Atividades: 30,
    UltimasAtividades: [4, 4, 5, 4, 3],
    Pontos: 102,
    Porcentagem: 68.0,
    hasImagem: true,
    Imagem: "Screenshot from 2024-09-26 16-11-00.png",
  },
  {
    id: 11,
    Aluno: "Rafael.souza",
    Atividades: 30,
    UltimasAtividades: [3, 3, 4, 2, 5],
    Pontos: 80,
    Porcentagem: 53.33,
    hasImagem: true,
    Imagem: "Screenshot from 2024-09-26 16-11-00.png",
  },
  {
    id: 12,
    Aluno: "Clara.fonseca",
    Atividades: 30,
    UltimasAtividades: [2, 4, 3, 2, 4],
    Pontos: 70,
    Porcentagem: 46.67,
    hasImagem: true,
    Imagem: "Screenshot from 2024-09-26 16-11-00.png",
  },
  {
    id: 13,
    Aluno: "Pedro.morais",
    Atividades: 30,
    UltimasAtividades: [4, 4, 4, 4, 4],
    Pontos: 120,
    Porcentagem: 80.0,
    hasImagem: true,
    Imagem: "Screenshot from 2024-09-26 16-11-00.png",
  },
  {
    id: 14,
    Aluno: "Joana.pinto",
    Atividades: 30,
    UltimasAtividades: [5, 3, 4, 5, 4],
    Pontos: 121,
    Porcentagem: 80.67,
    hasImagem: true,
    Imagem: "Screenshot from 2024-09-26 16-11-00.png",
  },
  {
    id: 15,
    Aluno: "Lucas.cunha",
    Atividades: 30,
    UltimasAtividades: [3, 4, 2, 4, 3],
    Pontos: 70,
    Porcentagem: 46.67,
    hasImagem: true,
    Imagem: "Screenshot from 2024-09-26 16-11-00.png",
  },
  {
    id: 16,
    Aluno: "Marcel.nunes",
    Atividades: 30,
    UltimasAtividades: [4, 5, 4, 4, 5],
    Pontos: 125,
    Porcentagem: 83.33,
    hasImagem: true,
    Imagem: "Screenshot from 2024-09-26 16-11-00.png",
  },
  {
    id: 17,
    Aluno: "Tatiane.souza",
    Atividades: 30,
    UltimasAtividades: [5, 4, 5, 5, 5],
    Pontos: 145,
    Porcentagem: 96.67,
    hasImagem: true,
    Imagem: "Screenshot from 2024-09-26 16-11-00.png",
  },
  {
    id: 18,
    Aluno: "Roberto.lima",
    Atividades: 30,
    UltimasAtividades: [3, 3, 3, 3, 2],
    Pontos: 60,
    Porcentagem: 40.0,
    hasImagem: true,
    Imagem: "Screenshot from 2024-09-26 16-11-00.png",
  },
  {
    id: 19,
    Aluno: "Juliana.santos",
    Atividades: 30,
    UltimasAtividades: [2, 3, 5, 4, 5],
    Pontos: 78,
    Porcentagem: 52.0,
    hasImagem: true,
    Imagem: "Screenshot from 2024-09-26 16-11-00.png",
  },
  {
    id: 20,
    Aluno: "Felipe.garcia",
    Atividades: 30,
    UltimasAtividades: [3, 2, 4, 2, 3],
    Pontos: 50,
    Porcentagem: 33.33,
    hasImagem: true,
    Imagem: "Screenshot from 2024-07-25 10-26-33.png",
  },
  {
    id: 21,
    Aluno: "Fernando.silva",
    Atividades: 30,
    UltimasAtividades: [5, 5, 5, 5, 5],
    Pontos: 150,
    Porcentagem: 100.0,
    hasImagem: true,
    Imagem: "Screenshot from 2024-09-26 16-11-00.png",
  },
  {
    id: 22,
    Aluno: "Sofia.martins",
    Atividades: 30,
    UltimasAtividades: [4, 4, 4, 4, 4],
    Pontos: 120,
    Porcentagem: 80.0,
    hasImagem: true,
    Imagem: "Screenshot from 2024-09-26 16-11-00.png",
  },
  {
    id: 23,
    Aluno: "Gabriel.rodrigues",
    Atividades: 30,
    UltimasAtividades: [2, 2, 3, 1, 2],
    Pontos: 30,
    Porcentagem: 20.0,
  },
  {
    id: 24,
    Aluno: "Nathalia.souza",
    Atividades: 30,
    UltimasAtividades: [3, 4, 5, 5, 3],
    Pontos: 90,
    Porcentagem: 60.0,
  },
  {
    id: 25,
    Aluno: "Eduardo.gomes",
    Atividades: 30,
    UltimasAtividades: [4, 3, 2, 2, 5],
    Pontos: 80,
    Porcentagem: 53.33,
  },
  {
    id: 26,
    Aluno: "Danielle.oliveira",
    Atividades: 30,
    UltimasAtividades: [5, 4, 4, 4, 5],
    Pontos: 130,
    Porcentagem: 86.67,
  },
  {
    id: 27,
    Aluno: "Robson.santos",
    Atividades: 30,
    UltimasAtividades: [2, 1, 1, 3, 2],
    Pontos: 30,
    Porcentagem: 20.0,
  },
  {
    id: 28,
    Aluno: "Patricia.pinto",
    Atividades: 30,
    UltimasAtividades: [3, 4, 2, 5, 5],
    Pontos: 90,
    Porcentagem: 60.0,
  },
  {
    id: 29,
    Aluno: "Vinícius.machado",
    Atividades: 30,
    UltimasAtividades: [5, 4, 4, 5, 5],
    Pontos: 135,
    Porcentagem: 90.0,
  },
  {
    id: 30,
    Aluno: "Natalia.souza",
    Atividades: 30,
    UltimasAtividades: [3, 3, 3, 2, 2],
    Pontos: 70,
    Porcentagem: 46.67,
    hasImagem: true,
    Imagem: "Screenshot from 2024-09-26 16-11-00.png",
  },
]);

const searchQuery = ref("");

// Sort by Pontos in descending order
alunos.value.sort((a, b) => b.Pontos - a.Pontos);

const filteredAlunos = computed(() => {
  return alunos.value.filter((aluno) =>
    aluno.Aluno.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

function changeSearch(query) {
  searchQuery.value = query;
}
</script>

<style scoped>
section {
  margin: 0 auto;
  padding: 5rem 15rem;
}
.header-table-title {
  font-size: 1.5rem;
}

.row-container {
  margin-top: 5px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
@media (max-width: 1200px) {
  section {
    padding: 1rem 4rem;
  }
  .header-table-title {
    font-size: 1.2rem;
  }
}
@media (max-width: 980px) {
  .header-table-title {
    font-size: 1rem;
  }
}
@media (max-width: 450px) {
  section {
    padding: 1rem 1rem;
  }
}
</style>
