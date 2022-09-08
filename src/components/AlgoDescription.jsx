import React from "react";

export const AlgoDescription = ({algo}) => {
    return (
            algo === 'graham' ? <GrahamScanDescription />
                : algo === 'gift' ? <GiftWrappingDescription />
                    : algo === 'point-in-polygon' ? <PointInConvexPolygonDescription/>
                        : algo === 'triangulation' ? <Triangulation/>
                            : null
    );
}

const orientationLink = "https://cp-algorithms.com/geometry/oriented-triangle-area.html";

const GrahamScanDescription = () => {
    return (
        <div style={{display:"flex", justifyContent:"center", width:"75%", minWidth:"300px", flexDirection:"column"}}>
            <h1 style={{margin:"0 auto", marginTop:"2em"}}> Graham Scan Algorithm </h1>
            <div style={{display:"flex", flexDirection:"column"}}>

                <p className="algo-desc-paragraph">
                    The algorithm first finds the bottom-most point P0. If there are multiple points with the same Y coordinate,
                    the one with the smaller X coordinate is considered. This step takes O(N) time.
                </p>

                <p className="algo-desc-paragraph">
                    Next, all the other points are sorted by polar angle in counterclockwise order.
                    If the polar angle between two points is the same, the nearest point is chosen instead.
                </p>

                <p className="algo-desc-paragraph">
                    Then we iterate through each point one by one, and make sure that the current point and the two before it make a counterclockwise turn,
                    otherwise the previous point is discarded, since it would make a non-convex shape.
                    Checking for clockwise or anticlockwise nature can be done by checking the <a href={orientationLink}>orientation</a>.
                </p>

                <p className="algo-desc-paragraph">
                    We use a stack to store the points, and once we reach the original point P0, the algorithm is done and we return the stack containing all the points
                    of the convex hull in clockwise order.
                </p>

                <p className="algo-desc-paragraph">
                    If you need to include the collinear points while doing a Graham scan, you need another step after sorting. You need to get the points that have the biggest polar distance
                    from P0 (these should be at the end of the sorted vector) and are collinear.
                    The points in this line should be reversed so that we can output all the collinear points, otherwise the algorithm would get the nearest point in this line and bail.
                    This step shouldn't be included in the non-collinear version of the algorithm, otherwise you wouldn't get the smallest convex hull.
                </p>

                <h2 className="algo-desc-paragraph"> Further reading </h2>
                <ul className="algo-desc-paragraph">
                    <li> <a href="https://cp-algorithms.com/geometry/convex-hull.html"> CP Algorithms - Convex Hull construction </a> </li>
                    <li> <a href="https://iq.opengenus.org/graham-scan-convex-hull/"> Graham Scan Algorithm </a> </li>
                </ul>
            </div>
        </div>
    );
}

export const GiftWrappingDescription = () => {
    return(
        <div style={{display:"flex", justifyContent:"center", width:"75%", minWidth:"300px", flexDirection:"column"}}>
            <h1 style={{margin:"0 auto", marginTop:"2em"}}> Gift Wrapping Algorithm </h1>
            <div style={{display:"flex", flexDirection:"column"}}>
                <p className="algo-desc-paragraph">
                    In the two-dimensional case the algorithm is also known as Jarvis march after R. A. Jarvis, who published it in 1973;
                    it has O(nh) time complexity, where n is the number of points and h is the number of points on the convex hull.
                </p>

                <p className="algo-desc-paragraph">
                    We start from the leftmost point (or point with minimum x coordinate value) and we keep wrapping points in counterclockwise direction.
                </p>

                <p className="algo-desc-paragraph">
                    The big question is, given a point p as current point, how to find the next point in output?
                    The idea is to use <a href={orientationLink}>orientation</a> here.
                    Next point is selected as the point that beats all other points at
                    counterclockwise orientation, i.e., next point is q if for any other point r, we have orientation(p, r, q) = clockwise.
                </p>

                <p className="algo-desc-paragraph"> Algorithm steps:  </p>
                <ol className="algo-desc-paragraph">
                    <li> Initialize p as leftmost point. </li>
                    <li> Do following while we do not come back to the first (or leftmost) point. </li>
                    <ol type="a" className="algo-desc-paragraph">
                        <li> The next point q is the point such that the triplet (p, q, r) is clockwise for any other point r </li>
                        <li> next[p] = q (Store q as next of p in the output convex hull). </li>
                        <li> p = q (Set p as q for next iteration). </li>
                    </ol>
                </ol>

                <p className="algo-desc-paragraph">
                    The inner loop (step 2a above) checks every point in the set S, and the outer loop repeats for each point on the hull.
                    Hence the total run time is <b>O(nh)</b>, where h is number of points on resulting hull.
                    The run time depends on the size of the output, so Jarvis's march is an <b>output-sensitive algorithm. </b>
                    In worst case, time complexity is <b>O(n^2)</b>. The worst case occurs when all the points are on the hull (h = n).
                </p>

                <h2 className="algo-desc-paragraph"> Further reading </h2>
                <ul className="algo-desc-paragraph">
                    <li> <a href="https://iq.opengenus.org/gift-wrap-jarvis-march-algorithm-convex-hull/"> Gift Wrapping algorithm </a> </li>
                    <li> <a href="https://en.wikipedia.org/wiki/Gift_wrapping_algorithm"> Gift Wrapping Algorithn - Wikipedia </a> </li>
                </ul>
            </div>
        </div>
    );
}

