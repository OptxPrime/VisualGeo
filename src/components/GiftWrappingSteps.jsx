import React from 'react';
import {Circle, Line, Text} from "react-konva";

export const GiftWrappingSteps = ({stepNumber, iterations}) => {
    
    // let current_hull = hull;
    let bestCandidateSoFar = iterations[stepNumber].bestCandidateSoFar;
    let {hull : current_hull, change, message} = iterations[stepNumber];
            
    return (
        <>
            {
                stepNumber < iterations.length && message ?
                    <Text padding={20} align="center" width={window.innerWidth} fontSize={20}
                          text={message}
                          fill={change.type ==='good-check' ? "green" : change.type === "bad-check" ? "red" : "white"}
                    /> : null
            }
            {
                bestCandidateSoFar ?
                    <Circle
                        x={bestCandidateSoFar.x}
                        y={bestCandidateSoFar.y}
                        radius={5}
                        fill="cyan"
                    /> : null
            }
            {
                current_hull?
                    current_hull.map(({x, y}, i) => {
                        return(
                            <>
                                <Circle x={x} y={y} radius={6} fill="pink"/>
                                {
                                    (i > 0) ? <Line
                                        points={[
                                            x,
                                            y,
                                            current_hull[i - 1].x,
                                            current_hull[i - 1].y
                                        ]}
                                        stroke="blue"
                                    /> : null
                                }
                            </>
                        );

                    }) : null
            }
            {
                change.type === 'good-check' ?
                    <>
                        <Line
                            points={[
                                change.a.x,
                                change.a.y,
                                change.b.x,
                                change.b.y,
                                change.c.x,
                                change.c.y
                            ]}
                            stroke="green"
                        />
                        <Line
                            points={[
                                change.a.x,
                                change.a.y,
                                change.c.x,
                                change.c.y
                            ]}
                            stroke="white"
                            dash={[3,3]}
                            opacity={0.5}
                        />
                    </> : change.type === 'bad-check' ?
                        <>
                            <Line
                                points={[
                                    change.a.x,
                                    change.a.y,
                                    change.b.x,
                                    change.b.y,
                                    change.c.x,
                                    change.c.y
                                ]}
                                stroke="red"
                            />
                            <Line
                                points={[
                                    change.a.x,
                                    change.a.y,
                                    change.c.x,
                                    change.c.y
                                ]}
                                stroke="white"
                                dash={[3,3]}
                                opacity={0.5}
                            />
                        </> : null
            }
        </>
    );
}