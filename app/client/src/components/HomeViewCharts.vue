<template>
  <div class="row justify-evenly">
    <div v-for="chart in charts" :key="chart.name" class="col-3">
      <apexchart
        class="q-pt-lg"
        ref="chart.name"
        :options="chart.options"
        :series="chart.data"
      ></apexchart>
    </div>
  </div>
</template>

<script setup>
import { ref, toRef } from "vue";
import apexchart from "vue3-apexcharts";

const donutAgents = ref("");
const donutStatus = ref("");
const donutRuntimes = ref("");

const title_donutAgents = "Workloads per Agent";
const title_donutStatus = "Workload status";
const title_donutRuntimes = "Workload runtimes";

const chartOptionsAgents = getChartOptions(title_donutAgents);
const chartOptionsStatus = getChartOptions(title_donutStatus);
const chartOptionsRuntimes = getChartOptions(title_donutRuntimes);

const props = defineProps({
  workloadsPerAgent: Number,
  workloadsPerStatus: Number,
  workloadsPerRuntime: Number,
});

const workloadsPerAgent = toRef(props, "workloadsPerAgent");
const workloadsPerStatus = toRef(props, "workloadsPerStatus");
const workloadsPerRuntime = toRef(props, "workloadsPerRuntime");

var charts = ref([
  {
    name: "donutAgents",
    options: chartOptionsAgents,
    data: workloadsPerAgent.value ? [] : Object.values(workloadsPerAgent),
  },
  {
    name: "donutStatus",
    options: chartOptionsStatus,
    data: workloadsPerStatus.value ? [] : Object.values(workloadsPerStatus),
  },
  {
    name: "donutRuntimes",
    options: chartOptionsRuntimes,
    data: workloadsPerRuntime.value ? [] : Object.values(workloadsPerRuntime),
  },
]);

function getChartOptions(title) {
  return {
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
      text: title,
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
}
</script>
