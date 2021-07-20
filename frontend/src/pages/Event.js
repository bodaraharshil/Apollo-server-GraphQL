import React from 'react';
import './Event.css';

import Modal from '../component/modal/modal';
import Backdrop from '../component/Backdrop/Backdrop';
import AuthContext from '../context/auth-context';
import Eventlist from '../component/Events/Eventlist/Eventlist';
import Spinner from '../component/Spinner/Spinner';

class Event extends React.Component {

    state = {
        creating: false,
        events: [],
        isLoading: false,
        selectedEvent: null,
        isActive: true
    }

    static contextType = AuthContext

    constructor(props) {
        super(props);
        this.titleEl = React.createRef();
        this.priceEl = React.createRef();
        this.dateEl = React.createRef();
        this.descriptionEl = React.createRef();
    }

    createEventHandler = () => {
        this.setState({ createing: true })
    }

    componentDidMount() {
        this.fetchEvent();
    }

    componentWillUnmount() {
        this.isActive = false
    }


    modalConfirm = async (e) => {
        e.preventDefault();
        const title = this.titleEl.current.value;
        const price = +this.priceEl.current.value;
        const date = this.dateEl.current.value;
        const description = this.descriptionEl.current.value;
        if (title.trim().length === 0 || price <= 0 || date.trim().length === 0 || description.trim().length === 0) {
            return;
        }
        let requestBody = {
            query: `
                    mutation($title:String!,$price:Float!,$date:String!,$description:String!) {
                        createEvent(eventInput:{title:$title,price:$price,date:$date,description:$description}) {
                            _id
                            title
                            description
                            price
                            date
                        }
                    }
                `,
            variables: { title, price, date, description }
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
            this.setState(prevState => {
                const updateEvent = [...prevState.events];
                console.log("[][][][]", resData)
                updateEvent.push({
                    _id: this.context.userId,
                    title: resData.data.title,
                    description: resData.data.description,
                    price: resData.data.price,
                    date: resData.data.date,
                    creator: {
                        _id: this.context.userId
                    }
                });
                return {
                    events: updateEvent
                };
            })
            this.fetchEvent();
        }).catch((error) => {
            console.log(error);
        })
        this.setState({ createing: false, selectedEvent: null })
    }

    modalCancel = () => {
        this.setState({ createing: false, selectedEvent: null })
    }

    fetchEvent = async () => {
        this.setState({ isLoading: true });
        let requestBody = {
            query: `
                    query {
                        events {
                            _id
                            title
                            description
                            price
                            date
                            creator {
                                _id
                                email
                            }
                        }
                    }
                `,
        };
        await fetch(`${process.env.REACT_APP_NODE_API}`, {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((res) => {
            if (res.status !== 200 && res.status !== 201) {
                throw new Error("Failed!");
            }
            return res.json();
        }).then((resData) => {
            const event = resData.data.events;
            if (this.state.isActive) {
                this.setState({ events: event, isLoading: false })
            }
        }).catch((error) => {
            console.log(error);
            if (this.state.isActive) {
                this.setState({ isLoading: false, });
            }
        })
    }

    showDetailHandler = (eventId) => {
        this.setState(prevState => {
            const selectedevent = prevState.events.find(e => e._id === eventId);
            return { selectedEvent: selectedevent }
        })
    }

    bookEventHandler = async (e) => {
        e.preventDefault();
        if (!this.context.token) {
            this.setState({ selectedEvent: null });
            return;
        }
        let requestBody = {
            query: `
                    mutation bookEvent($id:ID!){
                        bookEvent(eventId:$id) {
                            _id
                            createdAt
                            updatedAt
                        }
                    }
                `,
            variables: {
                id: this.state.selectedEvent._id
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
            console.log("{}{}{}", resData);
            this.setState({ selectedEvent: null });
        }).catch((error) => {
            console.log(error);
        })
    }

    render() {

        return (
            <React.Fragment>
                {
                    this.state.createing &&
                    <>
                        <Backdrop />
                        <Modal title={'Add Event'} canCancel canConfirm Confirmtext="Confirm" onConfirm={this.modalConfirm} onCancel={this.modalCancel}>
                            <form>
                                <div className="form-control">
                                    <label htmlFor="title">Title</label>
                                    <input type="text" id="title" ref={this.titleEl} />
                                </div>
                                <div className="form-control">
                                    <label htmlFor="price">Price</label>
                                    <input type="number" id="price" ref={this.priceEl} />
                                </div>
                                <div className="form-control">
                                    <label htmlFor="date">Date</label>
                                    <input type="datetime-local" id="date" ref={this.dateEl} />
                                </div>
                                <div className="form-control">
                                    <label htmlFor="title">Description</label>
                                    <textarea id="description" rows="4" ref={this.descriptionEl}></textarea>
                                </div>
                            </form>
                        </Modal>
                    </>
                }
                {
                    this.context.token &&
                    <div className="event_control">
                        <p>Share your own Events!</p>
                        <button className="btn-grad" onClick={this.createEventHandler}>Crate Event</button>
                    </div>
                }
                {
                    this.state.selectedEvent &&
                    <>
                        <Backdrop />
                        <Modal title={this.state.selectedEvent.title} canCancel Confirmtext="Book" canConfirm onConfirm={this.bookEventHandler} onCancel={this.modalCancel} confirmText="Book">
                            <h2>{this.state.selectedEvent.title}</h2>
                            <h4>${this.state.selectedEvent.price}-{new Date(this.state.selectedEvent.date).toLocaleDateString()}</h4>
                            <p>{this.state.selectedEvent.description}</p>
                        </Modal>
                    </>
                }
                {
                    this.state.isLoading ?
                        <Spinner />
                        : <Eventlist events={this.state.events} authuserId={this.context.userId} onViewdetail={this.showDetailHandler} />
                }
            </React.Fragment >
        )
    }
}

export default Event;