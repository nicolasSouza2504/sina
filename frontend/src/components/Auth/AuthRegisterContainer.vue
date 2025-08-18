<template>
  <div class="login-page-container h-100">
    <slot></slot>
  </div>
</template>

<style scoped>
.login-page-container {
  background: conic-gradient(
    from 90deg at 50% 50%,
    rgba(68, 205, 255, 0.89) 10%,
    rgba(68, 213, 254, 0.87) 14%,
    rgba(67, 237, 249, 0.81) 29%,
    rgba(66, 255, 246, 0.77) 40%,
    rgba(68, 205, 255, 0.89) 61%,
    rgba(66, 255, 246, 0.77) 90%,
    rgba(68, 205, 255, 0.89) 100%
  );
}
</style>
