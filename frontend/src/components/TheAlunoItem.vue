<template>
  <section class="border border-3 rounded d-flex py-2 bg-body-tertiary">
    <div>
      <label class="fs-2 fw-bolder" for="nome"> Aluno:</label>
      <p id="nome">{{ refName }}</p>
    </div>
    <div>
      <label class="fs-2 fw-bolder" for="turma"> Turma:</label>
      <p>{{ turma }}</p>
    </div>
  </section>
</template>

<script setup>
defineProps({
  id: Number,
  refName: String,
  turma: String,
});
</script>

<style scoped>
section {
  padding-left: 5rem;
  width: 34rem;
  gap: 5rem;
}
section > div > label {
  font-size: 2rem;
}
section > div > p {
  font-size: 1.5rem;
  text-align: center;
}

@media (max-width: 1200px) {
  section > div > label {
    font-size: 1.5rem;
  }
  section > div > p {
    font-size: 1rem;
  }
  section {
    max-width: 80%;
  }
  section {
    padding-left: 0.5rem;
    justify-content: center;
    flex-wrap: wrap;
    gap: 1rem;
  }
}
</style>
