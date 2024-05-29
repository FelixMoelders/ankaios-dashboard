<template>
  <div class="row justify-evenly">
    <div v-for="card in cards" :key="card.name" class="col-2">
      <q-card square flat bordered class="q-mt-lg">
        <q-card-section horizontal class="bg-grey-2">
          <q-card-section class="bg-secondary">
            <q-icon :name="card.icon" size="md" color="white" />
          </q-card-section>
          <q-card-section class="q-pt-xs">
            <div class="text-h5 q-mt-sm q-mb-xs">
              <b>{{ card.value }}</b>
            </div>
            <div class="text-caption text-grey">{{ card.name }}</div>
          </q-card-section>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { ref, toRef, computed } from "vue";

const props = defineProps({
  workloadStates: Object,
  desiredState: Object,
  workloadsPerAgent: Object,
  workloadsPerRuntime: Object,
});

const workloadStates = toRef(props, "workloadStates");
const workloadsPerAgent = toRef(props, "workloadsPerAgent");
const desiredState = toRef(props, "desiredState");
const workloadsPerRuntime = toRef(props, "workloadsPerRuntime");

function getNumberOfDependencies(desiredState) {
  var nDep = 0;
  if (Object.keys(desiredState).length > 0) {
    const workloads = desiredState.workloads;
    const n = Object.keys(workloads).length;
    for (let i = 0; i < n; i++) {
      if ("dependencies" in Object.values(workloads)[i]) {
        nDep += 1;
      }
    }
  }
  return nDep;
}

const numberOfWorkloads = computed(() => {
  return Object.keys(workloadStates.value).length;
});

const numberOfAgents = computed(() => {
  return Object.keys(workloadsPerAgent.value).length;
});

const numberOfDependencies = computed(() => {
  return getNumberOfDependencies(desiredState.value);
});

const numberOfRuntimes = computed(() => {
  return Object.keys(workloadsPerRuntime.value).length;
});

const strRuntimes = computed(() => {
  var str = "Runtimes";
  if (numberOfRuntimes.value == 1) {
    str = "Runtime";
  }
  return str;
});

const cards = ref([
  {
    name: "Workloads",
    icon: "auto_awesome_motion",
    value: numberOfWorkloads,
  },
  {
    name: "Agents",
    icon: "widgets",
    value: numberOfAgents,
  },
  {
    name: "Dependencies",
    icon: "mediation",
    value: numberOfDependencies,
  },
  {
    name: strRuntimes,
    icon: "code",
    value: numberOfRuntimes,
  },
]);
</script>
