import { BorderPt } from "../BorderPt";

export class FitCurve {

    constructor() {

    }

    public static borderToCurve(border: BorderPt[], maxError: number = 10, progressCallback: () => void = null): number[][][] {
        var points: number[][] = [];
        var i: number, len: number = border.length;
        for (i = 0; i < len; i++) {
            points[i] = [border[i].x, border[i].y];
        }
        return this.fitCurve(points, maxError, progressCallback);
    }

    public static drawCurves(ctx: CanvasRenderingContext2D, curves: number[][][]): void {
        ctx.strokeStyle = "#ff0000";
        ctx.beginPath();
        var i: number, len: number = curves.length;
        var curve: number[][];
        for (i = 0; i < len; i++) {
            curve = curves[i];
            ctx.moveTo(curve[0][0], curve[0][1]);
            ctx.bezierCurveTo(curve[1][0], curve[1][1], curve[2][0], curve[2][1], curve[3][0], curve[3][1])
        }
        ctx.stroke();
    }


    public static fitCurve(points: number[][], maxError: number = 5, progressCallback: () => void = null): number[][][] {
        if (!Array.isArray(points)) {
            throw new TypeError("First argument should be an array");
        }
        points.forEach((point) => {
            if (!Array.isArray(point) || point.length !== 2
                || typeof point[0] !== 'number' || typeof point[1] !== 'number') {
                throw Error("Each point should be an array of two numbers")
            }
        });
        // Remove duplicate points
        points = points.filter((point, i) =>
            i === 0 || !(point[0] === points[i - 1][0] && point[1] === points[i - 1][1])
        );

        if (points.length < 2) {
            return [];
        }

        const len = points.length;
        const leftTangent = this.createTangent(points[1], points[0]);
        const rightTangent = this.createTangent(points[len - 2], points[len - 1]);

        return this.fitCubic(points, leftTangent, rightTangent, maxError, progressCallback);
    }

    private static fitCubic(points: number[][], leftTangent: number[], rightTangent: number[], error: number, progressCallback: () => void): number[][][] {
        const MaxIterations = 20;   //Max times to try iterating (to find an acceptable curve)

        var bezCurve,               //Control points of fitted Bezier curve
            u,                      //Parameter values for point
            uPrime,                 //Improved parameter values
            maxError, prevErr,      //Maximum fitting error
            splitPoint, prevSplit,  //Point to split point set at if we need more than one curve
            centerVector, toCenterTangent, fromCenterTangent,  //Unit tangent vector(s) at splitPoint
            beziers,                //Array of fitted Bezier curves if we need more than one curve
            dist, i;

        //console.log('fitCubic, ', points.length);

        //Use heuristic if region only has two points in it
        if (points.length === 2) {
            dist = this.vectorLen(this.subtract(points[0], points[1])) / 3.0;
            bezCurve = [
                points[0],
                this.addArrays(points[0], this.mulItems(leftTangent, dist)),
                this.addArrays(points[1], this.mulItems(rightTangent, dist)),
                points[1]
            ];
            return [bezCurve];
        }

        //Parameterize points, and attempt to fit curve
        u = this.chordLengthParameterize(points);
        [bezCurve, maxError, splitPoint] = this.generateAndReport(points, u, u, leftTangent, rightTangent, progressCallback)

        if (maxError < error) {
            return [bezCurve];
        }
        //If error not too large, try some reparameterization and iteration
        if (maxError < (error * error)) {

            uPrime = u;
            prevErr = maxError;
            prevSplit = splitPoint;

            for (i = 0; i < MaxIterations; i++) {

                uPrime = this.reparameterize(bezCurve, points, uPrime);
                [bezCurve, maxError, splitPoint] = this.generateAndReport(points, u, uPrime, leftTangent, rightTangent, progressCallback);

                if (maxError < error) {
                    return [bezCurve];
                }
                //If the development of the fitted curve grinds to a halt,
                //we abort this attempt (and try a shorter curve):
                else if (splitPoint === prevSplit) {
                    let errChange = maxError / prevErr;
                    if ((errChange > .9999) && (errChange < 1.0001)) {
                        break;
                    }
                }

                prevErr = maxError;
                prevSplit = splitPoint;
            }
        }

        //Fitting failed -- split at max error point and fit recursively
        beziers = [];

        //To create a smooth transition from one curve segment to the next, we
        //calculate the line between the points directly before and after the
        //center, and use that as the tangent both to and from the center point.
        centerVector = this.subtract(points[splitPoint - 1], points[splitPoint + 1]);
        //However, this won't work if they're the same point, because the line we
        //want to use as a tangent would be 0. Instead, we calculate the line from
        //that "double-point" to the center point, and use its tangent.
        if ((centerVector[0] === 0) && (centerVector[1] === 0)) {
            //[x,y] -> [-y,x]: http://stackoverflow.com/a/4780141/1869660
            centerVector = this.subtract(points[splitPoint - 1], points[splitPoint]);
            [centerVector[0], centerVector[1]] = [-centerVector[1], centerVector[0]];
        }
        toCenterTangent = this.normalize(centerVector);
        //To and from need to point in opposite directions:
        fromCenterTangent = this.mulItems(toCenterTangent, -1);

        /*
        Note: An alternative to this "divide and conquer" recursion could be to always
              let new curve segments start by trying to go all the way to the end,
              instead of only to the end of the current subdivided polyline.
              That might let many segments fit a few points more, reducing the number of total segments.
              However, a few tests have shown that the segment reduction is insignificant
              (240 pts, 100 err: 25 curves vs 27 curves. 140 pts, 100 err: 17 curves on both),
              and the results take twice as many steps and milliseconds to finish,
              without looking any better than what we already have.
        */
        beziers = beziers.concat(this.fitCubic(points.slice(0, splitPoint + 1), leftTangent, toCenterTangent, error, progressCallback));
        beziers = beziers.concat(this.fitCubic(points.slice(splitPoint), fromCenterTangent, rightTangent, error, progressCallback));
        return beziers;
    }

