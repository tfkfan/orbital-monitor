import React, {useEffect, useState} from 'react';
import {Alert, Col, Progress, Row} from 'reactstrap';
import {TextFormat, Translate,} from 'react-jhipster';

interface GameRoomsMetricsProps {
  gameMetrics: any;
  numberFormat: string;
}

export const GameRoomsMetrics = (props: GameRoomsMetricsProps) => {
  const [gameMetrics, setGameMetrics] = useState([]);
  useEffect(() => {
    setGameMetrics(Object.entries(props.gameMetrics.game));
  }, [props.gameMetrics]);
  return (
    <div>
      <h3><Translate contentKey="metrics.rooms.title">Game rooms metrics</Translate></h3>
      <Row>
        <Col md={12}>
          {gameMetrics.map((it: any) => {
            return (
              <div key={it[0]}>
                <Row>
                  <Alert color="info">
                    <Alert color="light"><h6>Room <span style={{fontWeight: "bold"}}>{it[0]}</span></h6></Alert>
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

export default GameRoomsMetrics;
