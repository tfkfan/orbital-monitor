import React, {useEffect} from 'react';
import {Button, Col, Progress, Row, Table} from 'reactstrap';
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


export const MetricsPage = () => {
  const dispatch = useAppDispatch();
  const parsedMetrics = useAppSelector(state => state.administration.parsedMetrics);
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

      <Row>
        <Col sm="12">
          <h3>
            <Translate contentKey="metrics.jvm.title">JVM Metrics</Translate>
          </h3>
          <Row>
            <Col md="4">{parsedMetrics?.jvm ?
              <JvmMemory jvmMetrics={parsedMetrics.jvm} wholeNumberFormat={APP_WHOLE_NUMBER_FORMAT}/> : ''}</Col>
            <Col md="4">{parsedMetrics?.threadDump ?
              <JvmThreads jvmThreads={parsedMetrics?.threadDump} wholeNumberFormat={APP_WHOLE_NUMBER_FORMAT}/> : ''}</Col>
            <Col md="4">
              {parsedMetrics?.processMetrics ? (
                <SystemMetrics
                  systemMetrics={parsedMetrics.processMetrics}
                  wholeNumberFormat={APP_WHOLE_NUMBER_FORMAT}
                  timestampFormat={APP_TIMESTAMP_FORMAT}
                />
              ) : (
                ''
              )}
            </Col>
          </Row>
        </Col>
      </Row>
      {parsedMetrics?.garbageCollector ? (
        <GarbageCollectorMetrics garbageCollectorMetrics={parsedMetrics.garbageCollector} wholeNumberFormat={APP_WHOLE_NUMBER_FORMAT} />
      ) : (
        ''
      )}
      {parsedMetrics && parsedMetrics['http.server.requests'] ? (
        <HttpRequestMetrics
          requestMetrics={parsedMetrics['http.server.requests']}
          twoDigitAfterPointFormat={APP_TWO_DIGITS_AFTER_POINT_NUMBER_FORMAT}
          wholeNumberFormat={APP_WHOLE_NUMBER_FORMAT}
        />
      ) : (
        ''
      )}
    </div>
  );
};

export default MetricsPage;
