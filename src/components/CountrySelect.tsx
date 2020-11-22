import React, { Component } from 'react';
import { connect, ConnectedProps } from "react-redux";
import { fetchCountries } from '../store/countries/countries.slice';
import { fetchCountryDays } from '../store/countryDays/countryDays.slice';
import { AppDispatch, RootState } from '../store/store';

const mapState = (state: RootState) => ({
    countriesState: state.countries
});

const mapDispatch = (dispatch: AppDispatch) => ({
    fetchCountries: () => dispatch(fetchCountries()),
    fetchCountryDays: (slug: string) => dispatch(fetchCountryDays(slug))
});

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux;

class CountrySelect extends Component<Props> {
    componentDidMount() {
        this.props.fetchCountries();
    }

    render() {
        return <div>foo</div>
    }
}

export default connector(CountrySelect);