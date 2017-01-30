/* eslint react/prop-types: 0 */

import React from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';

class Customs extends React.Component {
  constructor(props) {
    super(props);
    this.state = { customs: [] };
  }
  componentDidMount() {
    const result = fetch('/api/get/customs', {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'omit',
    });

    result
      .then(res => res.json())
      .then((json) => {
        this.setState({
          customs: json,
        });
      }).catch((ex) => {
        console.log('failed', ex);
      });
  }
  render() {
    const customs = this.state.customs.concat(this.props.customs);

    return (<div>
      <p>Custom maps</p>
      <ListGroup>
        {customs.map(
          item => <ListGroupItem
            onClick={() => this.props.changeProcess([{ id: item.ID, label: item.Label, type: 'custom' }])}
            key={item.ID}
            active={item.ID == this.props.process.id}
          >
            {item.Label}
          </ListGroupItem>
        ) }
      </ListGroup>
    </div>);
  }
}

export default Customs;

