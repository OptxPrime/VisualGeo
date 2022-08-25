import React, {useState} from 'react';
import {Stage, Layer, Text, Circle, Line,} from 'react-konva';

import './ConvexHull.css';
import {grahamScan} from "../../geom/convex-hull";
import {giftWrapping} from "../../geom/gift-wrapping";
import {GrahamScanSteps} from "../../components/GrahamScanSteps";
import {GiftWrappingSteps} from "../../components/GiftWrappingSteps";

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
    const [algo, setAlgo] = useState('graham');

    const handleAlgoChange = (e) => {
        setAlgo(e.target.value);
        setStepNumber(1);
        setShowStepByStep(false);
        setHull([]);
        setIterations([]);
    }

    const handleNewPoint = (e) => {
        setPoints([...points, {x: e.evt.clientX, y: e.evt.clientY}]);
    }

    const findConvexHull = () => {
        let pts = transformY(points);
        let hull, iterations;
        if (algo === 'graham') {
            ({hull, iterations} = grahamScan(pts));
        } else if (algo === 'gift') {
            ({hull, iterations} = giftWrapping(pts));
        } else {
            ({hull, iterations} = grahamScan(pts));
        }

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
                                return (
                                    <>
                                        <Circle x={x} y={y} radius={6} fill="pink"/>
                                        {
                                            i > 0 ?
                                                <Line
                                                    points={[x, y, hull[i - 1].x, hull[i - 1].y]}
                                                    stroke="blue"
                                                />
                                                :
                                                <Line
                                                    points={[x, y, hull[hull.length - 1].x, hull[hull.length - 1].y]}
                                                    stroke="blue"
                                                />
                                        }
                                    </>
                                );
                            })
                            : stepNumber < iterations.length ?
                                algo === 'graham' ?
                                    <GrahamScanSteps stepNumber={stepNumber} iterations={iterations}/>
                                    : algo === 'gift' ?
                                        <GiftWrappingSteps stepNumber={stepNumber} iterations={iterations}/>

                                        : null : null
                        // : algo === 'gift' ?

                    }
                </Layer>
            </Stage>
            <div className="footer w3-indigo">
                <input type="radio" value="graham" name="algo" onChange={handleAlgoChange}/> Graham Scan
                <input type="radio" value="gift" name="algo" onChange={handleAlgoChange}/> Gift Wrapping
                <br/>
                <button className="w3-btn w3-blue" onClick={() => {
                    findConvexHull();
                }
                }>Find convex hull
                </button>
                <br/>

                {
                    showStepByStep ?
                        <>
                            <button className="w3-btn w3-black w3-margin"
                                    onClick={() => {
                                        if (stepNumber < iterations.length) setStepNumber(stepNumber + 1);
                                    }}
                            > +
                            </button>
                            <p style={{display: "inline-block"}}> Step {stepNumber}/{iterations.length} </p>
                            <button className="w3-btn w3-black w3-margin"
                                    style={{display: "inline-block"}}
                                    onClick={() => {
                                        if (stepNumber > 0) setStepNumber(stepNumber - 1);
                                    }}> -
                            </button>
                        </> :
                        <button className="w3-btn w3-roung w3-black"
                                onClick={() => {
                                    setShowStepByStep(true);
                                    setStepNumber(1);
                                }}
                        > Show steps </button>
                }

            </div>
        </>
    );
}