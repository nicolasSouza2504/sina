<template>
  <section class="bg-body-secondary row mx-auto">
    <div class="row justify-content-center px-5 py-3 gap-5">
      <div class="col-xxl-2 col-xl-2 col-lg-4 col-md-6 col-sm-10 col-12">
        <label for="turma">Turma: </label>
        <div class="input-group">
          <select id="turma" class="form-select">
            <option
              v-for="turma in turmas"
              :key="turma.id"
              value="{{ turma.id }}"
            >
              {{ turma.nome }}
            </option>
          </select>
          <span class="input-group-text">
            <i class="bi bi-filter-square fs-3"></i>
          </span>
        </div>
      </div>
      <div class="col-xxl-2 col-xl-2 col-lg-4 col-md-6 col-sm-10 col-12">
        <label for="aluno">Aluno: </label>
        <div class="input-group">
          <input
            id="aluno"
            type="text"
            class="form-control"
            v-model="alunoNome"
            @input="searchAluno"
          />
          <span class="input-group-text botaoPesquisa" @click="searchAluno">
            <i class="bi bi-search fs-3"></i>
          </span>
        </div>
      </div>
    </div>
  </section>

  <Teleport to="body">
    <!-- use the modal component, pass in the prop -->
    <ErrorModal :show="showModal" @close="showModal = false">
      <template #header>
        <h3 class="text-danger">{{ errorHeader }}</h3>
      </template>
      <template #body>
        <p>{{ errorMessage }}</p>
      </template>
    </ErrorModal>
  </Teleport>
</template>

<script setup>
import axiosClient from "@/axiosClient";
import { onMounted, ref } from "vue";
import ErrorModal from "./AlertModal.vue";

const turmas = ref();
const showModal = ref(false);
const alunoNome = ref("");
const errorHeader = ref("");
const errorMessage = ref("");
const emit = defineEmits(["SEARCH_ALUNO"]);

const searchAluno = () => {
  emit("SEARCH_ALUNO", alunoNome.value);
};

onMounted(async () => {
  await axiosClient
    .get("/turma/all")
    .then(({ data }) => {
      turmas.value = data.data;
    })
    .catch((error) => {
      errorHeader.value = error.name;
      errorMessage.value = error.message;
      showModal.value = true;
    });
});
</script>

<style scoped>
section {
  margin: 0 auto;
  width: 100%;
}
.botaoPesquisa {
  cursor: pointer;
}
</style>
