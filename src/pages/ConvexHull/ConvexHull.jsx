import React, {useState} from 'react';
import {Stage, Layer, Text, Circle, Line,} from 'react-konva';

import './ConvexHull.css';
import {grahamScan} from "../../geom/convex-hull";

const generateShapes = () => {
    return [...Array(10)].map((_, i) => ({
        id: i.toString(),
        x: Math.random() * (window.innerWidth - 400) + 100,
        y: Math.random() * (window.innerHeight - 400) + 100,
        rotation: Math.random() * 180,
        isDragging: false,
    }));
}

// y coordinates on canvas are increasing when we go down, which is opposite to Cartesian coordinates
const transformY = (points) => {
    return points.map(
        (element) => {
            return {x: element.x, y: element.y * (-1)}
        }
    );
}


export const ConvexHull = () => {

    // const [points, setPoints] = useState(generateShapes());
    const [points, setPoints] = useState([]);
    const [hull, setHull] = useState([]);
    const [iterations, setIterations] = useState([]);
    const [stepNumber, setStepNumber] = useState(null);
    const [showStepByStep, setShowStepByStep] = useState(false);

    const handleNewPoint = (e) => {
        setPoints([...points, {x: e.evt.clientX, y: e.evt.clientY}]);
    }

    const findConvexHull = () => {
        let pts = transformY(points);
        let {hull, iterations} = grahamScan(pts);
        let h = transformY(hull);
        setHull(h);
        setIterations(iterations);
    }

    return (
        <>
            <Stage width={window.innerWidth} height={window.innerHeight} onMouseDown={handleNewPoint}>
                <Layer>
                    <Text fill="white" align="center" text="Click to add point" fontSize={20}/>
                    {
                        points.map(({x, y}) => {
                            return <Circle x={x} y={y} radius={5} fill="orange"/>
                        })
                    }

                    {
                        !showStepByStep || stepNumber >= iterations.length ?
                            hull.map(({x, y}, i) => {
                                if (i > 0) return <Line points={[x, y, hull[i - 1].x, hull[i - 1].y]}
                                                        stroke="green"/>
                                return <Line points={[x, y, hull[hull.length - 1].x, hull[hull.length - 1].y]}
                                             stroke="green"/>
                            })
                            : stepNumber < iterations.length ?
                                <>
                                    {
                                        iterations[stepNumber].hull ?
                                            iterations[stepNumber].hull.map(({x, y}, i) => {
                                                if (i > 0) return <Line
                                                    points={[
                                                        x,
                                                        y,
                                                        iterations[stepNumber].hull[i - 1].x,
                                                        iterations[stepNumber].hull[i - 1].y
                                                    ]}
                                                    stroke="green"/>

                                            }) : null
                                    }
                                    {
                                        iterations[stepNumber].change.type === 'remove' ?
                                            <>
                                                <Circle x={iterations[stepNumber].change.b.x}
                                                        y={iterations[stepNumber].change.b.y}
                                                        radius={5}
                                                        fill="red"
                                                />
                                                <Line
                                                    points={[
                                                        iterations[stepNumber].change.a.x,
                                                        iterations[stepNumber].change.a.y,
                                                        iterations[stepNumber].change.b.x,
                                                        iterations[stepNumber].change.b.y,
                                                        iterations[stepNumber].change.c.x,
                                                        iterations[stepNumber].change.c.y
                                                    ]}
                                                    stroke="red"/>
                                            </> : iterations[stepNumber].change.type === 'add' ?
                                                <>
                                                    <Circle x={iterations[stepNumber].change.b.x}
                                                            y={iterations[stepNumber].change.b.y}
                                                            radius={5}
                                                            fill="blue"
                                                    />
                                                </> : null
                                    }
                                </>
                                : null
                    }
                </Layer>
            </Stage>
            <div className="footer w3-indigo">
                <input type="radio" value="Graham Scan" name="algo"/> Graham Scan
                <input type="radio" value="Gift Wrapping" name="algo"/> Gift Wrapping
                <br/>
                <button className="w3-btn w3-blue" onClick={() => {
                    setShowStepByStep(true);
                    setStepNumber(1);
                    findConvexHull();
                }
                }>Find convex hull
                </button>
                <br/>
                <button className="w3-btn w3-black w3-margin"
                        onClick={() => {
                            if (stepNumber < iterations.length) setStepNumber(stepNumber + 1);
                        }}
                > +
                </button>
                {
                    showStepByStep ?
                        <p style={{display: "inline-block"}}> Step {stepNumber}/{iterations.length} </p> : null
                }
                <button className="w3-btn w3-black w3-margin"
                        style={{display: "inline-block"}}
                        onClick={() => {
                            if (stepNumber > 0) setStepNumber(stepNumber - 1);
                        }}> -
                </button>

            </div>
        </>
    );
}