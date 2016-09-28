import React from 'react';
import { Navbar, Nav, NavItem, Glyphicon} from 'react-bootstrap'

export default React.createClass({
    render() {
        return <Nav bsStyle="pills">
            <NavItem eventKey={1}>
                <Glyphicon onClick={this.props.handleSave} style={{ cursor: "pointer" }} glyph="floppy-save" />
            </NavItem>
            <NavItem eventKey={2}>
                <Glyphicon onClick={this.props.zoomIn} style={{ cursor: "pointer" }} glyph="plus" />
            </NavItem>
            <NavItem eventKey={3}>
                <Glyphicon onClick={this.props.zoomOut} style={{ cursor: "pointer" }} glyph="minus" />
            </NavItem>
        </Nav>
    }
})