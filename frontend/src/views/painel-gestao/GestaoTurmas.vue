<template>
  <ContentContainerMain id="Main-Turmas">
    <NavBarAside
      locate="ADM"
      :panel-name="'Gestão de Trumas'"
      @HIDE_NAV="hideSideBar()"
    ></NavBarAside>
    <div
      class="w-100 h-100 content-manage"
      :class="{
        'when-nav-active': !hidedSide,
        'when-nav-inactive': hidedSide,
      }"
    >
      <h2 class="fw-bold mt-5 fs-1 text-center">Gestão de Turmas</h2>
      <div
        class="d-flex ms-3 ps-2 mt-5 col-12 col-xxl-8 col-xl-8 col-lg-8 col-md-12 col-sm-12 filter-cont"
      >
        <TurmasFilter></TurmasFilter>
        <button @click="showModal = true" class="btn btn-outline-success">
          Adicionar Turma
        </button>
      </div>

      <div
        id="to_be_card"
        class="my-5 pt-5 d-flex flex-wrap justify-content-center gap-5 flex-wrap"
      >
        <TurmaCard
          @CHANGED_TURMAS="getTurmas()"
          v-for="turma of turmas"
          :key="turma.id"
          :idTurma="turma.Id"
          :nome="turma.nome"
          :image="turma.imgClass"
          :dataInicio="turma.startDate"
          :dataFim="turma.finalDate"
          :token="token"
        ></TurmaCard>
      </div>
    </div>
  </ContentContainerMain>

  <Teleport to="body">
    <!-- use the modal component, pass in the prop -->
    <AddTurmaModal
      :show="showModal"
      @close="closeModal()"
      @ADD_TURMA="addTurma()"
    >
      <template #header>
        <h2 class="text-white fw-bold text-center mb-5">
          Registro de nova Turma
        </h2>
      </template>
      <template #body>
        <div class="px-5">
          <input
            v-model="nomeTurma"
            type="text"
            class="form-control justify-content-center"
            placeholder="Nome da Turma"
            @focus="touchedNome = true"
          />
          <span
            v-if="touchedNome && (!nomeTurma || nomeTurma.trim() === '')"
            class="text-danger"
          >
            O nome da turma é obrigatório.
          </span>
        </div>
        <div class="d-flex gap-3 justify-content-center px-5">
          <div class="d-flex flex-column">
            <label for="dat-init" class="text-white"
              >Data de Inicio Letivo</label
            >
            <input
              type="date"
              id="dat-init"
              class="form-control"
              v-model="dataInit"
              @focus="touchedDataInit = true"
            />
            <!-- Mostrar erro apenas após o campo ser tocado -->
            <span v-if="touchedDataInit && !dataInit" class="text-danger"
              >A data de início é obrigatória.</span
            >
          </div>

          <div class="d-flex flex-column">
            <label for="dat-fim" class="text-white">Data de fim Letivo</label>
            <input
              type="date"
              class="form-control"
              v-model="dataFim"
              @focus="touchedDataFim = true"
            />
            <!-- Mostrar erro apenas após o campo ser tocado -->
            <span v-if="touchedDataFim && !dataFim" class="text-danger"
              >A data de fim é obrigatória.</span
            >
            <span
              v-if="
                touchedDataInit &&
                touchedDataFim &&
                new Date(dataInit) > new Date(dataFim)
              "
              class="text-danger"
            >
              A data de início não pode ser posterior à data de fim.
            </span>
            <span
              v-if="
                touchedDataInit &&
                touchedDataFim &&
                new Date(dataFim) < new Date(dataInit)
              "
              class="text-danger"
            >
              A data de fim não pode ser anterior à data de início.
            </span>
          </div>
        </div>
        <div class="d-flex mb-5 px-5 gap-2">
          <div class="d-flex flex-column">
            <label for="turma-bg" class="text-white">Imagem </label>
            <select
              name="turma-bg"
              class="form-select turma-select"
              id="turma-bg"
              v-model="turmaImg"
            >
              <option selected value="">Imagem da Turma</option>
              <option value="Turma1IMG.png">Turma Img 1</option>
              <option value="TrumaIMG2.png">Turma Img 2</option>
              <option value="TurmaIMG3.png">Turma Img 3</option>
              <option value="TurmaIMG4.png">Turma Img 4</option>
            </select>
          </div>

          <img
            class="rounded w-50 mx-auto"
            v-if="turmaImg"
            :src="imgFile"
            alt="Imagem Selecionada"
          />
        </div>
      </template>
    </AddTurmaModal>
  </Teleport>

  <Teleport to="body">
    <!-- use the modal component, pass in the prop -->
    <ErroModal :show="errorModal" @close="errorModal = false">
      <template #header>
        <h3 class="text-danger">Ooops</h3>
      </template>
      <template #body>
        <p>{{ errorMessage }}</p>
      </template>
    </ErroModal>
  </Teleport>
</template>

