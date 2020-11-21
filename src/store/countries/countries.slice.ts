import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getCountries } from '../../api/covid19api';
import { CountryDto } from '../../api/dto';

export interface Country {
    name: string;
    isoCode: string;
}

interface CountryState {
    countries: Country[];
    loading: 'idle' | 'pending' | 'failed' | 'succeeded';
}

const initialState: CountryState = {
    countries: [],
    loading: 'idle'
};

export const fetchCountries = createAsyncThunk(
    'countries/fetchCountries',
    async () => (await getCountries()).data
);

const slice = createSlice({
    name: 'countries',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchCountries.pending, (state: CountryState, ) => ({
            ...state, 
            countries: [],
            loading: 'pending',
        }));
        builder.addCase(fetchCountries.fulfilled, (state: CountryState, action: PayloadAction<CountryDto[]>) => ({
            ...state, 
            countries: action.payload.map(dto => ({name: dto.Country, isoCode: dto.ISO2 })),
            loading: 'succeeded'
        }));
        builder.addCase(fetchCountries.rejected, (state: CountryState, ) => ({
            ...state,
            loading: 'failed'
        }));
    }
});    

export const countriesReducer = slice.reducer;
export const { actions } = slice;