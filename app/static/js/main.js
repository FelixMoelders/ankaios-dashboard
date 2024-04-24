const app = Vue.createApp({
    data() {
        return {
            showHome: true,
            showWorkloads: false,
            showLogin: false,
            desiredState: {},
            workloadStates: [],
            timer: null,
            checkedWorkloads: [],
            isFormOpen: false,
            workloadName: "",
            showConfig: false,
            config: {},
            tags: "",
            agent: "agent_A",
            runtime: "podman",
            restartPolicy: "NEVER",
            runtimeConfig: "image: docker.io/library/nginx\ncommandOptions: [\"-p\", \"8080:80\"]",
            filterTag: '', // Filter Tag for dashboard gets written/updated here
            password: "",
        };
    },
    methods: {
        applyConfig() {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    workloadName: this.config.workloadName,
                    agent: this.config.agent,
                    runtimeConfig: this.config.runtimeConfig,
                    restartPolicy: this.config.restartPolicy,
                    runtime: this.config.runtime,
                    tags: this.config.tags
                })
            };
            fetch('/updateConfig', requestOptions)
                .then(response => console.log(response.status));
            this.config.edit = false;
        },
        switchEdit() {
            this.config.edit = !this.config.edit;
        },
        openConfig(workloadName) {
            this.showConfig = true;
            this.showWorkloads = false;
            this.config.edit = false;
            this.config.workloadName = workloadName;
            this.config.agent = this.desiredState.workloads[workloadName].agent;
            this.config.runtimeConfig = this.desiredState.workloads[workloadName].runtimeConfig;
            this.config.runtime = this.desiredState.workloads[workloadName].runtime;
            this.config.restartPolicy = this.desiredState.workloads[workloadName].restartPolicy;
            this.config.tags = this.desiredState.workloads[workloadName].tags;
            console.log(this.config.tags);
        },
        closeConfig() {
            this.config.edit = false;
            this.showConfig = false;
            this.showWorkloads = true;
        },
        switchForm() {
            this.isFormOpen = !this.isFormOpen;
        },
        closeForm() {
            this.isFormOpen = false;
        },
        addWorkload() {
            var json = JSON.parse(this.tags);
            var tags_list = [];
            Object.keys(json).forEach(function(key) {
                tags_list.push({"key": key, "value": json[key]});
            });
            console.log(tags_list);

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
        login() {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({password: this.password})
            };
            fetch('/login', requestOptions)
                .then(response => {
                    if (response.status == 200) {
                        this.changeView("workloads");
                    }
                });
        },
        viewWorkloads() {
            this.changeView("workloads");
        },
        viewHome() {
            this.changeView("home");
        },
        viewLogin() {
            this.changeView("login");
        },
        changeView(viewName) {
            this.showWorkloads = false;
            this.showHome = false;
            this.showLogin = false;
            switch (viewName) {
                case "home":
                    this.showHome = true;
                    break;
                case "login":
                    this.showLogin = true;
                    break;
                case "workloads":
                    this.showWorkloads = true;
                    break;
            }
        },
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
                    this.workloadStates = workloadStates;
                    this.desiredState = completeState.desiredState;
                });
        },

        getColor(value) {
            let hash = 0;
            for(let i = 0; i < value.length; i++) {
              hash = value.charCodeAt(i) + ((hash << 5) - hash);
            }
            let color = ((hash & 0x00FFFFFF) | 0x1000000).toString(16).substring(1);
            return `#${color}`;
          },


    },

    computed: { // Filter functionality is implemented here. If either key or value of the filterTag are existing in a workload, it gets displayed, otherwise hidden in the dashboard.
        filteredWorkloads() {
            const filterTagLower = this.filterTag.toLowerCase();
            return this.workloadStates.filter(workload => {
                if(filterTagLower === '') { // Is filterTagLower an empty string?
                    // if yes, return all workloads
                    return true;
                } else if(workload.tags) {  // if no, filter workloads by the tag, considering only workloads with tags
                    return workload.tags.some(tag => tag.key.toLowerCase().includes(filterTagLower) || tag.value.toLowerCase().includes(filterTagLower));
                } else {
                    // if the workload has no tags, and there's some filter, it should not be visible
                    return false;
                }
            });
        }

    },

    mounted() {
        this.timer = setInterval(() => {
            if (this.showWorkloads) {
                this.loadState();
            }
        }, 2000)
    },
    beforeDestroy() {
        clearInterval(this.timer)
    }
})