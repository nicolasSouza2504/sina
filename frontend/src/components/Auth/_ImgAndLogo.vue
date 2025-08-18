<template>
  <div
    class="d-flex align-items-center flex-column h-100 mt-5 gap-5 container-header-img"
  >
    <p class="header-ava">Ambiente Virtual de aprendizagem</p>
    <img :src="imageSrc" alt="alunos do senai" class="img-alunos" />
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  img: {
    type: String,
    default: "login-people-image.png",
  },
});

const imageSrc = computed(() => {
  return `/../src/assets/img/${props.img}`;
});
</script>
<style scoped>
.container-header-img {
  width: 50%;
  justify-content: start;
}

.header-ava {
  font-weight: bold;
  text-align: center;
  width: 75%;
  font-size: 3rem;
  text-shadow: 3px 3px #8d8d8d;
  color: rgba(255, 255, 255, 0.88);
}

.img-alunos {
  margin-top: 2.6rem;
  width: 40rem;
}

@media (max-width: 980px) {
  .header-ava {
    font-size: 3.5rem;
    margin-bottom: 4rem;
  }

  .img-alunos {
    height: auto;
    width: 30rem;
  }
  .container-header-img {
    width: 40%;
    height: 100%;
    justify-content: start;
  }
}

@media (max-width: 680px) {
  .img-alunos {
    display: none;
  }

  .container-form {
    width: 100%;
  }

  .container-general {
    flex-direction: column;
  }
  .container-header-img {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 430px) {
  .container-general {
    margin-bottom: 5rem;
  }
  .img-alunos {
    display: none;
  }
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
  .container-header-img {
    margin-top: 0.5rem !important;
  }
}
</style>
