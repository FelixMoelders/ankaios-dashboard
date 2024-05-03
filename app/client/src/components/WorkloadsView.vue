<template>
  <q-page padding>
    <div class="row justify-between items-center q-pa-md"> 
      <div>
        <div class="text-h5">Workloads <q-btn color="secondary" icon="add_circle" @click="addworkload = true" /></div>
        
      </div>
      <q-input v-model="search" placeholder="Search..." filled dense debounce="300"/> 
    </div>

    <AddWorkloadDialog v-model="addworkload" />

    <div class="q-pa-md row q-gutter-md">
      <div class="col-md-3" v-for="workload in filteredWorkloads" :key="workload.instanceName.id">
        <WorkloadCard :workload="workload" :desiredState="desiredState"/>
      </div>
    </div>
  </q-page>
</template>

<script>
import WorkloadCard from './WorkloadCard.vue'
import AddWorkloadDialog from "./AddWorkloadDialog.vue"

export default {
  data() {
    return {
      search: '',
      workloads: [],
      addworkload: false,
    }
  },
  methods: {
    loadState() {
      fetch('/completeState')
        .then(response => response.json())
        .then(json => {
          const completeState = json.response.completeState;
          const workloads = json.response.completeState.desiredState.workloads;
          const workloadStates = json.response.completeState.workloadStates;
          for (const state of workloadStates) {
              const workload = workloads[state.instanceName.workloadName];
              state.tags = workload ? workload.tags : [];
          }
          this.workloads = workloadStates;
          this.desiredState = completeState.desiredState;
          console.log(this.desiredState);
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