const app = Vue.createApp({
    data() {
        return {
            showHome: true,
            showWorkloads: false,
            workloadStates: [],
            timer: null,
            checkedWorkloads: [],
            isFormOpen: false,
            workloadName: "",
            agent: "agent_A",
            runtime: "podman",
            restartPolicy: "Never",
            runtimeConfig: "image: docker.io/library/nginx\ncommandOptions: [\"-p\", \"8080:80\"]"
        }
    },
    methods: {
        openForm() {
            this.isFormOpen = true;
        },
        closeForm() {
            this.isFormOpen = false;
        },
        addWorkload() {
            console.log('workloadName:', this.workloadName);
            console.log('runtime:', this.runtime);
            console.log('restartPolicy:', this.restartPolicy);
            console.log('runtimeConfig:', this.runtimeConfig);

            if (!this.workloadName) { // Added alert message if WorkloadName is empty in New Workload form. Bug: Unnamed Workloads result in EXECUTION STATE error and cannot be stopped.
                alert('Workload name cannot be empty.')
                return
            }

            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    workloadName: this.workloadName,
                    agent: this.agent,
                    runtime: this.runtime,
                    restartPolicy: this.restartPolicy,
                    runtimeConfig: this.runtimeConfig
                })
            };
            fetch('/addNewWorkload', requestOptions)
                .then(response => console.log(response.status));
            this.isFormOpen = false;
        },
        deleteCheckedWorkloads() {
            console.log(this.checkedWorkloads); // gibt die IDs der ausgewählten Elemente aus
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.checkedWorkloads)
            };
            fetch('/deleteWorkloads', requestOptions)
                .then(response => console.log(response.status));
            this.isFormOpen = false;
        },
        workloads() {
            this.showWorkloads = true;
            this.showHome = false;
        },
        home() {
            this.showWorkloads = false;
            this.showHome = true;
        },
        loadState() {
            fetch('/completeState')
                    .then(response => response.json())
                    .then(json => json.response.completeState.workloadStates)
                    .then((states) => {
                        this.workloadStates = states;
                    });
        }
    },
    mounted() {
        this.timer = setInterval(() => {
            this.loadState();
        }, 2000)
    },
    beforeDestroy() {
        clearInterval(this.timer)
    }
})