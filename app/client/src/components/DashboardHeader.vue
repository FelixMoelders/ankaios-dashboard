<template>
  <q-header q-header elevated class="bg-secondary">
    <q-toolbar>
      <drawerBtn @clickDrawerBtn="$emit('clickDrawerBtn')" />
      <ankaiosBtn />

      <q-space />

      <div class="q-gutter-sm row items-center no-wrap">
        <loginBtn v-if="!loggedIn" @clickLoginBtn="$emit('clickLoginBtn')" />
        <div v-if="loggedIn" class="text-white">{{ loggedInUser }}</div>
        <logoutBtn v-if="loggedIn" @clickLogoutBtn="$emit('clickLogoutBtn')" />
      </div>
    </q-toolbar>
  </q-header>
</template>

<script setup>
import ankaiosBtn from "components/AnkaiosButton.vue";
import loginBtn from "components/LoginButton.vue";
import logoutBtn from "components/LogoutButton.vue";
import drawerBtn from "components/DrawerButton.vue";

const props = defineProps({
  loggedIn: Boolean,
  loggedInUser: String,
});
</script>
