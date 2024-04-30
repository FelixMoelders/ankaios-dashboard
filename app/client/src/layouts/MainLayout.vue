<template>
  <q-layout view="hHh Lpr lff" class="shadow-2 rounded-borders">
    <dashboardHeader
      @clickDrawerBtn="toggleDrawer"
      @clickLoginBtn="openLogin"
    />
    <dashboardDrawer :drawerOpen="drawerOpen" />
    <dashboardLogin :loginOpen="loginOpen" @clickCloseLoginBtn="openLogin" />
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";
import dashboardHeader from "components/DashboardHeader.vue";
import dashboardDrawer from "components/DashboardDrawer.vue";
import dashboardLogin from "components/LoginDialog.vue";

const drawerOpen = ref(true);
const loginOpen = ref(false);

function toggleDrawer() {
  drawerOpen.value = !drawerOpen.value;
}

function openLogin() {
  loginOpen.value = !loginOpen.value;
}

defineOptions({
  name: "AnkaiosLayout",
});
</script>

<style lang="sass">
.YL

  &__toolbar-input-container
    min-width: 100px
    width: 55%

  &__toolbar-input-btn
    border-radius: 0
    border-style: solid
    border-width: 1px 1px 1px 0
    border-color: rgba(0,0,0,.24)
    max-width: 60px
    width: 100%

  &__drawer-footer-link
    color: inherit
    text-decoration: none
    font-weight: 500
    font-size: .75rem

    &:hover
      color: #000
</style>
