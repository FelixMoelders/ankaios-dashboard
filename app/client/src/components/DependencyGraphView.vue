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
                  console.log("loadState");
                  console.log(json);

                  // reset workloads array
                  var workloads = [];

                  if (json && json.workload_states && json.desired_state && json.desired_state.workloads) {
                    // combine desired state and workload states into one data structure
                    var workloadStates = json.workload_states;
                    for (const agentName in workloadStates) {
                      var workloadStateMap = workloadStates[agentName];
                      for (const workloadName in workloadStateMap) {
                        // retrieve the execution state
                        var idStateMap = workloadStateMap[workloadName];
                        var workloadId = Object.keys(idStateMap)[0];

                        var state = idStateMap[workloadId];

                        var workload = json.desired_state.workloads[workloadName];
                        workload["workloadName"] = workloadName;
                        workload["workloadId"] = workloadId;
                        workload["state"] = state.state.toLowerCase();
                        workload["substate"] = state.substate;
                        workloads.push(workload);
                      }
                    }
                }
                this.dependencies = [];
                for (const workloadDefinition of workloads) {
                    if (workloadDefinition.dependencies) {
                        for (let [dependency, condition] of Object.entries(workloadDefinition.dependencies)) {
                            this.dependencies.push({
                              source: workloadDefinition.workloadName,
                              target: dependency,
                              type: condition
                            });
                        }
                    }
                }
                EventBus.emit('update-dependencies', this.dependencies);
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
