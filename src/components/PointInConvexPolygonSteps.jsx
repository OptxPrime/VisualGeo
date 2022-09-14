import React from 'react';
import {Circle, Line} from "react-konva";

export const PointInConvexPolygonSteps = ({stepNumber, iterations, p}) => {
    let curr_it = iterations[stepNumber];
    let poly = curr_it.poly;
    return (
        <>
            {
                poly?.map(({x, y}, i) => {
                    return (
                        <>
                            <Circle x={x} y={y} radius={6} fill={i === 0 ? "yellow" : " pink"}/>
                            {
                                i > 0 ?
                                    <Line
                                        points={[
                                            x,
                                            y,
                                            poly[i - 1].x,
                                            poly[i - 1].y
                                        ]}
                                        stroke="blue"/>
                                    :
                                    <Line
                                        points={[
                                            x,
                                            y,
                                            poly[poly.length - 1].x,
                                            poly[poly.length - 1].y
                                        ]}
                                        stroke="blue"/>
                            }
                        </>
                    );
                })
            }
            {
                curr_it.type !== 'triangle-check' ?
                    <>
                        <Line
                            points={[
                                curr_it.a.x,
                                curr_it.a.y,
                                curr_it.b.x,
                                curr_it.b.y,
                                p.x,
                                p.y
                            ]}
                            stroke="white"
                            dash={[10, 10]}
                        />
                    </> :
                    <Line
                        points={[
                            curr_it.a.x,
                            curr_it.a.y,
                            curr_it.b.x,
                            curr_it.b.y,
                            curr_it.c.x,
                            curr_it.c.y,
                            curr_it.a.x,
                            curr_it.a.y,
                        ]}
                        stroke={curr_it.ans ? "green" : "red"}/>
            }
        </>
    );
}