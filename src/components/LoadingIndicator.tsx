import React, { Component } from 'react';
import { connect, ConnectedProps } from "react-redux";
import { RootState } from '../store/store';

const mapState = (state: RootState) => ({
    countriesState: state.countries,
    countryDaysState: state.countryDays
});


const connector = connect(mapState);
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux;

class LoadingIndicator extends Component<Props> {
    render() {
        return <div>{Object.keys(this.props.countryDaysState).length} / {this.props.countriesState.countries.length}</div>
    }
}

export default connector(LoadingIndicator);