<template>
  <q-drawer
    v-model="drawerOpen"
    show-if-above
    :mini="miniState"
    @mouseover="miniState = false"
    @mouseout="miniState = true"
    :width="200"
    :breakpoint="500"
    bordered
    class="bg-grey-3"
  >
    <drawerItems :loggedIn="loggedIn" />
  </q-drawer>
</template>

<script setup>
import { ref, toRef } from "vue";
import drawerItems from "components/DrawerItems.vue";

const miniState = ref(true);

const props = defineProps({
  drawerOpen: Boolean,
  loggedIn: Boolean,
});

const drawerOpen = toRef(props, "drawerOpen");
const loggedIn = toRef(props, "loggedIn");
</script>
