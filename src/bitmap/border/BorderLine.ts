import { BorderPt } from "./BorderPt";

export class BorderLine {

	public start: BorderPt;
	public end: BorderPt;
	public points: BorderPt[];
	public dist: number = 9999999999;
	public sens: boolean;
	public actif: boolean;
	private color: string = "#ff0000";

	constructor(p0: BorderPt, p1: BorderPt) {
		this.actif = true;
		this.start = p0;
		this.end = p1;
		this.points = [p0, p1];
	}
	public addPointToStart(pt: BorderPt): void {
		this.start = pt;
		this.points.unshift(pt);
	}
	public addPointToEnd(pt: BorderPt): void {
		this.end = pt;
		this.points.push(pt);
	}
	public findNearestPoint(px: number, py: number): BorderPt {
		var i: number, len: number = this.points.length;
		var dx: number, dy: number;
		var pt: BorderPt;
		for (i = 0; i < len; i++) {
			pt = this.points[i];
			dx = pt.x - px;
			dy = pt.y - py;
			pt.dist = Math.sqrt(dx * dx + dy * dy);
		}
		var v: BorderPt[] = this.points.concat();
		v.sort((p0: BorderPt, p1: BorderPt): number => {
			if (p0.dist < p1.dist) return -1;
			else return 1
		});

		i = 0;
		while (v[i].isQuadPoint && i < v.length - 1) i++;

		v[i].isQuadPoint = true;
		return v[i];
	}

	public draw(ctx: CanvasRenderingContext2D, offsetX: number = 0, offsetY: number = 0): void {
		ctx.strokeStyle = this.color;
		ctx.moveTo(offsetX + this.points[0].x, offsetY + this.points[0].y);
		var i: number, len: number = this.points.length;
		for (i = 1; i < len; i++) ctx.lineTo(offsetX + this.points[i].x, offsetY + this.points[i].y);
		ctx.stroke();
	}

	public getDistanceFromPoint(px: number, py: number): number {
		var d: number = 1000000;
		var n: number;
		var points: BorderPt[] = this.points;
		var i: number, len: number = points.length;
		for (i = 1; i < len; i++) {
			n = this.distanceFromPointToLine(px, py, points[i - 1].x, points[i].x, points[i - 1].y, points[i].y);
			if (n < d) d = n;
		}
		this.dist = d;
		return this.dist;
	}
	private distanceFromPointToLine(x: number, y: number, x1: number, x2: number, y1: number, y2: number): number {

		var A: number = x - x1;
		var B: number = y - y1;
		var C: number = x2 - x1;
		var D: number = y2 - y1;

		var dot: number = A * C + B * D;
		var len_sq: number = C * C + D * D;
		var param: number = -1;
		if (len_sq != 0) {//in case of 0 length line
			param = dot / len_sq;
		}

		var xx: number, yy: number;
		if (param < 0) {
			xx = x1;
			yy = y1;
		} else if (param > 1) {
			xx = x2;
			yy = y2;
		} else {
			xx = x1 + param * C;
			yy = y1 + param * D;
		}

		var dx: number = x - xx;
		var dy: number = y - yy;
		return Math.sqrt(dx * dx + dy * dy);
	}

	private orientationIsCorrect(p0: BorderPt, p1: BorderPt, a: number): boolean {
		var angle: number = p0.angleTo(p1);

		var da: number = angle - a;
		if (da > Math.PI) angle -= Math.PI * 2;
		else if (da < -Math.PI) a -= Math.PI * 2;
		da = Math.abs(angle - a);

		a += Math.PI;
		var da2: number = angle - a;
		if (da2 > Math.PI) angle -= Math.PI * 2;
		else if (da2 < -Math.PI) a -= Math.PI * 2;
		da2 = Math.abs(angle - a);

		return (da < 0.1 || da2 < 0.1);
	}

	public lookForNearLines(lines: BorderLine[], a: number): void {

		if (a == 0 || a == Math.PI) this.color = "#ff0000";
		else this.color = "#00ff00";

		if (this.actif == false) return;

		var i: number, len: number;
		var working: boolean = true;
		var currentLine: BorderLine;
		var minDist: number = 10;
		var pt: BorderPt;
		//var angle: number
		var j: number, len2: number;

		while (working) {
			working = false;
			len = lines.length;
			for (i = 0; i < len; i++) {
				currentLine = lines[i];
				if (currentLine == this || currentLine.actif == false) continue;

				pt = currentLine.start;

				if (this.start.distanceTo(pt) < minDist && this.orientationIsCorrect(pt, this.start, a)) {

					len2 = currentLine.points.length;
					for (j = 0; j < len2; j++) this.addPointToStart(currentLine.points[j]);

					currentLine.actif = false;
					currentLine.points = null;
					currentLine.start = currentLine.end = null;
					working = true;
					break;
				}


				pt = currentLine.end;
				if (this.start.distanceTo(pt) < minDist && this.orientationIsCorrect(pt, this.start, a)) {

					len2 = currentLine.points.length - 1;
					for (j = len2; j > -1; j--) this.addPointToStart(currentLine.points[j]);

					currentLine.actif = false;
					currentLine.points = null;
					currentLine.start = currentLine.end = null;
					working = true;
					break;
				}

				pt = currentLine.start;
				if (this.end.distanceTo(pt) < minDist && this.orientationIsCorrect(this.end, pt, a)) {

					len2 = currentLine.points.length;
					for (j = 0; j < len2; j++) this.addPointToEnd(currentLine.points[j]);

					currentLine.actif = false;
					currentLine.points = null;
					currentLine.start = currentLine.end = null;
					working = true;
					break;
				}

				pt = currentLine.end;
				if (this.end.distanceTo(pt) < minDist && this.orientationIsCorrect(this.end, pt, a)) {

					len2 = currentLine.points.length - 1;
					for (j = len2; j > -1; j--) this.addPointToEnd(currentLine.points[j]);

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
