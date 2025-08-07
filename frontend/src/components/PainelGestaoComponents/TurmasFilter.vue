<template>
  <div id="main" class="d-flex align-items-center gap-3">
    <div class="input-group">
      <span class="input-group-text" id="addon-wrapping"
        ><i class="bi bi-book"></i>
      </span>
      <select
        class="form-select"
        id="inputGroupSelect03"
        aria-label="Example select with button addon"
      >
        <option selected>Escolha o Curso</option>
        <option v-for="curso of cursos" v-bind:key="curso.id" value="{{ curso.id }}">
          {{ curso.nome }}
        </option>
      </select>
    </div>

    <div class="input-group">
      <span class="input-group-text" id="addon-wrapping"
        ><i class="bi bi-calendar4-week"></i
      ></span>

      <select
        class="form-select"
        id="inputGroupSelect03"
        aria-label="Example select with button addon"
      >
        <option selected>Escolha o Ano</option>
        <option v-for="ano of anos" v-bind:key="ano" value="{{ ano }}">
          {{ ano }}
        </option>
      </select>
    </div>

    <div class="form-check w-100">
      <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked" />
      <label class="form-check-label" for="flexCheckChecked">
        Apenas Turmas Ativas
      </label>
    </div>
  </div>
</template>

<script setup>
let cursos = [
  { id: 1, nome: "ADS", ano: 2023, Semestres: 6, periodos: 3 },
  { id: 2, nome: "Mecatronica", ano: 2024, Semestres: 8, periodos: 4 },
];

let anos = cursos.map((curso) => {
  return curso.ano;
});
</script>

<style scoped>
div {
  font-family: inter, "sans-serif";
}

@media (max-width: 900px) {
  #main {
    flex-wrap: wrap;
  }
}
</style>
