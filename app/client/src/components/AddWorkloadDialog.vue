<template>
    <q-dialog v-model="showDialog" class="q-px-sm q-pb-md">
        <q-card class="bg-gray-4" style="width: 450px">
            <q-card-section class="row items-center bg-secondary">
                <div class="text-h5 text-white q-my-xs">Add Workload</div>
                <q-space />
                <q-btn icon="close" color="white" flat round dense v-close-popup @click="close" />
            </q-card-section>
            <q-card-section class="q-pa-md">
                <div class="q-gutter-md" style="max-width: 420px">

                    <q-input filled v-model.trim="workloadName" label="Workload Name" />
                    <!-- If warning is true, this will be displayed -->
                    <p v-if="warning" class="text-negative warning">Workload Name cannot be empty.</p>

                    <!-- Drop-down selection menu for pre-existing agents list-->
                    <q-select
                      filled
                      v-model="agent"
                      :options="agentsList"
                      label="Agent"
                      style="width: 300px"
                    />

                    <q-input filled v-model="runtime" label="Runtime" />

                    <q-select filled v-model="restartPolicy" :options="options" label="restartPolicy" />

                    <q-input filled v-model="tags" label="tags" />

                    <q-input v-model="runtimeConfig" label="Runtime Config" filled autogrow />

                </div>
                <q-card-actions class="row justify-end">
                    <q-btn :disable ="warning" icon="add" color="secondary" label="Add" @click="submit" v-close-popup /> <!-- disable the "Add" button in case of an empty field for workloadName -->
                </q-card-actions>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<script>
export default {
    props: {
        value: Boolean
    },
    data() {
        return {
            workloadName: "",
            agent: null,
            agentsList: ['agent_A', 'agent_B', 'agent_C'], // TO DO: Implement dynamic fetching of existing agents?
            runtimeConfig: "image: IMAGE_NAME \ncommandOptions: [\"flag\", \"value\"]",
            tags: "{\"key1\": \"value1\", \"key2\": \"value2\"}",
            restartPolicy: "NEVER",
            runtime: "podman",
            options: ["NEVER", "ALWAYS", "ON_FAILURE"],
            warning: true,
        };
    },

    watch: { // implement watching for the workloadName to enable/disable Add-button
      workloadName(value) {
        this.warning = value.trim() === '';
      }
    },

    methods: {
        submit() {
            var tags_list = [];

            if (this.tags != "") {
                var json = JSON.parse(this.tags);
                Object.keys(json).forEach(function(key) {
                    tags_list.push({"key": key, "value": json[key]});
                });
            }

            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    workloadName: this.workloadName,
                    agent: this.agent,
                    runtime: this.runtime,
                    tags: tags_list,
                    restartPolicy: this.restartPolicy,
                    runtimeConfig: this.runtimeConfig
                })
            };
            fetch('/addNewWorkload', requestOptions) //Added 'Workload Added' Message upon adding a new workload
                .then(response => { console.log(response.status)
                  this.$q.notify('Workload Added')});
        },
        close() {
            this.showDialog = false;
        }
    },
    computed: {
        showDialog: {
            get() {
                return this.value;
            },
            set(value) {
                this.$emit('input', value);
            }
        }
    }
}
</script>

<script setup>
defineOptions({
  name: "AddWorkloadDialog",
});
</script>
