import React from 'react';
import {Circle, Line, Text} from "react-konva";

// y coordinates on canvas are increasing when we go down, which is opposite to Cartesian coordinates
const transformY = (points) => {
    return points.map(
        (element) => {
            return {x: element.x, y: element.y * (-1)}
        }
    );
}

export const TriangulationSteps = ({stepNumber, iterations, pts}) => {
    let curr_it = iterations[stepNumber];
    let {diagonals, triangle, isEar, pointInside, currentPoly, message} = curr_it;
    let polygon = transformY(currentPoly);

    return (
        <>
            {
                stepNumber < iterations.length && message ?
                <Text padding={20} align="center" width={window.innerWidth} fontSize={20}
                      text={message}
                      fill={isEar ? "green" : "red"}
                /> : null
            }
            {
                pts ?
                    pts.map(({x, y}, i) => {
                        return (
                            <>
                                <Circle x={x} y={y} radius={6} fill="pink"/>
                                {
                                    i > 0 ?
                                        <Line
                                            points={[x, y, pts[i - 1].x, pts[i - 1].y]}
                                            stroke="blue"
                                            opacity={0.2}
                                        />
                                        :
                                        <Line
                                            points={[x, y, pts[pts.length - 1].x, pts[pts.length - 1].y]}
                                            stroke="blue"
                                            opacity={0.2}
                                        />
                                }
                            </>
                        );
                    }) : null
            }
            {
                polygon.map(({x, y}, i) => {
                    return (
                        <>
                            {i > 0 ?
                                <Line points={[x, y, polygon[i-1].x, polygon[i-1].y]}
                                      stroke="white"
                                />
                                :
                                <Line points={[x, y, polygon[polygon.length - 1].x, polygon[polygon.length - 1].y]}
                                      stroke="white"
                                />
                            }
                        </>
                    );
                })
            }
            {
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
            }
            {
                isEar ? <Line
                    points={[triangle.a.x, triangle.a.y, triangle.b.x, triangle.b.y, triangle.c.x, triangle.c.y]}
                    stroke="green"
                /> :
                <>
                    {pointInside ? <Circle x={pointInside.x} y={pointInside.y} radius={6} fill="red"/> : null }
                    <Line
                        points={[triangle.a.x, triangle.a.y, triangle.b.x, triangle.b.y, triangle.c.x, triangle.c.y]}
                        stroke="red"
                    />
                    {
                    pointInside ?
                        <Line
                        points={[triangle.c.x, triangle.c.y, triangle.a.x, triangle.a.y]}
                        stroke="red"
                        dash={[5, 5]}
                        /> : null
                    }
                </>
            }
        </>
    );
}