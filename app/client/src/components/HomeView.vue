<template>
  <kpiCard
    :numberOfWorkloads="numberOfWorkloads"
    :numberOfAgents="numberOfAgents"
    :numberOfDependencies="numberOfDependencies"
    :numberOfRuntimes="numberOfRuntimes"
  />

  <donutChart
    :workloadsPerAgent="workloadsPerAgent"
    :workloadsPerStatus="workloadsPerStatus"
    :workloadsPerRuntime="workloadsPerRuntime"
  />

  <workloadTable
    :workloads="workloads"
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
import { EventBus } from "src/utils/EventBus";

var workloads = ref([]);
var agentsList = ref([]);
var dependencies = ref([]);

const numberOfWorkloads = computed(() => {
  return workloads.value.length;
});

const numberOfAgents = computed(() => {
  return agentsList.value.length;
});

const workloadsPerRuntime = computed(() => {
  var counter = {};
  for (let workload of workloads.value) {
    if (counter[workload.runtime]) {
      counter[workload.runtime] += 1;
    } else {
      counter[workload.runtime] = 1;
    }
  }
  counter = Object.keys(counter).sort().reduce((acc, key) => {
    acc[key] = counter[key];
    return acc;
  }, {});
  return counter;
});

const workloadsPerStatus = computed(() => {
  var counter = {};
  for (let workload of workloads.value) {
    if (counter[workload.execStateKey]) {
      counter[workload.execStateKey] += 1;
    } else {
      counter[workload.execStateKey] = 1;
    }
  }
  counter = Object.keys(counter).sort().reduce((acc, key) => {
    acc[key] = counter[key];
    return acc;
  }, {});
  return counter;
});

const workloadsPerAgent = computed(() => {
  var counter = {};
  for (let workload of workloads.value) {
    if (counter[workload.agent]) {
      counter[workload.agent] += 1;
    } else {
      counter[workload.agent] = 1;
    }
  }
  counter = Object.keys(counter).sort().reduce((acc, key) => {
    acc[key] = counter[key];
    return acc;
  }, {});
  return counter;
});

const numberOfDependencies = computed(() => {
  return dependencies.value.length;
});

const numberOfRuntimes = computed(() => {
  const mySet = new Set();
  for (let workload of workloads.value) {
    mySet.add(workload.runtime);
  }
  return mySet.size;
});

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
        console.log("loadState");
        console.log(json);
        console.log(numberOfWorkloads.value);
        if (json && json.response && json.response.completeState && json.response.completeState.workloadStates
        && json.response.completeState.desiredState && json.response.completeState.desiredState.workloads.workloads) {
            var completeState = json.response.completeState;

            // reset workloads array
            workloads.value = [];

            // combine desired state and workload states into one data structure
            var agentStateMap = completeState.workloadStates.agentStateMap;
            for (const agentName in agentStateMap) {
              var workloadStateMap = agentStateMap[agentName].wlNameStateMap;
              for (const workloadName in workloadStateMap) {
                // retrieve the execution state
                var idStateMap = workloadStateMap[workloadName].idStateMap;
                var workloadId = Object.keys(idStateMap)[0];

                var state = idStateMap[workloadId];
                var keys = Object.keys(state);
                var execStateKey = keys[keys.length - 1];
                var executionState = state[execStateKey];

                var workload = completeState.desiredState.workloads.workloads[workloadName];
                workload["workloadName"] = workloadName;
                workload["workloadId"] = workloadId;
                workload["executionState"] = executionState;
                workload["execStateKey"] = execStateKey;
                workloads.value.push(workload);
              }
            }
        }
        let agents = new Set();
        dependencies.value = [];
        for (const workloadDefinition of workloads.value) {
            if (workloadDefinition.dependencies) {
                for (let [dependency, condition] of Object.entries(workloadDefinition.dependencies)) {
                    dependencies.value.push({
                      source: workloadDefinition.workloadName,
                      target: dependency,
                      type: condition
                    });
                }
            }
            if (workloadDefinition.agent) {
                agents.add(workloadDefinition.agent);
            }
        }
        agentsList.value = [...agents];
        agentsList.value = agentsList.value.sort((a, b) => a.localeCompare(b))
        EventBus.emit('update-dependencies', dependencies);
      })
      .catch((error) => {
        console.log(
          "There has been a problem with your fetch operation: ",
          error.message
        );
      });
  }
  loadState();
  timerId = setInterval(loadState, 2000); // Load state every 2 seconds
  EventBus.on("workload-deleted", () => {
    clearInterval(timerId); // Clear the interval first to stop the periodic fetching
    loadState(); // Then call loadState
  });
});

onBeforeUnmount(() => {
  clearInterval(timerId); // Clear the interval when component is unmounted
  EventBus.off("workload-deleted");
});
</script>