    private static generateAndReport(points: number[][], paramsOrig: number[], paramsPrime: number[], leftTangent: number[], rightTangent: number[], progressCallback: (e) => void) {
        var bezCurve: number[][], maxError: number, splitPoint: number;

        bezCurve = this.generateBezier(points, paramsPrime, leftTangent, rightTangent, progressCallback);
        //Find max deviation of points to fitted curve.
        //Here we always use the original parameters (from chordLengthParameterize()),
        //because we need to compare the current curve to the actual source polyline,
        //and not the currently iterated parameters which reparameterize() & generateBezier() use,
        //as those have probably drifted far away and may no longer be in ascending order.
        [maxError, splitPoint] = this.computeMaxError(points, bezCurve, paramsOrig);

        if (progressCallback) {
            progressCallback({
                bez: bezCurve,
                points: points,
                params: paramsOrig,
                maxErr: maxError,
                maxPoint: splitPoint,
            });
        }

        return [bezCurve, maxError, splitPoint];
    }

    //@ts-ignore
    private static generateBezier(points: number[][], parameters: number[], leftTangent: number[], rightTangent: number[], progressCallback: (e?: any) => void): number[][] {
        var bezCurve,                       //Bezier curve ctl pts
            A, a,                           //Precomputed rhs for eqn
            C, X,                           //Matrices C & X
            det_C0_C1, det_C0_X, det_X_C1,  //Determinants of matrices
            alpha_l, alpha_r,               //Alpha values, left and right

            epsilon, segLength,
            i, len, tmp, u, ux,
            firstPoint = points[0],
            lastPoint = points[points.length - 1];

        bezCurve = [firstPoint, null, null, lastPoint];
        //console.log('gb', parameters.length);

        //Compute the A's
        A = this.zeros_Xx2x2(parameters.length);
        for (i = 0, len = parameters.length; i < len; i++) {
            u = parameters[i];
            ux = 1 - u;
            a = A[i];

            a[0] = this.mulItems(leftTangent, 3 * u * (ux * ux));
            a[1] = this.mulItems(rightTangent, 3 * ux * (u * u));
        }

        //Create the C and X matrices
        C = [[0, 0], [0, 0]];
        X = [0, 0];
        for (i = 0, len = points.length; i < len; i++) {
            u = parameters[i];
            a = A[i];

            C[0][0] += this.dot(a[0], a[0]);
            C[0][1] += this.dot(a[0], a[1]);
            C[1][0] += this.dot(a[0], a[1]);
            C[1][1] += this.dot(a[1], a[1]);

            tmp = this.subtract(points[i], this.q([firstPoint, firstPoint, lastPoint, lastPoint], u));

            X[0] += this.dot(a[0], tmp);
            X[1] += this.dot(a[1], tmp);
        }

        //Compute the determinants of C and X
        det_C0_C1 = (C[0][0] * C[1][1]) - (C[1][0] * C[0][1]);
        det_C0_X = (C[0][0] * X[1]) - (C[1][0] * X[0]);
        det_X_C1 = (X[0] * C[1][1]) - (X[1] * C[0][1]);

        //Finally, derive alpha values
        alpha_l = det_C0_C1 === 0 ? 0 : det_X_C1 / det_C0_C1;
        alpha_r = det_C0_C1 === 0 ? 0 : det_C0_X / det_C0_C1;

        //If alpha negative, use the Wu/Barsky heuristic (see text).
        //If alpha is 0, you get coincident control points that lead to
        //divide by zero in any subsequent NewtonRaphsonRootFind() call.
        segLength = this.vectorLen(this.subtract(firstPoint, lastPoint));
        epsilon = 1.0e-6 * segLength;
        if (alpha_l < epsilon || alpha_r < epsilon) {
            //Fall back on standard (probably inaccurate) formula, and subdivide further if needed.
            bezCurve[1] = this.addArrays(firstPoint, this.mulItems(leftTangent, segLength / 3.0));
            bezCurve[2] = this.addArrays(lastPoint, this.mulItems(rightTangent, segLength / 3.0));
        } else {
            //First and last control points of the Bezier curve are
            //positioned exactly at the first and last data points
            //Control points 1 and 2 are positioned an alpha distance out
            //on the tangent vectors, left and right, respectively
            bezCurve[1] = this.addArrays(firstPoint, this.mulItems(leftTangent, alpha_l));
            bezCurve[2] = this.addArrays(lastPoint, this.mulItems(rightTangent, alpha_r));
        }

        return bezCurve;
    }

