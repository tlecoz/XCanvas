class EarCutting {
    constructor() {
        this.CONCAVE = -1;
        this.TANGENTIAL = 0;
        this.CONVEX = 1;
        this._computeTriangles = function (arrayXY, offset, count) {
            this.vertices = arrayXY;
            this.vertexCount = count / 2;
            this.indices = [];
            var i, n;
            if (this.areVerticesClockwise(this.vertices, offset, count))
                for (i = 0; i < this.vertexCount; i++)
                    this.indices[i] = i;
            else
                for (i = 0, n = this.vertexCount - 1; i < this.vertexCount; i++)
                    this.indices[i] = (n - i); // Reversed.
            this.vertexTypes = [];
            for (i = 0, n = this.vertexCount; i < n; ++i)
                this.vertexTypes[i] = this.classifyVertex(i);
            this.triangles = [];
            this.triangulate();
            return this.triangles;
        };
        if (EarCutting._instance)
            throw new Error("You must use EarCutting.instance");
        EarCutting._instance = this;
        this.vertexTypes = [];
        this.triangles = [];
    }
    static get instance() {
        if (!EarCutting._instance)
            new EarCutting();
        return EarCutting._instance;
    }
    computeSpannedAreaSign(p1x, p1y, p2x, p2y, p3x, p3y) {
        var area = p1x * (p3y - p2y);
        area += p2x * (p1y - p3y);
        area += p3x * (p2y - p1y);
        if (area < 0)
            return -1;
        else if (area > 0)
            return 1;
        else
            return 0;
    }
    previousIndex(index) { return (index == 0 ? this.vertexCount : index) - 1; }
    nextIndex(index) { return (index + 1) % this.vertexCount; }
    classifyVertex(index) {
        let previous = this.indices[this.previousIndex(index)] * 2;
        let current = this.indices[index] * 2;
        let next = this.indices[this.nextIndex(index)] * 2;
        return this.computeSpannedAreaSign(this.vertices[previous], this.vertices[previous + 1], this.vertices[current], this.vertices[current + 1], this.vertices[next], this.vertices[next + 1]);
    }
    areVerticesClockwise(vertices, offset, count) {
        if (count <= 2)
            return false;
        let area = 0, p1x, p1y, p2x, p2y;
        let i, n;
        for (i = offset, n = offset + count - 3; i < n; i += 2) {
            p1x = vertices[i];
            p1y = vertices[i + 1];
            p2x = vertices[i + 2];
            p2y = vertices[i + 3];
            area += p1x * p2y - p2x * p1y;
        }
        p1x = vertices[count - 2];
        p1y = vertices[count - 1];
        p2x = vertices[0];
        p2y = vertices[1];
        return area + p1x * p2y - p2x * p1y < 0;
    }
    isEarTip(earTipIndex) {
        if (this.vertexTypes[earTipIndex] == this.CONCAVE)
            return false;
        let _previousIndex = this.previousIndex(earTipIndex);
        let _nextIndex = this.nextIndex(earTipIndex);
        let p1 = this.indices[_previousIndex] * 2;
        let p2 = this.indices[earTipIndex] * 2;
        let p3 = this.indices[_nextIndex] * 2;
        let p1x = this.vertices[p1], p1y = this.vertices[p1 + 1];
        let p2x = this.vertices[p2], p2y = this.vertices[p2 + 1];
        let p3x = this.vertices[p3], p3y = this.vertices[p3 + 1];
        let i, v;
        let vx, vy;
        // Check if any point is inside the triangle formed by previous, current and next vertices.
        // Only consider vertices that are not part of this triangle, or else we'll always find one inside.
        for (i = this.nextIndex(_nextIndex); i != _previousIndex; i = this.nextIndex(i)) {
            // Concave vertices can obviously be inside the candidate ear, but so can tangential vertices
            // if they coincide with one of the triangle's vertices.
            if (this.vertexTypes[i] != this.CONVEX) {
                v = this.indices[i] * 2;
                vx = this.vertices[v];
                vy = this.vertices[v + 1];
                // Because the polygon has clockwise winding order, the area sign will be positive if the point is strictly inside.
                // It will be 0 on the edge, which we want to include as well.
                // note: check the edge defined by p1->p3 first since this fails _far_ more then the other 2 checks.
                if (this.computeSpannedAreaSign(p3x, p3y, p1x, p1y, vx, vy) >= 0) {
                    if (this.computeSpannedAreaSign(p1x, p1y, p2x, p2y, vx, vy) >= 0) {
                        if (this.computeSpannedAreaSign(p2x, p2y, p3x, p3y, vx, vy) >= 0)
                            return false;
                    }
                }
            }
        }
        return true;
    }
    findEarTip() {
        let i;
        for (i = 0; i < this.vertexCount; i++)
            if (this.isEarTip(i))
                return i;
        for (i = 0; i < this.vertexCount; i++)
            if (this.vertexTypes[i] != this.CONCAVE)
                return i;
        return 0; // If all vertices are concave, just return the first one.
    }
    cutEarTip(earTipIndex) {
        this.triangles.push(this.indices[this.previousIndex(earTipIndex)]);
        this.triangles.push(this.indices[earTipIndex]);
        this.triangles.push(this.indices[this.nextIndex(earTipIndex)]);
        this.indices.splice(earTipIndex, 1);
        this.vertexTypes.splice(earTipIndex, 1);
        this.vertexCount--;
    }
    triangulate() {
        let earTipIndex = 0;
        let _previousIndex = 0;
        let _nextIndex = 0;
        while (this.vertexCount > 3) {
            earTipIndex = this.findEarTip();
            this.cutEarTip(earTipIndex);
            // The type of the two vertices adjacent to the clipped vertex may have changed.
            _previousIndex = this.previousIndex(earTipIndex);
            _nextIndex = earTipIndex == this.vertexCount ? 0 : earTipIndex;
            this.vertexTypes[_previousIndex] = this.classifyVertex(_previousIndex);
            this.vertexTypes[_nextIndex] = this.classifyVertex(_nextIndex);
        }
        if (this.vertexCount == 3) {
            this.triangles.push(this.indices[0]);
            this.triangles.push(this.indices[1]);
            this.triangles.push(this.indices[2]);
        }
    }
    computeTriangles(arrayXY) {
        return this._computeTriangles(arrayXY, 0, arrayXY.length);
    }
}
//# sourceMappingURL=EarCutting.js.map