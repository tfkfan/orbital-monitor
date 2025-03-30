import './home.scss';

import React from 'react';
import {Button, ButtonGroup, Col, Row} from 'reactstrap';

export const Home = () => {

  return (
    <Row>
      <Col md="12">
        <p>This is &quot;orbital&quot; monitoring and admin app</p>
        <ButtonGroup>
          <Button href="/admin/metrics" tag="a" color="secondary">Metrics</Button>
          <Button href="/admin/health" tag="a" color="success">Health</Button>
          <Button href="/game" tag="a" color="primary">Game</Button>
        </ButtonGroup>
      </Col>
    </Row>
  );
};

export default Home;
