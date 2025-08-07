<template>
  <Transition name="modal">
    <div v-if="show" class="modal-mask">
      <div class="modal-container">
        <div class="modal-header d-flex justify-content-center">
          <slot name="header"></slot>
        </div>

        <div class="modal-body d-flex justify-content-center flex-column gap-5">
          <slot name="body"></slot>
        </div>

        <div class="modal-footer d-flex justify-content-center gap-5">
          <button
            class="btn btn-success text-dark fw-bold px-3 py-2"
            @click="$emit('ADD_TURMA')"
          >
            Adicionar
          </button>
          <button
            class="btn btn-warning text-dark fw-bold px-3 py-2"
            @click="$emit('close')"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
  },
  isError: {
    type: Boolean,
    default: false,
  },
});
</script>

<style>
.modal-mask {
  position: fixed;
  z-index: 9994 !important; /* Essa parte pode ser ajustada */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  transition: opacity 0.3s ease;
  backdrop-filter: blur(1px);
}

.modal-container {
  width: 500px;
  margin: auto;
  padding: 20px 30px;
  background-color: #005caa;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}

.modal-header h3 {
  margin-top: 0;
  color: #ff0000;
}

.modal-body {
  margin: 20px 0;
}

.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
