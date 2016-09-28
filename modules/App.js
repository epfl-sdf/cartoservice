import React from 'react'
import { Grid, Row } from 'react-bootstrap'
import TopPanel from './TopPanel'
import LeftPanel from './LeftPanel'
import RightPanel from './RightPanel'
import * as _ from 'lodash'

export default React.createClass({
  getInitialState() {
    return { customs: [] }
  },
  contextTypes: {
    router: React.PropTypes.object
  },
  changeProcess(process) {
    if (!_.isEmpty(process)) {
      const { id, label, type } = process[0];
      const path = `/${type}/${id}/${label}`

      this.context.router.push(path)
    }
  },
  addCustom(custom) {
    let customs = this.state.customs
    customs.push(custom)

    this.setState({
      customs: customs
    })
  },
  render() {
    return (
      <Grid fluid>
        <TopPanel changeProcess={this.changeProcess} />
        <Row>
          <LeftPanel customs={this.state.customs} changeProcess={this.changeProcess} process={this.props.params} />
          <RightPanel addCustom={this.addCustom} process={this.props.params} />
        </Row>
      </Grid>
    )
  }
})
