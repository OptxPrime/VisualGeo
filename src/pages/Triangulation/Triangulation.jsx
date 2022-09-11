import React, {useState} from 'react';
import {Stage, Layer, Text, Circle, Line, Group} from 'react-konva';

import {triangulate} from "../../geom/triangulation";
import {NavLink} from "react-router-dom";
import {AlgoDescription} from "../../components/AlgoDescription";
import {doSegmentsIntersect} from "../../geom/helpers";
import {TriangulationSteps} from "../../components/TriangulationSteps";


// y coordinates on canvas are increasing when we go down, which is opposite to Cartesian coordinates
const transformY = (points) => {
    return points.map(
        (element) => {
            return {x: element.x, y: element.y * (-1), idx: element.idx}
        }
    );
}


export const Triangulation = () => {

    const [polygon, setPolygon] = useState([]);
    const [iterations, setIterations] = useState([]);
    const [stepNumber, setStepNumber] = useState(null);
    const [showStepByStep, setShowStepByStep] = useState(false);
    const [error, setError] = useState('');
    const [view, setView] = useState("visual");
    const [diagonals, setDiagonals] = useState(null);


    const resetResult = () => {
        setIterations([]);
        setShowStepByStep(false);
        setDiagonals(null);
        setError(null);
    }

    const clear = () => {
        resetResult();
        setPolygon([]);
    }

    const switchView = () => {
        if(view === 'visual') setView('description');
        else setView('visual');
    }

    const handleNewPoint = (e) => {
        resetResult();
        let newPoint =  {x: e.evt.clientX, y: e.evt.clientY, idx: polygon.length + 1};
        let pts = [...polygon, newPoint];
        setPolygon(pts);
    }

    const handleTriangulation = () => {
        if (polygon.length < 3) {
            setError("Invalid polygon");
            return;
        }

        // special case: check if segment (fist_point, last_point) intersects any segment except adjacent
        for(let i = 1; i < polygon.length - 2; i++){
            if(doSegmentsIntersect(polygon[i], polygon[i+1], polygon[0], polygon[polygon.length - 1])){
                setError("Polygon is not simple!");
                return;
            }
        }

        // general case: check if any segment intersects any other except for two adjacent
        for(let i = 0; i < polygon.length - 1; i++){
            for(let j = i+2; j < polygon.length - 1; j++){
                if(doSegmentsIntersect(polygon[i], polygon[i+1], polygon[j], polygon[j+1])){
                    setError("Polygon is not simple!");
                    return;
                }
            }
        }
        let pts = transformY(polygon);
        let {diag, iterations} = triangulate(pts);
        setDiagonals(diag);
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
                view === 'description' ? <AlgoDescription algo="triangulation"/>
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
                                polygon.map(({x, y}, i) => {
                                    return (
                                        <>
                                            <Group x={x} y={y} >
                                                <Circle radius={5} fill="magenta"/>
                                                <Text
                                                    x={0}
                                                    y={-20}
                                                    fontSize={10}
                                                    text={i+1}
                                                    stroke="yellow"
                                                    strokeWidth={1}
                                                />

                                            </Group>

                                            {i > 0 ?
                                            <Line points={[x, y, polygon[i-1].x, polygon[i-1].y]}
                                                  stroke="blue"
                                                  opacity={showStepByStep && stepNumber < iterations.length ? 0.2 : 1}
                                            />
                                                  :
                                            <Line points={[x, y, polygon[polygon.length - 1].x, polygon[polygon.length - 1].y]}
                                                  stroke="blue"
                                                  dash={[10, 10]}
                                            />
                                            }
                                        </>
                                    );
                                })
                            }
                            {
                                !showStepByStep || stepNumber >= iterations.length ?
                                        diagonals && diagonals.length ? diagonals.map(({from, to}) => {
                                        return(
                                            <>
                                                <Line
                                                    points={[from.x, from.y, to.x, to.y]}
                                                    stroke="white"
                                                    dash={[5, 5]}
                                                    opacity={0.5}
                                                />
                                            </>
                                        );
                                    }) : null
                                    : stepNumber < iterations.length ?
                                        <TriangulationSteps stepNumber={stepNumber} iterations={iterations}
                                                                   pts={polygon}/>
                                        : null
                            }
                        </Layer>
                    </Stage>
            }
            {view === 'visual' ?
                <div className="footer w3-indigo">
                    <div>
                        <button className="w3-margin-left w3-margin-right w3-btn w3-black w3-round-large" onClick={()=>clear()}> Clear points </button>
                        <button className="w3-btn w3-round-large w3-black w3-margin"
                                style={{display: "inline-block"}}
                                onClick={() => {
                                    setPolygon(polygon.slice(0, -1));
                                    setDiagonals(null);
                                    resetResult();
                                }}
                        > Undo
                        </button>
                    </div>

                    <button className="w3-btn w3-blue w3-round-large" onClick={() => {handleTriangulation();}}>
                        Triangulate
                    </button>
                    {
                        error ? <p style={{display:"inline-block", color:"red", fontWeight:'bold'}} className="w3-margin"> {error} </p>
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
                                <p style={{display: "inline-block"}}> Step {stepNumber + 1} / {iterations.length + 1} </p>
                                <button className="w3-btn w3-round-large w3-black w3-margin"
                                        style={{display: "inline-block"}}
                                        onClick={() => {
                                            if (stepNumber > 0) setStepNumber(stepNumber - 1);
                                        }}> -
                                </button>
                            </> :
                            diagonals !== null ?
                                <button className="w3-btn w3-round-large w3-black"
                                        onClick={() => {
                                            setShowStepByStep(true);
                                            setStepNumber(0);
                                        }}
                                > Show steps </button> : null
                    }
                </div>:null
            }
        </>
    );
}