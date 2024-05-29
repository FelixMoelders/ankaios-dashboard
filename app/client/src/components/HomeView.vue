<template>
  <kpi
    :workloadStates="workloadStates"
    :workloadsPerAgent="workloadsPerAgent"
    :dependencies="dependencies"
    :workloadsPerRuntime="workloadsPerRuntime"
  />

  <donutChart
    :workloadsPerAgent="workloadsPerAgent"
    :workloadsPerStatus="workloadsPerStatus"
    :workloadsPerRuntime="workloadsPerRuntime"
  />

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
defineOptions({
  name: "HomeView",
});

import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import kpi from "components/HomeViewKPI.vue";
import donutChart from "components/HomeViewCharts.vue";

const filter = ref("");
var workloadStates = ref([]);
var desiredState = ref({});

const workloadsPerRuntime = computed(() => {
  const counter = {};

  if (Object.keys(desiredState.value).length > 0) {
    const n = Object.keys(desiredState.value.workloads).length;
    var list = [];

    for (let i = 0; i < n; i++) {
      list[i] = Object.values(desiredState.value.workloads)[i].runtime;
    }

    list.sort().forEach((runtime) => {
      if (counter[runtime]) {
        counter[runtime] += 1;
      } else {
        counter[runtime] = 1;
      }
    });
  }

  return counter;
});

const workloadsPerStatus = computed(() => {
  const n = Object.keys(workloadStates.value).length;
  var list = [];
  const counter = {};

  if (n > 0) {
    for (let i = 0; i < n; i++) {
      list[i] = Object.keys(workloadStates.value[i].executionState);
    }

    list.sort().forEach((status) => {
      if (counter[status]) {
        counter[status] += 1;
      } else {
        counter[status] = 1;
      }
    });
  }

  return counter;
});

const workloadsPerAgent = computed(() => {
  const n = Object.keys(workloadStates.value).length;
  var list = [];
  const counter = {};

  if (n > 0) {
    for (let i = 0; i < n; i++) {
      list[i] = workloadStates.value[i].instanceName.agentName;
    }

    list.sort().forEach((agent) => {
      if (counter[agent]) {
        counter[agent] += 1;
      } else {
        counter[agent] = 1;
      }
    });
  }

  return counter;
});

const dependencies = computed(() => {
  var list = [];

  if (Object.keys(desiredState.value).length > 0) {
    const workloads = desiredState.value.workloads;
    const n = Object.keys(workloads).length;

    for (let i = 0; i < n; i++) {
      if ("dependencies" in Object.values(workloads)[i]) {
        list[i] = Object.keys(Object.values(workloads)[i].dependencies)
          .sort()
          .join(", ");
      } else {
        list[i] = "None";
      }
    }
  }

  return list;
});

const rows = computed(() => {
  const n = Object.keys(workloadStates.value).length;
  var list = [];

  if (n > 0) {
    for (let i = 0; i < n; i++) {
      const j = Object.keys(desiredState.value.workloads).indexOf(
        workloadStates.value[i].instanceName.workloadName
      );
      let tags = ""; //previous code only checked if the 'tags' property existed, and if so, immediately tried to access it as an array. Now, it also checks whether the array is empty before accessing it.
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

function aggregateRuntimes(desiredState) {
  const counter = {};

  if (Object.keys(desiredState).length > 0) {
    const n = Object.keys(desiredState.workloads).length;
    var list = [];

    for (let i = 0; i < n; i++) {
      list[i] = Object.values(desiredState.workloads)[i].runtime;
    }

    list.sort().forEach((runtime) => {
      if (counter[runtime]) {
        counter[runtime] += 1;
      } else {
        counter[runtime] = 1;
      }
    });
  }

  return counter;
}

function aggregateStates(workloads) {
  const n = Object.keys(workloads).length;
  var list = [];
  const counter = {};

  if (n > 0) {
    for (let i = 0; i < n; i++) {
      list[i] = Object.keys(workloads[i].executionState);
    }

    list.sort().forEach((status) => {
      if (counter[status]) {
        counter[status] += 1;
      } else {
        counter[status] = 1;
      }
    });
  }

  return counter;
}

function aggregateAgents(workloads) {
  const n = Object.keys(workloads).length;
  var list = [];
  const counter = {};

  if (n > 0) {
    for (let i = 0; i < n; i++) {
      list[i] = workloads[i].instanceName.agentName;
    }

    list.sort().forEach((agent) => {
      if (counter[agent]) {
        counter[agent] += 1;
      } else {
        counter[agent] = 1;
      }
    });
  }

  return counter;
}

let timerId = null;

onMounted(() => {
  console.log("component mounted"); // report when the component is mounted
  function loadState() {
    fetch("/completeState")
      .then((response) => {
        if (!response.ok) {
          if (response.status == 405) {
            console.log("User not logged in.");
          }
          return Promise.reject(response);
        } else {
          return response.json();
        }
      })
      .then((json) => {
        let completeState = null;
        if (
          json &&
          json.response &&
          json.response.completeState &&
          json.response.completeState.workloadStates
        ) {
          completeState = json.response.completeState;
          workloadStates.value = completeState.workloadStates;
          if (completeState.desiredState) {
            desiredState.value = completeState.desiredState;
          }
        }
      })
      .catch((error) => {
        console.log(
          "There has been a problem with your fetch operation: ",
          error.message
        );
      });
  }
  timerId = setInterval(() => loadState(), 2000); // wait for mounting before calling loadState()
});

onBeforeUnmount(() => {
  clearInterval(timerId);
});
</script>

<style lang="scss">
.apexcharts-canvas {
  border-style: solid;
  border-width: thin;
  border-color: $grey-4;
  background: $grey-1;
}

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
