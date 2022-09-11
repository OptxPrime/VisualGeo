export const orientation = (a, b, c) => {
    // we make sure that y coordinates are negative, because what we get from 'canvas' are y coords that are
    // increasing downwards, which is opposite of usual convention and because of that formulas
    // like orientation fall apart. This is easily fixed by multiplying y coords with -1
    if (a.y > 0) a = tY(a);
    if (b.y > 0) b = tY(b);
    if (c.y > 0) c = tY(c);

    let v = a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y);
    if (v < 0) return -1; // clockwise
    if (v > 0) return +1; // counter-clockwise
    return 0;
}

export const cw = (a, b, c) => {
    return orientation(a, b, c) < 0;
}

export const isInsideTriangle = (a, b, c, p) => {
    return (
        orientation(a, b, c) === orientation(a, b, p) &&
        orientation(b, c, a) === orientation(b, c, p) &&
        orientation(c, a, b) === orientation(c, a, p)
    );
}

// https://www.geeksforgeeks.org/check-if-two-given-line-segments-intersect/
export const doSegmentsIntersect = (p1, q1, p2, q2) => {
    let o1 = orientation(p1, q1, p2);
    let o2 = orientation(p1, q1, q2);
    let o3 = orientation(p2, q2, p1);
    let o4 = orientation(p2, q2, q1);

    // General case
    if (o1 !== o2 && o3 !== o4)
        return true;
    // to do: add special cases
}

export const tY = (pt) => {
    return {
        x: pt.x, y: pt.y * (-1)
    }
};