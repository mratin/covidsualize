import _, { isNumber } from "lodash";
import moment from "moment";
import { CountryDay } from "./store/countryDays/countryDays.slice";

export interface DataSet {
    label: string,
    color: string,
    dataPoints: DataPoint[]
}

export interface DataPoint {
    t: moment.Moment,
    newCases: number,
    newDeaths: number,
    totalCases: number,
    totalDeaths: number,
    rollingCases: number | undefined,
    rollingDeaths: number | undefined
}

export const emptyDataPoint: (m: moment.Moment) => DataPoint = (t: moment.Moment) => ({
    t: t,
    newCases: 0,
    newDeaths: 0,
    totalCases: 0,
    totalDeaths: 0,
    rollingCases: undefined,
    rollingDeaths: undefined
});

const average = (xs: number[]) => xs.filter(x => isFinite(x)).reduce((a, b) => a + b, 0) / xs.length

export const toDataPoints: (roll: number, days: CountryDay[]) => DataPoint[] = (roll: number, days: CountryDay[]) => {
    let dataPoints: DataPoint[] = days.map(d => ({        
        t: moment(d.dateTime),
        newCases: d.newCases,
        newDeaths: d.newDeaths,
        totalCases: d.totalCases,
        totalDeaths: d.totalDeaths,
        rollingCases: undefined,
        rollingDeaths: undefined
    }));

    let daysByDate: Map<moment.Moment, DataPoint> = new Map(dataPoints.map(d => [d.t, d]));
    let dates: moment.Moment[] = _.sortBy(Array.from(daysByDate.keys()), (m: moment.Moment) => m.valueOf())

    return dates.map((m, i) => {
        let currentDay: DataPoint = daysByDate.get(m) || emptyDataPoint(m);
        
        let rollingDates = dates.slice(Math.max(i - Math.floor(roll / 2), 0), i + Math.ceil(roll / 2))

        let rolling = (f: (t: DataPoint) => number) => {
            let rollingValues = rollingDates.map(m => f(daysByDate.get(m) || emptyDataPoint(m)))
            return Math.round(average(rollingValues))
        }

        let rollingDefined = rollingDates.length == roll
        let rollingCases = rollingDefined ? rolling(d => d.newCases) : undefined
        let rollingDeaths = rollingDefined ? rolling(d => d.newDeaths) : undefined

        return ({
            ...currentDay,
            rollingCases: rollingCases,
            rollingDeaths: rollingDeaths
        })
    });
};