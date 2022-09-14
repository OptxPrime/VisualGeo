import React, {useState} from 'react';
import {Stage, Layer, Text, Circle, Line,} from 'react-konva';

import {grahamScan} from "../../geom/convex-hull";
import {pointInConvexPolygon} from "../../geom/point-in-polygon";
import {PointInConvexPolygonSteps} from "../../components/PointInConvexPolygonSteps";
import {NavLink} from "react-router-dom";
import {AlgoDescription} from "../../components/AlgoDescription";


// y coordinates on canvas are increasing when we go down, which is opposite to Cartesian coordinates
const transformY = (points) => {
    return points.map(
        (element) => {
            return {x: element.x, y: element.y * (-1)}
        }
    );
}


export const PointInConvexPolygon = () => {

    const [polygon, setPolygon] = useState([]);
    const [point, setPoint] = useState(null);
    const [iterations, setIterations] = useState([]);
    const [stepNumber, setStepNumber] = useState(null);
    const [showStepByStep, setShowStepByStep] = useState(false);
    const [error, setError] = useState('');
    const [mode, setMode] = useState('poly');
    const [isInside, setIsInside] = useState(null);
    const [view, setView] = useState("visual");

    const handleModeChange = (e) => {
        setMode(e.target.value);
    }

    const resetResult = () => {
        setIsInside(null);
        setIterations([]);
        setShowStepByStep(false);
        setError(null);
    }

    const clear = () => {
        resetResult();
        setPolygon([]);
        setPoint(null);
    }

    const switchView = () => {
        if(view === 'visual') setView('description');
        else setView('visual');
    }

    const handleNewPoint = (e) => {
        resetResult();
        if (mode === 'poly') {
            let newPoint =  {x: e.evt.clientX, y: e.evt.clientY};
            if(polygon.length < 3)
                setPolygon([...polygon, {x: e.evt.clientX, y: e.evt.clientY}]);
            else {
                let pts = transformY([...polygon, newPoint]);
                let hull = transformY(grahamScan(pts).hull);

                setPolygon(hull);
            }
        }
        else setPoint({x: e.evt.clientX, y: e.evt.clientY});
    }

    const pointInsidePolygon = () => {
        if (polygon.length < 3) {
            setError("Invalid polygon");
            return;
        } else if (!point) {
            setError("Missing test point");
            return;
        }
        let pts = transformY(polygon);
        let hull;
        ({hull} = grahamScan(pts));
        let h = transformY(hull);
        setPolygon(h);
        let {ans, iterations} = pointInConvexPolygon(h.reverse(), point); // reverse to get CCW hull, otherwise binary search should be a bit different
        setIsInside(ans);
        setIterations(iterations);
    }

    return (
        <>
            <button
                className="switch-button w3-button w3-round-large w3-black w3-margin"
                onClick={() => switchView()}
            >
                {view === 'visual' ? 'Description' : 'Visual'}
            </button>

            <NavLink style={{textDecoration:"none"}} to="/home">
                <button
                    className="home-button w3-button w3-round-large w3-black w3-margin"
                >
                Home
                </button>
            </NavLink>


            {
                view === 'description' ? <AlgoDescription algo="point-in-polygon"/>
                    :
                <Stage width={window.innerWidth} height={window.innerHeight} onMouseDown={handleNewPoint}>
                    <Layer>
                        <Text fill="white" padding={20} opacity={0.5} align="center" width={window.innerWidth}
                              text="Click to add point" fontSize={20}/>
                        {
                            polygon.map(({x, y}, i) => {
                                return <Circle x={x} y={y} radius={5} fill="magenta"/>
                            })
                        }
                        {
                            point ? <Circle x={point.x} y={point.y} radius={5} fill="cyan"/> : null
                        }
                        {
                            !showStepByStep || stepNumber >= iterations.length ?
                                polygon.map(({x, y}, i) => {
                                    return (
                                        <>
                                            {
                                                (i > 0) ?
                                                    <Line
                                                        points={[x, y, polygon[i - 1].x, polygon[i - 1].y]}
                                                        stroke={isInside === true ? "green" : isInside === false ? "red" : "blue"}
                                                    />
                                                    :
                                                    <Line
                                                        points={[x, y, polygon[polygon.length - 1].x, polygon[polygon.length - 1].y]}
                                                        stroke={isInside === true ? "green" : isInside === false ? "red" : "blue"}
                                                    />
                                            }
                                        </>
                                    );
                                })
                                : stepNumber < iterations.length ?
                                    <PointInConvexPolygonSteps stepNumber={stepNumber} iterations={iterations}
                                                               p={point}/> : null
                        }
                    </Layer>
                </Stage>
            }
            {view === 'visual' ?
                <div className="footer w3-indigo">
                    <div>
                        <input className="w3-margin-left w3-margin-right" type="radio" value="poly" checked={mode === 'poly'} name="mode"
                               onChange={handleModeChange}/> Polygon
                        <input className="w3-margin-left w3-margin-right" type="radio" value="point" checked={mode === 'point'} name="mode"
                               onChange={handleModeChange}/> Point
                    </div>

                    <button className="w3-btn w3-blue w3-round-large w3-margin" onClick={() => {
                        pointInsidePolygon();
                    }
                    }>Check
                    </button>
                    {
                        error ? <p style={{display:"inline-block", color:"red", fontWeight:'bold'}} className="w3-margin"> {error} </p>
                            : isInside === true ? <p style={{display:"inline-block", color:"green", fontWeight:'bold'}} className="w3-margin"> Inside </p>
                                : isInside === false ? <p style={{display:"inline-block", color:"red", fontWeight:'bold'}} className="w3-margin"> Outside </p>
                                    : null
                    }
                    {
                        showStepByStep ?
                            <>
                                <button className="w3-btn w3-round-large w3-black w3-margin"
                                        onClick={() => {
                                            if (stepNumber < iterations.length) setStepNumber(stepNumber + 1);
                                        }}
                                > +
                                </button>
                                <p style={{display: "inline-block"}}> Step {stepNumber}/{iterations.length} </p>
                                <button className="w3-btn w3-round-large w3-black w3-margin"
                                        style={{display: "inline-block"}}
                                        onClick={() => {
                                            if (stepNumber > 1) setStepNumber(stepNumber - 1);
                                        }}> -
                                </button>
                            </> :
                            isInside !== null ?
                                <button className="w3-btn w3-round-large w3-black"
                                        onClick={() => {
                                            setShowStepByStep(true);
                                            setStepNumber(1);
                                        }}
                                > Show steps </button> : null
                    }
                    <div>
                        <button className="w3-margin-left w3-margin-right w3-btn w3-black w3-round-large" onClick={()=>clear()}> Clear points </button>
                        <button className="w3-btn w3-round-large w3-black w3-margin"
                                style={{display: "inline-block"}}
                                onClick={() => {
                                    setPolygon(polygon.slice(0, -1));
                                    setShowStepByStep(false);
                                    resetResult();
                                }}
                        > Undo (polygon)
                        </button>
                    </div>
                </div>:null
            }
        </>
    );
}