import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getCountryDays } from '../../api/covid19api';
import { DayOneCountryDto } from '../../api/dto';
import * as _ from 'lodash';

export interface CountryDays {
    days: CountryDay[]
}

export interface CountryDay {
    totalCases: number;
    totalDeaths: number;
    dateTime: string;
    newCases: number;
    newDeaths: number;
}

interface CountryDaysState {
    [slug: string]: CountryDays;
}

interface CountryDaysResponse {
    slug: string,
    dtos: DayOneCountryDto[]
}

const initialState: CountryDaysState = {};

export const fetchCountryDays = createAsyncThunk<CountryDaysResponse, string>(
    'countryDays/fetchCountryDays',
    async (slug: string) => ({
        slug: slug,
        dtos: (await getCountryDays(slug)).data
    })
);

const dayOneCountryDtoAdapter: (dto: DayOneCountryDto) => CountryDay = (dto) => ({
    totalCases: dto.Confirmed,
    totalDeaths: dto.Deaths,
    dateTime: dto.Date,
    newCases: 0,
    newDeaths: 0
});

const countryDaysAdapter: (days: CountryDay[]) => CountryDay[] = (days) => {
    if (days.length > 0) {
        const withNews = _.zip(days, days.slice(1)).slice(0, -1).map(pair => {
            const current: CountryDay = pair[1]!;
            const prev: CountryDay = pair[0]!;
            return ({
                ...current, 
                newCases: current.totalCases - prev.totalCases,
                newDeaths: current.totalDeaths - prev.totalDeaths
            });
        });
        return [days[0], ...withNews];
    } else {
        return [];
    }
};


const slice = createSlice({
    name: 'countryDays',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchCountryDays.fulfilled, (state: CountryDaysState, action: PayloadAction<CountryDaysResponse>) =>
            ({
                ...state,
                [action.payload.slug]: ({
                    days: countryDaysAdapter(action.payload.dtos.map(dayOneCountryDtoAdapter))
                })
            }));
    }
});

export const countryDaysReducer = slice.reducer;
export const { actions } = slice;