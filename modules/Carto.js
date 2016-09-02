import React from 'react';
import * as d3 from 'd3';

// To be redifined later to fit parent size
const w = 1000, h = 562;

export default React.createClass({
    render() {
        return (
            <div style={{
                width: '100%',
                height: '100%'
            }}>
                <svg id="carto" ></svg>
            </div>
        );
    },
    componentDidMount() {
        if (!_.isEmpty(this.props.data)) {
            this.drawGraph(this.parseData(this.props.data))
        }
    },
    componentWillReceiveProps(nextProps) {
        if (!_.isEmpty(nextProps)) {
            this.drawGraph(this.parseData(nextProps.data))
        }
    },
    parseData(data) {
        const dataset = {
            nodes: [data.process, ...data.services],
            edges: data.services.map((s, i) => {
                return { source: 0, target: i + 1 };
            }),
            sysEdge: []
        }

        dataset.nodes.forEach((n1, i1) => {
            for (var i2 = i1 + 1; i2 < dataset.nodes.length; i2++) {
                var n2 = dataset.nodes[i2];
                if (n1.systemId == n2.systemId) {
                    dataset.sysEdge = dataset.sysEdge.concat({ source: i1, target: i2 })
                }
            }
        })

        dataset.nodes[0].fx = w / 2;
        dataset.nodes[0].fy = h / 2;

        console.log(dataset);

        return dataset
    },
    clearGraph() {
        d3.selectAll("svg > *").remove()
    },
    drawGraph(dataset) {
        this.clearGraph()

        // init color pick
        var colors = d3.scaleOrdinal(d3.schemeCategory10);

        // init simulation
        var simulation = d3.forceSimulation(dataset.nodes)
            .force("link", d3.forceLink(dataset.edges).strength(0.1))
            .force("sys link", d3.forceLink(dataset.sysEdge).distance([10]))
            .force("central", d3.forceCenter(w / 2, h / 2))
            .force("charge", d3.forceManyBody().strength([-100]))
            .force("colliding", d3.forceCollide(25))

        // init svg
        var svg = d3.select("svg#carto")
            .attr("width", w)
            .attr("height", h);

        // init edges and nodes
        var edges = svg.selectAll("line.proc")
            .data(dataset.edges)
            .enter()
            .append("line")
            .style("stroke", "#ccc")
            .style("stroke-width", 1);

        var sysEdges = svg.selectAll("line.sys")
            .data(dataset.sysEdge)
            .enter()
            .append("line")
            .style("stroke", "red")
            .style("stroke-width", 1);

        var nodes = svg.selectAll("g")
            .data(dataset.nodes)
            .enter()
            .append("g")
            .attr("class", "node")
            .call(d3.drag()
                .on("drag", (d) => {
                    if (!d.selected) {
                        event = d3.event;
                        d.fx = event.x;
                        d.fy = event.y;
                        simulation.alpha(0.5).restart();
                    }
                })
                .on("end", (d) => {
                    if (!d.selected) {
                        simulation.alpha(0.3).restart();
                    }
                })
            )
            .on("click", (d) => {
                nodes.each((d) => { d.fx = null; d.fy = null })
                d.fx = w / 2;
                d.fy = h / 2;
                simulation.alpha(0.3).restart();
            })

        /*nodes
            .append("circle")
            .attr("r", 10)
            .style("fill", (d, i) => {
                return colors(i);
            });*/
        
        nodes
            .append("text")
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle")
            .text((d) => {
                return d.label;
            });
        

        // horloge du système
        simulation.on("tick", function () {
            edges
                .attr("x1", function (d) { return d.source.x; })
                .attr("y1", function (d) { return d.source.y; })
                .attr("x2", function (d) { return d.target.x; })
                .attr("y2", function (d) { return d.target.y; });

            sysEdges
                .attr("x1", function (d) { return d.source.x; })
                .attr("y1", function (d) { return d.source.y; })
                .attr("x2", function (d) { return d.target.x; })
                .attr("y2", function (d) { return d.target.y; });

            nodes
                .attr("transform", function (d) { return `translate(${d.x}, ${d.y})`; })
        });
    }
})