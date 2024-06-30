import { RegisterableObject } from "../utils/RegisterableObject";
import { ArcToCommand } from "./pathCommands/ArcToCommand";
import { BezierCurveToCommand } from "./pathCommands/BezierCurveToCommand";
import { PathCommands } from "./pathCommands/PathCommands";
import { LineToCommand } from "./pathCommands/LineToCommand";
import { MoveToCommand } from "./pathCommands/MoveToCommand";
import { QuadraticCurveToCommand } from "./pathCommands/QuadraticCurveToCommand";
import { Display2D } from "../display/Display2D";

export type PathCommand = ArcToCommand | BezierCurveToCommand | LineToCommand | MoveToCommand | QuadraticCurveToCommand;

export class InteractivePath extends RegisterableObject {

    protected commands: PathCommand[];
    protected pathDatas: number[];
    protected perimeter: number = 0;


    protected target
    public width: number;
    public height: number;
    public axis: { x: number, y: number };

    constructor(pathDatas?: number[], target?: Display2D) {
        super();
        if (!pathDatas && !target) {
            throw new Error("A dynamic path require a 'target' argument in order to normalize it on the fly")
        }

        this.axis = target.axis;
        this.width = target.width;
        this.height = target.height;
        this.commands = [];
        this.pathDatas = pathDatas ? pathDatas : [];

        if (pathDatas) this.createPathCommands(pathDatas);

    }

    public clone(clonePathDatas: boolean = true): InteractivePath {
        const datas = clonePathDatas ? [...this.pathDatas] : this.pathDatas;
        const path = new InteractivePath(datas);
        path.commands = [];
        for (let i = 0; i < this.commands.length; i++) {
            path.commands[i] = this.commands[i].clone();
        }
        return path;
    }

    public updatePerimeter(): void {
        this.perimeter = 0;
        this.commands.forEach((command: PathCommand) => {
            this.perimeter += command.getLength()
            //console.log("perimeter = ", command.getLength())
        })
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        const sx = 1 / this.width;
        const sy = 1 / this.height;
        const minScale = Math.min(sx, sy);
        this.commands.forEach((command: PathCommand) => command.draw(ctx, sx, sy, minScale));
        ctx.closePath();
    }

    public getPointAtTime(target: Display2D, timeInMilliSeconds: number, durationInMilliSeconds: number): { x: number, y: number } {
        timeInMilliSeconds %= durationInMilliSeconds;

        if (this.commands.length == 0) this.createPathCommands(this.pathDatas);
        else if (this.perimeter == 0) this.updatePerimeter();

        console.log(this.pathDatas)

        const timeDist = (timeInMilliSeconds / durationInMilliSeconds) * this.perimeter;

        let id: number = 0;
        let currentDist: number = 0, dist: number;



        while (currentDist < timeDist) {
            dist = this.commands[id++].getLength();
            currentDist += dist

        }
        if (id > 0) id--;
        currentDist -= dist;

        const pct = (timeDist - currentDist) / dist;
        const pt = this.commands[id % this.commands.length].getPointAtPercent(pct);

        pt.x = target.x - target.axis.x * target.width + pt.x * target.width;
        pt.y = target.y - target.axis.y * target.height + pt.y * target.height;
        //console.log(id, this.commands.length)
        return pt;
    }



    private createPathCommands(pathDatas: number[]) {
        let nbLoop = 0, id = 0;
        let nbCommand: number = 0;
        const commandLengths = PathCommands.lengthById;

        while (id < pathDatas.length && nbLoop++ < 99999) {

            const commandId: number = pathDatas[id++];

            if (commandId == PathCommands.ARC_TO) this.commands[nbCommand++] = new ArcToCommand(id, pathDatas);
            else if (commandId == PathCommands.BEZIER_CURVE_TO) this.commands[nbCommand++] = new BezierCurveToCommand(id, pathDatas);
            else if (commandId == PathCommands.LINE_TO) this.commands[nbCommand++] = new LineToCommand(id, pathDatas);
            else if (commandId == PathCommands.MOVE_TO) this.commands[nbCommand++] = new MoveToCommand(id, pathDatas);
            else if (commandId == PathCommands.QUADRATIC_CURVE_TO) this.commands[nbCommand++] = new QuadraticCurveToCommand(id, pathDatas);


            id += commandLengths[commandId];


        }
        this.updatePerimeter();
        if (nbLoop > 99999) {
            throw new Error("createGraphicCommand error");
        }

        this.pathPositionIndex = id;
    }

