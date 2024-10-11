<template>
    <div>
        <div class="row full-width">
            <q-input v-model="runtimeConfig" class="full-width-item" :input-style="{ fontSize: '14px' }" filled autogrow label="Runtime Config" :readonly="!readonly" />
        </div>
        <div class="row justify-end" style="margin-top: 5px;">
            <q-toggle v-model="readonly" style="margin-right: 10px;" label="Edit"/>
            <q-btn icon="save" color="secondary" @click="applyConfig" />
        </div>
    </div>
</template>

<script>
import { ref } from 'vue'

export default {
    props: ['workload'],
    data() {
        return {
            readonly: ref(false),
            runtimeConfig: "",
        }
    },
    methods: {
        applyConfig() {
            const controlInterfaceAccess = {};
            if (this.workload.controlInterfaceAccess) {
              controlInterfaceAccess = this.workload.controlInterfaceAccess;
            }
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    workloadName: this.workload.workloadName,
                    agent: this.workload.agent,
                    runtimeConfig: this.runtimeConfig,
                    restartPolicy: this.workload.restartPolicy,
                    runtime: this.workload.runtime,
                    tags: this.workload.tags.tags,
                    controlInterfaceAccess: controlInterfaceAccess,
                    dependencies: this.workload.dependencies,
                })
            };
            fetch('/updateConfig', requestOptions)
                .then(response => console.log(response.status));
            this.readonly = false;
        },
    },
    mounted() {
      if (this.workload.runtimeConfig) {
        this.runtimeConfig = this.workload.runtimeConfig;
      } else {
        this.runtimeConfig = "";
      }
    }
}

</script>

<style>
.full-width {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.full-width-item {
    flex-grow: 1;
}
</style>

<script setup>
defineOptions({
  name: "ConfigSection",
});
</script>
