<template>
  <q-page padding>
    <div class="row justify-between items-center q-pa-md">
      <div>
        <div class="text-h5">Workloads <q-btn small round color="secondary" icon="add" @click="addworkload = true" style="margin-left: 20px" /></div>
      </div>
      <div class="row justify-between">
        <q-input v-model="search" :input-style="{ fontSize: '14px' }" placeholder="Search..." filled dense debounce="300"/>
        <q-select style="width: 125px; margin-left: 10px" filled v-model="filterState" :options="options" label="State Filter" />
      </div>
    </div>

    <AddWorkloadDialog :agentsList="agentsList" v-model="addworkload" />

    <div class="q-pa-md row q-gutter-md">
      <div class="col-md-3" v-for="workload in paginatedWorkloads" :key="workload.workloadId">
        <WorkloadCard
          :workload="workload"
          :allWorkloads="workloads"
          :dependencies="dependencies"
          :sections-toggle-state="sectionsToggleState"
          @update:section-toggle-state="updateSectionToggleState" />
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
      sectionsToggleState: {},
      workloads: [],
      dependencies: [],
      agentsList: [],
      addworkload: false,
      filterState: "all",
      options: ["all", "running", "pending", "failed", "succeeded", "stopping"],
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
            console.log("loadState");
            console.log(json);
            if (json && json.workload_states && json.desired_state && json.desired_state.workloads) {
                console.log("if statement klappt");
                // combine desired state and workload states into one data structure
                var agentStateMap = json.workload_states;
                var workloads_buffer = [];
                for (const agentName in agentStateMap) {
                  var workloadStateMap = agentStateMap[agentName];
                  for (const workloadName in workloadStateMap) {
                    if (!(workloadName in this.sectionsToggleState)) {
                      this.sectionsToggleState[workloadName] = "";
                    }
                    // retrieve the execution state
                    var idStateMap = workloadStateMap[workloadName];
                    var workloadId = Object.keys(idStateMap)[0];

                    var state = idStateMap[workloadId];

                    var workload = json.desired_state.workloads[workloadName];
                    workload["workloadName"] = workloadName;
                    workload["workloadId"] = workloadId;
                    workload["state"] = state.state.toLowerCase();
                    workload["substate"] = state.substate;
                    workloads_buffer.push(workload);
                  }
                }
                if (this.workloads.length !== workloads_buffer.length) {
                  this.workloads = workloads_buffer;
                } else {
                  for (let i = 0; i < workloads_buffer.length; i++) {
                    if (this.workloads[i] !== workloads_buffer[i]) {
                      this.workloads = workloads_buffer;
                      break;
                    }
                  }
                }
                console.log("Workloads buffer wurde gesetzt");
            }
            if (this.workloads) {
                var dependencies = [];
                let agents = new Set();
                for (const workloadDefinition of this.workloads) {
                    if (workloadDefinition.dependencies) {
                        for (let [dependency, condition] of Object.entries(workloadDefinition.dependencies)) {
                            dependencies.push({
                              source: workloadDefinition.workloadName,
                              target: dependency,
                              type: condition
                            });
                        }
                    }
                    if (workloadDefinition.agent) {
                        agents.add(workloadDefinition.agent);
                    }
                }
                this.agentsList = [...agents];
                this.agentsList = this.agentsList.sort((a, b) => a.localeCompare(b))
                EventBus.emit('update-dependencies', dependencies);
            }
          }).catch((error) => {
              console.log('There has been a problem with the fetch operation: ', error.message);
          });
    },
    toggle(id) {
      this.showConfig[id] = !this.showConfig[id];
    },
    updateSectionToggleState(newState) {
      this.sectionsToggleState = { ...newState };
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
      return this.workloads.sort((a, b) => a.workloadName.localeCompare(b.workloadName));
    },
    filteredWorkloads() {
      if (!this.search && !this.filterState) {
        return this.sortedWorkloads
      }
      return this.sortedWorkloads.filter(workload => {
        let search = this.search.toLowerCase();

        let workloadName = workload.workloadName.toLowerCase();
        let agentName = workload.agent.toLowerCase();

        if (!workload.runtimeConfig) {
          return false;
        }

        let runtimeConfig = workload.runtimeConfig.toLowerCase();

        let tagExists = false;

        if (workload.tags && workload.tags.tags) {
          tagExists = workload.tags.tags.some(item => item["key"].toLowerCase().includes(search) || item["value"].toLowerCase().includes(search));
        }

        let execStateFits = false;
        if (this.filterState == "all") {
          execStateFits = true;
        } else if (this.filterState == workload.execStateKey) {
          execStateFits = true;
        }

        return (workloadName.includes(search)
                || agentName.includes(search)
                || runtimeConfig.includes(search)
                || tagExists)
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
