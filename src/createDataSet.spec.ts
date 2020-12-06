import moment from "moment";
import { toDataPoints } from "./createDataSet";

const countryDays = [
    {
        dateTime: "2020-02-23T00:00:00Z",
        newCases: 20,
        newDeaths: 3,
        totalCases: 20,
        totalDeaths: 3
    },
    {
        dateTime: "2020-02-24T00:00:00Z",
        newCases: 100,
        newDeaths: 5,
        totalCases: 120,
        totalDeaths: 8
    },
    {
        dateTime: "2020-02-25T00:00:00Z",
        newCases: 50,
        newDeaths: 10,
        totalCases: 170,
        totalDeaths: 18
    },
    {
        dateTime: "2020-02-26T00:00:00Z",
        newCases: 70,
        newDeaths: 12,
        totalCases: 190,
        totalDeaths: 30
    }];

test('data set', () => {
    let actual = toDataPoints(3, countryDays, 1);
    console.log("Actual: " + actual);
    expect(actual).toEqual([
        {
            t: moment("2020-02-23T00:00:00Z"),
            newCases: 20,
            newDeaths: 3,
            totalCases: 20,
            totalDeaths: 3,
            rollingCases: undefined,
            rollingDeaths: undefined
        },
        {
            t: moment("2020-02-24T00:00:00Z"),
            newCases: 100,
            newDeaths: 5,
            totalCases: 120,
            totalDeaths: 8,
            rollingCases: 57,
            rollingDeaths: 6
        },
        {
            t: moment("2020-02-25T00:00:00Z"),
            newCases: 50,
            newDeaths: 10,
            totalCases: 170,
            totalDeaths: 18,
            rollingCases: 73,
            rollingDeaths: 9
        },
        {
            t: moment("2020-02-26T00:00:00Z"),
            newCases: 70,
            newDeaths: 12,
            totalCases: 190,
            totalDeaths: 30,
            rollingCases: undefined,
            rollingDeaths: undefined
        }
    ]);
});