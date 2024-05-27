<template>
  <div class="row justify-evenly">
    <div v-for="k in kpi" :key="k.name" class="col-2">
      <q-card square flat bordered class="q-mt-lg">
        <q-card-section horizontal class="bg-grey-2">
          <q-card-section class="bg-secondary">
            <q-icon :name="k.icon" size="md" color="white" />
          </q-card-section>
          <q-card-section class="q-pt-xs">
            <div class="text-h5 q-mt-sm q-mb-xs">
              <b>{{ k.value }}</b>
            </div>
            <div class="text-caption text-grey">{{ k.name }}</div>
          </q-card-section>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { ref, toRef, computed } from "vue";

const props = defineProps({
  workloadStates: Number,
  workloadsPerAgent: Number,
  dependencies: Number,
  workloadsPerRuntime: Number,
});

const workloadStates = toRef(props, "workloadStates");
const workloadsPerAgent = toRef(props, "workloadsPerAgent");
const dependencies = toRef(props, "dependencies");
const workloadsPerRuntime = toRef(props, "workloadsPerRuntime");

const numberOfWorkloads = computed(() => {
  return Object.keys(workloadStates.value).length;
});

const numberOfAgents = computed(() => {
  return Object.keys(workloadsPerAgent.value).length;
});

const numberOfDependencies = computed(() => {
  const dep = dependencies.value;
  var nDep = 0;
  for (let i = 0; i < dep.length; i++) {
    if (dep[i] != "None") {
      nDep += (dep[i].match(/,/g) || []).length + 1;
    }
  }
  return nDep;
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

const kpi = ref([
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
