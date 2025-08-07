<template>
  <div
    v-for="(aluno, index) of arrayAlunos"
    :key="aluno.id"
    class="d-flex flex-wrap justify-content-center alunos"
    :class="getAlunoClass(index, arrayAlunos)"
  >
    <!-- Mobile view: show label and value side by side -->
    <div class="col-12 d-md-none text-center">
      <strong>Posição:</strong>{{ index + 1 }}
    </div>
    <div class="col-12 d-md-none text-center">
      <strong>Aluno:</strong> {{ aluno.Aluno }}
    </div>
    <div class="col-6 d-md-none text-center">
      <strong>Entregas:</strong> {{ aluno.Atividades }}
    </div>
    <div class="col-6 d-md-none text-center">
      <strong>Média:</strong> {{ aluno.Nota }}
    </div>
    <!-- Desktop view: use table-like format -->

    <div class="col-md-2 d-none d-md-flex text-start gap-2 align-items-center">
      <p>{{ index + 1 }}</p>
      <img
        class="avatar-aluno"
        v-if="aluno.hasImagem"
        :src="`${api.apiBaseUrl}/api/v1/img/download/${aluno.Imagem}`"
        alt=""
      />

      <i v-if="!aluno.hasImagem" class="bi bi-person-circle icon-aluno"></i>
      <p class="al-nome">{{ aluno.Aluno }}</p>
    </div>

    <div class="col-md-2 d-none d-md-block text-center">
      <p class="align-items-center">{{ aluno.Pontos }}</p>
    </div>
    <div class="col-md-2 d-none d-md-block text-center align-items-center">
      {{ aluno.Atividades }}
    </div>
    <div class="col-md-2 d-none d-md-block text-center align-items-center">
      {{ aluno.Porcentagem.toFixed(1) }}%
    </div>
    <div
      class="col-md-4 d-none d-md-flex justify-content-center gap-2 align-items-center"
    >
      <div v-for="nota in aluno.UltimasAtividades" :key="nota">
        <i :class="getIconsLastFive(nota)" class="bi"></i>
      </div>
    </div>
  </div>
</template>

<script setup>
import api from "@/api";
import { defineProps } from "vue";

defineProps({
  arrayAlunos: Array,
});

const getIconsLastFive = (nota) => {
  return {
    "bi-dash-circle-fill meio": nota >= 2 && nota < 4, //2-3
    "bi-check-circle-fill bom": nota >= 4, //4-5
    "bi-x-circle-fill ruim": nota < 2, //0-1
  };
};
const getAlunoClass = (index, arrayAlunos) => {
  return {
    topAlunos: index + 1 <= 5,
    bottomAlunos: index >= arrayAlunos.length - 5,
    almostIn: index + 1 >= 6 && index + 1 <= 8,
    fundoNormal: !(
      index + 1 <= 5 ||
      index >= arrayAlunos.length - 5 ||
      (index + 1 >= 6 && index + 1 <= 8)
    ),
  };
};
</script>

<style scoped>
div {
  padding-inline-start: 5px;
  border-radius: 6px;
}
.meio {
  color: gray;
}
.bom {
  color: green;
}
.ruim {
  color: red;
}
.alunos {
  padding-bottom: 5px;
  font-weight: bolder;
  background-color: white;
}
.topAlunos {
  border-left: 0.4rem solid #008000;
}
.bottomAlunos {
  border-left: 0.4rem solid rgba(205, 0, 0, 0.875);
}
.almostIn {
  border-left: 0.4rem solid #ff9d00;
}
.fundoNormal {
  border-left: 0.4rem solid #ffffff;
}
.icon-aluno {
  font-size: 2rem;
}
.al-nome {
  font-size: 1.1rem;
}

.avatar-aluno {
  width: 2rem;
  border-radius: 90%;
}

@media (max-width: 1400px) {
  .icon-aluno {
    font-size: 1.5rem;
  }
  .al-nome {
    font-size: 0.8rem;
  }
  .avatar-aluno {
    max-width: 1.5rem;
    border-radius: 90px;
  }
}
@media (max-width: 980px) {
  .icon-aluno {
    font-size: 1rem;
  }
  .avatar-aluno {
    max-width: 1rem;
    border-radius: 90px;
  }
  .al-nome {
    font-size: 0.7rem;
  }
}
</style>
