import { combineReducers } from '@reduxjs/toolkit';
import { countriesReducer } from './countries/countries.slice';

const rootReducer = combineReducers({
  countries: countriesReducer
});

export default rootReducer; 