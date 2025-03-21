import { ReducersMapObject } from '@reduxjs/toolkit';
import { loadingBarReducer as loadingBar } from 'react-redux-loading-bar';

import locale from './locale';

const rootReducer: ReducersMapObject = {
  locale,
  loadingBar,
};

export default rootReducer;