export const PointInConvexPolygonDescription = () => {
    return(
        <div style={{display:"flex", justifyContent:"center", width:"75%", minWidth:"300px", flexDirection:"column"}}>
            <h1 style={{margin:"0 auto", marginTop:"2em"}}> Point in Convex Polygon Algorithm </h1>
            <div style={{display:"flex", flexDirection:"column"}}>

                <p className="algo-desc-paragraph">
                    We can assume without a loss of generality that points on a polygon are given in a Clockwise order.
                </p>

                <p className="algo-desc-paragraph">
                    To check if a point lies inside a convex polygon, there is an obvious linear algorithm: check if the test point lies to the right of every side of polygon.
                    Formally, if <i><a href={orientationLink}>orientation</a>(side.from, side.to, test_point) == CLOCKWISE </i>
                    for every side of the polygon, then point lies inside the polygon.
                </p>

                <p className="algo-desc-paragraph">
                    Can we do better than this? It turns out that there is a logarithmic algorithm that solves this problem.
                </p>

                <p className="algo-desc-paragraph">
                    First, we split the polygon into two roughly equal parts. Lets take polygon[0] as our reference point. Now, lets divide other points into two groups:
                    first contains points with index from 1 to mid, others from mid to r. Mid is middle point, dividing points from 1 to r into two sets of almost equal size
                    (one set having at most one element more). Note that mid is actually in both groups.
                </p>

                <p className="algo-desc-paragraph">
                    Now we do binary search. If<i> orientation(reference_point, mid, test_point) == CLOCKWISE</i>, then we are sure that the test point must either lie inside second
                    of the two constructed polygons (which contains points with indices from mid to r), or lie completely outside of the initial polygon. Otherwise, points either
                    lies in the first polygon, or it is completely outside.
                    What we achieved in both cases is actually discard roughly half of the points in one step.
                    We can repeat this process until we are left with only 3 points. For 3 points, it's easy to check whether a point lies
                    inside the triangle they form - it can be done with a few orientation checks.
                </p>

                <p className="algo-desc-paragraph">
                    Since in every step we are discarding around half of the points, <em>total time complexity is O(logN)</em>, where N is number of points on initial polygon.
                </p>

                <p className="algo-desc-paragraph">
                    Note that the polygon must be convex in order for this algorithm to work. If polygon is not convex, checking <i>orientation(reference_point, mid, test_point)</i>
                    is not enough to discard half of the points.
                </p>

            </div>
        </div>
    );
}

export const Triangulation = () => {
    return(
        <div style={{display:"flex", justifyContent:"center", width:"75%", minWidth:"300px", flexDirection:"column"}}>
            <h1 style={{margin:"0 auto", marginTop:"2em"}}> Ear-cutting algorithm </h1>
            <div style={{display:"flex", flexDirection:"column"}}>

                <p className="algo-desc-paragraph">
                    Ear-cutting algorithm is an algorithm for triangulation of simple polygons. Primary idea of the algorithm, as its name suggests, is 'cutting' polygon ears one by one.
                    Now let's define precisely what is polygon ear.
                </p>

                <p className="algo-desc-paragraph">
                    An ear of a polygon is a triangle formed by three consecutive vertices A, B , and C for which B is a convex vertex. B is called the ear tip.
                    At such a vertex, the interior angle at the vertex is smaller than 180 degrees and the line segment from A to C lies completely inside the polygon.
                    The ear has the property that no vertices of the polygon are contained in the triangle other than the three vertices of the triangle.
                </p>

                <p className="algo-desc-paragraph">
                    It is proven that a polygon of four or more sides always has at least two nonoverlapping ears.
                    This suggests a recursive approach to the triangulation. If you can locate an ear in a polygon with n ≥ 4 vertices and remove it,
                    the remaining polygon has n−1 vertices and the process is repeated. A straightforward implementation of this will lead to an O(n^3) algorithm.
                </p>

            </div>
        </div>
    );
}