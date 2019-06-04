class BorderLine {
    constructor(p0, p1) {
        this.dist = 9999999999;
        this.color = "#ff0000";
        this.actif = true;
        this.start = p0;
        this.end = p1;
        this.points = [p0, p1];
    }
    addPointToStart(pt) {
        this.start = pt;
        this.points.unshift(pt);
    }
    addPointToEnd(pt) {
        this.end = pt;
        this.points.push(pt);
    }
    findNearestPoint(px, py) {
        var i, len = this.points.length;
        var dx, dy;
        var pt;
        for (i = 0; i < len; i++) {
            pt = this.points[i];
            dx = pt.x - px;
            dy = pt.y - py;
            pt.dist = Math.sqrt(dx * dx + dy * dy);
        }
        var v = this.points.concat();
        v.sort(function (p0, p1) {
            if (p0.dist < p1.dist)
                return -1;
            else
                return 1;
        });
        i = 0;
        while (v[i].isQuadPoint && i < v.length - 1)
            i++;
        v[i].isQuadPoint = true;
        return v[i];
    }
    draw(ctx, offsetX = 0, offsetY = 0) {
        ctx.strokeStyle = this.color;
        ctx.moveTo(offsetX + this.points[0].x, offsetY + this.points[0].y);
        var i, len = this.points.length;
        for (i = 1; i < len; i++)
            ctx.lineTo(offsetX + this.points[i].x, offsetY + this.points[i].y);
        ctx.stroke();
    }
    getDistanceFromPoint(px, py) {
        var d = 1000000;
        var n;
        var points = this.points;
        var i, len = points.length;
        for (i = 1; i < len; i++) {
            n = this.distanceFromPointToLine(px, py, points[i - 1].x, points[i].x, points[i - 1].y, points[i].y);
            if (n < d)
                d = n;
        }
        this.dist = d;
        return this.dist;
    }
    distanceFromPointToLine(x, y, x1, x2, y1, y2) {
        var A = x - x1;
        var B = y - y1;
        var C = x2 - x1;
        var D = y2 - y1;
        var dot = A * C + B * D;
        var len_sq = C * C + D * D;
        var param = -1;
        if (len_sq != 0) { //in case of 0 length line
            param = dot / len_sq;
        }
        var xx, yy;
        if (param < 0) {
            xx = x1;
            yy = y1;
        }
        else if (param > 1) {
            xx = x2;
            yy = y2;
        }
        else {
            xx = x1 + param * C;
            yy = y1 + param * D;
        }
        var dx = x - xx;
        var dy = y - yy;
        return Math.sqrt(dx * dx + dy * dy);
    }
    orientationIsCorrect(p0, p1, a) {
        var angle = p0.angleTo(p1);
        var da = angle - a;
        if (da > Math.PI)
            angle -= Math.PI * 2;
        else if (da < -Math.PI)
            a -= Math.PI * 2;
        da = Math.abs(angle - a);
        a += Math.PI;
        var da2 = angle - a;
        if (da2 > Math.PI)
            angle -= Math.PI * 2;
        else if (da2 < -Math.PI)
            a -= Math.PI * 2;
        da2 = Math.abs(angle - a);
        return (da < 0.1 || da2 < 0.1);
    }
    lookForNearLines(lines, a) {
        if (a == 0 || a == Math.PI)
            this.color = "#ff0000";
        else
            this.color = "#00ff00";
        if (this.actif == false)
            return;
        var i, len;
        var working = true;
        var currentLine;
        var minDist = 10;
        var pt;
        var angle;
        var j, len2;
        while (working) {
            working = false;
            len = lines.length;
            for (i = 0; i < len; i++) {
                currentLine = lines[i];
                if (currentLine == this || currentLine.actif == false)
                    continue;
                pt = currentLine.start;
                if (this.start.distanceTo(pt) < minDist && this.orientationIsCorrect(pt, this.start, a)) {
                    len2 = currentLine.points.length;
                    for (j = 0; j < len2; j++)
                        this.addPointToStart(currentLine.points[j]);
                    currentLine.actif = false;
                    currentLine.points = null;
                    currentLine.start = currentLine.end = null;
                    working = true;
                    break;
                }
                pt = currentLine.end;
                if (this.start.distanceTo(pt) < minDist && this.orientationIsCorrect(pt, this.start, a)) {
                    len2 = currentLine.points.length - 1;
                    for (j = len2; j > -1; j--)
                        this.addPointToStart(currentLine.points[j]);
                    currentLine.actif = false;
                    currentLine.points = null;
                    currentLine.start = currentLine.end = null;
                    working = true;
                    break;
                }
                pt = currentLine.start;
                if (this.end.distanceTo(pt) < minDist && this.orientationIsCorrect(this.end, pt, a)) {
                    len2 = currentLine.points.length;
                    for (j = 0; j < len2; j++)
                        this.addPointToEnd(currentLine.points[j]);
                    currentLine.actif = false;
                    currentLine.points = null;
                    currentLine.start = currentLine.end = null;
                    working = true;
                    break;
                }
                pt = currentLine.end;
                if (this.end.distanceTo(pt) < minDist && this.orientationIsCorrect(this.end, pt, a)) {
                    len2 = currentLine.points.length - 1;
                    for (j = len2; j > -1; j--)
                        this.addPointToEnd(currentLine.points[j]);
                    currentLine.actif = false;
                    currentLine.points = null;
                    currentLine.start = currentLine.end = null;
                    working = true;
                    break;
                }
            }
        }
    }
}
//# sourceMappingURL=BorderLine.js.map