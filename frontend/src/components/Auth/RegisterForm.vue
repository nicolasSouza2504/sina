<template>
  <div
    class="d-flex align-items-center justify-content-center flex-column container-form"
  >
    <form
      class="form-login d-flex align-items-center flex-column justify-content-center"
      enctype="multipart/form-data"
    >
      <img class="img-logo-senai" src="@/assets/img/senai-icon.png" />
      <div class="mt-5 mb-3 w-100">
        <input
          class="form-control input-form"
          type="text"
          placeholder="Nome Completo:"
          v-model="fullName"
        />
      </div>
      <div class="mb-1 w-100">
        <input
          class="form-control input-form"
          type="text"
          placeholder="Email:"
          v-model="email"
        />
        <p class="text-danger" v-if="errorEmail != null">{{ errorEmail }}</p>
      </div>
      <div class="w-100 mb-1">
        <input
          class="form-control input-form"
          type="text"
          placeholder="CPF"
          v-model="cpf"
        />
        <p class="text-danger" v-if="errorCpf != null">{{ errorCpf }}</p>
      </div>
      <div class="w-100 mb-3" v-if="registrationType <= 1">
        <select
          class="form-select input-form"
          placeholder="Turma"
          v-model="turma"
        >
          <option selected value="">Turma:</option>
          <option value="1">ADS-2022</option>
          <option value="2">ADS-2023</option>
          <option value="3">ADS-2024</option>
          <option value="4">ADS-2025</option>
        </select>
      </div>
      <div class="w-100 mb-1">
        <input
          class="form-control input-form"
          type="password"
          placeholder="Senha"
          v-model="password"
        />
        <p class="text-danger" v-if="errorPassword != null">
          {{ errorPassword }}
        </p>
      </div>
      <div class="w-100 mb-1">
        <input
          class="form-control input-form"
          type="password"
          placeholder="Cornfirme sua senha:"
          v-model="passwordConfirm"
        />
        <p class="text-danger" v-if="errorConfirmPwd != null">
          {{ errorConfirmPwd }}
        </p>
      </div>

      <div class="file-upload-container mb-3">
        <div class="d-flex w-100">
          <label for="fileInput" class="file-upload-label">
            <span class="file-upload-icon">
              <i class="bi bi-paperclip"></i>
            </span>
            <span>{{ imageLabel }}</span>
          </label>

          <input
            id="fileInput"
            type="file"
            accept=".jpg, .png"
            @change="previewImage"
            class="file-input"
          />

          <!-- Image Preview -->
          <img
            v-if="imageUrl"
            :src="imageUrl"
            alt="Avatar"
            class="avatar-preview mt-3 mb-2 ms-2"
          />
        </div>

        <!-- File Name Display - Initially hidden, shown only when a file is selected -->
        <div v-if="fileName" class="file-name-display mt-2">
          {{ fileName }}
        </div>
      </div>
      <div class="container-btn-acess w-100">
        <button type="button" v-on:click="register" class="btn-acesso">
          Registrar
        </button>
      </div>
    </form>
  </div>

  <Teleport to="body">
    <AlertModal
      :isError="typeOfAlert"
      :show="showModal"
      @close="showModal = false"
    >
      <template #header>
        <h3 class="text-danger">{{ errorHeader }}</h3>
      </template>
      <template #body>
        <p>{{ errorMessage }}</p>
      </template>
    </AlertModal>
  </Teleport>
</template>

<script setup>
import axiosClient from "@/axiosClient";
import { useStore } from "vuex";
import { ref, onMounted } from "vue";
import AlertModal from "../AlertModal.vue";

const props = defineProps({
  registrationType: {
    type: Number,
    default: 2,
  },
});

const store = useStore();
const token = ref("");

onMounted(() => {
  token.value = store.getters.getToken;
});

const fullName = ref("");
const cpf = ref("");
const email = ref("");
const password = ref("");
const passwordConfirm = ref("");
const turma = ref("");
const imageLabel = ref("Anexar arquivo");
const imageUrl = ref("");
const selectedImage = ref(null);

const errorEmail = ref("");
const errorPassword = ref("");
const errorConfirmPwd = ref("");
const errorCpf = ref("");
const errorTurma = ref("");
const fileName = ref("");

const showModal = ref(false);
const errorHeader = ref("");
const errorMessage = ref("");
const typeOfAlert = ref(false);

