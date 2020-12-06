import React, { Component } from 'react';
import { connect, ConnectedProps } from "react-redux";
import { Country, fetchCountries } from '../store/countries/countries.slice';
import { fetchCountryDays } from '../store/countryDays/countryDays.slice';
import { AppDispatch, RootState } from '../store/store';
import * as _ from 'lodash';
import { AppBar, Box, Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Toolbar } from '@material-ui/core';
import { actions as sectorsActions, Sector, SectorId } from '../store/sectors/sectors.slice';
import { actions as selectionActions } from '../store/selection/selection.slice';
import { DateRange } from 'moment-range';
import moment from 'moment';
import MomentUtils from '@date-io/moment';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';

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
    selectSectors: (sectorIds: SectorId[]) => dispatch(selectionActions.selectSectors(sectorIds)),
    selectNormalize: (normalize: boolean) => dispatch(selectionActions.selectNormalize(normalize)),
    selectComparisonMode: (comparisonMode: boolean) => dispatch(selectionActions.selectComparisonMode(comparisonMode)),
    selectRange: (range: DateRange) => dispatch(selectionActions.selectRange(range))
});

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux;

class CountrySelect extends Component<Props> {
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

    getCurrentRange = () => new DateRange(moment(this.props.selectionState.rangeFrom), moment(this.props.selectionState.rangeTo))

    render() {
        return (
            <MuiPickersUtilsProvider utils={MomentUtils}>
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
                        <Box>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        disabled={false}
                                        checked={this.props.selectionState.normalize}
                                        onChange={(e) => this.props.selectNormalize(e.target.checked)}
                                        name="normalized"
                                        color="primary"
                                    />}
                                label="Per 1M Population"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        disabled={false}
                                        checked={this.props.selectionState.comparisonMode}
                                        onChange={(e) => this.props.selectComparisonMode(e.target.checked)}
                                        name="enableMultiple"
                                        color="primary"
                                    />}
                                label="Comparison Mode"
                            />
                        </Box>
                        <Box>
                            <KeyboardDatePicker
                                disableToolbar
                                variant="inline"
                                format="yyyy-MM-DD"
                                margin="normal"
                                id="from-picker"
                                label="From Date"
                                value={moment(this.props.selectionState.rangeFrom).toDate()}
                                onChange={(date) => {
                                    const currentRange = this.getCurrentRange()
                                    this.props.selectRange(new DateRange(moment.min(moment(date), currentRange.end), currentRange.end));
                                }}
                            />
                        </Box>
                        <Box>
                            <KeyboardDatePicker
                                disableToolbar
                                variant="inline"
                                format="yyyy-MM-DD"
                                margin="normal"
                                id="to-picker"
                                label="To Date"
                                value={moment(this.props.selectionState.rangeTo).toDate()}
                                onChange={(date) => {
                                    const currentRange = this.getCurrentRange()
                                    this.props.selectRange(new DateRange(currentRange.start, moment.max(moment(date), currentRange.start)));
                                }}
                            />
                        </Box>
                    </Toolbar>
                </AppBar>
            </MuiPickersUtilsProvider>
        )
    }
}

export default connector(CountrySelect);