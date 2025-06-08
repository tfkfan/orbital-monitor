import React, {useEffect, useState} from 'react';
import {Badge, Button, Row} from 'reactstrap';
import {Translate,} from 'react-jhipster';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {useAppDispatch, useAppSelector} from 'app/config/store';
import {getClusterNodes, getClusterSystemMetrics} from '../administration.reducer';
import NodeMetrics from "app/modules/administration/metrics/node-metrics";
import {processMetrics} from "app/shared/util/metrics-utils";
import ClusterMetrics from "app/modules/administration/metrics/cluster-metrics";

export const MetricsPage = () => {
  const dispatch = useAppDispatch();

  const clusterNodes = useAppSelector(state => state.administration.clusterNodes);
  const isFetching = useAppSelector(state => state.administration.loading);
  const [metrics, setMetrics] = useState([]);

  useEffect(() => {
    getClusterInfo();
  }, []);


  useEffect(() => {
    refreshMetrics();
  }, [clusterNodes]);


  const getClusterInfo = () => {
    if (isFetching)
      return

    dispatch(getClusterNodes());
  };

  const refreshMetrics = () => {
    if (isFetching)
      return

    getClusterSystemMetrics(clusterNodes).then(it => {
      setMetrics(it.map(e => {
        return {...e, metrics: processMetrics(e.metrics)}
      }));
    });
  };

  return (
    <div>
      <h2 id="metrics-page-heading" data-cy="metricsPageHeading">
        <Translate contentKey="metrics.title">Application Metrics</Translate>
      </h2>
      <p>
        <Button onClick={refreshMetrics} color={isFetching ? 'btn btn-danger' : 'btn btn-primary'}
                disabled={isFetching}>
          <FontAwesomeIcon icon="sync"/>
          &nbsp;
          <Translate component="span" contentKey="health.refresh.button">
            Refresh
          </Translate>
        </Button>
      </p>
      <hr/>
      <Row>
        {metrics && <ClusterMetrics clusterMetrics={metrics}/> }
      </Row>
      <Row>
        {metrics && metrics.map((it: any, idx) => (
          <Row key={idx}>
            <NodeMetrics nodeId={it.nodeId} metrics={it.metrics}/>
          </Row>
        ))}
      </Row>
    </div>
  );
};

export default MetricsPage;
