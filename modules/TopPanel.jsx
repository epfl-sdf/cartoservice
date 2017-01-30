/* eslint react/prop-types: 0 */

import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Typeahead from 'react-bootstrap-typeahead';
import * as _ from 'lodash';
import 'whatwg-fetch';

class TopPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = { processes: [] };
  }
  componentDidMount() {
    const result = fetch('/api/get/processes', {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'omit',
    });

    result
      .then(res => res.json())
      .then((json) => {
        this.setState({
          processes: _.map(json, k => ({ id: k.ID, label: k.Label, type: 'process' })),
        });
      })
      .catch((ex) => {
        console.log('failed', ex);
      });
  }
  render() {
    return (
      <Row>
        <Col md={3}>
          <h5>CartoService</h5>
        </Col>
        <Col md={9}>
          <Row>
            <Col md={7}>
              <Typeahead
                align="justify"
                placeholder="Search a process"
                onChange={this.props.changeProcess}
                options={this.state.processes}
              />
            </Col>
            <Col md={5}>
              <p>&nbsp; </p>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}

export default TopPanel;
