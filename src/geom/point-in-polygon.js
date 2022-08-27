import {cw, isInsideTriangle} from "./helpers";

export const pointInConvexPolygon = (poly, p) => {
    let l = 1, r = poly.length - 1, mid;
    let iterations = [{type:'dummy'}];
    while (r - l > 1) {
        let currentPoly = [poly[0]];
        for (let i = l; i <= r; i++) currentPoly.push(poly[i]);
        mid = Math.floor((l + r) / 2);
        if (cw(poly[0], poly[mid], p)) {
            iterations.push({type: 'right', a: poly[0], b: poly[mid], poly: currentPoly});
            r = mid;
        } else {
            iterations.push({type: 'left', a: poly[0], b: poly[mid], poly: currentPoly});
            l = mid;
        }
    }
    let ans = isInsideTriangle(poly[0], poly[l], poly[r], p);
    iterations.push({type: 'triangle-check', a: poly[0], b: poly[l], c: poly[r], ans});
    return {ans, iterations};
}