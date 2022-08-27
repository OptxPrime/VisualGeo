import {orientation, cw, tY} from "./helpers";

// function that returns clone of a hull after adjusting its y-coord to match canvas standard
const thull = (hull) => {
    return hull.map(h => {
        return {
            x: h.x,
            y: h.y * (-1)
        }
    });
}

export const grahamScan = (points) => {
    let lowestPoint = points.reduce(
        (prev, curr) =>
            prev.y < curr.y ? prev
                : prev.y > curr.y ? curr
                    : prev.x < curr.x ? prev : curr
    );

    points.sort((pt1, pt2) => {
        if (pt1 == lowestPoint) return -1; // to guarantee that first point in array is lowest point. Without this, weird bugs hapoen
        if (pt2 == lowestPoint) return 1;
        let o = orientation(lowestPoint, pt1, pt2);
        if (o === 0) { // if collinear, take closer point
            return (lowestPoint.x - pt1.x) * (lowestPoint.x - pt1.x)
            + (lowestPoint.y - pt1.y) * (lowestPoint.y - pt1.y)
            < (lowestPoint.x - pt2.x) * (lowestPoint.x - pt2.x)
            + (lowestPoint.x - pt2.x) * (lowestPoint.y - pt2.y) ? -1 : 1;
        }
        if (o < 0) return -1;
        return 1;
    });

    let hull = [], iterations = [];
    for (let pt of points) {
        while (hull.length > 1 && !cw(hull[hull.length - 2], hull[hull.length - 1], pt)) {
            let change = {
                type: 'remove',
                a: tY(hull[hull.length - 2]),
                b: tY(hull[hull.length - 1]),
                c: tY(pt)
            };
            hull.pop();
            iterations.push({hull: thull(hull), change});
        }
        hull.push(pt);
        iterations.push({
            hull: thull(hull),
            change: {type: 'add', a: tY(hull[hull.length - 1]), b: tY(pt)}
        });
    }
    return {hull, iterations, sortedPoints: points};
}