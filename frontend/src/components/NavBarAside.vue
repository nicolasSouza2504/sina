<template>
  <div
    :class="{
      'hide-nav': hidedSide, // Aplica 'hide-nav' quando hidedSide é verdadeiro
      'unhide-nav': !hidedSide, // Aplica 'unhide-nav' quando hidedSide é falso
    }"
    id="nav-bar"
    class="d-flex flex-column flex-shrink-0 p-3 text-white senai-color-blue"
  >
    <div class="d-flex justify-content-center">
      <h4
        class="text-center mx-auto my-0 p-0 fw-bolder"
        :class="{
          'hide-buttons': hidedSide,
        }"
      >
        {{ props.panelName }}
      </h4>
      <button @click="hideSideBar()" class="botao-collapse">
        <i class="bi bi-box-arrow-in-right" v-if="hidedSide"></i>
        <i class="bi bi-box-arrow-in-left" v-if="!hidedSide"></i>
      </button>
    </div>

    <hr />
    <ul class="nav nav-pills flex-column mb-auto justify-content-center">
      <li
        class="nav-item list-item"
        :class="{
          'list-item-selected': props.locate === 'INICIO',
          'hide-buttons': hidedSide,
          'unhide-buttons': !hidedSide,
        }"
      >
        <router-link
          class="nav-link active my-0 py-0"
          :to="{ name: 'home' }"
          aria-current="page"
        >
          <a class="nav-link fw-bold fs-5 text-white">Inicio </a>
        </router-link>
      </li>
      <li
        class="nav-item list-item"
        :class="{
          'list-item-selected': props.locate === 'RANK_EAD',
          'hide-buttons': hidedSide,
          'unhide-buttons': !hidedSide,
        }"
      >
        <router-link
          class="nav-link active my-0 py-0"
          :to="{ name: 'home' }"
          aria-current="page"
        >
          <a class="nav-link fw-bold fs-5 text-white">Rank Ead </a>
        </router-link>
      </li>
      <li
        class="dropdown-btn list-item"
        :class="{
          'list-item-selected': props.locate === 'ADM',
          'hide-buttons': hidedSide,
          'unhide-buttons': !hidedSide,
        }"
      >
        <button
          class="fw-bold fs-5 text-white btn btn-toggle align-items-center rounded collapsed text-white"
          data-bs-toggle="collapse"
          data-bs-target="#dashboard-collapse-pta"
          aria-expanded="false"
        >
          Administração
        </button>
        <div class="collapse" id="dashboard-collapse-pta" style="">
          <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small ms-4">
            <li class="mb-2">
              <router-link class="text-decoration-none" :to="{ name: 'managmentTurmas' }">
                <a class="link-dark text-decoration-none fw-bold">Turmas</a>
              </router-link>
            </li>
            <!-- <li class="mb-2">
              <router-link
                class="text-decoration-none"
                :to="{ name: 'managmentTurmas' }"
              >
                <a class="link-dark text-decoration-none fw-bold">Cursos</a>
              </router-link>
            </li> -->
            <li class="mb-2">
              <a href="#" class="link-dark text-decoration-none fw-bold">Alunos</a>
            </li>
            <li class="mb-2">
              <a href="#" class="link-dark text-decoration-none fw-bold">Professores</a>
            </li>
          </ul>
        </div>
      </li>
      <li
        class="dropdown-btn list-item"
        :class="{
          'list-item-selected': props.locate === 'ATIVIDADES',
          'hide-buttons': hidedSide,
          'unhide-buttons': !hidedSide,
        }"
      >
        <button
          class="fw-bold fs-5 text-white btn btn-toggle align-items-center rounded collapsed text-white"
          data-bs-toggle="collapse"
          data-bs-target="#dashboard-collapse-atv"
          aria-expanded="false"
        >
          Atividades
        </button>
        <div class="collapse" id="dashboard-collapse-atv" style="">
          <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small ms-4">
            <li class="mb-2">
              <a href="#" class="link-dark text-decoration-none fw-bold">EAD</a>
            </li>
            <li class="mb-2">
              <a href="#" class="link-dark text-decoration-none fw-bold"
                >Trilhas de Conhecimento</a
              >
            </li>
            <li class="mb-2">
              <a href="#" class="link-dark text-decoration-none fw-bold">Atividades</a>
            </li>
          </ul>
        </div>
      </li>
    </ul>
    <hr />
    <div v-if="!isLogged">
      <router-link
        v-if="!isLogged"
        class="btn btn-secondary w-100"
        :to="{ name: 'login' }"
        v-show="hidedSide == false"
      >
        Login
      </router-link>

      <router-link
        v-if="!isLogged"
        class="text-white text-decoration-none fs-2"
        :to="{ name: 'login' }"
        v-show="hidedSide == true"
      >
        <i class="bi bi-person-up"></i>
      </router-link>
    </div>

    <div class="dropdown" v-if="isLogged">
      <a
        href="#"
        class="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
        id="dropdownUser1"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <img
          src="https://github.com/mdo.png"
          alt=""
          width="32"
          height="32"
          class="rounded-circle me-2"
        />
        <strong>mdo</strong>
      </a>
      <ul
        class="dropdown-menu dropdown-menu-dark text-small shadow"
        aria-labelledby="dropdownUser1"
      >
        <li><a class="dropdown-item" href="#">New project...</a></li>
        <li><a class="dropdown-item" href="#">Settings</a></li>
        <li><a class="dropdown-item" href="#">Profile</a></li>
        <li><hr class="dropdown-divider" /></li>
        <li>
          <a class="dropdown-item" @click="logoutUser()">Sign out</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { jwtDecode } from "jwt-decode";
