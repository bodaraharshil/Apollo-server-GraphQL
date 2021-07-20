import React from 'react';
import AuthContext from '../context/auth-context';
import Spinner from '../component/Spinner/Spinner';
import './Booking.css';
import Bookinglist from '../component/Bookings/Bookinglist/Bookinglist';
import Bookingchart from '../component/Bookings/Bookingchart/Bookingchart';


class Booking extends React.Component {

    state = {
        isLoading: false,
        bookings: [],
        outputType: "list"
    };

    static contextType = AuthContext

    componentDidMount() {
        this.fetchBooking()
    }

    fetchBooking = async () => {
        this.setState({ isLoading: true });
        let requestBody = {
            query: `
                    query {
                        bookings {
                            _id
                            createdAt
                            updatedAt
                            event{
                                _id
                                title
                                date
                                price
                            }
                        }
                    }
                `,
        };
        let token = this.context.token;
        await fetch(`${process.env.REACT_APP_NODE_API}`, {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        }).then((res) => {
            if (res.status !== 200 && res.status !== 201) {
                throw new Error("Failed!");
            }
            return res.json();
        }).then((resData) => {
            const event = resData.data.bookings;
            this.setState({ bookings: event, isLoading: false })

        }).catch((error) => {
            console.log(error);
            this.setState({ isLoading: false, });
        })
    }

    DeleteBookinghandler = async (bookingId) => {
        this.setState({ isLoading: true });
        let requestBody = {
            query: `
                    mutation cancelBooking($id:ID!){
                        cancelBooking (bookingId:$id){
                            _id
                            title
                        }
                    }
                `,
            variables: {
                id: bookingId
            }
        };
        let token = this.context.token;
        await fetch(`${process.env.REACT_APP_NODE_API}`, {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        }).then((res) => {
            if (res.status !== 200 && res.status !== 201) {
                throw new Error("Failed!");
            }
            return res.json();
        }).then((resData) => {
            this.setState(prveState => {
                const updateBooking = prveState.bookings.filter(booking => {
                    return booking._id !== bookingId;
                })
                return { bookings: updateBooking, isLoading: false };
            })

        }).catch((error) => {
            console.log(error);
            this.setState({ isLoading: false, });
        })
    }

    changeOutputtypeHandler = (outputType) => {
        if (outputType === 'list') {
            this.setState({ outputType: 'list' })
        }
        else if (outputType === 'chart') {
            this.setState({ outputType: 'chart', });
        }
    }

    render() {
        let content = <Spinner />;
        if (!this.state.isLoading) {
            content = (
                <React.Fragment>
                    <div style={{ display: 'flex', justifyContent: 'center' }} className="button-control">
                        <button className="activedata" onClick={this.changeOutputtypeHandler.bind(this, 'list')} className="btn-grad">List</button>
                        <button className="actactivedataive" onClick={this.changeOutputtypeHandler.bind(this, 'chart')} className="btn-grad">Chart</button>
                    </div >
                    {
                        this.state.outputType === 'list' ?
                            <Bookinglist bookings={this.state.bookings} onDeleteBooking={this.DeleteBookinghandler} />
                            : <Bookingchart bookings={this.state.bookings} />
                    }
                </React.Fragment >
            )
        }
        return (
            <>
                {content}
            </>
        )
    }
}

export default Booking;