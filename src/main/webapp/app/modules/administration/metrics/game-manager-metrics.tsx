import React, {useEffect, useState} from 'react';
import {Alert, Button, Card, Col, Label, Progress, Row, Table} from 'reactstrap';
import {
  GarbageCollectorMetrics,
  HttpRequestMetrics,
  JvmMemory,
  JvmThreads,
  SystemMetrics,
  TextFormat,
  Translate,
} from 'react-jhipster';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import {
  APP_TIMESTAMP_FORMAT,
  APP_TWO_DIGITS_AFTER_POINT_NUMBER_FORMAT,
  APP_WHOLE_NUMBER_FORMAT
} from 'app/config/constants';
import {useAppDispatch, useAppSelector} from 'app/config/store';
import {getSystemMetrics} from '../administration.reducer';
import {nanToZero} from "react-jhipster/src/util/number-utils";

interface GameMetricsProps {
  gameMetrics: any;
  numberFormat: string;
}

export const GameManagerMetrics = (props: GameMetricsProps) => {
  const [gameManagerMetrics, setGameManagerMetrics] = useState([]);
  useEffect(() => {
    setGameManagerMetrics(props.gameMetrics.manager);
  }, [props.gameMetrics]);
  return (
    <div>
      <h3><Translate contentKey="metrics.manager.title">Game manager metrics</Translate></h3>
      <Row>
        <Col md={12}>
          <Table striped>
            <thead>
            <tr>
              <th><Translate contentKey="metrics.metric">Metric</Translate></th>
              <th><Translate contentKey="metrics.value">Value</Translate></th>
            </tr>
            </thead>
            <tbody>
            {gameManagerMetrics.map((metric, idx) => (
              <tr key={idx}>
                <td>{metric.key}</td>
                <td className="text-end">
                  <TextFormat value={metric.value} type="number" format={props.numberFormat}/>
                </td>
              </tr>
            ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </div>
  );
};

export default GameManagerMetrics;
