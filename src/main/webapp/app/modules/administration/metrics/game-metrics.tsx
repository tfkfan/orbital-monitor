import React, {useEffect, useState} from 'react';
import {Button, Col, Label, Progress, Row, Table} from 'reactstrap';
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
  return (
    <div>
      <h3><Translate contentKey="metrics.game.title">Game Metrics</Translate></h3>
      <Table striped>
        <thead>
        <tr>
          <th>Metric</th>
          <th>Value</th>
        </tr>
        </thead>
        <tbody>
        {props.gameMetrics.total.map((metric, idx) => (
          <tr key={idx}>
            <td>{metric.key}</td>
            <td className="text-end">
              <TextFormat value={metric.value} type="number"
                          format={props.numberFormat}/>
            </td>
          </tr>
        ))}
        </tbody>
      </Table>
      {props.gameMetrics.game && <Row>
        <span>Game rooms load metrics</span>
        {
          Object.entries(props.gameMetrics.game).map((it: any) => {
            return (
              <Row key={it[0]}>
                <Col md="4">
                  <Label>{it[0]}</Label>
                  <Progress animated min="0" value={it[1].current} max={it[1].max}
                            color="success"><span><TextFormat
                    value={(it[1].current * 100) / it[1].max}
                    type="number"
                    format={props.numberFormat}/></span>
                  </Progress>
                </Col>
              </Row>
            );
          })
        }
      </Row>}
    </div>
  );
};

export default GameMetrics;
