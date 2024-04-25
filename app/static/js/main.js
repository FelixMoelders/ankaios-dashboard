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
            showLogin: false,
            showDebug: false,
            desiredState: {},
            workloadStates: [],
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
        viewDebug() {
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
            fetch('/completeState').then(response => {
                    if (!response.ok) {
                        if (response.status == 405) {
                            console.log("User not logged in. Changing to Login Page.")
                            this.changeView("login");
                        }
                        return Promise.reject(response);
                    } else {
                        return response.json();
                    }
                }).then(json => {
                    const completeState = json.response.completeState;
                    const workloads = json.response.completeState.desiredState.workloads;
                    const workloadStates = json.response.completeState.workloadStates;
                    for (const state of workloadStates) {
                        const workload = workloads[state.instanceName.workloadName];
                        state.tags = workload ? workload.tags : [];
                    }
                    this.workloadStates = workloadStates;
                    this.desiredState = completeState.desiredState;

                    console.log(workloads);
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
        getColor(value) {
            let hash = 0;
            for(let i = 0; i < value.length; i++) {
              hash = value.charCodeAt(i) + ((hash << 5) - hash);
            }
            let color = ((hash & 0x00FFFFFF) | 0x1000000).toString(16).substring(1);
            return `#${color}`;
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