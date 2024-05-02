<!-- TODO:
  / Bei PW-Feld das Visibility- und Clear-Icon in ihrer Position vertauschen (Clear-Icon muss ganz nach rechts)
  / Easy-Close zur Karte hinzufügen
  / Close-Button für Card hinzufügen
  / Button für PW-Change hinzufügen
-->

<template>
  <q-dialog v-model="loginOpen">
    <q-card square class="shadow-24" style="width: 400px; height: 540px">
      <q-card-section class="row items-center bg-secondary">
        <div class="text-h5 text-white q-my-xs">{{ title }}</div>
        <q-space />
        <q-btn
          flat
          round
          dense
          v-close-popup
          @click="$emit('clickCloseLoginBtn')"
        >
          <q-icon name="close" color="white" />
        </q-btn>
      </q-card-section>
      <q-card-section>
        <q-form class="q-px-sm q-pt-md">
          <q-input
            color="secondary"
            square
            clearable
            v-model="user"
            type="text"
            lazy-rules
            :rules="[required]"
            label="User"
          >
            <template v-slot:prepend>
              <q-icon name="person" />
            </template>
          </q-input>
          <q-input
            color="secondary"
            square
            clearable
            v-model="password"
            :type="passwordFieldType"
            lazy-rules
            :rules="[required]"
            label="Password"
          >
            <template v-slot:prepend>
              <q-icon name="lock" />
            </template>
            <template v-slot:append>
              <q-icon
                :name="visibilityIcon"
                @click="switchVisibility"
                class="cursor-pointer"
              />
            </template>
          </q-input>
        </q-form>
      </q-card-section>

      <q-card-actions class="q-px-lg">
        <q-btn
          unelevated
          size="md"
          color="secondary"
          @click="submit"
          class="full-width text-white"
          :label="btnLabel"
        />
      </q-card-actions>
      <q-card-section class="text-center q-pa-sm">
        <p class="text-grey-6">Change password?</p>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, toRef } from "vue";

function required(val) {
  return (val && val.length > 0) || "Mandatory field";
}

function switchVisibility() {
  visibility.value = !visibility.value;
  passwordFieldType.value = visibility.value ? "text" : "password";
  visibilityIcon.value = visibility.value ? "visibility" : "visibility_off";
}

function submit() {
  console.log("Submitted credentials");
}

const props = defineProps({
  loginOpen: Boolean,
  title: String,
});

const loginOpen = toRef(props, "loginOpen");
const user = ref("");
const password = ref("");
const passwordFieldType = ref("password");
const visibility = ref(false);
const visibilityIcon = ref("visibility_off");
const btnLabel = ref("Let's go!");
</script>
