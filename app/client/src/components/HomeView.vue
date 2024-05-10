<template>
  <div class="row justify-evenly">
    <div class="col-2">
      <q-card square flat bordered class="q-mt-lg">
        <q-card-section horizontal class="bg-grey-2">
          <q-card-section class="bg-secondary">
            <q-icon name="person" size="md" color="white" />
          </q-card-section>
          <q-card-section class="q-pt-xs">
            <div class="text-h5 q-mt-sm q-mb-xs"><b>6</b></div>
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
            <div class="text-h5 q-mt-sm q-mb-xs"><b>3</b></div>
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
            <div class="text-h5 q-mt-sm q-mb-xs"><b>10</b></div>
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
            <div class="text-h5 q-mt-sm q-mb-xs"><b>6</b></div>
            <div class="text-caption text-grey">Workloads</div>
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
        :series="series"
      ></apexchart>
    </div>
    <div class="col-3">
      <apexchart
        class="q-pt-lg"
        type="donut"
        :options="chartOptionsDonut2"
        :series="series"
      ></apexchart>
    </div>
    <div class="col-3">
      <apexchart
        class="q-pt-lg"
        type="donut"
        :options="chartOptionsDonut3"
        :series="series"
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
      </q-table>
    </div>
  </div>
</template>

<script setup>
defineOptions({
  name: "HomeView",
});

import { ref } from "vue";
import apexchart from "vue3-apexcharts";

const filter = ref("");
const rows = [
  {
    Name: "Frozen Yogurt",
    Agent: 159,
    Runtime: 6.0,
    Dependecies: 24,
    Tags: 4.0,
    State: 87,
  },
  {
    Name: "Frozen Yogurt",
    Agent: 159,
    Runtime: 6.0,
    Dependecies: 24,
    Tags: 4.0,
    State: 87,
  },
  {
    Name: "Frozen Yogurt",
    Agent: 159,
    Runtime: 6.0,
    Dependecies: 24,
    Tags: 4.0,
    State: 87,
  },
  {
    Name: "Frozen Yogurt",
    Agent: 159,
    Runtime: 6.0,
    Dependecies: 24,
    Tags: 4.0,
    State: 87,
  },
  {
    Name: "Frozen Yogurt",
    Agent: 159,
    Runtime: 6.0,
    Dependecies: 24,
    Tags: 4.0,
    State: 87,
  },
];
const series = [44, 55, 41, 50, 80];
const chartOptionsDonut1 = {
  chart: {
    type: "donut",
  },
  legend: { show: false },
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
