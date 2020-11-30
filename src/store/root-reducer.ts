import { combineReducers } from '@reduxjs/toolkit';
import { countriesReducer } from './countries/countries.slice';
import { countryDaysReducer } from './countryDays/countryDays.slice';
import { sectorsReducer } from './sectors/sectors.slice';
import { selectionReducer } from './selection/selection.slice';

const rootReducer = combineReducers({
  countries: countriesReducer,
  countryDays: countryDaysReducer,
  selection: selectionReducer,
  sectors: sectorsReducer
});

export default rootReducer; 