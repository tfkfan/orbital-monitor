import React from 'react';
import { Translate } from 'react-jhipster';

import { NavItem, NavLink, NavbarBrand } from 'reactstrap';
import { NavLink as Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';



export const Brand = () => (
  <NavbarBrand tag={Link} to="/page" className="brand-logo">
    <img className="brand-icon" src="content/images/orbital.svg"/>
    <span className="brand-title">
      <Translate contentKey="global.title">orbital-monitor</Translate>
    </span>
    <span className="navbar-version"> <Translate contentKey="global.subtitle">orbital-monitor</Translate></span>
  </NavbarBrand>
);
