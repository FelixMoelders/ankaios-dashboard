<template>
  <kpiCard
    :workloadStates="workloadStates"
    :desiredState="desiredState"
    :workloadsPerAgent="workloadsPerAgent"
    :workloadsPerRuntime="workloadsPerRuntime"
  />

  <donutChart
    :workloadsPerAgent="workloadsPerAgent"
    :workloadsPerStatus="workloadsPerStatus"
    :workloadsPerRuntime="workloadsPerRuntime"
  />

  <workloadTable
    :workloadStates="workloadStates"
    :desiredState="desiredState"
  />
</template>

<script setup>
defineOptions({
  name: "HomeView",
});

import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import kpiCard from "src/components/HomeViewCards.vue";
import donutChart from "components/HomeViewCharts.vue";
import workloadTable from "components/HomeViewTable.vue";

var workloadStates = ref([]);
var desiredState = ref({});

const workloadsPerRuntime = computed(() => {
  return aggregateRuntimes(desiredState.value);
});

const workloadsPerStatus = computed(() => {
  return aggregateStates(workloadStates.value);
});

const workloadsPerAgent = computed(() => {
  return aggregateAgents(workloadStates.value);
});

const dependencies = computed(() => {
  return getDependencies(desiredState.value);
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
