<template>
  <div class="row justify-evenly">
    <div v-for="chart in charts" :key="chart.name" class="col-3">
      <apexchart
        class="q-pt-lg"
        :options="chart.options"
        :series="chart.data"
      ></apexchart>
    </div>
  </div>
</template>

<script setup>
import { ref, toRef, computed } from "vue";
import apexchart from "vue3-apexcharts";

const props = defineProps({
  workloadsPerAgent: Object,
  workloadsPerStatus: Object,
  workloadsPerRuntime: Object,
});

const workloadsPerAgent = toRef(props, "workloadsPerAgent");
const workloadsPerStatus = toRef(props, "workloadsPerStatus");
const workloadsPerRuntime = toRef(props, "workloadsPerRuntime");

const chartNames = ["donutAgents", "donutStatus", "donutRuntimes"];

const chartTitles = [
  "Workloads per Agent",
  "Workload status",
  "Workload runtimes",
];

const chartData = computed(() => {
  return [
    Object.keys(workloadsPerAgent.value).length > 0
      ? Object.values(workloadsPerAgent.value)
      : [],
    Object.keys(workloadsPerStatus.value).length > 0
      ? Object.values(workloadsPerStatus.value)
      : [],
    Object.keys(workloadsPerRuntime.value).length > 0
      ? Object.values(workloadsPerRuntime.value)
      : [],
  ];
});

const chartLabels = computed(() => {
  return [
    Object.keys(workloadsPerAgent.value),
    Object.keys(workloadsPerStatus.value),
    Object.keys(workloadsPerRuntime.value),
  ];
});

const chartOptions = computed(() => {
  const n = chartNames.length;
  const optionsList = [];
  for (let i = 0; i < n; i++) {
    optionsList.push(getChartOptions(chartTitles[i], chartLabels.value[i]));
  }
  return optionsList;
});

const charts = computed(() => {
  const n = chartNames.length;
  const chartList = [];
  for (let i = 0; i < n; i++) {
    chartList.push({
      name: chartNames[i],
      options: chartOptions.value[i],
      data: chartData.value[i],
      labels: chartLabels.value[i],
    });
  }
  return chartList;
});

function getChartOptions(title, labels) {
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
    labels: labels,
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

<style lang="scss">
.apexcharts-canvas {
  border-style: solid;
  border-width: thin;
  border-color: $grey-4;
  background: $grey-1;
}
</style>
