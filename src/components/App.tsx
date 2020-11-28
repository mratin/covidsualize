import { AppBar, Box, Container, FormControl, Select, Toolbar } from '@material-ui/core';
import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { fetchCountries } from '../store/countries/countries.slice';
import { fetchCountryDays } from '../store/countryDays/countryDays.slice';
import { AppDispatch, RootState } from '../store/store';
import './App.css';
import CountrySelect from './CountrySelect';
import LoadingIndicator from './LoadingIndicator';

const mapState = (state: RootState) => ({
    countriesState: state.countries,
    countryDaysState: state.countryDays
});

const mapDispatch = (dispatch: AppDispatch) => ({
    fetchCountries: () => dispatch(fetchCountries()),
    fetchCountryDays: (slug: string) => dispatch(fetchCountryDays(slug))
});

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux;

class App extends Component<Props> {

    render() {
        return (
            <Container maxWidth="xl">
            <AppBar color="default" position="sticky">
                <Toolbar>
                    <Box mr={4}>
                        <FormControl>
                        <InputLabel id="select-country"></InputLabel>
                        <Select
                        style={{ minWidth: 96 }}
                        multiple={false} // TODO
                        labelId="select-country"
                        id="select-country"
                        value=
                        ></Select>
                        </FormControl>
                    </Box>
                </Toolbar>
            </AppBar>
            </Container>
        )
    }
};

export default connector(App);