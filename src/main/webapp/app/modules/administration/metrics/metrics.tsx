import React, {useEffect, useState} from 'react';
import {
  Button,
  Card, CardText,
  CardTitle,
  Col,
  Nav,
  NavItem,
  NavLink,
  Progress,
  Row,
  TabContent,
  Table,
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
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import {
  APP_TIMESTAMP_FORMAT,
  APP_TWO_DIGITS_AFTER_POINT_NUMBER_FORMAT,
  APP_WHOLE_NUMBER_FORMAT
} from 'app/config/constants';
import {useAppDispatch, useAppSelector} from 'app/config/store';
import {getSystemMetrics} from '../administration.reducer';
import GameManagerMetrics from "app/modules/administration/metrics/game-manager-metrics";
import GameRoomsMetrics from "app/modules/administration/metrics/game-rooms-metrics";

const SYSTEM_METRICS_TAB = "SMT";
const GAME_MANAGER_METRICS_TAB = "GMMT";
const GAME_ROOMS_METRICS_TAB = "GRMT";

export const MetricsPage = () => {
  const dispatch = useAppDispatch();
  const metrics = useAppSelector(state => state.administration.metrics);
  const isFetching = useAppSelector(state => state.administration.loading);
  let timer = null;
  useEffect(() => {
    if (timer !== null)
      clearInterval(timer);
    timer = setInterval(() => {
      dispatch(getSystemMetrics());
    }, 2000);
  }, []);

  const getMetrics = () => {
    if (!isFetching)
      dispatch(getSystemMetrics());
  };

  const formatGaugeTableRowItem = (item, idx) => {
    return <tr key={idx}>
      <td>
        {item.key}
      </td>
      <td>
        {item.value}
      </td>
    </tr>
  }

  const formatSummaryTableRowItem = (item, idx) => {
    return <tr key={idx}>
      <td>
        {item.key}
      </td>
      <td>{item.count}</td>
      <td>{item.total}</td>
      <td>{item.mean}</td>
      <td>{item.max}</td>
    </tr>
  }

  const formatTimerTableRowItem = (item, idx) => {
    return <tr key={idx}>
      <td>
        {item.key}
      </td>
      <td>{item.count}</td>
      <td>{item.totalTimeMs}</td>
      <td>{item.meanMs}</td>
      <td>{item.maxMs}</td>
    </tr>
  }

  const [activeTabId, setActiveTabId] = useState(SYSTEM_METRICS_TAB);

  return (
    <div>
      <h2 id="metrics-page-heading" data-cy="metricsPageHeading">
        <Translate contentKey="metrics.title">Application Metrics</Translate>
      </h2>
      <p>
        <Button onClick={getMetrics} color={isFetching ? 'btn btn-danger' : 'btn btn-primary'} disabled={isFetching}>
          <FontAwesomeIcon icon="sync"/>
          &nbsp;
          <Translate component="span" contentKey="health.refresh.button">
            Refresh
          </Translate>
        </Button>
      </p>
      <hr/>
      <Nav tabs>
        <NavItem>
          <NavLink
            className={activeTabId === SYSTEM_METRICS_TAB ? "active" : ""}
            onClick={() => setActiveTabId(SYSTEM_METRICS_TAB)}>
            <Translate contentKey="metrics.system.title">Metrics</Translate>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={activeTabId === GAME_MANAGER_METRICS_TAB ? "active" : ""}
            onClick={() => setActiveTabId(GAME_MANAGER_METRICS_TAB)}>
            <Translate contentKey="metrics.manager.title">Metrics</Translate>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={activeTabId === GAME_ROOMS_METRICS_TAB ? "active" : ""}
            onClick={() => setActiveTabId(GAME_ROOMS_METRICS_TAB)}>
            <Translate contentKey="metrics.rooms.title">Metrics</Translate>
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTabId}>
        <TabPane tabId={SYSTEM_METRICS_TAB}>
          <Row className="tab-content">
            <Col sm="12">
              {(metrics?.jvm || metrics?.threadDump || metrics?.processMetrics) && <h3>
                <Translate contentKey="metrics.jvm.title">JVM Metrics</Translate>
              </h3>}
              <Row>
                <Col md="4">{metrics?.jvm ?
                  <JvmMemory jvmMetrics={metrics.jvm} wholeNumberFormat={APP_WHOLE_NUMBER_FORMAT}/> : ''}</Col>
                <Col md="4">{metrics?.threadDump ?
                  <JvmThreads jvmThreads={metrics?.threadDump} wholeNumberFormat={APP_WHOLE_NUMBER_FORMAT}/> : ''}</Col>
                <Col md="4">
                  {metrics?.processMetrics ? (
                    <SystemMetrics systemMetrics={metrics.processMetrics} wholeNumberFormat={APP_WHOLE_NUMBER_FORMAT}
                                   timestampFormat={APP_TIMESTAMP_FORMAT}/>
                  ) : ('')}
                </Col>
              </Row>
              {metrics?.garbageCollector ? (
                <GarbageCollectorMetrics garbageCollectorMetrics={metrics.garbageCollector}
                                         wholeNumberFormat={APP_WHOLE_NUMBER_FORMAT}/>
              ) : (
                ''
              )}
              {metrics && metrics['http.server.requests'] ? (
                <HttpRequestMetrics
                  requestMetrics={metrics['http.server.requests']}
                  twoDigitAfterPointFormat={APP_TWO_DIGITS_AFTER_POINT_NUMBER_FORMAT}
                  wholeNumberFormat={APP_WHOLE_NUMBER_FORMAT}
                />
              ) : (
                ''
              )}
            </Col>
          </Row>
        </TabPane>
        <TabPane tabId={GAME_MANAGER_METRICS_TAB}>
          <Row className="tab-content">
            <Col sm="12">
              {metrics && metrics['orbital.metrics'] ? (
                <GameManagerMetrics
                  gameMetrics={metrics['orbital.metrics']}
                  numberFormat={APP_WHOLE_NUMBER_FORMAT}
                />
              ) : (
                ''
              )}
            </Col>
          </Row>
        </TabPane>
        <TabPane tabId={GAME_ROOMS_METRICS_TAB}>
          <Row className="tab-content">
            <Col sm="12">
              {metrics && metrics['orbital.metrics'] ? (
                <GameRoomsMetrics
                  gameMetrics={metrics['orbital.metrics']}
                  numberFormat={APP_WHOLE_NUMBER_FORMAT}
                />
              ) : (
                ''
              )}
            </Col>
          </Row>
        </TabPane>
      </TabContent>
    </div>
  );
};

export default MetricsPage;
