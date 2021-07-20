import React from 'react';
import './Eventlist.css';

import Eventitem from './Eventitem/Eventitem';

const EventList = (props) => {

    const events = props.events.map((event) => {
        return (
            <Eventitem key={event._id} date={event.date} eventId={event._id} title={event.title} price={event.price} userId={props.authuserId} creatorId={event.creator._id} onDetail={props.onViewdetail} />
        )
    })

    return <ul className="event_list">
        {events}
    </ul>
}

export default EventList;