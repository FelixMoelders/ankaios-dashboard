<template>
  <div class="row justify-evenly">
    <div class="col-2">
      <q-card square flat bordered class="q-mt-lg">
        <q-card-section horizontal class="bg-grey-2">
          <q-card-section class="bg-secondary">
            <q-icon name="auto_awesome_motion" size="md" color="white" />
          </q-card-section>
          <q-card-section class="q-pt-xs">
            <div class="text-h5 q-mt-sm q-mb-xs">
              <b>{{ numberOfWorkloads }}</b>
            </div>
            <div class="text-caption text-grey">Workloads</div>
          </q-card-section>
        </q-card-section>
      </q-card>
    </div>
    <div class="col-2">
      <q-card square flat bordered class="q-mt-lg">
        <q-card-section horizontal class="bg-grey-2">
          <q-card-section class="bg-secondary">
            <q-icon name="widgets" size="md" color="white" />
          </q-card-section>
          <q-card-section class="q-pt-xs">
            <div class="text-h5 q-mt-sm q-mb-xs">
              <b>{{ numberOfAgents }}</b>
            </div>
            <div class="text-caption text-grey">Agents</div>
          </q-card-section>
        </q-card-section>
      </q-card>
    </div>
    <div class="col-2">
      <q-card square flat bordered class="q-mt-lg">
        <q-card-section horizontal class="bg-grey-2">
          <q-card-section class="bg-secondary">
            <q-icon name="mediation" size="md" color="white" />
          </q-card-section>
          <q-card-section class="q-pt-xs">
            <div class="text-h5 q-mt-sm q-mb-xs">
              <b>{{ numberOfDependencies }}</b>
            </div>
            <div class="text-caption text-grey">Dependencies</div>
          </q-card-section>
        </q-card-section>
      </q-card>
    </div>
    <div class="col-2">
      <q-card square flat bordered class="q-mt-lg">
        <q-card-section horizontal class="bg-grey-2">
          <q-card-section class="bg-secondary">
            <q-icon name="code" size="md" color="white" />
          </q-card-section>
          <q-card-section class="q-pt-xs">
            <div class="text-h5 q-mt-sm q-mb-xs">
              <b>{{ numberOfRuntimes }}</b>
            </div>
            <div class="text-caption text-grey">{{ strRuntimes }}</div>
          </q-card-section>
        </q-card-section>
      </q-card>
    </div>
  </div>

  <div class="row justify-evenly">
    <div class="col-3">
      <apexchart
        class="q-pt-lg"
        ref="donut1"
        type="donut"
        :options="chartOptionsDonut1"
        :series="Object.values(workloadsPerAgent)"
      ></apexchart>
    </div>
    <div class="col-3">
      <apexchart
        class="q-pt-lg"
        ref="donut2"
        type="donut"
        :options="chartOptionsDonut2"
        :series="Object.values(workloadsPerStatus)"
      ></apexchart>
    </div>
    <div class="col-3">
      <apexchart
        class="q-pt-lg"
        ref="donut3"
        type="donut"
        :options="chartOptionsDonut3"
        :series="Object.values(workloadsPerRuntime)"
      ></apexchart>
    </div>
  </div>

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
            <q-badge v-if="props.value" color="primary" :label="props.value" /> <!-- display empty cell in home view if workload has no tags  -->
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

import {ref, computed, onMounted, onBeforeUnmount } from "vue";
import apexchart from "vue3-apexcharts";

const filter = ref("");
var workloadStates = ref([]);
var desiredState = ref({});
const donut1 = ref("");
const donut2 = ref("");
const donut3 = ref("");

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

const chartOptionsDonut1 = {
  chart: {
    type: "donut",
    animations: {
      dynamicAnimation: {
        enabled: false,
      },
    },
  },
  legend: { show: false },
  labels: [],
  responsive: [
    {
      breakpoint: 1000,
      options: {
        chart: {
          width: 200,
        },
        legend: {
          show: false,
        },
        dataLabels: {
          enabled: false,
        },
      },
    },
  ],
  theme: {
    mode: "light",
    palette: "palette3",
    monochrome: {
      enabled: false,
      color: "#9C27B0",
      shadeTo: "light",
      shadeIntensity: 0.8,
    },
  },
  title: {
    text: "Workloads per Agent",
    align: "left",
    margin: 10,
    offsetX: 0,
    offsetY: 0,
    floating: false,
    style: {
      fontSize: "14px",
      fontWeight: "bold",
      fontFamily: undefined,
      color: "#263238",
    },
  },
};

const chartOptionsDonut2 = {
  chart: {
    type: "donut",
    animations: {
      dynamicAnimation: {
        enabled: false,
      },
    },
  },
  legend: { show: false },
  labels: Object.keys(workloadsPerStatus.value),
  responsive: [
    {
      breakpoint: 1000,
      options: {
        chart: {
          width: 200,
        },
        legend: {
          show: false,
        },
        dataLabels: {
          enabled: false,
        },
      },
    },
  ],
  theme: {
    mode: "light",
    palette: "palette3",
    monochrome: {
      enabled: false,
      color: "#9C27B0",
      shadeTo: "light",
      shadeIntensity: 0.8,
    },
  },
  title: {
    text: "Workload status",
    align: "left",
    margin: 10,
    offsetX: 0,
    offsetY: 0,
    floating: false,
    style: {
      fontSize: "14px",
      fontWeight: "bold",
      fontFamily: undefined,
      color: "#263238",
    },
  },
};
const chartOptionsDonut3 = {
  chart: {
    type: "donut",
    animations: {
      dynamicAnimation: {
        enabled: false,
      },
    },
  },
  legend: { show: false },
  labels: Object.keys(workloadsPerRuntime.value),
  responsive: [
    {
      breakpoint: 1000,
      options: {
        chart: {
          width: 200,
        },
        legend: {
          show: false,
        },
        dataLabels: {
          enabled: false,
        },
      },
    },
  ],
  theme: {
    mode: "light",
    palette: "palette3",
    monochrome: {
      enabled: false,
      color: "#9C27B0",
      shadeTo: "light",
      shadeIntensity: 0.8,
    },
  },
  title: {
    text: "Workload runtimes",
    align: "left",
    margin: 10,
    offsetX: 0,
    offsetY: 0,
    floating: false,
    style: {
      fontSize: "14px",
      fontWeight: "bold",
      fontFamily: undefined,
      color: "#263238",
    },
  },
};

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
  console.log("component mounted") // report when the component is mounted
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
      console.log(json);
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
          // check whether donut1, donut2, donut3 contain null values and only if not, call updateOptions()
        if(donut1.value) {
          donut1.value.updateOptions({
            labels: Object.keys(aggregateAgents(workloadStates.value)),
          });
        }
        if(donut2.value) {
          donut2.value.updateOptions({
            labels: Object.keys(aggregateStates(workloadStates.value)),
          });
        }
        if(donut3.value) {
          donut3.value.updateOptions({
            labels: Object.keys(aggregateRuntimes(desiredState.value)),
          });
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
