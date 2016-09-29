import React from 'react'
import { Col } from 'react-bootstrap'
import * as _ from 'lodash'

import Customs from './Customs'
import ProcessServices from './ProcessServices'

export default React.createClass({
    render() {
        return (
            <Col md={3}>
                <Customs customs={this.props.customs} changeProcess={this.props.changeProcess}/>
                {this.props.process.type === 'process' && <ProcessServices process={this.props.process}/>}
            </Col>
        )
    }
})
