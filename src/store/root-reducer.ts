import { combineReducers } from '@reduxjs/toolkit';
import { countriesReducer } from './countries/countries.slice';
import { countryDaysReducer } from './countryDays/countryDays.slice';

const rootReducer = combineReducers({
  countries: countriesReducer,
  countryDays: countryDaysReducer
});

export default rootReducer; 