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
            <q-btn rounded icon="sync_alt" color="blue" @click="currentSection = currentSection === 'dependencies' ? '' : 'dependencies'" />
            <q-btn rounded icon="settings" color="blue" @click="currentSection = currentSection === 'config' ? '' : 'config'" />
        </q-card-actions>

        </q-card-section>

        <q-separator />

        <q-slide-transition>

            <q-card-section v-if="currentSection === 'dependencies'">
                <!-- Hier kommt der Code von Oemuer hin -->
                Dependencies
            </q-card-section>

            <q-card-section v-if="currentSection === 'config'">
                This is the additional section for the card
            </q-card-section>

        </q-slide-transition>

    </q-card>
</template>

<script>
export default {
    props: ['workload'],
    data() {
        return {
            currentSection: "",
        }
    },
    methods: {

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
        }
    }
}
</script>
