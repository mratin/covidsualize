import React, { Component } from 'react';
import { connect, ConnectedProps } from "react-redux";
import { fetchCountries } from '../store/countries/countries.slice';
import { fetchCountryDays } from '../store/countryDays/countryDays.slice';
import { AppDispatch, RootState } from '../store/store';
import * as _ from 'lodash';

const COUNTRY_DAYS_DELAY: number = 300;

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

class CountrySelect extends Component<Props> {
    loadCountriesDays() {
        const slugToLoad: string | undefined = _.shuffle(this.props.countriesState.countries)
            .find(c => this.props.countryDaysState[c.slug] === undefined)?.slug;

        if (slugToLoad !== undefined) {
            this.props.fetchCountryDays(slugToLoad)
                .then(() => setTimeout(() => this.loadCountriesDays(), COUNTRY_DAYS_DELAY));
        }
    }

    componentDidMount() {
        this.props.fetchCountries().then(() => this.loadCountriesDays());
    }

    render() {
        return <div>foo</div>
    }
}

export default connector(CountrySelect);