import React, {useEffect, useState} from 'react';
import {Alert, Col, Progress, Row} from 'reactstrap';
import {TextFormat, Translate,} from 'react-jhipster';
import {useAppDispatch, useAppSelector} from "app/config/store";
import {getClusterNodes} from "app/modules/administration/administration.reducer";
import {IGatewayInfo} from "app/shared/model/gateway.info.model";

interface ClusterMetricsProps {
  clusterNodes: IGatewayInfo[]
}

export const ClusterMetrics = (props: ClusterMetricsProps) => {
  return (
    <div>
      <h3><Translate contentKey="metrics.cluster.title">Metrics</Translate></h3>
      <Row>
        <Col md={12}>
          {props.clusterNodes && props.clusterNodes.map((it: IGatewayInfo) => {
            return (
              <div key={it[0]}>
                {it.nodeId }
                {it.address}
                {it.port}
              </div>
            );
          })}
        </Col>
      </Row>
    </div>
  );
};

export default ClusterMetrics;