function previewImage(event) {
  const file = event.target.files[0];
  selectedImage.value = file;
  if (file) {
    fileName.value = file.name;
    imageLabel.value = "Arquivo Selecionado";

    const reader = new FileReader();
    reader.onload = (e) => {
      imageUrl.value = e.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    fileName.value = "";
    imageUrl.value = null;
    imageLabel.value = "Anexar arquivo";
  }
}

function register() {
  if (validateForm()) {
    const roles = {
      2: "ADMIN",
      1: "PROFESSOR",
      0: "USER",
    };
    const role = roles[props.registrationType];
    const endpoint = `/user/add/${role}`;

    const formData = new FormData();
    const user = JSON.stringify({
      name: fullName.value,
      email: email.value,
      cpf: cpf.value,
      password: password.value,
      passwordConfirm: passwordConfirm.value,
      ...(props.registrationType !== 2 && { turma: turma.value }),
    });

    formData.append("user", user);
    if (selectedImage.value) {
      formData.append("image", selectedImage.value);
    }

    axiosClient
      .post(endpoint, formData, {
        headers: {
          Authorization: `Bearer ${token.value}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then(({ data }) => {
        console.log(data);
        typeOfAlert.value = true;
        errorHeader.value = "Sucesso!";
        errorMessage.value = data.message;
        showModal.value = true;
        resetForm();
      })
      .catch((error) => {
        console.log("Error");
        console.log(error);
        errorHeader.value = error.name;
        errorMessage.value = error.message;
        showModal.value = true;
        typeOfAlert.value = true;
      });
  }
}

function validateForm() {
  errorEmail.value = validateEmail(email.value) ? "" : "E-mail inválido.";
  errorPassword.value = validatePassword(password.value)
    ? ""
    : "Senha inválida. Use pelo menos 4 caracteres!";
  errorCpf.value = validateCpf(cpf.value)
    ? ""
    : "CPF inválido. Use o formato 123.456.789-00.";
  errorConfirmPwd.value = validateConfirmPassword(
    password.value,
    passwordConfirm.value
  )
    ? ""
    : "A confirmação de senha não coincide.";
  errorTurma.value = validateTurma(turma.value) ? "" : "Turma é obrigatória.";

  return !(
    errorEmail.value ||
    errorPassword.value ||
    errorCpf.value ||
    errorConfirmPwd.value ||
    errorTurma.value
  );
}

function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

function validatePassword(password) {
  return password.length >= 4;
}

function validateCpf(cpf) {
  const cpfRegex = /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/;
  return cpfRegex.test(cpf);
}

function validateConfirmPassword(password, confirmPassword) {
  return password === confirmPassword;
}

function validateTurma(turma) {
  return props.registrationType < 2 ? turma !== "" : true;
}

function resetForm() {
  fullName.value = "";
  cpf.value = "";
  email.value = "";
  password.value = "";
  passwordConfirm.value = "";
  turma.value = "";
  imageLabel.value = "Anexar arquivo";
  imageUrl.value = "";
  selectedImage.value = null;
  fileName.value = "";

  // Reset error messages
  errorEmail.value = "";
  errorPassword.value = "";
  errorConfirmPwd.value = "";
  errorCpf.value = "";
  errorTurma.value = "";
}
</script>

<style scoped>
.container-form {
  width: 50%;
}

.form-login {
  border-radius: 8px;
  background-color: rgba(0, 92, 170, 0.4);
  padding: 3rem 4rem 3rem 4rem;
}

.img-logo-senai {
  margin: 1rem auto 1rem;
}
.input-form {
  padding: 0.6rem 0.5rem;
  border-radius: 4px !important;
  border: 1px solid black;
}
.input-form::placeholder {
  color: #bcbcbc;
}
.btn-acesso {
  width: 100%;
  background-color: #005caa;
  border-radius: 4px;
  border: 1px solid #005caa;
  padding: 1rem;
  color: white;
  font-weight: bold;
  font-size: 24px;
}
.btn-acesso:hover {
  border: 1px solid white;
}
.file-upload-container {
  display: inline-block;
  position: relative;
}

.file-upload-label {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  background-color: #88d8f7;
  color: #3b2a70;
  border: 2px solid #000;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
}

.file-upload-icon {
  margin-right: 8px;
  font-size: 18px;
}

.file-input {
  display: none;
}

.avatar-preview {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.file-name-display {
  font-size: 14px;
  color: #3b2a70;
}

@media (max-width: 1200px) {
  .container-form {
    margin-right: 3rem;
  }

  .form-login {
    border-radius: 8px;
    padding: 1.5rem 5rem 4rem 5rem;
  }
}

@media (max-width: 1020px) {
  .google-login-btn {
    font-size: 1rem;
    padding: 0.5rem 1.5rem 0.5rem;
  }
  .google-icon {
    width: 2rem;
  }
}

@media (max-width: 980px) {
  .header-ava {
    font-size: 3.5rem;
  }
  .container-form {
    height: 100vh;
  }

  .form-login {
    border-radius: 8px;
    padding: 1.5rem 3rem 4rem 3rem;
  }

  .img-logo-senai {
    margin: 1rem 2rem 1rem;
  }

  .input-form {
    padding: 0.6rem 0.5rem;
    border-radius: 4px !important;
    border: 1px solid black;
  }
  .input-form::placeholder {
    color: #bcbcbc;
  }
  .btn-acesso {
    font-size: 24px;
  }
}

@media (max-width: 680px) {
  .container-form {
    height: 30%;
    width: 100%;
  }
}
@media (max-width: 430px) {
  .container-form {
    height: 30%;
    margin: 0 auto;
  }
  .form-login {
    padding: 1rem 1rem;
  }
  .header-ava {
    font-size: 2.2rem !important;
  }
  .google-login-btn {
    gap: 1rem;
    padding: 0.5rem 3rem;
  }
}
</style>
