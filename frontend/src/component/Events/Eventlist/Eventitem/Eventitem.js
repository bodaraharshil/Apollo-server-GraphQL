import React from 'react';
import './Eventitem.css';

const Eventitem = (props) => {
    return (
        <li key={props._id} className="event_list-item">
            <div>
                <h3>{props.title}</h3>
                <h4>${props.price}-{new Date(props.date).toLocaleDateString()}</h4>
            </div>
            <div>
                {
                    props.userId === props.creatorId ?
                        <p>your the owner of this event.</p>
                        : <button className="btn-grad" onClick={props.onDetail.bind(this, props.eventId)}>View Details</button>

                }
            </div>
        </li>
    )
}

export default Eventitem;