import React from 'react';
import './Bookingitem.css';

const Bookingitem = (props) => {
    return (
        <li key={props._id} className="booking_list-item">
            <div>
                <h3>{props.event.title}-{new Date(props.date).toLocaleDateString()}</h3>
            </div>
            <div>
                <button className="btn-grad" onClick={props.onDelete.bind(this, props.bookingId)}>Cancel</button>
            </div>
        </li>
    )
}

export default Bookingitem;