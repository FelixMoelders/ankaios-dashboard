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

        <div v-for="tag in workload.tags" :key="tag.key">
            <q-badge outline color="primary" :label="tag.key + ': ' + tag.value" />
        </div>

        <q-card-actions class="row justify-end">
            <q-btn rounded icon="sync_alt" color="primary" @click="currentSection = currentSection === 'dependencies' ? '' : 'dependencies'; currentWorkloadName = workload.instanceName.workloadName" />
            <q-btn rounded icon="settings" color="secondary" @click="currentSection = currentSection === 'config' ? '' : 'config'" />
        </q-card-actions>

        </q-card-section>

        <q-separator />

        <q-slide-transition>

            <q-card-section v-if="currentSection === 'dependencies'">
              <div v-for="workloadState in workloadStates.filter(ws => ws.instanceName.workloadName === currentWorkloadName)"
            :key="workloadState.instanceName.workloadName">
                <div :style="{ color: workloadState.executionState[Object.keys(workloadState.executionState)[0]] === 'RUNNING_OK' ? 'green' : 'red' }">
                  {{ workloadState.executionState[Object.keys(workloadState.executionState)[0]] }}
                </div>
                <div v-for="dependency in getDependencyText(workloadState)" :key="dependency.text" :style="{ color: dependency.status === 'match' ? 'green' : 'red' }">
                  {{ dependency.text }}
                </div>
              </div>
            </q-card-section>

            <q-card-section v-if="currentSection === 'config'">

                <ConfigSection :state="getState(workload.instanceName.workloadName)" />

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
        }

    },
    methods: {
        getState(workloadName) {
            for (let [name, definition] of Object.entries(this.desiredState.workloads)) {
                if (name == workloadName) {
                    let state = { ...definition };
                    state["name"] = name;
                    console.log(state);
                    return state;
                }
            }
        },
        deleteWorkload() {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify([this.workload.instanceName.workloadName])
            };
            fetch('/deleteWorkloads', requestOptions)
                .then(response => console.log(response.status));
        },
        chooseExecutionColor(execState) {
            console.log(execState);
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
};
</script>

<script setup>
defineOptions({
  name: "WorkloadCard",
});
</script>
