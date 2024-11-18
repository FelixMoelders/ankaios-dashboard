<template>
  <div class="row justify-center">
    <div class="col-12 q-pt-lg q-px-xl">
      <q-table
        title="Workloads"
        rows-per-page-label="Workloads per page:"
        :rows-per-page-options="rowsPerPageOptions"
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
        v-model:pagination="pagination"
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
  workloads: Object,
});

const workloads = toRef(props, "workloads");

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
  const list = [];

  if (!workloads.value) return [];

  for (let workload of workloads.value) {
    let tags = [];
    if (workload.tags && workload.tags) {
      tags = workload.tags;
    }

    let deps = [];
    if (workload.dependencies && workload.dependencies) {
      deps = Object.keys(workload.dependencies).sort();
    }

    list.push({
      Name: workload.workloadName,
      Agent: workload.agent,
      Runtime: workload.runtime,
      Dependencies: deps,
      Tags: tags,
      State: workload.state,
    });
  }
  console.log("list", list);
  return list;
});

const rowsPerPageOptions = [5, 10, 25, 50, 0];

const pagination = ref({
  sortBy: "Name",
  descending: false,
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
