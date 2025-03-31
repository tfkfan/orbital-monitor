import React, {useEffect} from 'react';
import {Button, Col, Progress, Row, Table} from 'reactstrap';
import {TextFormat, Translate,} from 'react-jhipster';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import {APP_WHOLE_NUMBER_FORMAT} from 'app/config/constants';
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
      {parsedMetrics && parsedMetrics.resources &&
        <div>
          <span>System metrics</span>
          {Object.entries<any>(parsedMetrics.resources).map(entry =>
            <div key={entry[0]}>
              <Row>
                <Col md="9">{entry[0]}</Col>
              </Row>
              <Progress animated min={0} value={entry[1]["used"]} max={entry[1]["max"]} color="success">
              <span>               <TextFormat value={(entry[1].used * 100) / entry[1].max} type="number"
                                               format={APP_WHOLE_NUMBER_FORMAT}/>%</span>
              </Progress>
            </div>)}
        </div>
      }
      <hr/>
      <div>
        {parsedMetrics && parsedMetrics.gauge && <Row>
          <Table striped>
            <thead>
            <tr>
              <th>
                Gauge/Counter metrics
              </th>
              <th>
                Value
              </th>
            </tr>
            </thead>
            <tbody>
            {parsedMetrics.gauge.map((it, idx) => formatGaugeTableRowItem(it, idx))}
            </tbody>
          </Table>
        </Row>}

        {parsedMetrics && parsedMetrics.summary && <Row>
          <Table striped>
            <thead>
            <tr>
              <th>
                Summary metrics
              </th>
              <th>Count</th>
              <th>Total</th>
              <th>Mean</th>
              <th>Max</th>
            </tr>
            </thead>
            <tbody>
            {parsedMetrics.summary.map((it, idx) => formatSummaryTableRowItem(it, idx))}
            </tbody>
          </Table>
        </Row>}
        {parsedMetrics && parsedMetrics.timer &&
          <Row>
            <Table striped>
              <thead>
              <tr>
                <th>
                  Timer metrics
                </th>
                <th>Count</th>
                <th>TotalTimeMs</th>
                <th>MeanMs</th>
                <th>MaxMs</th>
              </tr>
              </thead>
              <tbody>
              {parsedMetrics.timer.map((it, idx) => formatTimerTableRowItem(it, idx))}
              </tbody>
            </Table>
          </Row>}
      </div>
    </div>
  );
};

export default MetricsPage;