    private static reparameterize(bezier: number[][], points: number[][], parameters: number[]): number[] {
        /*
        var j, len, point, results, u;
        results = [];
        for (j = 0, len = points.length; j < len; j++) {
            point = points[j], u = parameters[j];
            results.push(newtonRaphsonRootFind(bezier, point, u));
        }
        return results;
        */
        return parameters.map((p, i) => this.newtonRaphsonRootFind(bezier, points[i], p));
    };

    private static newtonRaphsonRootFind(bez: number[][], point: number[], u: number) {
        /*
            Newton's root finding algorithm calculates f(x)=0 by reiterating
            x_n+1 = x_n - f(x_n)/f'(x_n)
            We are trying to find curve parameter u for some point p that minimizes
            the distance from that point to the curve. Distance point to curve is d=q(u)-p.
            At minimum distance the point is perpendicular to the curve.
            We are solving
            f = q(u)-p * q'(u) = 0
            with
            f' = q'(u) * q'(u) + q(u)-p * q''(u)
            gives
            u_n+1 = u_n - |q(u_n)-p * q'(u_n)| / |q'(u_n)**2 + q(u_n)-p * q''(u_n)|
        */

        var d = this.subtract(this.q(bez, u), point),
            qprime = this.qprime(bez, u),
            numerator = this.mulMatrix(d, qprime),
            denominator = this.sum(this.squareItems(qprime)) + 2 * this.mulMatrix(d, this.qprimeprime(bez, u));

        if (denominator === 0) {
            return u;
        } else {
            return u - (numerator / denominator);
        }
    }

    private static chordLengthParameterize(points: number[][]): number[] {
        var u = [], currU, prevU, prevP;

        points.forEach((p, i) => {
            currU = i ? prevU + this.vectorLen(this.subtract(p, prevP))
                : 0;
            u.push(currU);

            prevU = currU;
            prevP = p;
        })
        u = u.map(x => x / prevU);

        return u;
    }

