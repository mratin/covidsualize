import React, { Component } from 'react';
import { connect, ConnectedProps } from "react-redux";
import { Country, fetchCountries } from '../store/countries/countries.slice';
import { fetchCountryDays } from '../store/countryDays/countryDays.slice';
import { AppDispatch, RootState } from '../store/store';
import * as _ from 'lodash';
import { AppBar, Box, FormControl, InputLabel, MenuItem, Select, Toolbar } from '@material-ui/core';
import { actions as sectorsActions, Sector, SectorId } from '../store/sectors/sectors.slice';
import { actions as selectionActions } from '../store/selection/selection.slice';

const COUNTRY_DAYS_DELAY = 250;

const mapState = (state: RootState) => ({
    countriesState: state.countries,
    countryDaysState: state.countryDays,
    selectionState: state.selection,
    sectorsState: state.sectors
});

const mapDispatch = (dispatch: AppDispatch) => ({
    fetchCountries: () => dispatch(fetchCountries()),
    fetchCountryDays: (slug: string) => dispatch(fetchCountryDays(slug)),
    setSectors: (sectors: Sector[]) => dispatch(sectorsActions.setSectors(sectors)),
    selectSectors: (sectorIds: SectorId[]) => dispatch(selectionActions.selectSectors(sectorIds))
});

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux;

class CountrySelect extends Component<Props> {
    // loadCountriesDays() {
    //     const slugToLoad: string | undefined = _.shuffle(this.props.countriesState.countries)
    //         .find(c => this.props.countryDaysState[c.slug] === undefined)?.slug;

    //     if (slugToLoad !== undefined) {
    //         this.props.fetchCountryDays(slugToLoad)
    //             .then(() => setTimeout(() => this.loadCountriesDays(), COUNTRY_DAYS_DELAY));
    //     }
    // }

    loadCountriesDays() {
        let countries: Country[] = this.props.selectionState.sectorIds.flatMap(sectorId => this.props.sectorsState[sectorId]?.countries)
        let notLoadedCountry: Country | undefined = _.shuffle(countries).find(country => this.props.countryDaysState[country.slug] === undefined)
        if (notLoadedCountry !== undefined) {
            this.props.fetchCountryDays(notLoadedCountry.slug)
                .then(() => setTimeout(() => this.loadCountriesDays(), COUNTRY_DAYS_DELAY))
        }
    }

    componentDidUpdate(prevProps: Props) {
        if (prevProps.selectionState.sectorIds !== this.props.selectionState.sectorIds) {
            this.loadCountriesDays()
        }
    }

    createSectors() {
        const sectors: Sector[] = this.props.countriesState.countries.map(c => ({
            id: c.isoCode,
            name: c.name,
            population: c.population,
            countries: [c]
        }))
        this.props.setSectors(sectors)
    }

    loadSectors() {
        this.props.fetchCountries()
            .then(() => this.createSectors())
    }

    componentDidMount() {
        //this.props.fetchCountries().then(() => this.loadCountriesDays());

        this.loadSectors()
    }

    selectSectors(sectorIds: SectorId[]) {
        this.props.selectSectors(sectorIds)
    }

    selectedSectorValue(): SectorId | SectorId[] {
        return (this.props.selectionState.comparisonMode
            ? this.props.selectionState.sectorIds
            : this.props.selectionState.sectorIds[0]) ?? '';
    }

    sectorsValues(): Sector[] {
        return _.sortBy(Object.values(this.props.sectorsState), ['name']);
    }

    render() {
        return (
            <AppBar color="default" position="sticky">
                <Toolbar>
                    <Box mr={4}>
                        <FormControl>
                            <InputLabel id="select-country"></InputLabel>
                            <Select
                                style={{ minWidth: 96 }}
                                multiple={this.props.selectionState.comparisonMode}
                                labelId="select-country"
                                id="select-country"
                                value={this.selectedSectorValue()}
                                onChange={(e) => {
                                    if (this.props.selectionState.comparisonMode) {
                                        this.selectSectors(e.target.value as string[])
                                    } else {
                                        this.selectSectors([e.target.value as string])
                                    }
                                }}
                            >
                                {this.sectorsValues().map(sector =>
                                    <MenuItem key={sector.id} value={sector.id}>{sector.name}</MenuItem>
                                )}
                            </Select>
                        </FormControl>
                    </Box>
                </Toolbar>
            </AppBar>)
    }
}

export default connector(CountrySelect);