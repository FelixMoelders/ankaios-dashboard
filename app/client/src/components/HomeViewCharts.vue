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

<script></script>
