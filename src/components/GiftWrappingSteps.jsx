import React from 'react';
import {Circle, Line} from "react-konva";

export const GiftWrappingSteps = ({stepNumber, iterations}) => {
    
    let current_hull = iterations[stepNumber].hull;
    let bestCandidateSoFar = iterations[stepNumber].bestCandidateSoFar;
    
    return (
        <>
            {
                bestCandidateSoFar ?
                    <Circle
                        x={bestCandidateSoFar.x}
                        y={bestCandidateSoFar.y}
                        radius={5}
                        fill="yellow"
                    /> : null
            }
            {
                current_hull?
                    iterations[stepNumber].hull.map(({x, y}, i) => {
                        return(
                            <>
                                <Circle x={x} y={y} radius={6} fill="pink"/>
                                {
                                    (i > 0) ? <Line
                                        points={[
                                            x,
                                            y,
                                            iterations[stepNumber].hull[i - 1].x,
                                            iterations[stepNumber].hull[i - 1].y
                                        ]}
                                        stroke="blue"
                                    /> : null
                                }
                            </>
                        );

                    }) : null
            }
            {
                iterations[stepNumber].change.type === 'good-check' ?
                    <>
                        <Line
                            points={[
                                iterations[stepNumber].change.a.x,
                                iterations[stepNumber].change.a.y,
                                iterations[stepNumber].change.b.x,
                                iterations[stepNumber].change.b.y,
                                iterations[stepNumber].change.c.x,
                                iterations[stepNumber].change.c.y
                            ]}
                            stroke="green"
                        />
                        <Line
                            points={[
                                iterations[stepNumber].change.a.x,
                                iterations[stepNumber].change.a.y,
                                iterations[stepNumber].change.c.x,
                                iterations[stepNumber].change.c.y
                            ]}
                            stroke="white"
                            dash={[3,3]}
                            opacity={0.5}
                        />
                    </> : iterations[stepNumber].change.type === 'bad-check' ?
                        <>
                            <Line
                                points={[
                                    iterations[stepNumber].change.a.x,
                                    iterations[stepNumber].change.a.y,
                                    iterations[stepNumber].change.b.x,
                                    iterations[stepNumber].change.b.y,
                                    iterations[stepNumber].change.c.x,
                                    iterations[stepNumber].change.c.y
                                ]}
                                stroke="red"
                            />
                            <Line
                                points={[
                                    iterations[stepNumber].change.a.x,
                                    iterations[stepNumber].change.a.y,
                                    iterations[stepNumber].change.c.x,
                                    iterations[stepNumber].change.c.y
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