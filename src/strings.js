

export const strings = {
    graham: {
        title: "Graham Scan algorithm",
        paragraphs: [
            "The algorithm first finds the bottom-most point P0. If there are multiple points with the same Y coordinate, " +
            "the one with the smaller X coordinate is considered. This step takes O(N) time.",

            "Next, all the other points are sorted by polar angle in counterclockwise order. If the polar angle between two points is the same, the nearest point is chosen instead.",

            "Then we iterate through each point one by one, and make sure that the current point and the two before it make a counterclockwise turn, " +
            "otherwise the previous point is discarded, since it would make a non-convex shape. " +
            "Checking for clockwise or anticlockwise nature can be done by checking the orientation.",

            "We use a stack to store the points, and once we reach the original point P0, the algorithm is done and we return the stack containing all the points " +
            "of the convex hull in clockwise order.",

            "If you need to include the collinear points while doing a Graham scan, you need another step after sorting. You need to get the points that have the biggest polar distance" +
            " from P0 (these should be at the end of the sorted vector) and are collinear. " +
            "The points in this line should be reversed so that we can output all the collinear points, otherwise the algorithm would get the nearest point in this line and bail." +
            " This step shouldn't be included in the non-collinear version of the algorithm, otherwise you wouldn't get the smallest convex hull."
        ]
    },

    gift: {
        title: "Gift Wrapping Algorithm",
        paragraphs: [
            "In the two-dimensional case the algorithm is also known as Jarvis march after R. A. Jarvis, who published it in 1973; " +
            "it has O(nh) time complexity, where n is the number of points and h is the number of points on the convex hull.",

            "We start from the leftmost point (or point with minimum x coordinate value) and we keep wrapping points in counterclockwise direction.",

            "The big question is, given a point p as current point, how to find the next point in output?",

            "The idea is to use orientation here. Next point is selected as the point that beats all other points at " +
            "counterclockwise orientation, i.e., next point is q if for any other point r, we have orientation(p, r, q) = counterclockwise",


            "1) Initialize p as leftmost point.\n" +
            "2) Do following while we do not come back to the first (or leftmost) point.\n" +
            "     a) The next point q is the point such that the triplet (p, q, r) is counterclockwise for any other point r.\n" +
            "     b) next[p] = q (Store q as next of p in the output convex hull).\n" +
            "     c) p = q (Set p as q for next iteration)."
        ]

    }
}