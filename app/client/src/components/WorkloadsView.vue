<template>
  <q-page padding>
    <div class="row justify-between items-center q-pa-md">
      <div>
        <div class="text-h5">Workloads <q-btn small round color="secondary" icon="add" @click="addworkload = true" style="margin-left: 20px" /></div>

      </div>
      <q-input v-model="search" placeholder="Search..." filled dense debounce="300"/>
    </div>

    <AddWorkloadDialog v-model="addworkload" />

    <div class="q-pa-md row q-gutter-md">
      <div class="col-md-3" v-for="workload in filteredWorkloads" :key="workload.instanceName.id">
        <WorkloadCard :workload="workload" :workloadStates="workloads" :desiredState="desiredState" :dependencies="dependencies" />
      </div>
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
      desiredState: {},
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
                  console.log(dependencies);
              }
              console.log(this.workloads);
              console.log(this.desiredState);
              console.log(this.dependencies);

          }).catch((error) => {
              console.log('There has been a problem with your fetch operation: ', error.message);
          });
        },
    toggle(id) {
      this.showConfig[id] = !this.showConfig[id];
    }
  },
  computed: {
    filteredWorkloads() {
      if (!this.search) {
        return this.workloads
      }
      return this.workloads.filter(workload => workload.instanceName.workloadName.toLowerCase().includes(this.search.toLowerCase())
        || workload.instanceName.agentName.toLowerCase().includes(this.search.toLowerCase()))
    }
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
