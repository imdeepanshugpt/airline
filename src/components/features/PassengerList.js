import React from 'react';
import Card from '@material-ui/core/Card';
import { connect } from 'react-redux';
import { fetchPassengerDetails } from '../../store/actions';
import Button from '@material-ui/core/Button';
import './style.scss';
import './checkBox.scss';
import history from '../../history';

class PassengerList extends React.Component {
    constructor(props) {
        super(props);
        this.state = { flightDetails: undefined, updatedPassengerList: undefined };
    }
    componentWillMount() {
        this.props.fetchPassengerDetails();
        if (!this.props.adminFlag) {
            this.setState({ flightDetails: this.props.history.location.state });
        }
    }
    componentDidUpdate(prevProps) {
        if (prevProps.passengerList !== this.props.passengerList) {
            if (this.props.passengerList && (this.props.passengerList.length > 0)) {
                this.filterPassengerList(this.props.passengerList);
            }
        }
    }
    filterPassengerList(passengerList) {
        if (passengerList.length > 0 && !(this.props.adminFlag)) {
            const updatedPassengerList = passengerList.filter((passenger) => {
                return (passenger.flightId === this.state.flightDetails.flightId)
            });
            this.setState({ updatedPassengerList: updatedPassengerList });
        } else if (this.props.adminFlag) {
            this.setState({ updatedPassengerList: passengerList });
        }
    }
    changeSeat(passenger) {
        history.push("/checkin", { passenger, flightDetails: this.state.flightDetails });
    }
    renderPassengerList() {
        const buttonStyle = {
            float: 'right'
        };
        if (this.state.updatedPassengerList && this.state.updatedPassengerList.length > 0) {
            return this.state.updatedPassengerList.map((passenger) => {
                return (
                    <tr key={passenger.id}>
                        <td>{passenger.name}</td>
                        <td>{passenger.id}</td>
                        <td>{passenger.seatNumber}
                            {!this.props.adminFlag ?
                                <Button color="primary" style={buttonStyle} onClick={() => this.changeSeat(passenger)}>
                                    Change
                            </Button>
                                : ''
                            }
                        </td>
                        <td>{passenger.ancillaryService}</td>
                        <td>
                            {passenger.wheelChair ?
                                ((passenger.wheelChair === "Yes") || (passenger.wheelChair === true)) ?
                                    "Yes" : "No" : 'No'
                            }
                        </td>
                        <td>
                            {passenger.infants ?
                                ((passenger.infants === "Yes") || (passenger.infants === true)) ?
                                    "Yes" : "No" : 'No'
                            }
                        </td>
                    </tr>
                )
            });
        }
    }
    handleChange = name => event => {
        this.setState({ ...this.props.passengerList, [name]: event.target.checked });
    };
    filterByCheckBox(checkBoxValue, checkBoxType) {
        if (!checkBoxValue) {
            this.filterPassengerList(this.props.passengerList);
        } else {
            if (checkBoxType === 'CheckIn') {
                const updated = this.state.updatedPassengerList.filter((passenger) => {
                    return (passenger.seatNumber !== "" && passenger.seatNumber)
                })
                this.setState({ updatedPassengerList: updated });
            } else if (checkBoxType === 'WheelChair') {
                const updated = this.state.updatedPassengerList.filter((passenger) => {
                    return (passenger.wheelChair !== "" && passenger.wheelChair && passenger.wheelChair !== "No")
                })
                this.setState({ updatedPassengerList: updated });

            } else if (checkBoxType === 'Infant') {
                const updated = this.state.updatedPassengerList.filter((passenger) => {
                    return (passenger.infants !== "" && passenger.infants && passenger.infants !== "No")
                })
                this.setState({ updatedPassengerList: updated });
            }
        }

    }
    render() {

        return (
            <div className="passenger-list">
                <Card>
                    <div className="container">
                        <div className="checkbox">
                            <input type="checkbox" id="checkbox1" name="" value=""
                                onClick={(event) => this.filterByCheckBox(event.target.checked, 'CheckIn')} />
                            <label htmlFor="checkbox1"><span>CheckIn</span></label>
                        </div>
                        <div className="checkbox">
                            <input type="checkbox" id="checkbox2" name="" value=""
                                onClick={(event) => this.filterByCheckBox(event.target.checked, 'WheelChair')} />
                            <label htmlFor="checkbox2"><span>WheelChair</span></label>
                        </div>
                        <div className="checkbox">
                            <input type="checkbox" id="checkbox3" name="" value=""
                                onClick={(event) => this.filterByCheckBox(event.target.checked, 'Infant')} />
                            <label htmlFor="checkbox3"><span>Infant</span></label>
                        </div>
                    </div>
                </Card>
                <table>
                    <tbody>
                        <tr>
                            <th>Name</th>
                            <th>PNR Number</th>
                            <th>Seat Number</th>
                            <th>Ancillary services</th>
                            <th>wheel chair</th>
                            <th>Infant</th>
                        </tr>
                        {this.renderPassengerList()}
                    </tbody>
                </table>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        passengerList: state.airline.passengers,
        checkedIn: true
    };
}
export default connect(mapStateToProps, { fetchPassengerDetails })(PassengerList);