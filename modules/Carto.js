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
                        services: [{ id: 0, serv: serv }],
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
                    return { source: 0, target: i + 1 }
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
            //.force("central", d3.forceCenter(w / 2, h / 2))
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
                        let event = d3.event;
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

        let textBBox = []

        systems
            .append("text")
            .attr("text-anchor", "start")
            .attr("alignment-baseline", "before-edge")
            .attr("transform", (d, i) => `translate(20, 30)`)
            //.style("font-weight", "bold")
            .text(d => d.label)
            .each(function (d) {
                let newElem = [[{
                    BBox: this.getBBox(),
                    systemId: d.id
                }]]
                textBBox = textBBox.concat(newElem)
            })

        var services = systems.selectAll("text")
            .data(d => d.services)
            .enter()
            .append("text")
            .attr("text-anchor", "start")
            .attr("alignment-baseline", "before-edge")
            .attr("transform", (d, i) => `translate(20, ${(i+1) * 30})`)
            .text(d => d.serv.label)
            .each(function (d) {
                let index = _.findIndex(textBBox, obj => obj[0].systemId === d.serv.systemId)
                let newElem = {
                    BBox: this.getBBox(),
                    systemId: d.serv.systemId
                }
                textBBox[index] = textBBox[index].concat(newElem)
            })

        systems
            .insert("rect")
            .attr("width", (d, i) => Math.max(...(textBBox[i].map(obj => obj.BBox.width))) + 20 * 4)
            .attr("height", 20)
            .style("fill", "none")
            .style("stroke", "grey")
            .style("stroke-width", 1)

        // BUTTON 1
        systems
            .insert("rect")
            .attr("width", 15)
            .attr("height", 15)
            .attr("transform", (d, i) => `translate(${Math.max(...(textBBox[i].map(obj => obj.BBox.width))) + 20 * 4 - 77.5}, 2.5)`)
            .style("fill", "orange")
            .style("stroke", "grey")
            .style("stroke-width", 1)
            .on("click", () => {alert("Button 1")})

        // BUTTON 2
        systems
            .insert("rect")
            .attr("width", 15)
            .attr("height", 15)
            .attr("transform", (d, i) => `translate(${Math.max(...(textBBox[i].map(obj => obj.BBox.width))) + 20 * 4 - 57.5}, 2.5)`)
            .style("fill", "red")
            .style("stroke", "grey")
            .style("stroke-width", 1)
            .on("click", () => {alert("Button 2")})

        // BUTTON 3
        systems
            .insert("rect")
            .attr("width", 15)
            .attr("height", 15)
            .attr("transform", (d, i) => `translate(${Math.max(...(textBBox[i].map(obj => obj.BBox.width))) + 20 * 4 - 37.5}, 2.5)`)
            .style("fill", "violet")
            .style("stroke", "grey")
            .style("stroke-width", 1)
            .on("click", () => {alert("Button 3")})

        // BUTTON 4
        systems
            .insert("rect")
            .attr("width", 15)
            .attr("height", 15)
            .attr("transform", (d, i) => `translate(${Math.max(...(textBBox[i].map(obj => obj.BBox.width))) + 20 * 4 - 17.5}, 2.5)`)
            .style("fill", "blue")
            .style("stroke", "grey")
            .style("stroke-width", 1)
            .on("click", () => {alert("Button 4")})

        systems
            .insert("rect", ":first-child")
            .attr("width", (d, i) => Math.max(...(textBBox[i].map(obj => obj.BBox.width))) + 20 * 4)
            .attr("height", (d, i) => textBBox[i].reduce((prev, curr) => prev + curr.BBox.height, 0) + Math.max(30 * (textBBox[i].length), 30))
            .style("fill", "white")
            .style("stroke", "darkslategrey")
            .style("stroke-width", 1)


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
