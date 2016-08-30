import React from 'react'
import { ListGroup, ListGroupItem, OverlayTrigger, Tooltip, Glyphicon } from 'react-bootstrap'
import * as _ from 'lodash'

export default React.createClass({
    getInitialState() {
        return { services: [], modified: false }
    },
    fetchServices(process) {
        this.setState({
            modified: false
        })

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
                console.log(json.services);
                this.setState({
                    services: _.map(json.services, k => ({ id: k.ServiceId, label: k.Label, active: true }))
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
    toggleView(id, event) {
        let arr = this.state.services
        let index = _.findIndex(arr, { id: id })
        arr.splice(index, 1, _.set(arr[index], 'active', !arr[index].active))

        this.setState({
            services: arr,
            modified: true
        })
    },
    handleSave() {

    },
    render() {
        let services = this.state.services
        const tooltip = (
            <Tooltip id="tooltip">Save changes</Tooltip>
        );
        return !_.isEmpty(this.props.process) && <div>
            <p>{'Services used in  \"' + this.props.process.label + '\" '} {this.state.modified && <OverlayTrigger placement="top" overlay={tooltip}><Glyphicon onClick={this.handleSave} style={{cursor: "pointer"}} glyph="floppy-save" /></OverlayTrigger>}</p>
            <ListGroup>
                {services.map(
                    (item, i) => <ListGroupItem onClick={this.toggleView.bind(this, item.id) } key={item.id} active={item.active}>{item.label}</ListGroupItem>
                ) }
            </ListGroup>
        </div>
    }
})
