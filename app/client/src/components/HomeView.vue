<template>
  <div class="row justify-evenly">
    <div class="col-2">
      <q-card square flat bordered class="q-mt-lg">
        <q-card-section horizontal>
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
        <q-card-section horizontal>
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
        <q-card-section horizontal>
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
        <q-card-section horizontal>
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

  <!-- Anzahl der apexcharts wie gewünscht erweitern -->
  <div class="row justify-center">
      <div class="col-2">
          <apexchart type="donut" :options="chartOptions" :series="series"></apexchart>
      </div>
      <div class="col-2">
          <apexchart type="donut" :options="chartOptions" :series="series"></apexchart>
      </div>
  </div>

  <div class="row justify-center">
    <div class="col-12 q-py-xl q-px-xl">
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

<script>
import { ref } from "vue";
import VueApexCharts from "vue3-apexcharts";

export default {
    data() {
        return {
            filter: ref(""),
            rows: [
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
            ],
            series: [44, 55, 41, 17, 15],
            chartOptions: {
              chart: {
                type: 'donut',
              },
              responsive: [{
                breakpoint: 480,
                options: {
                  chart: {
                    width: 200
                  },
                  legend: {
                    position: 'bottom'
                  }
                }
              }]
            },
        }
    },
    components: {
      apexchart: VueApexCharts,
    },
}
</script>

<style lang="scss">
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

<script setup>
defineOptions({
  name: "HomeView",
});
</script>
