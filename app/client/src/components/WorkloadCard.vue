<template>
    <q-card class="bg-gray-4">

        <q-card-section>

        <div class="row justify-between items-center">
            <div>
                <q-badge rounded :color="chooseExecutionColor(lastItemOfExecState)" class="q-mr-sm" />{{lastItemOfExecState}}
            </div>
            <q-btn flat round icon="close" size="xs" color="negative" @click="confirm = true" />
        </div>

        <div class="row justify-between items-center">
            <div class="text-h6">{{workload.instanceName.workloadName}}</div>
            <div>{{workload.instanceName.agentName}}</div>
        </div>

        <q-separator />

        <div v-for="tag in desiredState.workloads[workload.instanceName.workloadName].tags" :key="tag.key">
            <q-badge color="secondary" :label="tag.key + ': ' + tag.value" />
        </div>

        <q-card-actions class="row justify-end">
            <q-btn rounded icon="mediation" color="primary small" @click="currentSection = currentSection === 'dependencies' ? '' : 'dependencies'" />
            <q-btn rounded icon="settings" color="secondary small" @click="currentSection = currentSection === 'config' ? '' : 'config'" />
        </q-card-actions>

        </q-card-section>

        <q-separator />

        <q-slide-transition>
            <q-card-section v-if="currentSection === 'dependencies'">
              <div v-for="workloadState in workloadStates.filter(ws => ws.instanceName.workloadName === currentWorkloadName)"
                :key="workloadState.instanceName.workloadName">
                <div>
                  <q-badge rounded :color="getExecutionStateColor(workloadState.executionState[Object.keys(workloadState.executionState)[0]])" class="q-mr-sm" />
                  {{ workloadState.executionState[Object.keys(workloadState.executionState)[0]] }}
                </div>
                <div v-for="dependency in getDependencyText(workloadState)" :key="dependency.text" >
                  <q-badge rounded :color="dependency.status === 'match' ? 'positive' : 'negative'" class="q-mr-sm" /> {{ dependency.text }}
                </div>
              </div>
            </q-card-section>

            <q-card-section v-if="currentSection === 'config'">

                <ConfigSection :state="state" />

            </q-card-section>

        </q-slide-transition>

    </q-card>

    <q-dialog v-model="confirm" persistent>
        <q-card>
            <q-card-section class="row items-center">
                <q-avatar icon="warning" size="xs" color="primary" text-color="white" />
                <span class="q-ml-sm">You are about to delete "{{ workload.instanceName.workloadName }}"</span>
            </q-card-section>

            <q-card-actions align="right">
                <q-btn flat label="Cancel" color="primary" v-close-popup />
                <q-btn flat label="Delete" color="negative" @click="deleteWorkload" v-close-popup />
            </q-card-actions>
        </q-card>
    </q-dialog>

</template>

<script>
import ConfigSection from './ConfigSection.vue'

export default {
    props: ['workload', 'desiredState', 'dependencies', 'workloadStates'],
    data() {
        return {
            confirm: false,
            currentSection: "",
            currentWorkloadName: "",
            workloadState: [],
            state: {runtimeConfig: "test"},
        }

    },
    methods: {
      getExecutionStateColor(state) { // Display icons in workload card dependency view in corresponding colors
        if (state === 'RUNNING_OK') { // includes more detailed substate descriptions than method "chooseExecutionColor(execState)" below. Could be simplified to remove redundant code.
            return 'positive';
        }

        if (state === 'PENDING_WAITING_TO_START') { // In case of a state 'PENDING_WAITING_TO_START' the icon is yellow, more states can be added.
            return 'yellow';
        }

        return 'negative';
       },
        deleteWorkload() {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify([this.workload.instanceName.workloadName])
            };
            fetch('/deleteWorkloads', requestOptions)
                .then(response => { console.log(response.status);
                      EventBus.emit('workload-deleted')}); // Add emission of status "workload deleted", so that Home View can immediately get an update on the deletion status
        },
        chooseExecutionColor(execState) {
            switch (execState) {
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
                            let actualValue = workload.executionState[Object.keys(workload.executionState)[0]];
                            let actualMappedValue = equivalentStates[actualValue] || actualValue;
                            if (actualMappedValue === desiredValue) {
                                dependenciesList.push({text: `${dependency} -> ${desiredValue} is a match`, status: 'match'});
                            } else {
                                dependenciesList.push({text: `${dependency} -> ${desiredValue} does not match current state ${actualMappedValue}`, status: 'no-match'});
                            }
                        } else {
                            let value = dependencies[dependency];
                            dependenciesList.push({text: `${dependency} -> ${value} is missing`, status: 'missing'});
                        }
                    }
                }
            }
            dependenciesList = dependenciesList.sort((a, b) => a.text.localeCompare(b.text));
            return (dependenciesList.length > 0)? dependenciesList : [{text: "No dependencies", status: 'match'}];
        },
        handleDependencyButtonClick() {
            this.currentSection = this.currentSection === 'dependencies' ? '' : 'dependencies';
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
    computed: {
        lastItemOfExecState() {
            const keys = Object.keys(this.workload.executionState);
            const lastKey = keys[keys.length - 1];
            return lastKey;
        }
  },
  mounted() {
    this.currentWorkloadName = this.workload.instanceName.workloadName;

    for (let [name, definition] of Object.entries(this.desiredState.workloads)) {
        definition = {...definition};
        if (name === this.currentWorkloadName) {
            this.state = JSON.parse(JSON.stringify(definition));
            this.state["name"] = name;
            break;
        }
    }
  }
};
</script>

<script setup>
defineOptions({
  name: "WorkloadCard",
});
</script>
