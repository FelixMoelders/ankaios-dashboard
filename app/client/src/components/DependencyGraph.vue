<!-- DependencyGraph.vue -->
<template>
  <svg></svg>
</template>

<script>
// Assuming linkArc and drag are extracted to a utils file named dependencyGraph.js
import { linkArc, drag } from '../utils/dependencyGraph';
import * as d3 from 'd3';
import { EventBus } from '../utils/EventBus'
export default {
  props: {
    dependencies: Array // The dependencies are passed as props from the parent component
  },
  mounted() {
    this.drawDependencyGraph();
  },
  watch: {
    dependencies() {
      this.drawDependencyGraph();  // Redraw the graph when the data changes
    }
  },
  methods: {
    drawDependencyGraph() {
            console.log(this.dependencies);
            const width = 1500;
            const height = 800;
            const types = Array.from(new Set(this.dependencies.map(d => d.type))).sort();
            const nodes = Array.from(new Set(this.dependencies.flatMap(l => [l.source, l.target])), id => ({id}));
            const links = this.dependencies.map(d => Object.create(d))
            const customColors = ["#C10015", "#21BA45"];
            const color = d3.scaleOrdinal(types, customColors); // Added customized colors for workload states, i.e. green for ADD_COND_RUNNING and red for ADD_COND_FAILED
            d3.select("svg").selectAll("*").remove(); // delete elements in the svg for refresh.
            const simulation = d3.forceSimulation(nodes)
                .force("link", d3.forceLink(links).id(d => d.id).distance(150))
                .force("charge", d3.forceManyBody().strength(-1600))
                .force("x", d3.forceX())
                .force("y", d3.forceY());
            const svg = d3.select("svg")
                .attr("viewBox", [-width / 2, -height / 2, width, height])
                .attr("width", width)
                .attr("height", height)
                .attr("style", "max-width: 100%; height: auto; font: 18px sans-serif;");
            // Create legend
            var legend = svg.selectAll(".legend")
                .data(color.domain())
                .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
            legend.append("rect")
                .attr("x", -750)
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", color);
            legend.append("text")
                .attr("x", -725)
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
                .attr("stroke-width", 3)
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
                .attr("r", 8);
            node.append("text")
                .attr("x", 12)
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
            console.log(this.dependencies);
            // invalidation.then(() => simulation.stop());
            // let chart = Object.assign(svg.node(), {scales: {color}});
        },
    linkArc,
    drag,
  },
}
</script>
