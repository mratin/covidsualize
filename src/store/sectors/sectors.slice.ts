import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Country } from '../countries/countries.slice';

export type SectorId = string

export interface Sector {
    id: SectorId,
    name: string,
    population: number | undefined,
    countries: Country[]
}

interface SectorsState {
    [sectorId: string]: Sector
}

const initialState: SectorsState = {};

const slice = createSlice({
    name: 'sectors',
    initialState: initialState,
    reducers: {
        setSectors: (state: SectorsState, action: PayloadAction<Sector[]>) =>
            action.payload.reduce((st: SectorsState, sector: Sector) => ({
                ...st,
                [sector.id]: sector
            }),
                state)
    }
});

export const sectorsReducer = slice.reducer;
export const { actions } = slice;