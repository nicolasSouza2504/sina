<template>
  <div class="card turma-card" v-bind:key="id" @click="showModal = true">
    <img :src="imgFile" class="card-img-top" alt="Imagem não disponível" />
    <div class="card-body">
      <h2 class="card-header bg-body">{{ props.nome }}</h2>
      <p class="card-text ms-3">{{ props.dataInicio }} - {{ props.dataFim }}</p>
    </div>
  </div>
  <Teleport to="body">
    <!-- use the modal component, pass in the prop -->
    <UpdateTurmaModal
      :show="showModal"
      @close="showModal = false"
      @UPDATE_TURMA="updateTurma()"
      @INACTIVATE_TURMA="inactivateTurma()"
    >
      <template #header>
        <h2 class="text-white fw-bold text-center mb-5">Edição de Turma</h2>
      </template>
      <template #body>
        <div class="px-5">
          <input
            v-model="name"
            type="text"
            class="form-control justify-content-center"
          />
        </div>
        <div class="d-flex gap-3 justify-content-center px-5 mb-5">
          <input type="date" class="form-control" v-model="startDate" />
          <input type="date" class="form-control" v-model="finalDate" />
        </div>
      </template>
    </UpdateTurmaModal>
  </Teleport>
</template>

<script setup>
import axiosClient from "@/axiosClient";
import UpdateTurmaModal from "@/components/modals/UpdateTurmaModal.vue";
import { ref, getCurrentInstance, defineEmits } from "vue";

const emit = defineEmits();
const { proxy } = getCurrentInstance();
const showModal = ref(false);

const props = defineProps({
  idTurma: {
    type: Number,
    required: true,
  },
  nome: {
    type: String,
    required: true,
  },
  dataInicio: {
    type: String,
    required: true,
  },
  dataFim: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  token: {
    type: String,
  },
});

// Resolva o caminho da imagem relativa ao diretório `assets`
const imgFile = props.image ? `/src/assets/img/${props.image}` : "";

const name = ref(props.nome);
const startDate = ref(props.dataInicio);
const finalDate = ref(props.dataFim);
const turmaImage = ref(props.image);

async function updateTurma() {
  const updatePayload = {
    name: name.value,
    startDate: startDate.value,
    finalDate: finalDate.value,
    imgClass: turmaImage.value,
  };
  console.log(updatePayload.name);
  try {
    // Send the PUT request with a timeout of 10 seconds
    const { data } = await axiosClient.put(
      `/class/${props.idTurma}/edit`,
      updatePayload,
      {
        headers: {
          Authorization: `Bearer ${props.token}`,
        },
        timeout: 10000, // Timeout set to 10 seconds
      }
    );

    showModal.value = false;
    console.log(data.data);
    // Show success notification
    proxy.$swal.fire({
      icon: "success",
      title: "Turma Editada com sucesso",
      text: data.date,
    });
    emit("CHANGED_TURMAS");
  } catch (error) {
    showModal.value = false;

    // Handle errors based on type
    if (error.code === "ECONNABORTED") {
      // Timeout error
      proxy.$swal.fire({
        icon: "error",
        title: "Erro de Conexão",
        text: "A requisição demorou muito tempo. Tente novamente mais tarde.",
      });
    } else if (error.response) {
      // Server responded with a status other than 2xx
      proxy.$swal.fire({
        icon: "error",
        title: "Erro ao Editar Turma",
        text:
          error.response.data.message ||
          error.message ||
          "Ocorreu um erro desconhecido.",
      });
    } else if (error.request) {
      // No response received from the server
      proxy.$swal.fire({
        icon: "error",
        title: "Erro de Rede",
        text: "Não foi possível se conectar ao servidor. Verifique sua conexão de internet.",
      });
    } else {
      // General error
      proxy.$swal.fire({
        icon: "error",
        title: "Erro ao Editar Turma",
        text: error.message || "Ocorreu um erro inesperado.",
      });
    }
  }
}

async function inactivateTurma() {
  try {
    // Send the DELETE request with a timeout of 10 seconds
    const { data } = await axiosClient.delete(
      `/class/delete/${props.idTurma}`,
      {
        headers: {
          Authorization: `Bearer ${props.token}`,
        },
        timeout: 10000, // Timeout set to 10 seconds
      }
    );

    showModal.value = false;
    // Show success notification
    proxy.$swal.fire({
      icon: "success",
      title: "Turma Inativada com sucesso",
      text: data,
    });
    emit("CHANGED_TURMAS");
  } catch (error) {
    showModal.value = false;

    // Handle errors based on type
    if (error.code === "ECONNABORTED") {
      // Timeout error
      proxy.$swal.fire({
        icon: "error",
        title: "Erro de Conexão",
        text: "A requisição demorou muito tempo. Tente novamente mais tarde.",
      });
    } else if (error.response) {
      // Server responded with a status other than 2xx
      proxy.$swal.fire({
        icon: "error",
        title: "Erro ao Inativar Turma",
        text:
          error.response.data.message ||
          error.message ||
          "Ocorreu um erro desconhecido.",
      });
    } else if (error.request) {
      // No response received from the server
      proxy.$swal.fire({
        icon: "error",
        title: "Erro de Rede",
        text: "Não foi possível se conectar ao servidor. Verifique sua conexão de internet.",
      });
    } else {
      // General error
      proxy.$swal.fire({
        icon: "error",
        title: "Erro ao Inativar Turma",
        text: error.message || "Ocorreu um erro inesperado.",
      });
    }
  }
}
</script>

<style scoped>
.card-body {
  padding: 0.8px 1rem 1.2rem 0.3rem !important;
}
.card-header {
  border-bottom: none;
  font-size: 1.5rem;
  font-weight: 600;
}
.turma-card {
  width: 20rem;
}

.turma-card:hover {
  cursor: pointer;
  opacity: 80%;
}
@media (max-width: 576px) {
  .turma-card {
    width: 15rem;
  }
}
</style>
