<template>
  <AuthRegisterContainer>
    <ContainerForm>
      <ImgAndLogo></ImgAndLogo>
      <RegisterForm :registration-type="0"></RegisterForm>
    </ContainerForm>
  </AuthRegisterContainer>
</template>

<script setup>
import AuthRegisterContainer from "@/components/Auth/AuthRegisterContainer.vue";
import ContainerForm from "@/components/Auth/_ContainerFormAndImg.vue";
import ImgAndLogo from "@/components/Auth/_ImgAndLogo.vue";
import RegisterForm from "@/components/Auth/RegisterForm.vue";
</script>

<style scoped></style>