import { onMounted, ref, defineEmits } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
const emit = defineEmits();
const store = useStore();
const name = ref();
const isLogged = ref(false);

const router = useRouter();

// Define props with corrected default
const props = defineProps({
  panelName: {
    type: String,
    default: "Home", // Corrected typo here
  },
  locate: {
    type: String,
    default: "INICIO",
  },
});

const user = ref({
  id: null,
  email: "",
  role: "",
});

const hidedSide = ref(false); // Sidebar initially visible

// Toggle sidebar visibility
function hideSideBar() {
  console.log("Hiding sidebar");
  hidedSide.value = !hidedSide.value; // Toggle the sidebar
  emit("HIDE_NAV");
}

function logoutUser() {
  // Trigger Vuex action to remove token
  store.dispatch("removeToken");

  // Reset local state
  isLogged.value = false;
  user.value = { id: null, email: "", role: "" };
  name.value = null;

  // Redirect to the home route
  router.push({ name: "home" });
}
onMounted(() => {
  const token = store.getters.getToken;
  if (token) {
    isLogged.value = true;

    // Decodificar o token
    try {
      const decoded = jwtDecode(token);
      isLogged.value = true;

      // Definir parâmetros do usuário
      user.value.id = decoded.id;
      user.value.email = decoded.sub;
      user.value.role = decoded.role;
      name.value = user.value.email;
      console.log(decoded);
      // Se houver um campo "name" no token, definindo-o também
      name.value = decoded.sub || "Usuário Desconhecido";
    } catch (error) {
      console.error("Erro ao decodificar o token:", error);
    }
  }
});
</script>

<style scoped>
#nav-bar {
  width: 360px; /* Adjust width of sidebar */
  position: fixed; /* Fix the sidebar to the left */
  height: 100vh;
  top: 0;
  left: 0;
  z-index: 9999; /* Keep it on top */
  height: 100%; /* Make the sidebar full-height */
  overflow-y: auto; /* Allow scrolling if content overflows */
  background-color: #005caa; /* Sidebar color */
  transition: transform 0.3s ease-in-out; /* Smooth transition for hiding/showing */
}

.botao-collapse {
  background-color: transparent;
  border: none;
  font-size: 2rem;
  color: white;
}
.hide-nav {
  width: 4% !important; /* Set the width to 10% */
  transition: width 0.3s ease-in-out; /* Smooth transition for width change */
}
.hide-buttons {
  width: 0; /* Hide buttons by collapsing their width */
  font-size: 0.3rem;
  opacity: 0; /* Hide the buttons with opacity */
  pointer-events: none; /* Prevent interactions when hidden */
  overflow: hidden; /* Hide the content when collapsed */
  transition: width 0.3s ease-in-out, opacity 0.3s ease-in-out; /* Smooth transition for width and opacity */
}

/* Class for showing the buttons */
.unhide-buttons {
  width: 50%; /* Show buttons at full width (adjust to your needs) */
  opacity: 1; /* Fully show the buttons */
  pointer-events: auto; /* Enable interactions */
  transition: width 0.3s ease-in-out, opacity 0.3s ease-in-out; /* Smooth transition for width and opacity */
}
.unhide-nav {
  transition: width 0.3s ease-in-out;
}

.senai-color-blue {
  background-color: #005caa;
}
.nav-link {
  background-color: #005caa !important;
}

.list-item:hover {
  box-shadow: -5px 0px 0px rgb(186, 186, 186);
}
::v-deep .list-item-selected {
  box-shadow: -5px 0px 0px white;
}
.main {
  height: 100vh;
}
.link-dark {
  border: 1px solid transparent;
}
.link-dark:hover {
  border-bottom: 2px solid white;
}
.dropdown-btn {
  padding-left: 18px;
}
@media (max-width: 964px) {
  #nav-bar {
    width: 250px;
  }
  .hide-nav {
    display: none;
  }
  .hide-buttons {
    display: none;
  }
  .unhide-nav {
    display: block;
  }
  .hide-nav {
    width: 10% !important; /* Set the width to 10% */
    transition: width 0.3s ease-in-out; /* Smooth transition for width change */
  }
}

@media (max-width: 576px) {
  /* The base styling for the navbar */
  #nav-bar {
    width: 80%; /* Adjust the width of the navbar to 80% */
    transition: transform 0.3s ease-in-out;
  }

  /* When the navbar is hidden (collapsed), set width to 10% */
  .hide-nav {
    width: 13% !important; /* Set the width to 10% */
    transition: width 0.3s ease-in-out; /* Smooth transition for width change */
  }

  /* Hide the buttons inside the navbar when it's collapsed */
  .hide-buttons {
    display: none;
  }

  /* When the navbar is visible, apply fixed positioning and make sure it overlays everything */
  .unhide-nav {
    position: fixed; /* Fix the navbar in place */
    top: 0; /* Align the navbar to the top */
    left: 0; /* Align it to the left edge */
    width: 100%; /* Keep the navbar width as 80% when visible */
    height: 100vh; /* Make it fill the entire height of the screen */
    z-index: 9999; /* Make sure it's above other content */
    overflow-y: auto; /* Allow vertical scrolling if the content overflows */
  }

  /* Style for the login button when the navbar is hidden (collapsed) */
  .hide-login-btn {
    font-size: 8px;
    text-align: center;
    width: 100%;
  }
}
</style>
