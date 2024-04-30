<!-- TODO: Bei PW-Feld das Visibility- und Clear-Icon in ihrer Position vertauschen (Clear-Icon muss ganz nach rechts) -->

<template>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog v-model="loginOpen">
      <q-card square class="shadow-24" style="width: 400px; height: 540px">
        <q-card-section class="bg-deep-purple-7">
          <h4 class="text-h5 text-white q-my-md">{{ title }}</h4>
        </q-card-section>
        <q-card-section>
          <q-form class="q-px-sm q-pt-xl">
            <q-input
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
            size="lg"
            color="secondary"
            @click="submit"
            class="full-width text-white"
            :label="btnLabel"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, toRef } from "vue";
import closeLoginBtn from "components/CloseLoginButton.vue";

function required(val) {
  return (val && val.length > 0) || "Mandatory field";
}

function switchVisibility() {
  visibility.value = !visibility.value;
  passwordFieldType.value = visibility.value ? "text" : "password";
  visibilityIcon.value = visibility.value ? "visibility" : "visibility_off";
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
</script>
