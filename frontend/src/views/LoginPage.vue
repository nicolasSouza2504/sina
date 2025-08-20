<template>
  <AuthRegisterContainer>
    <ContainerForm>
      <ImgAndLogo></ImgAndLogo>
      <LoginForm></LoginForm>
    </ContainerForm>
  </AuthRegisterContainer>
</template>

<script setup>
import AuthRegisterContainer from "@/components/Auth/AuthRegisterContainer.vue";
import ImgAndLogo from "@/components/Auth/_ImgAndLogo.vue";
import LoginForm from "@/components/Auth/LoginForm.vue";
import ContainerForm from "@/components/Auth/_ContainerFormAndImg.vue";
</script>