    private pathPositionIndex: number = 0;

    public moveTo(x: number, y: number): MoveToCommand {

        let id = this.pathPositionIndex;
        this.pathDatas[id] + PathCommands.MOVE_TO;
        this.pathDatas[id + 1] = x / (this.width * this.axis.x);
        this.pathDatas[id + 2] = y / (this.height * this.axis.y)
        this.pathPositionIndex += 3;
        const command: MoveToCommand = new MoveToCommand(id + 1, this.pathDatas);
        this.commands.push(command);
        return command;
    }

    public lineTo(x: number, y: number): LineToCommand {

        let id = this.pathPositionIndex;
        this.pathDatas[id] = PathCommands.LINE_TO;
        this.pathDatas[id + 1] = x / (this.width * this.axis.x);
        this.pathDatas[id + 2] = y / (this.height * this.axis.y);
        this.pathPositionIndex += 2;
        const command: LineToCommand = new LineToCommand(this.pathPositionIndex, this.pathDatas);
        this.commands.push(command);
        return command;
    }

    public arcTo(x0: number, y0: number, x1: number, y1: number, radius: number): ArcToCommand {

        let id = this.pathPositionIndex;
        this.pathDatas[id] = PathCommands.ARC_TO;
        this.pathDatas[id + 1] = x0 / (this.width * this.axis.x);
        this.pathDatas[id + 2] = y0 / (this.height * this.axis.y);
        this.pathDatas[id + 3] = x1 / (this.width * this.axis.x);
        this.pathDatas[id + 4] = y1 / (this.height * this.axis.y);
        this.pathDatas[id + 5] = radius;
        this.pathPositionIndex += 5;
        const command: ArcToCommand = new ArcToCommand(this.pathPositionIndex, this.pathDatas);
        this.commands.push(command);
        return command;
    }
    public bezierCurveTo(ax0: number, ay0: number, ax1: number, ay1: number, x1: number, y1: number): BezierCurveToCommand {

        let id = this.pathPositionIndex;
        this.pathDatas[id] = PathCommands.BEZIER_CURVE_TO;
        this.pathDatas[id + 1] = ax0 / (this.width * this.axis.x);
        this.pathDatas[id + 2] = ay0 / (this.height * this.axis.y);
        this.pathDatas[id + 3] = ax1 / (this.width * this.axis.x);
        this.pathDatas[id + 4] = ay1 / (this.height * this.axis.y);
        this.pathDatas[id + 5] = x1 / (this.width * this.axis.x);
        this.pathDatas[id + 6] = y1 / (this.height * this.axis.y);
        this.pathPositionIndex += 6;
        const command: BezierCurveToCommand = new BezierCurveToCommand(this.pathPositionIndex, this.pathDatas);
        this.commands.push(command);
        return command;
    }
    public quadraticCurveTo(ax: number, ay: number, x1: number, y1: number): QuadraticCurveToCommand {

        let id = this.pathPositionIndex;
        this.pathDatas[id] = PathCommands.QUADRATIC_CURVE_TO
        this.pathDatas[id + 1] = ax / (this.width * this.axis.x);
        this.pathDatas[id + 2] = ay / (this.height * this.axis.y);
        this.pathDatas[id + 3] = x1 / (this.width * this.axis.x);
        this.pathDatas[id + 4] = y1 / (this.height * this.axis.y);
        this.pathPositionIndex += 5;
        const command: QuadraticCurveToCommand = new QuadraticCurveToCommand(id + 1, this.pathDatas);

        this.commands.push(command);
        return command;
    }




}