import React from 'react';
import {Route} from 'react-router';

import Home from 'app/modules/home/home';
import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import PageNotFound from 'app/shared/error/page-not-found';
import Administration from "app/modules/administration";

const AppRoutes = () => {
  return (
    <div className="view-routes">
      <ErrorBoundaryRoutes>
        <Route path="/" element={<Home/>}/>
        <Route
          path="admin/*"
          element={<Administration/>}
        />
        <Route path="*" element={<PageNotFound/>}/>
      </ErrorBoundaryRoutes>
    </div>
  );
};

export default AppRoutes;
