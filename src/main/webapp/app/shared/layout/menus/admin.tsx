import React from 'react';
import MenuItem from 'app/shared/layout/menus/menu-item';

import {Translate, translate} from 'react-jhipster';
import {NavDropdown} from './menu-components';
import {baseHref} from "app/app";

const adminMenuItems = () => (
    <>
        <MenuItem icon="tachometer-alt" to={`/admin/metrics`}>
            <Translate contentKey="global.menu.admin.metrics">Metrics</Translate>
        </MenuItem>
        <MenuItem icon="heart" to={`/admin/health`}>
            <Translate contentKey="global.menu.admin.health">Health</Translate>
        </MenuItem>
    </>
);

export const AdminMenu = () => (
    <NavDropdown icon="users-cog" name={translate('global.menu.admin.main')} id="admin-menu" data-cy="adminMenu">
        {adminMenuItems()}
    </NavDropdown>
);

export default AdminMenu;
