<template>
  <kpiCard
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

  <workloadTable
    :workloadStates="workloadStates"
    :desiredState="desiredState"
    :dependencies="dependencies"
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
