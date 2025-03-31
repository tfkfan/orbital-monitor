import React, {useEffect} from 'react';
import {Button, Col, Progress, Row, Table} from 'reactstrap';
import {TextFormat, Translate,} from 'react-jhipster';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import {APP_WHOLE_NUMBER_FORMAT} from 'app/config/constants';
import {useAppDispatch, useAppSelector} from 'app/config/store';
import {getSystemMetrics} from '../administration.reducer';


export const MetricsPage = () => {
  const dispatch = useAppDispatch();
  const metrics = useAppSelector(state => state.administration.metrics);
  const progressCompatibleMetrics = useAppSelector(state => state.administration.progressCompatibleMetrics);
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

  const formatTableRowItem = (title, item, idx) => {
    return <tr key={idx}>
      <td>
        {title}
      </td>
      <td>
        {item.tags.id ? item.tags.id : JSON.stringify(item.tags)}
      </td>
      <td>
        {item.type}
      </td>
      <td>
        {item.type === 'gauge' ? item.value : (item.type === 'counter' || item.type === 'functionalCounter') ? item.count : ''}
      </td>
    </tr>
  }

  const formatTableRowSummaryItem = (title, item, idx) => {
    return <tr key={idx}>
      <td>
        {title}
      </td>
      <td>
        {JSON.stringify(item.tags)}
      </td>
      <td>{item.count}</td>
      <td>{item.total}</td>
      <td>{item.mean}</td>
      <td>{item.max}</td>
    </tr>
  }

  const formatTableRowTimerItem = (title, item, idx) => {
    return <tr key={idx}>
      <td>
        {title}
      </td>
      <td>
        {JSON.stringify(item.tags)}
      </td>
      <td>{item.count}</td>
      <td>{item.totalTimeMs}</td>
      <td>{item.meanMs}</td>
      <td>{item.maxMs}</td>
    </tr>
  }

  const formatTableRow = (prop) => {
    if (metrics[prop])
      return metrics[prop].map((item, idx) => formatTableRowItem(prop, item, idx));
    return '';
  }

  const formatTableRowSummary = (prop) => {
    if (metrics[prop])
      return metrics[prop].map((item, idx) => formatTableRowSummaryItem(prop, item, idx));
    return '';
  }

  const formatTableRowTimer = (prop) => {
    if (metrics[prop])
      return metrics[prop].map((item, idx) => formatTableRowTimerItem(prop, item, idx));
    return '';
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
      {progressCompatibleMetrics &&
        Object.entries<any>(progressCompatibleMetrics).map(entry =>
          <div key={entry[0]}>
            <Row>
              <Col md="9">{entry[0]}</Col>
            </Row>
            <Progress animated min={0} value={entry[1]["used"]} max={entry[1]["max"]} color="success">
              <span>               <TextFormat value={(entry[1].used * 100) / entry[1].max} type="number"
                                               format={APP_WHOLE_NUMBER_FORMAT}/>%</span>
            </Progress>
          </div>)
      }
      <hr/>
      {Object.keys(metrics).length > 0 && <div>
        <Row>
          <Table striped>
            <thead>
            <tr>
              <th>
                Metrics
              </th>
              <th>
                Tags
              </th>
              <th>Type</th>
              <th>
                Value
              </th>
            </tr>
            </thead>
            <tbody>
            {formatTableRow('jvm.buffer.count')}
            {formatTableRow('jvm.buffer.memory.used')}
            {formatTableRow('jvm.buffer.total.capacity')}
            {formatTableRow('jvm.classes.loaded')}
            {formatTableRow('jvm.classes.unloaded')}
            {formatTableRow('jvm.gc.live.data.size')}
            {formatTableRow('jvm.gc.max.data.size')}
            {formatTableRow('jvm.memory.committed')}
            {formatTableRow('jvm.memory.max')}
            {formatTableRow('jvm.memory.used')}
            {formatTableRow('jvm.threads.daemon')}
            {formatTableRow('jvm.threads.live')}
            {formatTableRow('jvm.threads.peak')}
            {formatTableRow('jvm.threads.states')}
            {formatTableRow("jvm.gc.memory.allocated")}
            {formatTableRow("jvm.gc.memory.promoted")}
            {formatTableRow("jvm.threads.started")}
            {formatTableRow('process.cpu.usage')}
            {formatTableRow('system.cpu.count')}
            {formatTableRow('system.cpu.usage')}
            {formatTableRow('system.load.average.1m')}
            {formatTableRow('jvm.threads.peak')}
            {formatTableRow('vertx.eventbus.handlers')}
            {formatTableRow('vertx.eventbus.delivered')}
            {formatTableRow('vertx.eventbus.pending')}
            {formatTableRow('vertx.http.server.active.connections')}
            {formatTableRow('vertx.http.server.active.requests')}
            {formatTableRow('vertx.http.server.active.ws.connections')}
            {formatTableRow('vertx.http.server.bytes.read')}
            {formatTableRow('vertx.http.server.bytes.written')}
            {formatTableRow('vertx.http.server.requests')}
            {formatTableRow('vertx.pool.completed')}
            {formatTableRow('vertx.pool.in.use')}
            {formatTableRow('vertx.pool.queue.pending')}
            {formatTableRow('vertx.pool.ratio')}
            {formatTableRow("vertx.eventbus.delivered")}
            {formatTableRow("vertx.eventbus.processed")}
            {formatTableRow("vertx.eventbus.published")}
            {formatTableRow("vertx.eventbus.received")}
            {formatTableRow("vertx.eventbus.sent")}
            </tbody>
          </Table>
        </Row>
        <Row>
          <Table striped>
            <thead>
            <tr>
              <th>
                Summary metrics
              </th>
              <th>
                Tags
              </th>
              <th>Count</th>
              <th>Total</th>
              <th>Mean</th>
              <th>Max</th>
            </tr>
            </thead>
            <tbody>
            {formatTableRowSummary("vertx.http.server.request.bytes")}
            {formatTableRowSummary("vertx.http.server.response.bytes")}
            </tbody>
          </Table>

        </Row>
        <Row>
          <Table striped>
            <thead>
            <tr>
              <th>
                Timer metrics
              </th>
              <th>
                Tags
              </th>
              <th>Count</th>
              <th>TotalTimeMs</th>
              <th>MeanMs</th>
              <th>MaxMs</th>
            </tr>
            </thead>
            <tbody>
            {formatTableRowTimer("vertx.http.server.response.time")}
            {formatTableRowTimer("vertx.pool.queue.time")}
            {formatTableRowTimer("vertx.pool.usage")}
            </tbody>
          </Table>
        </Row>
      </div>}
    </div>
  );
};

export default MetricsPage;