<script setup>
import ContentContainerMain from "@/components/ContentContainerMain.vue";
import NavBarAside from "@/components/NavBarAside.vue";
import TurmaCard from "@/components/cards/TurmaCard.vue";
import TurmasFilter from "@/components/PainelGestaoComponents/TurmasFilter.vue";
import AddTurmaModal from "@/components/modals/AddTurmaModal.vue";
import ErroModal from "@/components/AlertModals/ErroModal.vue";
import { useStore } from "vuex";
import { ref, onMounted, watch, getCurrentInstance } from "vue";
import axiosClient from "@/axiosClient";

const hidedSide = ref(false); // Sidebar initially visible

function hideSideBar() {
  hidedSide.value = !hidedSide.value; // Toggle the sidebar
}

const { proxy } = getCurrentInstance();

const Toast = proxy.$swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = proxy.$swal.stopTimer;
    toast.onmouseleave = proxy.$swal.resumeTimer;
  },
});

const showModal = ref(false);
const errorModal = ref(false);

const store = useStore();
const token = ref("");
const turmas = ref([]);
onMounted(() => {
  token.value = store.getters.getToken;
  getTurmas();
});

function getTurmas() {
  axiosClient
    .get("/class/all")
    .then(({ data }) => {
      turmas.value = data.data;
    })
    .catch((error) => {
      proxy.$swal.fire({
        icon: "error",
        title: "Erro ao Buscar Turmas!",
        text: error.message,
      });
      console.log(error);
    });
}
const nomeTurma = ref("");
const dataInit = ref("");
const dataFim = ref("");
const turmaImg = ref("");
const imgFile = ref("");

watch(turmaImg, (newValue) => {
  imgFile.value = newValue ? `/src/assets/img/${newValue}` : "";
});

// Variáveis para controlar se o campo foi tocado
const touchedNome = ref(false);
const touchedDataInit = ref(false);
const touchedDataFim = ref(false);

const errorMessage = ref("");

function closeModal() {
  showModal.value = false;
  cleanInputs();
}

function cleanInputs() {
  nomeTurma.value = "";
  dataInit.value = "";
  dataFim.value = "";
  turmaImg.value = "";
  touchedNome.value = false;
  touchedDataInit.value = false;
  touchedDataFim.value = false;
}

async function addTurma() {
  // Perform validation
  const validation = validateForm();
  if (!validation.isValid) {
    // Exibe a mensagem de erro se a validação falhar
    errorModal.value = true;
    errorMessage.value = validation.message;
    return; // Exit the function early if validation fails
  }

  // Prepare payload
  const payload = {
    name: nomeTurma.value,
    startDate: dataInit.value,
    finalDate: dataFim.value,
    imgClass: turmaImg.value,
  };

  try {
    // Send the POST request
    const response = await axiosClient.post("/class/add", payload, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
      timeout: 2000,
    });

    // Handle success response
    console.log("Turma adicionada com sucesso:", response.data);
    showModal.value = false;
    Toast.fire({
      icon: "success", // Corrected icon name
      title: "Turma adicionada com sucesso!",
    });
    getTurmas();
  } catch (error) {
    // Handle error response
    console.error("Erro ao adicionar turma:", error);
    showModal.value = false;
    cleanInputs();
    Toast.fire({
      icon: "error", // Corrected icon name
      title: "Erro ao Adicionar Turma",
      text: error.message || "Algo deu errado", // Ensure error message is displayed
    });
  }
}

function validateForm() {
  // Validação do nome
  if (!nomeTurma.value || nomeTurma.value.trim() === "") {
    return { isValid: false, message: "O nome da turma é obrigatório." };
  }

  // Validação da data de início
  if (!dataInit.value) {
    return { isValid: false, message: "A data de início é obrigatória." };
  }

  // Validação da data de fim
  if (!dataFim.value) {
    return { isValid: false, message: "A data de fim é obrigatória." };
  }

  // Validação da data de início não ser posterior à data de fim
  if (new Date(dataInit.value) > new Date(dataFim.value)) {
    return {
      isValid: false,
      message: "A data de início não pode ser posterior à data de fim.",
    };
  }

  // Validação da data de fim não ser anterior à data de início
  if (new Date(dataFim.value) < new Date(dataInit.value)) {
    return {
      isValid: false,
      message: "A data de fim não pode ser anterior à data de início.",
    };
  }

  // Se todas as validações passarem
  return { isValid: true, message: null };
}
</script>

<style scoped>
.when-nav-active {
  margin-left: 20%;
}
.when-nav-inactive {
  margin-left: 10%;
}

.turma-select {
  width: 100%;
}

/* SweetAlert2 */
.swal2-container {
  z-index: 9999 !important; /* Garante que o SweetAlert fique acima do modal */
}

/* Backdrop do SweetAlert2 */
.swal2-backdrop {
  z-index: 9998 !important; /* Ajuste para garantir que fique abaixo do popup */
}

@media (max-width: 900px) {
  .filter-cont {
    flex-wrap: wrap;
  }

  .when-nav-active {
    margin-left: 20%;
  }
  .when-nav-inactive {
    margin-left: 15%;
  }
  .content-manage {
    width: 60% !important;
    margin: 0 auto !important;
  }
}
</style>
