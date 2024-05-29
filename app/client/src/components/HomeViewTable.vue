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
        <template v-slot:body-cell-Dependencies="props">
          <q-td :props="props">
            <span v-if="props.value">
              <q-badge
                v-for="dep in props.value"
                :key="dep"
                class="q-mr-xs"
                color="accent"
                :label="dep"
              />
            </span>
          </q-td>
        </template>
        <template v-slot:body-cell-Tags="props">
          <q-td :props="props">
            <span v-if="props.value">
              <q-badge
                v-for="tag in props.value"
                :key="tag.key"
                class="q-mr-xs"
                color="primary"
                :label="tag.value"
              />
            </span>
          </q-td>
        </template>
        <template v-slot:body-cell-State="props">
          <q-td :props="props">
            <q-badge
              rounded
              :color="chooseExecutionColor(props.value)"
              class="q-mr-sm"
            />{{ props.value }}
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

function getLastItemOfExecState(workload) {
  const keys = Object.keys(workload.executionState);
  return keys[keys.length - 1];
}

function chooseExecutionColor(execState) {
  switch (execState) {
    case "running":
      return "green";
    case "failed":
      return "red";
    case "pending":
      return "yellow";
    case "removed":
      return "black";
    case "succeeded":
    case "unknown":
    default:
      return "gray";
  }
}

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
      if (currentWorkload && currentWorkload.tags) {
        tags = currentWorkload.tags;
      }

      let deps = "";
      if (currentWorkload && "dependencies" in currentWorkload) {
        deps = Object.keys(currentWorkload.dependencies).sort();
      }

      console.log(deps);

      list[i] = {
        Name: workloadStates.value[i].instanceName.workloadName,
        Agent: workloadStates.value[i].instanceName.agentName,
        Runtime: Object.values(desiredState.value.workloads)[j].runtime,
        Dependencies: deps,
        Tags: tags,
        State: getLastItemOfExecState(workloadStates.value[i]),
      };
    }
  }

  return list;
});
</script>

<style lang="scss">
.q-table__bottom-item {
  font-size: 10px;
  color: $grey-7;
}

.q-field__native {
  font-size: 10px;
  color: $grey-7;
}

.q-field__append {
  color: $grey-7;
}

.q-table thead {
  background-color: $secondary;
  color: white;
}

.q-table__bottom {
  background-color: $grey-3;
  padding: 0px 15px;
}

.q-table--dense .q-table__bottom {
  min-height: 0px;
}

.q-table__top {
  border: none;
}
</style>
