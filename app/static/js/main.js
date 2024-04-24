const app = Vue.createApp({
    data() {
        return {
            showHome: true,
            showWorkloads: false,
            showDebug: false,
            debugWindow: false,
            desiredState: {},
            workloadStates: [],
            workloadState: [],
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
            showID: false,
            dependencies: "None",
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
            this.showDebug = false;
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
            if (this.debugWindow == true) { // Depending on whether config window is opened from "Workloads" or "Debug Mode" tab, go back there upon closing.
                this.showDebug = true;
                this.showWorkloads = false;
            } else if (this.debugWindow == false) {
                this.showDebug = false;
                this.showWorkloads = true;
            };
        },

        toggleID(workloadName) {

            this.completeState;

        },




      /*  toReadableFormat(object) {
            if (typeof object !== "object") {
                return object;
            }

            let output = {}
            for (let key in object) {
                if (typeof object[key] === "object") {
                    output[key] = this.toReadableFormat(object[key]);
                } else {
                    output[key] = object[key];
                }
            }

            return output;
        }, */
  

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
        workloads() {
            console.log('workloads method triggered');
            this.showHome = false;
            this.showDebug = false;
            this.showWorkloads = true;
            this.debugWindow = false;
            
        },
        home() {
            this.showWorkloads = false;
            this.showHome = true;
            this.showDebug = false;

        },
        toReadableFormat(object) {
            this.showDebug = true;
            if (typeof object !== "object") {
                return object;
            }
    
            let output = {}
            for (let key in object) {
                if (typeof object[key] === "object") {
                    output[key] = this.toReadableFormat(object[key]);
                } else {
                    output[key] = object[key];
                }
            }
    
            return output;
        },
    
        debug() {
            //fetch('/debug')
            this.showWorkloads = false;
            this.showHome = false;
            this.showDebug = true;
            //this.showConfig = false;
            this.debugWindow = true;
            //console.log(workloadStates);
            //console.log(desiredState);
            //console.log(completeState);
    
        },

        loadState() { //changes to the loadState() method in order to catch errors such as empty/undefined/null data (e.g. when a workload is deleted)
            fetch('/completeState')
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('Network response was not ok');
                    }
                }).then(json => {
                    console.log(json); 
                    
                    let completeState = null, workloads = null, workloadStates = null;
          
                    if (json && json.response && json.response.completeState) {
                        completeState = json.response.completeState;
                        
                        if (json.response.completeState.desiredState) {
                            workloads = json.response.completeState.desiredState.workloads;
                        }
          
                        workloadStates = json.response.completeState.workloadStates;
                    }
                    
                    if (workloadStates && workloads) {
                        for (const state of workloadStates) {
                            const workload = workloads[state.instanceName.workloadName];
                            state.tags = workload ? workload.tags : [];
                            console.log(state);
                        }
                        this.workloadStates = workloadStates;
                    }
                    
                    if (completeState && completeState.desiredState) {
                        this.desiredState = completeState.desiredState;
                    }
                    
                }).catch((error) => {
                    console.log('There has been a problem with your fetch operation: ', error.message);
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
        },
        /* Check dependencies between workloads for Debug Mode visualization */

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
          },
          
          getDependencyText() {
            return (workloadState) => {
              const equivalentStates = {
                "ADD_COND_RUNNING": "RUNNING_OK", // Not quite sure if this is intended, but it works for now. Problem is that conditions and states are named differently and there has to be some equivalency check.
                "RUNNING_OK": "ADD_COND_RUNNING"
                // more equivalencies can be added
              };
          
              if (workloadState && this.desiredState && this.desiredState.workloads && workloadState.instanceName && workloadState.instanceName.workloadName in this.desiredState.workloads) {
                let dependencies = this.desiredState.workloads[workloadState.instanceName.workloadName].dependencies;
                if (dependencies && Object.keys(dependencies).length > 0) {
                  let dependencyText = '';
                  for (let dependency in dependencies) {
                    let workload = this.workloadStates.find(workload => workload.instanceName.workloadName === dependency);
                    if (workload && workload.executionState) {
                       // If the dependent workload exists in workloadStates list
                      let desiredValue = dependencies[dependency];
                      let actualValue = workload.executionState[Object.keys(workload.executionState)[0]];
                      let actualMappedValue = equivalentStates[actualValue] || actualValue;
                      if (actualMappedValue === desiredValue) {
                        dependencyText += dependency + ' -> ' + desiredValue + ' is a match';
                      } else {
                        dependencyText += dependency + ' -> ' + desiredValue + ' does not match current state ' + actualMappedValue;
                      }
                    } else {
                      // If the dependent workload is missing from workloadStates list
                      let value = dependencies[dependency];
                      dependencyText += dependency + ' -> ' + value + ' is missing';
                    }
                  }
                  return dependencyText; // <-- It will return dependency text after checking and forming the text for all dependencies
                }
              }
              return "No dependencies";
            }
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