    private static computeMaxError(points: number[][], bez: number[][], parameters: number[]): number[] {
        var dist,       //Current error
            maxDist,    //Maximum error
            splitPoint, //Point of maximum error
            v,          //Vector from point to curve
            i, count, point, t;

        maxDist = 0;
        splitPoint = points.length / 2;

        const t_distMap = this.mapTtoRelativeDistances(bez, 10);

        for (i = 0, count = points.length; i < count; i++) {
            point = points[i];
            //Find 't' for a point on the bez curve that's as close to 'point' as possible:
            t = this.find_t(bez, parameters[i], t_distMap, 10);

            v = this.subtract(this.q(bez, t), point);
            dist = v[0] * v[0] + v[1] * v[1];

            if (dist > maxDist) {
                maxDist = dist;
                splitPoint = i;
            }
        }

        return [maxDist, splitPoint];

    }

    private static mapTtoRelativeDistances(bez: number[][], B_parts: number) {
        var B_t_curr;
        var B_t_dist = [0];
        var B_t_prev = bez[0];
        var sumLen = 0;

        for (var i = 1; i <= B_parts; i++) {
            B_t_curr = this.q(bez, i / B_parts);

            sumLen += this.vectorLen(this.subtract(B_t_curr, B_t_prev));

            B_t_dist.push(sumLen);
            B_t_prev = B_t_curr;
        }

        //Normalize B_length to the same interval as the parameter distances; 0 to 1:
        B_t_dist = B_t_dist.map(x => x / sumLen);
        return B_t_dist;
    }

    //@ts-ignore
    private static find_t(bez, param, t_distMap, B_parts) {
        if (param < 0) { return 0; }
        if (param > 1) { return 1; }

        /*
            'param' is a value between 0 and 1 telling us the relative position
            of a point on the source polyline (linearly from the start (0) to the end (1)).
            To see if a given curve - 'bez' - is a close approximation of the polyline,
            we compare such a poly-point to the point on the curve that's the same
            relative distance along the curve's length.
            But finding that curve-point takes a little work:
            There is a function "B(t)" to find points along a curve from the parametric parameter 't'
            (also relative from 0 to 1: http://stackoverflow.com/a/32841764/1869660
                                        http://pomax.github.io/bezierinfo/#explanation),
            but 't' isn't linear by length (http://gamedev.stackexchange.com/questions/105230).
            So, we sample some points along the curve using a handful of values for 't'.
            Then, we calculate the length between those samples via plain euclidean distance;
            B(t) concentrates the points around sharp turns, so this should give us a good-enough outline of the curve.
            Thus, for a given relative distance ('param'), we can now find an upper and lower value
            for the corresponding 't' by searching through those sampled distances.
            Finally, we just use linear interpolation to find a better value for the exact 't'.
            More info:
                http://gamedev.stackexchange.com/questions/105230/points-evenly-spaced-along-a-bezier-curve
                http://stackoverflow.com/questions/29438398/cheap-way-of-calculating-cubic-bezier-length
                http://steve.hollasch.net/cgindex/curves/cbezarclen.html
                https://github.com/retuxx/tinyspline
        */
        var lenMax, lenMin, tMax, tMin, t;

        //Find the two t-s that the current param distance lies between,
        //and then interpolate a somewhat accurate value for the exact t:
        for (var i = 1; i <= B_parts; i++) {

            if (param <= t_distMap[i]) {
                tMin = (i - 1) / B_parts;
                tMax = i / B_parts;
                lenMin = t_distMap[i - 1];
                lenMax = t_distMap[i];

                t = (param - lenMin) / (lenMax - lenMin) * (tMax - tMin) + tMin;
                break;
            }
        }
        return t;
    }

    private static createTangent(pointA, pointB) {
        return this.normalize(this.subtract(pointA, pointB));
    }

    //--math --
    private static zeros_Xx2x2(x) {
        var zs = [];
        while (x--) { zs.push([0, 0]); }
        return zs
    }

