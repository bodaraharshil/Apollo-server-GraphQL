import React from 'react';
import './Bookinglist.css';

import Bookingitem from './Bookingitem/Bookingitem';

const Bookinglist = (props) => {

    const booking = props.bookings.map((booking) => {
        return (
            <Bookingitem key={booking._id} bookingId={booking._id} date={booking.createdAt} title={booking.title} event={booking.event} onDelete={props.onDeleteBooking} />
        )
    })

    return <ul className="event_list">
        {booking}
    </ul>
}

export default Bookinglist;