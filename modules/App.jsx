/* eslint react/prop-types: 0 */

import React from 'react';
import { withRouter } from 'react-router';
import { Grid, Row } from 'react-bootstrap';
import * as _ from 'lodash';

import TopPanel from './TopPanel';
import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { customs: [] };
    this.changeProcess = this.changeProcess.bind(this);
    this.addCustom = this.addCustom.bind(this);
  }
  changeProcess(process) {
    if (!_.isEmpty(process)) {
      const { id, label, type } = process[0];
      const path = `/${type}/${id}/${label}`;

      this.props.router.push(path);
    }
  }
  addCustom(custom) {
    const customs = this.state.customs;
    customs.push(custom);

    this.setState({
      customs,
    });
  }
  render() {
    return (
      <Grid fluid>
        <TopPanel changeProcess={this.changeProcess} />
        <Row>
          <LeftPanel
            customs={this.state.customs}
            changeProcess={this.changeProcess}
            process={this.props.params}
          />
          <RightPanel addCustom={this.addCustom} process={this.props.params} />
        </Row>
      </Grid>
    );
  }
}

export default withRouter(App);
