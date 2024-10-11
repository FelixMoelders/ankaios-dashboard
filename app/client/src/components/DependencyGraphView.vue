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

                  if (json && json.response && json.response.completeState && json.response.completeState.workloadStates
                  && json.response.completeState.desiredState && json.response.completeState.desiredState.workloads.workloads) {
                      var completeState = json.response.completeState;

                      // combine desired state and workload states into one data structure
                      var agentStateMap = completeState.workloadStates.agentStateMap;
                      for (const agentName in agentStateMap) {
                        var workloadStateMap = agentStateMap[agentName].wlNameStateMap;
                        for (const workloadName in workloadStateMap) {
                          // retrieve the execution state
                          var idStateMap = workloadStateMap[workloadName].idStateMap;
                          var workloadId = Object.keys(idStateMap)[0];

                          var state = idStateMap[workloadId];
                          var keys = Object.keys(state);
                          var execStateKey = keys[keys.length - 1];
                          var executionState = state[execStateKey];

                          var workload = completeState.desiredState.workloads.workloads[workloadName];
                          workload["workloadName"] = workloadName;
                          workload["workloadId"] = workloadId;
                          workload["executionState"] = executionState;
                          workload["execStateKey"] = execStateKey;
                          workloads.push(workload);
                        }
                      }
                  }
                  if (workloads) {
                      var dependencies = [];
                      for (const workloadDefinition of workloads) {
                        if (Object.keys(workloadDefinition.dependencies).length > 0) {
                            for (let [dependency, condition] of Object.entries(workloadDefinition.dependencies["dependencies"])) {
                                dependencies.push({
                                  source: workloadDefinition.workloadName,
                                  target: dependency,
                                  type: condition
                                });
                            }
                        }
                      }
                      console.log(dependencies); // todo - debug output
                      EventBus.emit('update-dependencies', dependencies);
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
