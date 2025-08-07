<template>
  <form enctype="multipart/form-data" @submit.prevent="submitForm">
    <div>
      <label for="primeiroNome">Primeiro nome:</label>
      <input id="primeiroNome" type="text" v-model="nome" />
    </div>
    <div>
      <label for="sobreNome">Sobrenome</label>
      <input id="sobreNome" type="text" v-model="sNome" />
    </div>
    <div>
      <label for="turmaId">Turma Id</label>
      <input id="turmaId" type="number" v-model="turmaId" />
    </div>
    <div>
      <label for="files">Avatar:</label>
      <input id="files" type="file" ref="avatar" @change="handleFileUpload" />
    </div>
    <div>
      <button class="btn btn-success" type="submit">Enviar</button>
    </div>
  </form>

  <div v-if="avatarUrl">
    <img :src="avatarUrl" alt="Avatar Preview" style="max-width: 200px" />
  </div>
</template>

<script setup>
import axiosClient from "@/axiosClient";
import { ref } from "vue";

let nome = ref("");
let sNome = ref("");
let turmaId = ref("");
let avatar = ref(null);
let avatarUrl = ref(null); // Para exibir a URL da imagem

const handleFileUpload = () => {
  const file = avatar.value.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      avatarUrl.value = e.target.result; // Atualiza o src da imagem para exibição
    };
    reader.readAsDataURL(file); // Converte o arquivo em uma URL para ser exibida
  }
};

const submitForm = async () => {
  const formData = new FormData();
  formData.append("primeiroNome", nome.value);
  formData.append("sobreNome", sNome.value);
  formData.append("turmaId", turmaId.value);

  // Verifica se a imagem foi selecionada e adiciona ao formData
  if (avatar.value.files[0]) {
    formData.append("avatar", avatar.value.files[0]);
  }

  try {
    await axiosClient.post("/aluno/add", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    alert("Aluno cadastrado com sucesso!");
  } catch (error) {
    console.error("Erro ao cadastrar aluno:", error);
  }
};
</script>
