/* eslint react/prop-types: 0 */

import React from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import * as _ from 'lodash';
import 'whatwg-fetch';

class ProcessServices extends React.Component {
  constructor(props) {
    super(props);
    this.state = { services: [] };
  }
  componentDidMount() {
    this.fetchServices(this.props.process);
  }
  componentWillReceiveProps(nextProps) {
    this.fetchServices(nextProps.process);
  }
  fetchServices(process) {
    if (!_.isEmpty(process)) {
      const result = fetch(`http://128.178.116.122:31304/api/get/${process.type}/${process.id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'omit',
      });

      result
        .then(res => res.json())
        .then((json) => {
          this.setState({
            services: _.map(json.services, k => ({ id: k.ServiceId, label: k.Label })),
          });
        }).catch((ex) => {
          console.log('failed', ex);
        });
    }
  }
  render() {
    const services = this.state.services;
    return !_.isEmpty(this.props.process) && <div>
      <p>{`Services used in  \"${this.props.process.label}\" `}</p>
      <ListGroup>
        {services.map(
          item => <ListGroupItem key={item.id}>{item.label}</ListGroupItem>
        ) }
      </ListGroup>
    </div>;
  }
}

export default ProcessServices;
