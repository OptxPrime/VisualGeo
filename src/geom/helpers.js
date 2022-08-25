export const orientation = (a, b, c) => {
    let v = a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y);
    if (v < 0) return -1; // clockwise
    if (v > 0) return +1; // counter-clockwise
    return 0;
}

export const cw = (a, b, c) => {
    return orientation(a, b, c) < 0;
}

export const tY = (pt) => {
    return {
        x: pt.x, y: pt.y * (-1)
    }
};