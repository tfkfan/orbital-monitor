import { ReducersMapObject } from '@reduxjs/toolkit';
import { loadingBarReducer as loadingBar } from 'react-redux-loading-bar';

import locale from './locale';
import administration from 'app/modules/administration/administration.reducer';

const rootReducer: ReducersMapObject = {
  locale,
  administration,
  loadingBar,
};

export default rootReducer;
