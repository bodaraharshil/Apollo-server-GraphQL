import React from 'react';
import './Modal.css';

const Model = (props) => {
    return (
        <div className="modal">
            <header className="modal_header">
                <h3>{props.title}</h3>
            </header>
            <section className="modal_content">
                {props.children}
            </section>
            <section className="modal_actions">
                {
                    props.canCancel &&
                    <button className="btn-cancel" onClick={props.onCancel}>Cancel</button>
                }
                {
                    props.canConfirm &&
                    <button className="btn-grad" onClick={props.onConfirm}>{props.Confirmtext}</button>
                }
            </section>
        </div>
    )
}

export default Model;