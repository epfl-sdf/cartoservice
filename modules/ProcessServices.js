import React from 'react'
import { ListGroup, ListGroupItem, OverlayTrigger, Tooltip, Glyphicon } from 'react-bootstrap'
import * as _ from 'lodash'
import 'whatwg-fetch'

export default React.createClass({
    getInitialState() {
        return { services: [] }
    },
    fetchServices(process) {
        if (!_.isEmpty(process)) {
            let result = fetch(`http://128.178.116.122:31304/api/get/${process.type}/${process.id}`, {
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "omit"
            })

            result.then(res => {
                return res.json()
            }).then(json => {
                this.setState({
                    services: _.map(json.services, k => ({ id: k.ServiceId, label: k.Label}))
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
        let services = this.state.services
        return !_.isEmpty(this.props.process) && <div>
            <p>{'Services used in  \"' + this.props.process.label + '\" '}</p>
            <ListGroup>
                {services.map(
                    (item, i) => <ListGroupItem key={item.id}>{item.label}</ListGroupItem>
                ) }
            </ListGroup>
        </div>
    }
})
