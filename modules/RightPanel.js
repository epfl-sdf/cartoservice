import React from 'react'
import { Col } from 'react-bootstrap';
import * as _ from 'lodash'

import Carto from './Carto'

export default React.createClass({
    getInitialState() {
        return {
            data: {}
        }
    },
    fetchServices(process) {
        if (!_.isEmpty(process)) {
            let data = {}

            let result = fetch(`http://128.178.116.122:31304/api/get/${process.type}/${process.id}`, {
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "omit"
            })

            result.then(res => {
                return res.json()
            }).then(json => {
                data.process = { id: process.id, label: process.label, systemId: json.processInfo.SystemId }
                data.services = _.map(json.services, k => ({ id: k.ServiceId, label: k.Label, systemId: k.SystemId }))

                this.setState({
                    data: data
                })
            }).catch(ex => {
                console.log('failed', ex)
            })
        }
    },
    componentDidMount() {
        this.fetchServices(this.props.process)
    },
    componentWillReceiveProps(nextProps) {
        this.fetchServices(nextProps.process)
    },
    render() {
        return <Col md={9}>
            {!_.isEmpty(this.props.process) ? <Carto data={this.state.data}/> : <h5>Please select a process or custom map</h5>}
        </Col>
    }
})
