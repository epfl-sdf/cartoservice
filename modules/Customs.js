import React from 'react'
import { ListGroup, ListGroupItem } from 'react-bootstrap'
import * as _ from 'lodash'

export default React.createClass({
    getInitialState() {
        return { customs: [] }
    },
    componentDidMount() {
        let result = fetch(`http://128.178.116.122:31304/api/get/customs`, {
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "omit"
        })

        result.then(res => {
            return res.json()
        }).then(json => {
            this.setState({
                customs: json
            })
        }).catch(ex => {
            console.log('failed', ex)
        })
    },
    render() {
        let customs = this.state.customs.concat(this.props.customs)

        return <div>
            <p>Custom maps</p>
            <ListGroup>
                {customs.map(
                    (item, i) => <ListGroupItem onClick={() => this.props.changeProcess([{ id: item.ID, label: item.Label, type: "custom" }]) } key={item.id} active={true}>{item.Label}</ListGroupItem>
                ) }
            </ListGroup>
        </div>
    }
})
