import React from 'react';
import {Circle, Line, Text} from "react-konva";

export const GrahamScanSteps = ({stepNumber, iterations, allPoints}) => {
    
    let {message, change : iteration_change, hull : current_hull} = iterations[stepNumber]

    return (
        <>
            {
                stepNumber < iterations.length && message ?
                    <Text padding={20} align="center" width={window.innerWidth} fontSize={20}
                          text={message}
                          fill={iteration_change.type ==='add' ? "green" : iteration_change.type === "remove" ? "red" : "white"}
                    /> : null
            }
            {
                allPoints ?
                    allPoints.map(({x, y}) => {
                        return(
                            <Line
                            points={[
                                x,
                                y,
                                allPoints[0].x,
                                allPoints[0].y
                            ]}
                            stroke="white"
                            dash={[3,3]}
                            opacity={0.5}
                        />
                        );
                    }) : null
            }
            {
               current_hull ?
                   current_hull.map(({x, y}, i) => {
                        return (
                            <>
                                <Circle x={x} y={y} radius={6} fill="pink"/>
                                {
                                    i > 0 ?
                                        <Line
                                            points={[
                                                x,
                                                y,
                                               current_hull[i - 1].x,
                                               current_hull[i - 1].y
                                            ]}
                                            stroke="blue"
                                        />
                                        : iteration_change.type === 'algo-finish' ? // special case when algo finishes - render segment between last and first point also
                                            <Line
                                                points={[
                                                    x,
                                                    y,
                                                    current_hull[ current_hull.length - 1 ].x,
                                                    current_hull[ current_hull.length - 1 ].y
                                                ]}
                                                stroke="blue"
                                            /> : null
                                }
                            </>
                        );
                    }) : null
            }
            {
                iteration_change.type === 'remove' ?
                    <>
                        <Circle x={iteration_change.b.x}
                                y={iteration_change.b.y}
                                radius={5}
                                fill="red"
                        />
                        <Line
                            points={[
                                iteration_change.a.x,
                                iteration_change.a.y,
                                iteration_change.b.x,
                                iteration_change.b.y,
                                iteration_change.c.x,
                                iteration_change.c.y
                            ]}
                            stroke="red"/>
                    </> : iteration_change.type === 'add' ?
                        <>
                            <Circle x={iteration_change.b.x}
                                    y={iteration_change.b.y}
                                    radius={5}
                                    fill="blue"
                            />
                            {/*<Line*/}
                            {/*    points={[*/}
                            {/*        iteration_change.a.x,*/}
                            {/*        iteration_change.a.y,*/}
                            {/*        iteration_change.b.x,*/}
                            {/*        iteration_change.b.y,*/}
                            {/*    ]}*/}
                            {/*    stroke="green"*/}
                            {/*    width={10}*/}
                            {/*/>*/}
                        </> : null
            }
        </>
    );
}