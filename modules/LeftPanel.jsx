/* eslint react/prop-types: 0 */

import React from 'react';
import { Col } from 'react-bootstrap';

import Customs from './Customs';
import ProcessServices from './ProcessServices';

const LeftPanel = props => <Col md={3}>
  <Customs
    process={props.process}
    customs={props.customs}
    changeProcess={props.changeProcess}
  />
  {props.process.type === 'process' && <ProcessServices process={props.process} />}
</Col>;

export default LeftPanel;
