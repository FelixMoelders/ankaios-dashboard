<template>
  <q-btn
    @click="
      $emit('clickLogoutBtn');
      logout();
    "
    round
    dense
    flat
    color="white"
    icon="logout"
  >
    <q-tooltip>Logout</q-tooltip>
  </q-btn>
</template>

<script setup>
import { useQuasar } from "quasar";
const $q = useQuasar();

function logout() {
  fetch("/logout").then(function (res) {
    if (res.status == 200) {
      $q.notify({
        type: "positive",
        message: "Logout successful, see you soon!",
      });
    }
  });
}
</script>
