import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Sector {
    name: string,
    countryCodes: string[]
}

interface SelectionState {
    sectors: Sector[];
}

const initialState: SelectionState = {
    sectors: []
};

const slice = createSlice({
    name: 'selection',
    initialState: initialState,
    reducers: {
        setSelection: (state: SelectionState, action: PayloadAction<Sector[]>) => ({
            sectors: action.payload
        })        
    },
});    

export const selectionReducer = slice.reducer;
export const { actions } = slice;