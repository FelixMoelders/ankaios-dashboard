<template>
  <q-page padding>
    <div class="row justify-between items-center q-pa-md">
      <div>
        <div class="text-h5">Workloads <q-btn small round color="secondary" icon="add" @click="addworkload = true" style="margin-left: 20px" /></div>
      </div>
      <div class="row justify-between">
        <q-input v-model="search" placeholder="Search..." filled dense debounce="300"/>
        <q-select style="width: 125px; margin-left: 10px" filled v-model="filterState" :options="options" label="State Filter" />
      </div>
    </div>

    <AddWorkloadDialog v-model="addworkload" />

    <div class="q-pa-md row q-gutter-md">
      <div class="col-md-3" v-for="workload in paginatedWorkloads" :key="workload.instanceName.id">
        <WorkloadCard :workload="workload" :workloadStates="workloads" :desiredState="desiredState" :dependencies="dependencies" />
      </div>
    </div>
    <div class="q-pa-lg flex flex-center">
      <q-pagination
        v-model="currentPage"
        :max="maxPages"
        @update:model-value="updatePage"
      />
    </div>
  </q-page>
</template>

<script>
import WorkloadCard from './WorkloadCard.vue'
import AddWorkloadDialog from "./AddWorkloadDialog.vue"
import { EventBus } from '../utils/EventBus';

export default {
  data() {
    return {
      search: '',
      workloads: [],
      dependencies: [],
      addworkload: false,
      filterState: "all",
      options: ["all", "running", "pending", "failed", "succeeded", "stopping"],
      desiredState: {},
      currentPage: 1,
      pageSize: 9,
    }
  },
  methods: {
    loadState() {
      fetch('/completeState')
          .then(response => {
              if (!response.ok) {
                  if (response.status == 405) {
                      console.log("User not logged in. Changing to Login Page.")
                      this.changeView("login");
                  }
                  return Promise.reject(response);
              } else {
                  return response.json();
              }
          }).then(json => {
              let completeState = null, workloads = null;

              if (json && json.response && json.response.completeState && json.response.completeState.workloadStates) {
                  completeState = json.response.completeState;
                  this.workloads = completeState.workloadStates;
                  if (completeState.desiredState) {
                      this.desiredState = completeState.desiredState;
                      if (completeState.desiredState.workloads) {
                          workloads = completeState.desiredState.workloads;
                      }
                  }
              }
              if (workloads) {
                  const dependencies = [];
                  for (let [workloadName, workloadDefinition] of Object.entries(workloads)) {
                      if ("dependencies" in workloadDefinition) {
                          for (let [dependency, condition] of Object.entries(workloadDefinition.dependencies)) {
                              dependencies.push({
                                source: workloadName,
                                target: dependency,
                                type: condition
                              });
                          }
                      }
                  }
                  EventBus.emit('update-dependencies', dependencies);
              }

          }).catch((error) => {
              console.log('There has been a problem with your fetch operation: ', error.message);
          });
    },
    toggle(id) {
      this.showConfig[id] = !this.showConfig[id];
    },
    updatePage(page) {
      this.currentPage = page;
    },
    getLastItemOfExecState(execState) {
            const keys = Object.keys(execState);
            const lastKey = keys[keys.length - 1];
            return lastKey;
    }
  },
  computed: {
    sortedWorkloads() {
      return this.workloads.sort((a, b) => a.instanceName.workloadName.localeCompare(b.instanceName.workloadName));
    },
    filteredWorkloads() {
      if (!this.search && !this.filterState) {
        return this.sortedWorkloads
      }
      return this.sortedWorkloads.filter(workload => {
        let search = this.search.toLowerCase();

        let workloadName = workload.instanceName.workloadName.toLowerCase();
        let agentName = workload.instanceName.agentName.toLowerCase();

        let desiredState = this.desiredState.workloads[workload.instanceName.workloadName];
        let runtimeConfig = desiredState.runtimeConfig.toLowerCase();
        let tags = desiredState.tags;

        const tagKeyExists = tags.some(item => item.key.toLowerCase().includes(search));
        const tagValueExists = tags.some(item => item.value.toLowerCase().includes(search));

        let execStateFits = false;
        if (this.filterState == "all") {
          execStateFits = true;
        } else if (this.filterState == this.getLastItemOfExecState(workload.executionState)) {
          execStateFits = true;
        }

        return (workloadName.includes(search)
                || agentName.includes(search)
                || runtimeConfig.includes(search)
                || tagKeyExists
                || tagValueExists)
                && execStateFits
      })
    },
    paginatedWorkloads() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;

      return this.filteredWorkloads.slice(start, end);
    },
    maxPages() {
      return Math.ceil(this.filteredWorkloads.length / this.pageSize);
    },
  },
  mounted() {
    this.timer = setInterval(() => {
      this.loadState();
    }, 2000)
  },
  beforeUnmount() {
    clearInterval(this.timer)
  }
}
</script>

<script setup>
defineOptions({
  name: "WorkloadsView",
});
</script>
