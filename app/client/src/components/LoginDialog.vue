<template>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog v-model="loginOpen">
      <q-card style="min-width: 350px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Login to Ankaios Dashboard</div>
          <q-space />
          <closeLoginBtn @clickCloseLoginBtn="$emit('clickCloseLoginBtn')" />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            dense
            v-model="address"
            autofocus
            @keyup.enter="prompt = false"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Login" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, toRef } from "vue";
import closeLoginBtn from "components/CloseLoginButton.vue";

const props = defineProps({
  loginOpen: Boolean,
});

const loginOpen = toRef(props, "loginOpen");
const address = ref("");
</script>
