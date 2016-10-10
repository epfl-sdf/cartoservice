/* eslint react/prop-types: 0 */

import React from 'react';
import { Nav, NavItem, Glyphicon, Modal, Button } from 'react-bootstrap';

class CartoMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showSaveModal: false, customName: null };
    this.handleChange = this.handleChange.bind(this);
    this.closeSaveModal = this.closeSaveModal.bind(this);
    this.openSaveModal = this.openSaveModal.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }
  handleChange(name, e) {
    const change = {};
    change[name] = e.target.value;
    this.setState(change);
  }
  closeSaveModal() {
    this.setState({ showSaveModal: false });
  }
  openSaveModal() {
    this.setState({ showSaveModal: true });
  }
  handleSave() {
    this.props.handleSave(this.state.customName);
    this.closeSaveModal();
  }
  render() {
    return (<div>
      <Nav bsStyle="pills">
        <NavItem eventKey={1}>
          <Glyphicon onClick={this.openSaveModal} style={{ cursor: 'pointer' }} glyph="floppy-save" />
        </NavItem>
        <NavItem eventKey={2}>
          <Glyphicon onClick={this.props.zoomIn} style={{ cursor: 'pointer' }} glyph="plus" />
        </NavItem>
        <NavItem eventKey={3}>
          <Glyphicon onClick={this.props.zoomOut} style={{ cursor: 'pointer' }} glyph="minus" />
        </NavItem>
      </Nav>
      <Modal show={this.state.showSaveModal} onHide={this.closeSaveModal}>
        <Modal.Header closeButton>
          <Modal.Title>Enter custom map label</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            value={this.state.customName}
            onChange={e => this.handleChange('customName', e)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.handleSave}>Save</Button>
        </Modal.Footer>
      </Modal>
    </div>);
  }
}

export default CartoMenu;
