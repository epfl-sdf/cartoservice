import React from 'react'
import * as d3 from 'd3';

import CartoMenu from './CartoMenu'

// To be redifined later to fit parent size
const w = 1000, h = 562;

export default React.createClass({
    getInitialState() {
        return { dataset: null, initialEdges: null }
    },
    handleSave(customName) {
        const dataset = this.state.dataset
        dataset.edges = JSON.parse(this.state.initialEdges)

        let result = fetch('http://128.178.116.122:31304/api/post/custom', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'omit',
            body: JSON.stringify({ label: `${customName} (${this.props.data.process.label})`, dataset: dataset })
        })

        result
            .then(res => {
                return res.json()
            })
            .then(json => {
                this.props.addCustom({ ID: json, Label: `${customName} (${this.props.data.process.label})`, type: 'custom' })
            })
            .catch(ex => {
                console.log('failed', ex)
            })
    },
    render() {
        return <div>
            <div style={{
                width: '100%',
                height: '100%'
            }}>
                <CartoMenu handleSave={this.handleSave} />
                <svg id={"carto"} />
            </div>
        </div>
    },
    componentDidMount() {
        if (!_.isEmpty(this.props.data) && _.isEmpty(this.props.dataset)) {
            this.drawGraph(this.parseData(this.props.data))
        }
    },
    componentWillReceiveProps(nextProps) {
        if (!_.isEmpty(nextProps) && _.isEmpty(this.props.dataset)) {
            this.drawGraph(this.parseData(nextProps.data))
        }
    },
    parseData(data) {
	if (data.dataset) {
            this.setState({ dataset: data.dataset })
            return data.dataset
        } else {
            var systems = []
            var services = [data.process, ...data.services]

            services.forEach((serv) => {
                var sys = systems.find((s) => {
                    return s.id === serv.systemId
                });

                if (sys === undefined) {
                    systems.push({
                        id: serv.systemId,
                        services: [{id: 0, serv: serv}],
                        label: serv.label
                    })
                } else {
                    sys.services.push({
                            id: sys.services.length,
                            serv: serv
                        })
                }
            })

            const dataset = {
                systems: systems,
                edges: systems.slice(1).map((s, i) => {
                    return { source: 0, target: i+1 }
                })
            }
            dataset.systems[0].fx = w / 2;
            dataset.systems[0].fy = h / 2;

            this.setState({ dataset: dataset })
            this.setState({ initialEdges: JSON.stringify(dataset.edges) })
            return dataset
        }
    },
    clearGraph() {
        d3.selectAll("svg > *").remove()
    },
    drawGraph(dataset) {
        this.clearGraph()

        // init color pick
        var colors = d3.scaleOrdinal(d3.schemeCategory10)

        // init simulation
        var simulation = d3.forceSimulation(dataset.systems)
            .force("link", d3.forceLink(dataset.edges).strength(0.1))
            .force("central", d3.forceCenter(w / 2, h / 2))
            .force("charge", d3.forceManyBody().strength([-100]))
            .force("colliding", d3.forceCollide(70))

        // init svg
        var svg = d3.select("svg#carto")
            .attr("width", w)
            .attr("height", h)

        // init edges and systems
        svg.append("svg:defs").append("svg:marker")
            .attr("id", "triangle")
            .attr("refX", 6)
            .attr("refY", 6)
            .attr("markerWidth", 30)
            .attr("markerHeight", 30)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M 0 0 12 6 0 12 3 6")
            .style("fill", "black")
        
        var edges = svg.selectAll("line.proc")
            .data(dataset.edges)
            .enter()
            .append("line")
            .style("stroke", "black")
            .style("stroke-width", 1)
            .attr("marker-end", "url(#triangle)")

        var systems = svg.selectAll("g")
            .data(dataset.systems)
            .enter()
            .append("g")
            .attr("class", "node")
            .call(d3.drag()
                .on("drag", (d) => {
                    if (!d.selected) {
                        event = d3.event;
                        d.fx = event.x;
                        d.fy = event.y;
                        simulation.alpha(0.5).restart()
                    }
                })
                .on("end", (d) => {
                    if (!d.selected) {
                        simulation.alpha(0.3).restart()
                    }
                })
            )
            .on("click", (d) => {
                systems.each((d) => { d.fx = null; d.fy = null })
                d.fx = w / 2;
                d.fy = h / 2;
                simulation.alpha(0.3).restart()
            })
        
        let textWidth = []
        systems
            .append("text")
            .attr("text-anchor", "start")
            .attr("alignment-baseline", "before-edge")  
            .attr("transform", (d, i) => `translate(10, 10)`)         
            .text(d => d.label)
            .each(function(d) {
                let newElem = [[{
                    BBox: this.getBBox(),
                    systemId: d.id
                }]]
                textWidth = textWidth.concat(newElem)
            })

        var services = systems.selectAll("text")
            .data(d => d.services)
            .enter()
            .append("text")
            .text(d => d.serv.label)
            .attr("transform", (d, i) => `translate(10, ${10 + i * 30})`)
            .each(function(d) {
                let index = _.findIndex(textWidth, obj => obj[0].systemId === d.serv.systemId)
                let newElem = {
                    BBox: this.getBBox(),
                    systemId: d.serv.systemId
                }
                textWidth[index] = textWidth[index].concat(newElem)
            })

         systems
            .insert("rect", ":first-child")
            .attr("width", (d, i) => Math.max(...(textWidth[i].map(obj => obj.BBox.width))) + 20)
            .attr("height", (d, i) => textWidth[i].reduce((prev, curr) => prev + curr.BBox.height, 0) + 20)
            .attr("rx", 10)
            .attr("ry", 10)
            .attr("class", "system")

        // horloge du système
        simulation.on("tick", function () {
            edges
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y)

            systems
                .attr("transform", d => `translate(${d.x}, ${d.y})`)
        })
    }
})
