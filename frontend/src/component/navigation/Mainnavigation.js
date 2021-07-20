import React from 'react';
import { NavLink } from 'react-router-dom';

import AuthContext from '../../context/auth-context';
import './Mainnavigation.css';

const Mainnavigation = (props) => {
    return (
        <AuthContext.Consumer>
            {(context) => {
                return (
                    <header className="main_navigation">
                        <div className="main_navigation_logo">
                            <h2>EasyEvent</h2>
                        </div>
                        <nav className="main_navigation_item text-center">
                            <ul>
                                {
                                    !context.token &&
                                    <li>
                                        <NavLink to="/auth">Authenticate</NavLink>
                                    </li>
                                }
                                <li>
                                    <NavLink to="/event">Events</NavLink>
                                </li>
                                {
                                    context.token &&
                                    <>
                                        <li>
                                            <NavLink to="/booking">Bookings</NavLink>
                                        </li>

                                    </>
                                }
                            </ul>
                        </nav>
                        {
                            context.token &&
                            <button className="btn-grad" onClick={context.logout}>Logout</button>
                        }
                    </header>
                )
            }
            }

        </AuthContext.Consumer>
    )
}

export default Mainnavigation;