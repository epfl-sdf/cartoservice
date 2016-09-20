import React from 'react';
import { Navbar, Nav, NavItem, OverlayTrigger, Tooltip, Glyphicon} from 'react-bootstrap'

export default React.createClass({
    render() {
        const tooltip = <Tooltip id="tooltip">Save changes</Tooltip>

        return <Navbar>
            <Nav>
                {this.props.modified && <NavItem eventKey={1} href="#">
                    <OverlayTrigger placement="top" overlay={tooltip}>
                        <Glyphicon onClick={this.handleSave} style={{ cursor: "pointer" }} glyph="floppy-save" /> Save file
                    </OverlayTrigger>
                </NavItem>}
            </Nav>
        </Navbar>
    }
})