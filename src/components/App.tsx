import React from 'react';
import './App.css';
import CountrySelect from './CountrySelect';
import LoadingIndicator from './LoadingIndicator';

export const App = () => (
    <div>
    Foobar
    <CountrySelect />
    <div><LoadingIndicator /></div>
    </div>
);

