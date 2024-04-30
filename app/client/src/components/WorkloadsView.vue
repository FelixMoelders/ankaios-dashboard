<template>
  <q-page padding>
    <div class="row justify-between items-center q-pa-md">
      <div class="text-h5">Workloads</div>
      <q-input v-model="search" placeholder="Search..." filled dense debounce="300"/>
    </div>
    <div class="q-pa-md row q-gutter-md">
      <div class="col-md-3" v-for="workload in filteredWorkloads" :key="workload.instanceName.workloadName">
        <q-card class="bg-gray-4">
          <q-card-section>
            <div class="text-h6">{{workload.instanceName.workloadName}}</div>
            <div>{{workload.instanceName.agentName}}</div>
            <div v-for="(key, value) in workload.executionState" :key="key">{{value}}</div>
            <div v-for="tag in workload.tags" :key="tag.key">
              <div>{{tag.key}} {{tag.value}}</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      search: '',
      workloads: [
      {
        "instanceName": {
            "workloadName": "Automatic_Climate_Control",
            "agentName": "agent_A",
            "id": "2c1588a6631024df16c430e551cf57da12045061731b34ba5010ae6792d4ced0"
        },
        "executionState": {
            "running": "RUNNING_OK"
        },
        "tags": [
            {
                "key": "Started by",
                "value": "Driver"
            },
            {
                "key": "Running in",
                "value": "AC Unit"
            }
        ]
    },
    {
        "instanceName": {
            "workloadName": "Smartphone_Music_Streaming",
            "agentName": "agent_C",
            "id": "d1cca59aa4563fc308d515457b9ed4f795ea9902e9206b7f4248425e45ef202f"
        },
        "executionState": {
            "pending": "PENDING_WAITING_TO_START"
        },
        "tags": [
            {
                "key": "Started by",
                "value": "Rear Passenger"
            },
            {
                "key": "Running in",
                "value": "Infotainment"
            }
        ]
    },
      ]
    }
  },
  methods: {
    loadState() {
      fetch('/completeState')
        .then(response => response.json())
        .then(json => {
          const completeState = json.response.completeState;
          const workloads = json.response.completeState.desiredState.workloads;
          const workloadStates = json.response.completeState.workloadStates;
          for (const state of workloadStates) {
              const workload = workloads[state.instanceName.workloadName];
              state.tags = workload ? workload.tags : [];
          }
          this.workloads = workloadStates;
          console.log(this.workloadStates);
          this.desiredState = completeState.desiredState;
        });
    },
  },
  computed: {
    filteredWorkloads() {
      if (!this.search) {
        return this.workloads
      }
      return this.workloads.filter(workload => workload.title.toLowerCase().includes(this.search.toLowerCase()) 
        || workload.description.toLowerCase().includes(this.search.toLowerCase()))
    }
  },
  mounted() {
    this.timer = setInterval(() => {
      this.loadState();
    }, 2000)
  },
  beforeUnmount() {
    clearInterval(this.timer)
  }
}
</script>

<script setup>
defineOptions({
  name: "WorkloadsView",
});
</script>