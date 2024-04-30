<template>
  <q-header q-header elevated class="bg-secondary">
    <q-toolbar>
      <drawerBtn @clickDrawerBtn="$emit('clickDrawerBtn')" />
      <ankaiosBtn />

      <q-space />

      <div class="q-gutter-sm row items-center no-wrap">
        <loginBtn @clickLoginBtn="$emit('clickLoginBtn')" />
      </div>
    </q-toolbar>
  </q-header>
</template>

<script setup>
import ankaiosBtn from "components/AnkaiosButton.vue";
import loginBtn from "components/LoginButton.vue";
import drawerBtn from "components/DrawerButton.vue";
</script>
