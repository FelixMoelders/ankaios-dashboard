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

                    <q-input filled v-model.trim="workloadName" :input-style="{ fontSize: '14px' }" label="Workload Name" />
                    <!-- If warning (no workloadName) is true, this will be displayed -->
                    <p v-if="workloadName.trim() === '' && warning" style="color: var(--q-color-negative);" class="warning">Workload Name cannot be empty.</p>


                    <!-- Drop-down selection menu for pre-existing agents list-->
                    <q-select
                      filled
                      v-model="agent"
                      :options="agentsList"
                      label="Agent"
                      style="width: 300px"
                    />
                    <!-- If warning (no agent selected) is true, this will be displayed -->
                    <p v-if="agent == null && warning" style="color: var(--q-color-negative);" class="warning">Agent must be selected.</p>

                    <q-input filled v-model="runtime" :input-style="{ fontSize: '14px' }" label="Runtime" />

                    <q-select filled v-model="restartPolicy" :options="options" label="restartPolicy" />

                    <q-input filled v-model="tags" :input-style="{ fontSize: '14px' }" label="tags" />

                    <q-input v-model="runtimeConfig" :input-style="{ fontSize: '14px' }" label="Runtime Config" filled autogrow />

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
        value: Boolean,
        agentsList: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            workloadName: "",
            agent: null,
            runtimeConfig: "image: IMAGE_NAME \ncommandOptions: [\"flag\", \"value\"]",
            tags: "{\"key1\": \"value1\", \"key2\": \"value2\"}",
            restartPolicy: "NEVER",
            runtime: "podman",
            options: ["NEVER", "ALWAYS", "ON_FAILURE"],
            warning: true,
        };
    },

    watch: { // implement watching for the workloadName and agent to enable/disable Add-button
      workloadName(value) {
        this.checkWarningState();
      },
      agent(value) {
        this.checkWarningState();
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
                    runtimeConfig: this.runtimeConfig,
                    controlInterfaceAccess: {}
                })
            };
            fetch('/addNewWorkload', requestOptions) //Added 'Workload Added' Message upon adding a new workload
                .then(response => { console.log(response.status)
                  this.$q.notify('Workload Added')});
        },
        close() {
            this.showDialog = false;
        },
        checkWarningState() { // method to set warning variable if workloadName is empty or agent is null
          this.warning = this.workloadName.trim() === '' || this.agent == null;
        },
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
