import React, { Component } from 'react';

import { Link } from 'react-router-dom';
import { Card, Icon, Image } from 'semantic-ui-react'
import Reactlogo from '../images/react.png';

class Contents extends Component {
  render() {
    return (
      <div>
        <Card.Group>
            <Card>
                <Image src={Reactlogo} />
                <Card.Content>
                    <Card.Header>Supra</Card.Header>
                    <Card.Meta>
                        <span className='date'>Joined in 2015</span>
                    </Card.Meta>
                    <Card.Description>Matthew is a musician living in Nashville.</Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <Link to="/game">
                        <Icon name='game' />
                        Game Start
            </Link>
                </Card.Content>
            </Card>
        </Card.Group>
      </div>
    );
  }
}


export default Contents;

