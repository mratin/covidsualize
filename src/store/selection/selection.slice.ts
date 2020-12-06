import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SectorId } from '../sectors/sectors.slice';
import { extendMoment, DateRange } from 'moment-range';
import moment from 'moment';

export interface SelectionState {
    sectorIds: SectorId[],
    comparisonMode: boolean,
    normalize: boolean,
    range: DateRange
}

const initialState: SelectionState = {
    sectorIds: [],
    comparisonMode: false,
    normalize: false,
    range: new DateRange(moment('2020-01-01T00:00:00Z'), moment())
};

const slice = createSlice({
    name: 'selection',
    initialState: initialState,
    reducers: {
        selectSectors: (state: SelectionState, action: PayloadAction<SectorId[]>) => ({
            ...state,
            sectorIds: action.payload
        }),
        selectComparisonMode: (state: SelectionState, action: PayloadAction<boolean>) => ({
            ...state,
            comparisonMode: action.payload
        }),
        selectNormalize: (state: SelectionState, action: PayloadAction<boolean>) => ({
            ...state,
            normalize: action.payload
        }),
        selectRange: (state: SelectionState, action: PayloadAction<DateRange>) => ({
            ...state,
            range: action.payload
        })
    },
});    

export const selectionReducer = slice.reducer;
export const { actions } = slice;