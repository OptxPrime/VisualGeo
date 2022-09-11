import React, {useState} from 'react';
import {Stage, Layer, Text, Circle, Line, Group,} from 'react-konva';

import './ConvexHull.css';
import {grahamScan} from "../../geom/convex-hull";
import {giftWrapping} from "../../geom/gift-wrapping";
import {GrahamScanSteps} from "../../components/GrahamScanSteps";
import {GiftWrappingSteps} from "../../components/GiftWrappingSteps";
import {AlgoDescription} from "../../components/AlgoDescription";
import {NavLink} from "react-router-dom";


// y coordinates on canvas are increasing when we go down, which is opposite to Cartesian coordinates
const transformY = (points) => {
    return points.map(
        (element) => {
            return {x: element.x, y: element.y * (-1), idx: element.idx}
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
    const [view, setView] = useState('visual');
    const [error, setError] = useState('');

    const handleAlgoChange = (e) => {
        setAlgo(e.target.value);
        setStepNumber(0);
        setShowStepByStep(false);
        setHull([]);
        setIterations([]);
    }

    const switchView = () => {
        if(view === 'visual') setView('description');
        else setView('visual');
    }

    const handleNewPoint = (e) => {
        setPoints([...points, {x: e.evt.clientX, y: e.evt.clientY, idx: points.length + 1}]);
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
            <button
                className="switch-button w3-button w3-round-large w3-black w3-margin"
                onClick={() => switchView()}
            >
                {algo==='graham' ? 'Graham Scan ' : 'Gift Wrapping '} {view === 'visual' ? 'Description' : 'Visual'}
            </button>
            <NavLink style={{textDecoration:"none"}} to="/home">
                <button
                    className="home-button w3-button w3-round-large w3-black w3-margin"
                >
                    Home
                </button>
            </NavLink>
            {
                view === 'description' ?
                    // <AlgoDescription title={strings[algo].title} description={strings[algo].description} paragraphs={strings[algo].paragraphs}/>
                    <AlgoDescription algo={algo} />
                    :
                    <Stage width={window.innerWidth} height={window.innerHeight} onMouseDown={handleNewPoint}>
                        <Layer>
                            {
                                !showStepByStep ?
                                    <Text fill="white" padding={20} opacity={0.5} align="center" width={window.innerWidth}
                                          fontSize={20}
                                          text="Click to add point"
                                    /> : null
                            }
                            {
                                points.map(({x, y}, i) => {
                                    // return <Circle x={x} y={y} radius={5} fill="orange"/>
                                    return <Group x={x} y={y} >
                                        <Circle radius={5} fill="magenta"/>
                                        <Text
                                            x={0}
                                            y={-20}
                                            fontSize={10}
                                            text={i+1}
                                            stroke="yellow"
                                            strokeWidth={1}
                                        />

                                    </Group>;
                                })

                            }

                            {
                                !showStepByStep || stepNumber >= iterations.length  ?
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
                                            <GrahamScanSteps stepNumber={stepNumber} iterations={iterations}
                                                             allPoints={sortedPoints}/>
                                            : algo === 'gift' ?
                                                <GiftWrappingSteps stepNumber={stepNumber} iterations={iterations}/>

                                                : null : null
                                // : algo === 'gift' ?

                            }
                        </Layer>
                    </Stage>
            }
            {view === 'visual' ?
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
                                        if (stepNumber < iterations.length - 1) setStepNumber(stepNumber + 1);
                                    }}
                            > +
                            </button>
                            <p style={{display: "inline-block"}}> Step {stepNumber+1}/{iterations.length } </p>
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
                                    setStepNumber(0);
                                }}
                        > Show steps </button> : null
                }

            </div> : null}
        </>
    );
}