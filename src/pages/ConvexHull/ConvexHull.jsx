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

    const [points, setPoints] = useState([]);
    const [sortedPoints, setSortedPoints] = useState([]);
    const [hull, setHull] = useState([]);
    const [iterations, setIterations] = useState([]);
    const [stepNumber, setStepNumber] = useState(null);
    const [showStepByStep, setShowStepByStep] = useState(false);
    const [algo, setAlgo] = useState('graham');
    const [error, setError] = useState('');

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

    const clear = () => {
        setShowStepByStep(false);
        setPoints([]);
        setSortedPoints([]);
        setHull([]);
        setIterations([]);
        setError('');
    }

    const findConvexHull = () => {
        if(points.length < 3){
            setError("3 points required");
            return;
        }
        setError('');
        setShowStepByStep(false);
        setStepNumber(0);
        let pts = transformY(points);
        let hull, iterations, sortedPoints;
        if (algo === 'graham') {
            ({hull, iterations, sortedPoints} = grahamScan(pts));
            setSortedPoints(transformY(sortedPoints));
        } else if (algo === 'gift') {
            ({hull, iterations} = giftWrapping(pts));
        } else {
            ({hull, iterations, sortedPoints} = grahamScan(pts));
            setSortedPoints(transformY(sortedPoints));
        }

        let h = transformY(hull);
        setHull(h);
        setIterations(iterations);
    }

    return (
        <>
            <Stage width={window.innerWidth} height={window.innerHeight} onMouseDown={handleNewPoint}>
                <Layer>
                    <Text fill="white" padding={20} opacity={0.5} width={window.innerWidth} align="center" text="Click to add point" fontSize={20}/>
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
                                    <GrahamScanSteps stepNumber={stepNumber} iterations={iterations} allPoints={sortedPoints}/>
                                    : algo === 'gift' ?
                                        <GiftWrappingSteps stepNumber={stepNumber} iterations={iterations}/>

                                        : null : null
                        // : algo === 'gift' ?

                    }
                </Layer>
            </Stage>
            <div className="footer w3-indigo">

                <div>
                    <input className="w3-margin-left w3-margin-right" type="radio" value="graham" name="algo" checked={algo === 'graham'} onChange={handleAlgoChange}/> Graham Scan
                    <input className="w3-margin-left w3-margin-right" type="radio" value="gift" name="algo" checked={algo === 'gift'} onChange={handleAlgoChange}/> Gift Wrapping
                    <button className="w3-margin-left w3-margin-right w3-btn w3-black w3-round-large" onClick={()=>clear()}> Clear points </button>
                </div>
                <br/>
                <button className="w3-btn w3-blue w3-margin w3-round-large" onClick={() => {
                    findConvexHull();
                }
                }>Find convex hull
                </button>
                {
                    error ?
                        <p style={{display:"inline-block", color:"red", fontWeight:'bold'}} className="w3-margin"> {error} </p>
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
                                        if (stepNumber > 0) setStepNumber(stepNumber - 1);
                                    }}> -
                            </button>
                        </> :
                        iterations.length ?
                        <button className="w3-btn w3-round-large w3-margin w3-black"
                                onClick={() => {
                                    setShowStepByStep(true);
                                    setStepNumber(1);
                                }}
                        > Show steps </button> : null
                }

            </div>
        </>
    );
}