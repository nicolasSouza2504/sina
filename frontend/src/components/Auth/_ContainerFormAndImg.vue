<template>
  <div class="w-100 h-100 container-general">
    <slot></slot>
  </div>
</template>

<style scoped>
.container-general {
  display: flex;
}

@media (max-width: 680px) {
  .container-general {
    flex-direction: column;
  }
}
@media (max-width: 430px) {
  .container-general {
    margin-bottom: 5rem;
  }
}
</style>
