<template>
  <q-page class="flex flex-center">
    <div>
      <!-- Your other HTML elements here -->
      <DependencyGraph :dependencies="dependencies"></DependencyGraph>
    </div>
  </q-page>
</template>

<script>
import DependencyGraph from './DependencyGraph.vue';
import { EventBus } from '../utils/EventBus';

export default {
  components: {
    DependencyGraph
  },

  data() {
    return {
      dependencies: [], // Initialize the dependencies in your data
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
                    let completeState = null, workloads = null, workloadStates = null;

                    if (json && json.response && json.response.completeState) {
                        completeState = json.response.completeState;

                        if (json.response.completeState.desiredState) {
                            workloads = json.response.completeState.desiredState.workloads;
                        }

                        workloadStates = json.response.completeState.workloadStates;
                    }

                    if (workloadStates && workloads) {
                        for (const state of workloadStates) {
                            const workload = workloads[state.instanceName.workloadName];
                            state.tags = workload ? workload.tags : [];
                        }
                        this.workloadStates = workloadStates.sort((a, b) => a.instanceName.workloadName.localeCompare(b.instanceName.workloadName));
                    }

                    if (completeState && completeState.desiredState) {
                        this.desiredState = completeState.desiredState;
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

                }).catch((error) => {
                    console.log('There has been a problem with your fetch operation: ', error.message);
                });
        },
  },

  mounted() {
  this.loadState();
  EventBus.on('update-dependencies', function (data) {
    this.dependencies = data;
    }.bind(this)
  );
  },

  beforeUnmount() {
    EventBus.off('update-dependencies');
  },
}
</script>
