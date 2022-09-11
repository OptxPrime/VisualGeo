import {orientation, tY} from "./helpers";


// function that returns clone of a hull after adjusting its y-coord to match canvas standard
const thull = (hull) => {
    return hull.map(h => {
        return {
            x: h.x,
            y: h.y * (-1),
            idx : h.idx
        }
    });
}

export const giftWrapping = (points) => {

    console.log(points)

    let n = points.length;
    let leftmost = 0;
    for (let i = 1; i < n; i++) {
        if (points[i].x < points[leftmost].x)
            leftmost = i;
    }

    let curr = leftmost, nxt;
    let hull = [points[leftmost]], iterations = [];

    iterations.push(
        {
            message: `We start with leftmost point ${points[leftmost].idx} which is surely on a convex hull.`,
            change:{
                type: "algo-start"
            }
        }
    );


    do {
        nxt = (curr + 1) % n;
        for (let i = 0; i < n; i++) {
            if (i === curr || i === nxt) continue;
            if (orientation(points[curr], points[i], points[nxt]) === 1) {
                iterations.push({
                    hull: thull(hull),
                    bestCandidateSoFar: tY(points[nxt]),
                    change: {
                        type: 'bad-check',
                        a: tY(points[curr]),
                        b: tY(points[i]),
                        c: tY(points[nxt])
                    },
                    message: `Searching for next point Counter-Clockwise. Discarding ${points[nxt].idx}, new best candidate is ${points[i].idx}.`
                });
                nxt = i;
            } else {
                iterations.push({
                    hull: thull(hull),
                    bestCandidateSoFar: tY(points[nxt]),
                    change: {
                        type: 'good-check',
                        a: tY(points[curr]),
                        b: tY(points[i]),
                        c: tY(points[nxt])
                    },
                    message: `Searching for next point Counter-Clockwise. ${points[nxt].idx} is still the best candidate`
                });
            }
        }
        hull.push(points[nxt]);
        iterations.push({
            hull: thull(hull),
            change: {
                type: 'new-point',
                a: points[nxt],
            },
            message: `Next CCW point is ${points[nxt].idx}`
        });
        curr = nxt;
    } while (curr !== leftmost);

    iterations.push(
        {
            hull: thull(hull),
            message: `Reached leftmost point ${points[leftmost].idx} again, convex hull found.`,
            change:{
                type: "algo-finish"
            }
        }
    );

    return {hull, iterations};
}