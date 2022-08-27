import './App.css';

import React from 'react';
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";

import {Homepage} from "./pages/Homepage/Homepage";
import {ConvexHull} from "./pages/ConvexHull/ConvexHull";
import {PointInConvexPolygon} from "./pages/PointInConvexPolygon/PointInConvexPolygon";


function App() {
    return (
        <div className="App">
            <header className="App-header">
                <BrowserRouter>
                    <Routes>
                        <Route path="convex-hull" element={<ConvexHull/>}/>
                        <Route path="point-in-a-convex-polygon" element={<PointInConvexPolygon/>}/>
                        <Route path="home" element={<Homepage/>}/>
                        <Route path="*" element={<Navigate to="/home" replace={true}/>}/>
                    </Routes>
                </BrowserRouter>
            </header>
        </div>
    );
}

export default App;
