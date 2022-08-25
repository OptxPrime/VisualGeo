import React from 'react';
import {Circle, Line} from "react-konva";

export const GiftWrappingSteps = ({stepNumber, iterations}) => {
    return (
        <>
            {
                iterations[stepNumber].bestCandidateSoFar ?
                    <Circle
                        x={iterations[stepNumber].bestCandidateSoFar.x}
                        y={iterations[stepNumber].bestCandidateSoFar.y}
                        radius={5}
                        fill="yellow"
                    /> : null
            }
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
                            stroke="blue"/>

                    }) : null
            }
            {
                iterations[stepNumber].change.type === 'good-check' ?
                    <>
                        {/*<Circle x={iterations[stepNumber].change.b.x}*/}
                        {/*        y={iterations[stepNumber].change.b.y}*/}
                        {/*        radius={5}*/}
                        {/*        fill="red"*/}
                        {/*/>*/}
                        <Line
                            points={[
                                iterations[stepNumber].change.a.x,
                                iterations[stepNumber].change.a.y,
                                iterations[stepNumber].change.b.x,
                                iterations[stepNumber].change.b.y,
                                iterations[stepNumber].change.c.x,
                                iterations[stepNumber].change.c.y
                            ]}
                            stroke="green"/>
                    </> : iterations[stepNumber].change.type === 'bad-check' ?
                        <>
                            {/*<Circle x={iterations[stepNumber].change.b.x}*/}
                            {/*        y={iterations[stepNumber].change.b.y}*/}
                            {/*        radius={5}*/}
                            {/*        fill="blue"*/}
                            {/*/>*/}
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
                        </> : null
            }
        </>
    );
}