<template>
  <div class="row justify-center">
    <div class="col-12 q-pt-lg q-px-xl">
      <q-table
        title="Workloads"
        rows-per-page-label="Workloads per page:"
        no-data-label="Sorry, we didn't find anything for you :("
        no-results-label="Sorry, we didn't find anything for you :("
        flat
        bordered
        square
        dense
        :rows="rows"
        :columns="columns"
        row-key="name"
        :filter="filter"
      >
        <template v-slot:top-right>
          <q-input
            dense
            color="secondary"
            borderless
            v-model="filter"
            placeholder="Search"
          >
            <template v-slot:prepend>
              <q-icon class="text-grey" name="search" />
            </template>
          </q-input>
        </template>
        <template v-slot:body-cell-Tags="props">
          <q-td :props="props">
            <q-badge v-if="props.value" color="primary" :label="props.value" />
            <!-- display empty cell in home view if workload has no tags  -->
          </q-td>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup>
import { ref, toRef, computed } from "vue";

const filter = ref("");

const props = defineProps({
  workloadStates: Object,
  desiredState: Object,
  dependencies: Array,
});

const workloadStates = toRef(props, "workloadStates");
const desiredState = toRef(props, "desiredState");
const dependencies = toRef(props, "dependencies");

const rows = computed(() => {
  const n = Object.keys(workloadStates.value).length;
  var list = [];

  if (n > 0) {
    for (let i = 0; i < n; i++) {
      const j = Object.keys(desiredState.value.workloads).indexOf(
        workloadStates.value[i].instanceName.workloadName
      );
      let tags = ""; // checks whether the array is empty before accessing it.
      let currentWorkload = Object.values(desiredState.value.workloads)[j];
      if (currentWorkload && currentWorkload.tags && currentWorkload.tags[0]) {
        tags = currentWorkload.tags[0].value;
      }
      list[i] = {
        Name: workloadStates.value[i].instanceName.workloadName,
        Agent: workloadStates.value[i].instanceName.agentName,
        Runtime: Object.values(desiredState.value.workloads)[j].runtime,
        Dependencies: dependencies.value[j],
        Tags: tags,
        State: Object.keys(workloadStates.value[i].executionState),
      };
    }
  }

  return list;
});
</script>