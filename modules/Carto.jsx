/* eslint react/prop-types: 0 */

import React from 'react';
import * as d3 from 'd3';
import * as _ from 'lodash';

import CartoMenu from './CartoMenu';

// To be redifined later to fit parent size
const w = 1000;
const h = 562;

class Carto extends React.Component {
  static drawGraph(dataset) {
    d3.selectAll('svg > *').remove();

    // init color pick
    const colors = d3.scaleOrdinal(d3.schemeCategory10);

    // init simulation
    const simulation = d3.forceSimulation(dataset.systems)
      .force('link', d3.forceLink(dataset.edges).strength(0.1))
      // .force("central", d3.forceCenter(w / 2, h / 2))
      .force('charge', d3.forceManyBody().strength([-100]))
      .force('colliding', d3.forceCollide(70));

    // init svg
    const svg = d3.select('svg#carto')
      .attr('width', w)
      .attr('height', h);

    // init edges and systems
    svg.append('svg:defs').append('svg:marker')
      .attr('id', 'triangle')
      .attr('refX', 6)
      .attr('refY', 6)
      .attr('markerWidth', 30)
      .attr('markerHeight', 30)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M 0 0 12 6 0 12 3 6')
      .style('fill', 'black');

    const edges = svg.selectAll('line.proc')
      .data(dataset.edges)
      .enter()
      .append('line')
      .style('stroke', 'black')
      .style('stroke-width', 1)
      .attr('marker-end', 'url(#triangle)');

    const systems = svg.selectAll('g')
      .data(dataset.systems)
      .enter()
      .append('g')
      .attr('class', 'node')
      .call(d3.drag()
        .on('drag', (d) => {
          if (!d.selected) {
            const event = d3.event;
            const dd = d;
            dd.fx = event.x;
            dd.fy = event.y;
            simulation.alpha(0.5).restart();
          }
        })
        .on('end', (d) => {
          if (!d.selected) {
            simulation.alpha(0.3).restart();
          }
        })
      )
      .on('click', (d) => {
        systems.each((system) => {
          const s = system;
          s.fx = null;
          s.fy = null;
        });
        const dd = d;
        dd.fx = w / 2;
        dd.fy = h / 2;
        simulation.alpha(0.3).restart();
      });

    let textBBox = [];

    systems
      .append('text')
      .attr('text-anchor', 'start')
      .attr('alignment-baseline', 'before-edge')
      .attr('transform', 'translate(20, 30)')
      // .style("font-weight", "bold")
      .text(d => d.label)
      .each(function (d) {
        const newElem = [[{
          BBox: this.getBBox(),
          systemId: d.id,
        }]];
        textBBox = textBBox.concat(newElem);
      });

    const services = systems.selectAll('text')
      .data(d => d.services)
      .enter()
      .append('text')
      .attr('text-anchor', 'start')
      .attr('alignment-baseline', 'before-edge')
      .attr('transform', (d, i) => `translate(20, ${(i + 1) * 30})`)
      .text(d => d.serv.label)
      .each(function (d) {
        const index = _.findIndex(textBBox, obj => obj[0].systemId === d.serv.systemId);
        const newElem = {
          BBox: this.getBBox(),
          systemId: d.serv.systemId,
        };
        textBBox[index] = textBBox[index].concat(newElem);
      });

    systems
      .insert('rect')
      .attr('width', (d, i) => Math.max(...(textBBox[i].map(obj => obj.BBox.width))) + (20 * 4))
      .attr('height', 20)
      .style('fill', 'none')
      .style('stroke', 'grey')
      .style('stroke-width', 1);

    systems
      .insert('rect', ':first-child')
      .attr('width', (d, i) => Math.max(...(textBBox[i].map(obj => obj.BBox.width))) + (20 * 4))
      .attr('height', (d, i) => textBBox[i].reduce((prev, curr) => prev + curr.BBox.height, 0) + Math.max(30 * (textBBox[i].length), 30))
      .style('fill', 'white')
      .style('stroke', 'darkslategrey')
      .style('stroke-width', 1);


    // horloge du système
    simulation.on('tick', () => {
      edges
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      systems
        .attr('transform', d => `translate(${d.x}, ${d.y})`);
    });
  }
  constructor(props) {
    super(props);
    this.state = { dataset: null, initialEdges: null };
    this.handleSave = this.handleSave.bind(this);
  }
  componentDidMount() {
    if (!_.isEmpty(this.props.data)) {
      Carto.drawGraph(this.parseData(this.props.data));
    }
  }
  componentWillReceiveProps(nextProps) {
    if (!_.isEmpty(nextProps)) {
      Carto.drawGraph(this.parseData(nextProps.data));
    }
  }
  handleSave(customName) {
    const dataset = this.state.dataset;
    dataset.edges = JSON.parse(this.state.initialEdges);

    const result = fetch('http://128.178.116.122:31304/api/post/custom', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'omit',
      body: JSON.stringify({ label: `${customName} (${this.props.data.process.label})`, dataset }),
    });

    result
      .then(res => res.json())
      .then(json => this.props.addCustom({ ID: json, Label: `${customName} (${this.props.data.process.label})`, type: 'custom' }))
      .catch((ex) => {
        console.log('failed', ex);
      });
  }
  parseData(data) {
    if (data.dataset) {
      this.setState({ dataset: data.dataset });
      return data.dataset;
    }

    const systems = [];
    const services = [data.process, ...data.services];

    services.forEach((serv) => {
      const sys = systems.find(s => s.id === serv.systemId);

      if (sys === undefined) {
        systems.push({
          id: serv.systemId,
          services: [{ id: 0, serv }],
          label: serv.label,
        });
      } else {
        sys.services.push({
          id: sys.services.length,
          serv,
        });
      }
    });

    const dataset = {
      systems,
      edges: systems.slice(1).map((s, i) => ({ source: 0, target: i + 1 })),
    };
    dataset.systems[0].fx = w / 2;
    dataset.systems[0].fy = h / 2;

    this.setState({ dataset });
    this.setState({ initialEdges: JSON.stringify(dataset.edges) });
    return dataset;
  }
  render() {
    return (<div>
      <div
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        <CartoMenu handleSave={this.handleSave} />
        <svg id={'carto'} />
      </div>
    </div>);
  }
}

export default Carto;