    //multiply = logAndRun(math.multiply);
    private static mulItems(items, multiplier) {
        //return items.map(x => x*multiplier);
        return [items[0] * multiplier, items[1] * multiplier];
    }
    private static mulMatrix(m1, m2) {
        //https://en.wikipedia.org/wiki/Matrix_multiplication#Matrix_product_.28two_matrices.29
        //Simplified to only handle 1-dimensional matrices (i.e. arrays) of equal length:
        //  return m1.reduce((sum,x1,i) => sum + (x1*m2[i]),
        //                   0);
        return (m1[0] * m2[0]) + (m1[1] * m2[1]);
    }

    //Only used to subract to points (or at least arrays):
    //  subtract = logAndRun(math.subtract);
    private static subtract(arr1, arr2) {
        //return arr1.map((x1, i) => x1 - arr2[i]);
        return [arr1[0] - arr2[0], arr1[1] - arr2[1]];
    }

    //add = logAndRun(math.add);
    private static addArrays(arr1, arr2) {
        //return arr1.map((x1, i) => x1 + arr2[i]);
        return [arr1[0] + arr2[0], arr1[1] + arr2[1]];
    }
    //@ts-ignore
    private static addItems(items, addition) {
        //return items.map(x => x+addition);
        return [items[0] + addition, items[1] + addition];
    }

    //var sum = logAndRun(math.sum);
    private static sum(items) {
        return items.reduce((sum, x) => sum + x);
    }

    //chain = math.chain;

    //Only used on two arrays. The dot product is equal to the matrix product in this case:
    //  dot = logAndRun(math.dot);
    private static dot(m1, m2) {
        return this.mulMatrix(m1, m2);
    }

    //https://en.wikipedia.org/wiki/Norm_(mathematics)#Euclidean_norm
    //  var norm = logAndRun(math.norm);
    private static vectorLen(v) {
        var a = v[0], b = v[1];
        return Math.sqrt(a * a + b * b);
    }

    //math.divide = logAndRun(math.divide);
    private static divItems(items, divisor) {
        //return items.map(x => x/divisor);
        return [items[0] / divisor, items[1] / divisor];
    }

    //var dotPow = logAndRun(math.dotPow);
    private static squareItems(items) {
        //return items.map(x => x*x);
        var a = items[0], b = items[1];
        return [a * a, b * b];
    }

    private static normalize(v) {
        return this.divItems(v, this.vectorLen(v));
    }

    //--- bezier
    //Evaluates cubic bezier at t, return point
    private static q(ctrlPoly, t) {
        var tx = 1.0 - t;
        var pA = this.mulItems(ctrlPoly[0], tx * tx * tx),
            pB = this.mulItems(ctrlPoly[1], 3 * tx * tx * t),
            pC = this.mulItems(ctrlPoly[2], 3 * tx * t * t),
            pD = this.mulItems(ctrlPoly[3], t * t * t);
        return this.addArrays(this.addArrays(pA, pB), this.addArrays(pC, pD));
    }

    //Evaluates cubic bezier first derivative at t, return point
    private static qprime(ctrlPoly, t) {
        var tx = 1.0 - t;
        var pA = this.mulItems(this.subtract(ctrlPoly[1], ctrlPoly[0]), 3 * tx * tx),
            pB = this.mulItems(this.subtract(ctrlPoly[2], ctrlPoly[1]), 6 * tx * t),
            pC = this.mulItems(this.subtract(ctrlPoly[3], ctrlPoly[2]), 3 * t * t);
        return this.addArrays(this.addArrays(pA, pB), pC);
    }

    //Evaluates cubic bezier second derivative at t, return point
    private static qprimeprime(ctrlPoly, t) {
        return this.addArrays(this.mulItems(this.addArrays(this.subtract(ctrlPoly[2], this.mulItems(ctrlPoly[1], 2)), ctrlPoly[0]), 6 * (1.0 - t)),
            this.mulItems(this.addArrays(this.subtract(ctrlPoly[3], this.mulItems(ctrlPoly[2], 2)), ctrlPoly[1]), 6 * t));
    }


}
