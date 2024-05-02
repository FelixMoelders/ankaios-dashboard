<template>
  <q-page padding>
    <div class="row justify-between items-center q-pa-md">
      <div class="text-h5">Debug Mode</div>
      <q-input v-model="search" placeholder="Search..." filled dense debounce="300"/>
    </div>
    <div class="q-pa-md row q-gutter-md">
      <div class="col-md-3" v-for="(workloadState, index) in workloadStates" :key="index">
        <q-card class="bg-gray-4">
          <q-card-section>
            <div class="text-h6">{{workloadState.instanceName.workloadName}}</div>
            <div>{{desiredState.workloads[workloadState.instanceName.workloadName].agent}}</div>
            <div :style="{color: workloadState.executionState[Object.keys(workloadState.executionState)[0]] === 'RUNNING_OK' ? 'green' : 'red'}">
            {{ workloadState.executionState[Object.keys(workloadState.executionState)[0]] }}</div>
            <div v-for="dependency in getDependencyText(workloadState)" :key="dependency.text" :style="{color: dependency.status === 'match' ? 'green' : 'red'}">
                {{ dependency.text }}
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
      showHome: true,
            desiredState: {},
            workloadStates: [],
            workloadState: [],
            timer: null,
            workloadName: "",
            tags: "",
            agent: "agent_A",
            dependencies: [],
            password: "",
    }
  },
  methods: {
    loadState() {
            fetch('/completeState')
                .then(response => {
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
                        }
                        this.workloadStates = workloadStates;
                    }

                    if (completeState && completeState.desiredState) {
                        this.desiredState = completeState.desiredState;
                    }

                    if (workloads) {
                        for (let [workloadName, workdloadDefinition] of Object.entries(workloads)) {
                            if ("dependencies" in workdloadDefinition) {
                                for (let [dependency, condition] of Object.entries(workdloadDefinition.dependencies)) {
                                    this.dependencies.push({
                                        source: workloadName,
                                        target: dependency,
                                        type: condition
                                    });
                                }
                            }
                        }
                        console.log(this.dependencies);
                    }

                }).catch((error) => {
                    console.log('There has been a problem with your fetch operation: ', error.message);
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

      /*  drawDependencyGraph() {
            console.log(this.dependencies);
            const width = 750;
            const height = 400;
            const types = Array.from(new Set(this.dependencies.map(d => d.type)));
            const nodes = Array.from(new Set(this.dependencies.flatMap(l => [l.source, l.target])), id => ({id}));
            const links = this.dependencies.map(d => Object.create(d))
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
        },*/

        getDependencyText(workloadState) {

const equivalentStates = {
     "ADD_COND_RUNNING": "RUNNING_OK",
     "RUNNING_OK": "ADD_COND_RUNNING"
 };

let dependenciesList = [];

if (workloadState && this.desiredState && this.desiredState.workloads && workloadState.instanceName && workloadState.instanceName.workloadName in this.desiredState.workloads) {
 let dependencies = this.desiredState.workloads[workloadState.instanceName.workloadName].dependencies;
 if (dependencies && Object.keys(dependencies).length > 0) {
   for (let dependency in dependencies) {
     let workload = this.workloadStates.find(workload => workload.instanceName.workloadName === dependency);
     if (workload && workload.executionState) {
       let desiredValue = dependencies[dependency];
       let actualValue = workload.executionState[Object.keys(workload.executionState)[0]];
       let actualMappedValue = equivalentStates[actualValue] || actualValue;
       if (actualMappedValue === desiredValue) {
          dependenciesList.push({text: `${dependency} -> ${desiredValue} is a match`, status: 'match'});
       } else {
          dependenciesList.push({text: `${dependency} -> ${desiredValue} does not match current state ${actualMappedValue}`, status: 'no-match'});
       }
     } else {
       let value = dependencies[dependency];
       dependenciesList.push({text: `${dependency} -> ${value} is missing`, status: 'missing'});
     }
   }
 }
}
return (dependenciesList.length > 0)? dependenciesList : [{text: "No dependencies", status: 'match'}];
}

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
  name: "DebugView",
});
</script>
