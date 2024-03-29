import {
    SIGN_IN,
    SIGN_OUT,
    FETCH_FLIGHTS,
    FETCH_PASSENGERS,
    UPDATE_PASSENGER,
    UPDATE_FLIGHT,
    MANAGE_PASSENGER
} from './types';
import airline from '../../apis/airline';
export const signIn = (userId) => {
    return {
        type: SIGN_IN,
        payload: userId
    };
};

export const signOut = () => {
    return {
        type: SIGN_OUT
    };
};

export const fetchFlightDetails = () => async dispatch => {
    const response = await airline.get('/flights');
    dispatch({ type: FETCH_FLIGHTS, payload: response.data });
}

export const fetchPassengerDetails = () => async dispatch => {
    const response = await airline.get('/passengers');
    dispatch({ type: FETCH_PASSENGERS, payload: response.data });
}

export const updatePassengerDetails = (id, passengerDetails) => async dispatch => {
    const response = await airline.patch(`/passengers/${id}`, passengerDetails);
    dispatch({ type: UPDATE_PASSENGER, payload: response.data });
}

export const updateFlightDetails = (id, flightDetails) => async dispatch => {
    const response = await airline.patch(`/flights/${id}`, flightDetails);
    dispatch({ type: UPDATE_FLIGHT, payload: response.data });
}

export const managePassenger = (managePassenger) => dispatch => {
    dispatch({ type: MANAGE_PASSENGER, payload: managePassenger });
}