<template>
  <div class="row justify-evenly">
    <div class="col-2">
      <q-card square flat bordered class="q-mt-lg">
        <q-card-section horizontal class="bg-grey-2">
          <q-card-section class="bg-secondary">
            <q-icon name="person" size="md" color="white" />
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
            <q-icon name="person" size="md" color="white" />
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
            <q-icon name="person" size="md" color="white" />
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
            <q-icon name="person" size="md" color="white" />
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
        type="donut"
        :options="chartOptionsDonut1"
        :series="Object.values(workloadsPerAgent)"
      ></apexchart>
    </div>
    <div class="col-3">
      <apexchart
        class="q-pt-lg"
        type="donut"
        :options="chartOptionsDonut2"
        :series="Object.values(workloadsPerStatus)"
      ></apexchart>
    </div>
    <div class="col-3">
      <apexchart
        class="q-pt-lg"
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
            color="teal"
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
            <q-badge color="primary" :label="props.value" />
          </q-td>
        </template>
      </q-table>
    </div>
  </div>

  <div>
    <q-btn @click="loadState()" />
    {{ dependencies }}
  </div>
</template>

<script setup>
defineOptions({
  name: "HomeView",
});

import { ref, reactive, computed } from "vue";
import apexchart from "vue3-apexcharts";
import testjson from "../../test.json";

const filter = ref("");

const numberOfWorkloads = computed(() => {
  const w = testjson.response.completeState.workloadStates;
  return Object.keys(w).length;
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
  const d = testjson.response.completeState.desiredState.workloads;
  const n = Object.keys(d).length;
  var list = [];
  const counter = {};

  for (let i = 0; i < n; i++) {
    list[i] = Object.values(d)[i].runtime;
  }

  list.sort().forEach((runtime) => {
    if (counter[runtime]) {
      counter[runtime] += 1;
    } else {
      counter[runtime] = 1;
    }
  });

  return counter;
});

const workloadsPerStatus = computed(() => {
  const w = testjson.response.completeState.workloadStates;
  const n = Object.keys(w).length;
  var list = [];
  const counter = {};

  for (let i = 0; i < n; i++) {
    list[i] = Object.keys(w[i].executionState);
  }

  list.sort().forEach((status) => {
    if (counter[status]) {
      counter[status] += 1;
    } else {
      counter[status] = 1;
    }
  });

  return counter;
});

const workloadsPerAgent = computed(() => {
  const w = testjson.response.completeState.workloadStates;
  const n = Object.keys(w).length;
  var list = [];
  const counter = {};

  for (let i = 0; i < n; i++) {
    list[i] = w[i].instanceName.agentName;
  }

  list.sort().forEach((agent) => {
    if (counter[agent]) {
      counter[agent] += 1;
    } else {
      counter[agent] = 1;
    }
  });

  return counter;
});

const dependencies = computed(() => {
  const d = testjson.response.completeState.desiredState;
  const n = Object.keys(d.workloads).length;
  var list = [];
  for (let i = 0; i < n; i++) {
    if ("dependencies" in Object.values(d.workloads)[i]) {
      list[i] = Object.keys(Object.values(d.workloads)[i].dependencies).join(
        ", "
      );
    } else {
      list[i] = "None";
    }
  }
  return list;
});

const rows = computed(() => {
  const w = testjson.response.completeState.workloadStates;
  const d = testjson.response.completeState.desiredState;
  const n = Object.keys(w).length;
  var list = [];

  for (let i = 0; i < n; i++) {
    list[i] = {
      Name: w[i].instanceName.workloadName,
      Agent: w[i].instanceName.agentName,
      Runtime: Object.values(d.workloads)[i].runtime,
      Dependencies: dependencies.value[i],
      Tags: Object.values(d.workloads)[i].tags[0].value,
      State: Object.keys(w[i].executionState),
    };
  }

  return list;
});

/*const rows_new = computed(() => {
  const n = Object.keys(testjson).length;
  var list = [];
  for (let i = 0; i < n; i++) {
    list[i] = {
      Name: workloadStates[i].value.instanceName.workloadName,
      Agent: workloadStates[i].value.instanceName.agentName,
      Runtime: desiredState.value.workloads[i].runtime,
      Dependencies: "Hello",
      Tags: "World",
      State: workloadStates[i].value.executionState.running,
    };
  }
  return list;
});*/

const series = [44, 55, 41, 50, 80];
const chartOptionsDonut1 = {
  chart: {
    type: "donut",
  },
  legend: { show: false },
  labels: Object.keys(workloadsPerAgent.value),
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

var workloadStates = ref([]);
var desiredState = ref({});

function loadState() {
  fetch("/completeState")
    .then((response) => response.json())
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
  /*fetch("/completeState")
    .then((response) => response.json())
    .then((json) => {
      let completeState = null;
      console.log(json);
      console.log(json.response);
      console.log(json.response.completeState);
      console.log(json.response.completeState.workloadStates);
      if (
        json &&
        json.response &&
        json.response.completeState &&
        json.response.completeState.workloadStates
      ) {
        completeState = json.response.completeState;
        workloads.value = completeState.workloadStates;
        if (completeState.desiredState) {
          desiredState.value = completeState.desiredState;
          if (completeState.desiredState.workloads) {
            workloads.value = completeState.desiredState.workloads;
          }
        }
      }

      if (workloads.value) {
        const dependencies = [];
        for (let [workloadName, workloadDefinition] of Object.entries(
          workloads
        )) {
          if ("dependencies" in workloadDefinition) {
            for (let [dependency, condition] of Object.entries(
              workloadDefinition.dependencies
            )) {
              dependencies.push({
                source: workloadName,
                target: dependency,
                type: condition,
              });
            }
          }
        }
      }
    })
    .catch((error) => {
      console.log(
        "There has been a problem with your fetch operation: ",
        error.message
      );
    });*/
}
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
