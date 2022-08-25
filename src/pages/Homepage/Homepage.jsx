import './Homepage.css';
import React from 'react';
import {NavLink} from "react-router-dom";

export const Homepage = () => {
    return (
        <>
            <div className="w3-container w3-center" style={{width: "70%", margin: "0 auto"}}>
                <div style={{height: '10%'}}></div>
                <h2 style={{fontWeigth: "700"}}>VisualGeo</h2>
                <h6 style={{color: "gray"}}> v1.0.0 </h6>
                <div style={{height: '10%'}}></div>
                <ul className="w3-ul w3-xlarge w3-center w3-pale-blue w3-hover-indigo">
                    <li className="w3-padding-small">
                        <NavLink className="w3-btn"
                                 key="convex-hull"
                                 style={{width: '100%'}}
                                 to={'/convex-hull'}
                        >
                            Convex Hull
                        </NavLink>
                    </li>
                </ul>
            </div>
        </>
    );
}