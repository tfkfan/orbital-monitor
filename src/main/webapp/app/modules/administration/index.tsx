import React from 'react';

import {Route} from 'react-router-dom';
import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import Health from './health/health';
import Metrics from './metrics/metrics';

const AdministrationRoutes = () => (
  <div>
    <ErrorBoundaryRoutes>
      <Route path="health" element={<Health/>}/>
      <Route path="metrics" element={<Metrics/>}/>
    </ErrorBoundaryRoutes>
  </div>
);

export default AdministrationRoutes;
