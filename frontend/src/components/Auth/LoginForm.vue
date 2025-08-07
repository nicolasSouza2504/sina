<template>
  <div
    class="d-flex align-items-center justify-content-center flex-column container-form"
  >
    <form
      class="form-login d-flex align-items-center flex-column justify-content-center"
    >
      <img class="img-logo-senai" src="@/assets/img/senai-icon.png" />
      <div>
        <button type="button" class="google-login-btn">
          <img class="google-icon" src="@/assets/img/google-icon.png" />
          Entrar com o Google
        </button>
      </div>
      <div class="mt-5 mb-3 w-100">
        <input
          class="form-control input-form"
          type="text"
          placeholder="Identificação de usuário"
          v-model="email"
        />
      </div>
      <div class="w-100 mb-5">
        <input
          class="form-control input-form"
          type="password"
          placeholder="Senha de acesso"
          v-model="password"
        />
      </div>
      <div class="container-btn-acess w-100">
        <button type="button" v-on:click="logingApp" class="btn-acesso">
          Acessar
        </button>
      </div>
      <div class="mt-4">
        <a class="esqueceu-link">Esqueceu o seu usuario ou senha?</a>
      </div>
    </form>
  </div>
</template>

<script setup>
import axiosClient from "@/axiosClient";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ref, getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();
const router = useRouter(); // Importar o roteador para fazer navegação
const store = useStore();
const email = ref("");
const password = ref("");

function logingApp() {
  axiosClient
    .post("/auth/login", {
      email: email.value,
      password: password.value,
    })
    .then(({ data }) => {
      console.log(data);
      store.dispatch("saveToken", data.data.token);
      console.log(store.getters.getToken);

      let timerInterval;
      proxy.$swal
        .fire({
          title: "Auto close alert!",
          html: "I will close in <b></b> milliseconds.",
          timer: 2000,
          timerProgressBar: true,
          didOpen: () => {
            proxy.$swal.showLoading();
            const timer = proxy.$swal.getPopup().querySelector("b");
            timerInterval = setInterval(() => {
              timer.textContent = `${proxy.$swal.getTimerLeft()}`;
            }, 100);
          },
          willClose: () => {
            clearInterval(timerInterval);
          },
        })
        .then((result) => {
          /* Read more about handling dismissals below */
          if (result.dismiss === proxy.$swal.DismissReason.timer) {
            console.log("I was closed by the timer");
            router.push("/home"); // Redireciona para a rota /home
          }
        });
    })
    .catch((error) => {
      proxy.$swal.fire({
        icon: "error",
        title: "Oops",
        text: error.message,
      });

      console.log(error);
    });
}
</script>

<style scoped>
.container-form {
  width: 50%;
}

.form-login {
  border-radius: 8px;
  background-color: rgba(0, 92, 170, 0.4);
  padding: 3rem 8rem 6rem 8rem;
}

.img-logo-senai {
  margin: 1rem auto 4rem;
}

.google-login-btn {
  color: #bcbcbc;
  border-radius: 4px;
  border: 1px solid black;
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 3rem;
  background-color: #ffffff;

  padding: 0.5rem 3rem 0.5rem 1rem;
}
.google-icon {
  width: 2rem;
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
.esqueceu-link {
  color: white;
  text-decoration: none;
  width: 100%;
  font-size: 19px;
  cursor: pointer;
}
.esqueceu-link:hover {
  color: black;
  text-decoration: underline;
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

  .form-login {
    border-radius: 8px;
    padding: 1.5rem 5rem 4rem 5rem;
  }

  .img-logo-senai {
    margin: 1rem auto 2rem;
  }

  .google-login-btn {
    padding: 0.5rem 1.8rem 0.5rem 1rem;
  }
  .google-icon {
    width: 1.6rem;
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
  .esqueceu-link {
    color: white;
    text-decoration: none;
    width: 100%;
    font-size: 19px;
    cursor: pointer;
  }
}

@media (max-width: 680px) {
  .container-form {
    width: 100%;
  }

  .google-login-btn {
    padding: 0.5rem 1rem 0.5rem 1rem;
  }
}
@media (max-width: 430px) {
  .container-form {
    margin: 0 auto;
    height: auto;
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
