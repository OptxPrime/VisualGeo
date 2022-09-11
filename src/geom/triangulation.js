import {cw, isInsideTriangle, tY} from '../geom/helpers';
var yallist = require('yallist');


// function assumes that points are forming simple polygon, and that adjacent points constitute segment of that polygon
// points can be sorted in CW or CCW
export const triangulate = (points) => {

    // first step is to determine if points are in CW or CCW order. In this implementation of ear-cutting algorithm, points must be in CW order,
    // so if points are received in CCW order, we will just reverse the order.
    // to check if simple polygon vertices are given in CW or CCW order, it's enough to check oritentation(point_before_lowest, lowest_point, point_after_lowest)
    // https://stackoverflow.com/questions/1165647/how-to-determine-if-a-list-of-polygon-points-are-in-clockwise-order

    let lowestPointIdx = 0;
    for(let i = 1; i < points.length; i++){
        if(points[i].y < points[lowestPointIdx].y) lowestPointIdx = i;
    }
    let lowestPoint = points[lowestPointIdx];
    let lowestPrev = lowestPointIdx > 0 ? points[lowestPointIdx - 1] : points[points.length - 1];
    let lowestNext = lowestPointIdx < points.length - 1 ? points[lowestPointIdx + 1] : points[0];
    if(!cw(lowestPrev, lowestPoint, lowestNext)) points.reverse();

    const nextEl = (el, list = pList) => {
        if(el.next) return el.next;
        return list.head;
    }

    const prevEl = (el, list = pList) => {
        if(el.prev) return el.prev;
        return list.tail;
    }

    let pList = yallist.create(points);
    let diag = [], iterations = [];
    let curr = pList.head, prev = pList.head, nxt = pList.head;
    prev = prevEl(prev);
    nxt = nextEl(nxt);

    while(pList.length > 3){
        if(cw(prev.value, curr.value, nxt.value)){
            let ear = true;
            let tmp = nxt;
            tmp = nextEl(tmp);
            while(tmp !== prev){
                if(isInsideTriangle(prev.value, curr.value, nxt.value, tmp.value)){
                    ear = false;
                    break;
                }
                tmp = nextEl(tmp);
            }
            if(ear){
                diag.push({from: tY(prev.value), to: tY(nxt.value)});
                iterations.push({
                    diagonals: [...diag], isEar:true,
                    triangle:{a: tY(prev.value), b: tY(curr.value), c: tY(nxt.value)},
                    currentPoly: pList.toArray(),
                    message: `Cut the ear, erase ear tip ${curr.value.idx} and continue from previous ear tip ${prev.value.idx}`
                });
                pList.removeNode(curr);
                curr = prev;
                prev = prevEl(prev);
            }else{
                iterations.push({
                    diagonals: [...diag], isEar:false,
                    triangle:{a: tY(prev.value), b: tY(curr.value), c: tY(nxt.value)},
                    pointInside: tY(tmp.value),
                    currentPoly: pList.toArray(),
                    message: `Point ${tmp.value.idx} inside triangle, ${curr.value.idx} is not an ear tip. Skip to next potential ear tip ${nxt.value.idx}`
                });
                prev = curr;
                curr = nxt;
                nxt = nextEl(nxt);
            }
        }else{
            iterations.push({
                diagonals: [...diag], isEar:false,
                triangle:{a: tY(prev.value), b: tY(curr.value), c: tY(nxt.value)},
                currentPoly: pList.toArray(),
                message: `Counter-clockwise turn, ${curr.value.idx} is not an ear tip. Skip to next potential ear tip ${nxt.value.idx}`
            });
            prev = curr;
            curr = nxt;
            nxt = nextEl(nxt);
        }
    }

    return {diag, iterations};

}