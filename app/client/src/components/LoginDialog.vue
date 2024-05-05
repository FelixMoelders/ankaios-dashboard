<!-- TODO:
  / Bei PW-Feld das Visibility- und Clear-Icon in ihrer Position vertauschen (Clear-Icon muss ganz nach rechts)
  / Easy-Close zur Karte hinzufügen
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
            ref="userField"
            color="secondary"
            square
            clearable="false"
            v-model="user"
            type="text"
            lazy-rules
            :rules="[required]"
            no-error-icon="true"
            label="User"
          >
            <template v-slot:prepend>
              <q-icon name="person" />
            </template>
          </q-input>
          <q-input
            ref="pwField"
            color="secondary"
            square
            clearable="false"
            v-model="password"
            :type="passwordFieldType"
            lazy-rules
            :rules="[required]"
            no-error-icon="true"
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
        <div @click="changePwd" class="text-grey-6 cursor-pointer">
          Change password?
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, toRef } from "vue";
import { useQuasar } from "quasar";

const emit = defineEmits(["clickCloseLoginBtn", "userLoggedIn"]);

function required(val) {
  return (val && val.length > 0) || "Mandatory field";
}

function switchVisibility() {
  visibility.value = !visibility.value;
  passwordFieldType.value = visibility.value ? "text" : "password";
  visibilityIcon.value = visibility.value ? "visibility" : "visibility_off";
}

function submit() {
  if (user.value == "" || password.value == "") {
    $q.notify({
      type: "negative",
      message: "Missing input, we can't log you in :(",
    });
    userField.value.validate();
    pwField.value.validate();
  } else {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pwd: password }),
    };
    fetch("/login", requestOptions).then(function (res) {
      if (res.status == 200) {
        $q.notify({
          type: "positive",
          message: "Login successful, great to see you! :)",
        });
        emit("userLoggedIn", user.value);
        emit("clickCloseLoginBtn");
        user.value = "";
        password.value = "";
      } else if (res.status == 401) {
        $q.notify({
          type: "negative",
          message: "Wrong password, we can't log you in :(",
        });
      }
    });
  }
}

function changePwd() {
  console.log("Changed password");
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
const $q = useQuasar();
const userField = ref("");
const pwField = ref("");
</script>
