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
import { computed } from "vue";

const props = defineProps({
  numberOfWorkloads: Number,
  numberOfAgents: Number,
  numberOfDependencies: Number,
  numberOfRuntimes: Number,
});

const cards = computed(() => [
  {
    name: "Workloads",
    icon: "auto_awesome_motion",
    value: props.numberOfWorkloads,
  },
  {
    name: "Agents",
    icon: "widgets",
    value: props.numberOfAgents,
  },
  {
    name: "Dependencies",
    icon: "mediation",
    value: props.numberOfDependencies,
  },
  {
    name: "Runtimes",
    icon: "code",
    value: props.numberOfRuntimes,
  },
]);
</script>
