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
            <q-btn rounded icon="sync_alt" color="primary" @click="currentSection = currentSection === 'dependencies' ? '' : 'dependencies'" />
            <q-btn rounded icon="settings" color="secondary" @click="currentSection = currentSection === 'config' ? '' : 'config'" />
        </q-card-actions>

        </q-card-section>

        <q-separator />

        <q-slide-transition>

            <q-card-section v-if="currentSection === 'dependencies'">
                <!-- Hier kommt der Code von Oemuer hin -->
                Dependencies
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
    props: ['workload', 'desiredState'],
    data() {
        return {
            confirm: false,
            currentSection: "",
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
        }
    },
    computed: {
        lastItemOfExecState() {
            const keys = Object.keys(this.workload.executionState);
            const lastKey = keys[keys.length - 1];
            return lastKey;
        }
    },
}
</script>

<script setup>
defineOptions({
  name: "WorkloadCard",
});
</script>
