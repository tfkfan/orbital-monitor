import React, {useEffect, useState} from 'react';
import {Card, CardBody, CardText, CardTitle, Col, Row} from 'reactstrap';
import {APP_WHOLE_NUMBER_FORMAT} from "app/config/constants";
import GameManagerMetrics from "app/modules/administration/metrics/game-manager-metrics";
import GameRoomsMetrics from "app/modules/administration/metrics/game-rooms-metrics";
import {processClusterMetrics} from "app/shared/util/metrics-utils";
import {Translate, translate} from "react-jhipster";

interface ClusterclusterMetricsProps {
  clusterMetrics: any[]
}

export const ClusterMetrics = (props: ClusterclusterMetricsProps) => {
  const [metrics, setMetrics] = useState(null);
  useEffect(() => {
    setMetrics(processClusterMetrics(props.clusterMetrics));
  }, [props.clusterMetrics]);
  return (
    <Row>
      <Col md={12}>
        <Card className="metrics-card">
          <CardBody>
            <CardTitle tag="h2">
              <Translate contentKey="metrics.cluster.title"></Translate>
            </CardTitle>
            <Row>
              <Col md={12}>
                {metrics && metrics.metrics && metrics.metrics['orbital.metrics'] ? (
                  <GameManagerMetrics
                    title={translate("metrics.manager.cluster")}
                    gameMetrics={metrics.metrics['orbital.metrics']}
                    numberFormat={APP_WHOLE_NUMBER_FORMAT}
                  />
                ) : (
                  ''
                )}
              </Col>
            </Row>

            <Row className="tab-content">
              <Col sm="12">
                {metrics && metrics.metrics && metrics.metrics['orbital.metrics'] ? (
                  <GameRoomsMetrics
                    title={translate("metrics.rooms.cluster")}
                    gameMetrics={metrics.metrics['orbital.metrics']}
                    numberFormat={APP_WHOLE_NUMBER_FORMAT}
                  />
                ) : (
                  ''
                )}
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default ClusterMetrics;
