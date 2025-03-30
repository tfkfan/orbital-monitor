import 'react-toastify/dist/ReactToastify.css';
import './app.scss';
import 'app/config/dayjs';

import React from 'react';
import {BrowserRouter} from 'react-router-dom';
import {ToastContainer} from 'react-toastify';

import {useAppSelector} from 'app/config/store';
import Header from 'app/shared/layout/header/header';
import Footer from 'app/shared/layout/footer/footer';
import ErrorBoundary from 'app/shared/error/error-boundary';
import AppRoutes from 'app/routes';
import {Container} from "reactstrap";

const baseHref = document.querySelector('base').getAttribute('href').replace(/\/$/, '');

export const App = () => {
  const currentLocale = useAppSelector(state => state.locale.currentLocale);

  const paddingTop = '60px';
  return (
    <BrowserRouter basename={baseHref}>
      <div className="app-container" style={{paddingTop}}>
        <ToastContainer position="top-left" className="toastify-container" toastClassName="toastify-toast"/>
        <ErrorBoundary>
          <Header currentLocale={currentLocale}/>
        </ErrorBoundary>
        <div className="container-fluid view-container" id="app-view-container">
          <Container>
            <div className="content">
              <ErrorBoundary>
                <AppRoutes/>
              </ErrorBoundary>
            </div>
          </Container>
          <div className="line"></div>
          <Container>
            <Footer/>
          </Container>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
