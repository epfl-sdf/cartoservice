import React from 'react'
import { ListGroup, ListGroupItem } from 'react-bootstrap'
import * as _ from 'lodash'

export default React.createClass({
    componenentDidMount(){
        console.log("Fetch custom maps");
    },
    render() {
        return (
            <div>
                <p>Custom maps</p>
                <ListGroup>
                    <ListGroupItem onClick={() => this.props.changeProcess([{ id: 1, label: "test1", type: "custom" }]) }>Custom #1</ListGroupItem>
                    <ListGroupItem onClick={() => this.props.changeProcess([{ id: 2, label: "test2", type: "custom" }]) }>Custom #2</ListGroupItem>
                    <ListGroupItem onClick={() => this.props.changeProcess([{ id: 3, label: "test3", type: "custom" }]) }>Custom #3</ListGroupItem>
                </ListGroup>
            </div>
        )
    }
})
