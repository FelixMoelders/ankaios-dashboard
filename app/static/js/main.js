function linkArc(d) {
    const r = Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y);
    return `
      M${d.source.x},${d.source.y}
      A${r},${r} 0 0,1 ${d.target.x},${d.target.y}
    `;
}

drag = simulation => {
  
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    
    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }
    
    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
    
    return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
}

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
            workloadDependencies: [],
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
        viewWorkloads() {
            console.log('workloads method triggered');
            this.showHome = false;
            this.showDebug = false;
            this.showWorkloads = true;
            this.debugWindow = false;
            this.changeView("workloads");
            
        },
        changeView(viewName) {
            this.showWorkloads = false;
            this.showHome = true;
        },
        viewLogin() {
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
                this.changeView("login");
        },

       
        viewHome() {
            this.changeView("home");
        },


        viewDebug() {
            //fetch('/debug')
            this.showWorkloads = false;
            this.showHome = false;
            this.showDebug = true;
            //this.showConfig = false;
            this.debugWindow = true;
            //console.log(workloadStates);
            //console.log(desiredState);
            //console.log(completeState);
            this.changeView("debug");
        },

        changeView(viewName) {
            this.showWorkloads = false;
            this.showHome = false;
            this.showLogin = false;
            this.showDebug = false;

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
                case "debug":
                    this.showDebug = true;
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
                    
                    if (completeState && completeState.desiredState) {
                        this.desiredState = completeState.desiredState;
                    }
                    
                }).catch((error) => {
                    console.log('There has been a problem with your fetch operation: ', error.message);

                    for (let [workloadName, workdloadDefinition] of Object.entries(workloads)) {
                        if ("dependencies" in workdloadDefinition) {
                            for (let [dependency, condition] of Object.entries(workdloadDefinition.dependencies)) {
                                this.workloadDependencies.push({
                                    source: workloadName, 
                                    target: dependency, 
                                    type: condition
                                });
                            }
                        }
                    }
                    console.log(this.workloadDependencies);
                });
          },

          getColor(value) { // Updated colored background for tags so that colors do not get too dark for legibility of black text
            let hash = 0;
            for (let i = 0; i < value.length; i++) {
                hash = value.charCodeAt(i) + ((hash << 5) - hash);
            }
        
            // Split hash into R, G, and B values
            let r = (hash & 0xFF0000) >> 16;
            let g = (hash & 0x00FF00) >> 8;
            let b = hash & 0x0000FF;
           
            // Scale RGB values to avoid dark colors. Here 128 ensures colors are on the brighter half of the spectrum.
            r = Math.floor((r + 256) / 2);
            g = Math.floor((g + 256) / 2);
            b = Math.floor((b + 256) / 2);
        
            // Convert R, G, B values to hexadecimal and pad with 0's if necessary
            r = r.toString(16).padStart(2, '0');
            g = g.toString(16).padStart(2, '0');
            b = b.toString(16).padStart(2, '0');
        
            return '#' + r + g + b;
        },

        drawDependencyGraph() {
            /*
                Todos:
                    - legende einfügen               
            */
            const width = 750;
            const height = 400;
            const types = Array.from(new Set(this.workloadDependencies.map(d => d.type)));
            const nodes = Array.from(new Set(this.workloadDependencies.flatMap(l => [l.source, l.target])), id => ({id}));
            const links = this.workloadDependencies.map(d => Object.create(d))
            const color = d3.scaleOrdinal(types, d3.schemeCategory10);

            d3.selectAll("g > *").remove(); // delete all g elements in order to clear the svg for refresh.

            const simulation = d3.forceSimulation(nodes)
                .force("link", d3.forceLink(links).id(d => d.id))
                .force("charge", d3.forceManyBody().strength(-400))
                .force("x", d3.forceX())
                .force("y", d3.forceY());

            const svg = d3.select("svg")
                .attr("viewBox", [-width / 2, -height / 2, width, height])
                .attr("width", width)
                .attr("height", height)
                .attr("style", "max-width: 100%; height: auto; font: 12px sans-serif;");
            
            // Create legend
            var legend = svg.selectAll(".legend")
                .data(color.domain())
                .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

            legend.append("rect")
                .attr("x", -350)
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", color);

            legend.append("text")
                .attr("x", -325)
                .attr("y", 9)
                .attr("dy", ".35em")
                .text(function(d) { return d; });

            // Per-type markers, as they don't inherit styles.
            svg.append("defs").selectAll("marker")
                .data(types)
                .join("marker")
                .attr("id", d => `arrow-${d}`)
                .attr("viewBox", "0 -5 10 10")
                .attr("refX", 15)
                .attr("refY", -0.5)
                .attr("markerWidth", 6)
                .attr("markerHeight", 6)
                .attr("orient", "auto")
                .append("path")
                .attr("fill", color)
                .attr("d", "M0,-5L10,0L0,5");

            const link = svg.append("g")
                .attr("fill", "none")
                .attr("stroke-width", 1.5)
                .selectAll("path")
                .data(links)
                .join("path")
                .attr("stroke", d => color(d.type))
                .attr("marker-end", d => `url(${new URL(`#arrow-${d.type}`, location)})`);

            const node = svg.append("g")
                .attr("fill", "currentColor")
                .attr("stroke-linecap", "round")
                .attr("stroke-linejoin", "round")
                .selectAll("g")
                .data(nodes)
                .join("g")
                .call(drag(simulation));

            node.append("circle")
                .attr("stroke", "white")
                .attr("stroke-width", 1.5)
                .attr("r", 4);

            node.append("text")
                .attr("x", 8)
                .attr("y", "0.31em")
                .text(d => d.id)
                .clone(true).lower()
                .attr("fill", "none")
                .attr("stroke", "white")
                .attr("stroke-width", 3);

            simulation.on("tick", () => {
                link.attr("d", linkArc);
                node.attr("transform", d => `translate(${d.x},${d.y})`);
            });

            // invalidation.then(() => simulation.stop());
            // let chart = Object.assign(svg.node(), {scales: {color}});
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
            if (this.showWorkloads) {
                this.loadState();
            }
        }, 2000)
    },
    beforeDestroy() {
        clearInterval(this.timer)
    }
})