<template>
    <q-card class="bg-gray-4">
        <q-card-section>
        <div class="row justify-between items-center">
            <div v-for="(key, value) in workload.executionState" :key="key">
              <q-badge rounded color="chooseExecutionColor" class="q-mr-sm" />{{value}}
            </div>
            <q-icon name="close" color="red" />
        </div>
        <div class="row justify-between items-center">
            <div class="text-h6">{{workload.instanceName.workloadName}}</div>
            <div>{{workload.instanceName.agentName}}</div>
        </div>

        <q-separator />

        <div v-for="tag in workload.tags" :key="tag.key">
            <q-badge outline color="primary" :label="tag.key + ': ' + tag.value" />
        </div>

        <q-card-actions class="row justify-end">
          <q-btn
              rounded
              icon="mediation"
              color="blue"
              @click="currentSection = currentSection !== 'dependencies' || (currentWorkloadName !== workload.instanceName.workloadName) ? 'dependencies' : ''; currentWorkloadName = workload.instanceName.workloadName"
          />
            <q-btn rounded icon="settings" color="blue" @click="currentSection = currentSection === 'config' ? '' : 'config'" />
        </q-card-actions>

        </q-card-section>

        <q-separator />

        <q-slide-transition>

            <q-card-section v-if="currentSection === 'dependencies'">
              <div v-for="workloadState in workloadStates.filter(ws => ws.instanceName.workloadName === currentWorkloadName)"
            :key="workloadState.instanceName.workloadName">
                <div v-for="dependency in getDependencyText(workloadState)" :key="dependency.text" >
                  <q-icon name= "lens" :color="dependency.status === 'match' ? 'green' : 'red'" />
                  {{ dependency.text }}
                </div>
              </div>
            </q-card-section>

            <q-card-section v-if="currentSection === 'config'">
                This is the additional section for the card
            </q-card-section>

        </q-slide-transition>

    </q-card>
</template>

<script>

import { EventBus } from '../utils/EventBus';

export default {
    props: ['workload'],
    data() {
        return {
            currentSection: "",
            showHome: true,
            desiredState: {},
            workloadStates: [],
            workloadState: [],
            timer: null,
            workloadName: "",
            tags: "",
            agent: "agent_A",
            dependencies: [],
            password: "",
            selectedWorkload: "",
            currentWorkloadName: null,
        }

    },
    methods: {

      getDependencyText(workloadState) {

        const equivalentStates = {
          "ADD_COND_RUNNING": "RUNNING_OK",
          "RUNNING_OK": "ADD_COND_RUNNING"
        };

          let dependenciesList = [];

          if (workloadState && this.desiredState && this.desiredState.workloads && workloadState.instanceName && workloadState.instanceName.workloadName in this.desiredState.workloads) {
          let dependencies = this.desiredState.workloads[workloadState.instanceName.workloadName].dependencies;
          if (dependencies && Object.keys(dependencies).length > 0) {
            for (let dependency in dependencies) {
              let workload = this.workloadStates.find(workload => workload.instanceName.workloadName === dependency);
              if (workload && workload.executionState) {
                let desiredValue = dependencies[dependency];
                let displayValue = desiredValue === 'ADD_COND_RUNNING' ? 'Running' : desiredValue;
                let actualValue = workload.executionState[Object.keys(workload.executionState)[0]];
                let actualMappedValue = equivalentStates[actualValue] || actualValue;
                if (actualMappedValue === desiredValue) {
                    dependenciesList.push({text: `${dependency}: ${displayValue} `, status: 'match'});
                } else {
                    dependenciesList.push({text: `${dependency}: ${displayValue} does not match current state ${actualMappedValue}`, status: 'no-match'});
                }
              } else {
                let value = dependencies[dependency];
                dependenciesList.push({text: `${dependency}: ${value} is missing`, status: 'missing'});
              }
            }
          }
          }
                  dependenciesList.sort((a, b) => a.text.localeCompare(b.text));
                  return (dependenciesList.length > 0) ? dependenciesList : [{text: "No dependencies", status: 'match'}];
      },

      handleDependencyButtonClick() {
            this.selectedWorkload = this.workload.instanceName.workloadName;
            this.currentSection = this.currentSection === 'dependencies' ? '' : 'dependencies';
        },

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
    computed: {
        chooseExecutionColor() {
            const obj = (this.workload.executionState) ? this.workload.executionState : {"unkown": "unkown"};
            const keysArray = Object.keys(obj);
            const state = keysArray[0];
            console.log(state);
            switch (state) {
                case "running":
                    return "green";
                case "failed":
                    return "red";
                case "pending":
                    return "yellow";
                case "removed":
                    return "black";
                case "succeeded":
                case "unknown":
                default:
                    return "gray";
            }
        },



        checkDependency() {
            return (workloadState) => {
              const equivalentStates = {
                "ADD_COND_RUNNING": "RUNNING_OK", // Not quite sure if this is intended, but it works for now. Problem is that conditions and states are named differently and there has to be some equivalency check.
                "RUNNING_OK": "ADD_COND_RUNNING"
                // more equivalencies can be added
              };

              if (workloadState && this.desiredState && this.desiredState.workloads && workloadState.instanceName && 'workloadName' in workloadState.instanceName && workloadState.instanceName.workloadName in this.desiredState.workloads) {
                let dependencies = this.desiredState.workloads[workloadState.instanceName.workloadName].dependencies;
                if (dependencies && Object.keys(dependencies).length > 0) {
                  let allFound = true;
                  for (let dependency in dependencies) {
                    let workload = this.workloadStates.find(workload => workload.instanceName && 'workloadName' in workload.instanceName &&
                    workload.instanceName.workloadName === dependency);
                    if (workload && workload.executionState && Object.keys(workload.executionState).length > 0) {
                      let desiredValue = dependencies[dependency];
                      let actualValue = workload.executionState[Object.keys(workload.executionState)[0]];

                      if (equivalentStates[actualValue]) {
                        actualValue = equivalentStates[actualValue];
                      }

                      if (actualValue !== desiredValue) {
                        allFound = false; // A dependency doesn't match required/equivalent state
                        break;
                      }

                    } else {
                      allFound = false; // Dependency not found
                      break;
                    }
                  }

                  return allFound ? 'found' : 'missing';
                }
              }
              return false;
            }
          }
    },

    mounted() {
    this.timer = setInterval(() => {
        this.loadState();
    }, 2000);
},

beforeUnmount() {
    clearInterval(this.timer);
},

};



</script>


