import React from 'react';
import {Circle, Line} from "react-konva";

export const GrahamScanSteps = ({stepNumber, iterations}) => {
    return (
        <>
            {
                iterations[stepNumber].hull ?
                    iterations[stepNumber].hull.map(({x, y}, i) => {
                        return (
                            <>
                                <Circle x={x} y={y} radius={6} fill="pink"/>
                                {
                                    i > 0 ?
                                        <Line
                                            points={[
                                                x,
                                                y,
                                                iterations[stepNumber].hull[i - 1].x,
                                                iterations[stepNumber].hull[i - 1].y
                                            ]}
                                            stroke="blue"/> : null

                                }
                            </>
                        );
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
    );
}