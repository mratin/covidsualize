import { Paper } from '@material-ui/core';
import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { colors, Color } from '../colors';
import { DataPoint, emptyDataPoint, toDataPoints } from '../createDataSet';
import { fetchCountries } from '../store/countries/countries.slice';
import { fetchCountryDays } from '../store/countryDays/countryDays.slice';
import { Sector } from '../store/sectors/sectors.slice';
import { AppDispatch, RootState } from '../store/store';
import './App.css';
import { ChartDataSet, CoronaChart } from './Chart';
import * as Moment from 'moment';
import { DateRange, extendMoment } from 'moment-range';

const moment = extendMoment(Moment);

interface DataChart {
    title: string,
    datasets: ChartDataSet[]
}

const mapState = (state: RootState) => ({
    countriesState: state.countries,
    countryDaysState: state.countryDays,
    selectionState: state.selection,
    sectorsState: state.sectors
});

const mapDispatch = (dispatch: AppDispatch) => ({
    fetchCountries: () => dispatch(fetchCountries()),
    fetchCountryDays: (slug: string) => dispatch(fetchCountryDays(slug))
});

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux;

const toDateString = (moment: moment.Moment) => moment.format('YYYY-MM-DD');

class Charts extends Component<Props> {

    private dateRange = () => new DateRange(moment(this.props.selectionState.rangeFrom), moment(this.props.selectionState.rangeTo));
    private dates = () => Array.from(this.dateRange().by('day')).map(d => toDateString(d));

    private createAllDataCharts(): DataChart[][] {
        const roll = 7;

        let sectors: Sector[] = this.props.selectionState.sectorIds
            .map(sectorId => this.props.sectorsState[sectorId])
            .filter(sector => sector !== undefined)

        let dataCharts: DataChart[][] = sectors.map((sector, i) => {
            let countryDays = this.props.countryDaysState[sector.countries[0].slug]; // TODO support 
            const population = sector.population
            if (countryDays !== undefined && population !== undefined) {
                let normalizeBy = this.props.selectionState.normalize ? 1e6 / population : 1
                let dataPoints: Map<string, DataPoint> =
                    new Map(toDataPoints(roll, countryDays.days, normalizeBy).map(dataPoint => [toDateString(dataPoint.t), dataPoint]))
                return this.createDataCharts(sector.name, colors[i % colors.length], dataPoints)
            } else {
                return []
            }
        });

        return dataCharts;
    }

    private createDataCharts(
        title: string, color: Color, dataPoints: Map<string, DataPoint>): DataChart[] {

        let dvs: (DataPoint | undefined)[] = this.dates().map(t => dataPoints.get(t))

        if (this.props.selectionState.comparisonMode) {
            return [
                {
                    title: `New Cases (rolling avg)`,
                    datasets: [
                        {
                            title: title,
                            color: `rgba(${color.cases},1)`,
                            values: dvs.map(dv => dv?.rollingCases)
                        }
                    ]
                },
                {
                    title: `New Deaths (rolling avg)`,
                    datasets: [
                        {
                            title: title,
                            color: `rgba(${color.cases},1)`,
                            values: dvs.map(dv => dv?.rollingDeaths)
                        }
                    ]
                },
                {
                    title: `Total Cases`,
                    datasets: [
                        {
                            title: title,
                            color: `rgba(${color.cases},1)`,
                            values: dvs.map(dv => dv?.totalCases)
                        }
                    ]
                },
                {
                    title: `Total Deaths`,
                    datasets: [
                        {
                            title: title,
                            color: `rgba(${color.cases},1)`,
                            values: dvs.map(dv => dv?.totalDeaths)
                        }
                    ]
                }
            ]
        } else {
            return [
                {
                    title: `${title}: New Cases and Deaths`,
                    datasets:
                        [
                            {
                                title: `New Cases`,
                                color: `rgba(${color.cases},0.2)`,
                                values: dvs.map(dv => dv?.newCases)
                            },
                            {
                                title: `New Cases (rolling avg)`,
                                color: `rgba(${color.cases},1)`,
                                values: dvs.map(dv => dv?.rollingCases)
                            },
                            {
                                title: `New Deaths`,
                                color: `rgba(${color.deaths},0.2)`,
                                values: dvs.map(dv => dv?.newDeaths)
                            },
                            {
                                title: `New Deaths (rolling avg)`,
                                color: `rgba(${color.deaths},1)`,
                                values: dvs.map(dv => dv?.rollingDeaths)
                            }
                        ]
                },
                {
                    title: `${title}: Total Cases and Deaths`,
                    datasets: [
                        {
                            title: `Total Cases`,
                            color: `rgba(${color.cases},1)`,
                            values: dvs.map(dv => dv?.totalCases)
                        },
                        {
                            title: `Total Deaths`,
                            color: `rgba(${color.deaths},1)`,
                            values: dvs.map(dv => dv?.totalDeaths)
                        }
                    ]
                }
            ];
        }
    }

    render() {
        let allCharts = this.createAllDataCharts()
        let numberOfCharts = allCharts.length > 0 ? Math.min(...allCharts.map(s => s.length)) : 0
        return (
            <Paper elevation={2}>
                {Array.from(Array(numberOfCharts).keys()).map(i =>
                    <CoronaChart
                        key={i}
                        title={allCharts[0][i].title}
                        labels={this.dates().map(t => t.toLocaleString())}
                        datasets={allCharts.map(dc => dc[i].datasets).flat()}
                    />
                )}
            </Paper>
        )
    }
};

export default connector(Charts);