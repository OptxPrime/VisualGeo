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

export const tY = (pt) => {
    return {
        x: pt.x, y: pt.y * (-1)
    }
};