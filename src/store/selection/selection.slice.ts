import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SectorId } from '../sectors/sectors.slice';

export interface SelectionState {
    sectorIds: SectorId[],
    comparisonMode: boolean,
    normalize: boolean
}

const initialState: SelectionState = {
    sectorIds: [],
    comparisonMode: false,
    normalize: false
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
        })
    },
});    

export const selectionReducer = slice.reducer;
export const { actions } = slice;