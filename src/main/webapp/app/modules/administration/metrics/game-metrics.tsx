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

export const GameMetrics = (props: GameMetricsProps) => {
  const [gameMetrics, setGameMetrics] = useState([]);
  const [gameManagerMetrics, setGameManagerMetrics] = useState([]);
  useEffect(() => {
    setGameMetrics(Object.entries(props.gameMetrics.game));
    setGameManagerMetrics(props.gameMetrics.manager);
  }, [props.gameMetrics]);
  return (
    <div>
      <h3><Translate contentKey="metrics.game.title">Game Metrics</Translate></h3>
      <Row>
        <Col md={12}>
          <h5><Translate contentKey="metrics.manager.title">Game manager metrics</Translate></h5>
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
      <Row>
        <Col md={12}>
          <h5><Translate contentKey="metrics.rooms.title">Game rooms load metrics</Translate></h5>
          {gameMetrics.map((it: any) => {
            return (
              <div key={it[0]}>
                <Row>
                  <Alert color="info">
                    <h6>Room <span style={{fontWeight: "bold"}}>{it[0]}</span></h6>
                    <div>
                      <div>Players active: {it[1].active}</div>
                      <Progress animated min="0" value={it[1].active} max={it[1].max} color="success">
                        <span><TextFormat value={it[1].active} type="number" format={props.numberFormat}/></span>
                      </Progress>
                    </div>
                    <div>
                      <div>Players alive: {it[1].alive}</div>
                      <Progress animated min="0" value={it[1].alive} max={it[1].max} color="success">
                        <span><TextFormat value={it[1].alive} type="number"
                                          format={props.numberFormat}/></span>
                      </Progress>
                    </div>
                    <div>
                      <div>Players dead: {it[1].dead}</div>
                      <Progress animated min="0" value={it[1].dead} max={it[1].max} color="success">
                        <span><TextFormat value={it[1].dead} type="number"
                                          format={props.numberFormat}/></span>
                      </Progress>
                    </div>
                  </Alert>
                </Row>
              </div>
            );
          })}
        </Col>
      </Row>
    </div>
  );
};

export default GameMetrics;
