import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getCountryDays } from '../../api/covid19api';
import { DayOneCountryDto } from '../../api/dto';

export interface CountryDays {
    name: string;
    isoCode: string;
    days: CountryDay[]
}

export interface CountryDay {
    totalCases: number;
    totalDeaths: number;
    dateTime: string;
}

interface CountryDaysState {
    [isoCode: string]: CountryDays;
}

const initialState: CountryDaysState = {};

export const fetchCountryDays = createAsyncThunk<DayOneCountryDto[], string>(
    'countryDays/fetchCountryDays',
    async (slug: string) => (await getCountryDays(slug)).data
);

const adapter: (dto: DayOneCountryDto) => CountryDay = (dto) => ({
    totalCases: dto.Confirmed,
    totalDeaths: dto.Deaths,
    dateTime: dto.Date
});

const slice = createSlice({
    name: 'countryDays',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchCountryDays.fulfilled, (state: CountryDaysState, action: PayloadAction<DayOneCountryDto[]>) => {
            let isoCode = action.payload[0]?.CountryCode;
            return isoCode !== undefined 
            ? {
                ...state,
                [isoCode]: ({ 
                    name: action.payload[0].Country,
                    isoCode: isoCode,
                    days: action.payload.map(adapter) 
                })
            }
            : state;
        })
    }
});    

export const countryDaysReducer = slice.reducer;
export const { actions } = slice;