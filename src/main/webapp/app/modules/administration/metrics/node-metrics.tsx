import React, {useEffect, useState} from 'react';
import {
  Alert,
  Badge, Button,
  Card,
  CardBody, CardText,
  CardTitle,
  Col,
  Nav,
  NavItem,
  NavLink,
  Progress,
  Row,
  TabContent,
  TabPane
} from 'reactstrap';
import {
  GarbageCollectorMetrics,
  HttpRequestMetrics,
  JvmMemory,
  JvmThreads,
  SystemMetrics,
  TextFormat,
  Translate,
} from 'react-jhipster';
import {useAppDispatch, useAppSelector} from "app/config/store";
import {getClusterNodes, getSystemMetrics} from "app/modules/administration/administration.reducer";
import {IGatewayInfo} from "app/shared/model/gateway.info.model";
import {
  APP_TIMESTAMP_FORMAT,
  APP_TWO_DIGITS_AFTER_POINT_NUMBER_FORMAT,
  APP_WHOLE_NUMBER_FORMAT
} from "app/config/constants";
import GameManagerMetrics from "app/modules/administration/metrics/game-manager-metrics";
import GameRoomsMetrics from "app/modules/administration/metrics/game-rooms-metrics";

interface NodeMetricsProps {
  nodeId: string
  metrics: any
}

const SYSTEM_METRICS_TAB = "SMT";
const GAME_MANAGER_METRICS_TAB = "GMMT";
const GAME_ROOMS_METRICS_TAB = "GRMT";

export const NodeMetrics = (props: NodeMetricsProps) => {
  const [activeTabId, setActiveTabId] = useState(props.nodeId +SYSTEM_METRICS_TAB);

  return (
    <div>
      <Row>
        <Col md={12}>
          <Card className="metrics-card">
            <CardBody>
              <CardTitle tag="h5">
                <Translate contentKey="metrics.node"></Translate>&nbsp;{props.nodeId}
              </CardTitle>
              <CardText>
                <Translate contentKey="metrics.description"></Translate>
              </CardText>
              <Nav tabs>
                <NavItem>
                  <NavLink
                    className={activeTabId === (props.nodeId + SYSTEM_METRICS_TAB) ? "active" : ""}
                    onClick={() => setActiveTabId(props.nodeId + SYSTEM_METRICS_TAB)}>
                    <Translate contentKey="metrics.system.title">Metrics</Translate>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={activeTabId === (props.nodeId +GAME_MANAGER_METRICS_TAB) ? "active" : ""}
                    onClick={() => setActiveTabId(props.nodeId +GAME_MANAGER_METRICS_TAB)}>
                    <Translate contentKey="metrics.manager.title">Metrics</Translate>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={activeTabId === (props.nodeId +GAME_ROOMS_METRICS_TAB) ? "active" : ""}
                    onClick={() => setActiveTabId(props.nodeId +GAME_ROOMS_METRICS_TAB)}>
                    <Translate contentKey="metrics.rooms.title">Metrics</Translate>
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={activeTabId}>
                <TabPane tabId={props.nodeId +SYSTEM_METRICS_TAB}>
                  <Row className="tab-content">
                    <Col sm="12">
                      {(props.metrics?.jvm || props.metrics?.threadDump || props.metrics?.processMetrics) && <h3>
                        <Translate contentKey="metrics.jvm.title">JVM Metrics</Translate>
                      </h3>}
                      <Row>
                        <Col md="4">{props.metrics?.jvm ?
                          <JvmMemory jvmMetrics={props.metrics.jvm} wholeNumberFormat={APP_WHOLE_NUMBER_FORMAT}/> : ''}</Col>
                        <Col md="4">{props.metrics?.threadDump ?
                          <JvmThreads jvmThreads={props.metrics?.threadDump}
                                      wholeNumberFormat={APP_WHOLE_NUMBER_FORMAT}/> : ''}</Col>
                        <Col md="4">
                          {props.metrics?.processMetrics ? (
                            <SystemMetrics systemMetrics={props.metrics.processMetrics}
                                           wholeNumberFormat={APP_WHOLE_NUMBER_FORMAT}
                                           timestampFormat={APP_TIMESTAMP_FORMAT}/>
                          ) : ('')}
                        </Col>
                      </Row>
                      {props.metrics?.garbageCollector ? (
                        <GarbageCollectorMetrics garbageCollectorMetrics={props.metrics.garbageCollector}
                                                 wholeNumberFormat={APP_WHOLE_NUMBER_FORMAT}/>
                      ) : (
                        ''
                      )}
                      {props.metrics && props.metrics['http.server.requests'] ? (
                        <HttpRequestMetrics
                          requestMetrics={props.metrics['http.server.requests']}
                          twoDigitAfterPointFormat={APP_TWO_DIGITS_AFTER_POINT_NUMBER_FORMAT}
                          wholeNumberFormat={APP_WHOLE_NUMBER_FORMAT}
                        />
                      ) : (
                        ''
                      )}
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId={props.nodeId +GAME_MANAGER_METRICS_TAB}>
                  <Row className="tab-content">
                    <Col sm="12">
                      {props.metrics && props.metrics['orbital.metrics'] ? (
                        <GameManagerMetrics
                          gameMetrics={props.metrics['orbital.metrics']}
                          numberFormat={APP_WHOLE_NUMBER_FORMAT}
                        />
                      ) : (
                        ''
                      )}
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId={props.nodeId +GAME_ROOMS_METRICS_TAB}>
                  <Row className="tab-content">
                    <Col sm="12">
                      {props.metrics && props.metrics['orbital.metrics'] ? (
                        <GameRoomsMetrics
                          gameMetrics={props.metrics['orbital.metrics']}
                          numberFormat={APP_WHOLE_NUMBER_FORMAT}
                        />
                      ) : (
                        ''
                      )}
                    </Col>
                  </Row>
                </TabPane>
              </TabContent>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default NodeMetrics;
