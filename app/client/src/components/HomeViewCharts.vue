<template>
  <div class="row justify-evenly">
    <div v-for="chart in charts" :key="chart.name" class="col-3">
      <apexchart
        class="q-pt-lg"
        ref="donutCharts"
        :options="chart.options"
        :series="chart.data"
      ></apexchart>
    </div>
  </div>
</template>

<script setup>
import { ref, toRef, computed, onUpdated } from "vue";
import apexchart from "vue3-apexcharts";

const donutCharts = ref([]);

const title_donutAgents = "Workloads per Agent";
const title_donutStatus = "Workload status";
const title_donutRuntimes = "Workload runtimes";

const props = defineProps({
  workloadsPerAgent: Object,
  workloadsPerStatus: Object,
  workloadsPerRuntime: Object,
});

const workloadsPerAgent = toRef(props, "workloadsPerAgent");
const workloadsPerStatus = toRef(props, "workloadsPerStatus");
const workloadsPerRuntime = toRef(props, "workloadsPerRuntime");

const chartOptionsAgents = computed(() => {
  return getChartOptions(
    title_donutAgents,
    Object.keys(workloadsPerAgent.value)
  );
});

const chartOptionsStatus = computed(() => {
  return getChartOptions(
    title_donutStatus,
    Object.keys(workloadsPerStatus.value)
  );
});

const chartOptionsRuntimes = computed(() => {
  return getChartOptions(
    title_donutRuntimes,
    Object.keys(workloadsPerRuntime.value)
  );
});

const charts = computed(() => {
  return [
    {
      name: "donutAgents",
      options: chartOptionsAgents.value,
      data:
        Object.keys(workloadsPerAgent.value).length > 0
          ? Object.values(workloadsPerAgent.value)
          : [],
      labels:
        Object.keys(workloadsPerAgent.value).length > 0
          ? Object.keys(workloadsPerAgent.value)
          : [],
    },
    {
      name: "donutStatus",
      options: chartOptionsStatus.value,
      data:
        Object.keys(workloadsPerStatus.value).length > 0
          ? Object.values(workloadsPerStatus.value)
          : [],
      labels:
        Object.keys(workloadsPerStatus.value).length > 0
          ? Object.keys(workloadsPerStatus.value)
          : [],
    },
    {
      name: "donutRuntimes",
      options: chartOptionsRuntimes.value,
      data:
        Object.keys(workloadsPerRuntime.value).length > 0
          ? Object.values(workloadsPerRuntime.value)
          : [],
      labels:
        Object.keys(workloadsPerRuntime.value).length > 0
          ? Object.keys(workloadsPerRuntime.value)
          : [],
    },
  ];
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

onUpdated(() => {
  const n = charts.value.length;
  for (let i = 0; i < n; i++) {
    if (donutCharts.value[i]) {
      donutCharts.value[i].updateOptions({
        labels: charts.value[i].labels,
      });
    }
  }
});
</script>

<style lang="scss">
.apexcharts-canvas {
  border-style: solid;
  border-width: thin;
  border-color: $grey-4;
  background: $grey-1;
}
</style>
