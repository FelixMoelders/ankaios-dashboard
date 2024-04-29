<template>
  <q-btn @click="openLoginModal()" round dense flat color="white" icon="login">
    <q-tooltip>Login</q-tooltip>
  </q-btn>
</template>

<script setup>
function openLoginModal() {
  console.log("Login button clicked");
}
</script>
