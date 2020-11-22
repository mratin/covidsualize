import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getCountryDays } from '../../api/covid19api';
import { DayOneCountryDto } from '../../api/dto';

export interface CountryDays {
    days: CountryDay[]
}

export interface CountryDay {
    totalCases: number;
    totalDeaths: number;
    dateTime: string;
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
        builder.addCase(fetchCountryDays.fulfilled, (state: CountryDaysState, action: PayloadAction<CountryDaysResponse>) =>
            ({
                ...state,
                [action.payload.slug]: ({
                    days: action.payload.dtos.map(adapter)
                })
            }));
        }
    });

export const countryDaysReducer = slice.reducer;
export const { actions } = slice;