import React from 'react'
import { Grid, Row } from 'react-bootstrap'
import TopPanel from './TopPanel'
import LeftPanel from './LeftPanel'
import RightPanel from './RightPanel'
import * as _ from 'lodash'

export default React.createClass({
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
  render() {
    return (
      <Grid fluid>
        <TopPanel changeProcess={this.changeProcess} />
        <Row>
          <LeftPanel changeProcess={this.changeProcess} process={this.props.params} />
          <RightPanel process={this.props.params} />
        </Row>
      </Grid>
    )
  }
})
